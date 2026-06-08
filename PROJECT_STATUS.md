# PROJECT_STATUS.md

更新时间：2026-06-04

本文档用于把当前项目真实状态同步给 ChatGPT 或后续维护者。本文档只做项目状态说明，不是法律意见，也不是正式产品合规文件。

## 1. 当前已有功能

项目名称：意大利驾照理论词汇学习工具。

技术栈：

- Python
- Streamlit
- pandas
- CSV
- JSON
- SQLite

当前功能：

- 中文界面，已加入轻量英文界面切换。
- 首页显示章节和学习进度。
- 章节学习：按章节查看词条。
- 单词卡片：显示意大利语、中文释义、例句、备注、图片。
- 闪卡模式：支持显示答案、认识、不熟、下一张。
- 闪卡范围：全部词、指定章节、未掌握优先、生词、错词、收藏。
- 生词本：用户可主动加入或移出生词。
- 收藏夹：用户可收藏重点词。
- 错词本：闪卡中点击“不熟”自动加入错词本；错词本可按章节筛选、移除词条、开始错词复习。
- 今日复习：基于 `review_level` 和 `next_review_date` 的简单智能复习。
- 搜索：支持搜索意大利语、中文、例句、备注、章节。
- 已掌握状态：用户可标记掌握或取消掌握。
- 账户系统：注册、登录、退出登录、保持登录、修改密码。
- 管理员角色：`user`、`admin`、`super_admin`。
- 管理员后台第一版：词库 CSV 上传、字段检查、预览、确认导入、旧词库备份。
- 管理员数据统计页：注册用户数、今日活跃、事件数、热门章节、搜索、闪卡、收藏、生词统计。
- 广告位系统第一版：`sidebar_bottom`、`home_top`、`flashcard_bottom`。
- 隐私政策和用户协议页面。
- 数据持久性测试工具：管理员可创建、查看、删除 persistence marker。
- 测试数据重置脚本：`tools/reset_test_data.py`。
- 词库 `word_id` 稳定 ID：当前使用 `WORD_000001` 形式。

## 2. 当前文件结构

主要文件和目录：

```text
app.py
db.py
i18n.py
words.csv
ads.json
requirements.txt
README.md
DEPLOYMENT.md
AGENTS.md
PROJECT_NOTES.md
PROJECT_STATUS.md
ROADMAP.md
SECURITY_AUDIT.md
DATABASE_CHANGELOG.md
DATABASE_MIGRATION_PLAN.md
IMAGE_SOURCE_AUDIT.md
WORDS_QUALITY_AUDIT.md
PERSISTENCE_TEST_GUIDE.md
.gitignore
.streamlit/config.toml
docs/
tools/
data/
github_upload_ready/
data_backup_*/
```

说明：

- `app.py`：Streamlit 主程序，包含页面、UI 样式、账户入口、学习交互、管理员后台、广告展示等。
- `db.py`：SQLite 基础层和数据读写函数。
- `i18n.py`：界面翻译字典，目前支持中文和英文。
- `words.csv`：公共词库。
- `ads.json`：广告位配置，目前是示例广告，默认 `active=false`。
- `docs/PRIVACY_POLICY.md`：隐私政策。
- `docs/TERMS_OF_SERVICE.md`：用户协议。
- `tools/ensure_word_ids.py`：补充稳定 `word_id` 的工具。
- `tools/import_sign_definitions.py`：交通标志/图形词条导入整理工具。
- `tools/reset_test_data.py`：清空本地测试用户数据的安全脚本。
- `data/`：运行数据，不应上传 GitHub。
- `data_backup_*/`：测试数据重置脚本生成的备份目录，不应上传 GitHub。
- `github_upload_ready/`：手动上传 GitHub 用的准备文件夹；可能滞后，上传前应重新整理。

## 3. 当前数据存储方式

当前数据存储混合使用 CSV、JSON、SQLite 和 Markdown：

- 词库：`words.csv`。
- 广告配置：`ads.json`。
- 法律文档：`docs/*.md`。
- 用户账户：SQLite `data/app.db` 的 `users` 表。
- 密码：SQLite 中保存 `salt` 和 `password_hash`，不保存明文密码。
- 学习状态：SQLite `user_word_status` 表。
- 闪卡统计：SQLite `flashcard_stats` 表。
- 行为事件：SQLite `app_events` 表。
- 数据持久性测试：SQLite `persistence_test` 表。
- remember token：当前仍使用旧兼容逻辑，保存在 `data/accounts.json` 中，保存 token hash，不保存 token 明文。
- 管理员操作日志：当前 app 里的 `log_admin_action()` 写入 `data/admin_logs.jsonl`；同时 SQLite 中已有 `admin_logs` 表，但当前主要后台日志仍走 JSONL。
- 旧 JSON 学习状态：仍保留兼容迁移逻辑，发现旧 `data/users/*.json` 时可迁移到 SQLite。

重要部署限制：

- `data/app.db` 在 Streamlit Community Cloud 本地文件系统中不保证长期持久。
- 当前适合测试、小规模演示和产品验证。
- 若真实用户增加，应迁移到 Supabase/PostgreSQL 等外部数据库。

## 4. 当前数据库表

数据库路径：

```text
data/app.db
```

