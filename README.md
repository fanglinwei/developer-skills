# Developer Skills

用于 Codex 的开发工作流工具包，提供代码审查、代码简化、项目检索、前端开发与界面复刻、功能文档和 Swift 编码规范。

## 安装与更新

```sh
codex plugin marketplace add fanglinwei/developer-skills --ref v0.1.6
codex plugin add developer-skills@developer-skills
```

从旧版本更新时，先移除旧 marketplace 来源，再执行上面的安装命令；已安装过同名来源时，直接添加不同 ref 会被 CLI 拒绝：

```sh
codex plugin marketplace remove developer-skills
codex plugin marketplace add fanglinwei/developer-skills --ref v0.1.6
codex plugin add developer-skills@developer-skills
```

安装后重启 Codex 或开启新聊天，从技能列表选择 `developer-skills` 下的对应 Skill。

当前清单版本：`0.1.6`。版本变化见 [CHANGELOG](CHANGELOG.md)，来源与许可见 [LICENSES](LICENSES.md)。

## Skill 与用法

| Skill | 作用 | 调用示例 |
| --- | --- | --- |
| `code-review` | 按证据核实正确性、安全、需求与调用影响。支持 `daily`/`deep`，默认隐藏可选改进；获授权时按需分线与复核，只输出报告。 | `$developer-skills:code-review daily` 帮我审查当前改动。 |
| `code-simplifier` | 简化近期修改的代码，保持原有功能与行为，遵循项目规范。 | `$developer-skills:code-simplifier` 简化本次修改。 |
| `codegraph-project-scan` | 代码检索或读取前更新已有索引，同轮改动后重新同步；无索引或工具不可用时按项目规则回退。 | `$developer-skills:codegraph-project-scan` 查找订单提交入口及调用链。 |
| `frontend-ai-dev-docs` | 按功能梳理前后变化、交互、接口和影响范围，生成或持续维护模块迭代文档。 | `$developer-skills:frontend-ai-dev-docs` 总结订单模块本次功能变动，写入模块功能迭代总结。 |
| `frontend-page-clone` | 根据示例代码、网页或截图复刻页面或模块，复用项目组件，已有项目优先沿用原接口，缺口按需局部 mock。 | `$developer-skills:frontend-page-clone` 按这张截图复刻指定页面，采用原样复刻档位。 |
| `frontend-coding-guard` | 隐式触发的精简 Web 安全附加规则，覆盖 HTML/URL、秘密与授权、未知写入及异步恢复；质量细节按需参考。 | `$developer-skills:frontend-coding-guard` 检查这个表单的提交与失败恢复边界。 |
| `frontend-style-clone` | 对齐局部布局、字体、颜色、控件和动画，保留现有业务数据、文案与交互。 | `$developer-skills:frontend-style-clone` 按参考图调整这个弹窗的外观。 |
| `swift-code-style` | 在 Swift 编写、重构及审查中应用命名、API、格式、安全解包与引用管理规范。 | `$developer-skills:swift-code-style` 按项目规范调整本次 Swift 改动。 |

调用示例中的页面、模块、参考图和改动范围需替换为实际目标，并提供相关材料。Skill 也可能按任务描述自动触发；需要明确选用时，从技能列表选择或显式输入名称。

## 代码审查

你可以说“帮我 review 当前改动”，也可以指定文件、提交、分支或 PR。完整执行规则见 [code-review Skill](skills/code-review/SKILL.md)，分类边界见[报告示例](skills/code-review/references/review-examples.md)。

| 模式 | 适合的改动 | 审查重点 |
| --- | --- | --- |
| `daily` | 局部修复、单个功能或影响路径清晰的模块改动 | 全部目标改动、相关调用路径和有效测试 |
| `deep` | 跨模块流程、公共接口、迁移或关键边界变化 | 在 daily 基础上追踪输入、存储与输出，检查兼容性及失败恢复 |

你指定的模式优先；未指定时按影响范围选择。提供目标、比较基准和相关需求即可开始：

```text
$developer-skills:code-review daily 审查 src/orders/ 的当前改动及调用影响。

$developer-skills:code-review deep 以 main 为基准审查当前分支，需求和验收标准见 docs/spec.md。

$developer-skills:code-review deep 审查 PR <URL>，重点检查权限与数据写入。

$developer-skills:code-review daily 检查这个 Web 页面改动，附上可选简化建议。
```

未指定目标时检查当前已暂存、未暂存及相关未跟踪文件；没有改动则停止，不自动回退最近提交。普通代码解释或 Skill 分析不触发代码审查。

报告区分已确认缺陷、待确认和关键验证缺口，附位置、证据、影响、最小修复与实际验证限制；可选改进仅按要求展开。审查只输出报告，可以运行无业务写入的现有最小检查；修改文件及 Git 写操作需另行授权。

### 授权子代理协作

daily/deep 默认由主审完成。需要协作时明确授权并给出预算，例如：

```text
$developer-skills:code-review deep 以 main 为基准审查当前分支。
允许子代理协作，最多调用 3 次，预留一次复核关键发现。
需求见 docs/spec.md，重点检查订单状态与失败恢复。
```

主审按收益和剩余预算决定分线与复核；累计调用受用户上限、宿主容量及适用的 agent-fit 规则限制。职责与交接见[代理协作协议](skills/code-review/references/agent-collaboration.md)。

## 页面复刻与局部样式调整

- **完整页面或模块复刻**：使用 `frontend-page-clone`。可选择保留项目组件风格，或尽可能按参考原样复刻；已有项目保留原接口与业务行为，仅对明确缺口使用局部 mock；无接口的纯演示项目默认使用 mock。
- **现有页面的局部视觉调整**：使用 `frontend-style-clone`。调整指定区域外观，保留正式业务逻辑、数据、绑定和文案。

## 按场景使用的依赖

- 代码审查需要 [Ponytail](https://github.com/DietrichGebert/ponytail) 的 `ponytail-review`；界面复刻的实现阶段使用其 `ponytail`。
- 复刻存在关键未决选择时，使用 [Matt Pocock Skills](https://github.com/mattpocock/skills) 的 `grilling`。
- 开发和审查按适用规则使用已安装的 `karpathy-guidelines`。
- CodeGraph 检索需要对应 CLI；网页分析和视觉验证需要可用且获准使用的浏览器工具。

工具包不会自动安装外部依赖。实际执行遵循用户指令、项目规则及各 Skill 的权限边界；缺少依赖时，说明受影响的步骤和未完成范围。

## 维护与验证

需要 Node.js 和 Python 3，无需安装 npm 依赖。在仓库根目录运行：

```sh
node scripts/validate.mjs
node --test tests/*.test.mjs
```

校验会拒绝包内的 `.DS_Store`、软链、来源摘要不匹配和失效的本地文档链接。测试夹具有意包含业务缺陷，不能用于生产。

- [代码审查评测](docs/code-review-evaluation.md)：材料入口、对照方法、历史结果与未覆盖范围；结构及样例测试不证明模型准确率或效率提升。
- [CodeGraph 优化记录](docs/codegraph-scan-optimization.md)：索引维护改动、hooks 取舍与验证边界。
