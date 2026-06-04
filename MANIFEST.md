# GitHub Upload Manifest

整理时间：2026-06-04

此文件夹是当前项目用于手动上传 GitHub 的准备版本。

## 已包含的主要文件

- `app.py`
- `db.py`
- `i18n.py`
- `words.csv`
- `ads.json`
- `requirements.txt`
- `README.md`
- `DEPLOYMENT.md`
- `AGENTS.md`
- `PROJECT_NOTES.md`
- `PROJECT_STATUS.md`
- `ROADMAP.md`
- `SECURITY_AUDIT.md`
- `DATABASE_CHANGELOG.md`
- `DATABASE_MIGRATION_PLAN.md`
- `IMAGE_SOURCE_AUDIT.md`
- `WORDS_QUALITY_AUDIT.md`
- `PERSISTENCE_TEST_GUIDE.md`
- `.gitignore`

## 已包含的目录

- `.streamlit/`
- `docs/`
- `tools/`

## 已排除的敏感或运行时数据

- `data/`
- `data_backup_*/`
- `__pycache__/`
- `.venv/`
- `.env`
- `app.db`
- `accounts.json`
- `admin_logs.jsonl`
- 任何真实用户数据、登录 token、密码哈希、学习记录、统计事件

## 说明

- 本次整理没有复制 `data/`，因此不会上传本地用户数据或数据库。
- 本次整理没有复制根目录中的 `*_remote.js` 临时来源文件，因为当前应用运行不依赖这些文件。
- 如后续新增正式必需文件，应在上传前重新整理此文件夹并更新本清单。