当前 `db.py` 中创建的表：

```text
users
remember_tokens
user_word_status
flashcard_stats
admin_logs
app_events
persistence_test
```

表说明：

- `users`：用户账户、用户名、salt、password_hash、role、创建/更新时间、最近登录、是否启用。
- `remember_tokens`：预留表，目前表存在，但当前 remember token 业务仍主要使用 `data/accounts.json`。
- `user_word_status`：每个用户每个 `word_id` 的收藏、生词、掌握、错词、复习等级、下次复习日期、上次复习时间。
- `flashcard_stats`：每个用户每个 `word_id` 的 seen、known、unknown、last_seen。
- `admin_logs`：预留/基础管理员日志表。
- `app_events`：用户行为事件，例如打开应用、注册、登录、章节浏览、搜索、闪卡、收藏、生词、广告浏览/点击、修改密码等。
- `persistence_test`：用于测试 SQLite 文件在本地或 Streamlit Cloud 重启/重新部署后是否保留。

## 5. 当前 words.csv 字段

当前总词条数：`484`。

当前字段顺序：

```text
chapter
italian
chinese
pronunciation
example_it
example_zh
note
image
source_name
source_url
license_note
copyright_status
word_id
```

字段说明：

- `chapter`：章节或分类。
- `italian`：意大利语词汇、短语、标志名称或图形名称。
- `chinese`：中文释义。
- `pronunciation`：辅助读音，可为空。
- `example_it`：意大利语例句，可为空。
- `example_zh`：中文例句或说明，可为空。
- `note`：备注，可记录图形编号、来源、易错点、人工校对标记。
- `image`：图片链接，可为空。
- `source_name`：图片来源名称，例如 `rmastri.it`。
- `source_url`：图片原始链接。
- `license_note`：版权/授权备注。
- `copyright_status`：版权状态标记，例如 `unverified_external_link`、`no_image`。
- `word_id`：稳定词条 ID，例如 `WORD_000001`。

当前 `word_id` 状态：

- `word_id` 空值：0。
- `word_id` 重复：0。
- 已有 ID 不会被 `tools/ensure_word_ids.py` 重新生成，只会给缺失行补充。

词库质量状态：

- 最近累计修复了 217 条明显中意混杂词条。
- `WORDS_QUALITY_AUDIT.md` 当前显示仍有 0 条规则判定可疑词条。
- `note` 中标记“需人工校对”的词条数量：11。

## 6. 当前账户系统

已有能力：

- 用户注册。
- 用户登录。
- 退出登录。
- 保持登录。
- 登录用户修改自己的密码。
- 注册时需要勾选“我已阅读并同意《用户协议》和《隐私政策》”。
- 用户名会标准化为小写并去除首尾空格。
- 注册时会检查用户名重复。
- 密码使用 PBKDF2-HMAC-SHA256 加盐哈希保存。
- 修改密码时要求当前密码正确、新密码至少 8 位、两次新密码一致、新密码不能与旧密码相同。
- 修改密码成功后会清除该用户所有 remember token，并提示重新登录。

当前限制：

- 注册密码最低长度仍是 6 位；修改密码要求新密码最低 8 位。
- 没有邮箱找回密码。
- 没有管理员重置密码功能。
- 没有登录失败次数限制、账号锁定、验证码或 IP 限流。
- remember token 当前放在 URL query parameter 中，有泄露风险。
- remember token 当前没有正式过期时间。

## 7. 当前管理员后台

管理员角色：

```text
user
admin
super_admin
```

管理员创建方式：

- 不开放注册管理员。
- 可通过数据手动设置角色。
- 如果环境变量或 Streamlit secrets 设置 `ADMIN_USERNAME`，对应用户登录后会自动成为 `super_admin`。

已有后台能力：

- 只有 `admin` 或 `super_admin` 可见管理员入口。
- 后台函数内部调用 `require_admin()`，不是只靠隐藏按钮。
- 上传 CSV。
- 检查字段完整性。
- 检查 `chapter + italian` 明显重复。
- 显示前 20 行预览。
- 显示总词条数、章节数、缺失字段数、重复数、图片空值/外链/本地路径数量。
- 点击“确认导入词库”后才会替换正式 `words.csv`。
- 替换前自动备份旧词库到 `data/backups/words_YYYYMMDD_HHMMSS.csv`。
- 导入成功后清除词库缓存并重新加载。
- 管理员操作写入 `data/admin_logs.jsonl`。
- 管理员后台有“数据持久性测试”区域。

当前限制：

- 还没有复杂词条编辑器。
- 还没有词条逐条审核工作流。
- 还没有把词库迁移到数据库表。
- 管理员日志当前主要写 JSONL，尚未统一进入 SQLite `admin_logs` 表。

## 8. 当前广告系统

配置文件：

```text
ads.json
```

当前支持广告位：

```text
sidebar_bottom
home_top
flashcard_bottom
```

广告字段：

```text
id
slot
title
description
image
link
category
active
start_date
end_date
```

当前状态：

- `ads.json` 中有三个示例广告。
- 示例广告默认 `active=false`，因此不会展示。
- 广告只在 `active=true` 且日期范围有效时显示。
- 无广告时不显示空白区域。
- 广告浏览记录 `ad_view`。
- 广告点击记录 `ad_click`。
- 当前不接第三方广告平台。
- 当前没有支付系统。
- 当前没有复杂广告后台。

