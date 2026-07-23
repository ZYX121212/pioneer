# Pioneer

Pioneer 是一个面向创业者的中英文全球创业资源目录。它不只收集链接，而是把开放计划、创业机构、创业活动、创业项目和创业指南整理成可比较、可判断、可行动的资料。

Pioneer is a bilingual, curated directory of global startup programs, institutions, events, startup projects, and practical founder guides.

## 在线网站

[pioneer-global-resources.hiayun.chatgpt.site](https://pioneer-global-resources.hiayun.chatgpt.site/)

## 项目内容

- 开放计划：加速器、创始人计划、创业课程和市场进入项目
- 创业机构：投资机构、孵化器、创业园区和大学平台
- 创业活动：全球创业大会、Demo Day 和产业活动
- 创业项目：按阶段、地区和领域整理的代表性创业公司
- 创业指南：从发现问题到融资、招聘和复盘的实用方法
- 中英文页面、站内搜索、分类筛选和分页
- RSS、日历订阅、资源提交和匿名访问统计

当前资料规模：

- 107 条中英文创业资源
- 14 篇中英文创业指南
- 公开计划、机构、活动和项目的独立详情页

## 本地运行

要求 Node.js `>=22.13.0`。

```bash
npm install
npm run dev
```

然后访问终端中显示的本地地址。

## 验证

```bash
npm run build
npm test
npm run lint
```

## 数据与持久化

项目使用 Cloudflare D1 保存：

- 匿名访问与页面行为统计
- Newsletter 订阅邮箱
- 用户提交的创业资源

本地开发由项目的 Vite 配置提供 D1 模拟环境。数据库结构和迁移位于 `db/` 与 `drizzle/`。

可选环境变量：

```bash
NEXT_PUBLIC_SITE_URL=https://example.com
```

未设置时，站点会使用 Pioneer 当前公开地址。

## 内容维护原则

Pioneer 的内容应遵守以下约束：

1. 优先使用机构或项目的官方来源。
2. 明确区分公开事实、编辑判断和行动前需要复核的信息。
3. 日期、申请状态、费用、投资条款和参与资格必须标注核验时间。
4. 中英文资源应保持同一条目覆盖，不应出现只有单一语言可访问的资源。
5. 收录不等于推荐、投资建议或结果保证。

## 贡献

欢迎通过 Issue 报告以下问题：

- 已过期的申请截止日或活动状态
- 失效的官方链接
- 中英文内容不一致
- 资料事实错误
- 移动端、可访问性或页面性能问题

提交代码前请运行构建、测试和代码检查。涉及资源数据的修改，请同时提供官方来源和核验日期。

## 开源许可

原创源代码与项目原创数据采用 [MIT License](LICENSE)。

第三方名称、商标、标识和来源于第三方网站的图片仍归各自权利人所有，不因本仓库的 MIT License 获得再许可。详见 [NOTICE](NOTICE.md)。

## 免责声明

Pioneer 提供资料整理和编辑判断，不构成投资、法律、税务或商业结果保证。申请条件、价格、条款和日期可能变化，行动前请以官方页面为准。
