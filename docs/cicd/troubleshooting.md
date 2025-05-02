# CI/CD 常见问题与排错指南

本文档提供了在使用 GitHub Actions 自托管 Runner 进行 CI/CD 部署过程中可能遇到的常见问题及其解决方案。

## Runner 相关问题

### Runner 离线或不可用

**症状**：GitHub Actions 工作流程卡在 "Waiting for a runner to pick up this job" 状态。

**解决方案**：

1. 检查 Runner 服务状态：
   ```bash
   sudo ./svc.sh status
   ```

2. 如果 Runner 服务停止，重启服务：
   ```bash
   sudo ./svc.sh start
   ```

3. 检查 Runner 日志：
   ```bash
   tail -f ~/actions-runner/_diag/*.log
   ```

4. 确认 Runner 在 GitHub 仓库设置中显示为"在线"状态
   - 导航到 "Settings" > "Actions" > "Runners"
   - 验证 Runner 状态为 "Idle"（而非 "Offline"）

5. 检查网络连接：
   ```bash
   ping github.com
   curl -I https://api.github.com
   ```

### Runner 权限不足

**症状**：Runner 启动工作流但无法执行某些命令，如 Docker 操作。

**解决方案**：

1. 确保 Runner 用户在 Docker 组中：
   ```bash
   sudo usermod -aG docker $USER
   ```

2. 验证权限更改（需要重新登录）：
   ```bash
   groups
   ```

3. 如果使用 systemd 服务，可能需要重启：
   ```bash
   sudo systemctl restart actions.runner.*
   ```

## Docker 相关问题

### 无法构建镜像

**症状**：`docker compose build` 命令失败。

**解决方案**：

1. 检查磁盘空间：
   ```bash
   df -h
   ```

2. 清理未使用的 Docker 资源：
   ```bash
   docker system prune -a
   ```

3. 验证 Dockerfile 及上下文是否存在：
   ```bash
   ls -la ./backend/Dockerfile
   ```

4. 检查 Docker 服务状态：
   ```bash
   sudo systemctl status docker
   ```

### 容器启动失败

**症状**：`docker compose up -d` 成功执行，但服务无法正常工作。

**解决方案**：

1. 检查容器状态：
   ```bash
   docker compose ps
   ```

2. 查看容器日志：
   ```bash
   docker compose logs [service_name]
   ```

3. 检查环境变量是否正确传递：
   ```bash
   docker compose config
   ```

4. 验证网络连接：
   ```bash
   docker network ls
   docker network inspect [network_name]
   ```

## GitHub Secrets 相关问题

### Secrets 未正确应用

**症状**：工作流运行时环境变量未正确设置或为空。

**解决方案**：

1. 检查 GitHub Secrets 是否已正确配置：
   - 导航到 "Settings" > "Secrets and variables" > "Actions"
   - 确认所有必需的 Secrets 都已设置

2. 验证工作流文件中的引用语法是否正确：
   ```yaml
   env:
     SECRET_NAME: ${{ secrets.SECRET_NAME }}
   ```

3. 检查大小写是否匹配（Secrets 区分大小写）

4. 如使用环境，确保 Secrets 已在正确的环境中配置

### 敏感信息泄露

**症状**：在 GitHub Actions 日志中意外看到敏感信息。

**解决方案**：

1. 立即轮换受影响的凭据

2. 在工作流文件中添加掩码步骤：
   ```yaml
   - name: Mask sensitive values
     run: |
       echo "::add-mask::${{ secrets.SECRET_NAME }}"
   ```

3. 确保不在 echo 或调试语句中打印敏感环境变量

4. 检查第三方操作是否处理敏感数据安全

## 部署流程问题

### 部署完成但服务不可访问

**症状**：GitHub Actions 工作流成功完成，但服务不可访问。

**解决方案**：

1. 确认服务容器正在运行：
   ```bash
   docker ps | grep [service_name]
   ```

2. 检查端口映射：
   ```bash
   docker compose ps
   ```

3. 验证防火墙规则：
   ```bash
   sudo ufw status
   ```

4. 检查反向代理配置（如使用 Traefik 或 Nginx）：
   ```bash
   docker logs [proxy_container]
   ```

5. 测试服务健康检查端点：
   ```bash
   curl http://localhost:[port]/health
   ```

### 自动部署未触发

**症状**：代码推送或发布后，部署工作流未自动启动。

