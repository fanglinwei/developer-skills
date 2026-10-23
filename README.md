# Developer Skills

用于个人编码工作的 Codex 插件，当前版本 `0.1.1` 整合 8 个已有 Skill。保留原有触发条件、权限边界、流程和验收要求。

## 包含的 Skill

| Skill | 用途 | 显式调用示例 |
| --- | --- | --- |
| code-review | daily/deep 双模式只读代码审查 | `$developer-skills:code-review daily` |
| code-simplifier | 保持行为的代码简化 | `$developer-skills:code-simplifier` |
| codegraph-project-scan | 项目代码定位与调用关系检索 | `$developer-skills:codegraph-project-scan` |
| frontend-ai-dev-docs | 前端模块功能迭代文档 | `$developer-skills:frontend-ai-dev-docs` |
| frontend-page-clone | 页面或模块复刻，按约定使用 mock | `$developer-skills:frontend-page-clone` |
| frontend-safe-development | 浏览器 Web 前端开发约束 | `$developer-skills:frontend-safe-development` |
| frontend-style-clone | 保留现有业务的局部视觉复刻 | `$developer-skills:frontend-style-clone` |
| swift-code-style | Swift 命名、API 与安全规范 | `$developer-skills:swift-code-style` |

使用时从宿主显示的技能列表选择对应条目；插件内 `name` 保持原名，宿主提供插件命名空间。原有隐式触发策略也保留，不能据此保证每次对话都自动调用。

`frontend-design`、`combo-release`、`stop-slop`、`storage-analyzer`、`agent-fit` 和 `agent-dispatch` 不属于此包。

## 本地安装

在这个目录执行下面的命令，或将 `.` 替换为本插件的实际目录：

```sh
codex plugin marketplace add .
codex plugin add developer-skills@developer-skills
```

然后重启 Codex 或开始新聊天，检查插件和 8 个 Skill 是否出现。上述命令会注册 marketplace 并安装插件。

安装前保留现有散装 Skill。安装后先用显式命名空间验证，避免误用旧条目；确认成功后，再决定是否停用原来的同名安装。宿主可能同时显示同名的散装版与插件版，不应假定它们会合并或互相覆盖。不要直接删除旧目录，或修改其他工具管理的软链接。

## 外部依赖

插件只包含说明和参考材料，不自动安装其他插件、CLI、依赖或项目索引。

