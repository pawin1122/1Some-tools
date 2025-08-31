#!/bin/bash

# 强制拉取最新ghcr.io镜像的脚本
# 解决GitHub更新后Docker缓存导致无法获取最新版的问题

set -e

echo "🔄 强制更新 ghcr.io/pawin1122/1some-tools:latest"
echo "=========================================="

# 1. 完全删除本地镜像缓存
echo "🗑️  删除本地镜像缓存..."
docker image rm -f ghcr.io/pawin1122/1some-tools:latest 2>/dev/null || true

# 2. 强制重新拉取最新镜像
echo "📥 强制拉取最新镜像..."
docker pull --no-cache ghcr.io/pawin1122/1some-tools:latest

# 3. 显示新镜像信息
echo "📊 新镜像信息："
docker inspect ghcr.io/pawin1122/1some-tools:latest | grep -E "(Created|Id)"

# 4. 获取容器信息
CONTAINER_NAME="tools-app"

# 5. 停止并删除旧容器
echo "🛑 停止旧容器..."
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

# 6. 启动新容器
echo "🚀 启动新容器..."
docker run -d \
  --name $CONTAINER_NAME \
  -p 8000:8000 \
  --restart=unless-stopped \
  ghcr.io/pawin1122/1some-tools:latest

# 7. 验证更新
echo "⏳ 等待服务启动..."
sleep 5

if docker ps | grep -q $CONTAINER_NAME; then
    echo "✅ 更新成功！容器已启动"
    echo "📱 访问地址: http://localhost:8000/tools/links_homepage/editlinks/"
else
    echo "❌ 启动失败，请检查日志"
    docker logs $CONTAINER_NAME
fi

# 8. 清理无用镜像
echo "🧹 清理无用镜像..."
docker image prune -f