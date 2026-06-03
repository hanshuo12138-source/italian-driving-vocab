# 意大利驾照理论词汇学习工具

Python + Streamlit 本地词汇学习应用，界面为中文，词库来自 `words.csv`。

## 运行

```powershell
pip install -r requirements.txt
streamlit run app.py
```

## 词库格式

`words.csv` 至少需要这些列：

- `chapter`：章节
- `italian`：意大利语词汇
- `chinese`：中文释义

可选列：

- `pronunciation`：辅助读音
- `example_it`：意大利语例句
- `example_zh`：中文例句
- `note`：备注
- `image`：图片链接，交通标志/图形词条会用它显示图片

当前词库已加入一批交通标志和图形词条，图片链接来自公开的 WEBpatente 图形资源。

## 本地数据

应用会自动创建：

- `data/accounts.json`：保存账户信息，密码以加盐哈希形式保存。
- `data/users/*.json`：按账户分别保存收藏、生词、掌握状态和闪卡练习统计。

登录时可以勾选“保持登录”。这个功能会生成一个私密登录令牌，请不要把带有 `remember` 参数的网址发给别人。

## 清空测试数据

如果当前还没有真实用户，可以运行下面的脚本清空本地测试账号、学习记录、统计事件、remember token 和持久性测试数据：

```powershell
python tools/reset_test_data.py
```

脚本会先列出将要删除的文件，并把 `data/` 完整备份到 `data_backup_YYYYMMDD_HHMMSS/`。只有输入 `YES` 才会继续删除。不要把 `data/` 或 `data_backup_*/` 上传到 GitHub。

## 互联网部署

参考 `DEPLOYMENT.md`。
