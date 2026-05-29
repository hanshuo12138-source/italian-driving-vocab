# 项目记录：意大利驾照理论词汇学习工具

## 项目位置

```text
C:\Users\20767\Documents\Codex\2026-05-30\python-streamlit-1-2-3-4
```

## 当前技术

- Python
- Streamlit
- pandas
- CSV 本地词库
- JSON 本地保存学习状态
- 已加入“学习编号”，方便互联网版本按用户分开保存进度

## 当前功能

- 首页显示章节
- 章节内显示单词
- 闪卡模式
- 生词本
- 搜索单词
- 收藏功能
- 数据来自 `words.csv`
- 学习进度、收藏、生词本保存在 `data/user_state.json`
- 现在学习进度、收藏、生词本按学习编号保存在 `data/users/*.json`
- 中文界面
- 类 Busuu 的卡片式学习界面

## 重要文件

- `app.py`：主程序
- `words.csv`：词库
- `requirements.txt`：依赖列表
- `README.md`：运行说明
- `data/user_state.json`：运行后自动生成，用来保存学习数据
- `data/users/*.json`：运行后自动生成，用来按学习编号保存学习数据
- `DEPLOYMENT.md`：互联网版本上线说明

## 启动方式

打开 PowerShell，输入：

```powershell
cd C:\Users\20767\Documents\Codex\2026-05-30\python-streamlit-1-2-3-4
python -m streamlit run app.py
```

## 后续可升级方向

1. 增加双击启动文件，不用每次输入命令。
2. 扩充完整意大利驾照理论词库。
3. 增加选择题测验模式。
4. 增加错题本和复习提醒。
5. 增加章节学习进度详情。
6. 增加导入/导出词库功能。
7. 增加发音音频或朗读按钮。
8. 打包成 `.exe` 桌面程序。
9. 优化手机端界面。
10. 增加按考试主题分类的专项练习。
11. 接入 Supabase、Google Sheets 或 PostgreSQL，让互联网版本稳定保存所有用户进度。

## 下一次继续时可以这样说

```text
继续升级我的意大利驾照理论词汇学习工具，项目在：
C:\Users\20767\Documents\Codex\2026-05-30\python-streamlit-1-2-3-4
```
