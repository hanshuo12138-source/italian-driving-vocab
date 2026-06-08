# AGENTS.md

## 项目名称

意大利驾照理论词汇学习工具

## 技术栈

- Python
- Streamlit
- pandas
- CSV
- JSON
- 目前计划逐步迁移到 SQLite

## 目标用户

当前目标用户是在意大利准备考驾照理论考试的中文用户。

未来可以扩展到多语言移民用户，例如中文、英文、西班牙语、阿拉伯语、法语等界面和词库。

## 项目原则

1. 每次只改一个功能。
2. 不要大规模重构。
3. 优先保留现有 UI 和功能。
4. 不要删除现有用户数据。
5. 不要把 `data/` 上传 GitHub。
6. 不要把密钥、token、密码写进代码。
7. 所有新功能要尽量兼容手机浏览器。
8. 词库字段保持固定格式。
9. 版权来源不明确的图片不得新增为本地复制。
10. 管理员功能必须检查权限，不能只靠隐藏按钮。

## 维护提醒

- 修改业务逻辑前，先确认是否会影响账户、收藏、生词本、学习进度。
- 修改词库前，先确认 `words.csv` 的字段顺序不变。
- 修改部署文件前，先确认 GitHub 和 Streamlit Cloud 的当前流程。
- 涉及用户数据、登录状态、管理员权限、付费功能时，要优先考虑安全和隐私。

## GitHub 上传准备目录同步规则

以后每次对本项目进行任何代码、文档、配置、数据模板、工具脚本修改后，都必须同步更新 GitHub 上传准备目录：

`C:\Users\20767\Documents\Codex\2026-05-30\python-streamlit-1-2-3-4\github_upload_ready`

同步要求：

1. 每次修改完成后，都要把需要上传 GitHub 的文件同步到 `github_upload_ready/`。
2. 必须保持原项目目录结构。
3. 如果修改了 `app.py`、`db.py`、`i18n.py`、`requirements.txt`、`README.md`、`PROJECT_STATUS.md`、`docs/`、`tools/`、`data_sources/`、`.streamlit/`、`ads.json`、`words.csv`、`signs.csv` 等需要上传的文件，都要同步对应文件。
4. 如果新增了文件，也要同步新增文件。
5. 不要同步运行数据和敏感数据，包括：`data/`、`data_backup_*/`、`__pycache__/`、`.venv/`、`.env`、`app.db`、`accounts.json`、`admin_logs.jsonl`、用户账号数据、学习记录、remember token、统计数据。
6. 如果不确定某个文件是否应该上传 GitHub，优先不要同步，并在回复中说明。
7. 每次完成任务后的回复里，都要额外列出：本次同步到 `github_upload_ready/` 的文件、本次没有同步的敏感/运行数据、`github_upload_ready/` 是否已经可以直接用于上传 GitHub。
