FROM node:20.0.0-alpine AS builder

WORKDIR /app

# 设置环境变量
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 复制项目文件
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# 复制所有源代码
COPY . .

# 构建应用
RUN npm run build
RUN npm run postbuild

# 生产环境运行阶段
FROM node:20.0.0-alpine AS runner

WORKDIR /app

# 设置环境变量
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 复制依赖和构建产物
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/out ./out
COPY --from=builder /app/public ./public

# 暴露端口
EXPOSE 3000

# 安装静态服务器
RUN npm install -g serve

# 启动静态服务器
CMD ["serve", "-s", "out", "-p", "3000"] 