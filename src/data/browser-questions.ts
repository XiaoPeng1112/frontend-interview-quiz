import { Question } from './types';

export const browserQuestions: Question[] = [
  {
    id: 801,
    category: '浏览器',
    difficulty: 'medium',
    question: '浏览器从输入 URL 到页面渲染的过程？',
    answer: `1. DNS 解析：域名 → IP
2. TCP 连接：三次握手（HTTPS 加 TLS 握手）
3. 发送 HTTP 请求
4. 服务器返回响应
5. 解析：HTML → DOM，CSS → CSSOM，合成 Render Tree
6. 布局（Layout）：计算几何信息
7. 绘制（Paint）：生成绘制指令
8. 合成（Composite）：GPU 合成图层显示

CSS 不阻塞 DOM 解析但阻塞渲染，JS 阻塞 DOM 解析（除非 async/defer）。`,
    oralAnswer: `这个过程可以分为网络和渲染两个阶段。

网络阶段：先 DNS 解析拿到 IP 地址，然后 TCP 三次握手建连（HTTPS 还加 TLS 握手），然后发送 HTTP 请求，服务器返回响应。

渲染阶段：浏览器解析 HTML 生成 DOM 树，解析 CSS 生成 CSSOM，两者合成 Render Tree。然后布局（Layout）计算几何信息，绘制（Paint）生成绘制指令，最后合成（Composite）由 GPU 合成图层显示。

要注意：CSS 不阻塞 DOM 解析但阻塞渲染（因为 Render Tree 需要 CSSOM）；JS 会阻塞 DOM 解析（除非加 async 或 defer 属性）。`,
  },
  {
    id: 802,
    category: '浏览器',
    difficulty: 'medium',
    question: '重排和重绘的区别？如何减少？',
    answer: `重排（Reflow）：几何属性变化，重新计算布局。代价大。
重绘（Repaint）：外观变化不影响布局，只重绘。代价较小。

重排一定触发重绘。

优化：
1. 批量修改样式（class 切换）
2. DocumentFragment 批量 DOM 操作
3. 脱离文档流操作后放回
4. 缓存布局属性
5. transform 代替 top/left（只触发合成）
6. will-change 提升独立图层`,
    oralAnswer: `重排是元素的几何属性变了（比如宽高、位置），浏览器需要重新计算布局，代价很大。重绘是只是外观变了（比如颜色、背景），不影响布局，代价较小。重排一定会触发重绘，但重绘不一定触发重排。

优化方法：批量修改样式用 class 切换而不是逐个修改；用 DocumentFragment 批量操作 DOM；先脱离文档流操作完再放回；缓存布局属性避免反复读取触发强制重排；用 transform 代替 top/left 做动画（只触发合成层，跳过布局和绘制）；用 will-change 提升元素到独立图层。`,
  },
  {
    id: 803,
    category: '浏览器',
    difficulty: 'hard',
    question: 'V8 引擎的垃圾回收机制？',
    answer: `V8 采用分代回收：

新生代（短命对象）：
- Scavenge 算法：From/To 空间复制存活对象
- 经过多次 GC 存活的晋升到老生代

老生代（长期对象）：
- Mark-Sweep：标记存活对象，清除未标记
- Mark-Compact：标记后整理碎片
- 增量标记：分多次小步完成，减少停顿

常见内存泄漏：
- 全局变量
- 未清除的定时器/事件监听
- 闭包引用
- 游离 DOM 引用
- console.log 引用

排查工具：Chrome DevTools → Memory → Heap Snapshot / Allocation Timeline`,
    oralAnswer: `V8 用分代回收策略，把堆内存分为新生代和老生代。

新生代存放短命对象，用 Scavenge 算法：把内存分 From 和 To 两个空间，GC 时把存活对象从 From 复制到 To，然后两空间交换。经过多次 GC 还存活的对象会晚升到老生代。

老生代存放长期对象，用 Mark-Sweep 标记清除（标记存活对象，清除未标记）和 Mark-Compact 整理碧片。为了减少停顿，还有增量标记，把标记工作分成多次小步完成。

常见内存泄漏有：全局变量、未清除的定时器和事件监听、闭包引用、游离 DOM 引用、console.log 保持引用。排查工具用 Chrome DevTools 的 Memory 面板，拍 Heap Snapshot 或用 Allocation Timeline 跟踪。`,
  },
];
