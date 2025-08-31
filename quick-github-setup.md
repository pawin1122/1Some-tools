# 🚀 快速GitHub登录和上传指南

## 最简单的方法：使用GitHub CLI

### 1. 安装GitHub CLI（如果未安装）
```bash
# macOS
brew install gh

# 验证安装
gh --version
```

### 2. 一键登录和上传
```bash
# 运行我们准备的脚本
./github-login-and-upload.sh
```

脚本会自动：
- 检查GitHub CLI
- 引导您登录
- 创建仓库
- 上传项目

## 如果GitHub CLI不可用

### 方法A：使用HTTPS + 个人访问令牌

1. **创建令牌**
   - 访问：https://github.com/settings/tokens
   - 点击「Generate new token (classic)」
   - 名称：1Some Tools Upload
   - 选择权限：repo（全选）
   - 点击「Generate token」
   - **复制令牌**（只会显示一次）

2. **手动上传**
   ```bash
   # 初始化仓库
   git init
   git add .
   git commit -m "Initial commit: 1Some tools for homepage configuration"
   
   # 添加远程仓库
   git remote add origin https://github.com/你的用户名/1Some-tools.git
   git branch -M main
   
   # 上传（密码用刚才的令牌）
   git push -u origin main
   ```

### 方法B：使用SSH密钥

1. **生成SSH密钥**
   ```bash
   ssh-keygen -t ed25519 -C "your.email@example.com"
   # 一路回车即可
   ```

2. **添加公钥到GitHub**
   ```bash
   # 查看公钥
   cat ~/.ssh/id_ed25519.pub
   
   # 复制内容，访问：https://github.com/settings/keys
   # 点击「New SSH key」，粘贴内容
   ```

3. **手动上传**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: 1Some tools for homepage configuration"
   git remote add origin git@github.com:你的用户名/1Some-tools.git
   git branch -M main
   git push -u origin main
   ```

## 验证上传成功

上传完成后，访问：
```
https://github.com/你的用户名/1Some-tools
```

## 需要帮助？

- 查看详细指南：`github-upload-guide.md`
- 运行修复脚本：`./github-upload-fix.sh`
- 一键完成：`./github-login-and-upload.sh`