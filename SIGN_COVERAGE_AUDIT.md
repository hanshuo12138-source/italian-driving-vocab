# SIGN_COVERAGE_AUDIT.md

生成时间：2026-06-04

本报告只基于当前本地 `words.csv` 静态分析生成。未爬取网站、未下载图片、未修改 `words.csv`、未修改应用代码。

## 统计口径

- 词库文件：`words.csv`
- 读取编码：GB18030
- 图形编号提取来源：优先从 `note` 中的 `图形编号 sXXX` 提取，同时参考 `image` URL 中的 `/sXXX.gif`。
- 缺失编号列表使用区间压缩表示，例如 `175-181` 表示 175、176、177、178、179、180、181 均缺失。
- 当前没有联网核对 rmastri/WEBpatente 官方完整图形总量，因此覆盖率是基于当前已出现的最小编号 1 到最大编号 972 的估算。

## 1. 总体统计

| 项目 | 数量 |
|---|---:|
| 总词条数 | 484 |
| `image` 非空数量 | 434 |
| `image` 来源为 `rmastri.it` 的数量 | 434 |
| `note` 或 `italian` 中包含图形编号的词条数 | 434 |
| 按 `image` URL 提取到的唯一图形编号数 | 432 |
| 按 `note` 提取到的唯一图形编号数 | 423 |
| 按 `note + image` 合并提取到的唯一图形编号数 | 445 |
| 图形编号最小值 | 1 |
| 图形编号最大值 | 972 |

## 2. 当前覆盖率估算

按 `image` URL 中实际出现的 `/sXXX.gif` 计算：

- 编号范围：1-972
- 理论范围内编号数量：972
- 当前唯一图片编号数量：432
- 估算覆盖率：44.44%
- 缺失编号数量：540

按 `note + image` 合并编号计算：

- 当前唯一编号数量：445
- 估算覆盖率：45.78%
- 缺失编号数量：527

注意：合并口径会受到 `note` 编号与 `image` 编号不一致的影响，因此更适合发现风险，不适合作为真实覆盖率。当前更建议以 `image` URL 编号作为覆盖率基准。

## 3. 当前缺失图形编号

以下缺失列表按 `image` URL 编号计算，使用区间压缩表示：

`12`, `87-88`, `147`, `149`, `165`, `175-181`, `185`, `188`, `190-192`, `195-196`, `198`, `202`, `204-205`, `208-209`, `211-213`, `215`, `221-223`, `227`, `229`, `232-235`, `237`, `241`, `244`, `246`, `249`, `257-259`, `261-264`, `266-269`, `271`, `277`, `281`, `286-287`, `296`, `298`, `300`, `306-333`, `336-382`, `387-444`, `446-500`, `503-504`, `507-508`, `510`, `514`, `516`, `522-527`, `529-530`, `532-533`, `538-541`, `544`, `548-549`, `551`, `555-557`, `560-561`, `569`, `571`, `573`, `575-594`, `597-598`, `600`, `603`, `605`, `609`, `611-612`, `619`, `621-630`, `635`, `641`, `645`, `649`, `653`, `656`, `658`, `666`, `671-675`, `677-689`, `691-692`, `700`, `707`, `710-716`, `719`, `722-900`

## 4. 重复图形编号列表

### 4.1 按 `note` 图形编号统计的重复

共发现 12 个重复编号：

| 图形编号 | 词条 |
|---:|---|
| 121 | `WORD_000168` confine di stato tra paesi della comunità europea；`WORD_000170` distanza |
| 122 | `WORD_000169` preavviso di confine di stato tra paesi della comunità europea；`WORD_000171` estesa |
| 172 | `WORD_000210` confine di stato tra paesi della comunità  europea；`WORD_000218` segnale di preselezione urbano |
| 173 | `WORD_000211` preavviso di confine di stato tra paesi della comunità  europea；`WORD_000219` preavviso di diramazione autostradale |
| 214 | `WORD_000233` segnale di identificazione strada comunale n. 19；`WORD_000237` ospedale |
| 236 | `WORD_000249` localizzazione di attraversamento ciclabile；`WORD_000251` cavalcavia o sottopassaggio per l’inversione di marcia |
| 250 | `WORD_000258` preavviso di deviazione consigliata per autocarri che superano 3,5 t., autotreni ed autoarticolati；`WORD_000259` direzione consigliata agli autocarri che superano 3,5 t. |
| 275 | `WORD_000270` polizia stradale；`WORD_000271` lavori in corso |
| 545 | `WORD_000324` striscia gialla a zig zag；`WORD_000329` striscia bianca laterale continua che separa la carraeggiata dalla corsia di emergenza |
| 554 | `WORD_000330` strada a tre corsie；`WORD_000334` striscia trasversale continua |
| 572 | `WORD_000341` corsie di canalizzazione；`WORD_000342` corsie di canalizzazione |
| 639 | `WORD_000366` ordine di precedenza: b si ferma al centro...；`WORD_000367` ordine di precedenza: t e b insieme - a - c |

