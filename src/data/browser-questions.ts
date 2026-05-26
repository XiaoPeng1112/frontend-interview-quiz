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
  },
];
