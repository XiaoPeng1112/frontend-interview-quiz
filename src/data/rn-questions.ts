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
    oralAnswer: `React Native 的核心思路是用 JavaScript 来写业务逻辑，但最终渲染的是真正的原生组件，而不是 WebView 里的 HTML。

它的工作方式是这样的：应用运行时有三个主要线程——JS 线程负责执行我们的 React 代码和业务逻辑，UI 主线程负责原生界面的渲染，还有一个 Shadow 线程用 Yoga 引擎来做布局计算。这三个线程之间的通信，在旧架构下是通过 Bridge 来做 JSON 序列化的异步通信，新架构则换成了 JSI，可以直接同步调用，性能好很多。

跟其他方案比的话，纯原生开发性能最好但要两端分别开发；WebView 方案像 Cordova，本质上还是跑 H5 页面，性能差而且没法用原生组件；RN 则是一个折中，用 JS 写一套代码能跨平台复用 70% 到 90%，同时渲染出来的是原生控件，性能接近原生，还能做热更新。`,
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
    oralAnswer: `这几个组件其实是按照性能需求来分层的。View 就是最基础的容器，跟 Web 里的 div 类似，它本身不支持滚动。

ScrollView 是可以滚动的容器，但它有个问题——会一次性把所有子组件都渲染出来。所以如果内容不多，比如一个设置页面、一个表单，用 ScrollView 就够了。但如果你有几百上千条数据，用它就会很卡。

这时候就要用 FlatList 了，它只渲染当前可见区域的元素，离开屏幕的会被回收，所以性能好很多。它还内置了下拉刷新、上拉加载更多这些功能。如果数据需要分组显示，比如通讯录那种按字母分组的，就用 SectionList。

简单总结就是：内容少且固定用 ScrollView，长列表一定用 FlatList 或 SectionList。`,
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
    oralAnswer: `RN 的样式系统跟 Web CSS 看起来像，但有几个关键区别。首先是写法上用驼峰命名，比如 backgroundColor 而不是 background-color。

最大的区别是没有样式继承——在 Web 里父元素设了字体颜色，子元素会自动继承，RN 里不会，每个 Text 组件都需要单独设置。另外 Flexbox 的默认方向也不同，RN 默认是 column（纵向排列），Web 是 row。

还有就是尺寸不需要写单位，数字直接就是 dp；没有选择器和级联，样式是直接绑定到组件上的，不存在什么 class 选择器、ID 选择器这些概念。像 float、grid、伪元素这些也都不支持，布局就是纯靠 Flexbox，底层用的 Yoga 引擎。

实际开发中推荐用 StyleSheet.create 来定义样式，它会做一层缓存优化。`,
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
    oralAnswer: `新架构是 RN 在 0.68 版本引入、0.76 之后默认开启的一次大重构，主要解决了旧架构的三个痛点：异步通信瓶颈、启动慢、类型不安全。

核心改动有四块。第一个是 JSI，全称 JavaScript Interface，它替代了旧的 Bridge。以前 JS 和原生之间通信要经过 Bridge 做 JSON 序列化，是异步的而且有开销。JSI 让 JS 可以直接持有 C++ 对象的引用，同步调用原生方法，把序列化的成本完全消除了。

第二个是 Fabric，新的渲染器，替代旧的 UIManager。它支持同步渲染，能配合 React 18 的并发特性，而且在 C++ 层直接操作 Shadow Tree，效率更高。

第三个是 TurboModules，解决的是启动性能问题。旧架构所有原生模块在启动时就全部初始化了，TurboModules 改成按需懒加载，用到才初始化，而且通过 JSI 同步调用。

最后是 CodeGen，根据 TypeScript 的类型定义自动生成原生端的接口代码，保证 JS 和原生之间的类型一致性，减少运行时错误。`,
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
    oralAnswer: `React Navigation 是 RN 生态里最主流的导航方案。它提供了几种 Navigator 类型：Stack 是最常用的页面堆栈，就像浏览器的前进后退；Tab 用于底部或顶部标签切换；Drawer 是侧边抽屉菜单；还有 Native Stack，跟 Stack 功能类似但用的是原生导航栈，性能更好。

核心 API 很直观，navigate 跳转页面、goBack 返回、reset 重置整个导航栈，通过 route.params 来拿页面间传递的参数。

面试里经常考的点包括：嵌套导航时参数怎么传递，比如 Tab 里面嵌套 Stack 的场景；Deep Linking 怎么配置让外部链接直接打开特定页面；还有 TypeScript 下怎么给路由参数做类型定义，一般是定义一个 ParamList 类型传给 Navigator。另外条件导航也是高频考点，比如用户没登录时要拦截跳到登录页，通常在根 Navigator 里根据 auth 状态来切换显示的 Screen。`,
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
    oralAnswer: `FlatList 优化我一般从几个层面来做。首先组件层面，renderItem 的组件一定要用 React.memo 包一下，防止其他项数据变化导致所有 item 都重渲染。如果列表项高度固定，提供 getItemLayout 可以跳过动态测量，性能提升很明显。keyExtractor 给个稳定的唯一 key 也很重要。

然后是 FlatList 自身的配置参数，比如 initialNumToRender 控制首屏渲染数量，maxToRenderPerBatch 控制每批渲染多少个，windowSize 决定离屏缓冲区大小，removeClippedSubviews 在 Android 上可以移除离屏视图减少内存。

有一些常见的坑要避免：renderItem 里不要写内联函数或内联对象，否则每次渲染都会创建新引用导致 memo 失效。Android 上复杂阴影会很卡，图片建议用 FastImage 替代原生 Image 组件。

如果优化到极致还不够，可以考虑 Shopify 的 FlashList，它有视图回收复用机制，类似原生的 RecyclerView，性能能提升 5 到 10 倍。`,
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
    oralAnswer: `RN 里做动画主要有两个方案：内置的 Animated API 和社区的 Reanimated 库。

Animated 是 RN 自带的，默认在 JS 线程计算动画值，性能一般。加上 useNativeDriver: true 可以把动画计算移到原生线程，但这个 native driver 只支持 transform 和 opacity，像 width、height 这种布局属性就不行。所以 Animated 适合做简单的淡入淡出、位移这类动画。

Reanimated 是 v2 之后完全重写的，它的动画全部在 UI 线程运行，通过 worklet 机制——把 JS 函数标记为 worklet 后就能直接在 UI 线程执行。核心概念是 SharedValue 加 useAnimatedStyle，SharedValue 是 JS 线程和 UI 线程共享的值，修改它不需要跨线程通信。

怎么选的话：如果只是简单动画，Animated 加 native driver 就够了；涉及复杂手势交互、拖拽跟手、列表项滑动删除这些，就得上 Reanimated 配合 Gesture Handler；Layout 动画比如列表增删时的过渡效果，Reanimated 的 Layout Animations API 做起来很方便。`,
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
    oralAnswer: `CodePush 热更新的原理其实很好理解。RN 应用本质上是"原生壳加 JS Bundle"，我们的业务代码都打包在 JS Bundle 里。CodePush 做的事情就是让你不需要重新发版上架，直接替换掉这个 JS Bundle 和静态资源文件。

流程是这样的：应用启动时会检查 CodePush 服务器有没有新版本，如果有就下载新的 Bundle，然后在下次启动时加载新包，或者直接重载立即生效。

但它有明确的限制：只能更新 JS 代码和资源文件，不能修改原生代码。比如你新加了一个原生模块，或者改了 Android Manifest 里的配置，那就必须重新发版。苹果的审核政策也规定了热更新不能改变 App 的主要功能。

实际使用中，最佳实践包括：灰度发布，先推送给一小部分用户验证没问题再全量；要有版本回滚机制防止推了有问题的包；还要做版本兼容性检查，确保新 Bundle 跟当前的原生壳版本匹配。国内因为 CodePush 服务器不太稳定，通常会用 Pushy 或者自建热更新服务。`,
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
    oralAnswer: `处理平台差异在 RN 里有几种常用方式。最简单的是用 Platform 模块，Platform.OS 判断当前是 iOS 还是 Android，Platform.select 可以直接传一个对象分别指定两端的值。

如果某个组件两端差异很大，可以用平台特定文件，比如同一个组件写成 Component.ios.tsx 和 Component.android.tsx，RN 打包时会自动根据平台选择对应文件，import 的时候不需要写后缀。

实际开发中常见的差异包括：阴影的实现方式不同，iOS 用 shadowColor、shadowOffset 这些属性，Android 只有 elevation；Android 有物理返回键需要用 BackHandler 来处理；字体也不同，iOS 默认 SF Pro，Android 是 Roboto；权限声明也各自不同。

安全区域的处理推荐用 react-native-safe-area-context 提供的 SafeAreaView，它能正确处理刘海屏、底部横条这些区域。响应式布局的话，可以通过 useWindowDimensions 获取屏幕尺寸，结合 Flexbox 来适配不同设备。`,
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
    oralAnswer: `排查 RN 性能问题我一般先定位瓶颈在哪个线程。RN 里性能问题主要分三类：JS 线程卡顿，通常是逻辑计算太重；UI 线程卡顿，是渲染或布局太复杂；还有旧架构下的 Bridge 通信瓶颈，这个新架构基本解决了。

排查工具方面，Flipper 是最常用的，它有性能面板、网络监控、布局检查器。开发模式下打开 Perf Monitor 可以实时看 JS 和 UI 线程的帧率。why-did-you-render 这个库可以追踪不必要的重渲染。如果需要深入原生层分析，Android 用 Systrace，iOS 用 Instruments。

具体到常见问题和解决方案：列表卡顿就上 FlashList 加 memo 加 getItemLayout；JS 线程满载可以用 InteractionManager.runAfterInteractions 延迟非紧急任务，或者把计算密集的逻辑移到原生模块；动画卡顿就用 Reanimated 让动画在 UI 线程执行；内存泄漏注意清理定时器和事件订阅，还要注意闭包引用；启动慢的话开启 Hermes、做 Bundle 拆包、延迟非核心模块的初始化。`,
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
    oralAnswer: `Hermes 是 Meta 专门为 React Native 优化的 JavaScript 引擎，从 0.70 版本开始默认启用。它相比之前用的 JavaScriptCore，启动速度快了大约两倍，内存占用降低 30% 到 50%，包体积也更小。

它为什么这么快呢？核心是 AOT 编译——在构建阶段就把 JS 代码编译成 .hbc 字节码文件，运行时直接执行字节码，省去了解析和编译的时间。另外它用了分代垃圾回收来减少 GC 暂停，还有惰性编译机制，函数只有在第一次被调用时才会完整编译，进一步加快启动。

有一点要注意的是 Hermes 不支持 JIT 编译，因为 iOS 政策不允许动态生成可执行代码。但通过 AOT 预编译字节码已经弥补了这个问题。早期 Hermes 有些 ES6+ 特性不支持，比如 Proxy 和 WeakRef，现在新版本已经完整支持了。调试的话可以用 Flipper 或者 Chrome DevTools 连接 Hermes 调试器。`,
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
    oralAnswer: `编写原生模块并跟 JS 交互，在旧架构和新架构下流程有些不同。

旧架构下是通过 NativeModules，走 Bridge 异步通信。iOS 端要创建一个继承 NSObject 的类，用 RCT_EXPORT_METHOD 宏来暴露方法给 JS 调用；Android 端则是继承 ReactContextBaseJavaModule，用 @ReactMethod 注解标记需要暴露的方法。JS 端通过 NativeModules.YourModuleName 来调用。

新架构用的是 TurboModules，流程更规范化。先写一个 Spec 文件，就是用 TypeScript 定义好接口，然后 CodeGen 工具会根据这个接口定义自动生成原生端的胶水代码，你只需要实现具体的原生逻辑就好。好处是类型安全，而且支持同步调用，不需要像以前一样所有跨语言调用都是异步的。

还有一种是 Native UI Components，就是把原生的 View 封装成 RN 组件来用，比如你想用一个原生的地图组件或视频播放器。

常见需要写原生模块的场景包括蓝牙、NFC 这类硬件交互，接入第三方 SDK，或者做性能敏感的加密、图像处理。`,
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
    oralAnswer: `拆包和增量更新是大型 RN 项目的必备方案。拆包的核心思路是把 Bundle 分成两部分：基础包包含 React、RN 核心代码和公共组件，这部分内置在 App 里；业务包是各业务线自己的代码，按需从服务器下载。

在 Metro 打包器里实现拆包主要靠两个配置：createModuleIdFactory 自定义模块 ID 的生成规则，保证同一个模块在不同包里 ID 稳定不变；processModuleFilter 用来过滤掉已经在基础包里的模块，这样业务包只包含自己的增量代码。原生侧通过 loadBundleURL 来动态加载业务 Bundle。

增量更新是在热更新基础上进一步优化下载体积。用 bsdiff 算法计算新旧 Bundle 的二进制差量，生成一个 patch 文件，客户端下载 patch 后跟本地旧包合并得到新 Bundle，这样下载量从几 MB 降到几十 KB。

业界比较知名的方案有携程的 CRN、美团的 MRN，都是基础包加业务包加增量更新的模式。Expo 也有自己的 OTA 更新方案叫 Expo Updates。`,
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
    oralAnswer: `状态管理方案的选择我觉得主要看项目规模和团队情况。

最简单的就是 useState 加 Context，适合小项目或者只需要局部共享状态的场景。但 Context 有个问题，只要 Provider 的 value 变了，所有消费者都会重渲染，即使它只用了其中一个字段。

我个人比较推荐 Zustand，API 设计很简洁，用起来像写普通 Hook 一样直观，而且它天然支持精确订阅，只有你用到的那部分状态变了才会触发重渲染。还支持 persist 中间件做本地持久化，devtools 中间件做调试。

如果是大型团队项目，Redux Toolkit 还是比较合适的，它有严格的单向数据流规范，代码可预测性强，团队协作时边界清晰。配合 RTK Query 可以很好地处理服务端状态。

另外对于服务端状态，比如接口数据的缓存、自动重试、后台刷新这些需求，React Query 是最专业的方案。它把客户端状态和服务端状态分开管理，思路很清晰。

我一般的组合推荐是：小项目用 useState + Context 就够了；中型项目 Zustand 加 React Query；大型项目 Redux Toolkit 加 RTK Query。`,
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
    oralAnswer: `RN 项目工程化体系我从项目初始化开始说。首先选择用 CLI 还是 Expo，确定好目录结构规范。然后开发规范这块，TypeScript 开严格模式，配合 ESLint 和 Prettier 保证代码风格一致，Husky 做 git hooks 在提交前自动检查，Conventional Commits 规范提交信息方便自动生成 changelog。

导航用 React Navigation 加 TypeScript 类型化路由定义，这样跳转传参都有类型提示。状态管理中型项目我推荐 Zustand 加 React Query 的组合。网络层封装 Axios，统一处理拦截器、请求重试、Token 自动刷新这些通用逻辑，接口返回值定义好 TypeScript 类型。

CI/CD 方面，GitHub Actions 做自动化流水线，Fastlane 处理 iOS 和 Android 的打包签名发布，结合 CodePush 做热更新。自动化测试用 Jest 做单元测试，Detox 或 Maestro 做 E2E 测试。

监控用 Sentry 收集崩溃和性能数据。多环境管理用 react-native-config，区分 dev、staging、prod 的配置。组件库方面可以搭建 Storybook for RN 来做组件文档和可视化调试。

发布流程要有完善的版本管理、灰度发布策略，热更新也要有回滚机制保证线上稳定。`,
  },
];
