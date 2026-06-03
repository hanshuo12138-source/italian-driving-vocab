# DATABASE_CHANGELOG.md

## 2026-06-03 SQLite 数据持久性测试工具

本次新增管理员可见的数据持久性检测功能，用于测试 `data/app.db` 在本地重启或 Streamlit Community Cloud 重新部署后是否仍然保留。

### 新增数据表

- `persistence_test`

字段：

- `id`
- `test_key`
- `test_value`
- `created_at`

### db.py 新增函数

- `create_persistence_marker(test_key, test_value)`
- `get_persistence_markers()`
- `delete_persistence_marker(id)`

### 管理员后台变更

- 新增“数据持久性测试”区域。
- 显示当前数据库文件路径。
- 显示数据库文件是否存在。
- 显示数据库文件大小。
- 显示当前服务器时间。
- 支持创建、查看、删除 persistence marker。

### 保持不变

- 不影响普通用户页面。
- 不修改登录系统。
- 不修改学习状态逻辑。
- 不自动删除任何数据库数据。

## 2026-06-03 学习状态迁移到 SQLite

本次迁移用户学习状态，不修改 UI，不修改 `words.csv`，不新增后台。

### 迁移内容

- 收藏迁移到 SQLite `user_word_status.is_favorite`。
- 生词本迁移到 SQLite `user_word_status.is_difficult`。
- 已掌握状态迁移到 SQLite `user_word_status.is_learned`。
- 闪卡统计迁移到 SQLite `flashcard_stats`。

### 兼容旧 JSON

- 用户登录并加载学习状态时，会按原来的用户名哈希路径查找旧 `data/users/*.json`。
- 如果发现旧学习状态 JSON，并且该用户 SQLite 中还没有学习状态，会先备份旧 JSON，再导入 SQLite。
- 迁移成功后不会删除旧 JSON。
- 如果 SQLite 中已经有该用户学习状态，则不会用旧 JSON 覆盖现有 SQLite 数据。

### app.py 变更

- 学习状态读取改为调用 `db.py` 的 `load_user_state()`。
- 学习状态保存改为调用 `db.py` 的 `save_user_state()`、`set_word_membership()` 和 `record_flashcard_result()`。
- 页面结构、按钮、文案和交互没有修改。

### 保持不变

- `words.csv` 没有修改。
- 账户登录 UI 没有修改。
- 收藏、生词、已掌握、闪卡按钮交互没有修改。
- 每个用户仍然只能读取自己的学习状态。

## 2026-06-03 用户账户迁移到 SQLite

本次只迁移账户系统，不迁移收藏、生词本、已掌握状态或闪卡统计。

### 迁移内容

- `db.py` 增加用户账户读写函数。
- `db.py` 增加旧 `data/accounts.json` 到 SQLite `users` 表的自动迁移逻辑。
- 当 SQLite `users` 表为空，并且旧 `data/accounts.json` 存在时，会先备份旧 JSON，再导入用户。
- 迁移后不会删除旧 `data/accounts.json`。
- 旧用户的 `salt`、`password_hash`、`created_at` 和 `role` 会写入 SQLite。
- 旧用户没有 `role` 时默认使用 `user`。
- 非法 `role` 会降级为 `user`。

### app.py 变更

- 注册新用户改为写入 SQLite `users` 表。
- 登录和密码哈希验证改为通过 `db.py` 使用 SQLite。
- 管理员角色读取和 `ADMIN_USERNAME` 自动升级改为更新 SQLite。

### 暂未迁移

- remember token 仍暂时保留旧 JSON 逻辑；新 SQLite 用户的 remember token 也继续写入旧 JSON，暂不进入数据库。
- 收藏、生词本、已掌握状态仍暂时保留旧 JSON 逻辑。
- 闪卡统计仍暂时保留旧 JSON 逻辑。
- UI 风格没有修改。

## 2026-06-03 SQLite 基础层

本次只新增 SQLite 基础层，不迁移用户数据，不替换现有 JSON 读写逻辑，不修改登录逻辑、学习状态逻辑或 UI。

### 新增文件

- `db.py`

### 数据库路径

- `data/app.db`

`data/` 已在 `.gitignore` 中，因此数据库文件不会上传到 GitHub。

### 新增函数

- `get_connection()`
- `init_db()`
- `create_tables()`
- `backup_file_if_exists(path)`
- `log_app_event(event_type, username=None, detail=None)`

### 新增数据表

- `users`
- `remember_tokens`
- `user_word_status`
- `flashcard_stats`
- `admin_logs`
- `app_events`

### app.py 变更

`app.py` 启动时只调用 `init_db()`，用于确保 `data/app.db` 和基础表结构可以创建成功。

现阶段 `app.py` 仍继续使用原有 JSON 文件保存账户、登录状态和学习数据。

### 未做事项

- 未迁移用户账户。
- 未迁移 remember token。
- 未迁移收藏、生词本、已掌握状态。
- 未迁移闪卡统计。
- 未替换任何现有业务读写逻辑。
- 未修改 `words.csv`。
- 未新增第三方依赖。
