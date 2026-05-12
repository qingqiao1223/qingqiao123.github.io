# PocketBase 部署指南

## 方案一：Zeabur（推荐，支持支付宝）

1. 打开 https://zeabur.com 用 GitHub 登录
2. 新建项目 → 选择「部署新服务」
3. 选择你的 GitHub 仓库，服务目录填 `pb-deploy`
4. Dockerfile 会自动识别，端口 8080
5. 部署后获得 URL：`https://你的项目.zeabur.app`
6. 访问该 URL 的 `/_/` 路径创建管理员账号
7. 在 Vercel 项目设置中添加环境变量：
   ```
   NEXT_PUBLIC_PB_URL=https://你的项目.zeabur.app
   ```
8. 重新部署 Vercel 项目即可

**优点：** 支持支付宝/微信支付，中国访问快，有免费额度

---

## 方案二：Fly.io（需信用卡）

```bash
# 1. 安装 flyctl
curl -L https://fly.io/install.sh | sh

# 2. 登录
fly auth login

# 3. 部署（在项目根目录运行）
fly launch --dockerfile pb-deploy/Dockerfile --region hkg

# 4. 部署后访问 https://你的项目.fly.dev/_/ 创建管理员
```

**优点：** 免费 3 台虚拟机，新加坡/香港节点，中国访问快

---

## 部署后初始化

无论用哪种方式，部署后都需要：

1. 访问 `https://你的地址/_/` 创建管理员账号
2. 登录管理后台
3. 运行初始化脚本创建数据库表：

```bash
cd 项目根目录
PB_ADMIN_EMAIL=你创建的管理员邮箱 \
PB_ADMIN_PASSWORD=你的管理员密码 \
PB_URL=https://你的地址 \
node scripts/setup-pb.mjs
```

4. 脚本会自动创建 `products`、`favorites`、`reports` 集合，并给 `users` 表添加自定义字段
5. 重启 PocketBase 使配置生效
