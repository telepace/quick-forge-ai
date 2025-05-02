# 测试环境部署流程

本文档详细介绍了使用 GitHub Actions 自托管 Runner 实现测试环境 (Staging) 的自动化部署流程。

## 部署流程概述

测试环境部署是在代码推送到 `main` 分支时自动触发的 CI/CD 流程。这个流程使用 Docker Compose 构建和部署应用程序的所有服务。

## 工作流文件分析

测试环境部署使用 `.github/workflows/deploy-staging.yml` 工作流文件。以下是该文件的关键部分：

```yaml
name: Deploy to Staging

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on:
      - self-hosted
      - staging
    env:
      ENVIRONMENT: staging
      DOMAIN: ${{ secrets.DOMAIN_STAGING }}
      STACK_NAME: ${{ secrets.STACK_NAME_STAGING }}
      # 其他环境变量...
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - run: docker compose -f docker-compose.yml --project-name ${{ secrets.STACK_NAME_STAGING }} build
      - run: docker compose -f docker-compose.yml --project-name ${{ secrets.STACK_NAME_STAGING }} up -d
```

### 关键组件解析

1. **触发条件**：
   - 当代码推送到 `main` 分支时触发

2. **运行环境**：
   - 使用带有 `self-hosted` 和 `staging` 标签的 Runner
   - 这确保工作流在专门为测试环境配置的服务器上运行

3. **环境变量**：
   - 设置 `ENVIRONMENT: staging`，标识当前部署环境
   - 从 GitHub Secrets 中获取关键配置值，如域名和堆栈名称

4. **部署步骤**：
   - 检出代码仓库
   - 使用 Docker Compose 构建服务
   - 使用 Docker Compose 启动服务（`-d` 参数使容器在后台运行）

## 部署前准备

在设置测试环境部署之前，确保满足以下前提条件：

1. **已配置自托管 Runner**：
   - Runner 已安装在测试环境服务器上
   - Runner 已添加 `self-hosted` 和 `staging` 标签
   - Runner 服务正在运行

2. **已配置 GitHub Secrets**：
   - 所有工作流中引用的 Secrets 已在 GitHub 仓库中配置

3. **服务器环境**：
   - Docker 和 Docker Compose 已安装
   - Runner 用户具有运行 Docker 命令的权限
   - 服务器已开放必要的端口

## 部署工作流详解

### 1. 代码推送触发

当团队成员将代码推送到 `main` 分支时：
- GitHub 自动检测到推送事件
- 触发 `Deploy to Staging` 工作流
- 分配带有 `self-hosted` 和 `staging` 标签的 Runner 执行工作流

### 2. 环境准备

Runner 开始执行工作流：
- 加载所有环境变量
- 检出代码仓库的最新版本

### 3. 构建服务

执行 Docker Compose 构建：
```bash
docker compose -f docker-compose.yml --project-name <STACK_NAME> build
```

这一步将：
- 基于项目中的 Dockerfile 构建所有服务
- 使用 `--project-name` 参数指定 Docker Compose 项目名称，便于管理

### 4. 部署服务

执行 Docker Compose 启动：
```bash
docker compose -f docker-compose.yml --project-name <STACK_NAME> up -d
```

这一步将：
- 启动所有定义在 `docker-compose.yml` 中的服务
- 使用 `-d` 参数在后台运行这些服务
- 自动处理服务之间的依赖关系
- 挂载必要的卷和配置网络

## 管理部署

### 监控部署状态

部署完成后，可以通过以下方式监控服务状态：

```bash
# 查看所有运行中的容器
docker ps

# 查看特定项目的容器
docker compose -p <STACK_NAME> ps

# 查看容器日志
docker compose -p <STACK_NAME> logs -f [service_name]
```

### 手动重启服务

如需手动重启某个服务：

```bash
docker compose -p <STACK_NAME> restart [service_name]
```

### 更新部署

如需更新测试环境：
1. 将更改推送到 `main` 分支
2. GitHub Actions 将自动触发部署工作流
3. 新版本将被构建并部署到测试环境

### 回滚部署

如需回滚到先前版本：
1. 将所需版本的代码推送到 `main` 分支
2. 或手动触发工作流，指定特定提交 SHA

## 故障排除

### 部署失败

如果部署失败：
1. 检查 GitHub Actions 工作流日志
2. 验证所有 Secrets 是否正确配置
3. 确认 Runner 状态是否正常
4. 检查 Docker 和 Docker Compose 是否正常运行

### 服务启动失败

如果服务启动但不正常运行：
1. 检查容器日志：`docker compose -p <STACK_NAME> logs [service_name]`
2. 验证环境变量是否正确传递
3. 检查网络配置和端口映射

## 最佳实践

1. **监控测试环境**：设置监控工具，及时发现问题
2. **定期清理**：移除旧的未使用镜像以节省磁盘空间
3. **自动化测试**：在部署后添加自动化测试步骤验证部署
4. **通知机制**：配置部署成功或失败的通知机制

## 安全考虑

1. 限制对测试环境的访问
2. 配置防火墙，只开放必要端口
3. 不在测试环境存储敏感的生产数据
4. 定期更新测试环境的依赖和系统 