### 4.2 按 `image` URL 编号统计的重复

共发现 2 个重复图片编号：

| 图片编号 | image URL | 词条 |
|---:|---|---|
| 163 | `https://www.rmastri.it/42/immagini/s163.gif` | `WORD_000168`；`WORD_000210` |
| 164 | `https://www.rmastri.it/42/immagini/s164.gif` | `WORD_000169`；`WORD_000211` |

## 5. 同一个 image_url 被多个词条复用

共发现 2 个 image URL 被多个词条复用：

| image URL | 词条 |
|---|---|
| `https://www.rmastri.it/42/immagini/s163.gif` | `WORD_000168` confine di stato tra paesi della comunità europea；`WORD_000210` confine di stato tra paesi della comunità  europea |
| `https://www.rmastri.it/42/immagini/s164.gif` | `WORD_000169` preavviso di confine di stato tra paesi della comunità europea；`WORD_000211` preavviso di confine di stato tra paesi della comunità  europea |

## 6. 同一个 italian 对应多个不同 image_url

共发现 7 组：

| italian | 不同图片数 | 对应词条/图形 |
|---|---:|---|
| segnale di senso vietato integrato con pannello di eccezione | 3 | `WORD_000439` s927；`WORD_000441` s929；`WORD_000479` s967 |
| ordine di precedenza:  r - a - c | 3 | `WORD_000355` s615；`WORD_000380` s657；`WORD_000381` s659 |
| strisca bianca trasversale continua | 2 | `WORD_000310` s515；`WORD_000339` s568 |
| segnale di parcheggio integrato con pannello di inizio | 2 | `WORD_000470` s958；`WORD_000471` s959 |
| segnale di doppia curva integrato con pannello estesa | 2 | `WORD_000418` s906；`WORD_000419` s907 |
| corsie di canalizzazione con frecce direzionali su strada a doppio senso | 2 | `WORD_000326` s547；`WORD_000336` s565 |
| corsie di canalizzazione | 2 | `WORD_000341` s572；`WORD_000342` s574 |

说明：同一个 `italian` 对应多个图片不一定都是错误，可能是同一概念在不同组合图、不同题型或不同辅助牌场景中重复出现。需要人工判断是否应合并、保留为多图词条，或补充更精确的中文说明。

## 7. 同一个 image_url 对应多个不同 italian

共发现 2 组：

| image URL | different italian |
|---|---|
| `https://www.rmastri.it/42/immagini/s163.gif` | confine di stato tra paesi della comunità europea；confine di stato tra paesi della comunità  europea |
| `https://www.rmastri.it/42/immagini/s164.gif` | preavviso di confine di stato tra paesi della comunità europea；preavviso di confine di stato tra paesi della comunità  europea |

说明：这两组主要差异是文本中多了额外空格，可能是重复导入或清洗不一致。

## 8. 可能导入错误的图形

发现 26 条 `note` 图形编号与 `image` 文件名编号不一致。这类最值得优先人工复查，因为可能是导入错位、note 未同步、或此前手工修复时保留了旧编号。

