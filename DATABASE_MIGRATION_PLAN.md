# DATABASE_MIGRATION_PLAN.md

## 目标

将当前项目中的用户账户和学习状态，从本地 JSON 文件逐步迁移到 SQLite。

本方案只规划最小改造路线：

- 先迁移用户和学习状态。
- 暂时不把 `words.csv` 放进数据库。
- 暂时不做词库后台。
- 暂时不做 Supabase/PostgreSQL。
- 保留现有 UI 和普通用户体验。

## 当前可能存在的 JSON 数据

当前项目运行后，可能存在以下 JSON 或 JSONL 数据。

### 用户账户

位置：

```text
data/accounts.json
```

可能包含：

- 用户名
- salt
- 密码哈希
- 创建时间
- role
- remember token 哈希列表

### 密码哈希

位置：

```text
data/accounts.json
```

当前密码不是明文保存，而是：

- salt
- password_hash

### remember token

位置：

```text
data/accounts.json
```

当前 remember token 明文只出现在用户浏览器 URL 参数中，服务端保存：

- token_hash
- created_at

### 收藏

位置：

```text
data/users/*.json
```

字段：

```text
favorites
```

### 生词本

位置：

```text
data/users/*.json
```

字段：

```text
difficult
```

### 已掌握状态

位置：

```text
data/users/*.json
```

字段：

```text
learned
```

### 闪卡统计

位置：

```text
data/users/*.json
```

字段：

```text
stats
```

可能包含：

- seen
- known
- unknown
- last_seen

### admin_logs

位置：

```text
data/admin_logs.jsonl
```

当前每行是一条 JSON 记录，可能包含：

- username
- role
- action
- detail
- created_at

## 建议的 SQLite 表结构

建议数据库文件：

```text
data/app.db
```

注意：`data/` 仍然不上传 GitHub。

## 表 1：users

用途：保存用户账户。

建议字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | INTEGER PRIMARY KEY AUTOINCREMENT | 内部用户 ID |
| username | TEXT UNIQUE NOT NULL | 规范化后的用户名，小写、去空格 |
| salt | TEXT NOT NULL | 密码 salt |
| password_hash | TEXT NOT NULL | PBKDF2 密码哈希 |
| role | TEXT NOT NULL DEFAULT 'user' | 用户角色：`user`、`admin`、`super_admin` |
| created_at | TEXT NOT NULL | 创建时间 |
| updated_at | TEXT | 更新时间 |
| last_login_at | TEXT | 最近登录时间 |
| is_active | INTEGER NOT NULL DEFAULT 1 | 是否启用账户 |

约束建议：

```text
username UNIQUE
role CHECK(role IN ('user', 'admin', 'super_admin'))
```

## 表 2：remember_tokens

用途：保存保持登录 token 的哈希。

建议字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | INTEGER PRIMARY KEY AUTOINCREMENT | token 记录 ID |
| user_id | INTEGER NOT NULL | 对应 `users.id` |
| token_hash | TEXT NOT NULL | remember token 哈希 |
| created_at | TEXT NOT NULL | 创建时间 |
| expires_at | TEXT | 过期时间 |
| revoked_at | TEXT | 撤销时间 |
| user_agent | TEXT | 可选，浏览器信息 |

约束建议：

```text
FOREIGN KEY(user_id) REFERENCES users(id)
token_hash UNIQUE
```

说明：

- 不保存 remember token 明文。
- 后续认证时只比对哈希。
- 建议未来设置 30 天或 90 天过期。

## 表 3：user_word_status

用途：保存用户对每个词条的状态。

当前 JSON 中 `favorites`、`difficult`、`learned` 可以合并到这张表。

建议字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | INTEGER PRIMARY KEY AUTOINCREMENT | 记录 ID |
| user_id | INTEGER NOT NULL | 对应 `users.id` |
| word_id | TEXT NOT NULL | 当前代码生成的词条 ID |
| is_favorite | INTEGER NOT NULL DEFAULT 0 | 是否收藏 |
| is_difficult | INTEGER NOT NULL DEFAULT 0 | 是否在生词本 |
| is_learned | INTEGER NOT NULL DEFAULT 0 | 是否已掌握 |
| created_at | TEXT NOT NULL | 创建时间 |
| updated_at | TEXT | 更新时间 |

约束建议：

```text
FOREIGN KEY(user_id) REFERENCES users(id)
UNIQUE(user_id, word_id)
```

说明：

- `word_id` 暂时仍使用现有逻辑，例如 `chapter::italian`。
- 暂时不把 `words.csv` 迁入数据库。
- 后续如果词库进入数据库，可以再改成 `word_db_id`。

## 表 4：flashcard_stats

用途：保存闪卡练习统计。

