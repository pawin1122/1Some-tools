# 个人工具集项目 🛠️

## 项目简介
这是一个精心设计的个人工具集合项目，专注于提供实用、美观、易用的日常工具。每个工具都遵循**功能独立**、**界面优雅**、**开箱即用**的设计原则，旨在为用户打造高效的工作和生活体验。

## 🎯 设计理念
- **独立性**: 每个工具都可以独立运行，无外部依赖
- **美观性**: 现代化UI设计，响应式布局，支持深色模式
- **易用性**: 直观的操作界面，详细的使用说明
- **扩展性**: 模块化架构，易于添加新工具

## 🏗️ 技术栈
- **前端**: HTML5 + CSS3 + JavaScript (ES6+)
- **样式**: 现代CSS Grid/Flexbox布局
- **图标**: Font Awesome + Google Material Icons
- **存储**: 浏览器LocalStorage + 文件下载
- **部署**: 零依赖，支持静态托管

## 📁 项目结构
```
tool for me/
├── README.md                 # 项目说明文档
├── requirements.txt          # Python依赖管理文件
└── tools/                    # 工具存放目录
    ├── color_generator/      # 🎨 颜色生成器
    │   ├── index.html       # 主界面
    │   ├── style.css        # 样式文件
    │   └── script.js        # 交互逻辑
    ├── links_homepage/       # 🔗 Homepage书签管理套件
    │   ├── addlinks/        # 📥 书签添加工具
    │   │   ├── index.html   # 添加界面
    │   │   ├── style.css    # 样式文件
    │   │   ├── script.js    # 核心逻辑
    │   │   └── README.md    # 详细文档
    │   └── editlinks/       # ✏️ 书签编辑工具
    │       ├── index.html   # 编辑界面
    │       ├── style.css    # 样式文件
    │       ├── script.js    # 核心逻辑
    │       └── README.md    # 详细文档
    └── other/               # 🆕 预留扩展空间
```

## 🚀 已实现的工具

### 1. 🎨 颜色生成器 (color_generator/)
**功能亮点**:
- 🎯 **四色主题**: 支持选择四个主色调
- 🔄 **智能生成**: 自动生成亮色/暗色变体
- 👁️ **实时预览**: 即时显示颜色效果
- 📋 **一键复制**: 支持CSS变量代码复制
- 📱 **响应式**: 完美适配手机、平板、桌面

**使用场景**: 
- 网站主题色设计
- UI组件颜色搭配
- CSS变量快速生成
- 设计系统颜色规范

**快速开始**:
```bash
# 方法1: 直接打开
open tools/color_generator/index.html

# 方法2: 本地服务器
cd tools/color_generator
python3 -m http.server 8080
# 访问 http://localhost:8080
```

### 2. 📥 Homepage书签添加器 (links_homepage/addlinks/)
**核心功能**:
- 🔍 **智能抓取**: 自动获取网站标题、描述、图标
- 🎯 **智能缩写**: 基于域名自动生成2字母缩写
- 📝 **批量添加**: 支持一次性添加多个网址
- 🗂️ **分类管理**: 灵活的分类系统
- 💾 **本地存储**: 自动保存到浏览器
- 🎨 **可视化预览**: 实时显示书签卡片效果
- 📋 **YAML导出**: 一键生成标准homepage配置

**技术特色**:
- 拖拽排序功能
- 图标管理（更新/删除/重获取）
- 移动端优化
- 错误处理和用户反馈

**使用示例**:
1. 输入: `https://github.com`
2. 分类: `开发工具`
3. 自动生成:
   - 标题: GitHub
   - 缩写: GH
   - 图标: GitHub官方favicon
   - 描述: github.com

### 3. ✏️ Homepage书签编辑器 (links_homepage/editlinks/)
**独特价值**:
- 🔄 **反向解析**: 从YAML配置反向生成可视化界面
- 🎨 **可视化编辑**: 拖拽式书签管理
- ✏️ **全属性编辑**: 名称、缩写、URL、描述、图标
- 🔄 **跨类别移动**: 拖拽书签到不同分类
- 🔍 **智能排重**: 自动检测并清理重复书签
- 📊 **实时同步**: 可视化修改立即同步到YAML