| word_id | italian | note 编号 | image 编号 |
|---|---|---:|---:|
| `WORD_000168` | confine di stato tra paesi della comunità europea | 121 | 163 |
| `WORD_000169` | preavviso di confine di stato tra paesi della comunità europea | 122 | 164 |
| `WORD_000194` | pulizia meccanica della strada | 146 | 145 |
| `WORD_000195` | andamento della strada principale | 147 | 146 |
| `WORD_000210` | confine di stato tra paesi della comunità  europea | 172 | 163 |
| `WORD_000211` | preavviso di confine di stato tra paesi della comunità  europea | 173 | 164 |
| `WORD_000226` | transitabilità: passo aperto con obbligo di catene o pneumatici da neve | 192 | 189 |
| `WORD_000232` | segnale di identificazione strada statale n. 2 | 213 | 201 |
| `WORD_000233` | segnale di identificazione strada comunale n. 19 | 214 | 203 |
| `WORD_000246` | strada riservata ai soli veicoli a motore | 227 | 228 |
| `WORD_000251` | cavalcavia o sottopassaggio per l’inversione di marcia | 236 | 239 |
| `WORD_000255` | uso corsie su strada urbana con corsia di destra riservata agli autobus | 244 | 245 |
| `WORD_000259` | direzione consigliata agli autocarri che superano 3,5 t. | 250 | 251 |
| `WORD_000270` | polizia stradale | 275 | 274 |
| `WORD_000291` | pannello per carichi sporgenti | 340 | 302 |
| `WORD_000292` | pannello per trasporto merci pericolose | 341 | 303 |
| `WORD_000293` | pannelli posteriori per autoveicoli adibiti al trasporto merci di massa a pieno carico oltre 3,5 t. | 344 | 304 |
| `WORD_000301` | strisce di delimitazione gialle che individuano un’area di parcheggio destinata a persone invalide | 504 | 445 |
| `WORD_000322` | frecce di rientro su strada a doppio senso | 539 | 542 |
| `WORD_000329` | striscia bianca laterale continua che separa la carraeggiata dalla corsia di emergenza | 545 | 553 |
| `WORD_000334` | striscia trasversale continua | 554 | 563 |
| `WORD_000342` | corsie di canalizzazione | 572/574 | 574 |
| `WORD_000343` | isola di traffico (non può essere valicata) | 576 | 595 |
| `WORD_000344` | strisce di guida per la svolta a sinistra (possono essere valicate) | 579 | 596 |
| `WORD_000357` | ordine di precedenza: n si ferma al centro - r - a - prosegue n | 630 | 617 |
| `WORD_000366` | ordine di precedenza: b si ferma al centro - r - n e d insieme - prosegue b | 639 | 638 |

## 9. 当前覆盖风险判断

1. 当前图形覆盖大约在 44%-46% 之间，说明词库已经包含一批交通标志和图形，但还不是完整 rmastri/WEBpatente 图形库。
2. 编号缺失不是均匀分布，尤其 `306-333`、`336-382`、`387-444`、`446-500`、`722-900` 等区间缺口较大。
3. `note` 与 `image` 图形编号不一致的 26 条优先级最高，可能导致用户看到的图片和中文说明不对应。
4. 图片复用问题目前不多，只有 2 个 URL 被复用，但这两组很可能是重复导入或文字空格差异导致。
5. 同一个 `italian` 对应多个图片的 7 组需要人工判断：部分可能合理，部分可能需要拆分更精确的 `italian/chinese`。

## 10. 下一步补全建议

1. 先人工核对 26 条 note/image 编号不一致记录，确认应该以图片编号为准还是以 note 编号为准。
2. 再处理 2 组同图复用记录，判断是否为重复词条，必要时保留一条、合并说明或修正空格差异。
3. 对 `corsie di canalizzazione`、`ordine di precedenza`、`segnale di ... integrato ...` 这类同名多图词条，建议在中文里加入图形差异说明，避免用户看到多个相同中文释义却配不同图。
4. 补全缺失图形时，不建议一次性大批量自动导入；建议按编号区间分批导入、每批生成审计报告，并保留来源和版权字段。
5. 商业化前需要继续确认外链图片版权，逐步替换为自制图片、授权图片或明确可商用资源。

## 11. signs.csv 拆分进度更新

更新时间：2026-06-04 22:55:21

根据本审计报告，项目已新增独立交通图形库文件 `signs.csv`，但尚未合并到 `words.csv`，也尚未接入 `app.py` 页面逻辑。

`signs.csv` 当前状态：

- 来源：从现有 `words.csv` 中提取所有带图形编号或 `image` 的交通图形词条。
- 总记录数：434
- 唯一 `figure_id` 数量：432
- `review_status = imported_from_words`：349
- `review_status = needs_review`：85
- 字段：`figure_id`, `italian`, `chinese`, `category`, `image`, `source_name`, `source_url`, `license_note`, `copyright_status`, `review_status`, `note`
- `figure_id` 生成规则：优先使用图片 URL 中的 `/sXXX.gif` 编号；如果没有图片，再使用 `note` 中的图形编号。
- 对 `note` 图形编号与 `image` 文件编号不一致、原词条标记“需人工校对”、或同一记录含多个图形编号的记录，已标记为 `needs_review`。

本次拆分未下载图片，未删除 `words.csv` 原内容，未修改 `app.py`、`db.py`、`i18n.py`。

下一步建议：

1. 先人工核对 `signs.csv` 中 `review_status = needs_review` 的 85 条。
2. 优先处理 `figure_id_mismatch` 记录，确认应以图片编号还是 note 编号为准。
3. 之后再考虑让应用读取 `signs.csv`，而不是继续把交通图形长期混在 `words.csv` 中。
4. 商业化前继续确认外链图片版权，逐步替换为自制、授权或明确可商用图片。
