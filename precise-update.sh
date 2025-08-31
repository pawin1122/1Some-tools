#!/bin/bash

# 使用Digest精确获取最新版本的脚本

echo "🔍 获取最新镜像Digest..."

# 获取远程最新digest
REMOTE_DIGEST=$(docker manifest inspect ghcr.io/pawin1122/1some-tools:latest | jq -r '.config.digest')
LOCAL_DIGEST=$(docker inspect --format='{{index .RepoDigests 0}}' ghcr.io/pawin1122/1some-tools:latest 2>/dev/null || echo "")

echo "远程Digest: $REMOTE_DIGEST"
echo "本地Digest: $LOCAL_DIGEST"

if [[ "$REMOTE_DIGEST" == "$LOCAL_DIGEST" ]]; then
    echo "✅ 已经是最新版本"
else
    echo "🔄 发现新版本，开始更新..."
    
    # 强制更新
    docker image rm -f ghcr.io/pawin1122/1some-tools:latest
    docker pull ghcr.io/pawin1122/1some-tools:latest
    
    # 重启容器
    docker stop tools-app 2>/dev/null || true
    docker rm tools-app 2>/dev/null || true
    
    docker run -d --name tools-app -p 8000:8000 --restart=unless-stopped ghcr.io/pawin1122/1some-tools:latest
    
    echo "✅ 更新完成！"
fi