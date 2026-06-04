# WORDS_QUALITY_AUDIT.md

生成时间：2026-06-04 01:55:00

## 本次最终修复记录

- 本次检查剩余规则判定可疑词条数量：6
- 本次实际修复词条数量：6
- 本次规则误判数量：0
- 累计已修复明显中意混杂词条数量：156
- 备份文件：`data/backups/words_quality_final_fix_20260604_015413.csv`
- 修复的 word_id：`WORD_000481`, `WORD_000482`, `WORD_000483`, `WORD_000484`, `WORD_000273`, `WORD_000294`
- 当前仍被规则判定为可疑的词条数量：0
- 当前 note 中标记“需人工校对”的词条数量：41

## 审计范围

- 文件：`words.csv`
- 字段：`chinese`、`example_zh`、`note`
- 本报告只记录词库中文释义质量审计结果。

## 汇总

- 总词条数：484
- 可疑词条数量：0
- 误判词条数量：0

## 本次修复说明

以下 6 条原本存在明显中意混杂、机器翻译残留或外文拼接问题，已改为自然中文：

| word_id | italian | 修复说明 |
|---|---|---|
| `WORD_000481` | `segnale di fermata scuolabus integrato con pannello fascia oraria di tutti i giorni` | 改为“校车停靠标志，附加每天适用的时间段”。 |
| `WORD_000482` | `segnale di lavori in corso integrato con pannello di fine` | 改为“道路施工标志，附加结束辅助牌”。 |
| `WORD_000483` | `segnali di rotatoria (a) e di preavviso di circolazione rotatoria (b)` | 改为“环岛标志和环岛通行预告标志”。 |
| `WORD_000484` | `segnale di diritto di precedenza (a) e pannello integrativo andamento della strada principale (b)` | 改为“优先通行权标志和主路走向辅助牌”。 |
| `WORD_000273` | `cono: segnala zone di lavoro di breve durata, incanalamenti temporanei, deviazioni, aree interessate da incidenti` | 改为交通锥用于提示短时施工、临时导流、绕行或事故区域。 |
| `WORD_000294` | `pannelli posteriori per rimorchi e semirimorchi adibiti al trasporto merci di massa a pieno carico oltre 3,5 t.` | 改为货运挂车和半挂车后部标志牌说明。 |

## 当前最严重的前 20 条

暂无。当前规则判定可疑词条数量为 0。

## 全部仍可疑词条

暂无。

## 后续建议

1. `note` 中仍有 41 条“需人工校对”标记，后续应结合交通标志图形和官方语境逐步人工确认。
2. 未来导入新词库时，继续运行质量审计，重点检查 `chinese`、`example_zh`、`note` 三列。
3. 商业化前仍需继续检查图片来源、题库来源和释义准确性。
