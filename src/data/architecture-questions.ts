import { Question } from './types';

export const architectureQuestions: Question[] = [
  {
    id: 1201,
    category: '架构设计',
    difficulty: 'hard',
    question: '如何设计一个多 Bundle 动态化平台？从 Bundle 构建、分发、加载到运行的完整链路？',
    answer: `多 Bundle 动态化平台完整设计：

一、构建系统：
1. 分包构建：
- 基础包：metro --entry=common.js --config=common.config.js
- 业务包：metro --entry=biz.js --config=biz.config.js（external 基础包模块）
- 模块 ID 策略：基础包用路径 hash，业务包用 bundleId + 模块 index

2. 产物处理：
- Hermes 字节码编译（.hbc）
- 签名（防篡改）+ 压缩（brotli）
- Source Map 分离上传（仅内部使用）
- 生成 manifest.json（版本/依赖/入口/大小/MD5）

二、分发系统：
1. Bundle 管理平台：
- 上传/审核/发布工作流
- 多环境管理（dev/staging/canary/prod）
- 版本树：基础包版本 → 兼容的业务包版本列表

2. 下发策略：
- CDN 加速 + 就近节点
- 灰度规则引擎（用户/地域/设备/比例）
- 客户端轮询/推送检查更新
- 差量更新（bsdiff 减小下载量 60-80%）

三、加载系统（客户端）：
1. Bundle 管理器：
- 本地 Bundle 仓库（LRU 缓存）
- 版本校验 + 完整性检查
- 优先级队列（首屏 > 预加载 > 后台更新）

2. 加载策略：
- 冷启动：App 启动 → 加载基础包 → 预加载高频业务包
- 热加载：进入页面 → 检查缓存 → 无则下载 → 执行
- 预加载：空闲时根据用户行为预测预加载

四、运行时：
1. 多 Bundle 执行：
- 基础包提供 Runtime 环境
- 业务包在同一 Runtime 上下文执行
- 模块注册表统一管理
2. 降级兜底：
- 加载超时 → H5 降级
- JS 异常 → 回滚到上一稳定版本
- 内置兜底 Bundle（离线可用）`,
    oralAnswer: `多 Bundle 动态化平台分四个部分。

构建系统：基础包和业务包分开构建，业务包 external 基础包的模块。产物做 Hermes 字节码编译、签名防篡改、Brotli 压缩，生成 manifest 记录版本和依赖信息。

分发系统：有一个 Bundle 管理平台做上传审核发布，支持多环境管理。下发策略用 CDN 加速，加灰度规则引擎控制发布比例，客户端轮询或推送检查更新，用 bsdiff 做差量更新减小下载量。

加载系统：客户端有本地 Bundle 仓库做 LRU 缓存，加载时做版本校验和完整性检查。策略上冷启动先加载基础包再预加载高频业务包，热加载时检查缓存没有就下载，空闲时预测性预加载。

运行时：基础包提供 Runtime 环境，业务包在同一上下文执行。降级兜底设计很关键：加载超时降级 H5，JS 异常回滚上一版本，内置兜底 Bundle 保证离线可用。`,
  },
  {
    id: 1202,
    category: '架构设计',
    difficulty: 'hard',
    question: '大型 RN 应用的性能监控体系如何从零搭建？关键指标和告警策略？',
    answer: `性能监控体系架构：

采集层 → 传输层 → 存储层 → 分析层 → 告警/展示层

一、核心指标体系：

1. 加载性能：
- Bundle 下载耗时（P50/P99）
- JS 执行耗时（从 loadBundle 到 registerComponent）
- TTI（Time to Interactive）
- FMP（First Meaningful Paint）

2. 运行时性能：
- FPS（JS 线程 + UI 线程分别监控）
- JS 线程阻塞时长和次数
- 内存使用量和趋势（JS Heap + Native）
- 长任务（>50ms 的 JS 执行）

3. 网络性能：
- API 请求耗时分布
- 失败率/超时率
- 首屏数据请求并行度

4. 异常指标：
- JS Error Rate（按页面/Bundle 维度）
- Native Crash Rate
- ANR（Application Not Responding）率

二、采集方案：

1. 自动埋点：
- 页面生命周期 Hook（进入/离开/可见/不可见）
- 性能 API：PerformanceObserver + 自定义 metric mark
- 错误捕获：全局 ErrorHandler + Error Boundary

2. 手动埋点：
- 关键业务节点打点
- 自定义 Span（类似 Trace）

三、告警策略：

1. 阈值告警：
- TTI P99 > 3s → P2 告警
- JS Error Rate > 0.5% → P1 告警
- FPS < 30 持续 5s → P2 告警
- 内存 > 500MB → P1 告警

2. 环比告警：
- 核心指标比昨日/上周恶化 20% → P2
- 新版本发布后 1h 内指标对比

3. 灰度熔断：
- 灰度期间指标恶化 → 自动暂停扩量
- 严重恶化 → 自动回滚

四、分析和定位：
- 火焰图：JS 线程执行分析
- 堆栈聚合：相似异常自动归类
- 用户路径回放：异常前的操作序列
- 版本对比：新旧版本指标 diff`,
    oralAnswer: `性能监控体系分五层：采集、传输、存储、分析、告警展示。

核心指标体系有四类：加载性能看 Bundle 下载耗时、JS 执行耗时、TTI、FMP；运行时性能看 FPS（JS 和 UI 线程分别监控）、JS 线程阻塞、内存使用、长任务；网络性能看 API 耗时分布和失败率；异常看 JS Error Rate、Native Crash Rate、ANR 率。

采集方案分自动和手动：自动埋点通过页面生命周期 Hook、PerformanceObserver、全局 ErrorHandler 和 Error Boundary；手动埋点针对关键业务节点。

告警策略有三种：阈值告警（比如 TTI P99 超 3 秒报 P2）、环比告警（指标比昨日恶化 20% 报警）、灰度熔断（灰度期间指标恶化自动暂停甚至回滚）。分析定位用火焰图、堆栈聚合、用户路径回放和版本对比。`,
  },
  {
    id: 1203,
    category: '架构设计',
    difficulty: 'hard',
    question: '如何设计一个前端 SDK 的架构？考虑通用性、扩展性、体积和性能？',
    answer: `前端 SDK 架构设计（以监控 SDK 为例）：

一、架构分层：
┌──────────────────────────────┐
│ 插件层（Plugin System）       │ 按需加载的功能模块
├──────────────────────────────┤
│ 核心层（Core）                │ 生命周期/事件总线/配置/队列
├──────────────────────────────┤
│ 传输层（Transport）           │ 上报策略/压缩/重试
├──────────────────────────────┤
│ 平台适配层（Platform Adapter）│ Web/RN/小程序适配
└──────────────────────────────┘

二、核心设计原则：

1. 插件化架构：
- 核心包 < 5KB（gzip），只包含生命周期和事件总线
- 功能模块都是插件：sdk.use(ErrorPlugin), sdk.use(PerfPlugin)
- 插件接口标准化：{ name, setup(ctx), teardown() }
- 支持运行时动态加载插件

2. 体积控制：
- 按需引入：import { ErrorPlugin } from '@sdk/plugin-error'
- Tree Shaking 友好（ESM + sideEffects: false）
- 核心依赖零第三方库
- 打包时多 target（ESM/CJS/UMD）

3. 性能保障：
- 主线程零阻塞：采集逻辑异步/空闲时执行
- 批量上报：队列 + requestIdleCallback + 定时器
- 采样率控制：高频事件抽样
- 内存保护：队列最大长度限制

4. 扩展性：
- 提供 Hook 机制：beforeSend/afterInit/onError
- 数据处理管道：采集 → 转换 → 过滤 → 上报
- 自定义 Transport：可替换上报通道

三、多平台适配：
- 抽象层接口：Timer/Storage/Network/DeviceInfo
- 各平台适配器独立包
- 条件编译或运行时检测

四、质量保证：
- 完善的 TypeScript 类型导出
- 自身异常不影响宿主应用（try-catch 包裹）
- 降级策略：核心功能不依赖可选 API
- 版本管理：Semantic Versioning + Changelog`,
    oralAnswer: `SDK 架构分四层：插件层、核心层、传输层、平台适配层。

核心设计原则有四个。一是插件化：核心包小于 5KB 只包含生命周期和事件总线，功能模块都是插件按需加载，插件接口标准化。二是体积控制：按需引入、Tree Shaking 友好、零第三方依赖、多 target 输出。三是性能保障：主线程零阻塞，采集逻辑异步或空闲时执行，批量上报用队列加 requestIdleCallback，高频事件做采样。四是扩展性：提供 Hook 机制，数据处理管道，可替换的 Transport。

多平台适配通过抽象层接口定义 Timer/Storage/Network 等，各平台适配器独立打包。

质量保证方面：完善的 TypeScript 类型、自身异常不影响宿主应用（try-catch 包裹）、核心功能不依赖可选 API、语义化版本管理。`,
  },
  {
    id: 1204,
    category: '架构设计',
    difficulty: 'hard',
    question: '从 WebView Hybrid 迁移到 React Native 的完整方案如何设计？如何保证平滑过渡？',
    answer: `Hybrid → RN 迁移方案设计：

一、迁移策略选择：
- 大爆炸迁移（不推荐）：一次性全量替换，风险高
- 渐进式迁移（推荐）：按页面/模块逐步替换，可回退

二、技术准备阶段：

1. 容器共存设计：
- 原生导航栈同时支持 WebView 页面和 RN 页面
- 统一路由协议：scheme://host/path → 路由层决定用哪个容器打开
- 配置下发控制：同一路由可动态切换 WebView/RN

2. 通信桥统一：
- 抽象 Bridge 接口层（JSBridge 和 RN NativeModules 统一 API）
- 保证 H5 和 RN 调用同一套 Native 能力

3. 公共能力对齐：
- 登录/鉴权、网络请求、埋点、推送等基础能力
- UI 组件库：RN 版本与 H5 版本视觉一致

三、迁移执行阶段：

1. 优先级排序：
- 高频访问 + 体验要求高的页面优先
- 避免先迁移强依赖 H5 能力的复杂页面

2. 每个页面迁移流程：
- RN 重写 + 功能对齐 + QA 验证
- 灰度切量（1% → 10% → 50% → 100%）
- 监控指标：性能对比 + 异常率对比
- 全量后保留 H5 降级通道

3. 平滑过渡机制：
- 降级兜底：RN 加载失败自动 fallback 到 H5
- 配置热切换：服务端下发路由配置，秒级切流
- 版本兼容：新版本用 RN，旧版本仍走 H5

四、监控和验收：

1. 性能对比：
- TTI：RN vs H5（目标提升 50%+）
- FPS：滚动/动画流畅度
- 内存：确保不劣化

2. 业务指标：
- 转化率/完单率不劣化
- 用户停留时长、跳出率

3. 稳定性：
- JS Error Rate < 0.1%
- 降级触发率 < 1%

五、长期维护：
- 建立 RN 组件库和脚手架
- 文档和最佳实践
- 技术培训让团队掌握 RN`,
    oralAnswer: `迁移方案用渐进式策略，按页面逐步替换，可回退。

技术准备阶段要做三件事：容器共存设计，原生导航栈同时支持 WebView 和 RN 页面，统一路由协议让配置决定用哪个容器打开；通信桥统一，抽象 Bridge 接口层让 H5 和 RN 调用同一套 Native 能力；公共能力对齐，登录鉴权、网络请求、埋点等基础能力和 UI 组件库都要两端一致。

迁移执行阶段：优先迁移高频访问且体验要求高的页面。每个页面流程是 RN 重写、功能对齐、QA 验证，然后灰度切量从 1% 到 100%，全量后保留 H5 降级通道。关键是平滑过渡机制：RN 加载失败自动 fallback H5，服务端配置秒级切流，新版本用 RN 旧版本走 H5。

监控验收看三个维度：性能对比（TTI 目标提升 50%+）、业务指标不劣化（转化率等）、稳定性（JS Error Rate 低于 0.1%、降级触发率低于 1%）。`,
  },
  {
    id: 1205,
    category: '架构设计',
    difficulty: 'hard',
    question: 'React Fiber 调度器（Scheduler）的时间切片原理？如何实现优先级调度？',
    answer: `Fiber Scheduler 核心原理：

一、时间切片（Time Slicing）：

核心思想：将长任务拆分为多个 5ms 的工作单元，每完成一个单元检查是否需要让出主线程。

实现：
1. workLoopConcurrent 循环：
while (workInProgress !== null && !shouldYield()) {
  performUnitOfWork(workInProgress);
}

2. shouldYield() 判断：
- 当前帧剩余时间 < 5ms → 让出
- 基于 MessageChannel 实现（非 requestIdleCallback）
- 每帧预算：16.6ms（60fps）或实际帧间隔

3. 让出后恢复：
- 通过 MessageChannel postMessage 调度下一个宏任务
- 下一帧继续从中断的 Fiber 节点恢复

二、优先级体系（Lane Model，React 18+）：

Lane 用二进制位表示优先级：
- SyncLane（0b0000001）：同步，最高优先级
- InputContinuousLane（0b0000100）：连续输入（拖拽）
- DefaultLane（0b0010000）：普通更新
- TransitionLane（0b0100000）：过渡更新
- IdleLane（0b1000000）：空闲时执行

三、调度流程：

1. setState 触发：
- 创建 Update 对象，标记 Lane
- scheduleUpdateOnFiber → ensureRootIsScheduled

2. 调度决策：
- 对比新任务 Lane 和当前正在执行的 Lane
- 更高优先级 → 中断当前工作，优先处理
- 相同/更低 → 排队等待

3. 并发特性：
- useTransition：将更新标记为 TransitionLane → 可被中断
- useDeferredValue：延迟生成低优先级快照
- Suspense：挂起时切换到 fallback（不阻塞高优更新）

四、对 RN 的影响：
- 新架构 Fabric 支持 React 18 并发特性
- 列表滚动时用户输入仍可响应（高优先级中断渲染）
- 页面转场动画不被数据更新阻塞`,
    oralAnswer: `Fiber 调度器的核心是时间切片和优先级调度。

时间切片的思想是把长任务拆成多个 5ms 的工作单元，每完成一个就检查是否需要让出主线程。实现上用 workLoopConcurrent 循环，通过 shouldYield() 判断当前帧剩余时间是否小于 5ms，是的话就让出。让出后通过 MessageChannel postMessage 调度下一个宏任务，下一帧从中断的 Fiber 节点恢复。

优先级用 Lane 模型，用二进制位表示：SyncLane 最高（同步更新），InputContinuousLane 处理连续输入，DefaultLane 普通更新，TransitionLane 过渡更新可被中断，IdleLane 最低。

调度流程是 setState 触发时创建 Update 标记 Lane，然后调度器对比优先级，高优先级会中断当前低优任务。这就是 useTransition 和 useDeferredValue 的原理。对 RN 来说，新架构 Fabric 支持并发特性，列表滚动时用户输入仍可响应。`,
  },
  {
    id: 1206,
    category: '架构设计',
    difficulty: 'hard',
    question: '如何设计前端应用的错误处理和容灾降级体系？',
    answer: `错误处理和容灾降级体系：

一、错误分类与处理策略：

1. JS 运行时错误：
- 全局捕获：window.onerror / ErrorUtils.setGlobalHandler（RN）
- 组件级：Error Boundary（componentDidCatch）
- Promise：unhandledrejection 事件
- 策略：上报 + 局部降级（显示错误占位组件）

2. 网络错误：
- 超时/断网：自动重试 + 离线缓存兜底
- 接口异常（5xx）：降级数据（缓存/默认值/兜底配置）
- 接口慢（超时）：骨架屏 + 超时断路

3. 资源加载错误：
- 图片失败：占位图兜底
- JS Bundle 失败：重试 → CDN 备份地址 → H5 降级
- 字体/样式失败：系统字体兜底

二、降级策略设计（分级制）：

Level 0（无感降级）：
- 自动重试成功
- 缓存数据展示

Level 1（功能降级）：
- 非核心模块隐藏
- 复杂动画降为简单渐变
- 实时数据降为轮询

Level 2（体验降级）：
- RN 页面降级为 H5
- 动态内容降为静态页
- 个性化降为通用推荐

Level 3（完全降级）：
- 显示系统维护页
- 离线提示 + 缓存内容

三、RN 特有降级方案：

1. Bundle 降级链：
最新版 → 上一稳定版 → 内置版 → H5 → 错误页

2. 实现机制：
- 版本管理器记录可用版本列表
- 异常计数器：同一版本 crash N 次 → 自动降级
- 服务端开关：可远程强制降级某个 Bundle

四、容灾设计：

1. 多 CDN 容灾：主 CDN 不可用 → 自动切备份
2. 接口容灾：主域名 → 备份域名 → HTTPDNS
3. 数据容灾：
- 关键数据本地持久化
- 乐观更新 + 冲突解决
- 离线操作队列（网络恢复后批量同步）`,
    oralAnswer: `错误处理和容灾降级体系分四个部分。

错误分三类处理：JS 运行时错误用全局 ErrorHandler 加 Error Boundary 捕获，局部降级显示错误占位组件；网络错误用自动重试加离线缓存兜底，接口慢用骨架屏加超时断路；资源加载错误用占位图、CDN 备份地址、H5 降级链。

降级策略分四级：Level 0 无感降级（自动重试成功或缓存展示）；Level 1 功能降级（非核心模块隐藏、复杂动画简化）；Level 2 体验降级（RN 降 H5、动态降静态）；Level 3 完全降级（维护页或离线提示）。

RN 特有的 Bundle 降级链是：最新版失败走上一稳定版，再失败走内置版，再不行降 H5，最后显示错误页。异常计数器记录 crash 次数自动降级。

容灾设计包括多 CDN 备份、接口主备域名加 HTTPDNS、数据本地持久化加离线操作队列。`,
  },
  {
    id: 1207,
    category: '架构设计',
    difficulty: 'hard',
    question: '项目亮点如何在面试中讲述？以 RN 首屏优化项目为例，说说你的结构化表达方法。',
    answer: `项目讲述方法论（STAR-T 框架）：

S（Situation）背景：
- 美团某核心业务使用 MRN 开发
- 用户进入核心页面首屏加载耗时 P90 达到 2.1s
- 产品要求优化到 1s 以内，提升用户体验和转化率

T（Task）任务：
- 负责该业务线 RN 首屏性能优化专项
- 目标：P90 TTI < 1s，不降低稳定性

A（Action）行动 - 分阶段描述：

Phase 1 - 定位瓶颈（1 周）：
- 接入性能埋点，拆解首屏链路各阶段耗时
- 发现：容器初始化 300ms + Bundle 加载 500ms + 首屏渲染 800ms + 数据请求 500ms（串行）
- 确定优化方向：并行化 + 预加载 + 瘦身

Phase 2 - 容器优化（2 周）：
- 实现 RN 容器预创建池（App 启动时预创建 2 个）
- 容器初始化从 300ms → 0ms（复用）

Phase 3 - 数据预取（1 周）：
- 将首屏数据请求提前到 Native 路由时发起
- JS 加载完成时数据已就绪，节省 400ms

Phase 4 - 渲染优化（2 周）：
- 首屏组件精简（非首屏延迟渲染）
- 图片预加载 + 缓存策略优化
- 减少 View 层级（6 层 → 3 层）

R（Result）结果 - 量化数据：
- P90 TTI 从 2.1s 降到 0.85s（优化 60%）
- 页面转化率提升 8%
- Bundle 体积减小 35%
- 方案沉淀为团队标准，推广到其他业务线

T（Thinking）思考延伸：
- 过程中踩的坑（如容器池内存问题、数据预取时序竞态）
- 与其他方案的 tradeoff（为什么不用 SSR）
- 后续优化方向（Fabric 升级、预测性预加载）

面试官可能追问方向：
1. 容器池数量如何确定？内存如何控制？
2. 数据预取的异常处理？超时怎么办？
3. 如何防止优化回退？建立了什么机制？
4. 如果重新做，有什么改进的地方？`,
    oralAnswer: `讲项目亮点用 STAR-T 框架。

S 背景：比如美团某核心业务用 MRN 开发，首屏加载 P90 达 2.1 秒，产品要求优化到 1 秒以内。T 任务：我负责首屏性能优化专项，目标 P90 TTI 低于 1 秒。

A 行动分阶段讲：第一周定位瓶颈，接入埋点拆解各阶段耗时，发现容器初始化 300ms、Bundle 加载 500ms、渲染 800ms、数据请求 500ms 串行。然后分阶段优化：容器预创建池把初始化从 300ms 降到 0；数据预取提前到 Native 路由时发起省 400ms；渲染优化精简首屏组件、减少 View 层级。

R 结果要量化：P90 TTI 从 2.1 秒降到 0.85 秒，优化 60%，转化率提升 8%，Bundle 体积减小 35%，方案推广到其他业务线。

T 思考延伸：主动讲踩过的坑（容器池内存问题、数据预取竞态）、tradeoff 决策、后续方向。这样面试官会觉得你有深度思考。`,
  },
];
