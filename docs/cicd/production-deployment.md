# 生产环境部署流程

本文档详细介绍了使用 GitHub Actions 自托管 Runner 实现生产环境 (Production) 的自动化部署流程。

## 部署流程概述

生产环境部署是在创建新的 GitHub Release 时自动触发的 CI/CD 流程。这种基于 Release 的触发机制确保只有经过明确标记为可发布的代码版本才会部署到生产环境，增强了部署的可控性和安全性。

## 工作流文件分析

生产环境部署使用 `.github/workflows/deploy-production.yml` 工作流文件。以下是该文件的关键部分：

```yaml
name: Deploy to Production

on:
  release:
    types:
      - published

jobs:
  deploy:
    runs-on:
      - self-hosted
      - production
    env:
      ENVIRONMENT: production
      DOMAIN: ${{ secrets.DOMAIN_PRODUCTION }}
      STACK_NAME: ${{ secrets.STACK_NAME_PRODUCTION }}
      # 其他环境变量...
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - run: docker compose -f docker-compose.yml --project-name ${{ secrets.STACK_NAME_PRODUCTION }} build
      - run: docker compose -f docker-compose.yml --project-name ${{ secrets.STACK_NAME_PRODUCTION }} up -d
```

### 关键组件解析

1. **触发条件**：
   - 当 GitHub Release 被发布（`published`）时触发
   - 这确保只有经过团队确认的版本才会部署到生产环境

2. **运行环境**：
   - 使用带有 `self-hosted` 和 `production` 标签的 Runner
   - 这确保工作流在专门为生产环境配置的服务器上运行

3. **环境变量**：
   - 设置 `ENVIRONMENT: production`，标识当前部署环境
   - 从 GitHub Secrets 中获取关键配置值，如域名和堆栈名称

4. **部署步骤**：
   - 检出代码仓库
   - 使用 Docker Compose 构建服务
   - 使用 Docker Compose 启动服务（`-d` 参数使容器在后台运行）

## 发布和部署流程

### 1. 准备发布

在准备将代码部署到生产环境之前，团队应当：

1. **完成测试**：确保代码在测试环境中已经经过充分测试
2. **代码审查**：完成所有必要的代码审查和批准
3. **准备发布说明**：记录版本变更、新功能和修复的问题

### 2. 创建 GitHub Release

要触发生产环境部署，需要创建一个 GitHub Release：

1. 导航到 GitHub 仓库的 "Releases" 页面
2. 点击 "Draft a new release"
3. 选择要发布的标签（可以创建新标签或使用现有标签）
4. 填写发布标题和描述
5. 如果是预发布版本，勾选 "This is a pre-release"
6. 点击 "Publish release" 按钮

一旦 Release 被发布，GitHub Actions 将自动触发生产环境部署工作流。

### 3. 部署过程

部署过程与测试环境类似，但在生产环境的自托管 Runner 上执行：

1. **代码检出**：检出与发布标签对应的代码版本
2. **构建服务**：使用 Docker Compose 构建所有服务
3. **部署服务**：启动所有服务容器

## 生产环境部署的管理

### 监控部署

部署完成后，应当密切监控服务状态：

```bash
# 查看所有运行中的容器
docker ps

# 查看特定项目的容器
docker compose -p <STACK_NAME> ps

# 查看容器日志
docker compose -p <STACK_NAME> logs -f [service_name]
```

### 验证部署

部署后应执行以下验证步骤：

1. **健康检查**：验证所有服务的健康检查端点
2. **功能验证**：执行关键功能的基本测试
3. **性能监控**：监控系统负载和响应时间
4. **错误监控**：检查日志和错误跟踪系统（如 Sentry）

### 回滚流程

如果生产部署出现问题，可以通过以下方式回滚：

1. **使用先前版本创建新的 Release**：
   - 创建基于先前稳定版本标签的新 Release
   - 这将自动触发部署工作流，部署先前的稳定版本

2. **手动回滚**（紧急情况）：
   - 在生产服务器上执行：
   ```bash
   # 使用特定版本的镜像
   docker compose -p <STACK_NAME> up -d --no-build
   ```

## 生产环境部署的最佳实践

### 发布计划

1. **制定发布计划**：提前计划发布时间和内容
2. **通知利益相关者**：提前告知用户和团队成员即将发布的内容和时间
3. **选择低流量时段**：在用户活动较少的时段进行部署

### 部署安全性

1. **最小权限原则**：确保部署过程只使用必要的权限
2. **保护生产凭据**：严格控制对生产环境 Secrets 的访问
3. **审计部署记录**：保存所有部署操作的日志和记录

### 部署后操作

1. **监控系统健康**：持续监控系统指标和错误率
2. **及时响应问题**：建立快速响应机制处理部署后发现的问题
3. **文档更新**：更新相关文档反映新版本变更

## 生产环境特殊考虑

### 数据库迁移

对于包含数据库迁移的部署：

1. **备份数据**：在执行迁移前备份数据库
2. **验证迁移脚本**：在测试环境验证所有迁移脚本
3. **计划回滚策略**：准备数据库回滚策略

### 零停机部署

为实现零停机部署：

1. **使用蓝绿部署**：设置两套环境，新版本部署成功后切换流量
2. **配置健康检查**：确保只有健康的服务才接收流量
3. **渐进式流量切换**：逐步将流量从旧版本切换到新版本

## 故障排除

### 部署失败

如果生产部署失败：

1. 检查 GitHub Actions 工作流日志
2. 验证 Release 是否正确创建
3. 确认 Runner 状态是否正常
4. 检查 Docker 和 Docker Compose 是否正常运行

### 服务启动失败

如果服务启动但不正常运行：

1. 检查容器日志：`docker compose -p <STACK_NAME> logs [service_name]`
2. 验证环境变量是否正确传递
3. 检查外部依赖服务是否可访问
4. 回滚到先前稳定版本 