## 9. 当前统计系统

统计表：

```text
app_events
```

已记录或计划记录的事件包括：

- `app_open`
- `user_register`
- `user_login`
- `password_changed`
- `chapter_view`
- `word_search`
- `flashcard_start`
- `flashcard_known`
- `flashcard_unknown`
- `favorite_add`
- `favorite_remove`
- `unknown_add`
- `unknown_remove`
- `review_known`
- `review_unknown`
- `ad_view`
- `ad_click`
- `user_state_json_migrated`

管理员统计页显示：

- 总注册用户数。
- 今日活跃用户数。
- 总事件数。
- 热门章节 Top 10。
- 搜索次数。
- 闪卡使用次数。
- 收藏次数。
- 生词次数。

隐私限制：

- 不记录明文密码。
- 不记录 remember token 明文。
- `detail` 字段只记录必要信息，例如章节名、搜索关键词长度、结果数量、`word_id`、广告位等。

## 10. 当前多语言系统

文件：

```text
i18n.py
```

当前支持：

- `zh`：中文。
- `en`：英文。

实现方式：

- `translations` 字典。
- `st.session_state["language"]` 保存当前选择。
- 侧栏有语言选择。
- 如果英文缺少某个 key，会回退到中文或 key。

限制：

- 只翻译界面文本。
- 不翻译 `words.csv` 的 `chinese` 字段。
- 没有自动翻译 API。
- 词库本身还不是多语言词库结构。

## 11. 当前错词本和智能复习

错词本：

- 闪卡中点击“不熟”会自动加入错词本。
- 错词本与生词本区分：
  - 生词本：用户主动添加。
  - 错词本：练习中答错或不熟自动加入。
- 错词本使用 SQLite `user_word_status.is_wrong` 保存。
- 每个用户独立。
- 可按章节筛选。
- 可移出错词本。
- 可开始错词复习。

智能复习：

- 新加入错词本或生词本的词，`next_review_date = 明天`。
- 今日复习页只显示 `next_review_date <= 今天` 的词。
- 点击“认识”：
  - `review_level + 1`
  - level 1：1 天后复习
  - level 2：3 天后复习
  - level 3：7 天后复习
  - level 4：15 天后复习
  - level 5+：30 天后复习
- 点击“不熟”：
  - `review_level = 0`
  - `next_review_date = 明天`
- 复习字段保存在 SQLite `user_word_status`：
  - `review_level`
  - `next_review_date`
  - `last_reviewed_at`

## 12. 当前隐私政策和用户协议

文件：

```text
docs/PRIVACY_POLICY.md
docs/TERMS_OF_SERVICE.md
```

页面入口：

- 未登录侧栏有“隐私政策”“用户协议”入口。
- 登录后学习导航中也有“隐私政策”“用户协议”页面。
- 未登录打开文档后有“返回登录/首页”按钮。

注册流程：

- 创建账户时必须勾选“我已阅读并同意《用户协议》和《隐私政策》”。
- 未勾选不能注册。

当前说明：

- 文档是基础产品说明，不代表正式法律意见。
- 面向商业化前，仍建议找专业人士审查隐私政策、用户协议、广告说明和版权说明。

## 13. 当前图片来源和版权风险状态

根据 `IMAGE_SOURCE_AUDIT.md`：

- 总词条数：484。
- `image` 为空：50。
- `image` 为外部 URL：434。
- 本地或异常图片路径：0。
- 主要来源域名：`rmastri.it`，数量 434。

当前字段：

- `source_name`
- `source_url`
- `license_note`
- `copyright_status`

当前风险：

- 大部分图片是外链，不是本地复制。
- 434 条外链图片均为 `unverified_external_link`。
- 公开可访问不等于允许商业使用。
- 若来源站调整路径或限制外链，图片可能失效。
- 商业化前需要逐步替换为自制、授权或明确可商用的图片资源。

## 14. 当前已知 bug / 风险

当前已知问题和风险：

- Streamlit Community Cloud 本地 SQLite 文件不保证长期持久，真实用户增加后有数据丢失风险。
- remember token 仍在 URL query parameter 中，用户如果分享带 `remember` 参数的网址，可能泄露登录状态。
- remember token 仍使用 `data/accounts.json` 兼容层，没有迁移到 SQLite `remember_tokens` 表。
- 管理员日志当前主要写入 `data/admin_logs.jsonl`，尚未统一写入 SQLite `admin_logs` 表。
- 没有登录失败限制、账号锁定、验证码或防爆破机制。
- 没有邮箱找回密码。
- 没有删除账号自助功能。
- 没有正式支付、会员、退款、发票、订阅管理。
- 词库中文质量当前规则判定可疑词条数量为 0；仍需后续人工校对已标记词条。
- 图片版权状态未确认，商业化前风险较高。
- 当前 `github_upload_ready/` 可能落后于根目录最新文件，上传前需要重新整理。
- 本地存在 `data_backup_*/` 测试数据备份目录，不应上传 GitHub。
- 部分历史文档中仍可能保留旧描述，例如“智能复习尚未完成”或“学习状态仍是 JSON”；以本文档和当前代码为准。

