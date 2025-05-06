# Docker Compose 部署架构

本文档详细介绍项目使用 Docker Compose 进行部署的架构设计，包括服务组成、网络配置、数据持久化等方面。

## 部署架构概述

项目使用 Docker Compose 进行多容器应用的定义和运行。这种方式可以通过单个 YAML 文件描述整个应用的服务组成，简化了部署过程，并确保了环境的一致性。

## Docker Compose 文件结构

项目使用多个 Docker Compose 文件来适应不同的环境和需求：

- `docker-compose.yml`：基础配置，定义所有服务的共同配置
- `docker-compose.override.yml`：本地开发环境配置
- `docker-compose.traefik.yml`：Traefik 反向代理配置
- `docker-compose.docs.yml`：文档服务配置

### 基础 Compose 文件分析

以下是 `docker-compose.yml` 的核心结构（示例）：

```yaml
version: '3'

services:
  # 后端 API 服务
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      - SECRET_KEY=${SECRET_KEY}
      - FIRST_SUPERUSER=${FIRST_SUPERUSER}
      - FIRST_SUPERUSER_PASSWORD=${FIRST_SUPERUSER_PASSWORD}
      - SMTP_HOST=${SMTP_HOST}
      - SMTP_USER=${SMTP_USER}
      - SMTP_PASSWORD=${SMTP_PASSWORD}
      - EMAILS_FROM_EMAIL=${EMAILS_FROM_EMAIL}
      - POSTGRES_SERVER=db
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=app
      - SENTRY_DSN=${SENTRY_DSN}
    depends_on:
      - db
    volumes:
      - ./backend:/app

  # 前端网站
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    environment:
      - API_URL=http://backend:8000
    depends_on:
      - backend

  # 数据库
  db:
    image: postgres:17
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=app
    volumes:
      - postgres-data:/var/lib/postgresql/data

  # 静态网站
  website:
    build:
      context: ./website
      dockerfile: Dockerfile

volumes:
  postgres-data:
```

## 服务组件详解

### 1. 后端服务 (Backend)

后端服务提供 API 功能，具有以下特点：

- 基于自定义 Dockerfile 构建
- 使用环境变量进行配置，从 GitHub Secrets 传递的参数
- 依赖数据库服务
- 挂载代码目录，便于开发

### 2. 前端服务 (Frontend)

前端服务提供用户界面，具有以下特点：

- 基于自定义 Dockerfile 构建
- 与后端服务通信提供完整功能
- 在生产环境中通常会被构建为静态资源

### 3. 数据库服务 (DB)

数据库服务存储应用数据，具有以下特点：

- 使用官方 PostgreSQL 镜像
- 通过挂载卷实现数据持久化
- 使用环境变量配置数据库参数

### 4. 网站服务 (Website)

网站服务提供静态网站内容，具有以下特点：

- 基于自定义 Dockerfile 构建
- 通常用于展示项目文档或营销内容

## 网络配置

Docker Compose 默认为应用创建一个自定义网络，所有服务都连接到这个网络，可以通过服务名相互访问。例如，后端服务可以通过 `db` 主机名连接到数据库服务。

在生产环境中，通常会使用 Traefik 配置：

```yaml
# docker-compose.traefik.yml 示例
services:
  traefik:
    image: traefik:v2.5
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./traefik/config:/etc/traefik
    command:
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.httpchallenge=true"
      - "--certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web"
      - "--certificatesresolvers.letsencrypt.acme.email=${ADMIN_EMAIL}"
      - "--certificatesresolvers.letsencrypt.acme.storage=/etc/traefik/acme.json"

  backend:
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.backend.rule=Host(`api.${DOMAIN}`)"
      - "traefik.http.routers.backend.entrypoints=websecure"
      - "traefik.http.routers.backend.tls.certresolver=letsencrypt"

  frontend:
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.frontend.rule=Host(`${DOMAIN}`)"
      - "traefik.http.routers.frontend.entrypoints=websecure"
      - "traefik.http.routers.frontend.tls.certresolver=letsencrypt"
```

## 数据持久化

Docker Compose 使用命名卷来持久化数据。在上面的示例中，创建了一个名为 `postgres-data` 的卷来存储 PostgreSQL 数据。

这种方式确保即使容器被删除，数据也会保留，并且可以被新创建的容器使用。

## 环境变量管理

项目使用多种方式管理环境变量：

1. **GitHub Secrets**：用于 CI/CD 流程中的敏感变量
2. **.env 文件**：用于本地开发环境
3. **环境变量直接注入**：在 Docker Compose 文件中直接定义

CI/CD 工作流会将 GitHub Secrets 转换为环境变量，然后传递给 Docker Compose 命令：

```yaml
env:
  SECRET_KEY: ${{ secrets.SECRET_KEY }}
  POSTGRES_PASSWORD: ${{ secrets.POSTGRES_PASSWORD }}
steps:
  - run: docker compose -f docker-compose.yml --project-name ${{ secrets.STACK_NAME }} build
```

## 部署优化

### 构建缓存利用

为了加速构建过程，Docker 的构建缓存是一个重要因素。在 Dockerfile 中，应当遵循以下原则：

1. 将不常变化的层（如依赖安装）放在前面
2. 将频繁变化的层（如应用代码）放在后面

例如，对于 Python 后端：

```dockerfile
FROM python:3.10

WORKDIR /app

# 先复制并安装依赖
COPY requirements.txt .
RUN pip install -r requirements.txt

# 再复制应用代码
COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 多阶段构建

对于前端应用，可以使用多阶段构建减小最终镜像大小：

```dockerfile
# 构建阶段
FROM node:16 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 扩展配置

对于更复杂的部署需求，可以考虑以下扩展：

### 服务健康检查

```yaml
services:
  backend:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### 资源限制

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

## 故障排除

### 容器无法启动

1. 检查 Docker Compose 日志：`docker compose logs <service_name>`
2. 验证环境变量是否正确传递
3. 检查网络配置和端口冲突
4. 验证卷挂载权限

### 服务之间无法通信

1. 确认服务都在同一个 Docker 网络中
2. 验证服务名是否正确（用于 DNS 解析）
3. 检查防火墙或安全组设置

## 安全考虑

1. **不存储敏感信息**：不要在 Docker Compose 文件或 Dockerfile 中硬编码敏感信息
2. **使用非特权用户**：在 Dockerfile 中创建并使用非 root 用户运行应用
3. **限制容器权限**：使用 `cap_drop` 和 `cap_add` 限制容器权限
4. **定期更新基础镜像**：保持基础镜像为最新版本，修复安全漏洞 