# Quick Forge AI Helm Charts

这个目录包含为 Quick Forge AI 应用程序设计的 Helm charts。它支持将应用程序的所有组件部署到 Kubernetes 集群中。

## 组件

此 Helm charts 包含以下组件：

- **Backend**：基于 FastAPI 的后端 API 服务
- **Frontend**：前端 Web 应用程序
- **Website**：文档网站
- **PostgreSQL**：数据库（使用 Bitnami PostgreSQL chart）

## 前提条件

- Kubernetes 1.19+
- Helm 3.2.0+
- 已配置的 Ingress 控制器（如 nginx-ingress）
- （可选）安装 cert-manager 用于管理 TLS 证书

## 安装指南

### 添加 Bitnami 仓库

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
```

### 安装 Chart

#### 本地开发环境

```bash
cd helm-charts
helm dependency update quick-forge-ai
helm install qforge-dev ./quick-forge-ai -f quick-forge-ai/values.local.yaml
```

#### 生产环境

首先，根据您的环境修改 `values.prod.yaml` 文件中的设置，特别是密码、域名等敏感信息。

```bash
cd helm-charts
helm dependency update quick-forge-ai
helm install qforge ./quick-forge-ai -f quick-forge-ai/values.prod.yaml
```

## 配置

### 全局配置

`values.yaml` 文件中的 `global` 部分包含了应用于所有组件的共享配置：

- `env`：环境（development、staging、production）
- `domain`：应用根域名
- `stackName`：部署的堆栈名称
- `apiUrl`：后端 API URL
- `frontendHost`：前端 URL
- `imageTag`：默认镜像标签
- `imageRepository`：默认镜像仓库
- `environment`：所有服务共享的环境变量

### 组件特定配置

每个组件（backend、frontend、website、postgresql）都有自己的配置部分，可以单独调整。

## 升级和卸载

### 升级

```bash
helm upgrade qforge ./quick-forge-ai -f quick-forge-ai/values.prod.yaml
```

### 卸载

```bash
helm uninstall qforge
```

## 开发和维护

### 更新依赖

如果您修改了 Chart 依赖，请运行：

```bash
helm dependency update quick-forge-ai
```

### 测试模板渲染

您可以测试模板渲染而不实际安装 chart：

```bash
helm template qforge ./quick-forge-ai -f quick-forge-ai/values.local.yaml
```

### Linting

```bash
helm lint ./quick-forge-ai -f quick-forge-ai/values.local.yaml
``` 