最近已修复的问题：

- 登录用户修改密码功能已加入。
- 法律文档读取路径已改为基于 `app.py` 所在目录。
- sidebar 深色背景可读性已增强。
- 已移除 sidebar 底部面向开发者的内部调试信息，不再向普通用户显示 `words.csv`、当前账户字段、`data/users/*.json` 等本地路径信息。
- 已在 sidebar 底部新增作者声明和联系邮箱 `hanshuo12138@gmail.com`，未登录和已登录用户均可见。
- 登录后 sidebar 顶部账户区域已压缩，语言选择、已登录提示、修改密码和退出登录区域更紧凑。
- 登录后学习导航继续使用 `st.radio` 页面切换逻辑，但已美化为深色 SaaS 后台菜单风格，当前选中项使用亮蓝色高亮。
- 未登录登录/注册界面保持原布局不变。
- 已统一修复首页、章节学习、闪卡、今日复习、搜索、生词、错词、收藏等普通学习页面可能显示 HTML 源码残留的问题；HTML 卡片统一优先通过 `st.html()` 渲染。
- 已修复单词卡片右侧图片区域可能显示 `</div>` 等 HTML 残留文本的问题；本次未修改词库和数据库。
- 用户页面 HTML 标签被直接显示的问题已集中修复；本次未修改 `words.csv` 和数据库。
- 已累计修复 217 条明显中意混杂词条。

## 15. 当前未完成事项

高优先级：

- 继续对 `note` 中标记“需人工校对”的词条做人工确认；当前本轮目标规则剩余可疑数量为 0。
- 线上更新时确保上传 `docs/`、`app.py`、`words.csv`、`db.py`、`i18n.py` 等最新文件。
- 每次上传前重新整理 `github_upload_ready/`，避免上传旧版本。
- 做 Streamlit Cloud 数据持久性测试，确认重新部署后 `data/app.db` 是否保留。
- 商业化前确认图片版权，或替换为自制/授权图片。

中优先级：

- 将 remember token 迁移到 SQLite `remember_tokens` 表，并增加过期时间。
- 将管理员日志统一写入 SQLite `admin_logs` 表。
- 增加登录失败次数限制或简单账号锁定。
- 增加账号删除/数据删除流程。
- 增加管理员词库编辑器或更安全的词库审核流程。
- 增加词库导入后的自动质量检测。

长期事项：

- 迁移到 Supabase/PostgreSQL。
- 添加正式域名和品牌页。
- 增加模拟考试。
- 增加会员/付费系统。
- 增加更完整的广告后台。
- 扩展多语言词库，而不仅仅是多语言界面。
- 做手机端专门优化。

## 16. 下一步建议

建议按这个顺序继续：

1. 重点人工校对 `note` 中标记“需人工校对”的词条，结合交通标志图形和官方语境确认准确性。
2. 重新整理 `github_upload_ready/`，上传最新 `app.py`、`db.py`、`i18n.py`、`words.csv`、`docs/`、`tools/` 和文档。
3. 在线上测试：注册、登录、修改密码、章节学习、闪卡、错词本、今日复习、隐私政策、用户协议、管理员后台预览。
4. 做一次 Streamlit Cloud 重新部署后的 persistence marker 测试。
5. 如果测试数据仍无真实用户，可运行 `python tools/reset_test_data.py` 清空本地测试数据；运行前确认备份。
6. 若准备公开推广，应优先完成图片版权替换/授权确认。
7. 若开始有真实用户，应尽快迁移到 Supabase/PostgreSQL，避免 Streamlit Cloud 本地文件持久性风险。

## 17. GitHub 上传准备目录整理记录

更新时间：2026-06-04

本次已重新整理 `github_upload_ready/`，用于手动上传 GitHub。

已复制当前项目最新必要文件：

- `app.py`
- `db.py`
- `i18n.py`
- `words.csv`
- `ads.json`
- `requirements.txt`
- 主要项目文档
- `docs/`
- `tools/`
- `.streamlit/`
- `.gitignore`

已明确排除：

- `data/`
- `data_backup_*/`
- `__pycache__/`
- `.venv/`
- `.env`
- `app.db`
- `accounts.json`
- `admin_logs.jsonl`
- 用户账号、学习记录、remember token、统计事件等真实运行数据

整理结果记录在 `github_upload_ready/MANIFEST.md`。

## 2026-06-04 词库质量修复更新

- 本次只修改 `words.csv` 的 `chinese`、`example_zh`、`note` 三个字段。
- 已修复 128 条明显中意混杂、机器翻译残留或大写意大利语残留词条。
- 本轮目标规则复扫后，剩余可疑词条数量为 0。
- 当前标记“需人工校对”的词条数量为 66。
- 本次备份文件：`data/backups/words_mixed_language_fix_20260604_030037.csv`。
- 本次没有修改 `app.py`、`db.py`、账户系统、数据库、管理员后台、广告系统、统计系统或 sidebar UI。

## 2026-06-04 人工词库校正更新

- 本次根据人工校对映射表校正 34 条词条。
- 第 17 条已将 `italian` 中的 `trafoi` 修正为 `trafori`。
- 本次未修改 `app.py`、`db.py`、`i18n.py`、账户系统、数据库、UI、管理员后台、广告系统、统计系统或图片链接。
- 本次只修改了 `words.csv`、`WORDS_QUALITY_AUDIT.md`、`PROJECT_STATUS.md`。
- 备份文件：`data/backups/words_manual_translation_fix_20260604_215145.csv`。

