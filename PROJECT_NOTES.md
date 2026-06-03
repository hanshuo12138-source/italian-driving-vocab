# PROJECT_NOTES.md

## 项目概况

这是一个面向中文用户的意大利驾照理论词汇学习工具，使用 Python + Streamlit 开发，目前已经可以本地运行，也可以部署到 Streamlit Community Cloud 作为网页应用使用。

应用的核心目标是帮助在意大利准备考驾照理论考试的中文用户学习意大利语考试词汇、交通标志、图形含义和高频表达。

## 当前已有功能总结

- 中文界面，已增加轻量英文界面切换。
- 首页显示学习章节。
- 章节学习：按章节查看单词。
- 单词卡片：显示意大利语、中文释义、例句、备注。
- 支持交通标志/图形图片显示。
- 闪卡模式：可以显示答案，标记认识或不熟。
- 闪卡范围：全部章节、指定章节、未掌握优先、生词、错词、收藏。
- 生词本：用户可以加入或移出生词。
- 错词本：用户在闪卡中点击“不熟”会自动加入错词本；错词本可按章节筛选、移除词条、开始错词复习。
- 收藏夹：用户可以收藏重点词。
- 搜索功能：支持搜索意大利语、中文、例句、备注和章节。
- 掌握状态：用户可以标记已掌握或未掌握。
- 轻量账户系统：支持创建账户和登录。
- 密码保存方式：加盐哈希保存，不明文保存。
- 保持登录：通过 remember token 实现。
- 每个账户独立保存收藏、生词本、错词本和学习进度。
- UI 已做美化：深色侧栏、卡片式布局、进度条、闪卡视觉优化。
- 手机浏览器可访问，但仍需要继续做移动端细节优化。

## 当前文件结构总结

```text
app.py
主程序，包含 Streamlit 页面、账户系统、学习逻辑、状态保存、广告位和 UI 样式。

db.py
SQLite 基础层，保存账户、学习状态、错词本、闪卡统计和行为事件。

i18n.py
轻量界面翻译字典，当前支持中文和英文。

words.csv
公共词库文件，包含普通词汇、交通标志、图形含义和图片链接。

requirements.txt
Python 依赖列表。

README.md
基础运行说明。

DEPLOYMENT.md
部署说明。

PROJECT_NOTES.md
当前项目记录。

ROADMAP.md
后续路线图。

AGENTS.md
给后续维护者或 AI 助手看的项目原则。

.streamlit/config.toml
Streamlit 主题和运行配置。

.gitignore
Git 忽略规则，避免上传用户数据和临时文件。

tools/import_sign_definitions.py
辅助脚本，用于整理交通标志/图形词条。

data/
运行后自动生成，保存账户和用户学习数据。不要上传 GitHub。

github_upload_ready/
用于手动上传 GitHub 的干净文件夹。
```

## 当前已知限制

- 当前已使用 SQLite 保存账户和学习状态，但 Streamlit Community Cloud 的本地文件保存仍不适合长期稳定保存大量用户数据。
- 账户系统是轻量版，不是正式商业级用户系统。
- 保持登录通过 remember token 实现，用户不能分享带 `remember` 参数的网址。
- 目前没有 Supabase 或 PostgreSQL 云数据库。
- 已有管理员后台第一版，支持词库上传预览和确认导入，但还没有复杂编辑器。
- 已有最小管理员权限系统，但不是完整商业级权限系统。
- 目前没有支付系统。
- 已有错词本第一版；目前还没有智能复习或模拟考试。
- 交通标志和图形中文释义仍需要继续人工校对。
- 图片主要使用远程公开链接，后续需要做版权来源自查。
- 手机端可用，但部分 Streamlit 组件在手机上仍可能不够原生。

## 当前部署方式

当前部署流程：

1. 本地修改项目文件。
2. 将需要上传的文件同步到 `github_upload_ready/`。
3. 在 GitHub 页面使用 `Add file -> Upload files` 上传文件。
4. 点击 `Commit changes`。
5. Streamlit Community Cloud 自动重新部署。
6. 用户刷新网页后看到新版本。

当前不应上传：

```text
data/
__pycache__/
*_remote.js
.streamlit/secrets.toml
```

## 当前词库字段说明

`words.csv` 字段保持固定格式：

```text
chapter
italian
chinese
pronunciation
example_it
example_zh
note
image
```

字段含义：

- `chapter`：章节或分类。
- `italian`：意大利语词汇、短语、标志名称或图形名称。
- `chinese`：中文释义。
- `pronunciation`：辅助读音，可为空。
- `example_it`：意大利语例句，可为空。
- `example_zh`：中文例句，可为空。
- `note`：备注，可记录来源、编号、易错点等。
- `image`：图片链接，可为空。交通标志/图形词条可使用远程图片链接。

维护原则：

- 不要随意改字段名。
- 不要删除字段。
- 不要调换字段顺序，除非同步修改读取逻辑。
- 新增词条时尽量补全 `chapter`、`italian`、`chinese`。
- 图片版权来源不明确时，不要新增为本地复制文件。
