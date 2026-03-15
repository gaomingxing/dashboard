# 使用Node.js 22作为运行时基础
FROM node:22-alpine
WORKDIR /app

# 安装必要的工具
RUN apk add --no-cache bash

# 安装bun
RUN npm install -g bun@1.2.0

# 复制依赖文件
# COPY package.json bun.lockb* ./
COPY package.json bun.lock bun.lockb* ./

# 环境变量
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV NODE_ENV=production
ENV PORT=3003
EXPOSE 3003

# 安装依赖
RUN bun install --frozen-lockfile

# 复制源代码
COPY . .

# 构建并启动应用
# CMD ["sh", "-c", "bun run build && bun run start"]
RUN bun run build
CMD ["bun", "run", "start"]

# 使用说明：
# 1. 构建镜像：
#    docker build -t mp-bp-cn-shanghai.cr.volces.com/e2b/dashboard-dev:v1.4.1 .

#
# 2. 生产环境运行：
    #  docker run -d -p 3003:3003 --name dashboard-dev mp-bp-cn-shanghai.cr.volces.com/e2b/dashboard-dev:v1.4.1

# rm -rf node_modules bun.lock bun.lockb
# PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true bun install