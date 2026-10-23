# Changelog

## 0.1.2 — 2026-10-23

- README 仅保留工具包用途、各 Skill 的使用方式、安装与必要依赖说明。
- 8 个 Skill 内容不变。

## 0.1.1 — 2026-10-23

- 插件、marketplace、仓库和显示名由 coding-skills / Coding Skills 改为 developer-skills / Developer Skills。
- 保留 v0.1.0 历史，8 个 Skill 内容不变。

## 0.1.0 — 2026-10-23

- 打包 8 个已确认的 Skill，携带全部 13 个来源文件及已有许可材料。
- 增加 Agent Plugins 入口、Codex 兼容清单和本地相对路径 marketplace。
- 将 code-review 中三处机器专用依赖路径调整为插件内相对路径或已安装 Skill 定位；其余来源文件保持原字节内容。
- 记录外部依赖、来源哈希、安装更新说明和保留的行为差异。
- 提供无第三方依赖的结构校验与损坏案例测试。
- 校验和测试使用 Node.js 内置模块，取代初始 Python 版本，无需安装 npm 依赖。
