#!/bin/bash

# GitHub上传修复脚本
# 适用于1Some Tools项目

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 1Some Tools - GitHub上传修复脚本${NC}"
echo "=================================="

# 检查git是否安装
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git未安装${NC}"
    echo "请先安装Git:"
    echo "macOS: brew install git"
    echo "Ubuntu: sudo apt install git"
    echo "Windows: 下载安装 https://git-scm.com/"
    exit 1
fi

# 配置用户信息
echo -e "${YELLOW}📋 配置Git用户信息${NC}"
read -p "请输入GitHub用户名: " USERNAME
read -p "请输入邮箱地址: " EMAIL

if [[ -z "$USERNAME" || -z "$EMAIL" ]]; then
    echo -e "${RED}❌ 用户名和邮箱不能为空${NC}"
    exit 1
fi

git config --global user.name "$USERNAME"
git config --global user.email "$EMAIL"

# 检查当前目录
echo -e "${GREEN}📁 当前目录: $(pwd)${NC}"

# 初始化git仓库（如果需要）
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}🔄 初始化Git仓库...${NC}"
    git init
else
    echo -e "${GREEN}✅ Git仓库已存在${NC}"
fi

# 添加所有文件
echo -e "${YELLOW}📦 添加文件到Git...${NC}"
git add .

# 检查是否有文件需要提交
if git diff --cached --quiet; then
    echo -e "${YELLOW}⚠️  没有文件变更，跳过提交${NC}"
else
    echo -e "${YELLOW}📝 提交文件...${NC}"
    git commit -m "Initial commit: 1Some tools for homepage configuration"
fi

# 移除现有远程仓库（如果存在）
if git remote | grep -q "origin"; then
    echo -e "${YELLOW}🔄 移除现有远程仓库...${NC}"
    git remote remove origin
fi

# 询问上传方式
echo -e "${BLUE}🔗 选择上传方式:${NC}"
echo "1) HTTPS (需要GitHub Token)"
echo "2) SSH (推荐)"
echo "3) GitHub CLI (gh)"
read -p "请选择 (1-3): " choice

case $choice in
    1)
        echo -e "${YELLOW}🔑 使用HTTPS上传${NC}"
        echo -e "${YELLOW}⚠️  需要GitHub个人访问令牌${NC}"
        echo "获取地址: https://github.com/settings/tokens"
        echo "需要权限: repo (全选)"
        
        git remote add origin https://github.com/$USERNAME/1Some-tools.git
        git branch -M main
        
        echo -e "${GREEN}🚀 开始推送...${NC}"
        if git push -u origin main; then
            echo -e "${GREEN}✅ HTTPS上传成功！${NC}"
        else
            echo -e "${RED}❌ HTTPS上传失败${NC}"
            echo "请检查："
            echo "1. GitHub用户名是否正确"
            echo "2. 是否配置了个人访问令牌"
            echo "3. 网络连接是否正常"
            exit 1
        fi
        ;;
    2)
        echo -e "${YELLOW}🔑 使用SSH上传${NC}"
        echo -e "${YELLOW}⚠️  需要配置SSH密钥${NC}"
        echo "配置指南: https://docs.github.com/en/authentication/connecting-to-github-with-ssh"
        
        git remote add origin git@github.com:$USERNAME/1Some-tools.git
        git branch -M main
        
        echo -e "${GREEN}🚀 开始推送...${NC}"
        if git push -u origin main; then
            echo -e "${GREEN}✅ SSH上传成功！${NC}"
        else
            echo -e "${RED}❌ SSH上传失败${NC}"
            echo "请检查："
            echo "1. SSH密钥是否已添加到GitHub"
            echo "2. SSH代理是否运行"
            echo "3. 网络连接是否正常"
            exit 1
        fi
        ;;
    3)
        if command -v gh &> /dev/null; then
            echo -e "${YELLOW}🔑 使用GitHub CLI上传${NC}"
            
            # 检查是否已登录
            if ! gh auth status &> /dev/null; then
                echo -e "${YELLOW}🔄 需要登录GitHub CLI${NC}"
                gh auth login
            fi
            
            # 创建仓库并推送
            gh repo create 1Some-tools --public --source=. --remote=origin --push
            echo -e "${GREEN}✅ GitHub CLI上传成功！${NC}"
        else
            echo -e "${RED}❌ GitHub CLI未安装${NC}"
            echo "安装方法："
            echo "macOS: brew install gh"
            echo "Ubuntu: sudo apt install gh"
            echo "Windows: winget install --id GitHub.cli"
            exit 1
        fi
        ;;
    *)
        echo -e "${RED}❌ 无效选择${NC}"
        exit 1
        ;;
esac

# 验证上传成功
echo -e "${GREEN}🔍 验证上传结果...${NC}"
if curl -s "https://github.com/$USERNAME/1Some-tools" | grep -q "1Some Tools"; then
    echo -e "${GREEN}✅ 仓库验证成功！${NC}"
    echo -e "${GREEN}🌐 仓库地址: https://github.com/$USERNAME/1Some-tools${NC}"
else
    echo -e "${YELLOW}⚠️  请手动验证仓库是否已创建${NC}"
fi

echo -e "${GREEN}🎉 GitHub上传完成！${NC}"
echo "=================================="