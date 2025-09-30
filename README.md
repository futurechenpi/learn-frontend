# 前端学习网站

一个基于Vue3的现代化前端学习平台，提供系统化的前端技术学习路径和AI智能答疑功能。

## 🚀 技术栈

- **前端框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **UI组件库**: Element Plus
- **样式框架**: TailwindCSS
- **状态管理**: Pinia
- **路由管理**: Vue Router
- **HTTP客户端**: Axios
- **图标库**: Element Plus Icons

## ✨ 功能特性

### 🎓 学习模块
- **HTML基础** - 网页结构基础学习
- **CSS样式** - 样式设计和布局技术
- **JavaScript** - 动态交互编程
- **Vue3框架** - 现代前端框架
- **React框架** - 组件化开发
- **TypeScript** - 类型安全编程
- **TailwindCSS** - 实用优先CSS框架

### 🤖 AI智能助手
- 实时学习答疑
- 常见问题快速回答
- 学习建议和指导
- 交互式聊天界面

### 🎨 主题系统
- 亮色/暗色模式切换
- 多种主题色选择
- 响应式设计
- 个性化定制

### 👤 用户系统
- 用户注册/登录
- 学习进度跟踪
- 个人资料管理

## 🛠️ 开发指南

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 📁 项目结构

```
src/
├── api/                 # API接口封装
│   ├── request.ts      # Axios配置和拦截器
│   └── user.ts         # 用户相关API
├── components/         # 公共组件
│   ├── ThemeToggle.vue # 主题切换组件
│   └── AIAssistant.vue # AI助手组件
├── stores/             # Pinia状态管理
│   ├── user.ts         # 用户状态
│   └── theme.ts        # 主题状态
├── views/              # 页面组件
│   ├── Home.vue        # 首页
│   ├── Login.vue       # 登录页
│   ├── Register.vue    # 注册页
│   ├── Learn.vue       # 学习页面
│   └── learn/          # 学习模块
│       ├── HTML.vue
│       ├── CSS.vue
│       ├── JavaScript.vue
│       ├── Vue3.vue
│       ├── React.vue
│       ├── TypeScript.vue
│       └── TailwindCSS.vue
├── router/             # 路由配置
│   └── index.ts
├── App.vue             # 根组件
├── main.ts             # 入口文件
└── style.css           # 全局样式
```

## 🔧 API接口

### 用户认证
- **登录**: `POST /user/login`
- **注册**: `POST /user/register`

#### 请求参数
```json
{
  "userName": "用户名",
  "password": "密码"
}
```

#### 登录响应
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "success": true,
    "message": "登录成功",
    "userInfo": {
      "userId": 8,
      "userName": "用户名",
      "email": "邮箱"
    },
    "token": "JWT令牌"
  }
}
```

## 🎯 学习路径

1. **HTML基础** - 学习网页结构
2. **CSS样式** - 掌握样式设计
3. **JavaScript** - 学习编程逻辑
4. **Vue3框架** - 现代前端开发
5. **React框架** - 组件化思维
6. **TypeScript** - 类型安全开发
7. **TailwindCSS** - 高效样式开发

## 🌟 特色功能

### 循序渐进的学习设计
- 从基础到进阶的系统化学习路径
- 每个模块都有详细的代码示例
- 实践练习和效果预览

### AI智能答疑
- 基于关键词的智能回答
- 常见问题快速解答
- 学习建议和指导

### 现代化UI设计
- 响应式布局适配各种设备
- 暗色模式保护视力
- 流畅的动画和交互效果

## 📝 开发说明

### 添加新的学习模块
1. 在 `src/views/learn/` 目录下创建新的Vue组件
2. 在 `src/router/index.ts` 中添加路由配置
3. 在 `src/views/Learn.vue` 中添加菜单项

### 自定义主题
1. 修改 `tailwind.config.js` 中的主题配置
2. 在 `src/stores/theme.ts` 中添加新的主题色
3. 在 `src/components/ThemeToggle.vue` 中更新颜色选项

### API接口配置
1. 在 `src/api/` 目录下添加新的API文件
2. 在 `src/api/request.ts` 中配置基础URL和拦截器
3. 在组件中导入并使用API函数

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

感谢以下开源项目：
- [Vue.js](https://vuejs.org/)
- [Element Plus](https://element-plus.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [Pinia](https://pinia.vuejs.org/)
