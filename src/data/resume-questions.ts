import { Question } from './types';

export const resumeQuestions: Question[] = [
  // ==================== 基础篇（easy）====================
  {
    id: 2001,
    category: '简历针对',
    difficulty: 'easy',
    question: '请简要介绍 React Native 的工作原理？JS 线程和 Native 线程是如何通信的？',
    answer: `React Native 的核心架构分为三层：

1. JS 层：运行 React 业务代码，产出虚拟 DOM（ReactElement tree）
2. Bridge/JSI 层：负责 JS 与 Native 之间的通信
3. Native 层：执行原生 UI 渲染、系统能力调用

通信机制（旧架构 Bridge）：
- JS 侧调用 Native 模块时，将调用信息序列化为 JSON，放入消息队列
- Native 侧定时（5ms）或事件驱动地批量取走消息并执行
- 返回值也通过同样的方式异步回传

新架构 JSI（JavaScript Interface）：
- JS 对象直接持有 C++ 对象引用，调用时直接走函数调用
- 无需序列化/反序列化，支持同步调用
- 性能大幅提升，单次调用从 ~5ms 降至 <0.1ms

你的项目实践：
在美团 MRN 项目中，基于 JSI 的新架构实现了更高效的模块间通信，
特别是在 BottomBar、SKU 切换等高频交互场景中减少了通信延迟。`,
  },
  {
    id: 2002,
    category: '简历针对',
    difficulty: 'easy',
    question: '什么是热更新（Hot Update）？PushY 和 CodePush 各有什么特点？你在项目中是如何使用的？',
    answer: `热更新是指不通过应用商店发版，直接将 JS Bundle 更新推送到用户设备的技术。

核心原理：
- RN 应用的 JS 代码打包为 Bundle 文件
- 热更新本质是替换本地 Bundle 并重新加载
- Native 代码无法热更，只有 JS/资源文件支持

PushY（国内方案）：
- 国内 CDN 加速，下载速度快
- 支持差量更新（bsdiff），减小包体积
- 支持灰度发布、强制更新、静默更新
- 适合国内应用（无 Google Play 服务依赖）

CodePush（微软方案）：
- App Center 托管，海外节点较好
- 支持回滚机制
- 社区生态成熟，文档完善
- 国内访问速度较慢

项目实践（建盛材）：
使用 PushY 实现热更新，配合版本管理策略：
1. 紧急 Bug 修复 → 强制更新
2. 功能迭代 → 静默更新 + 下次启动生效
3. 通过差量包将更新体积控制在 200KB-1MB
4. 有效提升了版本迭代效率，避免了应用商店审核等待。`,
  },
  {
    id: 2003,
    category: '简历针对',
    difficulty: 'easy',
    question: '什么是 MobX？和 Redux 相比，为什么你的项目选择了 MobX 做状态管理？',
    answer: `MobX 是一个基于响应式编程的状态管理库，核心概念：

1. Observable：可观察的状态
2. Action：修改状态的方法
3. Computed：派生状态，自动缓存
4. Reaction/Observer：状态变化时自动更新 UI

MobX vs Redux 对比：
┌──────────────┬───────────────────┬───────────────────┐
│              │ MobX              │ Redux             │
├──────────────┼───────────────────┼───────────────────┤
│ 编程范式     │ 响应式 OOP        │ 函数式            │
│ 样板代码     │ 少                │ 多（action/reducer）│
│ 学习曲线     │ 低                │ 中高              │
│ 状态修改     │ 直接修改          │ 不可变更新        │
│ 性能优化     │ 自动精确更新      │ 需手动 memo       │
│ 调试         │ 较难追踪          │ DevTools 友好     │
│ 适用场景     │ 快速迭代/中型项目 │ 大型复杂项目      │
└──────────────┴───────────────────┴───────────────────┘

项目选择 MobX 的原因：
1. 美团 MRN 体系默认推荐 MobX（与 SDUI 模块化模式配合好）
2. 模块独立 store 粒度更细，observable 自动追踪依赖
3. 建盛材项目追求快速迭代，MobX 样板代码少，开发效率高
4. 小程序组件注册中 MobX store 绑定更自然（observer 包裹组件即可）`,
  },
  {
    id: 2004,
    category: '简历针对',
    difficulty: 'easy',
    question: '请解释防抖（debounce）和节流（throttle）的区别？你在全局搜索优化中是如何应用的？',
    answer: `防抖（Debounce）：
- 延迟执行，连续触发时不断重置定时器
- 只在最后一次触发后等待 delay 才执行
- 适合：搜索输入、窗口 resize

节流（Throttle）：
- 频率控制，每隔 delay 时间最多执行一次
- 不管触发多频繁，都保证定时执行
- 适合：滚动事件、按钮防重复点击

实现示例：
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

建盛材全局搜索优化实践：
1. 输入防抖：用户停止输入 300ms 后才发请求（减少无效请求 70%+）
2. 请求取消：每次新请求发出前，abort 上一个未完成的请求（AbortController）
3. 搜索逻辑迁移服务端：由 ES 分词处理，前端只负责 UI 展示
4. 效果：平均响应时间从 1.8s 降至 0.4s

代码结构：
const controller = useRef<AbortController>();
const debouncedSearch = useMemo(() => debounce((keyword) => {
  controller.current?.abort();
  controller.current = new AbortController();
  fetchSearch(keyword, { signal: controller.current.signal });
}, 300), []);`,
  },
  {
    id: 2005,
    category: '简历针对',
    difficulty: 'easy',
    question: '什么是 PWA？你在红包营销系统中引入 PWA 的目的和效果是什么？',
    answer: `PWA（Progressive Web App）是利用现代 Web 技术增强 Web 应用体验的方案。

核心技术：
1. Service Worker：拦截网络请求，实现缓存策略和离线访问
2. Web App Manifest：定义应用名称、图标、启动方式等
3. HTTPS：安全要求
4. Cache API：配合 SW 做资源缓存

缓存策略：
- Cache First：优先缓存（适合静态资源）
- Network First：优先网络（适合 API 数据）
- Stale While Revalidate：返回缓存同时更新（适合半动态内容）

红包营销系统引入 PWA 的目的：
1. 离线容错：营销 H5 页面在弱网/断网时仍能展示基础信息
2. 首屏加速：静态资源缓存后，二次访问秒开
3. 留存提升：支持"添加到主屏幕"，提升用户回访率
4. 效果：DAU 留存率有明显提升

注意事项：
- SW 更新策略要谨慎，避免用户看到过期内容
- 动态数据不宜强缓存
- iOS Safari 对 PWA 支持仍有限制（存储上限、后台限制等）`,
  },
  {
    id: 2006,
    category: '简历针对',
    difficulty: 'easy',
    question: '什么是错误边界（Error Boundary）？在 React Native 和 React 中分别怎么使用？',
    answer: `错误边界是 React 16+ 提供的一种错误处理机制，用于捕获子组件树中的 JS 错误，
防止整个应用崩溃，展示降级 UI。

实现方式（Class 组件）：
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // 上报错误到监控平台
    reportError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <FallbackUI error={this.state.error} />;
    }
    return this.props.children;
  }
}

注意事项：
- 只能捕获渲染阶段、生命周期、构造函数中的错误
- 不能捕获：事件处理器、异步代码、SSR、自身错误
- 事件处理器的错误需要 try-catch

在 RN 中的特殊处理：
- RN 还需要处理 Native 异常（使用 setNativeExceptionHandler）
- 全局 JS 异常：ErrorUtils.setGlobalHandler
- 未处理的 Promise：使用 polyfill 或 RN 内置的 rejection tracking

项目实践（红包营销系统）：
1. 每个业务模块包裹 ErrorBoundary，模块报错不影响其他模块
2. 降级 UI 展示"加载失败，点击重试"
3. 错误信息上报到监控平台，便于快速定位
4. 配合 Suspense 做加载态和错误态统一管理`,
  },

  // ==================== 进阶篇（medium）====================
  {
    id: 2007,
    category: '简历针对',
    difficulty: 'medium',
    question: '请详细解释 Server Driven UI（SDUI）的设计思想？moduleKey + layout.data + response[moduleKey] 这套模式是如何运作的？',
    answer: `Server Driven UI 是由服务端控制页面结构和内容的架构模式。

核心理念：
- 传统：前端硬编码页面结构，后端只提供数据
- SDUI：后端同时返回"结构描述 + 数据"，前端按协议渲染

美团 PDP 的 SDUI 模式：

1. moduleKey 模块标识：
   - 每个 UI 模块有唯一 key（如 "headerImage"、"priceBar"、"skuPanel"）
   - 前端按 moduleKey 注册对应的渲染组件

2. layout.data 布局描述：
   - 后端返回一个有序数组，描述页面中模块的排列顺序和配置
   - 示例：[{ moduleKey: "headerImage", ... }, { moduleKey: "priceBar", ... }]

3. response[moduleKey] 模块数据：
   - 每个模块的业务数据存放在 response 中，以 moduleKey 为 key 索引
   - 前端根据 layout 顺序遍历，取 response[moduleKey] 作为 props 渲染

运作流程：
BFF 请求 → 返回 { layout: [...], response: { headerImage: {...}, priceBar: {...} } }
→ 前端遍历 layout → 查找已注册组件 → 传入 response[moduleKey] → 渲染

优势：
1. 动态编排：无需发版即可调整模块顺序/显隐
2. AB 实验：服务端控制不同用户看到不同模块组合
3. 多端复用：同一套协议支持 MRN/H5/小程序/Harmony
4. 模块解耦：每个模块独立开发、独立数据源

挑战：
- 首屏性能：等 BFF 返回才能渲染（MRNBox 解决）
- 模块间通信：需要事件总线或共享 store
- 调试复杂度：页面结构动态生成，需要专门的调试工具`,
  },
  {
    id: 2008,
    category: '简历针对',
    difficulty: 'medium',
    question: '请解释 MRN 多仓架构（模块仓、公共能力仓、页面装配仓）的设计目的和协作方式？',
    answer: `MRN 多仓架构是美团为解决大型 RN 项目的可维护性和团队协作问题设计的架构模式。

三仓职责：

1. 模块仓（Module Repo）：
   - 存放各业务模块的实现代码
   - 每个模块独立仓库，独立开发/测试/发布
   - 如：头图模块、价格模块、SKU 模块各自独立
   - 产出：npm 包（@mrn/module-xxx）

2. 公共能力仓（Common Repo）：
   - 存放跨模块共享的基础能力
   - 包括：UI 组件库、工具函数、网络层、埋点 SDK、Bridge 封装
   - 保证各模块使用统一的基础设施
   - 产出：npm 包（@mrn/common-xxx）

3. 页面装配仓（Detail/Assembly Repo）：
   - 负责页面级别的模块组装和集成
   - 引入各模块仓的 npm 包，按 SDUI 协议组装页面
   - 处理模块间通信、页面级状态、路由配置
   - 产出：最终可部署的 Bundle

协作流程：
模块开发 → 模块仓发版 → 装配仓升级依赖 → 集成测试 → 发布

优势：
1. 团队并行：不同团队各自负责模块仓，互不阻塞
2. 独立发布：模块粒度发版，风险可控
3. 复用性高：同一模块可被多个页面装配仓引用
4. 构建优化：模块仓独立构建，装配仓只做集成

挑战与解决：
- 版本管理复杂 → 统一版本号规范 + lockfile
- 联调困难 → npm link / yalc 本地联调
- 依赖冲突 → peerDependencies + 统一依赖版本表
- 发布流程长 → CI/CD 自动化 + 灰度发布`,
  },
  {
    id: 2009,
    category: '简历针对',
    difficulty: 'medium',
    question: 'MRNBox 首屏静态快照是什么？firstScreenBffCache 的实现原理是什么？它解决了什么问题？',
    answer: `MRNBox 首屏静态快照是美团为解决 RN 页面白屏/Loading 时间长而设计的优化方案。

问题背景：
传统 RN 页面加载流程：
加载 Bundle → 执行 JS → 发起 BFF 请求 → 等待响应 → 渲染
整个链路可能需要 1-3s，期间用户看到白屏或 Loading

MRNBox 快照方案：
1. 在用户上次成功加载后，将首屏模块的 BFF 数据缓存到本地
2. 下次打开页面时，直接用缓存数据渲染静态首屏（无需等网络请求）
3. 同时发起真实 BFF 请求，数据返回后替换为最新数据

firstScreenBffCache 原理：
// 页面打开时
const cachedData = await MRNBox.getCache(pageKey);
if (cachedData) {
  // 立即渲染缓存的首屏（头图、价格、SKU、BottomBar）
  renderWithData(cachedData);
}
// 同时发起真实请求
const freshData = await fetchBFF();
renderWithData(freshData);  // 数据对比后增量更新
// 更新缓存
MRNBox.setCache(pageKey, freshData);

关键模块（你负责的）：
- 头图模块：缓存图片 URL + 尺寸信息
- 价格条：缓存价格文案
- SKU 面板：缓存默认 SKU 信息
- BottomBar：缓存按钮状态

优化效果：
- iOS/Android 中高端设备首屏渲染时间下降 35%-65%
- 白屏时间从 1-3s 降至 <500ms
- Loading 感知显著改善

注意事项：
- 缓存数据可能过期（价格变动/库存变化），需要快速更新
- 缓存 key 设计要考虑商品 ID + 用户维度
- 非首屏模块不参与快照，避免缓存膨胀`,
  },
  {
    id: 2010,
    category: '简历针对',
    difficulty: 'medium',
    question: '在多端适配（MRN/H5/小程序/Harmony）中，你遇到过哪些典型的渲染差异？是如何处理的？',
    answer: `多端渲染差异是 SDUI 多端架构中最常遇到的问题，以下是我处理过的典型案例：

1. 图片裁剪与比例差异：
   - MRN：resizeMode="cover" 表现正常
   - 小程序 Skyline：aspectFill 行为不同，widthFix 计算方式不同
   - 解决：封装统一 Image 组件，各端适配 resizeMode 映射

2. 绝对定位浮层问题：
   - MRN：absolute 定位相对最近的非 static 祖先
   - Skyline：absolute 元素可能被裁切，层级计算不同
   - 解决：使用 fixed 定位 + 手动计算位置，或改用 portal 方案

3. 视频/图集多 Tab 场景：
   - MRN：Swiper 组件自带手势处理
   - Skyline：自定义 Swiper 手势冲突，需要处理 catch/bind 事件
   - 解决：TabCapsule 独立处理手势区域，避免事件冒泡

4. 高斯模糊处理：
   - iOS：blurView 原生支持，性能好
   - Android：GPU 渲染，低端机卡顿
   - Skyline：不支持 backdrop-filter
   - 解决：Android 降级为半透明遮罩，Skyline 使用预处理模糊图

5. 状态栏差异：
   - iOS：安全区域通过 SafeAreaView
   - Android：状态栏高度需要 StatusBar.currentHeight
   - 解决：封装 useStatusBarHeight 统一获取

6. 倒影效果：
   - MRN：通过 transform + opacity 渐变实现
   - Skyline：不支持 linear-gradient mask
   - 解决：使用预渲染的倒影图片替代

处理原则：
- 封装跨端适配层，业务代码不直接处理平台差异
- 降级策略：复杂效果在低端平台做简化处理
- 视觉一致性检查：MRN 首屏为基准，其他端对齐`,
  },
  {
    id: 2011,
    category: '简历针对',
    difficulty: 'medium',
    question: '你如何定位和解决 React Native 中的 JS Error？请结合空对象/字段缺失等实际场景说明。',
    answer: `RN 中 JS Error 定位和解决的完整流程：

1. 错误监控与上报：
   - 全局 ErrorHandler 捕获未处理异常
   - Sentry/Logan 上报错误堆栈 + 设备信息 + 用户行为路径
   - 按错误类型/频次/影响面分级（P0-P3）

2. 空对象 JS Error 典型场景：

场景一：BFF 字段缺失
// 报错：Cannot read property 'title' of undefined
const title = response.headerModule.data.title;

// 修复：可选链 + 降级
const title = response?.headerModule?.data?.title ?? '默认标题';

场景二：模块间数据依赖
// SKU 切换后，价格模块还在用旧数据
// 异步残留数据导致 render 时空指针

// 修复：
// 1. SKU 切换时先清空依赖模块的数据
// 2. 使用 loading 态过渡
// 3. 数据到达后统一更新

场景三：列表数据为 null
// 报错：Cannot read property 'map' of null
const list = moduleData.items.map(...)

// 修复：
const list = (moduleData?.items || []).map(...)

3. 系统性治理方案：

数据层防御：
- BFF 数据校验层：定义 Schema，字段缺失时填充默认值
- TypeScript 严格模式 + 可选属性标注
- 运行时类型守卫：isValidModule(data) 判断后再渲染

渲染层防御：
- 模块级 ErrorBoundary：单模块报错不影响整体页面
- 降级渲染：数据不完整时展示简化版 UI 或隐藏模块
- 异步状态管理：loading/error/success 三态处理

4. 预防措施：
- CR 时检查所有 data access 是否有防御
- 埋点监控异常字段出现频率
- 联调时模拟字段缺失场景
- TypeScript strict + ESLint 规则强制可选链`,
  },
  {
    id: 2012,
    category: '简历针对',
    difficulty: 'medium',
    question: '请解释 BFF（Backend For Frontend）在你的项目中的作用？前端如何与 BFF 层协作？',
    answer: `BFF（Backend For Frontend）是专门为前端设计的中间服务层。

在美团 PDP 项目中的 BFF 架构：

┌─────────┐     ┌──────────┐     ┌──────────────────┐
│  前端    │ ──→ │   BFF    │ ──→ │ 后端微服务集群    │
│ MRN/H5  │ ←── │  (Node)  │ ←── │ 商品/价格/库存... │
└─────────┘     └──────────┘     └──────────────────┘

BFF 的核心职责：
1. 数据聚合：一次请求聚合多个后端接口数据
2. 数据裁剪：只返回前端需要的字段，减少传输量
3. 格式适配：将后端数据转换为 SDUI 协议格式
4. layout 编排：根据 AB 实验/用户画像动态组装模块列表
5. 缓存策略：热点数据缓存，降低后端压力

协作模式：
1. 协议定义：前后端共同定义 moduleKey + 数据结构
2. Mock 联调：BFF 未就绪时，前端用 Mock 数据开发
3. 灰度验证：BFF 支持按比例/条件下发不同数据
4. 问题排查：前端通过 requestId 追踪 BFF 到后端全链路

firstScreenBffCache 与 BFF 的关系：
- 首次请求 BFF → 正常渲染 + 缓存数据
- 二次打开 → 用缓存立即渲染 + 后台请求 BFF 更新
- BFF 返回数据对比缓存 → 有变化则增量更新 UI

前端关注点：
- 数据契约：和 BFF 约定字段不能随意删除
- 兼容降级：新字段做向前兼容，旧版本不崩溃
- 性能监控：监测 BFF 接口 RT，异常告警
- 错误处理：BFF 超时/报错时展示降级内容`,
  },
  {
    id: 2013,
    category: '简历针对',
    difficulty: 'medium',
    question: '你是如何将 MRN 组件迁移到微信小程序 Skyline 渲染模式的？整体思路和挑战是什么？',
    answer: `MRN → 微信小程序 Skyline 迁移的核心流程：

整体链路：
moduleKey → template → component → store 渲染链路

1. 模块映射：
   - MRN 的每个 moduleKey 对应一个小程序 template
   - template 内使用自定义 component 实现具体 UI
   - component 绑定 MobX store 获取数据

2. 迁移步骤（40+ 组件）：
   Step 1：分析 MRN 模块的 props 接口和渲染逻辑
   Step 2：创建对应的 WXML template + WXSS 样式
   Step 3：编写 Component（JS 逻辑 + 生命周期适配）
   Step 4：绑定 MobX store（observer 模式）
   Step 5：处理 Skyline 渲染差异
   Step 6：对齐埋点和首屏一致性

3. Skyline 特殊处理：
   - Skyline 是微信的新渲染引擎，类似 Flutter 的自绘方案
   - 不走 WebView，性能更好但 CSS 支持有限
   - 不支持：部分 CSS 选择器、backdrop-filter、复杂动画
   - 布局差异：Flexbox 行为与 Web 略有不同

4. 主要挑战：
   a) 样式转换：RN StyleSheet → WXSS（单位/布局模型差异）
   b) 手势处理：RN Gesture Handler → 小程序 touch 事件体系
   c) 动画差异：Animated API → wx.createAnimation / worklet
   d) 组件生命周期：React hooks → Component lifetimes
   e) 状态管理：直接引入 mobx-miniprogram 适配

5. AI 辅助迁移：
   - 使用 mrn-to-miniprogram Skill 自动生成基础代码框架
   - AI 处理样式单位转换、API 映射
   - 人工处理复杂交互逻辑和平台差异
   - 建立迁移 checklist 确保一致性`,
  },
  {
    id: 2014,
    category: '简历针对',
    difficulty: 'medium',
    question: '你在建盛材项目中实现 ES 分词搜索优化，前后端分别做了什么？为什么响应时间能从 1.8s 降到 0.4s？',
    answer: `全局搜索优化的前后端分工：

优化前的问题：
- 搜索逻辑在前端：拉取全部数据 → 本地 filter
- 数据量大时：接口 返回慢、数据传输量大
- 无防抖：快速输入触发大量请求

后端优化：
1. 引入 Elasticsearch 分词引擎
2. 支持中文分词（ik_max_word）
3. 建立商品/客户/供应商多维索引
4. 服务端分页 + 高亮命中

前端优化：
1. 输入防抖（300ms debounce）
2. 请求取消（AbortController）
3. 请求竞态处理：只展示最新请求结果
4. 搜索结果缓存（LRU Cache）

时间分析：
- 原 1.8s = 全量拉取 1.2s + 前端 filter 0.6s
- 优化后 0.4s = ES 检索 0.2s + 网络传输 0.15s + 渲染 0.05s

代码示例：
const controller = useRef<AbortController>();

const handleSearch = useDebounceFn(async (keyword) => {
  controller.current?.abort();
  controller.current = new AbortController();
  const res = await searchApi(keyword, { signal: controller.current.signal });
  setResults(res.data);
}, { wait: 300 });`,
  },
  {
    id: 2015,
    category: '简历针对',
    difficulty: 'medium',
    question: 'PushY 热更新的原理是什么？和 CodePush 有什么区别？在你的项目中是如何使用的？',
    answer: `PushY 热更新原理：

核心机制：
1. 打包时生成完整 Bundle + 资源的版本快照
2. 发布热更新时，服务端对比新旧版本生成 diff patch
3. App 启动时检查更新 → 下载 patch → 本地合并 → 重启生效

与 CodePush 对比：
| 维度 | PushY | CodePush |
|------|-------|----------|
| 服务商 | 国内 | 微软（已停维护）|
| 网络 | 国内 CDN 快 | 国外服务器慢 |
| 差量更新 | 支持（bsdiff）| 支持 |
| 多版本管理 | 支持 | 支持 |
| 静默更新 | 支持 | 支持 |
| 回滚 | 自动回滚 | 自动回滚 |

在建盛材项目中的使用：
1. CI/CD 集成：构建完自动上传 Bundle 到 PushY
2. 灰度发布：按用户百分比逐步推送
3. 强制更新 + 静默更新两种策略
4. 启动检查 + 前台恢复时检查
5. 更新失败自动回滚到上一版本

注意事项：
- 只能更新 JS Bundle 和资源文件
- 原生代码变更必须走 App Store 审核
- 需要处理好更新时的 loading 状态`,
  },
  {
    id: 2016,
    category: '简历针对',
    difficulty: 'hard',
    question: '你在美团的 AI Coding 工程化实践中，AGENTS / .aicx / rules / knowledge / OpenSpec 各层的职责是什么？这套体系如何提升多仓项目的开发效率？',
    answer: `AI Coding 分层上下文体系：

各层职责：
1. AGENTS（角色定义层）
   - 定义 AI 的角色和能力边界
   - 如：MRN 模块开发 Agent、小程序迁移 Agent
   - 指定 Agent 可访问的知识和规则

2. .aicx（上下文配置层）
   - 项目级 AI 配置文件
   - 指定当前仓库的技术栈、目录结构、关键路径
   - 类似 .eslintrc 但面向 AI

3. rules（规则约束层）
   - 编码规范和约束条件
   - 如：MRN 不使用 div 用 View、样式单位用 dp
   - 平台差异规则：iOS/Android 特殊处理

4. knowledge（知识库层）
   - 业务文档、API 文档、设计稿说明
   - 模块间依赖关系图
   - 历史问题和解决方案

5. OpenSpec（接口规范层）
   - BFF 接口的请求/响应结构
   - moduleKey 与模块的映射关系
   - 数据字段含义和取值范围

提升效率的方式：
1. 需求理解：AI 结合 knowledge 快速定位影响范围
2. 代码生成：基于 rules + OpenSpec 生成符合规范的代码
3. 影响面分析：跨仓依赖自动追踪
4. Review：对照 rules 自动检查违规
5. 回归检查：变更后自动验证关联模块

实际效果：
- 模块开发从 2-3 天缩短到 0.5-1 天
- MRN → 小程序迁移效率提升 60%+
- 线上问题修复平均时间缩短 40%`,
  },
  {
    id: 2017,
    category: '简历针对',
    difficulty: 'hard',
    question: '美团团购详情页的多仓架构（模块仓、公共能力仓、页面装配仓）是如何协作的？这种架构解决了什么问题？',
    answer: `多仓架构设计：

三仓职责：
1. 模块仓（module repo）
   - 存放各业务模块的独立实现
   - 如：头图模块、价格模块、SKU模块
   - 每个模块独立开发、测试、发布
   - 通过 moduleKey 注册到系统

2. 公共能力仓（common repo）
   - 跨模块共享的基础能力
   - 如：网络层、埋点 SDK、UI 基础组件
   - 工具函数、类型定义、常量
   - 版本管理严格，变更需要评估影响面

3. 页面装配仓（detail/page repo）
   - 页面容器和模块编排逻辑
   - 根据 BFF 返回的 moduleList 动态装配模块
   - 处理模块间通信和事件分发
   - 管理页面生命周期

协作流程：
1. BFF 返回 moduleList: ['header', 'price', 'sku', ...]
2. 装配仓根据 moduleKey 从模块注册表找到对应组件
3. 将 response[moduleKey] 作为 props 传入模块
4. 模块内部通过 common 仓的能力处理逻辑

解决的问题：
1. 团队协作：不同模块可以并行开发，互不阻塞
2. 发布解耦：单个模块升级不影响其他模块
3. 复用性：同一模块可用于详情页、快照页、小程序
4. 动态化：服务端控制页面结构，无需发版
5. 质量保障：模块独立测试，问题可快速定位

挑战和应对：
- 版本依赖管理：使用 semver + lockfile
- 联调复杂度：本地 link + 模拟 BFF 数据
- 构建速度：模块级缓存 + 按需构建`,
  },
  {
    id: 2018,
    category: '简历针对',
    difficulty: 'hard',
    question: 'MRNBox 首屏静态快照的完整技术方案是什么？从用户点击到首屏渲染完成的全链路优化有哪些？',
    answer: `MRNBox 首屏静态快照方案：

核心思路：
在 RN Bundle 加载完成前，先用轻量级方案渲染一个「接近真实」的首屏，减少白屏感知时间。

技术实现：
1. 快照生成
   - 首次加载成功后，将首屏关键模块的渲染结果缓存
   - 使用 firstScreenBffCache 存储 BFF 首屏数据
   - 缓存内容：头图 URL、价格文案、SKU 摘要、BottomBar 结构

2. 快照渲染
   - 用户点击进入 → Native 容器先加载快照层
   - 快照用原生视图渲染（非 RN），极快
   - 展示缓存的头图、价格、按钮等关键信息

3. 无缝切换
   - RN Bundle 加载完成 → 真实首屏渲染
   - 对比快照与真实内容，做 crossfade 过渡
   - 避免「闪烁」和「跳变」

全链路优化：

Bundle 阶段：
- Bundle 预加载：在列表页预加载详情页 Bundle
- Bundle 拆分：首屏模块优先加载

数据阶段：
- 预请求：列表页点击时即触发 BFF 请求
- 数据缓存：相同商品复用上次数据

渲染阶段：
- 模块优先级：头图 > 价格 > SKU > 其他
- 图片优先级：首屏图片最高优先级加载
- 桥优化：减少 JS-Native 通信次数

优化效果：
- iOS/Android 中高端设备首屏渲染时间下降 35%-65%
- 白屏时间从 ~800ms 降至 ~200ms
- 用户感知上几乎「秒开」`,
  },
  {
    id: 2019,
    category: '简历针对',
    difficulty: 'hard',
    question: '在多端适配（MRN/Max/Harmony/H5/小程序）中，如何设计一套统一的模块化方案来支持所有端？遇到的最大挑战是什么？',
    answer: `多端统一模块化方案设计：

核心架构：moduleKey + layout.data + response[moduleKey]

统一层（跨端共享）：
1. 数据层统一
   - BFF 返回统一的数据结构
   - 各端消费相同的 response[moduleKey] 数据
   - 字段语义一致，减少各端理解差异

2. 模块注册统一
   - moduleKey 作为模块唯一标识
   - 各端维护自己的 moduleKey → Component 映射表
   - 新增模块只需在各端注册对应实现

3. 模块通信统一
   - 基于事件总线的模块间通信
   - 统一事件名和数据格式

差异层（各端特有）：
1. 渲染引擎差异
   - MRN：React Native 原生渲染
   - H5：DOM 渲染
   - 小程序：Skyline / WebView 渲染
   - Harmony：ArkUI 渲染

2. 样式差异处理
   - MRN：dp 单位、Flexbox
   - H5：rem/vw 适配
   - 小程序：rpx 单位
   - 编写转换层统一处理

3. 平台 API 差异
   - 封装 Platform Bridge 抽象层
   - 各端实现具体的 Native 调用

最大挑战：Skyline 渲染差异
- 视频 + 图集多 Tab 场景的交互不一致
- absolute 浮层在 Skyline 中的层级问题
- aspectFill/widthFix 行为不同
- 解决方式：建立「渲染差异表」，逐一适配并沉淀规则`,
  },
  {
    id: 2020,
    category: '简历针对',
    difficulty: 'hard',
    question: '你在简历中提到首屏渲染时间下降 35%-65%，这个数据是怎么测量的？优化前后的具体技术手段分别是什么？',
    answer: `首屏性能测量方案：

测量方法：
1. 打点方案
   - 起点：用户点击列表项（Native 时间戳）
   - 终点：首屏模块全部渲染完成（onLayout 回调）
   - 上报：T(终点) - T(起点) = 首屏时间

2. 分段计时
   - T1：点击 → Native 容器创建
   - T2：容器创建 → Bundle 加载完成
   - T3：Bundle 完成 → BFF 数据返回
   - T4：数据返回 → 首屏渲染完成

3. 数据来源
   - 线上埋点数据（P50/P90/P99）
   - 分设备等级统计（高/中/低端）
   - AB 实验对照组

优化前（基线）：
- iOS P50：~600ms，P90：~1200ms
- Android P50：~900ms，P90：~1800ms
- 主要耗时：Bundle 加载 + BFF 请求串行 + 全量渲染

优化手段：
1. Bundle 预加载（-150ms）
   - 在列表页闲时预加载详情 Bundle

2. 数据预请求（-200ms）
   - 点击时并行触发 BFF 请求
   - 不等 Bundle 加载完

3. MRNBox 静态快照（-300ms 感知）
   - 用户「看到」内容的时间大幅提前

4. 模块分优先级渲染（-100ms）
   - 首屏模块先渲染，非首屏模块延迟

5. 图片优化（-50ms）
   - CDN 预连接 + 首屏图优先级
   - 渐进式加载 + 适当尺寸

优化后：
- iOS P50：~200ms，P90：~450ms（下降 ~65%）
- Android P50：~350ms，P90：~800ms（下降 ~55%）
- 中高端设备效果最明显（35%-65%区间）`,
  },
];