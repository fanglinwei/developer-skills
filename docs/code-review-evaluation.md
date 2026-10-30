# Code Review 实施与评测入口

2026-10-30 的源码迭代另见[本轮改进记录](code-review-2026-10-30.md)。以下保留 2026-10-28 已发布版本的历史证据，不将新源码改动混入旧版验收。

本轮直接基线为实施前源码快照，历史 0.1.4 主文件仍用于文本追溯。源码工作区与已安装插件缓存可能不同；使用前确认实际加载路径、版本或文件摘要。评测阶段未更新发布版本与缓存；用户随后确认验收通过，授权发布 v0.1.5 及更新本机插件。

## 材料与检查

- [发现任务定义与评分预期](../tests/fixtures/code-review/evals.json)：三个任务分别配有完整 before/after、需求、现有测试及确定性 diff。`files` 相对此 JSON 所在目录，不属于安装后运行时需要读取的资源。
- [任务源码](../tests/fixtures/code-review/discovery/protected-read/README.md)、[结算任务](../tests/fixtures/code-review/discovery/checkout/README.md)、[导出任务](../tests/fixtures/code-review/discovery/exports/README.md)。输入准备只复制具体任务目录，不复制预期答案或评分文件。
- [触发样例](../tests/fixtures/code-review/triggers.json)：用于目标宿主触发测试；仅判断描述语义不等于实际自动加载测试。
- [职责决策场景](../tests/fixtures/code-review/collaboration-cases.json)：用于模拟选择、交接、停止和预算判断；不能代替真实分线、故障接续或并发运行。
- [行为自检](../tests/code-review-fixtures.test.mjs)：独立验证样例中的保护与真实回归，保证现有测试通过不掩盖样例缺陷。这里的业务代码有意保留缺陷供评测，不是生产实现。

在仓库根目录运行：

```sh
node scripts/validate.mjs
node --test tests/validate.test.mjs tests/code-review-fixtures.test.mjs
```

第二条需要现有 Python 3；不自动安装依赖。单个任务的现有检查见其 README。结构检查只证明包与引用完整，不证明审查质量；行为自检只证明样例的已知行为，不证明模型发现能力。

## 本轮运行约定

实际快照、输入副本与结果保存于仓库旁的 `code-review-workspace/iteration-1/`，避免将本机路径、依赖副本和模型输出加入安装包。`baseline/` 和 `candidate/` 包含完整 code-review、前端关联 Skill，以及冻结的 ponytail-review、karpathy-guidelines；独立文件摘要与 agent-fit 完整任务快照随轮保存。执行输入明确允许的操作和项目规则另存 AGENTS.md。

两个不继承父会话历史的执行者分别运行两个版本的三个发现任务，子任务内部不委派。宿主 turn_context 记录两者均为 gpt-6.1-sol/high，task_complete 和 token_usage_record 提供整组耗时与 token；这与仅有请求参数或自报不同。每个版本的三个任务共用一个上下文，此为有限的成组诊断，不能视为六次逐例独立重复；只有一轮也不能估计稳定性。任务输入未给候选与答案，但宿主共享文件系统，无法阻止越界读取，故不称干净隔离的发现评测。

父代理按 skill-creator 的 grader 方法核对实际报告与固定源码，保存含 `text`、`passed`、`evidence` 的 grading.json。宿主原始报告与工具轨迹另存，排除内部推理；已有命令结果可由轨迹核实，不依赖执行者自报。源码输入前后摘要亦核对不变，未观察到修改、递归委派或评分材料读取；这不等于强制权限隔离。上层规则要求的 agent-fit 启动定位与读取也出现在轨迹中，未将其误标为业务取证或候选泄漏。评分由主代理完成，未称独立盲评。逐例时间/token、账单与不可观察的硬约束标未知，不把整组总量重复计入每个任务。

输出通过 skill-creator 的 `eval-viewer/generate_review.py --static` 展示，沿用其字段 schema。界面中的 `with_skill` 对应本轮改造版，`without_skill` 对应实施前版本，并非无 Skill。该轮 feedback.json 用于保存逐项反馈；用户已在后续发布请求中明确确认验收通过，该请求作为本次验收记录，不虚构逐项反馈。

## 采用边界

规则效果、模板效果和协作效果按[计划](code-review-improvement-plan.md)分别验证。当前版能完成任务与比旧版更好是两个问题；历史环境不能恢复时，仍可验证当前版，但保留相对改进证据缺口。评测目录、查看器和历史元数据不是实际项目日常审查的运行依赖。

人工核实关键结论后可开展辅助审查试用；在指定真实业务仓库上完成试用前，不宣称真实项目验收完成。后续真实改动需包含适用的局部修复、跨调用链变化与关键边界，核对发现、遗漏、证据及建议可执行性。正式分发前另核对版本、依赖和实际加载结果；本轮不代替发布或自动合入门禁验证。