**解决方案**：

1. 检查工作流文件中的触发条件：
   - 确认分支名称正确（如 `main` 而非 `master`）
   - 确认发布类型正确（如 `published`）

2. 验证工作流文件是否位于正确的路径（`.github/workflows/`）

3. 查看 GitHub Actions 选项卡中是否有工作流错误

4. 确认没有禁用仓库的 GitHub Actions：
   - 导航到 "Settings" > "Actions" > "General"
   - 确认 Actions 权限设置正确

## 数据库相关问题

### 数据库迁移失败

**症状**：部署成功但应用报告数据库错误。

**解决方案**：

1. 检查迁移日志：
   ```bash
   docker compose logs backend | grep migration
   ```

2. 手动执行迁移：
   ```bash
   docker compose exec backend alembic upgrade head
   ```

3. 验证数据库连接参数：
   ```bash
   docker compose exec backend env | grep POSTGRES
   ```

4. 检查数据库是否可访问：
   ```bash
   docker compose exec backend python -c "import psycopg; conn = psycopg.connect('postgresql://postgres:password@db/app'); print('连接成功')"
   ```

### 数据丢失

**症状**：部署后数据丢失或不可访问。

**解决方案**：

1. 确认数据卷是否正确挂载：
   ```bash
   docker volume ls
   docker volume inspect [volume_name]
   ```

2. 检查是否意外使用了临时卷：
   ```bash
   docker compose config | grep volumes -A10
   ```

3. 恢复最近的数据库备份（如果有）

## 网络相关问题

### 服务之间无法通信

**症状**：部署成功，但服务之间无法通信。

**解决方案**：

1. 验证服务在同一网络中：
   ```bash
   docker network inspect $(docker compose ps -q | xargs docker inspect -f '{{range $net,$v := .NetworkSettings.Networks}}{{$net}} {{end}}' | awk '{print $1}' | head -1)
   ```

2. 测试服务间网络连接：
   ```bash
   docker compose exec frontend curl -I http://backend:8000/health
   ```

3. 检查服务名称解析：
   ```bash
   docker compose exec frontend ping backend
   ```

4. 验证应用配置中的服务URL是否正确

## SSL/TLS 相关问题

### SSL 证书问题

**症状**：HTTPS 不可用或浏览器显示证书错误。

**解决方案**：

1. 检查证书文件：
   ```bash
   docker compose exec traefik ls -la /etc/traefik/acme.json
   ```

2. 验证域名配置：
   ```bash
   docker compose exec traefik cat /etc/traefik/traefik.yml
   ```

3. 检查 Let's Encrypt 日志：
   ```bash
   docker compose logs traefik | grep acme
   ```

4. 确认域名 DNS 解析正确指向服务器

## 一般性能问题

### 部署速度慢

**症状**：CI/CD 部署过程耗时过长。

**解决方案**：

1. 优化 Docker 镜像构建：
   - 使用多阶段构建
   - 改进缓存利用
   - 最小化上下文大小

2. 使用缓存依赖：
   ```yaml
   - name: Cache dependencies
     uses: actions/cache@v3
     with:
       path: ~/.npm
       key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
   ```

3. 优化工作流结构，并行化不相关任务

4. 增加 Runner 资源（CPU/内存）

## 资源管理问题

### 磁盘空间不足

**症状**：部署失败，日志显示磁盘空间不足。

**解决方案**：

1. 清理 Docker 资源：
   ```bash
   docker system prune -af --volumes
   ```

2. 查找并删除大文件：
   ```bash
   find / -type f -size +100M | xargs ls -lh
   ```

3. 配置日志轮转：
   ```bash
   sudo nano /etc/docker/daemon.json
   # 添加以下内容
   {
     "log-driver": "json-file",
     "log-opts": {
       "max-size": "10m",
       "max-file": "3"
     }
   }
   ```

4. 考虑扩展磁盘空间

## 故障排除最佳实践

1. **添加详细日志**：在工作流和应用中添加有助于诊断的日志
2. **增量更改**：小步骤迭代修改，一次只更改一个组件
3. **本地测试**：在推送前在本地测试更改
4. **设置监控**：使用监控工具及时发现问题
5. **保持依赖更新**：定期更新 Runner、Docker 和其他依赖
6. **备份重要数据**：特别是在重大部署之前备份数据库
7. **文档化解决方案**：记录问题和解决方案，建立知识库 