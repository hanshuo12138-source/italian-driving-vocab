# SECURITY_AUDIT.md

## 审查范围

本次安全自查范围：

- 账户系统
- 登录状态
- 保持登录
- 用户数据保存方式
- 用户权限
- 未来管理员后台准备
- `.gitignore` 和上传包中的敏感文件风险

本次未修改：

- `words.csv`
- 用户数据

## 本次权限增强更新

本次已在现有账户系统上增加最小化管理员角色支持，没有开发完整管理后台。

新增内容：

- 账户数据结构支持 `role` 字段。
- 可选角色：

```text
user
admin
super_admin
```

- 新注册用户默认写入：

```text
role = "user"
```

- 旧用户如果没有 `role` 字段，默认视为：

```text
user
```

- 新增 `is_admin(username)`，用于判断用户是否为 `admin` 或 `super_admin`。
- 新增 `current_user_is_admin()`，用于判断当前登录用户是否为管理员。
- 新增 `require_admin()`，用于未来管理员页面或管理员操作前检查权限。非管理员会看到无权限提示，并停止操作。
- 新增 `log_admin_action(username, action, detail)`，用于写入管理员操作日志。
- 管理员日志写入：

```text
data/admin_logs.jsonl
```

- 新增 `ADMIN_USERNAME` 初始化逻辑：
  - 如果环境变量 `ADMIN_USERNAME` 设置了某个用户名；
  - 或 Streamlit secrets 中设置了 `ADMIN_USERNAME`；
  - 该账户登录或通过 remember token 恢复登录后，会自动拥有 `super_admin`。
- 没有开放“注册管理员”功能。
- 如果普通用户尝试注册与 `ADMIN_USERNAME` 相同的用户名，会被拒绝。
- 没有新增词库上传功能。
- 没有新增广告功能。
- 没有新增完整管理后台。

## 当前安全状态

当前项目处于轻量账户系统阶段，适合测试版、小规模分享和产品验证。

整体状态：

- 密码使用加盐哈希保存，没有在代码中发现明文密码保存逻辑。
- remember token 使用随机 token，并在账户文件中保存哈希值。
- `data/` 已被 `.gitignore` 排除。
- 当前已经有最小化角色字段和管理员权限检查函数。
- 当前没有管理员后台，也没有用户修改词库或系统配置的入口。
- 当前主要风险集中在 remember token 暴露、JSON 文件存储稳定性、缺少登录防爆破、管理员功能尚未接入正式后台。

## 已经做得好的地方

### 账户系统

- 密码通过 `hashlib.pbkdf2_hmac("sha256", ...)` 生成哈希。
- 每个账户使用 `secrets.token_hex(16)` 生成独立 salt。
- PBKDF2 迭代次数为 `120_000`，比普通 SHA256 明文哈希安全得多。
- 注册时会检查用户名是否已存在。
- 用户名会通过 `normalize_username()` 做小写和去空格处理，减少大小写重复注册问题。
- 密码输入框使用 `type="password"`，不会在页面上明文显示。
- 登录失败统一提示“用户名或密码不正确”，没有直接泄露用户是否存在。

### remember token

- token 使用 `secrets.token_urlsafe(32)` 生成，随机性足够用于轻量保持登录。
- 服务端保存的是 token 的 SHA256 哈希，不是 token 明文。
- 每个账户最多保留最近 5 个 remember token。
- 退出登录时会尝试撤销当前 URL 中的 remember token，并清空 query params。

### 数据文件

- `.gitignore` 已包含：

```text
data/
.streamlit/secrets.toml
*_remote.js
```

- 当前 `github_upload_ready/` 中未发现：

```text
data/
accounts.json
users/
secrets.toml
```

### 用户权限

