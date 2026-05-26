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
  },
];
