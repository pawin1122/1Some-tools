# 1Panel Docker更新指南

## 🎯 快速更新步骤

### 1. 确认当前部署方式
在1Panel中：
- 进入"容器" → "容器管理"
- 查找你的容器名称（通常为 `tools-*` 或 `homepage-*`）

### 2. 根据部署方式选择更新方法

#### 📦 情况A：通过1Panel应用商店部署
```bash
# 步骤1：登录1Panel
# 步骤2：应用商店 → 已安装 → 找到你的应用
# 步骤3：点击"更新"按钮
```

#### 📦 情况B：通过Docker Compose部署
```bash
# 在1Panel终端中执行：
cd /opt/1panel/apps/your-app-directory
git pull origin main
docker-compose down
docker-compose up -d --build
```

#### 📦 情况C：通过Docker命令部署
```bash
# 在1Panel终端中执行：
docker stop tools-container
docker rm tools-container
docker pull your-registry/tools-app:latest
docker run -d --name tools-container -p 8000:8000 your-registry/tools-app:latest
```

### 3. 验证更新
- 访问 http://你的服务器IP:8000
- 测试编辑书签模态框功能
- 检查小屏幕设备适配效果

## 🚨 注意事项

1. **备份数据**：更新前建议备份配置文件
2. **端口映射**：确保端口8000已开放
3. **卷挂载**：确认数据卷是否正确挂载
4. **健康检查**：更新后检查容器状态

## 📞 故障排除

如果更新后有问题：
1. 检查1Panel日志：容器 → 日志
2. 回滚操作：使用1Panel的快照功能
3. 重新部署：删除容器后重新创建