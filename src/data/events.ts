import type { GameEvent } from '../engine/game';

export const START_EVENT_ID = 'resume-001';

const fail = (id: string, chapter: string, title: string, body: string, explanation: string): GameEvent => ({
  id, chapter, title, body,
  ending: { outcome: 'lost', label: '游戏结束', title, body, explanation },
});

const win = (id: string, chapter: string, title: string, body: string, explanation: string): GameEvent => ({
  id, chapter, title, body,
  ending: { outcome: 'won', label: '暂时存活', title, body, explanation },
});

export const events: GameEvent[] = [
  {
    id: 'resume-001', chapter: '求职 · 简历筛选', title: '简历投出去前十分钟',
    body: '你负责过学校项目里的登录接口和部署脚本。整个项目有四个人一起做，今晚你正准备把项目经历写进简历。',
    choices: [
      { id: 'resume-specific', text: '写清自己做的接口和部署脚本，以及实际结果', feedback: 'HR 看得出你具体做过什么，简历进入下一轮。面试官准备追问这两块工作。', nextEventId: 'interview-project-002' },
      { id: 'resume-bluff', text: '写成“独立主导整个平台从 0 到 1”', feedback: '面试官追问了你没实际做过的架构设计。简历上的“主导”经不起两句话追问，流程结束。', nextEventId: 'ending-resume-bluff' },
      { id: 'resume-vague', text: '写“参与系统建设，协同推进业务闭环”', feedback: 'HR 看完还是不知道你具体做了什么。简历筛选未通过。', nextEventId: 'ending-resume-vague' },
    ],
  },
  {
    id: 'interview-project-002', chapter: '求职 · 技术面试', title: '面试官问你到底做了什么',
    body: '面试官翻到你的项目经历：“这个登录接口是你负责的？具体哪部分是你自己写的？”',
    choices: [
      { id: 'interview-specific', text: '说清鉴权逻辑、错误处理和自己补的测试', feedback: '面试官继续往下问实现细节，你能说清楚。接下来，他想确认项目结果是不是也有依据。', nextEventId: 'interview-metric-003' },
      { id: 'interview-claim', text: '说自己负责全链路，架构和上线都是自己拍板', feedback: '面试官让你画出架构并解释关键取舍，你讲不下去了。面试未通过。', nextEventId: 'ending-interview-claim' },
      { id: 'interview-passive', text: '说主要是师兄安排的，自己就是照着文档写', feedback: '面试官没听到你对实现的理解，也没法判断你能独立承担什么工作。面试未通过。', nextEventId: 'ending-interview-passive' },
    ],
  },
  {
    id: 'interview-metric-003', chapter: '求职 · 技术面试', title: '面试官追问项目数据',
    body: '面试官问：“你简历上写登录成功率提高了 20%，这个数字是怎么统计出来的？”',
    choices: [
      { id: 'followup-know-metric', text: '说明统计口径、对比时间段和数据来源', feedback: '面试官认可你知道数字从哪里来，开始和 HR 沟通薪资范围。', nextEventId: 'salary-expectation-004' },
      { id: 'followup-fake-metric', text: '临时编一个数据平台的名字，赌他不会细问', feedback: '面试官追问查询条件和统计周期，你答不上来。对方结束了面试。', nextEventId: 'ending-metric-fake' },
      { id: 'followup-no-data', text: '承认当时没统计成功率，说明自己实际验证过什么', feedback: '你没有把没有的数据编出来，也能解释测试覆盖和已知限制。面试继续进入薪资沟通。', nextEventId: 'salary-expectation-004' },
    ],
  },
  {
    id: 'salary-expectation-004', chapter: '求职 · 薪资沟通', title: 'HR 问你的期望薪资',
    body: '招聘信息写的月薪范围是 25–35k，你现在月薪 18k。HR 在电话里问：“你期望多少？我们尽量一次聊清楚。”',
    choices: [
      { id: 'salary-range', text: '报 30k 左右，并问清固定工资和绩效奖金占比', feedback: '双方的预期大致对上了。HR 说业务面已经通过，口头 Offer 今天可以先通知你。', nextEventId: 'verbal-offer-005' },
      { id: 'salary-anything', text: '说“我都可以，按公司标准来”', feedback: 'HR 按预算下沿给了方案，你当场答应。收到明细才发现固定工资远低于预期，流程到此结束。', nextEventId: 'ending-salary-low' },
      { id: 'salary-high', text: '说至少 50k，不到这个数就没必要聊了', feedback: '这个数字超出岗位预算太多，HR 礼貌地结束了沟通。', nextEventId: 'ending-salary-high' },
    ],
  },
  {
    id: 'verbal-offer-005', chapter: '求职 · 口头 Offer', title: '电话里说你已经通过了',
    body: 'HR 打电话说薪资基本谈妥，正式 Offer 这周发。你还在现在的公司，主管刚好问你下个月能不能继续负责一个项目。',
    choices: [
      { id: 'offer-wait', text: '等书面 Offer 和入职条件确认后再做决定', feedback: '你没有急着辞职。几天后，正式 Offer 发到了邮箱，你可以逐项核对。', nextEventId: 'written-offer-006' },
      { id: 'offer-resign', text: '今晚就提离职，证明自己真的想加入新公司', feedback: '你已经交了辞职申请。三天后 HR 发来消息：“很抱歉，岗位因业务调整取消，暂不录用。”', nextEventId: 'ending-offer-cancelled' },
      { id: 'offer-announce', text: '先告诉现主管自己拿到 Offer，准备离开', feedback: '现公司立刻把你从下季度项目中撤下。新公司随后通知岗位还在审批，无法确认入职日期。两边都没给你确定答复。', nextEventId: 'ending-resign-announced' },
    ],
  },
  {
    id: 'written-offer-006', chapter: '求职 · 书面 Offer', title: '正式 Offer 到邮箱了',
    body: '邮件里的年包看起来不错，但奖金写着“视公司及个人绩效而定”，岗位名称也和面试时说的有点不一样。',
    choices: [
      { id: 'written-review', text: '逐项核对固定薪资、奖金、岗位职责和入职日期', feedback: 'HR 补充确认了关键条款。你接受 Offer，准备第一天报到。', nextEventId: 'onboarding-007' },
      { id: 'written-sign', text: '只看总包数字，马上点接受', feedback: '入职后你才发现奖金不是保证发放，岗位职责也多了一大块。HR 回答：“以你签署的文件为准。”', nextEventId: 'ending-offer-terms' },
      { id: 'written-threat', text: '把 Offer 截图发到网上，要求 HR 当天加薪', feedback: 'HR 撤回了尚未完成审批的录用流程。你的入职安排取消。', nextEventId: 'ending-offer-withdrawn' },
    ],
  },
  {
    id: 'onboarding-007', chapter: '入职 · 第一天', title: '入职系统要求填写花名',
    body: '第一天办入职，HR 说部门群里大家都用花名。你的工牌暂时只印了本名，系统里有一栏等你填写。',
    choices: [
      { id: 'onboarding-ask', text: '问清是不是必填，再按团队实际要求处理', feedback: 'HR 说可以先用本名。你进了部门群，准备参加第一次周会。', nextEventId: 'team-008' },
      { id: 'onboarding-pick', text: '随手取个名字，先把入职流程走完', feedback: '系统终于放行。你领到电脑，周五下班前收到了团建通知。', nextEventId: 'team-008' },
      { id: 'onboarding-rude', text: '当着全组说这套文化很幼稚，拒绝参加介绍', feedback: '你还没拿到系统权限，就先被要求和 HR 沟通“团队融入方式”。试用期流程提前结束。', nextEventId: 'ending-onboarding-mismatch' },
    ],
  },
  {
    id: 'team-008', chapter: '入职 · 第一次团建', title: '周五 17:50，主管发来团建通知',
    body: '群里说今晚聚餐“完全自愿”。十分钟后，主管私聊你：“大家都去，你怎么还没出发？”',
    choices: [
      { id: 'team-attend', text: '先去露个面，看看大家怎么安排', feedback: '你到了餐厅，发现这顿饭还安排了新人轮流自我介绍。周一早会，你第一次汇报工作。', nextEventId: 'standup-009' },
      { id: 'team-decline', text: '说明今晚有安排，礼貌拒绝', feedback: '主管回了句“没事”。周一的试用期反馈里，却多了一句“团队融入需要加强”。', nextEventId: 'ending-teamfit' },
      { id: 'team-fake', text: '说自己临时加班，实际去吃火锅', feedback: '同事在另一家店碰见你，还把照片发进了部门群。主管回复：“原来你今天也挺忙。”', nextEventId: 'ending-team-photo' },
    ],
  },
  {
    id: 'standup-009', chapter: '工作 · 第一次早会', title: '早会轮到你汇报',
    body: '昨天你排查了一个线上慢请求，发现是数据库索引缺失，已经修复。主管看着你：“简单说下昨天做了什么。”',
    choices: [
      { id: 'standup-report', text: '说清问题、原因、修复结果和接下来要做的事', feedback: '你把事情讲明白了。主管接着说：“好，今天再顺手把相邻几个接口也查一下。”', nextEventId: 'urgent-010' },
      { id: 'standup-vague', text: '说“持续推进中，整体进展符合预期”', feedback: '主管问你到底修了什么，你还是没说清楚。早会结束后，任务被转给了另一个人。', nextEventId: 'ending-standup-vague' },
      { id: 'standup-steal', text: '把同事做的监控面板说成自己主导的', feedback: '同事当场补充了提交记录和实际分工。主管让你会后留下，试用期评价随即终止。', nextEventId: 'ending-credit-steal' },
    ],
  },
  {
    id: 'urgent-010', chapter: '工作 · 临时紧急任务', title: '18:40，领导说今晚必须搞定',
    body: '明早要给业务演示，测试环境刚刚挂了，核心流程还有一个偶发错误。领导在群里问：“今晚能不能保证？”',
    choices: [
      { id: 'urgent-scope', text: '说明现状，提出缩小范围或回滚，并约定验收方式', feedback: '领导同意先把核心流程跑稳。演示前还是出了问题，线上告警开始响。', nextEventId: 'incident-011' },
      { id: 'urgent-promise', text: '直接回复“保证完成”，一个人熬夜扛下来', feedback: '你承诺了一个自己无法控制的结果。凌晨你还在修复，身体已经出现明显不适，游戏提前结束。', nextEventId: 'ending-overtime' },
      { id: 'urgent-slide', text: '先把进度 PPT 做漂亮，代码问题明天再说', feedback: '汇报里的进度条全绿，演示时核心流程却无法登录。领导认为你汇报失实，试用期结束。', nextEventId: 'ending-slide-only' },
    ],
  },
  {
    id: 'incident-011', chapter: '工作 · 线上事故', title: '登录挂了，主管先问谁负责',
    body: '上线后用户登录失败。主管在群里问：“谁最后验收的？先给我一个名字。”你知道是配置问题，但根因还没确认。',
    choices: [
      { id: 'incident-facts', text: '先止损并说明影响范围、当前进展和下次更新时间', feedback: '回滚后登录恢复。第二天，团队开了事故复盘会。', nextEventId: 'retro-012' },
      { id: 'incident-blame', text: '没查清楚就说是平台组环境的问题', feedback: '平台组贴出了配置变更记录，证明问题来自你的发布。你被认定为隐瞒事实，立即出局。', nextEventId: 'ending-scapegoat' },
      { id: 'incident-silent', text: '偷偷修好，不在群里更新，等大家自己发现', feedback: '登录恢复了，但业务和客服仍按故障状态通知用户。复盘时，你因为没有同步处理状态被判定为不可靠。', nextEventId: 'ending-incident-silent' },
    ],
  },
  {
    id: 'retro-012', chapter: '工作 · 事故复盘', title: '复盘会上，主持人说大家坦诚一点',
    body: '会议标题写着“无责复盘”，投影上却有一张按姓名排列的责任表。主管看向你：“你觉得这次问题主要出在哪里？”',
    choices: [
      { id: 'retro-action', text: '按时间线讲事实，分清已知、未知和后续行动', feedback: '你没有把所有责任推给别人，也没有把系统问题全揽到自己身上。行动项有了负责人和验证时间。', nextEventId: 'ending-survivor' },
      { id: 'retro-self-blame', text: '说主要是自己能力不够，以后一定更自驱', feedback: '会议纪要把你的表态记成了根因，配置变更和发布流程没有进入整改清单。你成了唯一的整改负责人。', nextEventId: 'ending-self-blame' },
      { id: 'retro-empty', text: '说后续要加强协同、沉淀方法论、形成闭环', feedback: '会议记录很有气势，但没人知道谁要在什么时候做什么。第二天，复盘被退回要求“补充可落地动作”。', nextEventId: 'ending-retro-empty' },
    ],
  },

  fail('ending-resume-bluff', '结局 · 简历筛选', '简历夸大，面试未通过', '面试官问了两句你没实际做过的架构设计，招聘流程就结束了。', '你把团队成果写成了个人主导，后续追问无法自洽。'),
  fail('ending-resume-vague', '结局 · 简历筛选', '简历没有说清你做了什么', 'HR 看完只知道你“参与过项目”，看不出你的具体贡献。简历未通过筛选。', '“协同推进”“形成闭环”没有回答你解决了什么问题。黑话把你的工作藏了起来。'),
  fail('ending-interview-claim', '结局 · 技术面试', '项目追问穿帮，面试未通过', '你把自己说成全链路负责人，却无法解释架构、取舍和上线过程。面试官礼貌地结束了对话。', '你输在把别人的工作包装成自己的经历。面试官问的不是术语，而是你是否真的做过。'),
  fail('ending-interview-passive', '结局 · 技术面试', '无法说明个人贡献，面试未通过', '你反复说自己按安排完成任务，却讲不清为什么这么做、如何验证。面试流程到此结束。', '参与团队项目并不丢人，但需要说清自己做了什么、理解了什么，以及哪些部分不是自己负责的。'),
  fail('ending-metric-fake', '结局 · 技术面试', '数据是编的，面试结束', '面试官继续追问统计口径，你编不下去了。对方记下“项目数据无法验证”，结束面试。', '为了让简历更好看而临时编造数据，是一个可以当场触发失败的选择。'),
  fail('ending-salary-low', '结局 · 薪资沟通', '你说“都可以”，结果真的都由公司决定', 'HR 给了预算下沿的方案，你没问固定工资和绩效比例就答应了。你发现条件不符合预期时，招聘流程已经关闭。', '问题不是不能灵活谈薪，而是你把关键条件留给对方单方面解释，随后又失去了重新谈的空间。'),
  fail('ending-salary-high', '结局 · 薪资沟通', '期望薪资超出预算，流程终止', '岗位预算最高 35k，你开口要 50k 并拒绝继续沟通。HR 结束了流程。', '可以提出高于范围的要求，但在没有了解预算时直接把谈判变成最后通牒，可能让沟通结束。'),
  fail('ending-offer-cancelled', '结局 · 口头 Offer', '你先辞职了，岗位却取消了', '你递交辞职后，HR 发来消息：“很抱歉，岗位因业务调整取消，暂不录用。”新工作没有开始，旧工作也回不去了。', '口头沟通不等于书面录用条件已经确认。这是虚构的复合情境，不指向某一家真实公司。'),
  fail('ending-resign-announced', '结局 · 口头 Offer', '两边都知道你要走，但没有一边给准话', '现公司撤掉了你的后续安排，新公司却说岗位还在审批。你失去了当前项目，也没有确定的新入职日期。', '你把尚未落定的口头消息当成确定结果提前摊牌，组织流程却没有按预期同步推进。'),
  fail('ending-offer-terms', '结局 · 书面 Offer', '总包看着不错，合同不是这么写的', '入职后你发现奖金并不保证发放，岗位职责也和面试时说的不一样。HR 只回复：“以签署文件为准。”', '数字很大不代表每一部分都是固定收入。'),
  fail('ending-offer-withdrawn', '结局 · 书面 Offer', 'Offer 流程被撤回', '你把尚未完成审批的 Offer 截图发到网上要求加薪，HR 随后通知录用流程终止。', '谈条件本身不是问题；把未确认的招聘信息公开施压，可能让原本还能协商的事情直接结束。'),
  fail('ending-onboarding-mismatch', '结局 · 入职第一天', '入职流程提前结束', '你还没拿到系统权限，就先被要求和 HR 沟通“团队融入方式”。试用期流程没有继续。', '剧情讽刺的是形式主义，不代表真实公司都要求员工使用花名。'),
  fail('ending-teamfit', '结局 · 团建', '自愿团建，留下了不够融入的记录', '你礼貌拒绝周五聚餐。周一的试用期反馈里，却多了一句“团队融入需要加强”。', '团建本来是社交活动，却被拿来衡量工作态度。'),
  fail('ending-team-photo', '结局 · 团建', '请假去团建，结果照片先到了', '你说自己临时加班，实际去吃火锅。同事把合照发进群里，主管回复：“原来你今天也挺忙。”', '一张照片比你的工作成果更快进入管理视野。'),
  fail('ending-standup-vague', '结局 · 日常汇报', '汇报很顺，工作被转给别人了', '主管听不出你昨天完成了什么，把任务转给了一个能说清进展的人。', '“持续推进”没有提供进展、结果或下一步。'),
  fail('ending-credit-steal', '结局 · 同事关系', '提交记录比你的说法更快到场', '你把同事的监控面板说成自己主导的。同事打开提交记录，试用期评价当场结束。', '抢功可能短暂提高可见度，但团队协作工具往往能追溯实际贡献。'),
  fail('ending-overtime', '结局 · 紧急任务', '你的身体先于项目触发了告警', '凌晨你仍在独自修复，已经出现明显不适。游戏在这里中断，不再要求你用健康换一个“态度很好”的评价。', '这是对无边界工作和过劳风险的警示性结局，不把身体伤害当成奖励或轻松笑料。'),
  fail('ending-slide-only', '结局 · 紧急任务', 'PPT 全绿，登录页面全红', '汇报里的进度条很好看，演示时核心流程却无法登录。领导认为你汇报失实，试用期结束。', '可见的进度不能替代实际交付。'),
  fail('ending-scapegoat', '结局 · 线上事故', '甩锅失败，变更记录对上了', '平台组贴出配置记录，证明问题来自你的发布。你因为在没有证据时指责别人而出局。', '事故处理最需要的是止损和事实。'),
  fail('ending-incident-silent', '结局 · 线上事故', '问题修好了，大家还以为系统挂着', '你悄悄修复了登录，却没有通知业务和客服。复盘认定你没有同步关键信息。', '只修好代码并不等于事故处理完成。'),
  fail('ending-self-blame', '结局 · 事故复盘', '你把系统问题全写成了个人问题', '纪要把你的“能力不足”记成根因，配置变更和发布流程没有进入整改清单。所有行动项都落在你一个人身上。', '把所有责任揽到自己身上看起来很有态度，却让真正能避免复发的流程问题无人处理。'),
  fail('ending-retro-empty', '结局 · 事故复盘', '复盘被退回：请补充可落地动作', '会议纪要写满“加强协同、沉淀方法论、形成闭环”，但没有负责人、截止时间或验证方式。第二天，复盘被退回。', '这些词并非天然无用；问题在于它们没有落到具体行动。'),
  win('ending-survivor', '结局 · 暂时存活', '你暂时活下来了', '你按时间线说明了事故经过，把事实、未知项和后续动作分开。会议结束时，每项整改都有负责人和验证时间。', '这不是标准答案，也不意味着组织突然变得公平。只是这一次，具体事实比态度表演更有用。'),
];