建议字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | INTEGER PRIMARY KEY AUTOINCREMENT | 记录 ID |
| user_id | INTEGER NOT NULL | 对应 `users.id` |
| word_id | TEXT NOT NULL | 词条 ID |
| seen | INTEGER NOT NULL DEFAULT 0 | 看过次数 |
| known | INTEGER NOT NULL DEFAULT 0 | 标记认识次数 |
| unknown | INTEGER NOT NULL DEFAULT 0 | 标记不熟次数 |
| last_seen | TEXT | 最近练习时间 |
| updated_at | TEXT | 更新时间 |

约束建议：

```text
FOREIGN KEY(user_id) REFERENCES users(id)
UNIQUE(user_id, word_id)
```

说明：

- 对应当前 JSON 中的 `stats`。
- 未来智能复习可以基于这张表计算复习优先级。

## 表 5：admin_logs

用途：保存管理员操作日志。

建议字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | INTEGER PRIMARY KEY AUTOINCREMENT | 日志 ID |
| admin_user_id | INTEGER | 管理员用户 ID |
| admin_username | TEXT NOT NULL | 管理员用户名 |
| role | TEXT | 操作时角色 |
| action | TEXT NOT NULL | 操作类型 |
| detail | TEXT | 操作详情 |
| target_type | TEXT | 操作对象类型 |
| target_id | TEXT | 操作对象 ID |
| created_at | TEXT NOT NULL | 创建时间 |

说明：

- 对应当前 `data/admin_logs.jsonl`。
- 未来管理员上传词库、修改用户、修改广告位等都写入此表。

## 表 6：app_events 或 analytics_events

用途：保存应用行为统计和产品分析数据。

建议表名：

```text
analytics_events
```

建议字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | INTEGER PRIMARY KEY AUTOINCREMENT | 事件 ID |
| user_id | INTEGER | 用户 ID，可为空 |
| event_name | TEXT NOT NULL | 事件名称 |
| event_detail | TEXT | JSON 字符串或简单文本 |
| page | TEXT | 页面名称 |
| word_id | TEXT | 相关词条，可为空 |
| created_at | TEXT NOT NULL | 创建时间 |

可记录事件：

- user_login
- user_register
- flashcard_known
- flashcard_unknown
- word_favorite_add
- word_difficult_add
- search_word
- page_view

注意：

- 不要收集不必要的隐私数据。
- 商业化前需要隐私说明。

## 迁移策略

### 1. 首次启动时自动检测旧 JSON

应用启动时检查：

```text
data/app.db 是否存在
data/accounts.json 是否存在
data/users/*.json 是否存在
data/admin_logs.jsonl 是否存在
```

如果 SQLite 数据库不存在，但旧 JSON 存在，则执行迁移。

### 2. 迁移前备份 JSON

迁移前先创建备份目录：

```text
data/backups/json_before_sqlite_YYYYMMDD_HHMMSS/
```

备份内容：

```text
data/accounts.json
data/users/*.json
data/admin_logs.jsonl
```

原则：

- 不删除旧数据。
- 不覆盖旧备份。
- 如果备份失败，不继续迁移。

### 3. 迁移成功后不要立刻删除旧 JSON

迁移成功后：

- 保留旧 JSON。
- 写入迁移标记。
- 可以创建：

```text
data/migration_status.json
```

记录：

- migration_name
- migrated_at
- source_files
- target_db
- status

### 4. 旧用户数据必须兼容

兼容规则：

- 旧账户没有 `role` 字段，迁移为 `user`。
- 旧账户有 `role`，只接受 `user`、`admin`、`super_admin`。
- 非法 role 迁移为 `user`。
- 旧用户没有 remember token，允许为空。
- 旧用户状态文件缺字段时使用默认空值。
- 旧状态中的 `favorites`、`difficult`、`learned` 转为 `user_word_status`。
- 旧状态中的 `stats` 转为 `flashcard_stats`。

### 5. 避免重复迁移

迁移脚本应检查：

- 用户是否已存在。
- token_hash 是否已存在。
- user_id + word_id 是否已存在。
- admin log 是否已导入。

避免重复写入。

## 代码改造策略

### 1. 新建 `db.py`

所有数据库相关逻辑放到：

```text
db.py
```

`app.py` 不直接写 SQL。

### 2. `app.py` 只调用 `db.py`

例如：

```python
from db import (
    init_db,
    create_user,
    authenticate_user,
    save_remember_token,
    load_user_state,
    save_word_status,
    log_admin_action,
)
```

这样以后从 SQLite 迁移到 Supabase/PostgreSQL 时，主要改 `db.py`。

### 3. 先保持 `words.csv` 不进入数据库

短期继续：

```text
words.csv = 公共词库
SQLite = 用户、登录、学习状态、统计
```