**高级功能**:
- YAML格式验证和错误提示
- 图标URL验证和预览
- 拖拽排序和跨类别移动
- 一键导出和文件下载

**工作流程**:
1. 粘贴现有homepage YAML配置
2. 可视化编辑和整理
3. 导出更新后的YAML文件
4. 直接用于homepage部署

# 🧰 1Some Tools - Homepage配置工具集

一个专为homepage配置优化的工具集合，包含颜色生成、书签管理等实用工具。

## 🚀 快速开始

### 本地启动
```bash
python3 start.py
```
浏览器自动打开启动页：http://localhost:8000/

### 🐳 Docker部署

#### 快速启动
```bash
# 使用Docker Compose
docker-compose up -d

# 或直接运行
docker run -d -p 8080:80 --name 1some-tools ghcr.io/YOUR_USERNAME/1some-tools:latest
```

#### 1Panel部署
1. 复制`docker-compose.yml`内容到1Panel
2. 设置端口映射8080:80
3. 点击部署即可

## 📍 访问地址
- **主界面**: http://your-domain:8080/
- **颜色生成器**: http://your-domain:8080/tools/color_generator/index.html
- **Homepage书签添加器**: http://your-domain:8080/tools/links_homepage/addlinks/index.html
- **Homepage书签编辑器**: http://your-domain:8080/tools/links_homepage/editlinks/index.html

## 🎯 工具说明

| 工具 | 用途 | 特色 |
|---|---|---|
| 🎨 **颜色生成器** | 为homepage界面生成专业CSS配色方案 | 一键复制CSS代码 |
| 📥 **Homepage书签添加器** | 专为homepage配置设计，智能生成YAML格式的书签配置 | 批量添加、拖拽排序 |
| ✏️ **Homepage书签编辑器** | homepage配置专用，YAML反向解析与可视化编辑工具 | 可视化编辑、排重功能 |

## 🚀 部署选项

### GitHub部署
```bash
git clone https://github.com/YOUR_USERNAME/1Some-tools.git
cd 1Some-tools
python3 start.py
```

### Docker部署
```bash
# 本地构建
docker build -t 1some-tools .
docker run -d -p 8080:80 1some-tools

# 使用Compose
docker-compose up -d
```

### 阿里云服务器
1. 克隆项目
2. 使用Docker Compose启动
3. 配置安全组开放8080端口

## 📦 项目结构
```
1Some-tools/
├── index.html              # 主启动页
├── Dockerfile             # Docker镜像构建
├── docker-compose.yml     # Docker Compose配置
├── tools/
│   ├── color_generator/   # CSS配色工具
│   └── links_homepage/    # Homepage书签工具
└── docs/
    └── DEPLOYMENT.md      # 详细部署指南
```

