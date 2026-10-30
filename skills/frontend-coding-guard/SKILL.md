---
name: frontend-coding-guard
description: Skip isolated presentation edits (layout, CSS, colors, spacing, typography or static copy) when interaction and data handling stay unchanged. Use for browser Web implementation or debugging involving HTML/URL trust boundaries, login redirects, auth/secrets, async requests or lifecycle, form submissions/retries, or preserving user input. Duplicate submissions, stale search results and failed form recovery qualify even without a security-related request. Read-only lookup, explanation and analysis do not trigger this skill; static review uses it only when its workflow invokes it. Excludes mobile, desktop and cross-platform apps.
---

# 前端编码守护

按改动选择以下安全约束。通用编码、样式、性能和无障碍要求沿用项目规则与常驻 Karpathy、Ponytail，不重复展开。项目缺少具体承接规则时，按需读取[质量约束补充](references/frontend-quality.md)，只应用涉及的条目。

## 守住 Web 边界

- **HTML。** 用户输入、URL 参数和外部数据均不可信；默认按文本渲染。必须渲染富文本时，使用项目已有且可靠的清洗机制，不用正则自制清洗器。
- **URL。** 链接和跳转按用途限制协议与目标；检查实际交给浏览器的最终值，转换、拼接后仍须满足限制。已验证同源的 URL 不应因提取路径而变成 `//外站` 等跨站目标。
- **秘密与权限。** 凭据、服务端秘密和不应公开的数据不得进入客户端代码、公开环境变量、构建产物、界面或日志；需要秘密的调用走服务端。前端边界校验用于交互反馈，身份、授权与关键业务校验由服务端保障，隐藏按钮不能替代授权。

## 保住写入与用户数据

- **未知写入。** 防重复提交；超时、网络失败或取消请求不代表服务端未写入。对有副作用且结果未知的操作，沿用确实存在的幂等或结果确认机制；结果未确认且无幂等保障时阻止再次写入，警告不能代替阻止。确认可安全重试后再恢复提交。
- **异步与恢复。** 防止旧响应覆盖新结果、已失效页面被回调更新；清理 effect、订阅、计时器和监听器。保留可恢复错误中的输入，迟到的成功回调也不能清空后续新草稿。提供涉及的加载、提交、成功与错误反馈，诊断信息脱敏，不直接展示或记录原始敏感响应。
- **核实前提。** 先确认清洗、服务端通道、幂等和结果查询能力真实存在。缺失时采用满足需求的安全降级，如将不可信内容显示为文本；不能虚构接口或用客户端代替服务端保障。确需新增能力时说明必要范围，缺失前提只阻断受影响部分。

## 验证改动涉及的边界

沿用现有测试和浏览器工具，验证正常功能及相关反例：恶意 HTML、可执行或越界 URL、最终跳转值、重复提交、未知写入、乱序响应、页面失效和输入保留。按实际影响选取，不跑全量清单；修复留下旧行为失败、新行为通过的回归证据。遵守项目必跑检查，交付说明实际验证与缺口，不把静态阅读当作运行通过。
