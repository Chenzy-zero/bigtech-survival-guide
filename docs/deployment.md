# 在线预览与静态部署

## 当前状态

游戏是中文静态网页，使用 Vite 构建。仓库目前为私有仓库，且尚未启用 GitHub Pages；在 Pages 成功发布前，不要把预期 URL 当成真实可访问的试玩链接。

GitHub Pages 对私有仓库的支持取决于 GitHub 计划。即使源码仓库保持私有，发布的网站也可能对公网开放。请先确认你接受网站内容公开，再启用部署；本项目不会自动把源码仓库改为公开。

## GitHub Pages 部署准备

部署工作流位于 `.github/workflows/deploy-pages.yml`，默认关闭，不会因普通 push 自动发布。它只会在仓库变量 `ENABLE_GITHUB_PAGES` 精确等于 `true` 时运行。

1. 确认当前 GitHub 计划支持从私有仓库发布 Pages。
2. 打开仓库 **Settings → Pages**，将 **Build and deployment → Source** 设为 **GitHub Actions**。
3. 先确认发布站点对外可见性符合预期。普通 GitHub Pages 站点通常是公开网站；私有源码不代表网站私有。
4. 打开 **Settings → Secrets and variables → Actions → Variables**，新增变量：
   - Name: `ENABLE_GITHUB_PAGES`
   - Value: `true`
5. 推送到 `main` 后工作流会自动测试、构建并发布；也可以在 **Actions → Deploy game preview → Run workflow** 手动运行。
6. 在 Actions 的成功部署记录中打开 `github-pages` environment 的站点 URL。项目站点的预期地址通常是 `https://Chenzy-zero.github.io/bigtech-survival-guide/`，但只有成功部署后才算生效。

工作流不需要额外的 API Token 或第三方部署密钥。它会先运行测试，再构建和发布 `dist`，并使用最小化的 Pages 部署权限。Pages 构建通过 Vite 的 `--base=/bigtech-survival-guide/` 参数设置项目子路径；本地开发和普通预览继续使用根路径。

## 如果当前计划不支持私有仓库 Pages

不要为了部署而直接公开源码仓库。可以选择 Cloudflare Pages、Vercel 等支持连接私有 GitHub 仓库的静态托管服务；首次连接需要仓库所有者在相应服务完成 OAuth 授权。发布后的网站仍可能是公开的，需要在服务控制台确认访问权限。

## 本地运行

需要 Node.js 22 或兼容的现代 Node.js：

```bash
npm install
npm run dev
```

本地生产构建与预览：

```bash
npm test
npm run build
npm run preview
```