## 2026-06-04 人工词库校正第二批

- 本次根据人工校对映射表处理 43 个目标，全部匹配成功，未匹配数量为 0。
- 本次实际发生内容变化的词条数量为 10。
- `trafoi` 已确认修正为 `trafori`。
- 图形 570 已单独改为“没有方向箭头的车道”，并将 `italian` 改为 `corsie di canalizzazione senza frecce direzionali`。
- 图形 574 已标记“图片可能与图形 572 重复，需人工校对”。
- 本次只修改了 `words.csv`、`WORDS_QUALITY_AUDIT.md`、`PROJECT_STATUS.md`，并新增词库备份文件。
- 备份文件：`data/backups/words_manual_translation_fix_20260604_223536.csv`。

## 2026-06-04 交通图形库拆分更新

- 已新增 `SIGN_COVERAGE_AUDIT.md`，用于审计当前 `words.csv` 与 rmastri/WEBpatente 图形编号覆盖差距。
- 审计结果显示：当前 `words.csv` 总词条数 484，`image` 非空 434，`rmastri.it` 图片 434，按图片 URL 估算唯一图形编号 432，覆盖率约 44.44%。
- 已新增独立文件 `signs.csv`，从 `words.csv` 复制/迁移出所有带图形编号或图片的交通图形词条。
- `signs.csv` 当前共有 434 行，唯一 `figure_id` 432 个。
- `signs.csv` 中 `review_status = imported_from_words` 为 349 行，`review_status = needs_review` 为 85 行。
- 本次没有删除或合并 `words.csv` 原内容，没有下载图片，也没有修改 `app.py`、`db.py`、`i18n.py`。
- 下一步建议先人工校对 `signs.csv` 中 `needs_review` 的 85 条，尤其是 note 图形编号与 image 文件编号不一致的记录。

## 2026-06-04 官方题库候选词库准备

- 已确认学习资源将拆成两个库建设：`words.csv` 未来用于题库词汇、词组、固定搭配；`signs.csv` 用于交通标志、图形、标线、信号灯、交警手势、辅助牌、通行顺序图。
- 已新增 `data_sources/` 目录，用于存放官方 Patente AB 题库/listato 的人工整理原始文件。
- 已新增 `data_sources/official_quiz_ab.csv` 模板，作为官方题库整理入口。
- 已新增 `data_sources/vocab_candidates.csv` 模板，用于保存从官方题库抽取出的候选词。
- 已新增 `fixed_phrases.csv` 模板，用于保存固定搭配候选。
- 已新增 `glossary.csv`，首批内置 21 个基础交通/驾考术语，后续用于统一中文译名。
- 已新增工具草稿 `tools/extract_vocab_candidates.py` 和 `tools/extract_fixed_phrases.py`，用于从 `official_quiz_ab.csv` 生成候选词和固定搭配。
- 已新增 `docs/VOCAB_EXTRACTION_WORKFLOW.md`，说明从官方题库到候选词、机器初译、人工校对、再决定是否合并进 `words.csv` 的工作流。
- 本次未修改 `app.py`、`db.py`、`i18n.py`，未改变现有页面和业务功能，未爬网站，未下载图片，未修改现有 `words.csv` 内容。

## 2026-06-05 官方题库候选词清洗优化

- 已优化 `tools/extract_vocab_candidates.py`，扩充意大利语停用词表，过滤冠词、介词、介词冠词合成、连词、代词、常见副词、助动词和高频泛用动词。
- 已增加候选词过滤规则：过滤长度小于 3 的词、纯数字、纯符号和明显停用词，同时保留 `veicolo`、`strada`、`precedenza`、`velocità`、`corsia`、`carreggiata`、`sorpasso`、`pericolo`、`sicurezza` 等考试核心词汇。
- 已重新生成 `data_sources/vocab_candidates.csv`。清洗前旧候选词数量为 5255 条，清洗后候选词数量为 4896 条。
- 已新增 `data_sources/VOCAB_CANDIDATES_AUDIT.md`，记录清洗前后数量、高频保留候选词、高频过滤词、低价值样例、建议加入 `glossary.csv` 的高频术语候选和乱码检查结果。
- 本次未修改 `app.py`、`db.py`、`i18n.py`、`words.csv`、`signs.csv`、`fixed_phrases.csv`、`glossary.csv`、`official_quiz_ab.csv`。

## 2026-06-05 官方题库候选词词形归并

- 已将 `tools/extract_vocab_candidates.py` 从单纯清洗升级为“候选词抽取 + 词形归并 + 分类标记”工具。
- 已重新生成 `data_sources/vocab_candidates.csv`，当前未归并候选词数量为 4923 条。
- 已新增 `data_sources/vocab_grouped_candidates.csv`，当前归并后 lemma 数量为 4846 条，词形归并减少重复 77 条。
- 当前分类数量：`core_vocab` 34 条，`exam_expression` 10 条，`grammar_signal` 12 条，`number_direction` 17 条，`needs_review` 4773 条。
- 题干表达和语法信号词已保留并分类，不再简单删除，例如 `dovere`、`potere`、`solo`、`anche`、`raffigurare`、`rappresentare`、`indicare`、`vietare`。
- 已更新 `data_sources/VOCAB_CANDIDATES_AUDIT.md`，记录高频 lemma、surface_forms 最多的 lemma、各分类 Top 列表和人工优先校对建议。
- 本次未修改 `app.py`、`db.py`、`i18n.py`、`words.csv`、`signs.csv`、`official_quiz_ab.csv`、`fixed_phrases.csv`、`glossary.csv`。

