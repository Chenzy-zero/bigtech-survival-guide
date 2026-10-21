# 大厂生存指南 · BigTech Survival Guide

**名字叫《大厂生存指南》，但它并不打算教你如何正常地在大厂生存。**

一款手机优先的中文单页面荒诞职场选择游戏。玩家扮演刚毕业的求职者，从简历、项目面试、谈薪、口头与书面 Offer，一路经历入职、团建、早会、紧急任务和线上事故。

题干是生活化场景，不是谜语；选错了可能当场收到“面试未通过”或“岗位取消，暂不录用”的通知。溜须拍马、装忙和摸鱼有时能让你多活一会儿，但从来不是固定的正确答案。

## 在线试玩

🎮 **[打开游戏](https://chenzy-zero.github.io/bigtech-survival-guide/)**

## 本地运行

需要 Node.js 22 或兼容的现代 Node.js 版本。

```bash
npm install
npm run dev
```

运行单元测试、生产构建和 Chromium 浏览器测试（首次运行需安装 Chromium）：

```bash
npm test
npm run build
npx playwright install chromium
npm run test:e2e
npm run preview
```

浏览器测试覆盖 320、375、390、430 CSS 像素宽度、关键游戏流程、焦点迁移、进度条语义和选项触控高度。GitHub Actions 还会在 Pages 部署成功后，对线上试玩地址执行浏览器烟雾测试。自动化检查不替代真实手机和屏幕阅读器的人工验收。

## 当前原型

- 中文手机竖屏优先，打开页面即可开始。
- 每次展示一个生活化职场场景与 2–4 个具体选项。
- 简历、面试、薪资、Offer、入职、团建、日常汇报、紧急任务和事故处理都可能出现独立的即时失败结局。
- 失败后立即说明发生了什么，并提供重新入职入口。
- 不使用独立“线索”提示卡；通过场景、对话和结果呈现荒诞反转。
- 事件数据与游戏引擎分离，并在启动时校验重复 ID、无效跳转和不可达事件。
- 暂不包含账号、后端、数据库、复杂属性面板或运行时 AI 剧情生成。

## 项目管理

**所有需求、开发任务、文档任务和 Bug 都通过 GitHub Issue 管理。** 每个 Issue 必须指向仓库内真实存在的文档或代码路径，并有可验证的验收标准。PR 必须关联对应 Issue。

- [GitHub Issues](https://github.com/Chenzy-zero/bigtech-survival-guide/issues)
- [产品需求](docs/product-requirements.md)
- [游戏设计](docs/game-design.md)
- [技术方案](docs/technical-design.md)
- [在线预览与静态部署](docs/deployment.md)
- [Issue 管理规则](docs/project-management.md)
- [研究资料与真实案例来源](docs/research/sources.md)
- [AI 开发约定](AGENTS.md)

## 设计原则

1. **反职场鸡汤**：这是黑色幽默与荒诞讽刺，不是严肃的职场教学指南。
2. **场景清楚，后果荒诞**：不靠额外线索卡解谜，反转来自具体对话、组织反应和选择后果。
3. **快速失败**：每个阶段都可以独立结束游戏，不必坚持到统一大结局。
4. **简单优先**：轻量 Vite + TypeScript + 原生 CSS，不引入大型 UI 框架或后端。
5. **来源可追溯**：真实案例用于研究与启发，剧情使用虚构公司和复合情境，不把个体吐槽当作企业普遍事实。
6. **严肃对待现实伤害**：过劳等严重健康风险作为警示呈现，不当作轻佻笑料。

## 免责声明

本项目是虚构的职场荒诞讽刺游戏，不构成法律、医疗或职业咨询。现实案例仅用于研究和创作启发。
