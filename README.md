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

## 本地数据

应用会自动创建：

- `data/accounts.json`：保存账户信息，密码以加盐哈希形式保存。
- `data/users/*.json`：按账户分别保存收藏、生词、掌握状态和闪卡练习统计。

## 互联网部署

参考 `DEPLOYMENT.md`。
