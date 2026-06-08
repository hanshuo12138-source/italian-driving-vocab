# GitHub Upload Manifest

整理时间：2026-06-08

## 已包含的主要文件

- `app.py`
- `db.py`
- `i18n.py`
- `words.csv`
- `signs.csv`
- `ads.json`
- `fixed_phrases.csv`
- `glossary.csv`
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
- `SIGN_COVERAGE_AUDIT.md`
- `PERSISTENCE_TEST_GUIDE.md`
- `.gitignore`

## 已包含的目录

- `.streamlit/`
- `docs/`
- `tools/`
- `data_sources/`

## 本次重点更新

- `app.py`
- `db.py`
- `PROJECT_STATUS.md`
- `docs/ACCOUNT_PERSISTENCE_AUDIT.md`

`app.py` 已包含 `words.csv` 编码兜底读取修复，支持 `utf-8-sig`、`utf-8`、`gb18030`、`gbk`、`latin1`。

管理员后台数据持久性测试区域已增加数据库路径、数据库是否存在、启动前是否存在、users 数量、学习记录数量、remember token 数量等只读提示。

## data_sources/ 当前包含

- `official_quiz_ab.csv`
- `OFFICIAL_QUIZ_AB_AUDIT.md`
- `README.md`
- `vocab_candidates.csv`
- `VOCAB_CANDIDATES_AUDIT.md`
- `vocab_category_seed.csv`
- `vocab_exclude_seed.csv`
- `vocab_grouped_candidates.csv`
- `vocab_lemma_override.csv`
- `vocab_review_queue.csv`
- `vocab_selected_candidates.csv`

## 已明确排除

- `data/`
- `data_backup_*/`
- `__pycache__/`
- `.venv/`
- `.env`
- `app.db`
- `accounts.json`
- `admin_logs.jsonl`
- `data_sources/official_quiz_ab.pdf`
- 任何真实用户数据、remember token、统计事件、persistence marker、数据库运行文件

## 上传说明

请上传 `github_upload_ready/` 文件夹中的内容到 GitHub 仓库根目录。

不要上传项目根目录里的 `data/`、`data_backup_*/` 或 `data_sources/official_quiz_ab.pdf`。
