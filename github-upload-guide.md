# 📤 GitHub上传指南

## 🔍 常见错误及解决方案

### 错误1：权限被拒绝
```
ERROR: Permission to USERNAME/REPO.git denied to USERNAME.
fatal: unable to access 'https://github.com/...': The requested URL returned error: 403
```

**解决方案**：
1. 使用SSH方式替代HTTPS
2. 配置GitHub个人访问令牌(PAT)
3. 检查仓库权限

### 错误2：仓库已存在
```
fatal: remote origin already exists
```

**解决方案**：
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/1Some-tools.git
```

### 错误3：认证失败
```
fatal: Authentication failed for 'https://github.com/...'
```

**解决方案**：
1. 使用GitHub个人访问令牌
2. 配置SSH密钥

## 🚀 逐步上传指南

### 方法1：使用GitHub CLI（推荐）

#### 安装GitHub CLI
```bash
# macOS
brew install gh

# Ubuntu/Debian
sudo apt install gh

# Windows
winget install --id GitHub.cli
```

#### 使用CLI上传
```bash
# 登录GitHub
gh auth login

# 创建仓库并上传
gh repo create 1Some-tools --public --source=. --remote=origin --push
```

### 方法2：手动步骤

#### 步骤1：创建GitHub仓库
1. 访问 https://github.com/new
2. 仓库名称：1Some-tools
3. 选择 Public
4. 不要初始化README（避免冲突）
5. 点击创建

#### 步骤2：配置Git
```bash
# 配置用户信息
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 初始化仓库（如果还没做）
git init
```

#### 步骤3：使用HTTPS上传
```bash
# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/1Some-tools.git

# 添加所有文件
git add .
git commit -m "Initial commit: 1Some tools for homepage configuration"

# 推送到main分支
git branch -M main
git push -u origin main
```

#### 步骤4：使用SSH上传（更安全）
```bash
# 添加SSH远程仓库
git remote add origin git@github.com:YOUR_USERNAME/1Some-tools.git

# 推送
git push -u origin main
```

### 方法3：使用GitHub Desktop

1. 下载安装 [GitHub Desktop](https://desktop.github.com/)
2. 拖拽项目文件夹到GitHub Desktop
3. 填写仓库信息并发布

## 🔧 修复脚本

创建修复脚本：

```bash
#!/bin/bash
# github-fix.sh - GitHub上传修复脚本

echo "🚀 修复GitHub上传问题..."

# 检查git配置
if ! git config --global user.name; then
    read -p "请输入Git用户名: " username
    git config --global user.name "$username"
fi

if ! git config --global user.email; then
    read -p "请输入Git邮箱: " email
    git config --global user.email "$email"
fi

# 检查仓库状态
if [ ! -d ".git" ]; then
    echo "📁 初始化Git仓库..."
    git init
fi

# 检查远程仓库
if git remote | grep -q "origin"; then
    echo "🔄 移除现有远程仓库..."
    git remote remove origin
fi

# 创建或获取仓库地址
echo "📋 请先在GitHub创建仓库："
echo "访问：https://github.com/new"
echo "仓库名：1Some-tools"
echo "选择：Public"
read -p "创建完成后按回车继续..."

read -p "请输入GitHub用户名: " USERNAME

# 询问上传方式
echo "选择上传方式："
echo "1. HTTPS（需要PAT）"
echo "2. SSH（推荐）"
echo "3. GitHub CLI"
read -p "请输入选择(1-3): " choice

case $choice in
    1)
        git remote add origin https://github.com/$USERNAME/1Some-tools.git
        echo "🔑 使用HTTPS上传..."
        echo "如果提示输入密码，请使用GitHub个人访问令牌(PAT)"
        echo "获取PAT：https://github.com/settings/tokens"
        git add .
        git commit -m "Initial commit: 1Some tools for homepage configuration"
        git branch -M main
        git push -u origin main
        ;;
    2)
        git remote add origin git@github.com:$USERNAME/1Some-tools.git
        echo "🔑 使用SSH上传..."
        git add .
        git commit -m "Initial commit: 1Some tools for homepage configuration"
        git branch -M main
        git push -u origin main
        ;;
    3)
        if command -v gh >/dev/null 2>&1; then
            echo "🔑 使用GitHub CLI..."
            gh repo create 1Some-tools --public --source=. --remote=origin --push
        else
            echo "❌ GitHub CLI未安装，请先安装："
            echo "macOS: brew install gh"
            echo "Ubuntu: sudo apt install gh"
            echo "Windows: winget install --id GitHub.cli"
            exit 1
        fi
        ;;
    *)
        echo "❌ 无效选择"
        exit 1
        ;;
esac

echo "✅ GitHub上传完成！"
echo "仓库地址：https://github.com/$USERNAME/1Some-tools"
```

## 📝 快速修复命令

### 一键修复命令
```bash
# 保存修复脚本
cat > github-fix.sh << 'EOF'
#!/bin/bash
echo "🚀 开始GitHub上传修复..."

# 配置用户信息（替换为你的信息）
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 初始化并添加文件
git init
git add .
git commit -m "Initial commit: 1Some tools for homepage configuration"

# 询问用户名并上传
read -p "请输入GitHub用户名: " USERNAME
git remote add origin https://github.com/$USERNAME/1Some-tools.git
git branch -M main
git push -u origin main

echo "✅ 上传完成！"
EOF

# 执行修复
chmod +x github-fix.sh
./github-fix.sh
```

## 🔑 配置GitHub个人访问令牌

1. 访问：https://github.com/settings/tokens
2. 点击「Generate new token (classic)」
3. 选择权限：repo（全选）
4. 复制生成的令牌
5. 在推送时使用令牌作为密码

## 🎯 验证上传成功

上传成功后，您应该能够访问：
`https://github.com/YOUR_USERNAME/1Some-tools`