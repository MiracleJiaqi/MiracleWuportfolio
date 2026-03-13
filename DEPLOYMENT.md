# 部署指南

## 项目架构

这是一个 **Full-Stack 项目**，包含：
- **前端**：React 19 + Vite + Tailwind CSS（构建到 `client/dist/`）
- **后端**：Express + tRPC + Node.js（构建到 `dist/index.js`）

## 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器（同时运行前端和后端）
pnpm dev

# 访问 http://localhost:3000
```

## 生产构建

```bash
# 构建前端和后端
pnpm build

# 输出结构
# dist/
#   ├── index.js          # 后端服务器
#   ├── client/           # 前端静态文件
#   │   ├── index.html
#   │   ├── assets/
#   │   └── ...
```

## 京东云服务器部署

### GitHub Actions 自动部署

项目已配置 GitHub Actions 工作流（`.github/workflows/deploy.yml`），每次推送到 `master` 分支时自动部署。

**所需的 GitHub Secrets：**
- `SSH_PRIVATE_KEY`: 京东云服务器的 SSH 私钥
- `SERVER_USER`: 服务器登录用户名（通常是 `root`）

### 手动部署步骤

1. **在京东云服务器上准备目录**

```bash
mkdir -p /PersonalWeb
chmod -R 755 /PersonalWeb
cd /PersonalWeb
```

2. **上传构建文件**

```bash
# 从本地上传 dist 文件夹到服务器
scp -r dist/ root@36.151.148.84:/PersonalWeb/
scp nginx.conf root@36.151.148.84:/PersonalWeb/
```

3. **启动后端服务**

```bash
cd /PersonalWeb
nohup node dist/index.js > app.log 2>&1 &
```

4. **启动 Nginx 容器**

```bash
docker run -d \
  --name GSManager3 \
  -p 80:80 \
  -p 443:443 \
  -v /PersonalWeb/dist:/usr/share/nginx/html:ro \
  -v /PersonalWeb/nginx.conf:/etc/nginx/nginx.conf:ro \
  nginx:latest
```

5. **验证部署**

```bash
# 检查 Node.js 进程
ps aux | grep "node dist/index.js"

# 检查 Nginx 容器
docker ps | grep GSManager3

# 测试服务
curl http://localhost
```

## Nginx 配置说明

`nginx.conf` 文件配置了以下内容：

- **静态文件缓存**：JS、CSS、图片等资源缓存 30 天
- **API 转发**：`/api` 路由转发到 Node.js 后端（`127.0.0.1:3000`）
- **SPA 路由**：所有未匹配的路由回退到 `index.html`
- **Gzip 压缩**：自动压缩文本和 JSON 响应
- **安全防护**：隐藏敏感文件（`.git`、`.env` 等）

## 环境变量

后端服务需要以下环境变量（已由 Manus 平台自动注入）：

- `DATABASE_URL`: 数据库连接字符串
- `JWT_SECRET`: Session 签名密钥
- `VITE_APP_ID`: OAuth 应用 ID
- `OAUTH_SERVER_URL`: OAuth 服务器地址
- 其他 Manus 平台提供的密钥

## 常见问题

### 1. Node.js 进程无法启动

检查日志文件：
```bash
cat /PersonalWeb/app.log
```

### 2. Nginx 无法连接到后端

确保 Node.js 进程正在运行：
```bash
ps aux | grep "node dist/index.js"
```

### 3. 静态文件 404

检查 Nginx 容器中的文件：
```bash
docker exec GSManager3 ls -la /usr/share/nginx/html/
```

### 4. 清理旧部署

```bash
# 停止并删除容器
docker stop GSManager3
docker rm GSManager3

# 杀死 Node.js 进程
pkill -f "node dist/index.js"

# 清理文件
rm -rf /PersonalWeb/dist/*
```

## 更新部署

每次推送到 `master` 分支时，GitHub Actions 会自动：
1. 检出代码
2. 安装依赖
3. 构建项目
4. 部署到京东云服务器
5. 重启服务

无需手动干预！
