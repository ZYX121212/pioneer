# 邮箱账号登录

Pioneer 支持邮箱和密码注册、登录、修改密码与退出，无需 ChatGPT 账号。ChatGPT 仍为可选登录方式。界面入口为 `/login` 与 `/en/login`，私密工作台的登录按钮进入对应入口。

## 账号与数据

- Better Auth 1.7.7 管理密码哈希、签名会话 cookie、过期、退出及密码重设。
- D1 的 `pioneer_auth_*` 表保存账号、会话、验证记录及登录配额。新增迁移为 `drizzle/0009_overjoyed_lord_hawal.sql`。
- 生产 cookie 使用 HttpOnly、Secure 与 SameSite=Lax；身份由服务器读取会话，不接受浏览器提交的用户 ID。
- 邮箱账号的工作台用户 ID 使用 `email:` 前缀，与既有 ChatGPT 身份分开。相同邮箱不会自动合并或覆盖原工作台。
- 用户账号注册后可以使用工作台。验证邮箱前，通知接口拒绝读取及修改通知偏好，管理员检查也拒绝该身份。
- 管理员仍需在 `ADMIN_EMAILS` 中。验证后的邮箱账号与原 ChatGPT 账号都可以通过同一服务端权限检查，注册一个相同邮箱不能取得权限。
- 修改密码时撤销其他会话；重设密码时撤销全部原会话。

## 运行配置

- `PIONEER_AUTH_SECRET`：32 字符以上的随机秘密，使用 Sites runtime secret 配置。换密钥会使现有签名 cookie 失效。
- `PIONEER_AUTH_ORIGIN`：生产默认固定为当前发布域名；本地可使用 `http://localhost:3000`。不会从任意请求头推断回跳域名。
- 邮箱验证和密码找回复用 `docs/email-delivery.md` 中的邮件配置。邮件未启用时，界面明确显示“暂未启用”，不会声称已发送验证或重设邮件。
- 生产已配置登录签名 secret 和 Resend 发送密钥。测试邮件获服务商接收，收件与正式发件域名仍未验证；账号邮件和通知均未启用。

## 无自有域名的 Brevo 账号邮件方案

账号验证和密码找回支持独立使用 Brevo HTTP API；通知队列继续使用 Resend，两者不会共用密钥或重试窗口。

1. 用户本人注册 Brevo，设置密码并完成邮箱验证。在 Senders 中添加自己能够收信的发件邮箱并完成验证；确认账号已获准发送 transactional email。
2. 保存 `BREVO_API_KEY` 为 Sites secret，设置 `ACCOUNT_MAIL_PROVIDER=brevo`、`ACCOUNT_MAIL_FROM=已验证邮箱`。`MAIL_SITE_ORIGIN` 必须是当前 Pioneer 生产 origin。`ACCOUNT_MAIL_DELIVERY_ENABLED=false` 时不会启用任何账号邮件回调。
3. 真实发送并确认收信后，再将 `ACCOUNT_MAIL_DELIVERY_ENABLED=true` 部署生效。此开关独立于通知的 `MAIL_DELIVERY_ENABLED`；不能把原有 Resend Key 当作 Brevo Key。
4. 邮件开启后，注册自动发送验证邮件；账号设置仍允许重新发送。注册可直接进入工作台，未经验证的邮箱仍不能取得通知和管理员权限。请求密码找回后，必须从真实收件箱取得重设链接，重设令牌只可用一次，全部旧会话失效。

Brevo 对免费邮箱采用服务商发件地址替换作为过渡措施，长期仍建议自有域名。网站已有的 chatgpt.site 地址不能替代发件域名所有权。依据：[发件人验证](https://help.brevo.com/hc/en-us/articles/208836149-Create-a-new-sender-From-name-and-From-email)、[免费邮箱地址替换](https://help.brevo.com/hc/en-us/articles/14925263522578-Comply-with-Gmail-Yahoo-and-Microsoft-s-requirements-for-email-senders)、[HTTP 发信](https://developers.brevo.com/reference/send-transac-email)。

当前 Brevo 账号注册、发件人验证、密钥配置及真实验证/重设邮件收信均为**未验证**。自动注册页面打开失败，尚未创建 Brevo 账号。本地受控 API 回归测试不代表真实投递成功。生产接口探测曾被 Cloudflare 403 拦截，也未证明生产注册成功。

## 验证

`npm test` 覆盖密码哈希、伪造会话、退出、来源检查、D1 登录配额、验证与密码重设的一次性处理。邮件测试使用受控服务商响应，不证明真实投递。

启动本地预览并应用迁移后，运行：

```sh
node --test tests/integration/email-auth-preview.mjs tests/integration/workspace-preview.mjs
```

这组测试只允许 localhost/127.0.0.1，实际使用本地 D1；覆盖无 ChatGPT 身份的注册、登录、工作台持久化、账号隔离、密码修改、会话撤销、未验证邮箱权限、同源限制与双语页面。测试账号使用 example.org，不在生产创建测试用户。

本地浏览器已验证登录、项目保存、退出、再次登录与资料恢复。手机宽度下登录表单可使用。

官方资料：

- https://better-auth.com/docs/authentication/email-password
- https://better-auth.com/docs/reference/security
- https://better-auth.com/docs/concepts/database
