# 互联网版本上线说明

这个项目可以先用 Streamlit Community Cloud 上线。上线后，别人打开一个网页链接就能使用。

## 最推荐的第一版

- `words.csv` 作为公共词库，所有用户看到同一份词库。
- 每个用户在左侧输入自己的“学习编号”。
- 应用会按学习编号分开保存收藏、生词本和进度。

注意：Streamlit Community Cloud 的文件写入更适合演示和小规模使用。若要长期稳定保存很多用户的学习记录，后续建议接 Supabase、Google Sheets、PostgreSQL 或其他数据库。

## 需要准备的账号

1. GitHub 账号
2. Streamlit Community Cloud 账号

Streamlit Community Cloud 会从 GitHub 读取你的项目，所以项目需要先上传到 GitHub。

## 上传到 GitHub 时包含这些文件

```text
app.py
words.csv
requirements.txt
README.md
PROJECT_NOTES.md
DEPLOYMENT.md
.streamlit/config.toml
.gitignore
```

不要上传：

```text
data/
```

`data/` 是用户学习记录，不应该放到公开代码库里。

## Streamlit Cloud 部署时填写

- Repository：你的 GitHub 项目
- Branch：通常是 `main`
- Main file path：`app.py`

部署完成后，Streamlit 会生成一个类似这样的网页地址：

```text
https://你的项目名.streamlit.app
```

把这个地址发给别人，对方就能使用。

## 以后词库怎么更新

修改 `words.csv` 后，再上传到 GitHub。Streamlit Cloud 会重新部署，用户打开网页后就能看到新词库。

## 更正式的升级方向

如果用户变多，建议下一步做：

1. 用户账号登录。
2. 云数据库保存学习记录。
3. 管理员后台上传和编辑词库。
4. 词库版本管理。
5. 隐私说明和使用条款。
