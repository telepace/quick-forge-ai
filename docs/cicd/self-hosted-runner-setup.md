# GitHub Actions 自托管 Runner 设置指南

本文档介绍如何设置 GitHub Actions 的自托管 Runner，以实现测试环境和生产环境的自动化部署。

## 自托管 Runner 简介

GitHub Actions 自托管 Runner 是在您自己的服务器上运行的应用程序，可以连接到 GitHub 并执行 GitHub Actions 工作流程。与 GitHub 提供的托管 Runner 不同，自托管 Runner 允许您在自己的基础设施上运行工作流，非常适合需要访问内部网络资源或特定硬件配置的场景。

## 前提条件

- 至少两台服务器（一台用于测试环境，一台用于生产环境）
- 服务器满足以下要求：
  - Linux, Windows 或 macOS
  - x64 或 ARM 架构
  - 至少 2 核 CPU
  - 至少 2GB 内存
  - Docker 已安装并配置
  - 互联网连接（用于与 GitHub 通信）

## 设置步骤

### 1. 创建 Runner 组

1. 在 GitHub 仓库中，导航到 "Settings" > "Actions" > "Runners"
2. 点击 "New runner group" 创建两个 Runner 组：`staging` 和 `production`

### 2. 为测试环境添加 Runner

1. 在 GitHub 仓库中，导航到 "Settings" > "Actions" > "Runners"
2. 点击 "New self-hosted runner"
3. 选择服务器的操作系统和架构
4. 复制并在测试环境服务器上运行配置脚本
5. 根据终端提示完成配置，设置以下标签：
   - `self-hosted`
   - `staging`

### 3. 为生产环境添加 Runner

1. 重复上述步骤，但在生产环境服务器上执行
2. 设置以下标签：
   - `self-hosted`
   - `production`

### 4. 配置 Runner 服务

为了确保 Runner 作为系统服务持续运行：

```bash
# 安装为服务
sudo ./svc.sh install

# 启动服务
sudo ./svc.sh start

# 检查状态
sudo ./svc.sh status
```

### 5. 验证 Runner 设置

1. 在 GitHub 仓库中，导航到 "Settings" > "Actions" > "Runners"
2. 确认两个 Runner 显示为 "Idle" 状态
3. 检查标签是否正确配置

## 安全考虑

- 使用低权限用户运行 Runner
- 只为 Runner 授予必要的权限
- 考虑使用 Docker 容器来隔离作业
- 定期更新 Runner 应用程序

## 故障排除

### Runner 无法连接到 GitHub

检查服务器的网络连接和防火墙设置，确保可以访问：
- `github.com`
- `api.github.com`
- `*.actions.githubusercontent.com`

### Runner 显示为离线

1. 检查 Runner 服务状态：`sudo ./svc.sh status`
2. 查看日志：`tail -f ~/actions-runner/_diag/*.log`
3. 重启服务：`sudo ./svc.sh restart`

## 更新 Runner

GitHub 会通知您何时需要更新 Runner。更新步骤：

```bash
# 停止服务
sudo ./svc.sh stop

# 更新 Runner
cd actions-runner
./config.sh --update

# 重启服务
sudo ./svc.sh start
```

## 参考资源

- [GitHub 官方文档：自托管 Runner](https://docs.github.com/cn/actions/hosting-your-own-runners/managing-self-hosted-runners/about-self-hosted-runners)
- [自托管 Runner 安全性](https://docs.github.com/cn/actions/hosting-your-own-runners/managing-self-hosted-runners/about-self-hosted-runners#self-hosted-runner-security) 