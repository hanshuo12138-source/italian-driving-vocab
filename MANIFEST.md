# GitHub Upload Ready Manifest

Last updated: 2026-06-08

This folder is a clean upload-ready copy of the current project. It keeps the project structure needed for GitHub / Streamlit Cloud deployment while excluding local runtime data and sensitive files.

## Included Main Files

- `.gitignore`
- `.streamlit/config.toml`
- `ads.json`
- `AGENTS.md`
- `app.py`
- `db.py`
- `i18n.py`
- `requirements.txt`
- `README.md`
- `DEPLOYMENT.md`
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
- `words.csv`
- `signs.csv`
- `glossary.csv`
- `fixed_phrases.csv`

## Included Directories

- `docs/`
- `tools/`
- `data_sources/`
- `.streamlit/`

## Included Data Source Files

- `data_sources/README.md`
- `data_sources/official_quiz_ab.csv`
- `data_sources/OFFICIAL_QUIZ_AB_AUDIT.md`
- `data_sources/vocab_candidates.csv`
- `data_sources/VOCAB_CANDIDATES_AUDIT.md`
- `data_sources/vocab_category_seed.csv`
- `data_sources/vocab_exclude_seed.csv`
- `data_sources/vocab_grouped_candidates.csv`
- `data_sources/vocab_lemma_override.csv`
- `data_sources/vocab_review_queue.csv`
- `data_sources/vocab_selected_candidates.csv`

## Excluded Runtime / Sensitive Data

The following must not be uploaded to GitHub and were intentionally excluded or removed if found:

- `data/`
- `data_backup_*/`
- `__pycache__/`
- `.venv/`
- `.env`
- `app.db`
- `accounts.json`
- `admin_logs.jsonl`
- user account data
- learning records
- remember tokens
- analytics/statistics runtime data

## Intentionally Not Included

- `data_sources/official_quiz_ab.pdf`: original source PDF, not needed for app deployment and kept out of the upload-ready folder.
- `*_remote.js`: source-extraction/helper files are not part of the current deployment upload set.

## Upload Status

`github_upload_ready/` is intended to be directly uploadable to GitHub as the current project version, as long as no local runtime data is manually added before upload.
