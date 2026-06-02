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
- 已加入轻量账户系统，方便互联网版本按用户分开保存进度

## 当前功能

- 首页显示章节
- 章节内显示单词
- 闪卡模式
- 生词本
- 搜索单词
- 收藏功能
- 数据来自 `words.csv`
- 词库支持 `image` 列，可显示交通标志/图形图片
- 用户可以创建账户并登录
- 登录时可以选择保持登录
- 学习进度、收藏、生词本按账户保存在 `data/users/*.json`
- 中文界面
- 类 Busuu 的卡片式学习界面

## 重要文件

- `app.py`：主程序
- `words.csv`：词库
- `tools/import_sign_definitions.py`：从 WEBpatente 图形定义文件整理交通标志/图形词条的辅助脚本
- `requirements.txt`：依赖列表
- `README.md`：运行说明
- `data/accounts.json`：运行后自动生成，用来保存账户哈希信息
- `data/users/*.json`：运行后自动生成，用来按账户保存学习数据
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
11. 接入 Supabase、Google Sheets 或 PostgreSQL，让互联网版本稳定保存所有用户进度和账户。
12. 继续校对交通标志/图形的中文释义，让商业版词库更准确。

## 下一次继续时可以这样说

```text
继续升级我的意大利驾照理论词汇学习工具，项目在：
C:\Users\20767\Documents\Codex\2026-05-30\python-streamlit-1-2-3-4
```
