import { Question } from './types';

export const rnQuestions: Question[] = [
  {
    id: 101,
    category: 'React Native',
    difficulty: 'easy',
    question: 'React Native 的工作原理是什么？与原生开发和 WebView 方案的区别？',
    answer: `React Native 通过 JS 线程运行业务逻辑，通过 Bridge（旧架构）或 JSI（新架构）与原生模块通信，最终渲染原生组件。

与其他方案对比：
- 原生开发：直接调用系统 API，性能最优但需分别开发 iOS/Android
- WebView（Cordova/Ionic）：H5 运行在 WebView，性能差，无法使用原生组件
- React Native：JS 写逻辑，渲染真正的原生组件，性能接近原生

核心线程：
1. JS 线程：运行 React 代码和业务逻辑
2. UI 主线程：原生 UI 渲染
3. Shadow 线程：布局计算（Yoga 引擎）

优势：跨平台复用 70-90% 代码，热更新能力，Web 开发者上手快。`,
  },
  {
    id: 102,
    category: 'React Native',
    difficulty: 'easy',
    question: 'React Native 中 View、ScrollView、FlatList 的区别和使用场景？',
    answer: `View：最基础的容器，类似 div，不支持滚动。

ScrollView：可滚动容器，一次性渲染所有子组件。适合内容少（< 100 项）的场景。

FlatList：高性能列表，只渲染可视区域元素。适合长列表/大数据量，支持下拉刷新和上拉加载。

SectionList：分组列表，类似通讯录。

选择原则：少量固定内容 → ScrollView；长列表/动态数据 → FlatList/SectionList。`,
  },
  {
    id: 103,
    category: 'React Native',
    difficulty: 'easy',
    question: 'RN 的样式系统与 Web CSS 有什么区别？',
    answer: `1. 驼峰命名（backgroundColor 非 background-color）
2. 没有继承：文字样式不自动继承
3. Flexbox 默认 column 方向（Web 是 row）
4. 尺寸无单位：数字代表 dp
5. 没有级联/选择器：样式直接绑定到组件
6. 有限属性：不支持 float、grid、伪元素

布局完全依赖 Flexbox（Yoga 引擎）。推荐用 StyleSheet.create 获得缓存优化。`,
  },
  {
    id: 104,
    category: 'React Native',
    difficulty: 'medium',
    question: 'React Native 新架构（New Architecture）包含哪些核心改进？',
    answer: `新架构（0.68+ 引入，0.76+ 默认开启）四大改进：

1. JSI（JavaScript Interface）
替代旧 Bridge（JSON 序列化异步通信），JS 直接持有 C++ 对象引用，同步调用原生方法，消除序列化开销。

2. Fabric（新渲染器）
替代旧 UIManager，支持同步渲染、React 18 并发特性、C++ 层直接操作 Shadow Tree。

3. TurboModules
模块按需懒加载（旧架构启动时全初始化），通过 JSI 同步调用，支持 CodeGen 类型安全。

4. CodeGen
根据 TS 类型定义自动生成原生接口代码，保证类型一致性。

解决核心问题：异步通信瓶颈、启动性能、类型安全。`,
  },
  {
    id: 105,
    category: 'React Native',
    difficulty: 'medium',
    question: 'React Navigation 的核心概念和常见面试考察点？',
    answer: `Navigator 类型：
- Stack：页面堆栈 push/pop（最常用）
- Tab：底部/顶部标签栏
- Drawer：侧边抽屉
- Native Stack：原生导航栈，性能更好

核心 API：
- navigation.navigate('Screen', params) — 跳转
- navigation.goBack() — 返回
- navigation.reset() — 重置导航栈
- route.params — 获取参数

常见考察点：
- 嵌套导航的参数传递
- Deep Linking 配置
- 自定义转场动画
- 导航状态持久化
- TypeScript ParamList 类型定义
- 条件导航（未登录跳登录页）`,
  },
  {
    id: 106,
    category: 'React Native',
    difficulty: 'medium',
    question: 'FlatList 性能优化有哪些手段？',
    answer: `1. 组件层面：
- React.memo 包裹 renderItem 组件
- getItemLayout 提供固定高度跳过测量
- keyExtractor 使用稳定唯一 key

2. 渲染配置：
- initialNumToRender={10}
- maxToRenderPerBatch={5}
- windowSize={5}
- removeClippedSubviews={true}

3. 避免坑：
- renderItem 中不用内联函数/对象
- 列表项避免复杂阴影（Android）
- 图片用 FastImage 替代 Image
- 避免嵌套 ScrollView

4. 高级方案：
- FlashList（Shopify）：回收复用机制，性能提升 5-10x
- 骨架屏 + 分页加载
- 列表项避免不必要的状态`,
  },
  {
    id: 107,
    category: 'React Native',
    difficulty: 'medium',
    question: 'Animated 和 Reanimated 的区别？如何选择？',
    answer: `Animated（内置）：
- JS 线程计算动画
- useNativeDriver: true 可移到原生线程，但只支持 transform/opacity
- 适合简单动画

Reanimated（v2/v3）：
- 动画完全在 UI 线程运行
- 使用 worklet（UI 线程 JS 函数）
- 支持手势驱动（配合 gesture-handler）
- SharedValue + useAnimatedStyle

选择建议：
- 简单淡入/位移 → Animated + useNativeDriver
- 复杂手势交互 → Reanimated
- Layout 动画 → Reanimated Layout Animations
- 跟手动画/拖拽 → Reanimated + Gesture Handler`,
  },
  {
    id: 108,
    category: 'React Native',
    difficulty: 'medium',
    question: 'CodePush 热更新原理是什么？有什么限制？',
    answer: `原理：
RN 应用 = 原生壳 + JS Bundle。CodePush 允许不发版替换 JS Bundle 和资源文件。
流程：启动检查更新 → 下载新 Bundle → 下次启动/立即重载生效。

限制：
- 不能修改原生代码（新增原生模块、改 native 配置）
- 苹果政策要求不能改变 App 主要功能
- 需要版本回滚机制

最佳实践：
- 灰度发布（先小比例推送）
- 强制更新 vs 静默更新策略
- 版本兼容性检查
- 国内方案：Pushy、自建服务`,
  },
  {
    id: 109,
    category: 'React Native',
    difficulty: 'medium',
    question: 'React Native 中如何处理平台差异？',
    answer: `1. Platform 模块：
Platform.OS === 'ios' / 'android'
Platform.select({ ios: {...}, android: {...} })

2. 平台特定文件：
Component.ios.tsx / Component.android.tsx（自动选择）

3. 常见差异：
- 阴影：iOS shadow*，Android elevation
- 返回键：Android 需 BackHandler
- 字体：iOS SF Pro，Android Roboto
- 权限：iOS Info.plist，Android Manifest
- 状态栏高度：SafeAreaView 处理

4. 安全区域：
react-native-safe-area-context 的 SafeAreaView

5. 响应式：
useWindowDimensions + flex 布局适配不同屏幕`,
  },
  {
    id: 110,
    category: 'React Native',
    difficulty: 'hard',
    question: '如何排查和解决 RN 性能问题？',
    answer: `问题分类：
1. JS 线程卡顿（逻辑计算重）
2. UI 线程卡顿（渲染/布局复杂）
3. 桥通信瓶颈（新架构已解决）

排查工具：
- Flipper：性能面板、网络、布局
- Perf Monitor：实时 FPS、内存
- why-did-you-render：追踪不必要重渲染
- Systrace/Instruments：原生层分析

常见问题 → 解决：
- 列表卡顿 → FlashList + memo + getItemLayout
- JS 满载 → InteractionManager 延迟、移到原生模块
- 动画卡顿 → Reanimated UI 线程执行
- 内存泄漏 → 清理定时器/订阅、注意闭包
- 启动慢 → Hermes + 拆包 + 延迟初始化
- 频繁 re-render → memo + 状态结构优化`,
  },
  {
    id: 111,
    category: 'React Native',
    difficulty: 'hard',
    question: 'Hermes 引擎的优势和原理？',
    answer: `Hermes 是 Meta 为 RN 优化的 JS 引擎（0.70+ 默认启用）。

对比 JSC：
- 启动快 2x（AOT 字节码 vs 运行时编译）
- 内存低 30-50%
- 包体积更小

核心优化：
1. AOT 编译：构建时编译为 .hbc 字节码，运行时直接执行
2. 分代 GC：减少垃圾回收暂停时间
3. 惰性编译：函数首次调用才完整编译
4. 内存优化：字符串去重、紧凑对象布局

注意：
- 不支持 JIT（iOS 政策），字节码预编译弥补
- 调试用 Flipper 或 Hermes 调试器
- Proxy/WeakRef 等现已完整支持`,
  },
  {
    id: 112,
    category: 'React Native',
    difficulty: 'hard',
    question: '如何编写原生模块并与 JS 交互？',
    answer: `交互方式：
1. NativeModules（旧架构）：Bridge 异步通信
2. TurboModules（新架构）：JSI 同步/异步
3. Native UI Components：原生 View 暴露为 RN 组件

编写步骤（旧架构）：
iOS：创建继承 NSObject 的类，RCT_EXPORT_METHOD 暴露方法
Android：继承 ReactContextBaseJavaModule，@ReactMethod 注解

TurboModules（新架构）：
1. 写 Spec 文件（TS 接口定义）
2. CodeGen 生成原生胶水代码
3. 实现原生接口

JS 调用：
import { NativeModules } from 'react-native';
NativeModules.MyModule.doSomething();

常见场景：蓝牙/NFC、三方 SDK、加密/图像处理`,
  },
  {
    id: 113,
    category: 'React Native',
    difficulty: 'hard',
    question: 'RN 拆包方案和增量更新如何实现？',
    answer: `拆包策略：
- 基础包：React + RN 核心 + 公共组件 → 内置 App
- 业务包：各业务代码 → 按需下载

Metro 拆包实现：
1. createModuleIdFactory：自定义模块 ID 保证稳定
2. processModuleFilter：过滤基础包模块
3. 原生侧 loadBundleURL 加载业务 bundle

增量更新：
- bsdiff 计算二进制差量
- 客户端合并 patch → 新 Bundle
- 通常只有几十 KB

业界方案：
- 携程 CRN：基础包 + 业务包 + 增量
- 美团 MRN：多 Bundle 动态加载 + 预加载
- Expo Updates：自带 OTA 更新方案`,
  },
  {
    id: 114,
    category: 'React Native',
    difficulty: 'medium',
    question: 'RN 中的状态管理方案如何选择？',
    answer: `按项目复杂度：

1. useState + Context：小项目，局部共享。缺点：消费者全量重渲染。

2. Zustand（推荐）：简单直观，精确订阅，支持 persist/devtools 中间件。

3. Redux Toolkit：大型团队，严格单向数据流，RTK Query 处理服务端状态。

4. React Query / TanStack Query：专治服务端状态（缓存、重试、后台刷新）。

5. Jotai：原子化状态，细粒度订阅。

推荐组合：
- 小项目：useState + Context
- 中型：Zustand + React Query
- 大型：Redux Toolkit + RTK Query`,
  },
  {
    id: 115,
    category: 'React Native',
    difficulty: 'hard',
    question: 'RN 项目工程化体系如何搭建？',
    answer: `完整体系：

1. 初始化：CLI 或 Expo，规范目录结构

2. 开发规范：TS 严格模式 + ESLint + Prettier + Husky + Conventional Commits

3. 导航：React Navigation + TS 类型化路由

4. 状态管理：Zustand/RTK + React Query

5. 网络层：Axios 封装（拦截器、重试、Token 刷新、类型定义）

6. CI/CD：GitHub Actions + Fastlane + CodePush + 自动化测试（Jest + Detox/Maestro）

7. 监控：Sentry 崩溃收集 + 性能监控 + 日志系统

8. 多环境：react-native-config 管理 dev/staging/prod

9. 组件库：Storybook for RN + 设计系统

10. 发布：版本管理 + 灰度策略 + 热更新回滚`,
  },
];
