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
- 生产已配置登录签名 secret。邮件服务仍未配置，因此邮箱验证、密码找回和真实通知投递尚未完成。

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
