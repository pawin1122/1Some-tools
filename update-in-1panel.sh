#!/bin/bash

# 1Panel专用更新脚本
# 将此脚本上传到1Panel的文件管理中，然后在终端执行

set -e

echo "🔄 开始更新tools应用到最新版本..."

# 1. 拉取最新代码
echo "📥 拉取最新代码..."
git pull origin main

# 2. 检测部署方式并更新
if [ -f "docker-compose.yml" ]; then
    echo "📦 检测到Docker Compose部署"
    docker-compose down
    docker-compose build --no-cache
    docker-compose up -d
    
elif docker ps | grep -q "tools"; then
    echo "🐳 检测到独立Docker容器"
    
    # 停止并删除旧容器
    CONTAINER_ID=$(docker ps | grep "tools" | awk '{print $1}')
    if [ ! -z "$CONTAINER_ID" ]; then
        echo "🛑 停止旧容器: $CONTAINER_ID"
        docker stop $CONTAINER_ID
        docker rm $CONTAINER_ID
    fi
    
    # 构建并启动新容器
    echo "🏗️  构建新镜像..."
    docker build -t tools-app:latest .
    
    echo "🚀 启动新容器..."
    docker run -d \
        --name tools-container \
        -p 8000:8000 \
        -v $(pwd):/app \
        --restart=unless-stopped \
        tools-app:latest
        
else
    echo "❌ 未检测到已部署的tools容器"
    echo "请检查1Panel中的容器列表"
    exit 1
fi

echo "✅ 更新完成！"
echo "🌐 访问测试: http://$(hostname -I | awk '{print $1}'):8000"
echo "🔍 检查容器状态: docker ps"

# 等待容器启动
echo "⏳ 等待服务启动..."
sleep 5

# 健康检查
curl -f http://localhost:8000/tools/links_homepage/editlinks/ || echo "⚠️  健康检查失败，请手动验证"