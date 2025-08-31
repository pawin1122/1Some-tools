#!/bin/bash

# 1Some Tools - GitHub同步脚本
# 用于将本地更新推送到GitHub

set -e

# 颜色输出
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔄 同步1Some Tools到GitHub${NC}"
echo "======================================"

# 检查Git状态
echo -e "${GREEN}检查Git状态...${NC}"
git status

# 添加所有更改
echo -e "${GREEN}添加更改...${NC}"
git add .

# 检查是否有更改需要提交
if [[ -z $(git status --porcelain) ]]; then
    echo "✅ 没有需要同步的更改"
    exit 0
fi

# 提交更改
echo -e "${GREEN}提交更改...${NC}"
git commit -m "feat: $(date '+%Y-%m-%d') 项目更新 - 优化项目结构"

# 推送到GitHub
echo -e "${GREEN}推送到GitHub...${NC}"
git push origin main

echo -e "${GREEN}✅ 同步完成！${NC}"
echo "======================================"
echo "GitHub仓库：https://github.com/pawin1122/1Some-tools"