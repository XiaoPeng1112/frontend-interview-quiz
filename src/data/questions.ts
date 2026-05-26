export interface Question {
  id: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  answer: string;
}

export const categories = [
  '全部',
  'JavaScript',
  'CSS',
  'React',
  '网络',
  '性能优化',
  '浏览器',
  'TypeScript',
];

export const questions: Question[] = [
  // JavaScript
  {
    id: 1,
    category: 'JavaScript',
    difficulty: 'easy',
    question: '说说 var、let、const 的区别？',
    answer: `1. **var** 存在变量提升，可以重复声明，函数作用域；
2. **let** 不存在变量提升（暂时性死区），不可重复声明，块级作用域；
3. **const** 声明时必须赋值，不可重新赋值（但引用类型的属性可修改），块级作用域。

实际开发中推荐优先使用 const，需要重新赋值时使用 let，避免使用 var。`,
  },
  {
    id: 2,
    category: 'JavaScript',
    difficulty: 'medium',
    question: '解释一下 JavaScript 的事件循环（Event Loop）机制？',
    answer: `JavaScript 是单线程语言，通过事件循环实现异步：

1. **调用栈（Call Stack）**：同步代码依次入栈执行；
2. **微任务队列（Microtask Queue）**：Promise.then、MutationObserver、queueMicrotask 等产生的回调；
3. **宏任务队列（Macrotask Queue）**：setTimeout、setInterval、I/O、UI 渲染等；

执行顺序：同步代码 → 清空微任务队列 → 取一个宏任务执行 → 再清空微任务队列 → 循环。

\`\`\`js
console.log('1');           // 同步
setTimeout(() => console.log('2'), 0); // 宏任务
Promise.resolve().then(() => console.log('3')); // 微任务
console.log('4');           // 同步
// 输出顺序：1 4 3 2
\`\`\``,
  },
  {
    id: 3,
    category: 'JavaScript',
    difficulty: 'medium',
    question: '什么是闭包？有哪些应用场景？',
    answer: `**闭包**是指一个函数能够记住并访问其词法作用域，即使这个函数在其词法作用域之外执行。

本质：函数 + 其引用的外部变量 = 闭包。

常见应用场景：
- 数据私有化/模块模式
- 函数柯里化
- 防抖/节流
- 缓存（memoize）

\`\`\`js
function createCounter() {
  let count = 0;
  return {
    increment: () => ++count,
    getCount: () => count,
  };
}
const counter = createCounter();
counter.increment(); // 1
counter.getCount(); // 1
\`\`\`

注意：闭包可能导致内存泄漏，使用完毕后应解除引用。`,
  },
  {
    id: 4,
    category: 'JavaScript',
    difficulty: 'hard',
    question: '手写一个 Promise.all 的实现？',
    answer: `\`\`\`js
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError('参数必须是数组'));
    }
    const results = [];
    let completed = 0;
    const len = promises.length;

    if (len === 0) return resolve([]);

    promises.forEach((p, index) => {
      Promise.resolve(p).then(
        (value) => {
          results[index] = value;
          completed++;
          if (completed === len) {
            resolve(results);
          }
        },
        (reason) => {
          reject(reason);
        }
      );
    });
  });
}
\`\`\`

关键点：
- 用 Promise.resolve() 包装每个元素（处理非 Promise 值）
- 用索引保证结果顺序
- 任一 reject 立即 reject
- 空数组直接 resolve([])`,
  },
  {
    id: 5,
    category: 'JavaScript',
    difficulty: 'medium',
    question: '深拷贝和浅拷贝的区别？如何实现深拷贝？',
    answer: `**浅拷贝**：只复制第一层属性，嵌套对象仍然是引用。常用方法：Object.assign()、展开运算符 {...obj}、Array.prototype.slice()。

**深拷贝**：递归复制所有层级，完全独立。

实现方式：
1. \`JSON.parse(JSON.stringify(obj))\` —— 简单但不支持函数、undefined、循环引用、Date、RegExp 等；
2. structuredClone(obj) —— 原生 API，支持大部分类型；
3. 手写递归实现：

\`\`\`js
function deepClone(obj, map = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (map.has(obj)) return map.get(obj); // 处理循环引用

  const clone = Array.isArray(obj) ? [] : {};
  map.set(obj, clone);

  for (const key of Object.keys(obj)) {
    clone[key] = deepClone(obj[key], map);
  }
  return clone;
}
\`\`\``,
  },
  // CSS
  {
    id: 6,
    category: 'CSS',
    difficulty: 'easy',
    question: 'CSS 盒模型是什么？标准盒模型和 IE 盒模型有什么区别？',
    answer: `CSS 盒模型由外到内：margin → border → padding → content。

**标准盒模型（content-box）**：width/height 只包含 content；
**IE 盒模型（border-box）**：width/height 包含 content + padding + border。

切换方式：
\`\`\`css
box-sizing: content-box; /* 标准 */
box-sizing: border-box;  /* IE/怪异 */
\`\`\`

实际开发中推荐全局设置 border-box，计算更直观。`,
  },
  {
    id: 7,
    category: 'CSS',
    difficulty: 'medium',
    question: 'BFC 是什么？如何触发？有什么作用？',
    answer: `**BFC（Block Formatting Context，块级格式化上下文）**是一个独立的渲染区域，内部元素的布局不会影响外部。

触发条件（任一即可）：
- float 不为 none
- position 为 absolute 或 fixed
- display 为 inline-block、flex、grid、table-cell 等
- overflow 不为 visible（常用 overflow: hidden）

作用：
1. 阻止 margin 重叠
2. 清除浮动（包含浮动子元素）
3. 阻止元素被浮动元素覆盖`,
  },
  {
    id: 8,
    category: 'CSS',
    difficulty: 'medium',
    question: 'Flex 布局中 flex: 1 代表什么？',
    answer: `\`flex: 1\` 是 \`flex: 1 1 0%\` 的简写：

- **flex-grow: 1** — 占据剩余空间的比例为 1
- **flex-shrink: 1** — 空间不足时可以缩小
- **flex-basis: 0%** — 初始大小为 0，完全按比例分配

常见用法：让子元素等分父容器空间。

注意区分：
- \`flex: auto\` = \`flex: 1 1 auto\`（基于内容大小再分配）
- \`flex: none\` = \`flex: 0 0 auto\`（不伸缩）
- \`flex: 1\` = \`flex: 1 1 0%\`（忽略内容大小，纯比例分配）`,
  },
  // React
  {
    id: 9,
    category: 'React',
    difficulty: 'easy',
    question: 'React 中 useState 和 useRef 有什么区别？',
    answer: `| 特性 | useState | useRef |
|------|----------|--------|
| 触发重渲染 | ✅ 是 | ❌ 否 |
| 返回值 | [state, setState] | { current: value } |
| 持久性 | 跨渲染保持 | 跨渲染保持 |
| 用途 | 驱动 UI 更新的状态 | 存储不需要触发渲染的可变值 |

useRef 常见用途：
1. 引用 DOM 元素
2. 保存定时器 ID
3. 保存上一次的 props/state
4. 在回调/effect 中引用最新值而不产生重渲染`,
  },
  {
    id: 10,
    category: 'React',
    difficulty: 'medium',
    question: 'React 的 useEffect 和 useLayoutEffect 有什么区别？',
    answer: `两者签名相同，区别在于执行时机：

**useEffect**：在浏览器完成绑画（paint）之后异步执行，不阻塞渲染。适合大多数副作用（数据请求、订阅等）。

**useLayoutEffect**：在 DOM 变更后、浏览器绘画之前同步执行，会阻塞渲染。适合需要读取/修改 DOM 布局的场景（如测量元素尺寸、防止闪烁）。

执行顺序：render → DOM 更新 → useLayoutEffect → 浏览器绘画 → useEffect

建议：优先使用 useEffect，只在出现视觉闪烁时才考虑 useLayoutEffect。`,
  },
  {
    id: 11,
    category: 'React',
    difficulty: 'medium',
    question: 'React 中如何优化性能？',
    answer: `常见性能优化手段：

1. **React.memo**：对组件做浅比较，props 不变则跳过渲染；
2. **useMemo**：缓存计算结果，依赖不变则复用；
3. **useCallback**：缓存函数引用，避免子组件不必要渲染；
4. **虚拟列表**（react-window/react-virtuoso）：大量数据只渲染可见区域；
5. **代码分割**：React.lazy + Suspense 按需加载；
6. **避免内联对象/函数**：每次渲染创建新引用导致子组件重渲染；
7. **状态下沉**：将状态放到真正需要的子组件中，减少影响范围；
8. **key 的正确使用**：列表使用稳定唯一 key，避免用 index。`,
  },
  {
    id: 12,
    category: 'React',
    difficulty: 'hard',
    question: 'React Fiber 架构是什么？解决了什么问题？',
    answer: `**React Fiber** 是 React 16 引入的新协调（reconciliation）引擎。

解决的问题：旧的 Stack Reconciler 递归遍历组件树，一旦开始无法中断，大型更新会阻塞主线程导致卡顿。

核心思想：
1. **可中断渲染**：将渲染工作拆分为多个小单元（Fiber 节点），每个单元执行完可以让出主线程；
2. **优先级调度**：不同更新有不同优先级（用户输入 > 动画 > 数据请求），高优先级可打断低优先级；
3. **双缓冲**：current tree 和 workInProgress tree，切换实现无闪烁更新。

Fiber 节点结构：每个节点包含 type、props、stateNode、child、sibling、return 等指针，形成链表结构便于遍历和中断恢复。

这是 React 并发模式（Concurrent Mode）和 Suspense 的基础。`,
  },
  // 网络
  {
    id: 13,
    category: '网络',
    difficulty: 'easy',
    question: 'HTTP 和 HTTPS 有什么区别？',
    answer: `| 特性 | HTTP | HTTPS |
|------|------|-------|
| 端口 | 80 | 443 |
| 安全性 | 明文传输 | TLS/SSL 加密 |
| 证书 | 不需要 | 需要 CA 证书 |
| 性能 | 稍快 | TLS 握手有额外开销 |

HTTPS 建立连接过程（TLS 握手）：
1. 客户端发送支持的加密套件列表
2. 服务端选择加密套件，返回证书
3. 客户端验证证书，生成随机密钥，用公钥加密发送
4. 双方用协商的密钥进行对称加密通信

现代 HTTP/2、HTTP/3 默认要求 HTTPS。`,
  },
  {
    id: 14,
    category: '网络',
    difficulty: 'medium',
    question: '跨域是什么？有哪些解决方案？',
    answer: `**同源策略**：协议 + 域名 + 端口 三者完全相同才算同源。不同源的请求即为跨域。

解决方案：

1. **CORS（推荐）**：服务端设置 Access-Control-Allow-Origin 等响应头；
2. **代理转发**：开发环境用 webpack devServer proxy，生产用 Nginx 反向代理；
3. **JSONP**：利用 script 标签不受同源策略限制，只支持 GET；
4. **postMessage**：跨窗口/iframe 通信；
5. **WebSocket**：不受同源策略限制；

CORS 分为简单请求和预检请求（OPTIONS），非简单请求会先发 OPTIONS 确认服务端是否允许。`,
  },
  {
    id: 15,
    category: '网络',
    difficulty: 'medium',
    question: 'HTTP 缓存策略有哪些？强缓存和协商缓存的区别？',
    answer: `**强缓存**：不发请求，直接使用本地缓存。
- Cache-Control: max-age=3600（优先级高）
- Expires: 绝对时间（已过时）

命中时返回 200（from cache）。

**协商缓存**：发请求到服务器验证是否过期。
- Last-Modified / If-Modified-Since（精度秒级）
- ETag / If-None-Match（精度更高，优先级更高）

未过期返回 304 Not Modified。

优先级：Cache-Control > Expires；ETag > Last-Modified。

最佳实践：
- HTML：no-cache（每次协商）
- JS/CSS/图片：带 hash 的文件名 + 长期强缓存（max-age=31536000）`,
  },
  // 性能优化
  {
    id: 16,
    category: '性能优化',
    difficulty: 'medium',
    question: '前端首屏加载优化有哪些方案？',
    answer: `1. **减小资源体积**：代码压缩、Tree Shaking、图片压缩/WebP、Gzip/Brotli；
2. **减少请求数量**：合并请求、雪碧图、内联关键 CSS/JS；
3. **加载策略**：路由懒加载、图片懒加载、预加载关键资源（preload/prefetch）；
4. **缓存策略**：合理的 HTTP 缓存、Service Worker 离线缓存；
5. **渲染优化**：SSR/SSG、骨架屏、Critical CSS 内联；
6. **CDN 加速**：静态资源部署到 CDN 节点；
7. **HTTP/2**：多路复用减少连接开销；
8. **DNS 预解析**：dns-prefetch 提前解析第三方域名。

衡量指标：FCP、LCP、TTI、CLS（Core Web Vitals）。`,
  },
  {
    id: 17,
    category: '性能优化',
    difficulty: 'medium',
    question: '什么是防抖和节流？分别适用于什么场景？',
    answer: `**防抖（Debounce）**：事件触发后等待 n 秒才执行，期间再次触发则重新计时。

适用场景：搜索输入联想、窗口 resize 结束后计算、表单验证。

\`\`\`js
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
\`\`\`

**节流（Throttle）**：每隔 n 秒最多执行一次，期间的触发被忽略。

适用场景：滚动事件、按钮防重复点击、拖拽。

\`\`\`js
function throttle(fn, interval) {
  let last = 0;
  return function(...args) {
    const now = Date.now();
    if (now - last >= interval) {
      last = now;
      fn.apply(this, args);
    }
  };
}
\`\`\``,
  },
  // 浏览器
  {
    id: 18,
    category: '浏览器',
    difficulty: 'medium',
    question: '浏览器从输入 URL 到页面渲染经历了哪些过程？',
    answer: `1. **DNS 解析**：域名 → IP 地址（本地缓存 → 递归查询）；
2. **TCP 连接**：三次握手建立连接（HTTPS 还需 TLS 握手）；
3. **发送 HTTP 请求**：构造请求报文发送；
4. **服务器处理并返回响应**；
5. **浏览器解析**：
   - 解析 HTML → DOM 树
   - 解析 CSS → CSSOM 树
   - DOM + CSSOM → Render Tree
6. **布局（Layout/Reflow）**：计算几何信息；
7. **绘制（Paint）**：生成绘制指令；
8. **合成（Composite）**：GPU 合成各图层，显示到屏幕；
9. **执行 JS**：可能修改 DOM/CSSOM，触发重排重绘。

注意：CSS 不阻塞 DOM 解析但阻塞渲染，JS 阻塞 DOM 解析（除非 async/defer）。`,
  },
  {
    id: 19,
    category: '浏览器',
    difficulty: 'medium',
    question: '什么是重排（Reflow）和重绘（Repaint）？如何减少？',
    answer: `**重排（Reflow）**：元素几何属性变化（位置、大小），浏览器重新计算布局。代价大。
**重绘（Repaint）**：外观变化但不影响布局（颜色、阴影），只重新绘制。代价较小。

重排一定触发重绘，重绘不一定触发重排。

触发重排的操作：改变宽高/边距、增删 DOM、读取 offsetWidth 等布局属性。

优化方式：
1. 批量修改样式（cssText 或切换 class）
2. 使用 DocumentFragment 批量 DOM 操作
3. 脱离文档流操作后再放回（absolute/fixed）
4. 避免频繁读取布局属性，读取后缓存
5. 使用 transform 代替 top/left 实现动画（只触发合成）
6. 使用 will-change 提示浏览器提升为独立图层`,
  },
  // TypeScript
  {
    id: 20,
    category: 'TypeScript',
    difficulty: 'easy',
    question: 'TypeScript 中 interface 和 type 有什么区别？',
    answer: `两者都可以定义对象类型，但有一些差异：

| 特性 | interface | type |
|------|-----------|------|
| 扩展方式 | extends 继承 | & 交叉类型 |
| 重复声明 | ✅ 自动合并 | ❌ 报错 |
| 联合类型 | ❌ 不支持 | ✅ 支持 |
| 映射类型 | ❌ 不支持 | ✅ 支持 |
| class implements | ✅ 支持 | ✅ 支持 |

建议：
- 定义对象/类的形状 → interface（利于扩展）
- 需要联合类型、工具类型、映射 → type
- 库的公共 API → interface（允许用户扩展）`,
  },
  {
    id: 21,
    category: 'TypeScript',
    difficulty: 'hard',
    question: '解释 TypeScript 中的条件类型和 infer 关键字？',
    answer: `**条件类型**语法类似三元表达式：
\`\`\`ts
T extends U ? X : Y
\`\`\`

**infer** 用于在条件类型中推断类型变量：
\`\`\`ts
// 提取函数返回值类型
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// 提取 Promise 的值类型
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

// 提取数组元素类型
type ElementType<T> = T extends (infer E)[] ? E : T;
\`\`\`

分布式条件类型（裸类型参数会分发）：
\`\`\`ts
type ToArray<T> = T extends any ? T[] : never;
type Result = ToArray<string | number>; // string[] | number[]
\`\`\`

这是实现高级工具类型（Omit、Extract、Parameters 等）的基础。`,
  },
  {
    id: 22,
    category: 'JavaScript',
    difficulty: 'medium',
    question: '原型链是什么？如何实现继承？',
    answer: `每个对象都有一个 __proto__ 指向其构造函数的 prototype，形成链式结构即为**原型链**。查找属性时沿原型链向上查找，直到 null。

\`\`\`
实例 → Constructor.prototype → Object.prototype → null
\`\`\`

ES6 继承（推荐）：
\`\`\`js
class Animal {
  constructor(name) { this.name = name; }
  speak() { console.log(this.name + ' speaks'); }
}
class Dog extends Animal {
  bark() { console.log('Woof!'); }
}
\`\`\`

ES5 寄生组合继承（面试考察）：
\`\`\`js
function Parent(name) { this.name = name; }
Parent.prototype.say = function() { console.log(this.name); };

function Child(name, age) {
  Parent.call(this, name); // 继承属性
  this.age = age;
}
Child.prototype = Object.create(Parent.prototype); // 继承方法
Child.prototype.constructor = Child;
\`\`\``,
  },
  {
    id: 23,
    category: 'CSS',
    difficulty: 'hard',
    question: '如何实现一个自适应的等比例容器（如 16:9 视频容器）？',
    answer: `**方法一：padding-top 百分比（经典方案）**
\`\`\`css
.container {
  width: 100%;
  padding-top: 56.25%; /* 9/16 = 0.5625 */
  position: relative;
}
.container > .content {
  position: absolute;
  inset: 0;
}
\`\`\`

padding 百分比相对于父元素宽度计算，所以高度随宽度等比变化。

**方法二：aspect-ratio（现代方案）**
\`\`\`css
.container {
  width: 100%;
  aspect-ratio: 16 / 9;
}
\`\`\`

浏览器兼容性已很好（Chrome 88+, Firefox 89+, Safari 15+），推荐优先使用。`,
  },
  {
    id: 24,
    category: '网络',
    difficulty: 'hard',
    question: 'HTTP/2 相比 HTTP/1.1 有哪些改进？',
    answer: `HTTP/2 主要改进：

1. **多路复用（Multiplexing）**：一个 TCP 连接上可并行传输多个请求/响应，解决队头阻塞；
2. **二进制分帧**：将数据拆分为二进制帧传输，解析效率更高；
3. **头部压缩（HPACK）**：使用静态表+动态表+哈夫曼编码压缩 Header；
4. **服务端推送（Server Push）**：服务端可主动推送资源（实际使用较少）；
5. **流优先级**：可以设置请求优先级，重要资源优先传输。

局限性：
- 仍基于 TCP，存在 TCP 层的队头阻塞
- 丢包时所有流都会受影响

HTTP/3 使用 QUIC（基于 UDP）解决了 TCP 的队头阻塞问题。`,
  },
  {
    id: 25,
    category: '性能优化',
    difficulty: 'hard',
    question: '什么是 Tree Shaking？它的原理是什么？',
    answer: `**Tree Shaking** 是一种通过静态分析消除未使用代码（Dead Code）的优化技术。

原理：
1. 基于 **ES Module 的静态结构**（import/export 在编译时确定，不能动态改变）；
2. 构建工具（Webpack/Rollup）分析模块依赖图；
3. 标记未被引用的导出为"未使用"；
4. 压缩工具（Terser）移除这些代码。

生效条件：
- 必须使用 ESM（import/export），CommonJS 不支持；
- package.json 中设置 "sideEffects": false 表明模块无副作用；
- 避免副作用代码（如顶层 IIFE、修改全局变量）；
- 生产模式构建。

注意：\`import { debounce } from 'lodash'\` 无法 tree shake，应使用 \`import debounce from 'lodash/debounce'\` 或 lodash-es。`,
  },
];
