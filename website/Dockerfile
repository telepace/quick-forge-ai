FROM node:20-alpine AS builder

WORKDIR /app

# 复制项目文件
COPY package.json package-lock.json ./
RUN npm ci

# 复制所有源代码
COPY . .

# 构建应用
RUN npm run build
RUN npm run postbuild

# 生产环境运行阶段
FROM node:20-alpine AS runner

WORKDIR /app

# 设置环境变量
ENV NODE_ENV=production

# 复制依赖和构建产物
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["npm", "start"] 