好处：

- 改造小。
- 不影响当前词库格式。
- 不影响现有页面读取词库。

### 4. 先迁移用户和学习状态

优先迁移：

1. users
2. remember_tokens
3. user_word_status
4. flashcard_stats
5. admin_logs

暂不迁移：

- words.csv
- 图片资源
- 词库管理后台
- 广告系统

### 5. 词库后台以后再做

等用户数据稳定后，再设计：

- 管理员上传词库
- 词库版本
- 词条增删改
- CSV 导入导出

## 风险

### 1. Streamlit Community Cloud 本地 SQLite 的持久化问题

SQLite 文件如果放在 Streamlit Community Cloud 的本地文件系统中，仍然可能有持久化风险。

风险包括：

- 部署重启后文件状态不可控。
- 多实例情况下 SQLite 不适合共享。
- 用户数据增长后备份困难。
- 免费平台不适合长期保存商业用户数据。

结论：

- SQLite 是从 JSON 到正式数据库之间的过渡方案。
- 适合本地开发、测试版、小规模用户。
- 不应视为最终商业数据库方案。

### 2. 后续迁移 Supabase/PostgreSQL 的可能性

如果后续用户增长，应迁移到：

- Supabase
- PostgreSQL
- 其他云数据库

提前准备方式：

- 所有数据库操作集中在 `db.py`。
- 不在 `app.py` 中直接写 SQL。
- 表结构尽量接近关系型数据库规范。
- 使用稳定 `user_id`。
- 不依赖 SQLite 特有行为。

## 最小实施步骤

### 第一步：建表

创建 `db.py`。

实现：

- `get_connection()`
- `init_db()`
- 建立 `users`
- 建立 `remember_tokens`
- 建立 `user_word_status`
- 建立 `flashcard_stats`
- 建立 `admin_logs`
- 建立 `analytics_events`

先不改 `app.py` 使用逻辑。

### 第二步：迁移 users

实现 JSON 到 SQLite 的账户迁移：

- 读取 `data/accounts.json`
- 写入 `users`
- 写入 `remember_tokens`
- 兼容没有 `role` 的旧用户
- 保留 salt 和 password_hash
- 不修改密码

### 第三步：迁移学习状态

迁移：

- `data/users/*.json`
- favorites -> user_word_status.is_favorite
- difficult -> user_word_status.is_difficult
- learned -> user_word_status.is_learned
- stats -> flashcard_stats

注意：

- 需要通过文件名或未来映射找到对应用户。
- 如果当前 JSON 文件名只来自 username 哈希，迁移时要用现有 `state_path_for_user(username)` 规则反查匹配。

### 第四步：替换 `app.py` 读写逻辑

逐步替换：

- `load_accounts()`
- `save_accounts()`
- `create_account()`
- `authenticate()`
- `save_remember_token()`
- `revoke_remember_token()`
- `authenticate_remember_token()`
- `load_state()`
- `save_state()`
- `set_membership()`
- `mark_seen()`
- `log_admin_action()`

原则：

- 每次替换一小组函数。
- 替换后立刻测试。
- 不改变普通用户界面体验。

### 第五步：测试

测试清单：

1. 新用户注册。
2. 旧用户登录。
3. 密码错误登录失败。
4. remember token 登录。
5. 退出登录撤销 token。
6. 收藏词条。
7. 加入生词本。
8. 标记已掌握。
9. 闪卡认识/不熟统计。
10. 旧 JSON 迁移后数据是否保留。
11. 没有 role 的旧用户是否默认为 `user`。
12. `ADMIN_USERNAME` 用户是否为 `super_admin`。
13. `require_admin()` 是否能拦截普通用户。
14. `admin_logs` 是否能写入。

## 推荐顺序

建议不要一次性完成全部迁移。

推荐顺序：

1. 先写 `db.py` 和建表。
2. 再写只读迁移脚本。
3. 本地测试迁移结果。
4. 再让 `app.py` 使用 SQLite 读取账户。
5. 再迁移学习状态写入。
6. 最后保留 JSON 备份一段时间。

## 暂不做的事情

本阶段不做：

- 不修改 `words.csv` 格式。
- 不把词库放进数据库。
- 不做管理员后台。
- 不做词库上传。
- 不做广告系统。
- 不做支付系统。
- 不迁移到 Supabase/PostgreSQL。

## 总结

最小可行路线是：

```text
JSON 备份 -> SQLite 建表 -> 迁移账户 -> 迁移学习状态 -> app.py 调用 db.py -> 测试 -> 保留旧 JSON
```

这样可以在不大规模重构的前提下，提高数据结构清晰度，为后续管理员后台、用户统计、智能复习和商业化数据库迁移打基础。
