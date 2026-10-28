# Developer Skills

用于 Codex 的开发工作流工具包，提供代码审查、代码简化、项目检索、前端开发与界面复刻、功能文档和 Swift 编码规范。

## 安装与更新

```sh
codex plugin marketplace add fanglinwei/developer-skills --ref v0.1.5
codex plugin add developer-skills@developer-skills
```

首次安装和从旧版本更新均执行以上两条命令：先将 marketplace 指向 v0.1.5，再安装该版本插件。安装后重启 Codex 或开启新聊天，从技能列表选择 `developer-skills` 下的对应 Skill。

当前发布版本：[v0.1.5](https://github.com/fanglinwei/developer-skills/releases/tag/v0.1.5)。本版更新 code-review 的证据分类、需求与规范核对、按需协作职责及独立复核规则，其余 7 个 Skill 保持不变。

## Skill 与用法

| Skill | 作用 | 调用示例 |
| --- | --- | --- |
| `code-review` | 按证据核实正确性、安全、需求与调用影响。支持 `daily`/`deep`，默认隐藏可选改进；获授权时按需分线与复核，只输出报告。 | `$developer-skills:code-review daily` 帮我审查当前改动。 |
| `code-simplifier` | 简化近期修改的代码，保持原有功能与行为，遵循项目规范。 | `$developer-skills:code-simplifier` 简化本次修改。 |
| `codegraph-project-scan` | 定位项目实现、引用和调用关系，按项目规则检查及使用 CodeGraph 索引。 | `$developer-skills:codegraph-project-scan` 查找订单提交入口及调用链。 |
| `frontend-ai-dev-docs` | 按功能梳理前后变化、交互、接口和影响范围，生成或持续维护模块迭代文档。 | `$developer-skills:frontend-ai-dev-docs` 总结订单模块本次功能变动，写入模块功能迭代总结。 |
| `frontend-page-clone` | 根据示例代码、网页或截图复刻页面或模块，复用项目组件，已有项目优先沿用原接口，缺口按需局部 mock。 | `$developer-skills:frontend-page-clone` 按这张截图复刻指定页面，采用原样复刻档位。 |
| `frontend-safe-development` | 约束浏览器 Web 前端开发，保持技术栈，检查相关状态、无障碍、安全和错误恢复。 | `$developer-skills:frontend-safe-development` 按项目现有方案修改这个表单。 |
| `frontend-style-clone` | 对齐局部布局、字体、颜色、控件和动画，保留现有业务数据、文案与交互。 | `$developer-skills:frontend-style-clone` 按参考图调整这个弹窗的外观。 |
| `swift-code-style` | 在 Swift 编写、重构及审查中应用命名、API、格式、安全解包与引用管理规范。 | `$developer-skills:swift-code-style` 按项目规范调整本次 Swift 改动。 |

调用示例中的页面、模块、参考图和改动范围需替换为实际目标，并提供相关材料。Skill 也可能按任务描述自动触发；需要明确选用时，从技能列表选择或显式输入名称。

## 代码审查

`code-review` 默认检查当前已暂存和未暂存改动，也可指定文件、提交、分支或 PR；没有当前改动时不自动审查最近提交。分别核对需求与规范，区分已确认缺陷、待确认和关键验证缺口；低优先级真实缺陷仍报告，可选简化或优化建议仅在明确要求时展开。

默认由当前审查者完成。需要协作时可明确要求“允许子代理协作，最多调用 3 次，预留一次复核关键发现”；deep 默认总调用上限为 3，包含分线、复核和重新委派，仍受授权、宿主和 agent-fit 限制。审查不会自动修复或进行 Git 写操作。

协作采用公共交接契约及 A 需求核对、B 契约追踪、C 边界检查、D 独立复核模板，按需选择；候选提出者不能承担该候选的独立复核。未委派维度和整体覆盖仍由主审负责。纯解释代码、分析 Skill 或评审改造计划不启动代码审查。

code-review 已于 2026-10-28 经用户验收通过，纳入 v0.1.5。使用时确认实际加载路径、版本与依赖。改造范围、可执行样例和验证限制见[评测入口](docs/code-review-evaluation.md)及[验证记录](docs/code-review-validation.md)；本次发布不额外宣称已完成严格隔离对照、真实协作或真实业务仓库测试。

## 页面复刻与局部样式调整

- **完整页面或模块复刻**：使用 `frontend-page-clone`。可选择保留项目组件风格，或尽可能按参考原样复刻；已有项目保留原接口与业务行为，仅对明确缺口使用局部 mock；无接口的纯演示项目默认使用 mock。
- **现有页面的局部视觉调整**：使用 `frontend-style-clone`。调整指定区域外观，保留正式业务逻辑、数据、绑定和文案。

## 按场景使用的依赖

- 代码审查需要 [Ponytail](https://github.com/DietrichGebert/ponytail) 的 `ponytail-review`；界面复刻的实现阶段使用其 `ponytail`。
- 复刻存在关键未决选择时，使用 [Matt Pocock Skills](https://github.com/mattpocock/skills) 的 `grilling`。
- 开发和审查按适用规则使用已安装的 `karpathy-guidelines`。
- CodeGraph 检索需要对应 CLI；网页分析和视觉验证需要可用且获准使用的浏览器工具。

工具包不会自动安装外部依赖。实际执行遵循用户指令、项目规则及各 Skill 的权限边界；缺少依赖时，说明受影响的步骤和未完成范围。