## 2026-06-05 官方题库候选词人工分类种子表

- 已新增 `data_sources/vocab_category_seed.csv`，作为人工可维护的候选词分类种子表。
- 种子表字段为 `lemma`、`category`、`preferred_chinese`、`pos`、`note`，当前共有 94 条种子词。
- 已更新 `tools/extract_vocab_candidates.py`，候选词分类现在优先读取 `vocab_category_seed.csv`；命中种子表时使用表内的 `category`、`preferred_chinese` 和 `pos`。
- 已重新生成 `data_sources/vocab_candidates.csv` 和 `data_sources/vocab_grouped_candidates.csv`。当前未归并候选词数量为 4927 条，归并后 lemma 数量为 4846 条，词形归并减少重复 81 条。
- 当前 seed 命中 lemma 数量为 90，未命中 lemma 数量为 4756。
- 当前分类数量：`core_vocab` 45 条，`exam_expression` 17 条，`grammar_signal` 14 条，`number_direction` 19 条，`needs_review` 4751 条。
- 已更新 `data_sources/VOCAB_CANDIDATES_AUDIT.md`，新增 seed 命中统计、各分类数量、各分类高频 Top 列表和高频 needs_review 列表。
- 本次未修改 `app.py`、`db.py`、`i18n.py`、`words.csv`、`signs.csv`、`official_quiz_ab.csv`、`fixed_phrases.csv`、`glossary.csv`。

## 2026-06-05 官方题库候选词人工排除表

- 已新增 `data_sources/vocab_exclude_seed.csv`，作为人工可维护的候选词排除表。
- 排除表字段为 `lemma`、`reason`、`note`，当前共有 24 条排除词。
- 已更新 `tools/extract_vocab_candidates.py`，候选词抽取现在支持人工排除词表；词形归并后如果 lemma 命中排除表，则不会输出到 `vocab_candidates.csv` 和 `vocab_grouped_candidates.csv`。
- 排除表只影响候选词输出，不修改 `fixed_phrases.csv`，因此 `dare` 可被排除，但 `dare precedenza` 等固定搭配仍保留在固定搭配候选库中。
- 本次命中排除 lemma 数量为 22 个，排除后 `vocab_grouped_candidates.csv` 剩余 4824 条。
- 已更新 `data_sources/VOCAB_CANDIDATES_AUDIT.md`，新增人工排除词表总数、命中排除数量、被排除高频词 Top 100、排除后保留 lemma Top 100。
- 本次未修改 `app.py`、`db.py`、`i18n.py`、`words.csv`、`signs.csv`、`official_quiz_ab.csv`、`fixed_phrases.csv`、`glossary.csv`。

## 2026-06-05 官方题库候选词第二批人工排除

- 已向 `data_sources/vocab_exclude_seed.csv` 追加第二批 7 个排除 lemma：`non`、`più`、`prima`、`durante`、`dopo`、`posto`、`presenza`。
- 排除表当前共有 31 条。
- 已重新运行 `tools/extract_vocab_candidates.py`，重新生成 `data_sources/vocab_candidates.csv`、`data_sources/vocab_grouped_candidates.csv` 和 `data_sources/VOCAB_CANDIDATES_AUDIT.md`。
- 当前命中排除 lemma 数量为 29 个，排除后 `vocab_grouped_candidates.csv` 剩余 4817 条。
- 本次保留了 `figura`、`raffigurare`、`indicare`、`rappresentare`、`preannunciare`、`consentire`、`vietare`、`consentito`、`vietato`、`obbligatorio`、`possibile` 等题干表达和重要判定词。
- 本次未修改 `tools/extract_vocab_candidates.py` 的逻辑，也未修改 `app.py`、`db.py`、`i18n.py`、`words.csv`、`signs.csv`、`official_quiz_ab.csv`、`fixed_phrases.csv`、`glossary.csv`。

## 2026-06-05 官方题库候选词人工审核队列

- 已新增 `data_sources/vocab_review_queue.csv`，用于批量人工审核候选 lemma。
- 审核队列从当前候选词中选取高频前 500 个 lemma，字段包括 `lemma`、`frequency`、`surface_forms`、`category`、`pos_guess`、`example_it`、`suggested_decision`、`decision`、`preferred_chinese`、`note`。
- 已更新 `tools/extract_vocab_candidates.py`，候选词筛选现在支持读取 `vocab_review_queue.csv` 中的人工 `decision`。
- 当前支持的人工 decision：`keep` 保留并标记为 keep；`exclude` 从候选库排除；`phrase` 保留并标记为 `phrase_candidate`；`review` 保留并标记为 `needs_review`；空值则继续使用原有种子表/排除表/自动建议逻辑。
- 重新生成审核队列时，脚本会保留已经人工填写过的 `decision`、`preferred_chinese` 和 `note`，只补充新增 lemma。
- 当前审核队列共有 500 行，`suggested_decision` 统计为：`keep` 31、`phrase` 4、`review` 465、`exclude` 0；当前人工 `decision` 为空 500 行。
- 排除表和审核队列应用后，`data_sources/vocab_grouped_candidates.csv` 当前剩余 4817 条。
- 后续不再需要一批批修改代码或排除词表，可以直接编辑 `data_sources/vocab_review_queue.csv` 的 `decision` 列。
- 本次未修改 `app.py`、`db.py`、`i18n.py`、`words.csv`、`signs.csv`、`official_quiz_ab.csv`、`fixed_phrases.csv`、`glossary.csv`。

