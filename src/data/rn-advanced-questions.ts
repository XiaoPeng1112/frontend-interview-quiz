import { Question } from './types';

export const rnAdvancedQuestions: Question[] = [
  {
    id: 1101,
    category: 'RN 架构深度',
    difficulty: 'hard',
    question: 'JSI（JavaScript Interface）的底层实现原理是什么？相比 Bridge 在性能上有哪些量化提升？',
    answer: `JSI 本质是一层 C++ 抽象层，让 JS 引擎（Hermes/JSC/V8）通过统一接口暴露 HostObject 给 JS 层。

核心机制：
1. JS 对象直接持有 C++ 对象的引用（shared_ptr），调用方法时直接走 C++ 虚函数分派
2. 不再需要 JSON 序列化/反序列化，消除了 Bridge 的 ~5ms 延迟
3. 支持同步调用：JS 可以同步获取 Native 返回值（Bridge 只能异步 callback）
4. 内存共享：可以传递 ArrayBuffer 等二进制数据的指针，零拷贝

性能提升（Meta 官方数据）：
- 启动时间减少 ~15%（无需初始化 Bridge 队列）
- 单次 Native 调用延迟从 ~5ms 降至 <0.1ms
- 高频通信场景（动画/手势）帧率提升 30-60%
- 内存占用减少 ~20%（无消息队列缓存）

与 Bridge 对比：
Bridge：JS → JSON.stringify → Message Queue → Native Dispatch → JSON.parse → Native
JSI：JS → C++ HostObject.get() → Native（直接函数调用）

注意：JSI 同步调用会阻塞 JS 线程，耗时操作仍需异步（通过返回 Promise）。`,
  },
  {
    id: 1102,
    category: 'RN 架构深度',
    difficulty: 'hard',
    question: 'Fabric 渲染器的渲染管线是怎样的？与旧 UIManager 的核心区别在哪？',
    answer: `Fabric 渲染管线（三阶段）：

1. Render Phase（JS 线程）：
- React reconciler 产出 React Element Tree
- 通过 JSI 同步创建 C++ Shadow Node（不再异步发消息）
- 构建 Shadow Tree（不可变数据结构）

2. Commit Phase（Background 线程）：
- Yoga 引擎进行布局计算（flexbox → 绝对坐标）
- 生成新旧 Shadow Tree 的 diff
- 产出 Mutation 指令集

3. Mount Phase（UI 线程）：
- 执行 Mutation 指令（create/update/delete/insert 原生 View）
- 直接操作原生视图层级

与旧 UIManager 的核心区别：
1. 同步创建 Shadow Node（旧：异步消息队列）→ 支持 React 18 并发特性
2. 不可变 Shadow Tree（旧：可变状态）→ 支持多次 render 比较
3. C++ 层统一实现（旧：iOS/Android 各自实现）→ 跨平台一致性
4. 支持优先级中断（旧：一旦开始不可打断）→ 响应性更好
5. 视图扁平化（View Flattening）自动优化层级深度

对 MRN 的影响：
- 多 Bundle 共享同一个 Fabric 渲染器实例
- Shadow Tree 的不可变性让多 Bundle 并发渲染成为可能
- 但需注意 Surface 之间的 z-index 和事件分发隔离`,
  },
  {
    id: 1103,
    category: 'RN 架构深度',
    difficulty: 'hard',
    question: 'TurboModules 的懒加载机制具体如何实现？在 MRN 多 Bundle 场景下有什么特殊考虑？',
    answer: `TurboModules 懒加载实现：

1. 注册阶段：
- 编译时 CodeGen 根据 Spec 文件生成类型安全的 C++ 接口
- 运行时向 TurboModuleManager 注册 Provider（工厂函数），不实例化

2. 首次调用触发加载：
- JS 层 require('NativeXxx') 时，通过 JSI 调用 global.__turboModuleProxy
- TurboModuleManager 查找对应 Provider，首次调用时才实例化 Native 模块
- 实例化后缓存，后续调用直接返回

3. 与旧架构对比：
- 旧：App 启动时遍历所有 @ReactModule 注解，全部初始化 → 启动慢
- 新：按需加载，启动时只初始化核心模块 → 启动快 30-50%

MRN 多 Bundle 场景特殊考虑：
1. 模块共享 vs 隔离：
- 公共 TurboModule（网络/存储/日志）多 Bundle 共享同一实例
- 业务特有模块按 Bundle 维度隔离

2. 模块生命周期管理：
- Bundle 卸载时需要清理该 Bundle 注册的私有模块
- 共享模块引用计数，最后一个 Bundle 卸载时才释放

3. 版本兼容：
- 不同 Bundle 可能依赖同一模块的不同版本
- 需要版本协商机制或 API 向下兼容设计

4. 性能监控：
- 记录各模块首次加载耗时，识别启动阻塞模块
- 对高频调用模块进行预加载优化`,
  },
  {
    id: 1104,
    category: 'RN 架构深度',
    difficulty: 'hard',
    question: 'Hermes 字节码编译和执行的完整流程是怎样的？如何针对 RN 场景进行优化？',
    answer: `Hermes 编译执行流程：

1. 构建时（AOT 编译）：
JS Source → Lexer/Parser → AST → IR（中间表示）→ 优化 Pass → Bytecode(.hbc)
- 关键优化 Pass：常量折叠、死代码消除、内联、寄存器分配
- 生成紧凑的 .hbc 文件，包含字节码 + 字符串表 + 函数表

2. 运行时（解释执行）：
- mmap 加载 .hbc（延迟加载，只读取实际访问的页）
- 解释器逐条执行字节码（无 JIT，避免 iOS 限制）
- 分代 GC：Young Gen（复制式）+ Old Gen（标记清除+压缩）

3. 函数惰性编译：
- 函数体首次被调用时才完整编译（减少启动内存）
- 编译结果缓存在内存中

针对 RN 场景的优化策略：

1. Bundle 体积优化：
- 启用 minify + 字节码压缩（通常比 JSC 小 30-50%）
- Metro 配置 bytecodeVersion 确保版本匹配
- Source Map 分离存储（线上不带）

2. 启动优化：
- 分析 .hbc 的函数热度，调整编译顺序
- 预热关键路径函数（首屏相关）
- 利用 mmap 特性，非首屏代码按需加载

3. GC 调优：
- 设置合理的 GC 触发阈值（避免首屏期间 GC）
- 大对象直接分配到 Old Gen
- 监控 GC 暂停时间（目标 <16ms）

4. 多 Bundle 场景：
- 基础包和业务包分别编译为独立 .hbc
- 共享字符串表避免重复
- 业务包按需 mmap，卸载时 munmap 释放内存`,
  },
  {
    id: 1105,
    category: 'RN 架构深度',
    difficulty: 'hard',
    question: 'MRN 多 Bundle 架构的设计原理和加载流程是什么？如何解决多 Bundle 间的通信和依赖问题？',
    answer: `MRN 多 Bundle 架构设计原理：

核心思想：将 RN 应用拆分为「基础包 + N 个业务包」，实现独立开发、独立发布、按需加载。

分包策略：
1. 基础包（Common Bundle）：React/RN 核心 + 公共组件 + 公共工具
   - 随 App 发版内置，版本跟随 App
   - 体积通常 1-2MB（压缩后 300-500KB）
2. 业务包（Biz Bundle）：各业务线独立代码
   - 通过平台下发，支持热更新
   - 体积通常 50-200KB

加载流程：
1. App 启动 → 预加载基础包（创建 JS Runtime + 执行基础包）
2. 用户进入业务页面 → 检查本地是否有业务包缓存
3. 无缓存：下载业务包 → 校验（签名+完整性）→ 缓存
4. 加载业务包：在已有 Runtime 上执行业务包代码
5. 渲染业务页面（RN Surface）

多 Bundle 通信机制：
1. 事件总线（EventEmitter）：跨 Bundle 发布/订阅事件
2. 共享 Context：通过基础包提供全局 Store（如用户信息/登录态）
3. URL Schema 路由：通过统一路由协议跳转
4. Native Bridge 中转：Native 层作为消息代理

依赖管理：
1. 公共依赖提升到基础包，业务包 external 化
2. Metro 配置 createModuleIdFactory 保证模块 ID 全局唯一
3. 业务包构建时排除基础包模块（processModuleFilter）
4. 版本锁定：业务包声明依赖的基础包最低版本

降级策略：
- Bundle 加载失败 → H5 降级页
- JS 异常超阈值 → 自动回滚到上一版本
- 网络不可用 → 使用内置兜底包`,
  },
  {
    id: 1106,
    category: 'RN 架构深度',
    difficulty: 'hard',
    question: 'RN 首屏渲染的完整链路是什么？你是如何将首屏时间从 2s 优化到 1s 以内的？',
    answer: `首屏渲染完整链路：

1. Native 容器初始化（~100-200ms）：
- 创建 RCTBridge/ReactInstanceManager
- 初始化 JS 引擎（Hermes）
- 注册 Native Modules

2. JS Bundle 加载（~200-500ms）：
- 从磁盘/网络加载 Bundle
- Hermes 执行 .hbc 字节码
- React/RN 运行时初始化

3. JS 业务执行（~100-300ms）：
- 执行 AppRegistry.registerComponent
- React reconciliation 生成 Virtual DOM
- 首次 render 触发组件树构建

4. 布局计算（~50-100ms）：
- Shadow Tree 构建
- Yoga 计算布局（Flexbox → 绝对坐标）

5. Native 渲染（~50-100ms）：
- 创建原生 View 实例
- 设置属性、插入视图层级
- 首帧绘制

优化手段（2s → <1s）：

阶段1 - 容器预创建（省 ~200ms）：
- App 启动时预创建 RN 容器池
- 进入业务时直接复用，无需等待初始化

阶段2 - Bundle 加载优化（省 ~300ms）：
- 基础包随 App 启动预加载
- 业务包预下载 + 本地缓存
- 增量更新（bsdiff）减小下载体积

阶段3 - JS 执行优化（省 ~200ms）：
- 首屏数据预请求（Native 并行请求 + 注入 JS）
- 延迟初始化非首屏模块（InteractionManager.runAfterInteractions）
- 精简首屏组件树，非首屏内容懒渲染

阶段4 - 渲染优化（省 ~100ms）：
- 减少 View 嵌套层级（View Flattening）
- 首屏图片预加载 + 本地缓存
- 骨架屏/原生闪屏覆盖白屏期

监控指标：
- TTI（Time to Interactive）：从点击到可交互
- FMP（First Meaningful Paint）：首次有意义渲染
- Bundle 执行时长、JS→Native 通信次数`,
  },
  {
    id: 1107,
    category: 'RN 架构深度',
    difficulty: 'hard',
    question: 'RN 容器化架构是什么？如何实现多业务的隔离和共享的平衡？',
    answer: `容器化架构定义：
将 RN 运行时环境（JS Engine + Native Modules + 渲染器）封装为标准容器，业务代码以「插件」形式运行在容器内。类似 Docker 对进程的隔离。

架构分层：
┌─────────────────────────────────┐
│ 业务层（Biz Bundles）            │  各业务独立开发/发布
├─────────────────────────────────┤
│ 框架层（基础包 + 公共组件/SDK）   │  统一维护
├─────────────────────────────────┤
│ 容器层（RN Runtime + Modules）   │  标准化容器
├─────────────────────────────────┤
│ 宿主层（Native App）             │  提供原生能力
└─────────────────────────────────┘

隔离机制：
1. JS 执行隔离：
- 方案A：多 Context（同一 Runtime 不同全局对象）→ 轻量但隔离不彻底
- 方案B：多 Runtime（独立 Hermes 实例）→ 隔离彻底但内存开销大
- MRN 选择：单 Runtime + 模块作用域隔离（折中）

2. UI 渲染隔离：
- 每个业务 Bundle 对应独立 Surface（RN Root View）
- Surface 间互不影响，独立 React Tree

3. 状态隔离：
- 业务私有状态在各自 Bundle 内闭包管理
- 共享状态通过容器提供的 Context API 访问

共享机制：
1. 公共模块共享：网络/存储/路由/埋点/登录态 → 基础包提供
2. UI 组件共享：设计系统组件库 → 基础包内置
3. Native 能力共享：统一 Bridge/TurboModule 注册

关键设计决策：
- 基础包版本管理：语义化版本 + 兼容性矩阵
- 业务包准入标准：体积限制、性能指标门槛
- 容器能力标准化：API 文档 + 版本管理
- 故障隔离：单个业务包 crash 不影响其他业务`,
  },
  {
    id: 1108,
    category: 'RN 架构深度',
    difficulty: 'hard',
    question: 'RN 内存管理和常见内存泄漏场景有哪些？如何系统性排查和优化？',
    answer: `RN 内存分布：

1. JS Heap（Hermes 管理）：JS 对象、闭包、组件实例
2. Native Heap：原生 View 实例、图片缓存、Native Module 状态
3. Shadow Tree：C++ 层布局节点

常见内存泄漏场景：

1. 事件监听未清理：
- DeviceEventEmitter.addListener 未在 unmount 时 remove
- AppState/Dimensions 监听遗留

2. 定时器泄漏：
- setInterval/setTimeout 未 clear
- Animated 循环动画未 stop

3. 闭包持有大对象：
- useCallback/useEffect 闭包引用大数据
- 异步回调持有已卸载组件的 state setter

4. 图片缓存失控：
- FastImage/Image 缓存无上限
- 大图未及时释放

5. 导航栈堆积：
- 页面 push 不 pop，历史页面组件不卸载
- 多层 Modal 叠加

6. Native Module 泄漏：
- Native 持有 JS callback 引用
- 三方 SDK 未正确释放

排查工具和方法：

1. Hermes 内存分析：
- hermes-profile 导出内存快照
- Chrome DevTools Memory Tab 分析堆

2. Native 内存：
- iOS：Instruments Allocations/Leaks
- Android：Android Studio Profiler

3. 自动化监控：
- PerformanceObserver 监控 JS Heap 增长趋势
- 进入/退出页面后对比内存是否回落
- 设置内存阈值告警

优化策略：
- 组件卸载清理 checklist（定时器/监听/动画/请求）
- 图片缓存 LRU + 最大容量限制
- 列表虚拟化 + 离屏回收
- 多 Bundle 卸载时完整清理（移除 Surface + 清理全局注册）`,
  },
  {
    id: 1109,
    category: 'RN 架构深度',
    difficulty: 'hard',
    question: '如何设计 RN 应用的灰度发布和异常监控体系？',
    answer: `灰度发布体系设计：

1. 发布通道：
- Bundle 发布平台：上传、审核、分发
- 多环境：dev → staging → canary → production
- 版本管理：{appVersion}_{bundleVersion}_{patch}

2. 灰度策略：
- 用户维度：按 userId 哈希取模（1% → 5% → 20% → 100%）
- 设备维度：按 IMEI/IDFA 分桶
- 地域维度：先小城市后大城市
- 白名单：内部测试优先

3. 灰度控制：
- 服务端下发灰度规则 + Bundle 地址
- 客户端本地判断是否命中灰度
- 支持紧急回滚（5 分钟内全量回退）

异常监控体系：

1. JS 异常捕获：
- ErrorUtils.setGlobalHandler（全局未捕获异常）
- Error Boundary（组件树崩溃隔离）
- Promise rejection 监听

2. 上报内容：
- 错误堆栈 + Source Map 还原
- 用户/设备/Bundle 版本/页面路径
- 异常前 N 步用户行为（面包屑）

3. 性能监控：
- 首屏 TTI、FPS、JS 线程占用
- Native 模块调用耗时分布
- 内存/CPU 使用趋势

4. 告警和熔断：
- JS Error Rate > 1% → 自动停止灰度
- Crash Rate > 0.5% → 自动回滚
- P99 TTI > 3s → 通知开发者

5. 数据分析：
- 按版本/Bundle/页面聚合异常
- 新旧版本对比（灰度 AB 组）
- 趋势分析 + 根因定位

工具选型：
- Sentry（JS 异常）+ 自建平台（性能/灰度控制）
- 美团内部：CAT（监控）+ Rhino（发布平台）`,
  },
  {
    id: 1110,
    category: 'RN 架构深度',
    difficulty: 'hard',
    question: '跨端方案（RN/Flutter/KMM/Compose Multiplatform）对比分析？如何做技术选型？',
    answer: `跨端方案对比：

React Native：
- 渲染方式：原生组件渲染
- 语言：JavaScript/TypeScript
- 性能：接近原生（新架构后显著提升）
- 热更新：天然支持（JS Bundle 替换）
- 生态：最丰富（npm 生态）
- 人才储备：前端开发者可快速上手
- 缺点：大量 Native 交互时复杂度高

Flutter：
- 渲染方式：Skia 自绘引擎（不使用原生组件）
- 语言：Dart
- 性能：接近原生（编译为 ARM 代码）
- 热更新：官方不支持（Dart AOT）
- 生态：快速增长但不如 npm
- 缺点：Dart 人才少，包体积大，热更新困难

KMM（Kotlin Multiplatform Mobile）：
- 共享范围：仅逻辑层（网络/数据/业务逻辑）
- UI 层：各平台原生开发
- 适合：UI 差异大但逻辑重合的场景
- 缺点：UI 仍需双端开发

Compose Multiplatform：
- 共享范围：逻辑 + UI
- 底层：Skia 渲染（类似 Flutter）
- 优势：Kotlin 生态，Android 开发者友好
- 缺点：iOS 支持仍在完善

选型决策框架：

1. 团队背景：
- 前端团队 → RN
- Android/Kotlin 团队 → KMM/Compose
- 无历史包袱 → Flutter

2. 业务需求：
- 需要热更新 → RN（必选）
- 高动画/游戏化 → Flutter
- 逻辑共享为主 → KMM
- 已有 Web 生态 → RN（代码最大化复用）

3. 美团场景选择 RN 的原因：
- 前端团队规模大，TS 能力强
- 热更新是核心诉求（高频迭代）
- 已有完善的 MRN 基建
- npm 生态可复用大量 Web 工具链`,
  },
];
