# IMAGE_SOURCE_AUDIT.md

## 审查范围

本次审查并更新 `words.csv` 的 `image` 相关来源记录字段。

本次未执行的操作：

- 未下载任何图片。
- 未删除任何图片。
- 未将外链图片改为本地图片。
- 未删除 `image` 列。
- 未修改账户系统。
- 未修改学习逻辑。
- 未修改 UI 样式。

## 本次新增或确认的字段

`words.csv` 当前已包含以下图片来源记录字段：

```text
source_name
source_url
license_note
copyright_status
```

字段用途：

- `source_name`：根据图片 URL 域名记录来源，例如 `rmastri.it`。
- `source_url`：记录原始外部图片链接。
- `license_note`：记录授权/版权备注。
- `copyright_status`：记录当前版权确认状态。

## 当前图片来源判断

本次确认：当前图片主要是 **外部图片链接**，不是本地复制文件。

应用仍然通过 `image` 字段显示远程图片，没有把图片下载到项目中。

## 统计结果

| 项目 | 数量 |
| --- | ---: |
| 总词条数 | 484 |
| `image` 为空 | 50 |
| `image` 为外部 URL | 434 |
| `image` 为本地或异常路径 | 0 |

## 来源域名统计

| 来源 | 数量 |
| --- | ---: |
| `rmastri.it` | 434 |

## 字段填充规则

### 外部 URL 图片

适用范围：

```text
image 以 http:// 或 https:// 开头
```

已填充：

```text
source_url = image 原始链接
source_name = 根据域名提取，例如 rmastri.it
license_note = external image link; needs manual verification before commercial use
copyright_status = unverified_external_link
```

### 空 image

已填充：

```text
source_url = 空
source_name = 空
license_note = 空
copyright_status = no_image
```

### 本地或异常 image

当前数量为 0。

规则保留如下：

```text
source_url = 空
source_name = local_or_unknown
license_note = needs manual verification
copyright_status = unverified_local_or_unknown
```

## 当前风险说明

### 版权/授权风险

当前 434 条外链图片均为未人工确认授权状态：

```text
copyright_status = unverified_external_link
```

公开可访问不等于允许商业使用。正式商业化前，应逐条确认这些图片是否允许：

- 第三方学习工具展示；
- 商业用途；
- 远程外链；
- 复制到本地；
- 是否需要署名或来源说明。

### 外链稳定性风险

当前外链主要依赖 `rmastri.it`。

如果来源网站调整路径、删除图片、限制外链或服务不可用，应用内交通标志图片可能无法显示。

### 商业化风险

在版权状态未确认前，不建议将这些图片作为付费功能、会员权益、广告卖点或商业素材使用。

## 后续建议

商业化前应逐步替换或确认图片来源：

1. 优先使用自制图片或自制矢量图。
2. 使用明确授权、允许商用的图片资源。
3. 使用官方明确可引用的交通标志资源。
4. 如果继续使用外链，应确认对方允许远程引用。
5. 如果授权不明确，可以暂时只保留文字释义，不显示图片。

## 总结

当前状态：

- 图片主要为外部链接。
- 已为 `words.csv` 增加来源记录和风险标记字段。
- 未下载、删除或本地化任何图片。
- 所有外链图片仍需在商业化前人工确认版权。