## 2026-06-05 独立词汇审核工具

- 已新增独立本地 Streamlit 工具 `tools/vocab_review_app.py`。
- 启动方式为 `python -m streamlit run tools/vocab_review_app.py`，不接入正式 `app.py`，只用于本地候选词审核。
- 工具读取 `data_sources/vocab_review_queue.csv`，支持按审核状态、自动建议和最低频率筛选，并支持按频率或 lemma 排序。
- 工具支持通过中文按钮设置审核结果：保留、排除、短语、待定；写回时自动转换为 `keep`、`exclude`、`phrase`、`review`。
- 工具支持编辑 `preferred_chinese` 和 `note`，保存前会把旧 `vocab_review_queue.csv` 备份到 `data/backups/`。
- 工具支持点击“生成 selected candidates”，输出 `data_sources/vocab_selected_candidates.csv`，只包含 decision 为 `keep` 或 `phrase` 的候选词。
- 已完成基础启动检查：`streamlit_status=200`。
- 本次未修改 `app.py`、`db.py`、`i18n.py`、`words.csv`、`signs.csv`、`official_quiz_ab.csv`、`fixed_phrases.csv`、`glossary.csv`。

## 2026-06-05 官方题库候选词人工词形归并表

- 已新增 `data_sources/vocab_lemma_override.csv`，用于人工维护 surface form 到 lemma 的归并规则。
- 已更新 `tools/extract_vocab_candidates.py`，候选词抽取现在支持人工词形归并表。
- 当前归并优先级为：`vocab_lemma_override.csv` 人工规则 > 保守自动规则 > 原始词形。
- 本次 `vocab_lemma_override.csv` 共有 69 条规则，命中 65 个唯一 surface form。
- 保守自动规则本次归并 299 个唯一 surface form。
- 归并前唯一词形数量为 4927，基础归并后 lemma 数量为 4570，减少重复 357 个。
- 叠加人工排除表和审核队列 decision 后，`data_sources/vocab_grouped_candidates.csv` 当前输出 4521 条。
- 已重新生成 `data_sources/vocab_candidates.csv`、`data_sources/vocab_grouped_candidates.csv`、`data_sources/vocab_review_queue.csv`、`data_sources/vocab_selected_candidates.csv` 和 `data_sources/VOCAB_CANDIDATES_AUDIT.md`。
- 本次未修改 `app.py`、`db.py`、`i18n.py`、`words.csv`、`signs.csv`、`official_quiz_ab.csv`、`fixed_phrases.csv`、`glossary.csv`。

## 2026-06-06 GitHub 上传文件夹整理

- 已重新整理 `github_upload_ready/`，用于上传当前项目最新可发布版本。
- 本次上传文件夹包含主应用代码、词库、交通图形库、文档、工具脚本、`docs/`、`.streamlit/` 和 `data_sources/` 中的候选词 CSV/审计报告。
- 本次上传文件夹明确排除 `data/`、`data_backup_*/`、`__pycache__/`、`.venv/`、`.env`、`app.db`、`accounts.json`、`admin_logs.jsonl`、真实用户数据和运行日志。
- `data_sources/official_quiz_ab.pdf` 未放入上传文件夹，只保留解析后的 `official_quiz_ab.csv` 和相关审计/候选词文件。
- 已在 `github_upload_ready/MANIFEST.md` 记录包含和排除清单。

## 2026-06-08 独立词汇审核工具全量浏览优化

- 已优化 `tools/vocab_review_app.py`，词汇审核工具现在从 `data_sources/vocab_grouped_candidates.csv` 读取全部候选 lemma，而不是只查看高频前 500 个。
- 工具启动时会合并已有 `data_sources/vocab_review_queue.csv`，保留已经人工填写过的 `decision`、`preferred_chinese` 和 `note`。
- 已新增排序选项：频率从高到低、频率从低到高、lemma 字母 A-Z、lemma 字母 Z-A。
- 已新增关键词/前缀筛选，支持搜索 `lemma`、`surface_forms`、`example_it`、`preferred_chinese` 和 `note`。
- 已新增 lemma 首字母筛选：全部、A-Z。
- 已新增每页显示数量控制：50、100、200、500，并支持页码切换，避免一次性渲染全部候选词导致页面卡顿。
- `surface_forms` 现在完整显示，方便检查阴阳性、单复数和动词变位是否已正确归并。
- 原有按钮审核功能、中文释义编辑、备注编辑、保存前备份、生成 `vocab_selected_candidates.csv` 的逻辑均已保留。
- 已完成启动检查：`streamlit_status=200`。
- 本次未修改 `app.py`、`db.py`、`i18n.py`、`words.csv`、`signs.csv`、`official_quiz_ab.csv`、`fixed_phrases.csv`、`glossary.csv`。

