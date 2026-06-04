# GitHub Upload Ready Manifest

更新时间：2026-06-04

本目录用于手动上传 GitHub，内容来自当前项目根目录的最新文件。

## 已包含

### 应用核心文件

- `app.py`
- `db.py`
- `i18n.py`
- `words.csv`
- `ads.json`
- `requirements.txt`
- `.gitignore`

### 文档文件

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

### 目录

- `docs/`
  - `PRIVACY_POLICY.md`
  - `TERMS_OF_SERVICE.md`
- `tools/`
  - `ensure_word_ids.py`
  - `import_sign_definitions.py`
  - `reset_test_data.py`
- `.streamlit/`
  - `config.toml`

## 已排除

以下目录和文件不应上传 GitHub，本次整理没有复制：

- `data/`
- `data_backup_*/`
- `__pycache__/`
- `.venv/`
- `.env`
- `data/app.db`
- `data/accounts.json`
- `data/admin_logs.jsonl`
- `*_remote.js` 抓取中间文件
- 任何真实用户账号、学习记录、remember token、统计事件或持久性测试数据

## 检查结果

- 未复制 `data/`。
- 未复制 `app.db`。
- 未复制 `accounts.json`。
- 未复制 `admin_logs.jsonl`。
- 未复制 `__pycache__/`。
- 未复制抓取中间文件 `*_remote.js`。
