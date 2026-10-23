# Developer Skills

用于 Codex 的开发工作流工具包，提供代码审查、代码简化、项目检索、前端开发与界面复刻、功能文档和 Swift 编码规范。

## 安装

```sh
codex plugin marketplace add fanglinwei/developer-skills --ref v0.1.4
codex plugin add developer-skills@developer-skills
```

安装后重启 Codex 或开启新聊天，从技能列表选择 `developer-skills` 下的对应 Skill。

## Skill 与用法

| Skill | 作用 | 调用示例 |
| --- | --- | --- |
| `code-review` | 审查代码正确性、安全、性能和复杂度。支持日常 `daily` 与跨模块 `deep` 模式，默认只输出报告。 | `$developer-skills:code-review daily` 帮我审查当前改动。 |
| `code-simplifier` | 简化近期修改的代码，保持原有功能与行为，遵循项目规范。 | `$developer-skills:code-simplifier` 简化本次修改。 |
| `codegraph-project-scan` | 定位项目实现、引用和调用关系，按项目规则检查及使用 CodeGraph 索引。 | `$developer-skills:codegraph-project-scan` 查找订单提交入口及调用链。 |
| `frontend-ai-dev-docs` | 按功能梳理前后变化、交互、接口和影响范围，生成或持续维护模块迭代文档。 | `$developer-skills:frontend-ai-dev-docs` 总结订单模块本次功能变动，写入模块功能迭代总结。 |
| `frontend-page-clone` | 根据示例代码、网页或截图复刻页面或模块，复用项目组件，已有项目优先沿用原接口，缺口按需局部 mock。 | `$developer-skills:frontend-page-clone` 按这张截图复刻指定页面，采用原样复刻档位。 |
| `frontend-safe-development` | 约束浏览器 Web 前端开发，保持技术栈，检查相关状态、无障碍、安全和错误恢复。 | `$developer-skills:frontend-safe-development` 按项目现有方案修改这个表单。 |
| `frontend-style-clone` | 对齐局部布局、字体、颜色、控件和动画，保留现有业务数据、文案与交互。 | `$developer-skills:frontend-style-clone` 按参考图调整这个弹窗的外观。 |
| `swift-code-style` | 在 Swift 编写、重构及审查中应用命名、API、格式、安全解包与引用管理规范。 | `$developer-skills:swift-code-style` 按项目规范调整本次 Swift 改动。 |

调用示例中的页面、模块、参考图和改动范围需替换为实际目标，并提供相关材料。Skill 也可能按任务描述自动触发；需要明确选用时，从技能列表选择或显式输入名称。

## 页面复刻与局部样式调整

- **完整页面或模块复刻**：使用 `frontend-page-clone`。可选择保留项目组件风格，或尽可能按参考原样复刻；已有项目保留原接口与业务行为，仅对明确缺口使用局部 mock；无接口的纯演示项目默认使用 mock。
- **现有页面的局部视觉调整**：使用 `frontend-style-clone`。调整指定区域外观，保留正式业务逻辑、数据、绑定和文案。

## 按场景使用的依赖

- 代码审查需要 [Ponytail](https://github.com/DietrichGebert/ponytail) 的 `ponytail-review`；界面复刻的实现阶段使用其 `ponytail`。
- 复刻存在关键未决选择时，使用 [Matt Pocock Skills](https://github.com/mattpocock/skills) 的 `grilling`。
- 开发和审查按适用规则使用已安装的 `karpathy-guidelines`。
- CodeGraph 检索需要对应 CLI；网页分析和视觉验证需要可用且获准使用的浏览器工具。

工具包不会自动安装外部依赖。实际执行遵循用户指令、项目规则及各 Skill 的权限边界；缺少依赖时，说明受影响的步骤和未完成范围。
