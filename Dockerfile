# 使用Node.js 20作为运行时基础
FROM node:20-alpine
WORKDIR /app

# 安装必要的工具（用于脚本执行）
RUN apk add --no-cache bash

# 安装bun
RUN npm install -g bun@1.2.0

COPY package.json bun.lockb* ./
# Skip Puppeteer/Chromium download (e2b SDK doesn't need local browser in container)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
RUN bun install --frozen-lockfile

COPY . .

ENV PORT=3003
EXPOSE 3003

# 使用启动脚本作为入口点
# RUN bun run build
# ENTRYPOINT ["bun", "run", "build"]
CMD ["bun", "run", "dev"]
# ENTRYPOINT ["bun", "run", "start:prod"]

# 使用说明：
# 1. 构建镜像：
#    docker build -t mp-bp-cn-shanghai.cr.volces.com/e2b/dashboard-app:1.2 .
#
# 2. 临时测试用：
# docker run -d -p 3004:3004 --name dashboard-container-dev1 mp-bp-cn-shanghai.cr.volces.com/e2b/dashboard-app-dev:2.4