- 当前没有管理员后台。
- 当前没有 `file_uploader` 词库上传入口。
- 当前没有在前端隐藏按钮但后端未校验的管理员功能。
- 当前用户只能修改自己的收藏、生词本、掌握状态等学习数据。
- 当前已经提供 `is_admin()` 和 `require_admin()`，未来管理员入口应先调用这些函数。
- `ADMIN_USERNAME` 不写死在代码中，只从环境变量或 Streamlit secrets 读取。

## 高风险问题

### 1. remember token 放在 URL query parameter 中

当前保持登录通过类似下面的 URL 参数实现：

```text
?user=用户名&remember=私密token
```

风险：

- 用户如果把带 `remember` 参数的网址发给别人，对方可能获得登录状态。
- URL 可能出现在浏览器历史记录中。
- URL 可能被截图、复制、收藏或转发。
- 某些外部服务可能记录完整 URL。

当前已有提示：

- 页面提示用户不要分享带 `remember` 参数的网址。

建议最小修改：

- 保持现状用于测试版。
- 正式版改用更安全的 cookie/session 方案。
- 后续迁移 SQLite 后，给 remember token 增加过期时间。

### 2. Streamlit Community Cloud + 本地 JSON 不适合长期保存正式用户数据

当前账户和学习状态保存在：

```text
data/accounts.json
data/users/*.json
```

风险：

- 免费部署环境不适合长期稳定保存用户数据。
- 重新部署、环境变化或实例重启可能导致数据不可控。
- JSON 文件并发写入能力弱。
- 用户增长后容易出现数据损坏或覆盖问题。

建议最小修改：

- 短期继续作为测试版。
- 下一阶段迁移到 SQLite。
- 再后续迁移到 Supabase/PostgreSQL。

## 中风险问题

### 1. 没有登录失败次数限制

当前登录失败后只显示统一错误提示，但没有：

- 失败次数限制。
- 暂时锁定。
- IP 或账户维度限流。
- 验证码。

风险：

- 弱密码账户可能被暴力尝试。

建议最小修改：

- 在 SQLite 阶段增加 `failed_login_count` 和 `locked_until`。
- 测试版可先限制密码最低长度，并提醒用户不要使用简单密码。

### 2. 弱密码限制较低

当前规则：

```text
密码至少 6 个字符
```

风险：

- 6 位密码仍然偏弱。
- 没有复杂度检查。

建议最小修改：

- 将正式版密码最低长度提高到 8 或 10。
- 不强制复杂符号，但至少提示使用更长密码。
- 避免在测试版频繁改动，以免影响已有用户。

### 3. remember token 没有过期时间

当前 token 保存了 `created_at`，但认证时没有检查过期。

风险：

- 只要 token 未被撤销，理论上可以长期有效。

建议最小修改：

- 在正式版中设置有效期，例如 30 天或 90 天。
- 登录时清理过期 token。

### 4. 管理员权限模型仍处于最小实现阶段

当前已经支持：

- 普通用户
- 管理员
- 超级管理员

但仍然缺少：

- 正式后台页面。
- 后台操作表单。
- 更细粒度权限。
- 数据库级权限控制。
- 管理员登录审计。

建议最小修改：

- 未来所有后台入口必须先调用 `require_admin()`。
- 未来所有管理员写操作必须调用 `log_admin_action()`。
- 迁移 SQLite 时保留 `role` 字段。

## 低风险问题

### 1. `state_path_for_user()` 使用用户名哈希生成用户数据文件名

当前使用用户名 SHA256 的前 16 位作为用户状态文件名。

优点：

- 文件名不会直接显示用户名。

限制：

- 不是正式用户 ID。
- 用户改名功能未来会比较麻烦。

建议：

- SQLite 迁移时使用稳定的 `user_id`。

### 2. 页面侧栏显示进度文件路径

当前侧栏会显示类似：

```text
进度文件：data/users/xxxx.json
```

风险：

- 对普通用户来说没有实际用途。
- 会暴露部分内部实现方式。

建议：

