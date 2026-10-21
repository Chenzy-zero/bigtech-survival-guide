import './styles.css';
import { events, START_EVENT_ID } from './data/events';
import { chooseOption, getAvailableChoices, getCurrentEvent, startGame, type GameState } from './engine/game';
import { validateEvents } from './engine/validate-events';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('App root element #app was not found.');

const validationErrors = validateEvents(events, START_EVENT_ID);
if (validationErrors.length > 0) {
  app.innerHTML = `<main class="fatal-error"><h1>剧情数据需要修复</h1><p>开发校验发现以下问题：</p><ul>${validationErrors.map((error) => `<li>${escapeHtml(error)}</li>`).join('')}</ul></main>`;
  throw new Error(`Invalid game data: ${validationErrors.join('; ')}`);
}

let state: GameState | null = null;

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderHome(): void {
  state = null;
  app!.innerHTML = `
    <main class="page-shell home-shell">
      <div class="topline"><span class="brand-mark">大厂生存指南</span><span class="edition">内测版 0.1</span></div>
      <section class="hero-card">
        <div class="eyebrow"><span class="status-dot"></span> 反向职场模拟器</div>
        <p class="hero-kicker">欢迎入职，未来的核心骨干。</p>
        <h1>大厂生存<br /><span>指南</span></h1>
        <p class="hero-copy">这不是教你如何做好工作。<br />这是教你如何在“做好工作”不一定有用的地方活下去。</p>
        <div class="hero-stamp"><span class="stamp-icon">!</span><span>温馨提示：本公司价值观以实际发生为准。</span></div>
        <button class="primary-button start-button" id="start-game">开始试用期 <span aria-hidden="true">↗</span></button>
      </section>
      <div class="principle-grid" aria-label="游戏特点">
        <div class="principle"><span class="principle-number">01</span><strong>常识不保命</strong><p>一个回答不对，下一秒就可能收到未通过通知。</p></div>
        <div class="principle"><span class="principle-number">02</span><strong>态度很重要</strong><p>尤其是当结果不太重要的时候。</p></div>
        <div class="principle"><span class="principle-number">03</span><strong>活着就算赢</strong><p>至于项目有没有做好，那是另一个 KPI。</p></div>
      </div>
      <footer class="site-footer"><span>虚构公司 · 真实荒诞</span><span>请勿将游戏策略用于现实中的生产事故。</span></footer>
    </main>`;
  document.querySelector<HTMLButtonElement>('#start-game')?.addEventListener('click', () => {
    state = startGame(START_EVENT_ID);
    renderGame();
  });
}

function renderGame(): void {
  if (!state) return renderHome();
  const event = getCurrentEvent(events, state);
  if (event.ending) return renderEnding(event);

  const choices = getAvailableChoices(event, state);
  const decisionCount = state.decisions.length;
  const progressWidth = Math.min(94, Math.max(8, decisionCount * 11 + 8));
  const previousFeedback = state.lastFeedback
    ? `<aside class="feedback-card"><span class="feedback-label">上一选择的后果</span><p>${escapeHtml(state.lastFeedback)}</p></aside>`
    : '';

  app!.innerHTML = `
    <main class="page-shell game-shell">
      <header class="game-topbar"><button class="text-button" id="quit-game" aria-label="退出本局">← <span>暂离工位</span></button><span class="brand-mark">大厂生存指南</span><span class="run-count">第 ${decisionCount + 1} 次选择</span></header>
      <div class="progress-track" aria-label="本局进度"><span style="width:${progressWidth}%"></span></div>
      ${previousFeedback}
      <section class="scenario-card">
        <div class="scenario-meta"><span class="chapter-pill">${escapeHtml(event.chapter)}</span><span class="case-id">CASE ${String(decisionCount + 1).padStart(2, '0')}</span></div>
        <h1>${escapeHtml(event.title)}</h1>
        <p class="scenario-body">${escapeHtml(event.body)}</p>
      </section>
      <section class="choice-section" aria-labelledby="choice-heading">
        <div class="section-heading"><h2 id="choice-heading">你打算怎么做？</h2><span>请选择一个</span></div>
        <div class="choice-list">${choices.map((choice, index) => `
          <button class="choice-button" data-choice-id="${escapeHtml(choice.id)}">
            <span class="choice-key">${String.fromCharCode(65 + index)}</span>
            <span class="choice-text">${escapeHtml(choice.text)}</span>
            <span class="choice-arrow" aria-hidden="true">↗</span>
          </button>`).join('')}
        </div>
      </section>
      <div class="subtle-warning"><span aria-hidden="true">✳</span> 所有选择均可能被纳入你的成长档案。</div>
      <footer class="game-footer"><span>人力资源部 · 祝你工作愉快</span><span>${decisionCount} 个选择已记录</span></footer>
    </main>`;

  document.querySelector<HTMLButtonElement>('#quit-game')?.addEventListener('click', () => {
    if (window.confirm('确定要暂离工位并结束本局吗？本局选择不会保存。')) renderHome();
  });
  document.querySelectorAll<HTMLButtonElement>('[data-choice-id]').forEach((button) => {
    button.addEventListener('click', () => {
      if (!state) return;
      const choiceId = button.dataset.choiceId;
      if (!choiceId) return;
      state = chooseOption(events, state, choiceId);
      renderGame();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

function renderEnding(event: ReturnType<typeof getCurrentEvent>): void {
  if (!state || !event.ending) return;
  const ending = event.ending;
  const icon = ending.outcome === 'won' ? '✓' : '×';
  const decisions = state.decisions.map((decision, index) => `
    <li class="review-item"><span class="review-index">${String(index + 1).padStart(2, '0')}</span><div><strong>${escapeHtml(decision.eventTitle)}</strong><p>${escapeHtml(decision.choiceText)}</p></div></li>`).join('');
  const lastFeedback = state.lastFeedback
    ? `<aside class="feedback-card ending-feedback"><span class="feedback-label">最后一张工单</span><p>${escapeHtml(state.lastFeedback)}</p></aside>`
    : '';

  app!.innerHTML = `
    <main class="page-shell ending-shell">
      <header class="game-topbar"><span class="brand-mark">大厂生存指南</span><span class="ending-tag">${escapeHtml(ending.label)}</span></header>
      <section class="ending-card ${ending.outcome === 'won' ? 'ending-won' : 'ending-lost'}">
        <div class="ending-symbol" aria-hidden="true">${icon}</div>
        <p class="ending-eyebrow">${escapeHtml(event.chapter)}</p>
        <h1>${escapeHtml(ending.title)}</h1>
        <p class="ending-lead">${escapeHtml(ending.body)}</p>
        <div class="ending-divider"></div>
        <h2>组织给你的最终反馈</h2>
        <p class="ending-explanation">${escapeHtml(ending.explanation)}</p>
      </section>
      ${lastFeedback}
      <section class="review-card"><div class="section-heading"><h2>你的生存记录</h2><span>${state.decisions.length} 次选择</span></div><ol class="review-list">${decisions}</ol></section>
      <button class="primary-button restart-button" id="restart-game">重新入职 <span aria-hidden="true">↻</span></button>
      <p class="restart-note">每次重开，组织规则都一样荒诞。变化的是你。</p>
    </main>`;
  document.querySelector<HTMLButtonElement>('#restart-game')?.addEventListener('click', () => {
    state = startGame(START_EVENT_ID);
    renderGame();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

renderHome();
