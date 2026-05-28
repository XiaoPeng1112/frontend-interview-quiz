import { Question } from './types';

export const perfQuestions: Question[] = [
  {
    id: 701,
    category: '性能优化',
    difficulty: 'medium',
    question: '前端首屏加载优化方案？',
    answer: `1. 减体积：压缩、Tree Shaking、WebP、Gzip/Brotli
2. 减请求：合并、内联关键 CSS/JS
3. 加载策略：懒加载、预加载（preload/prefetch）
4. 缓存：HTTP 缓存、Service Worker
5. 渲染：SSR/SSG、骨架屏、Critical CSS
6. CDN 加速
7. HTTP/2 多路复用
8. DNS 预解析

衡量指标：FCP、LCP、TTI、CLS（Core Web Vitals）。`,
    oralAnswer: `首屏优化可以从几个维度入手。

首先是减体积：代码压缩、Tree Shaking 去掉未用代码、图片用 WebP 格式、开启 Gzip 或 Brotli 压缩。然后是加载策略：非关键资源懒加载，关键资源用 preload 预加载。缓存方面用好 HTTP 缓存和 Service Worker。

渲染优化也很重要：SSR 或 SSG 减少白屏时间，骨架屏提升感知速度，Critical CSS 内联关键样式。再加上 CDN 加速、HTTP/2 多路复用、DNS 预解析。

衡量指标主要看 Core Web Vitals：FCP 首次内容绘制、LCP 最大内容绘制、TTI 可交互时间、CLS 累积布局偏移。`,
  },
  {
    id: 702,
    category: '性能优化',
    difficulty: 'medium',
    question: '什么是防抖和节流？',
    answer: `防抖（Debounce）：触发后等 n 秒执行，再触发重新计时。
场景：搜索输入、resize、表单验证。

节流（Throttle）：每 n 秒最多执行一次。
场景：滚动、拖拽、按钮防重复。

区别：防抖只执行最后一次，节流定期执行。`,
    oralAnswer: `防抖和节流都是控制高频事件执行频率的方法。

防抖是触发后等 n 秒才执行，期间再次触发就重新计时，只保留最后一次。典型场景是搜索输入、窗口 resize、表单验证。

节流是每 n 秒最多执行一次，不管触发多频繁都定期执行。典型场景是滚动事件、拖拽、按钮防重复点击。

简单记就是：防抖只执行最后一次，节流定期执行。`,
  },
  {
    id: 703,
    category: '性能优化',
    difficulty: 'hard',
    question: 'Tree Shaking 原理？',
    answer: `通过静态分析消除未使用代码的优化技术。

原理：
1. 基于 ESM 静态结构（编译时确定依赖）
2. 构建工具分析依赖图
3. 标记未引用的导出
4. 压缩工具（Terser）移除

生效条件：
- 必须用 ESM（CommonJS 不支持）
- package.json 设 sideEffects: false
- 避免副作用代码
- 生产模式构建

注意：import { x } from 'lodash' 无法 tree shake，用 lodash-es。`,
    oralAnswer: `Tree Shaking 是通过静态分析消除未使用代码的优化技术。

原理是基于 ESM 的静态结构，因为 import/export 在编译时就能确定依赖关系。构建工具分析依赖图，标记未引用的导出，然后压缩工具 Terser 把这些死代码移除。

生效条件很重要：必须用 ESM（CommonJS 不支持，因为它是动态的），package.json 要设置 sideEffects: false 告诉构建工具哪些模块没有副作用，要避免副作用代码，还要在生产模式下构建。

典型坑是 lodash，普通的 import { x } from 'lodash' 无法 tree shake，要用 lodash-es 才行。`,
  },
  {
    id: 704,
    category: '性能优化',
    difficulty: 'hard',
    question: 'React Native 应用启动优化有哪些方案？',
    answer: `1. Hermes 引擎：AOT 字节码，启动快 2x
2. Bundle 拆包：基础包内置，业务包按需加载
3. 延迟初始化：非关键模块用 InteractionManager 延迟
4. 减小包体积：Tree Shaking、移除无用依赖、图片压缩
5. 原生侧优化：减少启动时原生模块初始化
6. 预加载：提前加载核心数据
7. 闪屏优化：原生闪屏覆盖 JS 加载时间
8. TurboModules：按需加载原生模块

衡量：通过 Performance.now() 或原生 Trace 记录 TTI。`,
    oralAnswer: `RN 启动优化主要从这几个方面入手。

引擎层首先用 Hermes，它是 AOT 字节码引擎，启动速度能快一倍以上。Bundle 方面做拆包：基础包内置在 App 里，业务包按需下载加载。

加载策略上，非关键模块用 InteractionManager 延迟到交互空闲时才初始化；包体积通过 Tree Shaking、移除无用依赖、图片压缩来减小；原生侧减少启动时的模块初始化；提前预加载核心数据；用原生闪屏覆盖 JS 加载时间。TurboModules 可以让原生模块按需加载而不是启动时全部初始化。

衡量方法用 Performance.now() 或原生 Trace 工具记录 TTI。`,
  },
];
