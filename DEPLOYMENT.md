# 互联网版本上线说明

这个项目可以先用 Streamlit Community Cloud 上线。上线后，别人打开一个网页链接就能使用。

## 最推荐的第一版

- `words.csv` 作为公共词库，所有用户看到同一份词库。
- 每个用户在左侧创建账户并登录。
- 应用会按账户分开保存收藏、生词本和进度。

注意：当前账户系统是轻量版，密码不会明文保存，并支持“保持登录”。保持登录会通过私密令牌识别用户，所以不要分享带有 `remember` 参数的网址。账户和学习记录仍然保存在应用的本地文件里。Streamlit Community Cloud 的文件写入更适合演示和小规模使用。若要长期稳定保存很多用户的学习记录，后续建议接 Supabase、Google Sheets、PostgreSQL 或其他数据库。

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

如果要保留词库整理脚本，也可以上传：

```text
tools/import_sign_definitions.py
```

不要上传：

```text
data/
```

`data/` 是用户学习记录，不应该放到公开代码库里。
其中也包含账户文件，所以更不能上传到公开仓库。

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

`words.csv` 支持 `image` 列。交通标志/图形词条可以放图片链接，应用会在单词卡和闪卡中显示对应图片。

## 更正式的升级方向

如果用户变多，建议下一步做：

1. 接入正式用户账号系统。
2. 云数据库保存学习记录。
3. 管理员后台上传和编辑词库。
4. 词库版本管理。
5. 隐私说明和使用条款。
