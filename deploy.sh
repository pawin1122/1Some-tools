#!/bin/bash

# 1Some Tools 一键部署脚本
# 支持GitHub上传和Docker部署

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 打印信息函数
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查命令是否存在
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 检查必要工具
print_info "检查必要工具..."
if ! command_exists git; then
    print_error "Git未安装，请先安装Git"
    exit 1
fi

if ! command_exists docker; then
    print_error "Docker未安装，请先安装Docker"
    exit 1
fi

# 获取GitHub用户名
read -p "请输入GitHub用户名: " GITHUB_USERNAME
if [ -z "$GITHUB_USERNAME" ]; then
    print_error "GitHub用户名不能为空"
    exit 1
fi

# 设置仓库信息
REPO_NAME="1Some-tools"
REPO_URL="https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

print_info "开始部署 $REPO_NAME..."

# 1. GitHub部署
print_info "1. 准备GitHub部署..."
read -p "是否创建新的GitHub仓库？(y/n): " CREATE_REPO

if [[ $CREATE_REPO == [Yy]* ]]; then
    print_info "请手动在GitHub创建仓库: $REPO_NAME"
    print_info "仓库地址: https://github.com/new"
    read -p "创建完成后按回车继续..."
fi

# 初始化git仓库
if [ ! -d ".git" ]; then
    print_info "初始化Git仓库..."
    git init
    git add .
    git commit -m "Initial commit: 1Some tools for homepage configuration"
fi

# 添加远程仓库
git remote remove origin 2>/dev/null || true
git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

# 推送到GitHub
print_info "推送到GitHub..."
git branch -M main
git push -u origin main

print_info "GitHub部署完成！"
print_info "仓库地址: https://github.com/$GITHUB_USERNAME/$REPO_NAME"

# 2. Docker部署
print_info "2. 开始Docker部署..."

# 构建Docker镜像
print_info "构建Docker镜像..."
docker build -t "1some-tools:latest" .

# 运行容器
print_info "启动Docker容器..."
docker-compose down 2>/dev/null || true
docker-compose up -d

# 检查容器状态
print_info "检查容器状态..."
if docker ps | grep -q "1some-tools"; then
    print_info "容器启动成功！"
    print_info "访问地址: http://localhost:8080"
else
    print_error "容器启动失败，请检查日志"
    docker-compose logs
    exit 1
fi

# 3. 阿里云部署提示
print_info "3. 阿里云部署准备..."
print_info "如需部署到阿里云服务器："
print_info "1. 在阿里云服务器安装Docker和Docker Compose"
print_info "2. 克隆项目: git clone https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
print_info "3. 进入目录: cd $REPO_NAME"
print_info "4. 启动服务: docker-compose up -d"
print_info "5. 配置安全组开放8080端口"

# 4. 1Panel部署提示
print_info "4. 1Panel部署提示："
print_info "1. 登录1Panel管理面板"
print_info "2. 进入「应用商店」→「Docker Compose」"
print_info "3. 复制docker-compose.yml内容"
print_info "4. 设置端口映射8080:80"
print_info "5. 点击部署"

# 5. 总结
print_info "🎉 部署完成！"
echo "========================================"
echo "GitHub仓库: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo "本地访问: http://localhost:8080"
echo "Docker镜像: 1some-tools:latest"
echo "========================================"

# 可选：推送到GitHub Container Registry
read -p "是否推送到GitHub Container Registry？(y/n): " PUSH_GHCR
if [[ $PUSH_GHCR == [Yy]* ]]; then
    print_info "推送到GitHub Container Registry..."
    docker tag "1some-tools:latest" "ghcr.io/$GITHUB_USERNAME/1some-tools:latest"
    docker push "ghcr.io/$GITHUB_USERNAME/1some-tools:latest"
    print_info "推送完成！镜像地址: ghcr.io/$GITHUB_USERNAME/1some-tools:latest"
fi