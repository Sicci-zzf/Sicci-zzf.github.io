# Sicci-zzf.github.io

个人网站（Hexo + GitHub Pages），用于日常记录与写作。  
当前采用「源码与发布分离」的发布结构：`main` 存 Hexo 源码，`gh-pages` 存生成后的静态站点；旧站保存在 `legacy` 分支，随时可切换。

---

## 分支说明

- **main**：Hexo 源码（写文章、改主题、改配置都在这里）
- **gh-pages**：Hexo 生成后的静态文件（GitHub Pages 实际发布的内容）
- **legacy**：旧版网站备份（需要时可切回发布）

---

## 常用命令清单

### 本地预览
```bash
cd ~/my-site
hexo s
