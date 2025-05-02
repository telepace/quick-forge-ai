# 环境变量与 Secrets 配置

本文档介绍如何为 CI/CD 流程配置必要的环境变量和 GitHub Secrets，以实现安全的自动化部署。

## GitHub Secrets 概述

GitHub Secrets 是一种安全存储敏感信息的机制，如 API 密钥、密码和证书等。这些信息在工作流运行时可以被引用，但不会直接暴露在日志或代码中。

## 必要的 Secrets 配置

基于现有的工作流文件，以下是需要在 GitHub 仓库中配置的 Secrets：

### 通用配置

| Secret 名称 | 描述 | 示例 |
|------------|------|------|
| `SECRET_KEY` | 用于加密的密钥 | `a-random-secure-string` |
| `FIRST_SUPERUSER` | 初始超级用户的邮箱 | `admin@example.com` |
| `FIRST_SUPERUSER_PASSWORD` | 初始超级用户的密码 | `secure-password` |
| `SMTP_HOST` | SMTP 服务器地址 | `smtp.gmail.com` |
| `SMTP_USER` | SMTP 用户名 | `your-email@gmail.com` |
| `SMTP_PASSWORD` | SMTP 密码 | `your-app-password` |
| `EMAILS_FROM_EMAIL` | 发件人邮箱 | `noreply@example.com` |
| `POSTGRES_PASSWORD` | PostgreSQL 数据库密码 | `database-password` |
| `SENTRY_DSN` | Sentry 错误跟踪 DSN | `https://...@sentry.io/...` |

### 测试环境特定配置

| Secret 名称 | 描述 | 示例 |
|------------|------|------|
| `DOMAIN_STAGING` | 测试环境域名 | `staging.example.com` |
| `STACK_NAME_STAGING` | 测试环境 Docker stack 名称 | `app-staging` |

### 生产环境特定配置

| Secret 名称 | 描述 | 示例 |
|------------|------|------|
| `DOMAIN_PRODUCTION` | 生产环境域名 | `example.com` |
| `STACK_NAME_PRODUCTION` | 生产环境 Docker stack 名称 | `app-production` |

## 配置步骤

### 1. 添加 GitHub Secrets

1. 在 GitHub 仓库中，导航到 "Settings" > "Secrets and variables" > "Actions"
2. 点击 "New repository secret"
3. 输入 Secret 名称和值
4. 点击 "Add secret"
5. 对所有必要的 Secrets 重复此过程

### 2. 创建环境（可选但推荐）

GitHub 环境可以帮助您为不同的部署目标设置特定的保护规则和 Secrets：

1. 在 GitHub 仓库中，导航到 "Settings" > "Environments"
2. 点击 "New environment"
3. 创建 `staging` 和 `production` 环境
4. 为每个环境配置所需的保护规则（如审批要求、部署分支限制等）

### 3. 环境特定 Secrets（如使用环境）

如果使用 GitHub 环境，您可以为每个环境单独配置 Secrets：

1. 在 GitHub 仓库中，导航到 "Settings" > "Environments"
2. 选择要配置的环境
3. 在 "Environment secrets" 部分，添加环境特定的 Secrets

## Secrets 在工作流中的使用

在 GitHub Actions 工作流中，可以使用以下语法引用 Secrets：

```yaml
env:
  SECRET_NAME: ${{ secrets.SECRET_NAME }}
```

例如，在部署工作流中：

```yaml
env:
  DOMAIN: ${{ secrets.DOMAIN_STAGING }}
  POSTGRES_PASSWORD: ${{ secrets.POSTGRES_PASSWORD }}
```

## 安全最佳实践

- **定期轮换密码和密钥**：定期更新所有敏感凭据
- **限制访问**：只允许必要的团队成员访问 Secrets
- **使用特定作用域的令牌**：使用最小权限原则
- **审计 Secrets 使用**：定期审查哪些工作流使用了哪些 Secrets
- **避免在日志中打印敏感信息**：确保工作流不会意外记录敏感数据

## 本地开发环境设置

对于本地开发，可以使用 `.env` 文件存储这些配置。确保该文件已添加到 `.gitignore` 中以防止意外提交。

示例 `.env` 文件：

```
SECRET_KEY=dev-secret-key
FIRST_SUPERUSER=admin@example.com
FIRST_SUPERUSER_PASSWORD=admin
SMTP_HOST=localhost
SMTP_USER=test
SMTP_PASSWORD=test
EMAILS_FROM_EMAIL=info@example.com
POSTGRES_PASSWORD=postgres
DOMAIN=localhost
```

## 故障排除

### Secrets 没有被正确应用

1. 检查 Secret 名称是否与工作流文件中引用的名称完全匹配（区分大小写）
2. 确认工作流文件中使用了正确的语法 `${{ secrets.SECRET_NAME }}`
3. 验证 Secret 已正确添加到仓库或环境中

### 敏感信息意外暴露

如果敏感信息意外暴露在 GitHub Actions 日志中：

1. 立即轮换受影响的凭据
2. 检查工作流文件，删除任何可能导致打印敏感信息的调试语句
3. 考虑设置 [GitHub Actions 密钥筛选](https://docs.github.com/cn/actions/security-guides/security-hardening-for-github-actions#using-secrets) 