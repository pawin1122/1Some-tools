# 🚀 部署指南

## 📦 GitHub部署

### 1. 上传到GitHub

```bash
# 初始化git仓库
git init
git add .
git commit -m "Initial commit: 1Some tools - Personal toolkit for homepage configuration"

# 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/YOUR_USERNAME/1Some-tools.git

# 推送到GitHub
git push -u origin main
```

### 2. 项目结构
```
1Some-tools/
├── index.html              # 主启动页
├── start.py               # 本地启动脚本
├── Dockerfile             # Docker镜像构建文件
├── docker-compose.yml     # Docker Compose配置
├── nginx.conf            # Nginx配置
├── tools/
│   ├── color_generator/   # CSS配色方案工具
│   ├── links_homepage/
│   │   ├── addlinks/      # Homepage书签添加器
│   │   └── editlinks/     # Homepage书签编辑器
└── README.md
```

## 🐳 Docker部署

### 1. 本地构建测试

```bash
# 构建镜像
docker build -t 1some-tools .

# 运行容器
docker run -d -p 8080:80 --name 1some-tools 1some-tools

# 访问测试
open http://localhost:8080
```

### 2. 使用Docker Compose

```bash
# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 3. 1Panel部署

#### 方法一：使用Docker Compose

1. 登录1Panel管理面板
2. 进入「应用商店」→「Docker Compose」
3. 创建新的Compose项目
4. 将`docker-compose.yml`内容复制进去
5. 设置端口映射（推荐8080）
6. 点击部署

#### 方法二：使用Docker镜像

1. 登录1Panel管理面板
2. 进入「容器」→「镜像」
3. 拉取镜像：
   ```bash
   docker pull ghcr.io/YOUR_USERNAME/1some-tools:latest
   ```
4. 创建容器：
   - 镜像：`ghcr.io/YOUR_USERNAME/1some-tools:latest`
   - 端口：8080:80
   - 重启策略：始终重启

### 4. 阿里云服务器部署

#### 直接部署

```bash
# 克隆项目
git clone https://github.com/YOUR_USERNAME/1Some-tools.git
cd 1Some-tools

# 使用Docker Compose启动
docker-compose up -d

# 配置防火墙（阿里云安全组）
# 开放端口：8080
```

#### 使用1Panel部署

1. 在阿里云服务器安装1Panel
2. 按照上述1Panel部署步骤操作

## 🔧 环境变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| NGINX_HOST | localhost | 主机名 |
| NGINX_PORT | 80 | Nginx端口 |

## 📊 访问地址

部署完成后，可以通过以下地址访问：

- **主界面**: http://your-domain:8080/
- **颜色生成器**: http://your-domain:8080/tools/color_generator/index.html
- **Homepage书签添加器**: http://your-domain:8080/tools/links_homepage/addlinks/index.html
- **Homepage书签编辑器**: http://your-domain:8080/tools/links_homepage/editlinks/index.html

## 🔍 故障排除

### 常见问题

1. **端口冲突**
   ```bash
   # 检查端口占用
   netstat -tulnp | grep 8080
   
   # 修改docker-compose.yml中的端口
   ports:
     - "9000:80"  # 改为其他端口
   ```

2. **容器无法启动**
   ```bash
   # 查看日志
   docker logs 1some-tools
   
   # 重新构建
   docker-compose down
   docker-compose up --build -d
   ```

3. **阿里云访问不了**
   - 检查安全组规则
   - 确认服务器防火墙
   - 验证域名解析

## 📈 性能优化

### 1. CDN加速（可选）
在阿里云OSS或CDN中配置静态资源加速。

### 2. 反向代理
使用Nginx作为反向代理，添加SSL证书。

### 3. 资源压缩
Docker镜像已启用gzip压缩，优化传输效率。