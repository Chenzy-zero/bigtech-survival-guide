# 项目管理：GitHub Issue 是唯一任务入口

## 原则

所有需求、功能任务、文档任务、Bug 和技术债务都必须使用 GitHub Issue 管理。聊天讨论可以帮助澄清问题，但不替代 Issue；README 和 roadmap 只描述产品与阶段目标，不作为独立任务清单。

- Issues：https://github.com/Chenzy-zero/bigtech-survival-guide/issues
- Pull requests：https://github.com/Chenzy-zero/bigtech-survival-guide/pulls

## Issue 必填信息

每个 Issue 至少包含：

1. **背景/问题**：为什么要做。
2. **目标**：希望改变什么行为或体验。
3. **仓库路径**：指向至少一个真实存在的文档或代码路径，例如 `docs/game-design.md`。如果需要新增文件，必须同时引用现有设计文档，并列出拟新增的路径。
4. **范围**：本次做什么、不做什么。
5. **验收标准**：可检查、可验证的完成条件。
6. **类型**：需求、开发任务、Bug、文档或研究资料。

Bug 还应包括复现步骤、预期行为和实际行为。剧情任务应包含涉及章节、事件 ID（如已有）和预期分支/结局。

## Issue 与仓库文件的对应关系

- 产品方向和范围：`docs/product-requirements.md`
- 剧情、陷阱、反转与结局：`docs/game-design.md`
- 页面、事件模型与引擎：`docs/technical-design.md`
- AI 开发规则：`AGENTS.md`、`docs/ai-workflow.md`
- 研究素材和真实案例：`docs/research/sources.md`
- 阶段目标：`docs/roadmap.md`
- 实际代码：Issue 中填写对应的 `src/`、`tests/` 或配置路径。

路径必须真实存在；不能用模糊的“相关代码”代替。如果当前没有代码路径，就先引用设计文档，并把新路径列入交付项。

## 推荐流程

1. 搜索已有 Issues，确认没有重复。
2. 创建 Issue，写明目标、路径、范围和验收标准。
3. 在独立分支实施，保持改动与 Issue 范围一致。
4. 创建 PR，在正文中使用 `Closes #编号` 或 `Fixes #编号`，并说明变更文件和验证结果。
5. 审查并合并 PR；确认验收标准满足后关闭 Issue。

## 任务粒度

- 一个 Issue 尽量对应一个可审查、可验收的工作单元。
- 大功能可以拆分为多个子 Issue；每个子 Issue 都要对应具体文档/代码路径。
- 不为纯粹聊天想法创建没有目标的空 Issue；先澄清后，把确定的需求转成 Issue。
- 需求范围发生变化时，先更新 Issue，再继续实施。

## 完成定义

Issue 只有在相关变更进入目标分支、验收标准满足、必要验证已运行并记录后才算完成。未执行的测试不得标记为通过；尚未部署的功能不得声称已上线。