- 测试版可保留。
- 正式版隐藏该信息，仅开发环境显示。

### 3. 无法确认 Git 跟踪状态

当前环境中 `git` 命令不可用，因此本次无法确认是否已有敏感文件被 Git 跟踪。

已确认：

- `.gitignore` 包含 `data/`。
- `github_upload_ready/` 当前未发现敏感数据文件。

建议：

- 在安装 Git 的环境中运行：

```powershell
git status --short
git ls-files data
```

如果 `git ls-files data` 有输出，说明敏感数据可能已经被跟踪，需要单独处理。

## 用户权限检查

当前状态：

- 未发现管理员入口。
- 未发现 `/admin` 页面。
- 已有最小化管理员角色字段。
- 未发现词库上传入口。
- 未发现系统配置修改入口。
- 未发现隐藏按钮但缺少后端权限校验的问题。
- 已有 `require_admin()` 可供未来后台使用。

结论：

当前没有明显的管理员权限漏洞，因为管理员功能还没有实现。

未来风险：

- 一旦增加管理员后台，必须调用 `require_admin()`，不能只在侧栏隐藏按钮。

## 数据文件检查

当前 `.gitignore` 状态：

```text
data/
.streamlit/secrets.toml
```

符合当前项目原则。

当前本地 `data/` 中发现：

```text
data/user_state.json
```

该文件属于用户学习数据，不应上传 GitHub。

新增管理员日志文件位置：

```text
data/admin_logs.jsonl
```

该文件也属于敏感运行数据，不应上传 GitHub。

当前 `github_upload_ready/` 中未发现敏感数据文件。

## 管理后台准备

如果未来增加 `/admin` 或后台页面，必须做以下检查。

### 必须有的权限字段

建议账户系统至少支持：

```text
role = user | admin | super_admin
```

### 后台页面必须校验

所有后台页面入口都必须校验：

- 是否已登录。
- 当前账户是否存在。
- 当前账户角色是否为 `admin` 或 `super_admin`。
- 当前 session 是否有效。

不能只通过隐藏按钮来保护后台。

当前可用检查函数：

```text
is_admin(username)
current_user_is_admin()
require_admin()
```

### 必须写入 admin_logs 的操作

以下操作必须写入 `admin_logs`：

- 管理员登录后台。
- 上传词库。
- 修改词库。
- 删除词条。
- 批量导入词条。
- 修改用户角色。
- 禁用或启用用户。
- 重置用户密码。
- 修改系统配置。
- 修改广告位。
- 导出用户数据。
- 删除用户数据。

建议 `admin_logs` 字段：

```text
id
admin_user_id
action
target_type
target_id
details
ip_or_session
created_at
```

## 建议的最小修改方案

短期测试版：

1. 保持现有账户系统，不做大规模重构。
2. 保持 `.gitignore` 中的 `data/`。
3. 不上传 `data/` 到 GitHub。
4. 继续提示用户不要分享带 `remember` 参数的网址。
5. 管理员页面或操作必须先调用 `require_admin()`。
6. 管理员写操作必须调用 `log_admin_action()`。

下一步小改：

1. 给 remember token 增加过期时间。
2. 提高密码最低长度到 8 位。
3. 正式版隐藏侧栏中的进度文件路径。
4. 增加简单登录失败次数限制。
5. 在 Streamlit Cloud secrets 中配置 `ADMIN_USERNAME`，不要写进代码。

中期：

1. 迁移账户和学习状态到 SQLite。
2. 将当前 `role` 字段迁移到 `users.role`。
3. 将 `data/admin_logs.jsonl` 迁移到 `admin_logs` 表。
4. 先做管理员权限检查，再做管理员后台上传词库。

长期：

1. 迁移到 Supabase/PostgreSQL。
2. 使用正式 session/cookie 登录机制。
3. 加入隐私政策、服务条款和数据删除机制。
4. 为商业化准备更完整的安全和合规流程。
