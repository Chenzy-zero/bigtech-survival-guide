import { expect, test, type Page } from '@playwright/test';

const viewports = [
  { width: 320, height: 844 },
  { width: 375, height: 844 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
];

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => (
    document.documentElement.scrollWidth > document.documentElement.clientWidth
    || document.body.scrollWidth > document.documentElement.clientWidth
  ));
  expect(overflow, 'page should not scroll horizontally').toBe(false);
}

test.describe('mobile viewport smoke tests', () => {
  for (const viewport of viewports) {
    test(`home, scene, and ending fit at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('./');

      await expect(page.locator('.hero-card h1')).toBeVisible();
      await expectNoHorizontalOverflow(page);

      await page.getByRole('button', { name: /开始试用期/ }).click();
      const sceneHeading = page.getByRole('heading', { name: '简历投出去前十分钟' });
      await expect(sceneHeading).toBeVisible();
      await expect(sceneHeading).toBeFocused();
      await expectNoHorizontalOverflow(page);

      const choices = page.locator('.choice-button');
      await expect(choices).toHaveCount(3);
      for (const button of await choices.all()) {
        const box = await button.boundingBox();
        expect(box, 'choice button should have a measurable target').not.toBeNull();
        expect(box!.height, 'choice target should be at least 44 CSS px high').toBeGreaterThanOrEqual(44);
      }

      await page.getByRole('button', { name: /独立主导整个平台从 0 到 1/ }).click();
      const endingHeading = page.getByRole('heading', { name: '简历夸大，面试未通过' });
      await expect(endingHeading).toBeVisible();
      await expect(endingHeading).toBeFocused();
      await expectNoHorizontalOverflow(page);
    });
  }
});

test('player can start, choose, reach an ending, and restart with accessible progress', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');

  await page.getByRole('button', { name: /开始试用期/ }).click();
  const progress = page.getByRole('progressbar', { name: '当前剧情进度' });
  await expect(progress).toHaveAttribute('aria-valuenow', '1');
  await expect(progress).toHaveAttribute('aria-valuemax', '12');
  await expect(progress).toHaveAttribute('aria-valuetext', '第 1 / 12 个场景');

  const firstScene = page.getByRole('heading', { name: '简历投出去前十分钟' });
  await expect(firstScene).toBeFocused();
  await page.getByRole('button', { name: /写清自己做的接口和部署脚本/ }).click();

  const secondScene = page.getByRole('heading', { name: '面试官问你到底做了什么' });
  await expect(secondScene).toBeFocused();
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '2');
  await page.getByRole('button', { name: /说自己负责全链路/ }).click();

  const ending = page.getByRole('heading', { name: '项目追问穿帮，面试未通过' });
  await expect(ending).toBeFocused();
  await page.getByRole('button', { name: /重新入职/ }).click();

  await expect(page.getByRole('heading', { name: '简历投出去前十分钟' })).toBeFocused();
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
});

test('ironic survival path: flattery, visible paperwork, strategic coffee break', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  await page.getByRole('button', { name: /开始试用期/ }).click();

  const path = [
    'resume-specific', 'interview-specific', 'followup-know-metric',
    'salary-range', 'offer-wait', 'written-review',
    'onboarding-ask', 'team-attend', 'standup-praise',
    'praise-roadmap', 'busy-pace', 'showcase-boundary',
  ];
  for (const choiceId of path) {
    await page.locator(`[data-choice-id="${choiceId}"]`).click();
  }

  const ending = page.getByRole('heading', { name: '你没修 Bug，却被夸成了项目推进能手' });
  await expect(ending).toBeFocused();
  await expect(page.locator('.review-item')).toHaveCount(12);
  await expect(page.getByText(/以后专职负责每周汇报/)).toBeVisible();
});
