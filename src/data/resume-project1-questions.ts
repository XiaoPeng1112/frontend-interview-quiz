import { Question } from './types';

export const resumeProject1Questions: Question[] = [
  // ==================== 项目背景与整体架构 ====================
  {
    id: 6001,
    category: '美团项目',
    difficulty: 'easy',
    question: '请介绍一下你在美团团购详情页这个项目中的角色和核心贡献？',
    answer: `回答框架（STAR法）：

Situation：美团团购详情页是平台最重要的流量入口和交易转化页之一，承载亿级用户访问。原有架构面临性能瓶颈、多端一致性差、可维护性低等问题。

Task：负责零售商品详情页（PDP）统一化建设，覆盖 MRN 商品详情页、MRNBox 首屏快照、Snapshot 交易快照及微信小程序 Skyline 页面。

Action：
1. 深度开发和维护 20+ MRN 业务模块
2. 完成 40+ 小程序组件的 Skyline 原生落地
3. 参与 MRNBox 首屏快照能力建设
4. 多端渲染差异治理和稳定性保障
5. AI Coding 工程化体系建设

Result：
- iOS/Android 中高端设备首屏渲染时间平均下降 35%-65%
- 小程序 Skyline 原生落地，视觉与 MRN 首屏一致性 > 95%
- 交易链路稳定性显著提升，JS Error 率下降

面试技巧：先讲整体再看面试官追问哪个方向深入。`,
    oralAnswer: `好的，我来介绍一下这个项目。我在美团负责的是团购商品详情页，就是用户从列表点进去看商品具体信息、然后下单购买的那个页面。这个页面对业务来说非常核心，因为它直接关系到交易转化率。

我在这个项目里的定位是前端核心开发，主要做了这么几件事：

第一个是模块开发。我们详情页是用 SDUI 架构做的，整个页面拆成了 20 多个独立模块，像头图、价格、SKU 选择、底部购买栏这些，我都深度参与了开发和维护。

第二个是小程序迁移。我们需要把 MRN 的页面落地到微信小程序的 Skyline 渲染引擎上，我负责了 40 多个组件的原生迁移，确保两端首屏视觉一致性达到 95% 以上。

第三个是性能优化。我参与了 MRNBox 首屏快照的建设，通过 Bundle 预加载、点击预请求、模块优先级渲染这些手段，把首屏时间在中高端设备上降低了 35% 到 65%。

第四个是稳定性治理。因为多端多场景嘛，容易出现数据残留、字段缺失这些问题，我建立了一套系统化的治理方案，让 JS Error 率明显下降。

最后还有一块是 AI Coding 工程化，就是把 AI 辅助开发这件事从个人使用变成团队可用的体系化方案。

大概就是这样，面试官您对哪个方向比较感兴趣，我可以深入聊一聊。`,
  },
  {
    id: 6002,
    category: '美团项目',
    difficulty: 'easy',
    question: '你说的多仓架构具体是怎么组织的？模块仓、公共能力仓、页面装配仓之间怎么协作？',
    answer: `三仓协作关系：

模块仓（Module Repo）：
- 每个业务模块一个独立仓库或同仓不同包
- header / price / sku / bottomBar / time / store 等
- 独立开发 -> 独立测试 -> 发布 npm 包
- 版本号遵循 semver

公共能力仓（Common Repo）：
- 网络请求封装（fetch + 缓存 + 重试）
- 埋点 SDK、工具函数、基础 UI 组件
- TypeScript 类型定义（SharedStore 接口）

页面装配仓（Detail/Assembly Repo）：
- 引入所有模块仓的 npm 包
- 模块注册表（moduleKey -> Component 映射）
- SharedStore 实例化
- 页面级路由和容器配置
- 最终打包输出 Bundle

协作流程：
1. 模块仓开发完成 -> npm publish @mrn/module-xxx@1.2.0
2. 装配仓 package.json 升级版本号
3. 装配仓 CI 跑集成测试
4. 通过后打包 Bundle -> 推送热更新

日常开发用 yalc/npm link 联调，提测阶段发 beta 版本。`,
    oralAnswer: `我们的多仓架构其实是为了解决一个核心问题：20 多个模块如果都在一个仓库里，开发冲突会非常严重，而且一个人改了某个模块可能影响到其他模块。

所以我们拆成了三层仓库：

第一层是模块仓。每个业务模块，比如 header、price、sku、bottomBar 这些，都是独立的仓库。它们各自独立开发、独立测试，开发完之后会发一个 npm 包出来，版本号按 semver 管理。

第二层是公共能力仓。这里放的是所有模块都要用的东西，比如网络请求的封装、埋点 SDK、基础 UI 组件，还有很关键的 TypeScript 类型定义，特别是 SharedStore 的接口类型。这一层相当于大家共用的"地基"。

第三层是页面装配仓。这个仓库做的事情就是把所有模块 npm 包引进来，配置模块注册表——就是 moduleKey 到组件的映射关系，然后实例化 SharedStore，最终打包输出 Bundle。

日常协作流程大概是这样的：我在模块仓改完代码，发一个新版本的 npm 包，比如 @mrn/module-price@1.2.0。然后在装配仓的 package.json 里升级这个版本号，CI 跑一遍集成测试，通过之后打包新 Bundle，最后通过热更新推给用户。本地联调的时候我们用 yalc 或者 npm link，这样改了模块仓的代码能实时看到效果，不用每次都发包。`,
  },
  {
    id: 6003,
    category: '美团项目',
    difficulty: 'medium',
    question: '团购详情页的 Server Driven UI 具体是怎么工作的？一个页面请求的完整链路是什么？',
    answer: `SDUI 完整链路：

1. 用户点击商品卡片进入详情页

2. Native 容器层：分配预创建的 MRN 容器，传入参数（spuId、cityId、来源等）

3. JS 层发起 BFF 请求：fetch('/api/detail', { params })

4. BFF 返回结构化数据：
{
  "layout": [
    { "moduleKey": "header", "priority": 0 },
    { "moduleKey": "price", "priority": 0 },
    { "moduleKey": "sku", "priority": 0 },
    { "moduleKey": "bottomBar", "priority": 0 },
    { "moduleKey": "time", "priority": 1 },
    { "moduleKey": "review", "priority": 2 }
  ],
  "response": {
    "header": { "images": [...], "title": "..." },
    "price": { "salePrice": 69, "originalPrice": 99 },
    ...
  }
}

5. 前端渲染引擎：
   a) 解析 layout，按 priority 分组
   b) P0 模块立即渲染（首屏）
   c) P1 模块延迟渲染
   d) P2 模块懒加载

6. 模块注册表匹配：const Component = moduleRegistry[moduleKey]

7. 各模块接收 response[moduleKey] 作为 props 渲染

8. 模块间通过 SharedStore（MobX）通信

关键设计：模块顺序、显隐由服务端决定（AB 实验可调），前端只负责渲染不做展示逻辑判断。`,
    oralAnswer: `我来完整地讲一下 SDUI 的工作流程。

首先用户在列表页点了一个商品卡片，这个时候 Native 层会分配一个预创建好的 MRN 容器给详情页用，同时把商品 ID、城市 ID 这些参数传进来。

然后 JS 层拿到参数之后，会向我们的 BFF 发一个请求。BFF 返回来的数据结构是很有意思的，它不是扁平的一坨数据，而是分成两个部分：一个是 layout 数组，一个是 response 对象。

layout 数组定义了这个页面应该展示哪些模块、以什么顺序展示。每个元素有一个 moduleKey，比如 header、price、sku 这些，还有一个 priority 字段表示渲染优先级。priority 为 0 的是首屏必须立刻渲染的，1 是可以稍微延迟的，2 是用户滚到了再加载的。

response 对象呢，就是以 moduleKey 为 key、对应模块数据为 value 的一个字典。比如 response.header 就是头图模块需要的图片列表和标题，response.price 就是价格信息。

前端拿到这个数据之后，渲染引擎会先按 priority 分组，P0 的模块立刻渲染——也就是首屏只需要渲染 4-5 个关键模块，而不是全部 20 多个。然后通过模块注册表把 moduleKey 映射到具体的 React 组件，每个组件接收 response 里对应的数据作为 props。

这个设计最大的好处是：前端完全不做"展示什么"的判断。模块顺序、是否展示、展示哪个版本，全部由服务端控制。这意味着产品做 AB 实验、调整模块排列，根本不需要前端发版，后端改一下 layout 配置就行了。`,
  },

  // ==================== 模块开发深入 ====================
  {
    id: 6004,
    category: '美团项目',
    difficulty: 'medium',
    question: '你维护的 20+ 模块中，SKU 模块的复杂度体现在哪里？有什么技术难点？',
    answer: `SKU 模块复杂度分析：

业务复杂度：
1. SKU 组合逻辑：多维属性（规格x数量x有效期）的笛卡尔积
2. 库存联动：选择某属性后需灰掉无库存的其他选项
3. 价格联动：不同 SKU 价格不同，选中后实时更新价格模块
4. 次卡逻辑：有额外使用次数/有效期展示
5. 多 SPU 切换：需清理/重置状态

技术难点：

1. 状态管理复杂：SKU 选中状态影响价格/库存/按钮/可约时间，需要 SharedStore 广播，防止状态残留

2. 性能优化：SKU 列表可能上百个组合，每次选择触发多模块更新，需精细控制 re-render 范围

3. 跨端一致性：MRN 中是 BottomSheet，小程序中用原生 popup，动画手势差异大

4. 数据残留问题解决：
reaction(() => sharedStore.currentSpuId, () => {
    skuStore.reset();
    skuStore.init(newSpuData);
});

5. 曝光埋点：面板打开上报、SKU 滑动浏览上报、时机控制防重复曝光`,
    oralAnswer: `SKU 模块可以说是我们详情页里最复杂的一个模块了，我从业务和技术两个角度说一下。

业务层面的复杂度在于，团购商品的 SKU 组合逻辑很多样。比如一个餐饮套餐可能有"2-3人餐/4-6人餐"和"周一到周五/周末"两个维度，它们形成的是笛卡尔积的组合关系。用户选了一个维度之后，其他维度里库存为 0 的选项需要自动置灰，同时价格模块也要实时更新。再加上次卡类型的 SKU 还有使用次数和有效期展示，逻辑就更复杂了。

技术层面主要有这几个难点：

第一是状态管理特别复杂。用户选了一个 SKU 之后，这个信息要广播给价格模块、底部按钮、可约时间模块等好几个地方。我们通过 SharedStore 来做跨模块通信，但要特别小心状态残留的问题——比如用户从商品 A 切到商品 B，如果没有正确清理 SKU 状态，就会出现数据错乱。我们的做法是监听 currentSpuId 的变化，一旦切换就立刻 reset 再 init。

第二是性能。有些商品 SKU 组合能有上百个，每次用户选择都会触发多个模块更新，所以必须精细控制 re-render 的范围，避免不必要的重渲染。

第三是跨端一致性。在 MRN 里 SKU 面板是从底部弹出的 BottomSheet，但在小程序里要用原生的 popup 组件，两边的动画和手势体验差异很大，需要单独做适配。`,
  },
  {
    id: 6005,
    category: '美团项目',
    difficulty: 'medium',
    question: 'BottomBar 模块（包含 AI 问小团）的技术实现是怎样的？作为固定底栏有什么特殊处理？',
    answer: `BottomBar 模块技术实现：

布局特点：固定页面底部，不随滚动，处理 iOS 安全区域和 Android 导航栏高度。

核心功能：购买按钮（主CTA）、加入购物车、AI 问小团入口、收藏/分享

技术难点：

1. 安全区域适配：
const bottomInset = useSafeAreaInsets().bottom;
// iOS 底部安全区 + Android 全面屏/非全面屏差异

2. 与 SKU 模块联动：
- 未选 SKU：按钮显示"选择规格"
- 已选 SKU：按钮显示"立即购买 xx元"
- 库存为 0：按钮置灰"已售罄"
- 通过 SharedStore 的 selectedSkuId 和 skuStock 驱动

3. AI 问小团：点击打开聊天面板，传递商品上下文（spuId、title、price）

4. 首屏快照中的 BottomBar：MRNBox 缓存中包含 BottomBar 数据，首屏立即渲染，真实数据到达后更新

5. 跨端差异：MRN 用 RN 原生组件；小程序用 fixed 定位自定义组件，各端底部安全区高度不同`,
    oralAnswer: `BottomBar 就是详情页底部那个固定的操作栏，包含"立即购买"按钮、加入购物车、还有 AI 问小团的入口。虽然看起来简单，但因为它是固定定位、跨端、又跟多个模块联动的，所以技术细节挺多的。

首先是布局。它固定在页面最底部，不随内容滚动，这就需要处理安全区域的问题。iOS 有 Home Indicator 那一块区域，Android 有虚拟导航栏，全面屏和非全面屏还不一样。我们通过 useSafeAreaInsets 拿到底部安全距离，给 BottomBar 加对应的 paddingBottom。

然后是和 SKU 模块的联动，这是最核心的交互逻辑。用户还没选 SKU 的时候，按钮显示"选择规格"，点了之后弹出 SKU 面板；选完之后按钮变成"立即购买 69 元"这种带价格的文案；如果库存为 0 就置灰显示"已售罄"。这些状态都是通过 SharedStore 里的 selectedSkuId 和 skuStock 字段来驱动的。

还有一个有趣的点是 AI 问小团。它是一个浮动的入口按钮，点击后会打开聊天面板，我们需要把当前商品的上下文信息（spuId、商品标题、价格）传给 AI 模块，让它能基于当前商品回答用户问题。

在性能方面，BottomBar 是 P0 级模块，在 MRNBox 首屏快照里也包含了它的数据，这样用户一进来就能看到底部按钮区域，不会有一段空白。等真实数据到了再更新文案和状态。`,
  },
  {
    id: 6006,
    category: '美团项目',
    difficulty: 'hard',
    question: '你说模块间通过 SharedStore 通信，如果有 10 个模块都观察同一个字段，性能怎么保证？',
    answer: `SharedStore 多观察者性能保证：

问题场景：selectedSkuId 变化 -> 10 个模块同时响应 -> 可能触发 10 次重渲染

MobX 天然优势：
1. 精确订阅：每个 observer 只订阅实际访问的字段
2. Transaction 批量更新：action 内所有修改合并为一次更新
3. computed 缓存：只有依赖变化时才重新计算

额外优化手段：

1. 分层 Store：
   SharedStore（跨模块共享少量关键字段）+ ModuleStore（模块私有状态）

2. 异步分帧渲染：
reaction(() => sharedStore.selectedSkuId, (skuId) => {
    // P0 同步更新
    priceStore.update(skuId);
    bottomBarStore.update(skuId);
    // P1 异步更新
    requestAnimationFrame(() => {
        timeStore.update(skuId);
        storeModule.update(skuId);
    });
});

3. 实际测量：10 个模块响应 SKU 切换整体耗时 < 16ms（一帧内完成），MobX 派发效率很高，瓶颈不在状态管理而在 UI 渲染。`,
    oralAnswer: `这个问题挺好的，其实就是在问响应式状态管理在大量观察者场景下的性能表现。

我先说结论：在我们的实测中，10 个模块同时响应一个字段的变化，整体耗时是能控制在 16ms 以内的，也就是一帧之内完成，用户完全感知不到卡顿。

为什么能做到呢？首先是 MobX 本身的机制决定了它天然就适合这种场景。MobX 的 observer 是精确订阅的——每个组件只会响应它实际读取过的字段。比如 HeaderModule 虽然也包在 observer 里，但它从来没读过 selectedSkuId，所以 SKU 切换的时候它根本不会重渲染。这比 Redux 那种"所有 connect 的组件都要跑一遍 selector"要高效得多。

其次我们用了 MobX 的 action 机制来做批量更新。SKU 切换的时候其实要同时改好几个字段：selectedSkuId、selectedCount、currentPrice、stockInfo。如果不用 action 包裹，改一个字段就触发一次渲染，那确实会有性能问题。但 action 内的所有修改会合并成一次更新通知。

在这个基础上我们还做了额外优化：把 Store 分层。SharedStore 只放真正需要跨模块共享的少量关键字段，每个模块自己的私有状态放在各自的 ModuleStore 里。这样全局观察者的数量就控制住了。

另外对于优先级不高的模块，我们还做了分帧更新：P0 的价格和按钮同步更新，P1 的可约时间和门店信息放到 requestAnimationFrame 里异步更新，避免同一帧内所有模块扎堆渲染。`,
  },

  // ==================== 小程序迁移 ====================
  {
    id: 6007,
    category: '美团项目',
    difficulty: 'medium',
    question: '你把 MRN 模块迁移到微信小程序 Skyline，具体迁移流程是什么？',
    answer: `MRN -> 小程序 Skyline 迁移流程：

迁移链路（moduleKey -> template -> component -> store）：

1. moduleKey 映射：
   MRN: moduleRegistry['header'] = HeaderModule
   小程序: template name="header" -> <header-component />

2. template 层（页面 WXML 中动态渲染）：
   <block wx:for="{{layout}}" wx:key="moduleKey">
     <template is="{{item.moduleKey}}" data="{{moduleData}}" />
   </block>

3. component 层：每个 moduleKey 对应一个小程序自定义组件

4. store 层：使用 mobx-miniprogram + mobx-miniprogram-bindings

迁移要点：
- React 组件 -> 小程序 Component（生命周期映射）
- JSX -> WXML + WXSS
- Hooks -> observers + methods
- MobX observer -> mobx-miniprogram-bindings
- RN StyleSheet -> WXSS（Flexbox 基本兼容）

工作量：40+ 组件，每个需要结构转换、样式适配、逻辑改写、Store 绑定适配、埋点迁移。`,
    oralAnswer: `MRN 迁移到小程序 Skyline 这个事，本质上就是把 React Native 的代码翻译成微信小程序原生组件。但不是简单翻译，因为两边的运行时、渲染机制、组件模型都不一样。

我们整个迁移的链路可以概括为：moduleKey -> template -> component -> store。

第一步还是 moduleKey 映射。在 MRN 这边，moduleKey 对应的是一个 React 组件；在小程序这边，我们用 WXML 的 template 来做动态渲染。页面拿到 layout 数组后，用 wx:for 遍历，根据 moduleKey 去渲染对应的 template。

第二步是 component 实现。每个 template 里面引用一个自定义组件，这个组件就是原来 MRN 模块的小程序版本。把 JSX 转成 WXML，把 StyleSheet 转成 WXSS，把 Hooks 逻辑转成 Component 的 methods 和 observers。

第三步是 Store 层适配。MRN 用的是 MobX 的 observer 模式，小程序这边我们用 mobx-miniprogram 配合 mobx-miniprogram-bindings 来做类似的响应式绑定。SharedStore 的设计理念不变，只是绑定方式换了。

工作量上，40 多个组件，每个都需要做结构转换、样式适配、逻辑改写、Store 绑定和埋点迁移。我们借助了 mrn-to-miniprogram 的 AI Skill 工具，能帮我们完成大部分机械性的转换工作，人工主要负责处理平台差异和验证正确性。`,
  },
  {
    id: 6008,
    category: '美团项目',
    difficulty: 'hard',
    question: '小程序 Skyline 渲染和 WebView 渲染的区别是什么？你遇到了哪些 Skyline 特有的渲染问题？',
    answer: `Skyline vs WebView 渲染：

架构区别：WebView 模式在浏览器内渲染，Skyline 是自研渲染引擎直接绘制（类 Flutter）。

Skyline 优势：启动更快、滚动更流畅、内存更小、支持 worklet 动画

我遇到的具体问题：

1. 视频+图集多 Tab 场景：
   MRN 用 transform + opacity 动画切换，Skyline 中改用条件渲染 + fade 动画

2. aspectFill 图片裁剪：
   某些尺寸下裁剪位置不对，手动计算比例用 widthFix + overflow:hidden 模拟

3. absolute 浮层与 TabCapsule 布局：
   Skyline 中同级 absolute 元素层叠顺序不稳定，调整 DOM 结构用兄弟元素顺序控制

4. 倒影效果：
   Skyline 不支持 CSS 倒影，用 canvas 绘制 + 渐变 mask

5. Swiper 组件差异：
   自动播放、循环播放表现不同，封装统一 Swiper 组件内部处理各端差异

6. 高度计算问题：
   动态内容高度获取时机不同，需用 IntersectionObserver 或 createSelectorQuery 异步获取

7. CSS 限制：
   不支持 position: fixed（用 sticky 替代）、不支持 backdrop-filter、overflow:hidden 行为差异`,
    oralAnswer: `Skyline 和 WebView 最本质的区别在于渲染方式。WebView 模式下，小程序的页面其实就是跑在一个浏览器内核里的，WXML 和 WXSS 最终变成 HTML 和 CSS 去渲染。而 Skyline 是微信自研的渲染引擎，它更像 Flutter 那种自绘方案，直接用自己的渲染管线来画 UI，不经过浏览器。

Skyline 的好处很明显：启动更快因为不需要初始化 WebView，滚动更流畅因为是原生滚动，内存占用更小，而且支持 worklet 动画可以在 UI 线程运行不卡顿。

但 Skyline 有不少 CSS 限制，我实际开发中踩了不少坑：

最常遇到的是 position: fixed 不支持。MRN 里我们的 BottomBar 用的是 fixed 定位，到 Skyline 就得改成 sticky 或者 absolute 配合页面结构调整。

还有图片裁剪的问题。我们头图组件在 MRN 里用 resizeMode="cover" 就能搞定，但 Skyline 的 aspectFill 模式在某些非标准尺寸下裁剪位置不对，最后我们是手动算图片宽高比，用 widthFix 加 overflow:hidden 来模拟 cover 效果。

还有一个比较头疼的是 absolute 元素的层叠顺序。在 MRN 里设置 zIndex 就能精确控制，但 Skyline 里同级的 absolute 元素层叠表现不太稳定，我们最后的解决办法是调整 DOM 结构，用元素的先后顺序来天然控制层叠。

另外像 backdrop-filter 毛玻璃效果完全不支持，倒影效果也不支持，这些都得用 canvas 或者其他方式来 workaround。整个过程下来，大概有 30% 的时间是花在处理这些平台差异上的。`,
  },
  {
    id: 6009,
    category: '美团项目',
    difficulty: 'hard',
    question: '40+ 小程序组件是怎么保证和 MRN 端首屏视觉一致的？一致性治理怎么做？',
    answer: `首屏视觉一致性治理方案：

目标：用户在 MRN 和小程序看到的首屏效果一致（允许 2px 误差）。

差异来源：
- 布局差异：rpx vs dp 换算精度、默认 lineHeight 不同
- 字体差异：同 fontSize 实际渲染尺寸不同
- 图片差异：裁剪方式和圆角实现差异
- 组件行为差异：Swiper 指示器、文字截断位置

治理流程：

第一阶段 - 对比发现：
- 双端截图左右对比 + 自动化像素 diff 工具
- 标记差异区域生成修复清单

第二阶段 - 修复方法：
- rpx 精度：统一用 Math.round 避免小数
- lineHeight：显式设置不用默认值
- 图片裁剪：封装统一组件内部 Platform 判断
- 字重：限定 normal/bold 不用中间值

第三阶段 - 回归检查：
- 每次修改后重新截图对比
- CI 中跑首屏对比（阈值 95% 相似度），不通过阻止合并

治理结果：首屏一致性从初始约 70% 提升到 95%+`,
    oralAnswer: `一致性治理这件事，说白了就是要解决一个问题：用户在 MRN App 里看到的商品详情页长什么样，在小程序里打开也得长一样。但实际做起来差异会非常多，因为两端的渲染引擎、默认样式、字体、像素计算方式都不一样。

我们定的标准是首屏允许 2px 以内的误差，以 MRN iOS 高端机为视觉基准。

差异的来源主要有几类：布局差异最常见，rpx 和 dp 的换算精度不同，默认 lineHeight 不一样，累积起来一个模块可能就差了好几像素；字体差异是同样的 fontSize 在不同平台实际渲染出来的大小不一样；图片的裁剪方式和圆角实现也有区别。

我们建立了一套完整的治理流程。第一步是发现问题：把两端同一个商品截图下来做像素级的 diff 对比，自动标记出差异区域，生成一个修复清单。

第二步是修复。针对每种差异类型有对应的解法：rpx 精度问题统一用 Math.round 避免小数；lineHeight 一律显式设置不用默认值；图片裁剪封装了统一组件在内部做 Platform 判断。

第三步是守住成果。每次代码变更后自动跑截图对比，CI 里设了 95% 相似度的阈值，不通过的话代码不能合并。

最终我们把一致性从最初大概 70% 出头拉到了 95% 以上。剩下的 5% 基本是一些不影响用户认知的极小差异，比如某些边缘场景下文字截断位置差一两个字符这种。`,
  },

  // ==================== MRNBox 首屏优化 ====================
  {
    id: 6010,
    category: '美团项目',
    difficulty: 'medium',
    question: 'MRNBox 首屏静态快照和普通的接口缓存有什么区别？为什么要专门做一层快照？',
    answer: `MRNBox 快照 vs 普通接口缓存：

普通接口缓存：缓存 BFF 完整响应，下次请求时判断有缓存就直接用。问题是缓存数据仍需 JS 引擎解析 + React 渲染才能展示。

MRNBox 快照的不同：
- 不仅缓存数据，更接近"快照恢复"概念
- 在 JS 引擎还没准备好时就能展示内容
- 本质：把首屏渲染结果"冻结"起来，下次直接恢复

时序对比：
普通缓存：容器创建 -> Bundle加载 -> JS初始化 -> 读缓存 -> 渲染
MRNBox：容器创建 -> [立即展示快照] -> Bundle加载 -> JS接管

快照加载流程：
T0: 用户点击
T1: Native 容器创建（50ms）
T2: 读取快照数据，Native 直接渲染首屏（100ms）
T3: Bundle 加载完成（200-500ms）
T4: React 接管页面，用快照数据初始化
T5: BFF 真实数据到达，更新差异部分

用户感知：普通缓存白屏 500ms；MRNBox 白屏约 100ms -> 快照内容 -> 真实内容。快照数据存储在 Native 层，可在 JS 引擎初始化之前展示。`,
    oralAnswer: `这个问题问得很好，很多人会觉得"不就是缓存嘛"，但 MRNBox 快照和普通接口缓存有本质区别。

普通接口缓存是什么概念呢？就是把 BFF 返回的 JSON 数据存起来，下次进页面先用缓存数据渲染，后台再发请求更新。听起来不错对吧？但问题在于：就算你有缓存，也得等 JS 引擎初始化完、React 运行起来、读缓存、走一遍完整的渲染流程，这些加起来也需要好几百毫秒。用户看到的还是白屏。

MRNBox 快照的核心思路不同：它是在 JS 引擎还没准备好的时候，就让用户看到内容。

具体怎么做到的呢？我们把首屏几个关键模块——头图、价格、SKU、底部按钮这些的渲染结果"冻结"成一份快照数据，存在 Native 层。下次用户进入详情页的时候，时序是这样的：

用户点击的瞬间，Native 容器开始创建，大概 50ms；然后 Native 层立刻读取快照数据并渲染出首屏内容，这一步大概 100ms 就完成了；与此同时 Bundle 在后台继续加载；等 Bundle 加载完了（200-500ms），React 接管页面，用快照数据做初始化；最后 BFF 真实数据到达，有差异的部分做增量更新。

所以用户的感知就是：点击之后 100ms 左右就能看到内容了，而不是等 500ms 白屏。这个体验差距是非常明显的。

类比一下的话，它有点像 iOS 的 LaunchScreen——那个也是在 App 还没完全启动的时候先给你看一张"假"界面。只不过我们的快照内容是动态的、基于上次访问数据的。`,
  },
  {
    id: 6011,
    category: '美团项目',
    difficulty: 'hard',
    question: '详细讲讲"Bundle预加载、模块优先级、点击预请求、桥优化、图片优先级"这个多层优化方案。',
    answer: `MRNBox + SDUI 多层优化方案详解：

1. Bundle 预加载：
   用户浏览商品列表时预测可能点击 -> 提前下载详情页 Bundle
   onItemExposure(spuId) { BundleManager.preload('detail-bundle'); }
   节省 200-500ms

2. 模块优先级渲染：
   P0（立即）：header/price/sku/bottomBar
   P1（延迟100ms）：time/store/guarantee
   P2（滚动触发）：review/qa/recommend
   首屏只渲染 4-5 个模块而非全部 20+

3. 点击预请求（Click Pre-fetch）：
   Native 层拦截点击立即发 BFF 请求（不等 JS 准备好），同时启动 RN 容器。JS 准备好时数据可能已回来，节省 200-300ms

4. 桥优化（Bridge Optimization）：
   - 批量 Bridge 调用合并
   - 高频调用走 JSI（同步调用无序列化）
   - 减少不必要的 Native -> JS 回调

5. 图片染色与优先级：
   - 先加载极低质量缩略图（1-2KB）显示模糊占位，高清图就绪后渐变替换
   - 首屏图片 priority: high，非首屏 priority: low，避免带宽竞争

综合效果：首屏渲染时间下降 35%-65%`,
    oralAnswer: `我们的性能优化不是只做了一件事，而是对首屏加载链路的每个阶段都做了针对性优化，形成了一个多层方案。我逐个讲一下。

第一个是 Bundle 预加载。正常情况下用户点击商品才开始加载详情页的 Bundle，这要花 200 到 500 毫秒。我们的做法是：当用户在列表页浏览的时候，如果某个商品卡片曝光了，我们就预判用户可能会点它，提前在后台把 Bundle 下载好。等用户真正点击的时候 Bundle 已经在内存里了，这一步就直接省掉了。

第二个是模块优先级渲染。页面有 20 多个模块，但首屏用户能看到的其实只有 4-5 个：头图、价格、SKU 和底部按钮。所以我们给模块定了优先级，P0 的立刻渲染，P1 的延迟 100ms，P2 的等用户滚动到了再加载。首屏时间就只取决于这 4-5 个 P0 模块的渲染时间了。

第三个是点击预请求。传统的流程是：点击 -> 等容器创建 -> 等 Bundle 加载 -> 然后 JS 才发网络请求。我们把网络请求提到了最前面——Native 层拦截到点击事件的瞬间就帮你把 BFF 请求发出去了，同时并行启动容器和加载 Bundle。等 JS 准备好了，数据大概率已经回来了，又省了 200-300ms。

第四个是 Bridge 优化。RN 和 Native 之间的通信走 Bridge 是有开销的。我们把高频调用改成了 JSI 同步调用，避免序列化开销；低频的批量合并，减少跨线程通信次数。

第五个是图片优化。首屏的头图通常 3-5MB，加载很慢。我们先加载一个 1-2KB 的极低质量缩略图做模糊占位，同时加载高清图，加载完了做一个渐变替换。另外首屏图片给高优先级，非首屏的低优先级，避免抢带宽。

这些叠加起来，高端设备从 800ms 降到了 280ms 左右，中端设备从 1200ms 降到了 780ms 左右，整体 35% 到 65% 的提升。`,
  },
  {
    id: 6012,
    category: '美团项目',
    difficulty: 'hard',
    question: '首屏渲染时间下降 35%-65% 这个数据是怎么得出的？怎么证明是你的优化带来的？',
    answer: `性能数据的度量和归因：

度量方式：

1. 性能埋点定义：
   - T_start：用户点击商品卡片的时间戳
   - T_fcp：首屏内容绘制完成（P0 模块全部渲染）
   - 首屏时间 = T_fcp - T_start

2. 数据采集：
   - 线上采样（1% 用户上报）
   - 按设备分层：高端/中端/低端
   - 按平台分层：iOS/Android
   - 按版本分层：优化前/优化后

3. 对照实验：
   - AB 实验：同版本用户随机分流
   - A 组：未开启优化（走旧链路）
   - B 组：开启全部优化
   - 对比两组首屏时间分布

归因分析（每项优化单独上线）：

Phase 1 - Bundle 预加载单独上线：
   基线 800ms -> 上线后 650ms，贡献约 -150ms

Phase 2 - 模块优先级渲染：
   基线 650ms -> 上线后 500ms，贡献约 -150ms

Phase 3 - 点击预请求：
   基线 500ms -> 上线后 350ms，贡献约 -150ms

Phase 4 - 图片优化：
   基线 350ms -> 上线后 300ms，贡献约 -50ms

最终：高端设备 800ms -> 280ms（-65%），中端设备 1200ms -> 780ms（-35%）

排除干扰因素：
- 同时段对比（排除网络波动）
- 相同设备分布（排除硬件差异）
- 同一 BFF 版本（排除后端优化影响）`,
    oralAnswer: `这个问题其实是在考验数据思维，就是怎么用数据说话、怎么做归因分析。

首先是怎么度量首屏时间。我们在代码里埋了两个关键时间点：T_start 是用户点击商品卡片那一刻的时间戳，T_fcp 是首屏 P0 模块全部渲染完成的时间戳。首屏时间就是两者相减。线上采样 1% 的用户上报这个数据，并且按设备档次和平台分层统计。

然后是怎么证明优化有效。我们用的是 AB 实验。同一个版本的用户随机分成两组，A 组走旧链路，B 组开启优化，对比两组的首屏时间分布。这样同时段、同设备分布、同后端版本，排除了外部干扰因素。

更关键的是归因——每项优化贡献了多少。我们的做法是分阶段单独上线：

第一阶段只上 Bundle 预加载，其他不动，观察到从 800ms 降到了 650ms，说明这一项贡献了约 150ms。第二阶段在这个基础上加模块优先级渲染，又降了约 150ms。第三阶段加点击预请求，再降 150ms。第四阶段图片优化，降了约 50ms。

每一步都是增量式的，而且都有 AB 对照，所以能很清楚地知道每项优化的贡献值。最终高端设备从 800ms 降到 280ms 左右是 65% 的提升，中端设备从 1200ms 到 780ms 大概 35% 的提升。不同档次差异大是因为低端设备的瓶颈更多在 CPU 渲染速度上，我们这几项优化主要解决的是 IO 和加载时序的问题。`,
  },

  // ==================== Snapshot 交易快照 ====================
  {
    id: 6013,
    category: '美团项目',
    difficulty: 'medium',
    question: '什么是 Snapshot 交易快照页？它和正常详情页的区别是什么？',
    answer: `Snapshot 交易快照页：

定义：用户下单后看到的商品信息"留影"页面，展示用户购买时的商品状态。

与正常详情页的区别：

1. 数据来源不同：
   - 正常详情页：实时请求 BFF，展示当前最新商品信息
   - Snapshot：读取订单快照数据库，展示下单那一刻的商品信息

2. 数据不可变：
   - 正常详情页：商品下架/改价 -> 页面实时更新
   - Snapshot：商品改价后快照不变（用于售后纠纷举证）

3. 模块差异：
   - 正常详情页：有购买按钮、SKU 选择、库存展示
   - Snapshot：无购买操作，改为"再次购买"/"申请售后"入口

4. 交互差异：
   - 正常详情页：可切换 SKU、收藏、分享
   - Snapshot：只读浏览 + 售后操作

技术实现：
- 复用详情页 90% 的模块（header/price/store等）
- 通过 pageType='snapshot' 切换数据源和模块行为
- 模块内部判断 pageType 来决定：
  - 是否展示购买按钮
  - 是否响应 SKU 切换
  - 是否展示实时库存

挑战：
- 同一套模块代码要兼容两种场景
- 快照数据结构可能与最新 BFF 不一致（字段演进）
- 需要做兼容处理避免渲染崩溃`,
    oralAnswer: `Snapshot 交易快照页，简单来说就是用户下单之后能看到的一个"商品留影"。它展示的不是商品当前的信息，而是你下单那一刻商品长什么样。

举个例子：你今天花 69 块买了一个套餐，过了两天商家把价格改成 89 了。如果你这时候去看订单详情，看到的应该还是 69 块——这就是快照的意义。它主要用于售后纠纷的举证，确保用户当时看到什么、买的是什么有据可查。

技术上和正常详情页的区别主要有几点：数据来源不同，正常页面是实时请求 BFF 拿最新数据，快照页是从订单快照数据库里读的历史数据；展示的模块也有差异，快照页没有购买按钮和 SKU 选择，取而代之的是"再次购买"和"申请售后"的入口。

但有意思的是，我们并没有为快照页单独写一套代码。它复用了详情页 90% 的模块——头图模块、价格模块、门店模块这些都是同一份代码。通过一个 pageType 参数来区分当前是正常详情还是快照模式，模块内部根据这个参数决定要不要展示某些交互元素。

这样做的好处是维护成本低，改一个模块两个场景都生效。但挑战也很明显：快照数据结构可能跟最新的 BFF 不一样——因为接口是会演进的，半年前下单时的数据格式可能跟现在不同了。所以我们必须做好兼容处理，字段不存在的时候给合理的默认值，避免渲染崩溃。`,
  },
  {
    id: 6014,
    category: '美团项目',
    difficulty: 'hard',
    question: 'Snapshot 和正常详情页共用模块代码，怎么避免两种场景的逻辑耦合越来越严重？',
    answer: `避免 Snapshot/Detail 逻辑耦合的架构设计：

问题：如果到处写 if(pageType === 'snapshot') 会导致代码难以维护。

解决方案 - 策略模式 + 依赖注入：

1. 定义模块行为接口：
interface ModuleStrategy {
    shouldShowCTA(): boolean;
    getDataSource(): DataProvider;
    getActions(): ActionConfig[];
}

2. 两种策略实现：
class DetailStrategy implements ModuleStrategy {
    shouldShowCTA() { return true; }
    getDataSource() { return new BffDataProvider(); }
    getActions() { return ['buy', 'cart', 'favorite']; }
}

class SnapshotStrategy implements ModuleStrategy {
    shouldShowCTA() { return false; }
    getDataSource() { return new SnapshotDataProvider(); }
    getActions() { return ['rebuy', 'refund']; }
}

3. 模块只依赖接口：
function PriceModule({ strategy }) {
    const data = strategy.getDataSource().getPriceData();
    return <View>
        <Text>{data.price}</Text>
        {strategy.shouldShowCTA() && <BuyButton />}
    </View>;
}

4. 顶层注入策略：
const strategy = pageType === 'snapshot'
    ? new SnapshotStrategy()
    : new DetailStrategy();

好处：
- 模块代码无分支判断
- 新增 pageType 只需加一个策略类
- 各策略独立测试
- 核心渲染逻辑不受污染`,
    oralAnswer: `这是一个很好的架构设计问题。如果不做好设计，很容易出现到处 if pageType === snapshot 的情况，代码越来越乱。

我们的解法是策略模式加依赖注入。思路是这样的：

首先定义一个行为接口，叫 ModuleStrategy。它约定了几个方法：shouldShowCTA 决定要不要展示购买按钮，getDataSource 决定从哪里取数据，getActions 决定底部操作栏展示哪些操作。

然后我们实现两个策略类：DetailStrategy 对应正常详情页，它的 shouldShowCTA 返回 true，数据走 BFF 实时接口，操作是购买、加车、收藏；SnapshotStrategy 对应快照页，shouldShowCTA 返回 false，数据走快照数据库，操作是再次购买和申请售后。

模块代码里面呢，它只依赖 ModuleStrategy 这个接口，不关心具体是哪种策略。比如 PriceModule 里面写的是 strategy.getDataSource().getPriceData()，它不知道也不关心数据是从 BFF 来的还是从快照库来的。

在页面最顶层，根据 pageType 参数实例化对应的策略，注入给所有模块。

这样做的好处是：模块代码里完全没有 if/else 分支，清清爽爽；将来如果要加第三种页面类型，比如"预览模式"，只需要再实现一个 PreviewStrategy 就行了，不用动任何模块代码。每个策略还能独立单测，互不干扰。`,
  },

  // ==================== 跨端稳定性 ====================
  {
    id: 6015,
    category: '美团项目',
    difficulty: 'medium',
    question: '你提到做了跨平台稳定性治理，具体有哪些类型的问题？怎么系统性解决的？',
    answer: `跨平台稳定性问题分类与治理：

问题分类：

1. JS Error 类：
   - undefined is not an object（数据字段缺失）
   - Cannot read property of null（组件未挂载就访问）
   - 原因：某端返回数据结构差异/字段为空

2. 字段缺失类：
   - BFF 返回中某些字段在特定条件下不存在
   - 比如新用户无历史订单，relatedOrders 字段为 undefined

3. 数据残留类：
   - 页面/模块复用时旧数据没清理
   - 典型：列表页回退再进入另一个商品，SKU 数据是上一个商品的

4. 平台差异类：
   - iOS 和 Android 的 Bridge 返回值差异
   - 某些 Native API 在特定版本不可用

系统性治理方案：

1. 防御性编码规范：
   // 必须使用可选链和默认值
   const price = data?.price?.salePrice ?? 0;
   const images = data?.header?.images ?? [];

2. 数据校验层：
   function validateModuleData(moduleKey, data) {
       const schema = moduleSchemas[moduleKey];
       const result = schema.safeParse(data);
       if (!result.success) {
           report(moduleKey, result.error);
           return getDefaultData(moduleKey);
       }
       return result.data;
   }

3. 模块级错误边界：
   <ErrorBoundary fallback={<ModuleSkeleton />}
                  onError={(e) => reportError(moduleKey, e)}>
       <ModuleComponent data={data} />
   </ErrorBoundary>

4. 数据重置机制：
   // 页面离开时清理 Store
   useEffect(() => {
       return () => sharedStore.reset();
   }, []);

5. 监控告警：JS Error 率 > 阈值自动告警，按模块维度定位`,
    oralAnswer: `跨端稳定性治理是我花了比较多精力的一块。因为我们的页面同时跑在 iOS、Android、还有小程序上，BFF 对不同端返回的数据可能有细微差异，加上容器复用、页面切换这些场景，不做好治理的话线上 JS Error 会非常多。

我把遇到的问题归了四类：

第一类是最常见的 JS Error，比如 undefined is not an object。根本原因是某个端返回的数据里缺了某个字段，代码里直接 data.price.salePrice 这样访问就崩了。

第二类是字段缺失。不是所有商品所有场景下每个字段都有值的。比如新用户没有历史订单，relatedOrders 字段就是 undefined；某些城市不支持某个功能，对应字段就不返回。

第三类是数据残留，就是页面或者容器复用时，上一个商品的数据没清理干净，影响了下一个商品的展示。

第四类是平台差异，比如同一个 Bridge API 在 iOS 和 Android 返回的数据格式不一样。

我们建立了一套系统性的方案来治理。首先是编码规范——所有数据访问必须用可选链加默认值，这是写进 ESLint 规则的，不按规范写就过不了检查。

其次是数据校验层。每个模块接收 BFF 数据之前，先过一遍 schema 校验，不合规的字段给默认值，同时上报异常。

第三是模块级错误边界。每个模块外面都包了一层 ErrorBoundary，单个模块崩溃不会影响整个页面，用户最多看到那一个位置变成骨架屏。

最后是监控和告警。线上 JS Error 按模块维度统计，超过阈值自动告警，能快速定位到是哪个模块出了问题。`,
  },
  {
    id: 6016,
    category: '美团项目',
    difficulty: 'hard',
    question: '数据残留问题具体怎么排查和根治？能举一个具体案例讲讲排查过程吗？',
    answer: `数据残留排查案例：

案例：用户从商品 A 跳转到商品 B，价格显示的是商品 A 的价格

排查过程：

1. 复现路径确认：
   商品列表 -> 点击商品A -> 返回列表 -> 点击商品B -> 价格显示异常
   关键：只有快速操作时出现

2. 日志分析：
   - 商品B的 BFF 返回数据正确
   - SharedStore 中 priceData 一度是商品A的值
   - 时序：商品B的数据写入前，PriceModule 读到了商品A残留的 priceData

3. 根因定位：
   MRN 容器复用机制 -> 上一个页面的 Store 实例没销毁
   // 容器池复用：用户离开详情页时容器不销毁而是放回池中
   // 下次进入新商品时分配同一个容器
   // 此时 Store 是上一个商品的

4. 修复方案：

   方案一（治标）：页面初始化时强制重置
   useEffect(() => {
       sharedStore.resetAll();
       initPageData(spuId);
   }, [spuId]);

   方案二（治本）：Store 生命周期绑定容器
   class PageScopedStore {
       constructor(containerId) {
           this.containerId = containerId;
           StoreRegistry.register(containerId, this);
       }
       dispose() {
           StoreRegistry.unregister(this.containerId);
       }
   }
   // 容器回收时自动 dispose

   方案三（防御）：数据写入前校验
   @action setPrice(priceData, spuId) {
       if (spuId !== this.currentSpuId) return; // 过期数据丢弃
       this.priceData = priceData;
   }

5. 验证：增加自动化测试覆盖"快速切换商品"场景`,
    oralAnswer: `我讲一个具体的数据残留案例。

现象是这样的：有用户反馈说进了商品 B 的详情页，但看到的价格是另一个商品 A 的。而且不是必现的，只有快速操作——就是从商品 A 返回列表然后立刻点商品 B——才会出现。

排查过程：首先我确认了 BFF 返回的数据是正确的，商品 B 的接口返回了正确的价格。那问题出在哪呢？我加了日志发现，PriceModule 在渲染的一瞬间读到的 priceData 确实是商品 A 的值。时序上是：页面开始渲染 -> PriceModule 读了 Store 里的旧数据先渲染了一帧 -> 然后新数据才写进来。

根因是 MRN 的容器复用机制。我们有一个容器池，用户离开详情页的时候容器不销毁，而是放回池子里。下次进新商品时分配的是同一个容器，但里面的 Store 实例还保留着上一个商品的数据。

修复方案我们用了三层保障：第一层是治标的——页面初始化时第一件事就是 sharedStore.resetAll()，强制清空所有数据再开始加载新商品。

第二层是治本的——把 Store 的生命周期绑定到容器 ID 上，容器被回收的时候自动 dispose 对应的 Store，下次分配时创建新的。

第三层是防御性的——在 Store 的 action 里加校验，写入数据前检查 spuId 是不是当前商品的，如果是过期数据就直接丢弃不写入。

最后还加了自动化测试专门覆盖"快速切换商品"这个场景，确保以后不会回退。`,
  },

  // ==================== AI Coding 工程化 ====================
  {
    id: 6017,
    category: '美团项目',
    difficulty: 'medium',
    question: '你说参与了 AI Coding 工程化体系建设，具体做了什么？AGENTS/.aicx/rules/knowledge 这套体系怎么理解？',
    answer: `AI Coding 工程化体系：

背景：团队引入 AI 辅助编码后，发现 AI 生成代码质量参差不齐，需要建立工程化体系保证输出质量。

体系结构：

1. AGENTS 目录：
   - 定义不同角色的 AI Agent
   - 如 coder-agent（写代码）、reviewer-agent（代码审查）、doc-agent（写文档）
   - 每个 agent 有明确的职责边界和输出规范

2. .aicx 配置：
   - 项目级 AI 配置文件
   - 指定哪些文件/目录可以让 AI 修改
   - 定义 AI 生成代码的模板和规范

3. rules 规则：
   - 编码规范规则（命名、结构、错误处理）
   - 业务逻辑规则（特定模块的开发规范）
   - 安全规则（禁止的操作、敏感信息处理）
   - 例如：所有模块数据访问必须通过可选链

4. knowledge 知识库：
   - 项目架构文档
   - 模块关系图
   - BFF 接口文档
   - 常见 Bug 和修复方案
   - AI 参考这些知识来理解项目上下文

5. OpenSpec 开放规范：
   - 统一的接口描述格式
   - AI 可以根据 spec 自动生成 TypeScript 类型
   - 也可以根据 spec 生成 mock 数据

实际应用效果：
- 新模块开发效率提升：AI 根据 knowledge 和 rules 生成 80% 代码
- 代码一致性：所有 AI 生成代码遵循相同规范
- 降低上手成本：新人通过 AI 快速了解项目结构`,
    oralAnswer: `我们团队做 AI Coding 工程化，核心是解决一个问题：怎么让 AI 不只是写一些零散代码片段，而是真正理解我们项目的上下文、规范和架构，生成的代码直接能用。

具体来说分几个层面：

第一个是 AGENTS，就是针对不同场景配置不同的 AI 角色。比如我们有一个专门负责"新模块生成"的 Agent，还有一个负责"代码评审"的 Agent。每个 Agent 有不同的系统提示词，告诉它应该关注什么、遵循什么规范。

第二个是 .aicx 配置文件，这是项目级的 AI 配置。核心是定义哪些文件 AI 可以改、哪些不能碰，以及代码生成的模板。比如我们规定 AI 生成模块代码时必须包含 ErrorBoundary、必须有生命周期 cleanup 逻辑。

第三个是 rules，这是具体的编码规范。像"所有数据访问必须用可选链""模块间通信必须通过 SharedStore 不能直接引用"这些。AI 在生成代码时会严格遵守这些规则。

第四个是 knowledge 知识库，就是项目的架构文档、模块关系图、BFF 接口文档这些。AI 在生成代码前会参考这些知识，这样它就不会瞎猜我们的数据结构和模块关系。

最后还有 OpenSpec，就是统一的接口描述规范。AI 可以根据这个自动生成 TypeScript 类型定义、mock 数据。

实际效果是：新模块开发效率提升了不少，AI 根据 knowledge 和 rules 能生成 80% 左右的代码，而且风格一致、符合规范。新人入职也可以通过跟 AI 对话快速了解项目结构。`,
  },
  {
    id: 6018,
    category: '美团项目',
    difficulty: 'hard',
    question: '面试官追问：AI Coding 在实际开发中的边界在哪里？哪些场景 AI 做得好，哪些场景需要人工？',
    answer: `AI Coding 的能力边界：

AI 做得好的场景：

1. 模板化代码生成：
   - 新建标准模块结构（目录/组件/Store/样式/测试）
   - 数据模型定义（根据 BFF 返回自动生成 TypeScript 类型）
   - CRUD 逻辑、列表渲染、表单处理

2. 规范性修改：
   - 统一添加错误边界
   - 批量修复 ESLint/TS 错误
   - 统一修改 API 调用方式

3. 文档生成：
   - 根据代码生成模块说明
   - 变更日志
   - 接口文档更新

4. 测试用例：
   - 根据组件 props 生成单测
   - 根据 Store action 生成状态测试
   - 边界条件覆盖

需要人工的场景：

1. 架构决策：
   - 模块拆分粒度
   - 状态管理方案选型
   - 性能优化策略

2. 业务逻辑判断：
   - 复杂的业务规则（如 SKU 组合定价逻辑）
   - 异常流程处理（支付失败/超时/并发）
   - 产品需求理解和技术方案转化

3. 跨模块协调：
   - SharedStore 字段设计
   - 模块通信协议变更
   - 多端差异决策

4. 性能调优：
   - 渲染瓶颈定位
   - 内存泄漏排查
   - Bridge 调用优化

团队实践：AI 负责 60-70% 代码编写，人工负责设计/审查/优化。`,
    oralAnswer: `AI Coding 的边界其实是我在实践中逐步摸清的。简单来说就是：模式化的、有规律可循的工作 AI 做得很好；需要判断力和创造力的工作还得人来。

AI 做得好的场景，首先是模板化代码生成。我们新增一个 SDUI 模块的时候，目录结构、组件骨架、Store 定义、样式文件这些 AI 都能一步到位生成出来，而且严格遵循项目规范。这类重复性工作原来要花半小时，现在几分钟就好了。

第二类是规范性批量修改。比如我们要给所有模块加错误边界，或者统一把某种 API 调用方式换成新的，这种"规则明确、重复度高"的改动 AI 特别适合。

第三类是文档和测试生成。AI 根据代码结构自动生成模块说明文档、TypeScript 类型、单元测试用例，覆盖率能到 70-80%。

但有些场景 AI 是做不好的。首先是架构决策，比如"这个模块应该拆成几个子组件""状态应该放在哪一层"这种需要理解业务全局的判断，AI 给不了好答案。

第二是复杂业务逻辑，像 SKU 的组合定价、优惠叠加规则、异常状态流转这些，涉及到对业务规则的深度理解和产品意图的把握。

第三是性能调优，找到渲染瓶颈、判断哪里该做缓存、Bridge 调用怎么优化这些，需要对运行时有深入理解。

我们团队的实践结论是：AI 负责 60-70% 的代码编写工作，人负责设计、审查和优化。关键是建立好规范让 AI 生成的代码质量有保障，人才能放心地把重复工作交给它。`,
  },

  // ==================== PushY 热更新 ====================
  {
    id: 6019,
    category: '美团项目',
    difficulty: 'medium',
    question: '团购详情页的热更新是怎么做的？MRN 场景下热更新有什么特殊考虑？',
    answer: `MRN 热更新方案（PushY）：

基本流程：
1. 代码修改 -> 打包新 Bundle
2. 发布到热更新平台（灰度/全量）
3. App 检测到新版本 -> 下载 Bundle -> 重载页面

MRN 场景特殊考虑：

1. 多 Bundle 架构：
   - 详情页是独立 Bundle（不是和首页打在一起）
   - 只更新详情页 Bundle 不影响其他页面
   - 减小单次更新包体大小

2. 增量更新：
   - 不下载完整 Bundle，只下载 diff patch
   - 旧 Bundle + patch = 新 Bundle
   - 典型：全量 Bundle 2MB，增量 patch 50-200KB

3. 灰度策略：
   - 按城市/百分比/用户标签灰度
   - 先 1% -> 5% -> 20% -> 全量
   - 每个阶段观察 JS Error 率和崩溃率

4. 回滚机制：
   - 如果新 Bundle 崩溃率上升，自动回滚到上一版本
   - 客户端本地保留上一个可用版本
   - 加载失败时 fallback 到内置 Bundle

5. 容器预加载配合：
   - 预加载的 Bundle 版本需要和热更新版本一致
   - 更新后需要清理旧版本缓存

6. 发布纪律：
   - 周五不发热更新（避免周末无人值守出问题）
   - 大促期间封版
   - 紧急修复走 hotfix 通道（跳过灰度直接全量）`,
    oralAnswer: `我们详情页的热更新用的是 PushY 方案，这是美团内部的热更新平台。它的核心流程是：开发改完代码后打一个新的 Bundle 包，上传到热更新平台，然后配置灰度策略，App 那边会定期检测是否有新版本，发现有就下载更新然后重新加载页面。

在 MRN 多 Bundle 架构下，热更新有几个特殊点需要考虑：

第一个是粒度问题。因为我们是 Multi-Bundle 架构，详情页是独立 Bundle，所以热更新的粒度也是 Bundle 级别的。修了详情页的 Bug，只需要更新详情页的 Bundle，大概就几百 KB，不用整个 App 的 RN 代码都更新。这对用户来说下载快，对我们来说灰度范围也更可控。

第二个是增量更新。我们不是每次都让用户下载完整 Bundle 的，而是用 diff 算法计算出新旧 Bundle 的差异，生成一个很小的 patch 包。比如完整 Bundle 可能有 2MB，但一次 hotfix 的 patch 可能就 50-200KB。客户端下载 patch 后跟本地旧 Bundle 合并就行。

第三个是灰度和回滚。我们一般是先灰度 1%，观察 JS Error 率和崩溃率没问题，再逐步放大到 5%、20%、然后全量。如果发现新版本有问题，平台可以一键回滚。而且客户端本地也保留了上一个可用版本，如果加载新 Bundle 失败会自动 fallback。

第四个是发布纪律。我们有规定周五不发热更新，因为周末可能没人盯。大促期间会封版，只有紧急修复才能走 hotfix 通道跳过灰度直接全量。`,
  },

  // ==================== 性能深度追问 ====================
  {
    id: 6020,
    category: '美团项目',
    difficulty: 'hard',
    question: '如果面试官问"详情页还能怎么优化？"，你还能想到哪些方向？',
    answer: `详情页进一步优化方向：

1. SSR + Streaming：
   - BFF 端预渲染首屏 HTML（类似 RSC）
   - Streaming 分段返回（P0 模块先到先渲染）
   - 减少客户端渲染耗时

2. Edge Computing：
   - CDN 节点缓存个性化首屏数据
   - 减少回源 BFF 的 RT

3. 预渲染 + 预测：
   - 基于用户行为预测下一个可能访问的商品
   - 后台预渲染 next 商品详情页
   - 用户点击时直接切换（0ms 加载感知）

4. 更激进的 Native 化：
   - 将 P0 模块直接用 Native 渲染
   - RN 只处理非首屏模块
   - 首屏变成纯 Native（极致性能）

5. 数据预取下沉：
   - 列表接口返回时同时携带详情页首屏数据
   - 点击时数据已在本地，无需请求
   - 牺牲列表接口大小换取详情页速度

6. Web Worker 并行解析：
   - BFF 返回的大 JSON 在 Worker 线程解析
   - 主线程不阻塞

7. 内存级缓存分层：
   - L1: 内存缓存（当次会话最近 10 个商品）
   - L2: 磁盘缓存（SQLite 索引）
   - L3: 网络请求

8. 骨架屏 -> AI 生成：
   - 根据商品类型自动生成对应骨架屏
   - 不再是通用骨架，而是接近真实内容的占位

回答技巧：说 2-3 个即可，展示思考深度而不是堆砌。`,
    oralAnswer: `这个问题考的是你对性能优化的思考深度，看你是不是只会背几个常规优化点。我一般会从几个比较有深度的方向来回答。

第一个是数据预取前置。现在我们是用户点击后才请求详情页数据的，但其实可以更激进——在列表接口返回的时候，就把每个商品的首屏关键数据带回来。用户一点击，数据已经在本地了，直接渲染，连网络请求都省了。代价是列表接口体积变大，但换来的是详情页秒开的体验。

第二个是预测性预渲染。基于用户行为数据预测他下一个可能点的商品，在后台悄悄预渲染好那个详情页。用户一点就是秒开。当然这个需要算法支持，而且预测不准就是浪费资源，所以需要评估命中率。

第三个是更激进的 Native 化。现在首屏的核心模块比如头图、价格这些，可以直接用 Native 渲染而不走 RN。RN 引擎启动本身就有开销，如果 P0 模块用 Native 实现，首屏就是纯 Native 的速度，然后非首屏模块再慢慢走 RN 渲染。

第四个是内存级缓存分层。设计三层缓存：L1 是内存缓存保留最近几个商品的数据，L2 是 SQLite 磁盘缓存存更多历史数据，L3 才是网络请求。大多数情况下用户返回重进一个商品，直接命中 L1 缓存就行。

面试时我一般挑两三个说，然后分析每个方案的利弊和适用场景，展示的是思考能力而不是堆方案。`,
  },

  // ==================== 项目管理与协作 ====================
  {
    id: 6021,
    category: '美团项目',
    difficulty: 'easy',
    question: '你在团队中是什么角色？怎么和产品、后端、客户端协作的？',
    answer: `团队角色与协作：

角色定位：前端开发（偏基础设施方向），负责 MRN 详情页模块开发 + 跨端一致性保障 + 性能优化

协作方式：

与产品：
- 需求评审阶段参与，重点关注交互复杂度和跨端差异
- 反馈技术实现成本，协商方案
- 如：产品要求动画效果 -> 评估各端实现差异 -> 给出妥协方案

与后端（BFF）：
- 共同设计 SDUI 数据结构
- moduleKey 和 response 字段的命名规范
- 新增模块时前后端同步评审接口
- 性能优化（如点击预请求）需要后端配合

与客户端（Native）：
- Bridge API 设计和实现
- MRNBox 快照能力的 Native 侧配合
- 容器预加载/复用的时机和策略
- 安全区域适配信息的传递

与测试：
- 提供跨端差异 checklist
- 协助搭建自动化对比环境
- 性能测试方案和基线

日常节奏：
- 每日站会对齐进度
- 每周技术评审（架构变更）
- 大需求：PRD评审 -> 技术方案 -> 开发 -> 联调 -> 提测 -> 灰度 -> 全量`,
    oralAnswer: `我在团队里的定位是前端开发，偏基础设施方向。核心职责是 MRN 详情页的模块开发、跨端一致性保障和性能优化。

跟产品协作，主要在需求评审阶段。我会重点关注交互复杂度和跨端差异。比如产品想做一个复杂的展开动画，我会评估这个在 iOS、Android 和小程序三端的实现成本差异有多大，如果差异太大就会提出一个各端都能以较低成本实现且体验接近的替代方案。

跟后端主要是围绕 SDUI 数据结构的设计。我们 BFF 返回的数据直接决定前端模块怎么渲染，所以 moduleKey 的命名、字段结构、新增模块的接口设计这些都需要前后端一起评审。另外性能优化也需要后端配合，比如点击预请求这个优化就需要 BFF 支持更早返回部分数据。

跟客户端的协作比较密切，因为 MRN 跑在 Native 容器里嘛。Bridge API 的设计、MRNBox 快照需要的 Native 侧能力、容器预加载的时机策略、安全区域信息怎么传给 RN 这些都需要跟客户端同学对齐。

日常节奏就是每天站会对齐进度，每周有技术评审会讨论架构变更。大需求的话走标准流程：PRD 评审、技术方案设计、开发、联调、提测、灰度、全量。`,
  },
  {
    id: 6022,
    category: '美团项目',
    difficulty: 'medium',
    question: '面试官问：这个项目你遇到过最大的技术挑战是什么？怎么解决的？',
    answer: `最大技术挑战：MRN -> 小程序 Skyline 迁移中的"一致性"与"性能"双目标冲突

挑战描述：
- 业务要求小程序视觉和 MRN 完全一致（一致性目标）
- 同时小程序性能不能比 WebView 版差（性能目标）
- 但 Skyline 的 CSS 支持不完整，很多 MRN 上的实现方式无法直接迁移

具体矛盾点：
1. MRN 用复杂动画实现的效果，Skyline 动画性能差
2. MRN 用的布局方式 Skyline 不支持，换方案后视觉有差异
3. 为了一致性增加的代码（补丁逻辑）影响渲染性能

解决过程：

第一步 - 问题分级：
- P0：首屏视觉不一致（必须修复，影响用户认知）
- P1：交互动画差异（可接受小差异）
- P2：非首屏细节差异（低优先级）

第二步 - 方案选择（case by case）：
- 部分场景：降级方案（用更简单但视觉一致的实现）
- 部分场景：平台判断（wx.getSystemInfo 后走不同分支）
- 部分场景：自绘实现（canvas 替代 CSS 不支持的效果）

第三步 - 建立评估机制：
- 每个组件两个指标：一致性评分 + 性能评分
- 两者加权得到综合分，指导优化优先级

第四步 - 抽象公共解决方案：
- 封装了一套跨端适配层
- 常见差异统一处理，新组件直接复用

收获：技术方案不是追求完美，而是在约束条件下找到最优平衡。`,
    oralAnswer: `我遇到的最大技术挑战是在做 MRN 到小程序 Skyline 迁移的时候。核心矛盾是：业务要求小程序的视觉和 MRN 完全一致，同时性能还不能比原来的 WebView 版差。但这两个目标在 Skyline 上经常是冲突的。

举个具体例子，MRN 上有些模块用了比较复杂的 CSS 特性来实现视觉效果，但 Skyline 对 CSS 的支持不完整。如果我为了一致性去写一堆 hack 代码来模拟那些效果，代码量上去了，渲染性能就会下降。

我的解决思路分几步。首先是问题分级。我把所有视觉差异按优先级分成了三档：P0 是首屏视觉不一致必须修、P1 是交互动画差异可以接受小偏差、P2 是非首屏细节差异低优先级处理。

然后针对不同等级用不同策略。有些场景用降级方案——换一种更简单但视觉一致的实现方式；有些场景做平台判断——检测到 Skyline 环境走不同的渲染分支；少数极端场景用 canvas 自绘来替代 CSS 不支持的效果。

第三步是建立量化评估机制。给每个组件打两个分：一致性评分和性能评分，加权得到综合分，用这个分数来指导优化优先级，而不是凭感觉。

最后把常见的差异处理模式抽象成了一套跨端适配层，新组件可以直接复用，不用每次都从头处理平台差异。

这个经历让我学到的最重要的东西是：技术方案不是追求完美，而是在约束条件下找到最优平衡。`,
  },

  // ==================== 架构设计追问 ====================
  {
    id: 6023,
    category: '美团项目',
    difficulty: 'hard',
    question: '如果让你重新设计这个详情页的架构，你会做什么不同的选择？',
    answer: `架构复盘与改进：

保持不变的设计：
- SDUI 架构（服务端驱动 UI 是正确的方向）
- 模块化拆分（独立开发部署）
- SharedStore 模块通信（适合这个场景）

会做不同的选择：

1. 模块通信改用 Event Bus + Store 结合：
   现在：纯 MobX Store 通信（模块耦合度偏高）
   改进：核心状态用 Store，一次性通知用 Event
   好处：模块可以选择性监听，减少不必要的依赖

2. 更早引入 TypeScript 严格模式：
   现在：部分模块 TS 类型不完整，any 较多
   改进：从第一天就 strict: true + noImplicitAny
   好处：减少 50% 的 JS Error

3. 统一跨端适配层：
   现在：每个组件各自处理平台差异
   改进：在框架层面统一提供 Platform Abstraction Layer
   好处：新组件不需要重复处理平台差异

4. 测试策略前置：
   现在：主要依赖手工测试 + 上线后监控
   改进：组件级自动化测试 + 视觉回归测试 + 性能基线测试
   好处：问题在 CI 阶段发现，不到线上

5. 模块注册表动态化：
   现在：moduleRegistry 编译时确定
   改进：支持远程配置 -> 动态加载模块
   好处：不发版就能上/下线模块

6. 数据层抽象：
   现在：模块直接消费 BFF 返回数据
   改进：加一层 Data Adapter 转换
   好处：BFF 字段变更不影响 UI 层

面试回答技巧：不要说原来做得差，而是说"如果重来一次会xxx"，展示成长性思维。`,
    oralAnswer: `这个问题其实是在考复盘能力和技术判断力。我的回答思路是先肯定哪些设计是对的，然后说如果重来会在哪些地方做不同选择。

保持不变的设计有几个：SDUI 架构肯定是对的，服务端驱动 UI 这个方向没问题；模块化拆分也没问题，20 多个模块独立开发部署效率很高；SharedStore 做模块通信在我们这个场景也合适。

如果重来会改的几个点：

第一个是模块通信方式。现在全部用 MobX Store，导致模块间耦合度偏高。如果重来我会用 Event Bus + Store 结合的方式——核心状态还是用 Store 共享，但一次性通知类的通信用事件，这样模块可以选择性监听，减少不必要的依赖。

第二个是 TypeScript 严格模式。我们项目早期 TS 用得不够严格，any 比较多。如果重来，第一天就开 strict: true，能减少至少一半的线上 JS Error。这个属于当时为了赶进度留下的技术债。

第三个是跨端适配层应该更早统一。现在是后期才抽象出来的，早期每个组件各自处理平台差异，导致风格不统一、重复代码多。如果一开始就有统一的 Platform Abstraction Layer，后面迁移小程序会轻松很多。

第四个是测试策略应该前置。我们主要靠手工测试加上线后监控，如果重来我会一开始就建立组件级自动化测试和视觉回归测试，问题在 CI 阶段就能发现。

回答这类问题的关键是展示成长性思维，表达方式是"如果重来我会..."而不是"当时做得不好"。`,
  },
  {
    id: 6024,
    category: '美团项目',
    difficulty: 'hard',
    question: '你说的 SDUI 模块注册表，如果服务端下发了一个前端没有注册的 moduleKey 会怎么样？如何做到前后端解耦？',
    answer: `未注册 moduleKey 的容错与前后端解耦：

当前处理：
const Component = moduleRegistry[moduleKey];
if (!Component) {
    // 静默跳过，不渲染该位置
    // 上报日志：unknown moduleKey: xxx
    return null;
}

容错策略分层：

1. 静默跳过（当前方案）：
   - 优点：不会崩溃，用户无感知
   - 缺点：可能丢失重要模块

2. 兜底组件：
   - 注册一个 FallbackModule
   - 对未知 moduleKey 展示通用占位或骨架
   - 上报告警

3. 远程模块加载：
   // 如果本地没有，尝试远程加载
   const Component = moduleRegistry[moduleKey]
       || await RemoteModuleLoader.load(moduleKey);
   // 类似微前端的远程模块加载

前后端解耦设计：

1. 版本协商：
   // 前端请求时上报自己支持的模块版本
   fetch('/api/detail', {
       headers: { 'X-Supported-Modules': 'header@2,price@3,sku@1' }
   });
   // BFF 只返回前端支持的模块

2. 能力上报：
   // 前端启动时告诉服务端自己有哪些 moduleKey
   // 服务端只下发已注册的模块

3. 灰度新模块：
   // 新模块上线流程：
   // 1. 前端先发版注册新 moduleKey（但不展示）
   // 2. 后端灰度下发新 moduleKey
   // 3. 验证无问题后全量
   // 这样即使前端没有注册也不会出问题

4. 合约文档：
   // OpenSpec 定义所有 moduleKey 及其数据结构
   // 前后端共同维护
   // 新增/废弃 moduleKey 走变更审批流程`,
    oralAnswer: `这个问题考的是 SDUI 架构的容错设计和前后端解耦。

先说如果 BFF 下发了一个前端没注册的 moduleKey 会怎样。我们的处理是静默跳过——在 moduleRegistry 里查不到对应组件就返回 null，不渲染这个位置，同时上报一条日志记录这个 unknown moduleKey。这样用户不会看到报错，但我们后台能知道出了这种情况。

但光是静默跳过还不够完善。我们还有一个兜底组件 FallbackModule，对于某些重要位置如果找不到对应模块，会展示一个通用的占位 UI 而不是完全空白。更进一步，理论上可以做远程模块加载——本地没有的话尝试远程拉取，类似微前端的思路，但这个我们还没落地。

然后说前后端解耦。核心思路是"版本协商"——前端请求的时候通过 header 告诉 BFF 自己支持哪些 moduleKey 以及版本号，BFF 只返回前端能处理的模块。这样即使 BFF 增加了新模块，旧版前端也不会收到自己不认识的 moduleKey。

灰度新模块的流程是：先让前端发一个版本注册新 moduleKey 但不展示，然后 BFF 那边灰度下发，前端接到后开始渲染。如果有问题就关掉 BFF 的灰度，前端代码已经在了但不会执行。

最后我们还维护了一份 OpenSpec 合约文档，所有 moduleKey 及其数据结构都在里面定义，新增或废弃 moduleKey 要走变更审批。这保证了前后端对数据协议的理解是一致的。`,
  },

  // ==================== 综合面试题 ====================
  {
    id: 6025,
    category: '美团项目',
    difficulty: 'easy',
    question: '为什么选择 MobX 而不是 Redux 作为状态管理？在 SDUI 场景下 MobX 的优势是什么？',
    answer: `MobX vs Redux 在 SDUI 场景下的选择：

选择 MobX 的原因：

1. 精确更新：
   - SDUI 有 20+ 独立模块
   - MobX：每个模块只响应自己关心的字段变化
   - Redux：任何 state 变化所有 connect 的组件都要执行 selector
   - 模块越多 MobX 的优势越明显

2. 代码简洁：
   // MobX：直接赋值
   @action updatePrice(price) { this.price = price; }
   // Redux：action + reducer + selector
   // 20 个模块 x 每个 3-5 个 action = 大量样板代码

3. 天然适合模块化：
   - 每个模块一个 Store 实例
   - SharedStore 跨模块共享
   - 无需 combine reducers，天然分治

4. computed 特性：
   - 模块间派生状态用 computed 自动缓存
   - 如 displayPrice = computed from (salePrice, selectedSku, count)

5. 响应式模型更匹配 SDUI：
   - 服务端数据到达 -> 写入 Store -> 自动触发相关模块渲染
   - 不需要 dispatch -> reducer -> 新 state -> re-render 链路

6. Transaction 批量更新：
   - BFF 返回一次包含所有模块数据
   - 一个 action 内写入多个字段
   - 只触发一次渲染批次

MobX 的劣势（需要注意的）：
- 调试追踪不如 Redux DevTools 清晰
- 新人对响应式理解成本
- 需要规范 action 使用，避免随意修改 observable`,
    oralAnswer: `选 MobX 而不是 Redux，最核心的原因是我们的 SDUI 架构有 20 多个独立模块，MobX 的精确更新在这个场景下优势太大了。

什么意思呢？MobX 是响应式的，每个模块通过 observer 只订阅自己关心的数据字段。价格模块只监听 priceData 变化，SKU 模块只监听 skuData 变化，互相不干扰。如果用 Redux，任何一个 dispatch 发生后，所有 connect 过的组件都要跑一遍 selector 来判断"我需不需要更新"。20 多个模块的场景下，这个性能差异是很明显的。

第二个原因是代码简洁。MobX 直接赋值就完事了——this.price = newPrice，组件自动更新。Redux 的话你得写 action creator、reducer、selector，20 个模块每个有 3-5 个 action，光样板代码就很多。在快速迭代的业务里，少写代码就是少出 Bug。

第三个是天然适合模块化。每个 SDUI 模块有自己的 Store 实例，SharedStore 负责跨模块共享状态。不需要 combineReducers 那种全局 state 树，天然就是分治的。

第四个是 computed 很好用。模块间有些派生状态，比如展示价格要根据 SKU 选择和优惠券计算，用 computed 声明式定义就好，自动缓存、自动依赖追踪。

还有 Transaction 批量更新也很重要。BFF 一次返回所有模块数据，我们在一个 action 里写入 20 多个字段，MobX 自动合并成一次渲染批次，不会触发 20 多次无意义的中间渲染。

当然 MobX 也有劣势，主要是调试不如 Redux DevTools 直观，以及新人理解响应式概念有一定成本。但整体权衡下来在我们这个场景 MobX 是更合适的选择。`,
  },
  {
    id: 6026,
    category: '美团项目',
    difficulty: 'medium',
    question: '你提到用 mrn-to-miniprogram Skill 做迁移，这是什么？和手动迁移相比有什么优势？',
    answer: `mrn-to-miniprogram Skill：

定义：一个 AI 辅助的代码转换工具/流程，帮助将 MRN (React Native) 代码转换为微信小程序代码。

工作方式：
1. 输入：MRN 组件源码（JSX + StyleSheet + Hooks/MobX）
2. AI 理解组件结构和逻辑
3. 输出：小程序三件套（WXML + WXSS + JS/TS）

具体转换规则：
- JSX 标签 -> WXML 标签（View -> view, Text -> text）
- 事件绑定（onPress -> bindtap）
- 条件渲染（{show && <X/>} -> wx:if="{{show}}"）
- 列表渲染（.map() -> wx:for）
- StyleSheet -> WXSS class
- Hooks -> Component methods + observers
- MobX observer -> storeBindings

与手动迁移对比：

手动迁移：
- 每个组件 2-4 小时
- 容易遗漏边界情况
- 风格不统一（不同人写法不同）
- 40+ 组件全手工 = 2-3 周

AI Skill 辅助：
- 每个组件 20-30 分钟（含审查和调整）
- 规则统一，输出一致
- 自动处理常见转换模式
- 40+ 组件约 3-5 天

仍需人工处理的部分：
- 平台特有 API（Native Bridge 相关）
- 复杂动画逻辑
- Skyline 特有限制的适配
- 业务逻辑验证

本质：AI 做 80% 机械性转换工作，人做 20% 需要判断力的工作。`,
    oralAnswer: `mrn-to-miniprogram Skill 本质上是一个 AI 辅助的代码转换流程。它的工作方式是：把 MRN 的组件源码喂给 AI，AI 理解组件的结构和逻辑后，自动输出对应的小程序三件套——WXML、WXSS 和 JS。

具体的转换规则包括：JSX 标签转 WXML 标签，比如 View 变 view、Text 变 text；事件绑定从 onPress 转成 bindtap；条件渲染从 JSX 的 {show && <X/>} 转成 wx:if；列表渲染从 .map() 转成 wx:for；StyleSheet 转成 WXSS 的 class 写法；Hooks 转成小程序的 Component methods 加 observers；MobX observer 转成 storeBindings。

和手动迁移相比差距还是很大的。手动的话一个组件大概 2-4 小时，而且不同人写出来的风格不统一，容易遗漏边界情况。40 多个组件全手工迁移差不多要 2-3 周。

用 AI Skill 辅助之后，一个组件 20-30 分钟搞定，这包含了生成之后的人工审查和调整时间。输出风格统一，常见的转换模式都能自动处理。40 多个组件大概 3-5 天就能完成。

当然不是所有东西 AI 都能搞定。平台特有的 API 比如 Native Bridge 相关的调用、复杂动画逻辑、Skyline 特有限制的适配、以及业务逻辑是否正确这些，还是需要人来判断和处理。

总结就是：AI 做 80% 的机械性转换工作，人做 20% 需要判断力的工作。效率提升非常明显。`,
  },
  {
    id: 6027,
    category: '美团项目',
    difficulty: 'hard',
    question: '从 P6 到 P7 的角度，这个项目中你体现的"技术影响力"和"系统性思考"在哪里？',
    answer: `P6 -> P7 的技术影响力和系统性思考体现：

P6 级别的工作（执行）：
- 完成指派的模块开发任务
- 修复分配的 Bug
- 按规范写代码

P7 级别的工作（设计 + 影响力）：

1. 系统性思考：
   - 不是只做一个模块，而是设计模块间协作的机制
   - 不是修一个 Bug，而是建立防止这类 Bug 的体系
   - 不是优化一个指标，而是建立性能度量和归因系统

2. 技术方案输出：
   - MRNBox 首屏快照方案：从问题定义到方案设计到落地效果
   - 跨端一致性治理体系：不是修一个像素差异，是建立发现-修复-验证的闭环
   - AI Coding 工程化：不是个人用 AI 写代码，是让团队都能高效使用

3. 技术影响力：
   - 建立的 AI Coding 规范被其他团队参考
   - 跨端适配层方案沉淀为团队基础设施
   - 性能优化经验在部门内分享

4. 独立决策能力：
   - 能独立完成技术方案评审
   - 能权衡多个方案的利弊做出选择
   - 能预判技术风险并提前规避

5. 可量化的业务价值：
   - 首屏性能 35%-65% 提升 -> 转化率提升
   - 小程序落地 -> 新渠道覆盖
   - 稳定性治理 -> 客诉减少

面试回答建议：用具体案例展示"从执行者到设计者"的转变，不要泛泛而谈。`,
    oralAnswer: `这个问题直接关系到定级，面试官想听的是你从"干活的人"到"设计系统的人"的转变。我从几个维度来说。

第一个是系统性思考。P6 是做好一个模块，P7 是设计模块间协作的机制。举个例子，MRNBox 快照方案不是简单地"缓存一下首屏"，而是我从问题定义出发——为什么首屏慢、哪些环节可以省掉——然后设计了一整套从快照生成、版本管理到降级策略的方案。这是系统性设计，不是点状优化。

第二个是技术方案输出。跨端一致性治理也是类似的，我不是去修单个像素差异，而是建立了一套"发现差异 -> 量化评估 -> 修复 -> 自动化验证防回退"的闭环体系。后面新组件迁移直接走这个流程就行，不用每次从零开始。

第三个是技术影响力。我建立的 AI Coding 规范不只是自己团队在用，其他业务线的同学也参考了我们的 AGENTS 配置和 rules 设计。跨端适配层方案也沉淀成了团队基础设施，新人来了直接用。

第四个是独立决策。比如在 Skyline 迁移中遇到一致性和性能的矛盾时，我能独立评估不同方案的利弊、做出权衡决策，而不是等 leader 拍板。

第五个是可量化的业务价值。首屏性能提升 35%-65% 带来的转化率提升、小程序落地覆盖的新渠道、稳定性治理减少的客诉，这些都是跟业务价值挂钩的。

总之 P7 的核心是证明你能"设计体系、影响他人、产出业务价值"，而不是只能执行分配的任务。`,
  },
  {
    id: 6028,
    category: '美团项目',
    difficulty: 'medium',
    question: '如果面试官问：你在这个项目中犯过什么错误？是怎么发现和修正的？',
    answer: `项目中的错误与修正（回答模板）：

推荐讲的错误类型：技术决策错误（而非低级 Bug）

案例：早期小程序迁移时没有建立一致性度量就开始大规模开发

错误描述：
- 40+ 组件迁移初期追求速度
- 先把功能跑通再说，样式差异"后面统一修"
- 结果：一个月后积累了 200+ 样式差异问题
- 修复成本远大于一开始就做好

发现过程：
- 产品第一次全面走查时发现大量不一致
- 排查后发现很多差异是早期就引入的
- 后续修改涉及已经通过测试的组件，需要重新回归

修正措施：
1. 暂停新组件迁移
2. 建立像素级对比流水线
3. 制定"不通过对比不合并"的规则
4. 补齐已有组件的一致性问题

教训：
- 质量问题不会"后面统一修"，只会越积越多
- 应该在第一个组件就建立质量基线
- 度量先行：有了度量才知道什么是"好"

面试技巧：
- 展示自我反思能力
- 重点在"发现 -> 修正 -> 建立机制防止再犯"
- 不要讲太低级的错误（忘加分号之类的）
- 也不要讲太严重的生产事故（显示风险意识不足）`,
    oralAnswer: `面试官问这个问题是想看你有没有自我反思能力。关键是讲一个有深度的技术决策错误，然后展示你怎么发现、修正并且防止再犯。

我会讲小程序迁移早期的一个错误。当时我们 40 多个组件要迁移到 Skyline，时间比较紧。我的决策是先保证功能跑通，样式差异后面统一修。结果一个月后产品走查的时候发现积累了 200 多个样式差异问题，修复成本比一开始就做好要大得多。

为什么成本高？因为那些有差异的组件已经通过了功能测试，改了之后需要重新回归。而且差异是慢慢积累的，越早引入的修起来越麻烦，因为后面的组件可能依赖了前面的错误实现。

发现之后我做了几件事。首先暂停新组件迁移，不能继续在错误的基础上往前走。然后建立了像素级对比流水线——每个组件在 MRN 和小程序上各截一张图，自动计算差异百分比。制定了"不通过对比不合并"的规则，硬卡在 CI 流程里。最后花了一周时间补齐已有组件的一致性问题。

这件事让我学到的教训是：质量问题永远不会"后面统一修"，只会越积越多。正确的做法是第一个组件就建立质量基线和度量体系，有了度量你才知道什么是"好"。

回答这类问题的要点是：选一个技术决策类的错误而不是低级 Bug，重点讲"发现 -> 修正 -> 建立机制防止再犯"的完整闭环。`,
  },
  {
    id: 6029,
    category: '美团项目',
    difficulty: 'hard',
    question: '详情页的监控体系是怎么搭建的？从哪些维度衡量页面质量？',
    answer: `详情页监控体系：

监控维度：

1. 性能维度：
   - 首屏时间（FCP）：P50 / P90 / P99
   - 可交互时间（TTI）
   - Bundle 加载时间
   - BFF 请求 RT
   - 各模块渲染时间

2. 稳定性维度：
   - JS Error 率（总体 + 按模块）
   - Native Crash 率
   - 白屏率
   - 接口成功率
   - 模块渲染成功率

3. 业务维度：
   - 页面 PV/UV
   - 模块曝光率
   - 按钮点击率（购买/加车/收藏）
   - 转化率（详情 -> 下单）
   - 停留时长

4. 用户体验维度：
   - 长列表滚动帧率
   - 点击响应延迟
   - 图片加载完成率

监控实现：

1. 性能采集：
   // 关键时间点打点
   performance.mark('page_start');
   performance.mark('fcp_end');
   performance.measure('fcp', 'page_start', 'fcp_end');
   // 采样上报（1% 用户全量，其余 0.1%）

2. 错误采集：
   // 全局错误捕获
   ErrorUtils.setGlobalHandler((error) => {
       report({ module: getCurrentModule(), error });
   });
   // 模块级错误边界上报

3. 告警规则：
   - JS Error 率 > 0.5% -> P2 告警
   - 白屏率 > 1% -> P1 告警
   - 首屏 P90 > 3s -> P2 告警
   - 转化率下降 > 5% -> P0 告警

4. 分析看板：
   - 按版本、设备、地域、时段多维分析
   - 性能趋势图 + 异常自动标注
   - 和发版时间线对照（定位是哪次变更导致的）`,
    oralAnswer: `监控体系这块我从四个维度来讲。

第一个是性能维度。核心指标是首屏时间 FCP，我们看 P50、P90 和 P99 三个分位值。P50 代表大部分用户的体验，P90 和 P99 是长尾用户。除了 FCP 还有可交互时间 TTI、Bundle 加载耗时、BFF 接口 RT，以及各个模块各自的渲染时间。

第二个是稳定性维度。最关键的是 JS Error 率，我们按模块维度拆分，这样能快速定位是哪个模块出了问题。还有白屏率、Native Crash 率、接口成功率、模块渲染成功率这些。

第三个是业务维度。包括页面 PV/UV、关键按钮的点击率比如"立即购买"和"加入购物车"、最重要的是转化率——从详情页到下单的转化。这些指标直接跟业务价值挂钩。

第四个是用户体验维度。比如长列表的滚动帧率、点击响应延迟、图片加载完成率这些感知性指标。

实现上，性能数据是在关键时间点打 mark，然后采样上报——1% 用户全量采集，其余 0.1% 采样。错误是通过全局 ErrorHandler 捕获，加上每个模块的 ErrorBoundary 上报。

告警规则是分级的：JS Error 率超过 0.5% 是 P2 告警，白屏率超 1% 是 P1，首屏 P90 超 3 秒是 P2，转化率下降超 5% 是 P0 直接叫人。

看板上支持按版本、设备、地域、时段多维分析，性能趋势图上会自动标注异常点，并且和发版时间线对照——这样一眼就能看出是哪次变更导致了指标劣化。`,
  },
  {
    id: 6030,
    category: '美团项目',
    difficulty: 'medium',
    question: '你怎么理解 MRN 的 Multi-Bundle 架构？它和 Single-Bundle 的优劣是什么？',
    answer: `MRN Multi-Bundle vs Single-Bundle：

Single-Bundle：
- 整个 App 的 RN 代码打成一个 Bundle
- 首页、详情页、订单页等都在一个文件里
- 类比：一个巨大的 main.js 包含所有页面逻辑

Multi-Bundle：
- 每个页面/业务域打成独立 Bundle
- 详情页 Bundle、首页 Bundle、订单 Bundle 各自独立
- 类比：code splitting 到极致 - 每个路由一个独立文件

Multi-Bundle 优势：

1. 启动性能：
   - 进入详情页只加载详情页 Bundle（200-500KB）
   - 而非加载整个 App 的 Bundle（5-10MB）

2. 独立发布：
   - 详情页有 Bug？只热更新详情页 Bundle
   - 不影响其他页面的稳定性
   - 不同页面不同发布节奏

3. 团队协作：
   - 各业务团队独立开发自己的 Bundle
   - 减少代码冲突和合并成本
   - 不会因为别人的代码导致自己页面崩溃

4. 容器复用：
   - 预创建 RN 容器
   - 根据用户行为预加载特定 Bundle
   - 不同 Bundle 共享基础包（common chunk）

Multi-Bundle 劣势：

1. 公共代码重复：
   - 每个 Bundle 都包含一份 React、MobX 等基础库
   - 解决：Common Bundle 提取公共依赖

2. 跨页面状态共享困难：
   - 不同 Bundle 在不同 JS 上下文
   - 需要通过 Native Bridge 传递数据

3. 一致性挑战：
   - 各 Bundle 依赖版本可能不同
   - 公共组件版本管理复杂

4. 调试复杂度：
   - 多个 Bundle 交互时 debug 困难
   - 错误栈可能跨 Bundle 边界`,
    oralAnswer: `Multi-Bundle 架构是 MRN 的核心设计之一，我从对比的角度来解释。

Single-Bundle 就是传统的 RN 方案——整个 App 所有 RN 页面的代码打在一个大文件里。首页、详情页、订单页、个人中心全在一起，可能有 5-10MB。用户打开任何一个 RN 页面都要加载这整个文件。

Multi-Bundle 是把每个页面或业务域拆成独立的 Bundle 文件。详情页一个 Bundle 大概 200-500KB，首页一个，订单一个，各自独立。用户进哪个页面就加载哪个 Bundle。

Multi-Bundle 的优势很明显。第一是启动性能大幅提升——进详情页只需加载详情页的几百 KB Bundle，不用加载整个 App 的全量代码。

第二是独立发布。详情页有 Bug 只需要热更新详情页的 Bundle，包很小、下载快，而且不会影响到其他页面的稳定性。不同页面可以有不同的发布节奏。

第三是团队协作更顺畅。各业务团队独立开发自己的 Bundle，代码冲突少，也不会因为别的团队出了 Bug 导致你的页面崩溃。

第四是可以做容器预加载。提前创建好 RN 容器，根据用户行为预测预加载特定 Bundle，用户点击的时候直接渲染。

但劣势也有。最大的问题是公共代码重复——每个 Bundle 都要包含 React、MobX 这些基础库。解决方案是抽出一个 Common Bundle 放公共依赖，其他业务 Bundle 只包含自己的业务代码。

第二个问题是跨页面状态共享困难，因为不同 Bundle 跑在不同 JS 上下文里，需要通过 Native Bridge 中转数据。

第三是依赖版本管理复杂，要保证各 Bundle 使用的公共组件版本一致。但总体来说在我们这种大型 App 多团队协作的场景下，Multi-Bundle 的收益远大于成本。`,
  },
];
