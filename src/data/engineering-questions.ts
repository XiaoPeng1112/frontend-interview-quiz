import { Question } from './types';

export const engineeringQuestions: Question[] = [
  {
    id: 1001,
    category: '工程化',
    difficulty: 'medium',
    question: 'Webpack、Vite、Metro 的区别？',
    answer: `Webpack：
- 基于 Bundle 的打包器
- 生态丰富，配置灵活但复杂
- 开发时全量打包，大项目 HMR 慢

Vite：
- 开发时利用浏览器原生 ESM，按需编译，启动快
- 生产用 Rollup 打包
- 配置简单，插件兼容 Rollup

Metro（RN 专用）：
- React Native 官方打包器
- 支持 RN 特有功能（平台文件 .ios/.android）
- 增量编译、支持拆包
- 不面向浏览器，输出单个 Bundle

选择：Web 项目用 Vite，RN 用 Metro，老项目可能还在 Webpack。`,
  },
  {
    id: 1002,
    category: '工程化',
    difficulty: 'medium',
    question: 'CI/CD 在前端项目中如何实践？',
    answer: `CI（持续集成）：
- 代码提交触发：lint + 类型检查 + 单元测试
- PR 检查：自动化测试 + 代码审查 + 构建验证
- 工具：GitHub Actions / GitLab CI / Jenkins

CD（持续部署）：
- 自动构建 → 部署到测试/预发/生产环境
- 静态站点：Vercel / Netlify / 对象存储 + CDN
- RN 应用：Fastlane + App Store Connect / Google Play

RN 特有流程：
- iOS：Archive → Upload → TestFlight → Release
- Android：Gradle Build → Sign → Upload → Release
- CodePush：JS Bundle 热更新通道

最佳实践：
- 分支策略：main/develop/feature
- 环境隔离：dev/staging/production
- 版本管理：Semantic Versioning
- 回滚机制：快速回退到上一版本`,
  },
  {
    id: 1003,
    category: '工程化',
    difficulty: 'medium',
    question: '前端项目的测试策略？',
    answer: `测试金字塔：
1. 单元测试（底层，数量最多）：
- 工具：Jest / Vitest
- 测试纯函数、hooks、工具方法
- 覆盖率目标 80%+

2. 组件测试（中层）：
- 工具：React Testing Library
- 测试组件渲染、交互、状态
- 关注用户行为而非实现细节

3. E2E 测试（顶层，数量少）：
- Web：Playwright / Cypress
- RN：Detox / Maestro
- 测试核心用户流程

RN 特有：
- Detox：灰盒测试，控制原生行为
- Maestro：声明式 E2E，简单易用
- Jest + @testing-library/react-native：组件测试

策略：核心路径 E2E 覆盖 + 复杂逻辑单元测试 + 关键组件交互测试。`,
  },
  {
    id: 1004,
    category: '工程化',
    difficulty: 'hard',
    question: 'Monorepo 在前端项目中的实践？',
    answer: `Monorepo：多个项目/包在同一个仓库中管理。

适用场景：
- 多端共享代码（RN + Web + 小程序）
- 组件库 + 应用 + 工具库
- 微前端多应用

主流工具：
1. pnpm workspace：快速依赖安装、严格隔离
2. Turborepo：增量构建、远程缓存、任务编排
3. Nx：全功能构建系统、生成器、依赖图
4. Lerna：经典方案，发包管理

典型结构：
/packages
  /shared（公共代码）
  /ui（组件库）
  /app-web（Web 应用）
  /app-rn（RN 应用）
  /utils（工具库）

RN + Web 共享：
- 共享业务逻辑层（hooks、store、API）
- UI 层各端独立实现
- 使用 react-native-web 最大化复用`,
  },
  {
    id: 1005,
    category: '工程化',
    difficulty: 'hard',
    question: '微前端架构是什么？在什么场景下使用？',
    answer: `微前端：将前端应用拆分为独立开发、部署的子应用，运行时集成。

适用场景：
- 大型团队多业务线独立交付
- 老系统渐进式重构（新旧技术栈共存）
- 跨团队协作需要技术隔离

主流方案：
1. qiankun（蚂蚁）：基于 single-spa，JS 沙箱 + CSS 隔离
2. Micro App（京东）：WebComponent 方式
3. Module Federation（Webpack 5）：运行时模块共享
4. iframe：天然隔离，但通信和性能差

核心问题：
- 样式隔离：Shadow DOM / CSS Modules / 命名空间
- JS 沙箱：Proxy 代理 window
- 路由接管：主应用统一路由分发
- 状态共享：全局事件总线 / 共享状态库
- 性能：预加载子应用、共享依赖

与 RN 的类比：RN 拆包 + 多 Bundle 动态加载本质类似微前端思想。`,
  },
];