## 🔗 相关链接
- [详细部署指南](DEPLOYMENT.md)
- [GitHub仓库](https://github.com/YOUR_USERNAME/1Some-tools)
- [Docker镜像](https://ghcr.io/YOUR_USERNAME/1some-tools:latest)

### 传统启动方式
如需单独启动某个工具：

#### 颜色生成器
```bash
cd tools/color_generator
python3 -m http.server 8000
```

#### 书签管理器
```bash
cd tools/links_homepage/addlinks
python3 -m http.server 8001

# 在另一个终端
cd tools/links_homepage/editlinks
python3 -m http.server 8002
```

## 🔧 开发指南

### 🆕 统一启动器开发
新的统一启动器采用现代化架构，支持动态工具管理：

#### 项目结构
```
launcher/               # 统一启动器
├── index.html         # 主控制台页面
├── style.css          # 样式文件
├── script.js          # 交互逻辑
├── config.js          # 配置管理
└── README.md          # 启动器文档
```

#### 添加新工具到启动器
1. **开发工具**: 在`tools/`目录下创建新工具
2. **注册工具**: 通过主控制台界面添加
3. **验证**: 检查工具是否正常加载
4. **备份**: 导出配置文件保存

### 环境要求
- Python 3.6+
- 现代浏览器（Chrome, Firefox, Safari, Edge）
- 无需额外依赖

### 开发规范
1. **工具结构标准**:
   ```
   tools/工具名/
   ├── index.html    # 主页面
   ├── script.js     # 交互逻辑
   ├── style.css     # 样式文件
   └── README.md     # 工具说明
   ```

2. **统一启动器规范**:
   - 使用CSS变量支持主题切换
   - 实现响应式设计
   - 添加键盘快捷键支持
   - 使用本地存储持久化配置

3. **代码规范**:
   - 使用语义化HTML5标签
   - CSS使用BEM命名规范
   - JavaScript使用ES6+语法
   - 添加必要的注释说明

4. **响应式设计**:
   - 移动端优先设计
   - 使用CSS Grid和Flexbox
   - 测试多种屏幕尺寸

### 添加新工具
#### 传统方式
1. 在`tools/`目录下创建新工具文件夹
2. 按照标准结构创建文件
3. 更新README.md中的工具列表
4. 测试工具功能和响应式适配

#### 统一启动器方式
1. 开发工具并放置在`tools/`目录
2. 启动统一服务: `python3 start_launcher.py`
3. 在主控制台点击"➕ 添加新工具"
4. 填写工具信息并保存
5. 工具立即生效，无需重启服务

### 工具命名建议
- 使用小写字母和下划线
- 名称要准确反映功能
- 避免使用缩写（除非是通用缩写）

## 🚀 未来规划

### 近期计划
- 🔍 **JSON格式化工具** - 美化和验证JSON数据
- 📊 **二维码生成器** - 支持多种格式和样式
- 📝 **Markdown编辑器** - 实时预览的MD编辑器
- ⏰ **倒计时工具** - 多种场景的时间管理
- 📏 **单位换算器** - 常用单位快速转换

### 中期目标
- 🌐 **PWA支持** - 支持离线使用和安装
- 🎨 **主题系统** - 支持深色/浅色主题切换
- 🔍 **全局搜索** - 跨工具快速搜索
- 📊 **使用统计** - 工具使用数据分析
- 🔄 **云同步** - 配置和数据云端同步

### 长期愿景
- 🤖 **AI集成** - 智能建议和自动化
- 📱 **移动端App** - React Native跨平台应用
- 🌟 **插件市场** - 第三方工具扩展
- 👥 **社区功能** - 用户分享和协作

## 🤝 贡献指南

### 如何参与
1. **Fork项目** - 创建个人副本
2. **创建功能分支** - `git checkout -b feature/新工具名`
3. **开发新工具** - 遵循项目规范
4. **测试验证** - 确保跨浏览器兼容
5. **提交PR** - 详细描述变更内容

### 贡献类型
- 🆕 **新工具开发** - 添加实用新功能
- 🐛 **Bug修复** - 修复已知问题
- 📚 **文档改进** - 完善使用说明
- 🎨 **UI优化** - 提升用户体验
- ⚡ **性能优化** - 提高运行效率

### 开发环境设置
```bash
# 安装开发依赖
pip install -r requirements.txt

# 启动开发服务器
python3 -m http.server 8000

# 访问 http://localhost:8000/tools/
```

## 📄 许可证
本项目采用 **MIT License** 开源协议，详见 [LICENSE](LICENSE) 文件。

## 🙏 致谢
- 感谢所有贡献者的付出
- 感谢开源社区的支持
- 特别感谢用户的反馈和建议

---

## 💡 快速链接
- [🎨 颜色生成器](tools/color_generator/index.html) - 立即体验
- [📥 书签添加器](tools/links_homepage/addlinks/index.html) - 开始添加
- [✏️ 书签编辑器](tools/links_homepage/editlinks/index.html) - 编辑现有配置

**遇到问题？** 请查看各工具的README.md获取详细帮助，或提交Issue寻求支持。