| 使用场景 | 依赖 | 获取方式 |
| --- | --- | --- |
| 代码审查 | Ponytail 的 `ponytail-review` | 沿用 [Ponytail](https://github.com/DietrichGebert/ponytail) 的安装渠道 |
| 页面、样式复刻的实现与审查 | Ponytail 的 `ponytail` | 同上 |
| 复刻中需要访谈时 | `grilling`；`grill-me` 是入口 | 沿用 [Matt Pocock Skills](https://github.com/mattpocock/skills) 的安装渠道 |
| 按 Skill/项目规则需要开发规范时 | `karpathy-guidelines` | 使用已安装的对应 Skill 或插件；不依赖固定安装路径 |
| CodeGraph 检索 | CodeGraph CLI，及按规则启用的工程索引 | 按 [扫描 Skill](skills/codegraph-project-scan/SKILL.md) 的检查和授权流程处理 |
| 参考网页分析、视觉与交互验证 | 可用且允许的浏览器工具；必要时 Playwright | 按各 Skill 的工具选择和授权流程处理 |

缺少依赖时，按照原 Skill 处理受影响部分；打包不代表这些依赖已安装或运行正常。

## 文件结构

```text
developer-skills/
├── plugin.json                       # Agent Plugins 格式入口
├── .codex-plugin/plugin.json         # Codex 兼容清单及界面元数据
├── .agents/plugins/marketplace.json  # 一个 marketplace，一个插件
├── skills/                          # 8 个完整 Skill 文件夹
├── source-manifest.json             # 初始来源与文件 SHA-256
├── LICENSES.md                       # 按文件范围记录许可
├── CHANGELOG.md
├── scripts/validate.mjs
└── tests/validate.test.mjs
```

marketplace 的 `source.path` 为 `./`，相对于本仓库根目录解析。本包使用相对路径，不依赖原电脑的用户名或绝对路径。

插件清单参考 [OpenAI 打包文档](https://developers.openai.com/plugins/build/plugins)，并借鉴 Matt Pocock Skills、Ponytail 的清单与 marketplace 组织方式。它们的 hooks、遥测和实现未复制进本包。

## 校验

需要 Node.js 22 或更高版本，仅使用内置模块，无需 `npm install`。这些脚本只用于维护检查，插件运行不依赖它们。在本目录执行：

```sh
node scripts/validate.mjs
node --test tests/validate.test.mjs
```

校验覆盖 JSON 可解析性、清单关键字段与版本一致性、收录范围、Skill 的 `name`/`description` 字段、文件哈希、包内相对链接、机器专用路径及软链接。它不是完整 JSON Schema/YAML 验证器，也不验证模型的触发和执行效果。测试会在临时副本中制造文件损坏、漏文件和错误清单，确认校验会拒绝这些情况。

`source-manifest.json` 是 2026-10-23 的导入记录：`origin` 相对于原用户主目录，`source_sha256` 记录导入前内容，`packaged_sha256` 记录打包内容。13 个来源文件中，只有 `code-review/SKILL.md` 为移除机器路径而有两处语句调整；其余 12 个逐字节保留。该记录用于检查差异，不是签名或发布者身份认证。

## GitHub 维护和更新

本目录是 fanglinwei/developer-skills 仓库根目录。当前版本为 v0.1.1，仓库按私有方式维护。

其他电脑可从 GitHub 安装固定的已发布版本。私有仓库要求当前 Git 凭据具有读取权限。

```sh
codex plugin marketplace add fanglinwei/developer-skills --ref v0.1.1
codex plugin add developer-skills@developer-skills
```

后续在本仓库的 `skills/` 中维护；已安装缓存是部署副本。修改后运行校验和相关行为检查，同步更新 `source-manifest.json` 中受影响文件的 `packaged_sha256`，保留原始导入哈希；新增/删除文件也应同步记录来源和文件清单。版本同时更新 `plugin.json` 与 `.codex-plugin/plugin.json`，并记录 CHANGELOG。

GitHub 版本建议先做私有维护；发布前核实 [许可说明](LICENSES.md)。稳定版本可以使用 tag/Release 标记。Git 暂存、提交、推送和发布按维护者的明确授权分别执行。

Git 来源的 marketplace 可通过 `codex plugin marketplace upgrade developer-skills` 刷新；该命令针对 Git marketplace，不适用于本地路径来源。刷新源目录后，按当前客户端支持的流程重新安装或刷新插件，再开启新聊天确认版本与技能路径。不要仅凭 GitHub 文件已更新就认定本机缓存已经更新。不同机器若要求固定版本，添加 marketplace 时使用已发布的 `--ref TAG`，不要让生产工作流跟随未验证的主分支变化。

## 保留的行为差异

- `codegraph-project-scan` 在没有索引时要求先询问是否启用；`frontend-ai-dev-docs` 的取证流程在没有索引时跳过同步；`code-review` 也保留自己的索引前置说明。本次未统一这些行为，实际使用遵守用户指令和适用项目规则。
- `code-review` 对浏览器 Web 审查有专项的 Skill 组合要求；`frontend-safe-development` 自身描述未要求普通静态审查自动触发。保留调用方的显式组合规则。
- 页面复刻与局部样式复刻的数据边界不同：前者按约定 mock，后者保留业务数据。这是两个工作流的既有要求。

## 安装后检查

在新聊天中确认 8 个条目均来自 `developer-skills`，再选择真实但可控的小任务验证：局部复刻保留业务数据；页面复刻按约定 mock；代码审查只输出报告；代码简化保持行为。验证取决于实际项目、依赖和宿主，不属于文件校验的通过范围。
