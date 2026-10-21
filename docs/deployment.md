# 在线预览与静态部署

## 当前状态

游戏是中文静态网页，使用 Vite 构建。仓库已由所有者设为公开，所有者也明确允许游戏网站公开访问。GitHub Pages 尚未启用；在 Actions 出现成功的部署记录前，不要把预期 URL 当成真实可访问的试玩链接。

GitHub Pages 支持公开仓库使用 GitHub Free。发布的网站对公网可访问。发布仅包含构建后的静态游戏资源，不需要后端、数据库或 API 密钥。

## 首次启用 GitHub Pages

1. 打开仓库 [Settings → Pages](https://github.com/Chenzy-zero/bigtech-survival-guide/settings/pages)。
2. 在 **Build and deployment → Source** 中选择 **GitHub Actions**。
3. 保存设置。
4. 打开 [Actions → Deploy game preview](https://github.com/Chenzy-zero/bigtech-survival-guide/actions/workflows/deploy-pages.yml)。
5. 如果 main 分支最新一次部署在 Pages 尚未启用时失败，点击 **Run workflow**，选择 `main` 并运行；也可以在设置保存后推送后续提交触发自动部署。
6. 等待工作流成功，在运行详情的 `github-pages` environment 中打开站点 URL。

预期项目站点 URL 为 `https://chenzy-zero.github.io/bigtech-survival-guide/`。这是基于仓库名推导的预期地址；只有 GitHub Actions 部署成功并且页面可访问后，才算正式的试玩地址。

## 自动部署

工作流位于 `.github/workflows/deploy-pages.yml`：
- 每次 push 到 `main` 时自动测试、构建和部署。
- 支持从 Actions 页面手动运行。
- 构建命令通过 `--base=/bigtech-survival-guide/` 设置 GitHub Pages 项目子路径。
- 不需要额外的部署密钥，使用 GitHub Actions 的 Pages 与 OIDC 权限。

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

本地开发与普通预览使用根路径，Pages 部署则使用项目子路径。

## 故障排查

- 如果 `Configure GitHub Pages` 提示尚未启用 Pages，请先完成上面的 Settings → Pages 操作，再重新运行部署。
- 如果部署成功但页面 404，等待几分钟，并检查 Actions 的 `github-pages` environment URL 与静态资源路径。
- 不要把预期 URL 当作已经上线的链接；应以成功部署记录和浏览器访问结果为准。