## 2026-06-08 管理员后台数据持久性状态提示

- 已在管理员后台“数据持久性测试”区域增加开发环境数据持久性状态提示。
- 当前页面会显示数据库路径、`data/app.db` 是否存在、本次应用启动前数据库是否已存在、数据库文件大小。
- 当前页面会显示 `users` 账号数量、`user_word_status` 学习记录数量、`remember_tokens` 数量。
- 如果 `data/app.db` 不存在，会显示“当前本地数据库不存在，账号和学习记录不可用”的明显警告。
- 如果应用启动前没有发现 `data/app.db`，但启动时自动创建了新的空数据库，会提示这通常表示当前运行目录没有原来的数据库文件，不是系统自动清空旧账号。
- 页面增加说明：`data/` 已被 `.gitignore` 排除，不会上传 GitHub；换项目目录、重新部署、重新拉代码时，账号和学习记录不会自动跟随。
- 本次只显示数量和路径，不显示密码哈希、salt、remember token 明文或其他敏感数据。
- 本次未修改数据库结构，未重置任何数据，未自动创建测试账号。
- 本次未修改 `words.csv`、`signs.csv`、`official_quiz_ab.csv` 或 `data_sources/*.csv`。

## 2026-06-08 Streamlit Cloud 词库 CSV 编码读取修复

- 已修复 Streamlit Cloud 读取 `words.csv` 时可能出现的 `UnicodeDecodeError`。
- `load_words()` 不再直接使用 `pd.read_csv(WORDS_PATH)`，改为使用 `read_csv_with_fallback()`。
- 当前 CSV 读取编码兜底顺序为：`utf-8-sig`、`utf-8`、`gb18030`、`gbk`、`latin1`。
- 如果所有编码都失败，页面会显示“词库文件读取失败，请检查 words.csv 编码。”，并显示最后一个异常的简短信息，不再直接崩溃。
- `latin1` 仅作为最后兜底；如果使用该编码读取成功，页面会提示后续建议统一转换为 UTF-8。
- 管理员上传 CSV 预览和词库行数统计也复用了同一读取函数，提升 GB18030/GBK CSV 兼容性。
- 本地检查显示当前 `words.csv` 使用 `gb18030` 可成功读取，共 484 条。
- 已通过 `python -m py_compile app.py`。
- 本次未修改 `words.csv`、`signs.csv`、`official_quiz_ab.csv`、`data_sources/*.csv`、`db.py` 或 `i18n.py`。

## 2026-06-08 Streamlit Cloud db 导入兼容修复

- 已排查 `app.py` 顶部 `from db import (...)` 与 `db.py` 实际导出名称。
- Streamlit Cloud 报错最可能缺失名称为 `get_database_persistence_status`：线上可能出现 `app.py` 已更新、`db.py` 仍为旧版本的不同步状态。
- 已将 `get_database_persistence_status` 从 `from db import (...)` 中移除，改为在 `app.py` 内提供只读兜底实现。
- 当前 `app.py` 从 `db.py` 导入的所有名称均已验证存在，无缺失项。
- 已通过 `python -m py_compile app.py db.py`。
- 已通过 `python -c "import db; import app; print('import ok')"`。
- 本次未修改 `words.csv`、`signs.csv`、`official_quiz_ab.csv`、`data_sources/*.csv`、`glossary.csv` 或 `fixed_phrases.csv`。

## 2026-06-08 GitHub 上传准备目录同步规则

- 已在 `AGENTS.md` 中新增长期规则：以后每次对本项目进行任何代码、文档、配置、数据模板、工具脚本修改后，都必须同步更新 `github_upload_ready/`。
- GitHub 上传准备目录固定为：`C:\Users\20767\Documents\Codex\2026-05-30\python-streamlit-1-2-3-4\github_upload_ready`。
- 同步时必须保持原项目目录结构，并同步需要上传 GitHub 的修改文件或新增文件，例如 `app.py`、`db.py`、`i18n.py`、`requirements.txt`、`README.md`、`PROJECT_STATUS.md`、`docs/`、`tools/`、`data_sources/`、`.streamlit/`、`ads.json`、`words.csv`、`signs.csv` 等。
- 同步时必须排除运行数据和敏感数据，包括 `data/`、`data_backup_*/`、`__pycache__/`、`.venv/`、`.env`、`app.db`、`accounts.json`、`admin_logs.jsonl`、用户账号数据、学习记录、remember token、统计数据。
- 如果不确定某个文件是否应该上传 GitHub，优先不同步，并在回复中说明。
- 以后每次完成任务后的回复里，都要额外列出：本次同步到 `github_upload_ready/` 的文件、本次没有同步的敏感/运行数据、`github_upload_ready/` 是否已经可以直接用于上传 GitHub。
- 本次按用户要求只修改 `AGENTS.md` 和 `PROJECT_STATUS.md`，未修改 `app.py`、`db.py`、`words.csv`、`signs.csv` 或 `data_sources/*.csv`。
