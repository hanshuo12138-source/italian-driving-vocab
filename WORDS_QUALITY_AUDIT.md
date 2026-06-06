# WORDS_QUALITY_AUDIT.md

生成时间：2026-06-04 03:02:02

## 本次修复记录

- 本次扫描字段：`chinese`、`example_zh`、`note`
- 本次实际修复中意混杂/机器翻译残留词条数量：128
- 备份文件：`data/backups/words_mixed_language_fix_20260604_030037.csv`
- 当前仍被本轮目标规则判定为可疑的词条数量：0
- 当前 note 或中文说明中标记“需人工校对”的词条数量：66

## 本次重点清理的残留类型

- 大写意大利语短语残留，例如 `SI POSSONO`、`SORPASSARE`、`DISTANZIAMENTO MINIMO OBBLIGATORIO`。
- 中意混杂机器翻译，例如“车辆 SENZA MOTORE”“和 QUELLI”“的70 METRI”“CHE PRECEDE”。
- 中文说明中拼接完整意大利语图形说明的问题。
- 交通标志、辅助牌、仪表符号说明中的机器翻译词块。

## 本次修改的 word_id

`WORD_000006`, `WORD_000090`, `WORD_000092`, `WORD_000107`, `WORD_000110`, `WORD_000112`, `WORD_000116`, `WORD_000130`, `WORD_000138`, `WORD_000139`, `WORD_000152`, `WORD_000153`, `WORD_000154`, `WORD_000159`, `WORD_000160`, `WORD_000161`, `WORD_000162`, `WORD_000172`, `WORD_000173`, `WORD_000174`, `WORD_000186`, `WORD_000192`, `WORD_000193`, `WORD_000197`, `WORD_000198`, `WORD_000199`, `WORD_000200`, `WORD_000201`, `WORD_000202`, `WORD_000203`, `WORD_000205`, `WORD_000206`, `WORD_000207`, `WORD_000208`, `WORD_000209`, `WORD_000212`, `WORD_000214`, `WORD_000215`, `WORD_000216`, `WORD_000217`, `WORD_000218`, `WORD_000219`, `WORD_000220`, `WORD_000221`, `WORD_000223`, `WORD_000224`, `WORD_000225`, `WORD_000228`, `WORD_000229`, `WORD_000231`, `WORD_000234`, `WORD_000235`, `WORD_000238`, `WORD_000239`, `WORD_000240`, `WORD_000242`, `WORD_000245`, `WORD_000247`, `WORD_000248`, `WORD_000249`, `WORD_000250`, `WORD_000252`, `WORD_000254`, `WORD_000256`, `WORD_000257`, `WORD_000260`, `WORD_000263`, `WORD_000264`, `WORD_000267`, `WORD_000269`, `WORD_000272`, `WORD_000278`, `WORD_000279`, `WORD_000280`, `WORD_000281`, `WORD_000282`, `WORD_000283`, `WORD_000285`, `WORD_000286`, `WORD_000287`, `WORD_000288`, `WORD_000289`, `WORD_000290`, `WORD_000297`, `WORD_000298`, `WORD_000299`, `WORD_000307`, `WORD_000311`, `WORD_000312`, `WORD_000313`, `WORD_000314`, `WORD_000315`, `WORD_000316`, `WORD_000317`, `WORD_000318`, `WORD_000320`, `WORD_000323`, `WORD_000324`, `WORD_000325`, `WORD_000345`, `WORD_000346`, `WORD_000393`, `WORD_000396`, `WORD_000397`, `WORD_000398`, `WORD_000400`, `WORD_000401`, `WORD_000402`, `WORD_000403`, `WORD_000404`, `WORD_000405`, `WORD_000406`, `WORD_000407`, `WORD_000408`, `WORD_000409`, `WORD_000410`, `WORD_000411`, `WORD_000412`, `WORD_000420`, `WORD_000421`, `WORD_000422`, `WORD_000423`, `WORD_000424`, `WORD_000425`, `WORD_000444`, `WORD_000459`, `WORD_000460`, `WORD_000461`

## 汇总

- 总词条数：484
- 本轮修复词条数：128
- 本轮目标规则剩余可疑词条数：0
- 仍需人工校对词条数：66

## 说明

本次只修改了 `words.csv` 中的 `chinese`、`example_zh`、`note` 三个字段，没有修改 `word_id`、`italian`、`example_it`、图片、来源、版权字段，也没有修改应用代码或数据库。

`需人工校对` 表示当前中文已尽量改为自然表达，但仍建议之后结合交通标志图片、官方教材或驾校资料逐条确认准确含义。

## 后续建议

1. 后续导入新词库后，继续扫描 `chinese`、`example_zh`、`note` 中的大写意大利语残留和中意混杂表达。
2. 对 `note` 中标记“需人工校对”的 66 条词条，结合图形和官方语境逐步确认。
3. 商业化前继续做词库人工校对，避免机器翻译或来源解释不准确影响学习效果。

## 2026-06-04 人工翻译校正

- 更新时间：2026-06-04 21:52:21
- 本次按人工校对映射表精确匹配并修复词条数量：34
- 未匹配词条数量：0
- 备份文件：`data/backups/words_manual_translation_fix_20260604_215145.csv`
- 第 17 条 `italian` 字段已将 `trafoi` 修正为 `trafori`。
- 本次只允许并实际修改 `words.csv` 的 `chinese`、`example_zh`、`note` 字段，以及第 17 条的 `italian` 拼写。
- 本次检查的 34 条词条中，未发现目标中意混杂残留：`SI POSSONO`、`SENZA MOTORE`、`QUELLI`、`DUE RUOTE`、`METRI`、`CHE PRECEDE`、`DISTANZIAMENTO`。

本次修改的 `word_id`：

`WORD_000097`, `WORD_000098`, `WORD_000105`, `WORD_000111`, `WORD_000131`, `WORD_000143`, `WORD_000148`, `WORD_000149`, `WORD_000150`, `WORD_000182`, `WORD_000189`, `WORD_000191`, `WORD_000194`, `WORD_000195`, `WORD_000198`, `WORD_000204`, `WORD_000227`, `WORD_000250`, `WORD_000260`, `WORD_000266`, `WORD_000267`, `WORD_000268`, `WORD_000276`, `WORD_000277`, `WORD_000352`, `WORD_000365`, `WORD_000367`, `WORD_000369`, `WORD_000373`, `WORD_000376`, `WORD_000458`, `WORD_000462`, `WORD_000467`, `WORD_000478`

## 2026-06-04 人工翻译校正第二批

- 更新时间：2026-06-04 22:36:10
- 本次人工校对目标数量：43
- 成功匹配并处理目标数量：43
- 未匹配目标数量：0
- 本次实际发生内容变化的词条数量：10
- 备份文件：`data/backups/words_manual_translation_fix_20260604_223536.csv`
- `trafoi` 已确认修正为 `trafori`。
- 图形 570 已单独将 `italian` 改为 `corsie di canalizzazione senza frecce direzionali`，中文改为“没有方向箭头的车道”。
- 图形 574 已标记：图片可能与图形 572 重复，需人工校对。
- 本次处理的目标词条中，未发现 `CANALIZZAZIONE`、`SI POSSONO`、`SENZA MOTORE`、`QUELLI`、`DUE RUOTE`、`CHE PRECEDE`、`DISTANZIAMENTO` 等中意混杂残留。

本次实际变更的 `word_id`：

`WORD_000143`, `WORD_000144`, `WORD_000340`, `WORD_000335`, `WORD_000342`, `WORD_000308`, `WORD_000309`, `WORD_000331`, `WORD_000332`, `WORD_000333`
