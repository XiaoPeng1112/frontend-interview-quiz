import { Question } from './types';

export const resumeSkillsQuestions: Question[] = [
  // ============ 技能1: JavaScript / TypeScript / ES6+ ============
  {
    id: 5001,
    category: '技能考察',
    difficulty: 'easy',
    question: 'ES6 中 let/const/var 的区别是什么？什么是暂时性死区（TDZ）？',
    answer: `三者区别：

var：
- 函数作用域（不是块作用域）
- 存在变量提升（声明提升，值为 undefined）
- 可重复声明
- 全局声明时挂载到 window

let：
- 块作用域 {}
- 不存在变量提升（实际有提升但不初始化）
- 不可重复声明
- 不挂载到 window

const：
- 块作用域
- 声明时必须赋值
- 不可重新赋值（但对象/数组的属性可修改）
- 不可重复声明

暂时性死区（TDZ）：
console.log(a); // ReferenceError
let a = 1;

从块的开始到 let/const 声明语句之间的区域就是 TDZ。在这个区域内访问该变量会抛出 ReferenceError。

本质原因：let/const 的声明会被提升，但不会被初始化。引擎知道这个变量存在，但在声明语句执行前不允许访问。`,
    oralAnswer: `var 是函数作用域，有变量提升，声明前访问是 undefined。let 和 const 是块作用域，不能重复声明，不挂载到 window。区别是 const 声明时必须赋值且不能重新赋值，但如果是对象的话属性是可以修改的。

暂时性死区就是从代码块开始到 let/const 声明语句之间的区域。在这个区域里访问变量会抛 ReferenceError。本质原因是 let/const 虽然也会被提升，但不会被初始化。引擎知道变量存在但不让你访问，直到执行到声明语句。

实际开发中基本就是默认用 const，需要重新赋值的用 let，var 基本不用了。`,
  },
  {
    id: 5002,
    category: '技能考察',
    difficulty: 'easy',
    question: 'TypeScript 中 interface 和 type 有什么区别？你在项目中一般怎么选？',
    answer: `核心区别：

1. 扩展方式：
   interface 用 extends 继承，type 用 & 交叉类型组合

2. 声明合并：
   interface 同名自动合并，type 同名报错

3. 适用范围：
   interface 只能描述对象/函数形状
   type 可以描述任何类型（联合、元组、原始类型别名）

4. 计算属性：
   type Keys = 'a' | 'b';
   type Obj = { [K in Keys]: string }; // type 可以用 mapped types
   // interface 不能直接用 mapped types

项目中的选择原则：
- 描述对象/类的形状 -> interface（可扩展、可合并）
- 联合类型 / 工具类型 / 复杂类型运算 -> type
- 对外暴露的 API 类型 -> interface（方便使用方扩展）
- 内部使用的辅助类型 -> type

在美团 MRN 模块中：
- 模块 Props 用 interface（清晰、可继承）
- Store 的 State 类型用 interface
- 工具类型（Pick/Omit 组合）用 type
- 联合类型（moduleKey 枚举）用 type`,
    oralAnswer: `interface 和 type 最核心的区别有几个。interface 可以声明合并——同名 interface 自动合并属性，type 同名直接报错。interface 用 extends 继承，type 用交叉类型 & 组合。另外 type 可以描述任何类型包括联合类型、元组、原始类型别名，interface 只能描述对象和函数的形状。

我在项目里的选择原则是：描述对象形状、组件 Props、Store State 这些用 interface，因为清晰而且方便使用方扩展。联合类型、工具类型组合、复杂类型运算用 type。对外暴露的 API 类型用 interface，内部辅助类型用 type。

在美团 MRN 项目里，模块的 Props 定义用 interface，Store 的 State 类型也用 interface，moduleKey 的枚举和各种 Pick/Omit 组合用 type。`,
  },
  {
    id: 5003,
    category: '技能考察',
    difficulty: 'medium',
    question: 'Promise.all / Promise.allSettled / Promise.race / Promise.any 的区别？实际场景中你怎么选？',
    answer: `四种方法对比：

Promise.all(promises):
- 全部 fulfilled 返回结果数组
- 任一 rejected 立即 reject（短路）
- 场景：并发请求多个接口，全部成功才继续

Promise.allSettled(promises):
- 等待所有 promise 完成（无论成功失败）
- 返回 [{status, value/reason}, ...]
- 场景：批量操作，需要知道每个的成功/失败状态

Promise.race(promises):
- 第一个 settle（无论成功失败）就返回
- 场景：超时控制、竞速请求

Promise.any(promises):
- 第一个 fulfilled 就返回
- 全部 rejected 才 reject（AggregateError）
- 场景：多源请求取最快成功的

实际项目场景：

1. 模块数据并行请求（Promise.all）：
const [skuData, priceData, storeData] = await Promise.all([fetchSku(), fetchPrice(), fetchStore()]);

2. 批量模块初始化（Promise.allSettled）：
// 某个模块初始化失败不应影响其他模块
const results = await Promise.allSettled(modules.map(m => m.init()));

3. 接口超时控制（Promise.race）：
const data = await Promise.race([fetchBFF(), new Promise((_, reject) => setTimeout(() => reject('timeout'), 3000))]);

4. 多 CDN 竞速加载（Promise.any）：
const img = await Promise.any([loadFromCDN1(url), loadFromCDN2(url)]);`,
    oralAnswer: `这四个方法的区别我用一句话总结每个。Promise.all 是全部成功才成功，有一个失败就立即失败。Promise.allSettled 是等所有都完成不管成功失败，返回每个的状态。Promise.race 是谁先完成用谁的结果不管成功失败。Promise.any 是谁先成功用谁，全部失败才失败。

实际项目里怎么选的话，并发请求多个接口全部成功才能继续用 all，比如同时获取 SKU、价格、库存数据。批量操作需要知道每个结果用 allSettled，比如多个模块初始化某个失败不影响其他的。超时控制用 race，把真实请求和一个 setTimeout reject 竞速。多源加载取最快成功的用 any，比如多个 CDN 竞速加载图片。`,
  },
  {
    id: 5004,
    category: '技能考察',
    difficulty: 'hard',
    question: 'TypeScript 中 infer 关键字的作用是什么？手写一个 DeepPartial 类型。',
    answer: `infer 关键字：
用在条件类型（extends）中，从类型中"推断"出某部分类型。

基本用法：
// 推断函数返回值类型
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// 推断数组元素类型
type ElementType<T> = T extends (infer E)[] ? E : never;

// 推断 Promise 包裹的类型
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

手写 DeepPartial：
type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends object
        ? T[K] extends Function
            ? T[K]                       // 函数类型保持原样
            : T[K] extends Array<infer U>
                ? Array<DeepPartial<U>>  // 数组递归处理元素
                : DeepPartial<T[K]>      // 对象递归
        : T[K];                          // 原始类型保持原样，加 ?
};

使用示例：
interface Config {
    server: { host: string; port: number; ssl: { cert: string } };
    debug: boolean;
}
type PartialConfig = DeepPartial<Config>;
// { server?: { host?: string; port?: number; ssl?: { cert?: string } }; debug?: boolean }

项目中的应用：
// 模块 Props 的可选更新
type ModuleUpdate<T> = DeepPartial<T> & { moduleKey: string };`,
    oralAnswer: `infer 关键字用在条件类型里，作用是从类型中「推断」出某一部分。最经典的例子是 ReturnType——T extends (...args: any[]) => infer R ? R : never，这里 infer R 就是让 TypeScript 自动推断出函数的返回值类型。

类似的还有推断数组元素类型、推断 Promise 包裹的类型等等，都是同一个套路：用 extends 做模式匹配，infer 占位你想提取的部分。

DeepPartial 的实现思路是递归。对对象的每个属性加问号变可选，如果属性值是对象就递归处理，如果是数组就递归处理元素类型，如果是函数或原始类型就保持原样。关键是要处理好几个边界：函数不能递归进去、数组要拿出元素类型再递归。

项目里的实际应用是模块更新时的类型定义，DeepPartial<ModuleProps> 表示可以只传部分字段做增量更新。`,
  },

  // ============ 技能2: React / React Native / Hooks ============
  {
    id: 5005,
    category: '技能考察',
    difficulty: 'easy',
    question: 'React Hooks 的使用规则是什么？为什么不能在条件语句中使用 Hooks？',
    answer: `Hooks 两条规则：
1. 只在函数组件或自定义 Hook 的顶层调用
2. 不能在循环、条件、嵌套函数中调用

为什么不能在条件中使用：

React 内部用"调用顺序"来匹配 Hook 和对应的状态。

// React 内部类似这样记录：
hooks = [state1, state2, effect1, state3, ...]
// 每次渲染按顺序取

如果有条件：
function App() {
    const [a, setA] = useState(0); // 第1个 hook
    if (someCondition) {
        const [b, setB] = useState(0); // 条件为真时是第2个
    }
    const [c, setC] = useState(0); // 可能是第2个或第3个
}

// 第一次渲染 someCondition=true:  hooks = [a, b, c]
// 第二次渲染 someCondition=false: hooks = [a, c, ???]
// React 把 c 的值当成 b 的值了！

解决方式：
// 始终调用，用默认值处理
const [b, setB] = useState(0); // 始终调用
// 条件逻辑放在 Hook 之后使用`,
    oralAnswer: `Hooks 有两条核心规则：只在顶层调用，不能在循环、条件、嵌套函数里调用。

原因是 React 内部用调用顺序来匹配 Hook 和对应的状态。它维护一个 hooks 数组，每次渲染按顺序取。如果你在条件里调用了一个 useState，条件为真时它是第二个 hook，条件为假时它消失了，后面所有 hook 的索引就错位了，React 会把 c 的值当成 b 的值，整个状态就乱了。

解决方式是始终调用所有 hook，把条件逻辑放在 hook 之后。比如你需要条件性地使用某个 state，那 useState 照常写，在使用的时候再判断条件。`,
  },
  {
    id: 5006,
    category: '技能考察',
    difficulty: 'medium',
    question: 'useCallback 和 useMemo 有什么区别？什么时候真正需要用？滥用会有什么问题？',
    answer: `区别：
- useMemo(fn, deps): 缓存函数的"返回值"（计算结果）
- useCallback(fn, deps): 缓存"函数本身"的引用

本质：useCallback(fn, deps) === useMemo(() => fn, deps)

什么时候真正需要用：

1. useMemo 使用场景：
   - 计算开销大的操作（大数组过滤/排序）
   - 避免子组件因引用类型 props 变化而重渲染

2. useCallback 使用场景：
   - 传给 React.memo 子组件的回调函数
   - 作为其他 Hook 的依赖项

什么时候不需要：
- 简单计算（a + b）-> 缓存的开销比重算还大
- 没传给子组件的函数 -> 缓存了也没意义
- 子组件没用 React.memo -> 缓存引用无意义

滥用的问题：
1. 内存开销：每个 useMemo/useCallback 都要保存闭包 + deps 数组
2. 代码复杂度：维护依赖数组、不必要的心智负担
3. 可能更慢：缓存对比 deps 的开销 > 直接重新计算
4. deps 遗漏：忘记更新依赖导致闭包陈旧 Bug

经验法则：先不加 -> 发现性能问题 -> Profile 定位 -> 针对性加。过早优化是万恶之源。`,
    oralAnswer: `useMemo 缓存的是函数的返回值，useCallback 缓存的是函数本身的引用。本质上 useCallback(fn, deps) 等价于 useMemo(() => fn, deps)。

什么时候真正需要用呢？useMemo 用于计算开销大的操作，比如大数组排序过滤。useCallback 用于传给 React.memo 子组件的回调函数，保持引用不变避免子组件重渲染。

滥用的问题是：每个 memo/callback 都要保存闭包和依赖数组有内存开销，对比 deps 也有计算开销。如果缓存的东西本身很简单，缓存的成本可能比重新计算还大。而且维护 deps 数组增加心智负担，忘记更新依赖还会导致闭包陈旧 Bug。

我的经验法则是先不加，发现性能问题后用 Profiler 定位瓶颈，然后针对性地加。过早优化是万恶之源。`,
  },
  {
    id: 5007,
    category: '技能考察',
    difficulty: 'hard',
    question: 'React 的 Fiber 架构是什么？它是如何实现时间切片和优先级调度的？',
    answer: `Fiber 架构核心概念：
Fiber 是 React 16 引入的新协调（Reconciliation）引擎。每个组件对应一个 Fiber 节点，组成 Fiber 树。

为什么需要 Fiber：
旧架构（Stack Reconciler）递归遍历组件树，一旦开始不能中断。如果组件树很大，JS 主线程会被长时间占用导致掉帧。

Fiber 的解决思路：
把一个大任务拆成多个小任务（unit of work），可以暂停、恢复、中止。

数据结构：
每个 Fiber 节点包含：
- type: 组件类型
- child / sibling / return: 链表结构（替代递归树）
- pendingProps / memoizedState: 输入输出
- lanes: 优先级标记
- alternate: 双缓冲（current <-> workInProgress）

时间切片（Time Slicing）：
function workLoop(deadline) {
    while (nextUnitOfWork && deadline.timeRemaining() > 5) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }
    if (nextUnitOfWork) {
        requestIdleCallback(workLoop); // 让出主线程
    } else {
        commitRoot(); // 一次性提交 DOM
    }
}
// 实际用 MessageChannel 而非 requestIdleCallback

优先级调度（Lanes 模型）：
- SyncLane: 同步优先级（用户输入、点击）
- InputContinuousLane: 连续输入（拖拽、滚动）
- DefaultLane: 普通更新（setState）
- TransitionLane: 过渡（useTransition）
- IdleLane: 空闲任务

两阶段：
1. Render 阶段（可中断）：遍历 Fiber 树，计算变更
2. Commit 阶段（不可中断）：一次性应用 DOM 变更`,
    oralAnswer: `Fiber 是 React 16 引入的新协调引擎。旧的 Stack Reconciler 递归遍历组件树，一旦开始就不能中断，如果组件树很大就会长时间占用主线程导致掉帧。Fiber 把一个大任务拆成很多小任务，每个小任务做完后检查有没有更高优先级的事情要做，有的话先让出主线程。

数据结构上，每个组件对应一个 Fiber 节点，通过 child、sibling、return 形成链表结构替代递归树，这样遍历可以随时暂停和恢复。还有双缓冲机制——current 树和 workInProgress 树交替使用。

时间切片的实现是：每次处理一个 Fiber 节点后检查剩余时间，时间用完就通过 MessageChannel 让出主线程，下一帧继续。优先级调度用 Lanes 模型，同步优先级最高比如用户点击，然后是连续输入、普通更新、Transition、空闲任务。

整个过程分两阶段：Render 阶段可中断，遍历 Fiber 树计算变更；Commit 阶段不可中断，一次性应用 DOM 变更保证用户不会看到中间状态。`,
  },

  // ============ 技能3: MRN / 多端适配 ============
  {
    id: 5008,
    category: '技能考察',
    difficulty: 'easy',
    question: 'MRN 和标准 React Native 的主要区别是什么？美团为什么要自研 MRN？',
    answer: `MRN（Meituan React Native）是美团基于 React Native 的自研跨端框架。

主要区别：

1. Bundle 管理：
   - RN 原生：单 Bundle（main.bundle）
   - MRN：多 Bundle 架构（Common Bundle + 业务 Bundle）

2. 容器化：
   - MRN 有容器管理（容器预创建、复用、回收）
   - 容器池化管理减少创建开销

3. 热更新：集成 PushY 热更新系统，支持差量更新和灰度发布

4. 性能优化：内置首屏监控、图片走内部 CDN + 裁剪、Bridge 优化

5. 工程化：统一脚手架、内部 npm 源、CI/CD 流水线

美团自研的原因：
1. 规模化需求：上百个 RN 页面需要统一管理
2. 性能要求：亿级流量页面需要极致优化
3. 发布效率：热更新避开 App Store 审核
4. 多团队协作：多仓架构支持几十个团队并行
5. 监控运维：完善的线上监控和问题排查体系`,
    oralAnswer: `MRN 是美团基于 React Native 自研的跨端框架。和标准 RN 比主要有几个区别。

第一是 Bundle 管理，标准 RN 是单 Bundle，MRN 是多 Bundle 架构——拆成 Common Bundle 加业务 Bundle，公共依赖只加载一次。第二是容器化，MRN 有容器池管理，预创建容器、复用、回收，减少创建开销。第三是热更新，集成了 PushY 支持差量更新和灰度发布。第四是性能优化，内置首屏监控、图片走内部 CDN 裁剪、Bridge 通信优化。第五是工程化，统一脚手架、内部 npm 源、CI/CD 流水线。

美团自研的原因是：上百个 RN 页面需要统一管理，亿级流量需要极致性能优化，热更新避开 App Store 审核提高发布效率，多仓架构支持几十个团队并行开发。`,
  },
  {
    id: 5009,
    category: '技能考察',
    difficulty: 'medium',
    question: 'MRN 多 Bundle 架构具体怎么运作？Common Bundle 和业务 Bundle 怎么拆分？加载时序是什么？',
    answer: `MRN 多 Bundle 架构：

拆分策略：
Common Bundle（公共包）：
- React / React Native 核心库
- 公共组件库（UI 组件、工具函数）
- 公共依赖（MobX、网络库等）
- 大小约 2-3MB，预加载到内存

业务 Bundle（页面包）：
- 具体页面的业务代码
- 页面级组件和 store
- 大小约 200-500KB，按需下载

加载时序：
1. App 启动时：预加载 Common Bundle + 预创建 MRN 容器
2. 用户点击进入页面：
   -> 分配预创建的容器
   -> 检查业务 Bundle 缓存
   -> 未缓存则从 CDN 下载并缓存
   -> 在容器中执行业务 Bundle
   -> 渲染页面

拆分原则：
- 公共依赖占比 > 50% 的库放 Common
- 频繁变动的业务代码放业务 Bundle
- Common 更新频率低（月级别）
- 业务 Bundle 更新频率高（天/周级别）

难点：
- Common 和业务 Bundle 版本兼容性
- 多业务 Bundle 间的通信机制
- lockfile 和 beta 版本管理`,
    oralAnswer: `MRN 的多 Bundle 架构是这样运作的。Common Bundle 包含 React、React Native 核心库、公共组件库、MobX 这些公共依赖，大约 2-3MB，App 启动时就预加载到内存。业务 Bundle 只包含具体页面的业务代码和页面级组件，大约 200-500KB，按需下载。

加载时序是：App 启动时预加载 Common Bundle 并预创建几个 MRN 容器。用户点击进入页面时，分配一个预创建好的容器，检查业务 Bundle 缓存，没有就从 CDN 下载并缓存，然后在容器里执行业务 Bundle 渲染页面。

拆分原则是公共依赖占比超过 50% 的库放 Common，频繁变动的业务代码放业务 Bundle。Common 更新频率低大约月级别，业务 Bundle 更新频率高天或周级别。

难点主要是 Common 和业务 Bundle 之间的版本兼容性，以及多个业务 Bundle 之间的通信机制。`,
  },
  {
    id: 5010,
    category: '技能考察',
    difficulty: 'hard',
    question: 'Android 和 iOS 在 RN 渲染上有哪些差异？你实际遇到过什么兼容性问题？',
    answer: `Android / iOS RN 渲染差异：

1. 文字渲染：
   - iOS Text 默认支持 numberOfLines + ellipsizeMode
   - Android 某些字体行高不同导致 numberOfLines 计算不准
   - 修复：显式设置 lineHeight

2. 阴影：
   - iOS 支持 shadowColor/shadowOffset/shadowRadius
   - Android 不支持 shadow*，只能用 elevation（底部阴影）
   - 修复：Platform.select 分别处理

3. 图片：
   - 圆角图片 Android 需要父容器 overflow:'hidden'
   - resizeMode 在部分 Android 机型表现不一致
   - 修复：封装统一 Image 组件

4. 状态栏：
   - iOS 状态栏是页面内容的一部分
   - Android 状态栏独立，需要 StatusBar.currentHeight
   - 修复：SafeAreaView + Platform 判断

5. 字体：
   - iOS fontWeight 支持 '100'-'900'
   - Android 只有 'normal' 和 'bold'
   - 修复：统一使用 'normal'/'bold'

实际项目案例：
- 详情页头图高斯模糊：iOS 用 blurRadius，Android 需要 Native 实现
- BottomBar 安全区域：iOS 底部有 home indicator
- TabCapsule 布局：Android 的 zIndex 表现不一致
- 图片裁剪：aspectFill 在部分 Android 机型异常

统一处理策略：
1. 封装跨平台组件（内部 Platform.select）
2. 设计 token 标准化
3. 双端联调 Checklist
4. 自动化截图对比`,
    oralAnswer: `Android 和 iOS 在 RN 渲染上差异挺多的。

文字渲染方面，iOS 的 numberOfLines 加 ellipsizeMode 表现正常，但 Android 某些字体行高不同会导致 numberOfLines 计算不准，需要显式设置 lineHeight。

阴影方面差异最大——iOS 支持 shadowColor/shadowOffset/shadowRadius 各种参数，Android 完全不支持这些属性，只有 elevation 而且只能做底部阴影。得用 Platform.select 分别处理。

图片方面，圆角图片在 Android 需要父容器加 overflow hidden，resizeMode 在部分 Android 机型表现也不一致。

我实际遇到过的兼容问题：详情页头图高斯模糊 iOS 用 blurRadius 就行，Android 需要走 Native 实现。BottomBar 的安全区域 iOS 底部有 home indicator 要适配。TabCapsule 布局里 zIndex 在 Android 表现不一致。

我们的统一处理策略是封装跨平台组件内部用 Platform.select，建立设计 token 标准化，双端联调 Checklist 确保每次都验证关键差异点。`,
  },

  // ============ 技能4: React 生态与工程体系 ============
  {
    id: 5011,
    category: '技能考察',
    difficulty: 'easy',
    question: 'Vite 和 Webpack 的核心区别是什么？Vite 为什么快？',
    answer: `核心区别：

Webpack：打包所有模块生成 bundle 再启动 dev server。修改文件需重新编译。启动慢（项目大时 10s+）。

Vite：不打包！利用浏览器原生 ES Module。启动时只处理入口文件，按需编译。启动秒级，HMR 毫秒级。

Vite 为什么快：

1. 开发模式免打包：
   浏览器请求 import './A.js' -> Vite 拦截并即时编译返回
   只编译当前页面用到的模块

2. 依赖预构建（esbuild）：
   第三方依赖用 esbuild（Go 编写）打包，比 webpack 快 10-100 倍
   预构建结果缓存

3. HMR 精准更新：
   基于 ES Module 的 import 关系图
   修改一个文件只让该模块失效

4. 生产打包用 Rollup：
   Tree-shaking 更彻底，代码分割更灵活

使用场景：
- 新项目/中小型项目：直接选 Vite
- 大型遗留项目：Webpack 生态更成熟
- RN 项目：用 Metro（不适用 Vite/Webpack）

建盛材 PC 管理后台选 Vite 原因：页面多、Webpack 启动慢、配合 React Soybean Admin 模板`,
    oralAnswer: `Vite 和 Webpack 的核心区别在于开发模式的处理方式。Webpack 是先打包所有模块生成 bundle 再启动 dev server，项目大时启动可能 10 秒以上。Vite 不打包，利用浏览器原生 ES Module，启动时只处理入口文件，其他模块按需编译，启动秒级，HMR 毫秒级。

Vite 快的原因有几个。一是开发模式免打包，浏览器请求哪个模块就即时编译哪个。二是依赖预构建用 esbuild，它用 Go 写比 Webpack 快 10-100 倍。三是 HMR 基于 ES Module 的 import 关系图，修改一个文件只让该模块失效。生产打包用 Rollup，tree-shaking 更彻底。

建盛材项目的 PC 管理后台选了 Vite，因为页面多用 Webpack 启动很慢。但 MRN 项目用 Metro 打包器，不适用 Vite/Webpack。`,
  },
  {
    id: 5012,
    category: '技能考察',
    difficulty: 'medium',
    question: 'MobX 和 Zustand 各自的设计理念是什么？在同一个项目中你怎么选？',
    answer: `设计理念对比：

MobX：
- 响应式编程（Reactive）
- 可变数据 + 自动追踪依赖
- class-based（面向对象风格）
- 类似 Vue 的响应式原理

Zustand：
- 不可变数据 + 手动订阅
- 函数式风格（无 class、无 decorator）
- 极简 API（一个 create 函数搞定）
- 类似 Redux 的简化版

代码对比：
// MobX
class TodoStore {
    @observable todos = [];
    @computed get unfinished() { return this.todos.filter(t => !t.done); }
    @action addTodo(text) { this.todos.push({ text, done: false }); }
}

// Zustand
const useTodoStore = create((set, get) => ({
    todos: [],
    addTodo: (text) => set(state => ({
      todos: [...state.todos, { text, done: false }]
    })),
}));

选择依据：
选 MobX：状态逻辑复杂、多 store 互引用、需要 computed 自动派生、美团 MRN 项目
选 Zustand：状态简单、追求轻量（1KB）、函数式团队、新项目

建盛材项目中：PC 后台用 MobX（状态多），简单独立页面用 Zustand（轻量）`,
    oralAnswer: `MobX 和 Zustand 的设计理念完全不同。MobX 是响应式编程，可变数据加自动追踪依赖，面向对象风格用 class 和 decorator，类似 Vue 的响应式原理。Zustand 是不可变数据加手动订阅，函数式风格极简 API，类似 Redux 的简化版。

选择依据是这样的。选 MobX：状态逻辑复杂、多 store 互引用、需要 computed 自动派生、美团 MRN 项目已经在用。选 Zustand：状态简单、追求轻量只有 1KB、函数式团队偏好、新项目。

在建盛材项目里，PC 后台用 MobX 因为状态多而且各模块间有联动。简单独立页面用 Zustand 因为轻量快速。`,
  },
  {
    id: 5013,
    category: '技能考察',
    difficulty: 'medium',
    question: 'aHooks 和自定义 Hook 相比有什么优势？说几个你在项目中用过的 aHooks？',
    answer: `aHooks 的优势：

1. 质量保证：阿里团队维护，经过大量生产验证，完善的 TS 类型和单测
2. 边界情况处理：组件卸载时自动清理、竞态条件处理、SSR 兼容
3. 减少重复造轮子：常见场景都有现成实现，API 设计统一

项目中用过的 aHooks：

1. useRequest（最常用）：
const { data, loading, run } = useRequest(fetchOrderList, {
    debounceWait: 300,
    refreshDeps: [status, page],
});
// 自带 loading、缓存、防抖、轮询、竞态取消

2. useDebounce / useThrottle：
const debouncedSearch = useDebounce(searchText, { wait: 500 });
// 搜索框输入优化

3. useInViewport（曝光埋点）：
const [inViewport] = useInViewport(ref);
useEffect(() => { if (inViewport) reportExposure(); }, [inViewport]);

4. useLocalStorageState：
const [settings, setSettings] = useLocalStorageState('user-settings', { defaultValue: { theme: 'light' } });

5. usePrevious：对比前后值做动画

vs 自定义 Hook：
- 通用逻辑优先用 aHooks（质量好、边界全）
- 业务逻辑用自定义 Hook（贴合业务需求）`,
    oralAnswer: `aHooks 相比自己写 Hook 的优势主要是质量保证、边界情况处理完善、减少重复造轮子。阿里团队维护的，经过大量生产验证，TS 类型完善、单测覆盖全。比如组件卸载时自动清理、竞态条件处理这些自己写很容易漏。

我在项目里用得最多的是 useRequest，自带 loading 状态、缓存、防抖、轮询、竞态取消，一个 hook 搞定数据请求的所有场景。还用过 useDebounce 做搜索框输入优化、useInViewport 做曝光埋点、useLocalStorageState 做用户设置持久化、usePrevious 对比前后值做动画。

我的原则是通用逻辑优先用 aHooks，质量好边界全。业务逻辑用自定义 Hook，贴合具体业务需求。`,
  },

  // ============ 技能5: Server Driven UI ============
  {
    id: 5014,
    category: '技能考察',
    difficulty: 'medium',
    question: 'Server Driven UI 中，如果新增一个模块类型，前端未发版不支持这个 moduleKey，怎么兼容？',
    answer: `moduleKey 未注册的兼容策略：

1. 前端注册表设计：
const moduleRegistry = { 'header': HeaderModule, 'price': PriceModule, ... };

function renderModule(moduleKey, data) {
  const Component = moduleRegistry[moduleKey];
  if (!Component) {
    return <FallbackModule data={data} />; // 或返回 null
  }
  return <Component data={data} />;
}

2. 兼容策略选择：

方案A - 静默忽略：未知 moduleKey 直接跳过不渲染
方案B - 通用 Fallback：根据 data 结构自动渲染基础内容
方案C - WebView 降级：未知模块用 WebView 加载 H5 版本

3. 实际做法（美团）：
- 默认静默忽略（保证不白屏）
- 重要模块：服务端判断客户端版本，低版本不下发
- 配合热更新：新 moduleKey 随 Bundle 一起推送

4. 版本协商机制：
请求 BFF 时携带支持的模块列表：
headers: { 'X-Supported-Modules': 'header,price,sku,...', 'X-App-Version': '12.0.0' }
BFF 根据支持列表过滤 layout`,
    oralAnswer: `这是 SDUI 必须考虑的兼容性问题。如果后端新增了一个 moduleKey，但前端还没发版不认识这个 key，怎么办。

前端的注册表设计是根据 moduleKey 查找对应组件，找不到的话有几种策略。方案 A 是静默忽略直接跳过不渲染。方案 B 是用通用 Fallback 组件根据数据结构自动渲染基础内容。方案 C 是 WebView 降级，未知模块用 WebView 加载 H5 版本。

美团实际做法是默认静默忽略保证不白屏。重要模块的话，服务端会判断客户端版本，低版本不下发这个模块。另外配合热更新，新 moduleKey 可以随 Bundle 一起推送。还有版本协商机制，请求 BFF 时携带当前支持的模块列表，BFF 根据这个列表过滤 layout。`,
  },
  {
    id: 5015,
    category: '技能考察',
    difficulty: 'hard',
    question: '如果让你设计 moduleKey + layout.data + response[moduleKey] 这套协议，你会怎么处理模块间的数据依赖？',
    answer: `模块间数据依赖的协议设计：

问题本质：模块各自独立渲染（解耦），但业务上存在联动（SKU选择后价格/时间/库存要变）。

方案一 - 事件驱动：
{
  "events": {
    "sku_selected": {
      "source": "sku",
      "targets": ["price", "time", "bottomBar"],
      "payload": { "skuId": "string" }
    }
  }
}

方案二 - 共享 Store（美团实际方案）：
class SharedStore {
  @observable selectedSkuId = '';
  @observable selectedCount = 1;
}
// 各模块 observe 共享状态
class PriceStore {
  @computed get currentPrice() {
    return this.calculatePrice(sharedStore.selectedSkuId);
  }
}

方案三 - 服务端联动：
{
  "interactions": {
    "sku_change": {
      "api": "/api/sku/change",
      "params": ["skuId"],
      "refresh_modules": ["price", "time", "stock"]
    }
  }
}

对比：
- 事件驱动：灵活但可能事件风暴
- 共享 Store：性能好但耦合了 Store 结构
- 服务端联动：最解耦但有网络延迟

美团的选择：共享 Store + 部分服务端联动
- 高频操作（SKU切换）用 Store 同步
- 低频操作（换套餐）走服务端刷新`,
    oralAnswer: `模块间数据依赖是 SDUI 设计中最核心的难题。问题是模块各自独立渲染很解耦，但业务上有联动需求——比如 SKU 选择后价格、时间、库存都要变。

有三种方案。事件驱动：定义事件的 source、targets、payload，模块通过发布订阅联动。共享 Store：定义一个 SharedStore 存放跨模块共享状态，各模块 observe 这些状态，状态变了自动派生更新。服务端联动：定义交互触发时调哪个 API，返回后刷新哪些模块。

美团的选择是共享 Store 加部分服务端联动。高频操作比如 SKU 切换用 SharedStore 同步，性能好没有网络延迟。低频操作比如换套餐走服务端刷新，最解耦但有网络延迟。`,
  },

  // ============ 技能6: BFF + 多仓协作 ============
  {
    id: 5016,
    category: '技能考察',
    difficulty: 'easy',
    question: 'BFF（Backend For Frontend）是什么？它解决了什么问题？',
    answer: `BFF 概念和价值：

定义：BFF 是专门为前端服务的后端中间层，位于前端和微服务之间。

解决的问题：

1. 接口聚合：
   没有 BFF：前端一个页面调 5-10 个微服务接口
   有 BFF：前端只调一个 BFF 接口，内部聚合多个服务

2. 数据裁剪：后端返回数据往往比前端需要的多，BFF 只返回需要的字段

3. 协议适配：不同端（App/H5/小程序）需要不同的数据格式，BFF 为每个端定制

4. 逻辑编排：页面展示逻辑（显隐、排序、AB 实验）放在 BFF，前端只负责渲染

前端需要 BFF 的原因：
- 减少请求次数（性能）
- 简化前端逻辑（可维护性）
- 支持 SDUI 动态编排（灵活性）
- 隔离后端变更（稳定性）`,
    oralAnswer: `BFF 就是 Backend For Frontend，专门为前端设计的后端中间层。

它解决的核心问题有四个。第一是接口聚合，没有 BFF 的话一个页面可能要调 5-10 个微服务接口，有了 BFF 前端只调一个接口内部聚合。第二是数据裁剪，后端返回的数据往往比前端需要的多，BFF 只返回需要的字段。第三是协议适配，不同端需要不同数据格式，BFF 为每个端定制。第四是逻辑编排，页面展示逻辑、AB 实验放在 BFF，前端只负责渲染。

对前端来说，BFF 的价值是减少请求次数提升性能、简化前端逻辑提升可维护性、支持 SDUI 动态编排提升灵活性、隔离后端变更提升稳定性。`,
  },
  {
    id: 5017,
    category: '技能考察',
    difficulty: 'medium',
    question: '你们的多仓架构（模块仓、公共能力仓、页面装配仓）各自的职责是什么？为什么不用 Monorepo？',
    answer: `三仓架构职责划分：

模块仓（Module Repo）：
- 存放各业务模块代码（header/price/sku/bottomBar...）
- 每个模块独立开发、测试、发版
- 发布为 npm 包供装配仓使用
- 职责：业务逻辑 + UI 渲染

公共能力仓（Common Repo）：
- 跨模块公共工具和基础能力
- 网络请求、埋点SDK、工具函数、基础组件、类型定义
- 被模块仓和装配仓共同依赖
- 职责：基础设施 + 公共逻辑

页面装配仓（Assembly Repo）：
- 组装各模块构成完整页面
- 管理模块注册、路由、容器化渲染、SharedStore
- 负责打包发布最终 Bundle
- 职责：组装 + 配置 + 发布

为什么不用 Monorepo？
1. 团队规模：20+ 人开发，Monorepo CI 太慢（30min vs 2min）
2. 发版独立：模块 A 紧急修复只发 A 版本
3. 权限隔离：不同组负责不同模块
4. 历史包袱：美团已有成熟多仓工具链

多仓的代价：联调麻烦、全局重构困难、版本对齐成本高`,
    oralAnswer: `三仓架构的职责划分很清晰。模块仓存各业务模块代码，每个模块独立开发测试发版，发布为 npm 包。公共能力仓存跨模块共享的网络请求、埋点 SDK、工具函数、基础组件和类型定义。装配仓负责组装各模块构成完整页面，管理模块注册、路由、SharedStore，最终打包发布 Bundle。

为什么不用 Monorepo？主要是团队规模大，20 多人开发，Monorepo CI 太慢可能 30 分钟而我们多仓只要 2 分钟。另外单模块紧急修复只发那一个包的版本，权限也能隔离。而且美团已有成熟的多仓工具链。

当然多仓也有代价：联调麻烦需要 npm link，全局重构困难，版本对齐成本高。`,
  },

  // ============ 技能7: 首屏性能优化 ============
  {
    id: 5018,
    category: '技能考察',
    difficulty: 'easy',
    question: '什么是首屏时间（FMP）？RN 中如何准确测量首屏时间？',
    answer: `首屏时间定义和测量：

定义：用户从点击/跳转开始，到看到页面有意义内容所经过的时间。对详情页来说，"有意义"指头图 + 标题 + 价格渲染完成。

RN 中首屏时间分段：
T_total = T_container + T_bundle + T_init + T_network + T_render

- T_container：Native 容器创建
- T_bundle：加载 JS Bundle
- T_init：JS 引擎初始化 + React 首次执行
- T_network：BFF 数据请求
- T_render：React 渲染 + Native Layout + 绘制

测量方式：
1. 起点（Native 侧）：Activity/ViewController 创建时记录时间戳
2. 终点（JS 侧）：首屏关键模块 onLayout 回调时记录

<View onLayout={() => {
  const endTime = performance.now();
  reportMetric('fmp', endTime - NativeModule.getStartTime());
}}>
  <HeaderModule />
  <PriceModule />
</View>

3. 各阶段都打点上报，按 P50/P90/P99 统计`,
    oralAnswer: `首屏时间就是用户从点击开始到看到有意义内容的时间。对详情页来说"有意义"就是头图加标题加价格渲染完成。

RN 里首屏时间拆成几段：容器创建、Bundle 加载、JS 初始化、网络请求、React 渲染。测量方式是：起点在 Native 侧记录容器创建时间戳，终点在首屏关键模块的 onLayout 回调中记录。两者相减就是首屏时间。

各阶段都打点上报，按 P50/P90/P99 统计，还会按设备等级分组看，这样能精确知道哪个环节是瓶颈。`,
  },
  {
    id: 5019,
    category: '技能考察',
    difficulty: 'hard',
    question: 'MRNBox 静态首屏快照的具体实现原理是什么？快照数据存在哪里？如何保证有效性？',
    answer: `MRNBox 首屏快照实现原理：

核心思路：用户第一次访问时缓存 BFF 首屏数据，下次进入先用缓存渲染（秒开），再请求最新数据覆盖。

实现流程：
1. 首次访问（建立缓存）：
   用户点击 -> 加载Bundle -> 请求BFF -> 渲染 -> 存储到 firstScreenBffCache

2. 再次访问（使用缓存）：
   用户点击 -> 读取缓存 -> 立即渲染（200ms内）
   同时请求BFF -> 数据到达后覆盖更新

存储位置：
- iOS: NSUserDefaults / 文件沙盒
- Android: SharedPreferences / 文件存储
- 以商品维度存储，LRU 策略最多存 50 条

缓存数据结构：
{
  cacheKey: "spuId_123_cityId_1",
  timestamp: 1700000000,
  version: "2.1",
  layout: [...],   // 首屏模块的 layout
  response: { header: {...}, price: {...}, sku: {...} }
}

有效性保证：
1. TTL 过期：缓存超过 24h 不使用
2. 版本号校验：BFF 协议版本变化时失效
3. 关键字段变更：商品下架时失效
4. 主动失效：换城市、登录态变化时清空
5. 容量控制：LRU 淘汰最久未访问的缓存

快照只缓存首屏可见模块（header/price/sku/bottomBar），非首屏模块等实时请求。`,
    oralAnswer: `MRNBox 快照的实现原理是：用户第一次访问时缓存 BFF 首屏数据，下次进入先用缓存秒开，同时请求最新数据覆盖。

存储位置在 iOS 是 NSUserDefaults 或文件沙盒，Android 是 SharedPreferences 或文件存储。以商品维度存储，LRU 策略最多存 50 条。缓存 key 包含 spuId 和 cityId，避免串数据。

有效性保证做了几层：TTL 过期 24 小时不使用；BFF 协议版本变化时失效；商品下架时失效；换城市、登录态变化时主动清空；LRU 淘汰最久未访问的。

快照只缓存首屏可见模块——头图、价格、SKU、BottomBar，非首屏模块不参与避免缓存膨胀。`,
  },

  // ============ 技能8: 交易链路稳定性 ============
  {
    id: 5020,
    category: '技能考察',
    difficulty: 'medium',
    question: '交易链路中，字段缺失导致 JS Error 怎么防御？你会怎么系统性解决？',
    answer: `字段缺失防御方案：

问题场景：
const price = data.priceInfo.salePrice;
// TypeError: Cannot read property 'salePrice' of null

防御层级：

1. TypeScript 类型守卫（编译期）：
interface PriceData { priceInfo?: { salePrice?: number } }

2. 可选链 + 空值合并（运行时）：
const price = data?.priceInfo?.salePrice ?? 0;

3. 数据校验层（统一入口）：
function safeModuleData(data, schema) {
  const result = schema.safeParse(data);
  if (!result.success) {
    reportError('data_validation_failed');
    return schema.getDefault();
  }
  return result.data;
}

4. 模块级 ErrorBoundary：
<ErrorBoundary fallback={<Placeholder />}>
  <PriceModule data={priceData} />
</ErrorBoundary>

5. BFF 侧防御：必填字段缺失时返回默认值

系统性治理：
1. 存量扫描：脚本扫描所有深层属性访问
2. 统一规范：ESLint 规则强制可选链
3. 监控：JS Error 中 TypeError 占比趋势
4. 兜底：每个模块有 loading/error/empty 三态`,
    oralAnswer: `字段缺失导致 JS Error 是 RN 项目里最常见的问题。典型场景就是 data.priceInfo.salePrice，结果 priceInfo 是 null 或 undefined。

系统性解决分几层。编译期用 TypeScript 类型守卫，把可能缺失的字段标为可选。运行时用可选链加空值合并，data?.priceInfo?.salePrice ?? 0。数据层做统一校验，定义 Schema，不符合的填充默认值并上报。渲染层用模块级 ErrorBoundary，单模块报错展示占位符不影响其他模块。BFF 侧也做防御，必填字段缺失时返回默认值。

治理层面：存量代码用脚本扫描所有深层属性访问，ESLint 规则强制可选链，监控 TypeError 占比趋势，每个模块都有 loading/error/empty 三态处理。`,
  },
  {
    id: 5021,
    category: '技能考察',
    difficulty: 'hard',
    question: '首屏视觉跳变是什么问题？产生的原因和解决方案？',
    answer: `首屏视觉跳变问题：

现象：用户进入页面后，界面已渲染但突然某些元素位置/大小/内容明显变化（"跳一下"）。

原因分析：
1. 缓存数据到真实数据切换：缓存价格69 -> 真实价格79
2. 图片加载后撑开高度：图片未加载高度为0，加载后下方内容下移
3. 动态数据导致布局变化：SKU标签数量不同导致高度变化
4. 异步模块渲染：后续模块数据到达后插入中间位置

解决方案：

1. 固定占位：
// 图片区域预设固定高度
<View style={{ height: IMAGE_HEIGHT }}>
  <Image onLoad={() => setLoaded(true)} />
</View>

2. 缓存数据平滑过渡：
if (cachedPrice !== realPrice) {
  animateNumberChange(cachedPrice, realPrice);
}

3. 模块优先级渲染：
首屏模块按固定顺序渲染，不允许后到的模块插入已渲染模块之间
等所有 P0 模块数据就绪后一次性渲染

4. 内容预留空间：
layout 配置中预知模块高度：{ moduleKey: 'header', config: { estimatedHeight: 300 } }

5. 视觉一致性检查：
缓存 vs 真实数据 diff，差异小则静默更新，差异大则先清空再渲染`,
    oralAnswer: `首屏视觉跳变就是用户进入页面后界面已经渲染了，但突然某些元素的位置、大小或内容明显变化，"跳一下"的感觉。

产生原因主要有几个。缓存数据和真实数据不一致，比如缓存的价格是 69 实际是 79。图片加载后撑开高度，图片没加载时高度为 0 加载后下面内容下移。动态数据导致布局变化，比如 SKU 标签数量不同导致高度变化。异步模块数据到达后插入中间位置。

解决方案：图片区域预设固定高度做占位。缓存数据到真实数据的切换做数字动画过渡而不是直接跳变。模块按固定顺序渲染不允许后到的模块插入已渲染模块之间。layout 配置中预知模块高度做空间预留。缓存和真实数据做 diff，差异小就静默更新，差异大就先清空再渲染避免中间状态。`,
  },

  // ============ 技能9: AI Coding 工程化 ============
  {
    id: 5022,
    category: '技能考察',
    difficulty: 'easy',
    question: '你在项目中用的 AGENTS + rules + knowledge 分层体系是什么？各层存什么？',
    answer: `AI Coding 分层上下文体系：

背景：让 AI 理解复杂多仓项目需要结构化上下文，直接丢所有代码低效。

分层设计：

1. AGENTS（角色定义层）：
   - 定义 AI 的角色和行为模式
   - "你是美团详情页开发助手，熟悉 SDUI + MRN 架构"
   - 包含：能力边界、输出格式、协作规范

2. rules（规则层）：
   - 编码规范和约束条件
   - "Skyline 不支持 position: fixed"
   - "模块必须有 ErrorBoundary 包裹"
   - 特点：强制性、可验证

3. knowledge（知识层）：
   - 项目架构文档、API 文档、技术决策记录
   - 模块注册流程、BFF 接口协议、各端差异对照表
   - 特点：参考性、非强制

4. OpenSpec（开放规格层）：
   - moduleKey 完整列表及其 Props 定义
   - Store 字段说明、埋点协议

5. .aicx（上下文配置）：
   - 声明哪些文件纳入 AI 上下文
   - 控制可见范围，避免无关代码干扰

价值：AI 生成代码自动符合规范，减少 review 修改次数`,
    oralAnswer: `这套分层体系的目的是让 AI 理解复杂多仓项目。直接丢所有代码给 AI 太低效了，需要结构化的上下文。

AGENTS 是角色定义层，告诉 AI 它是谁、能做什么。rules 是规则层，放编码规范和约束条件，比如"Skyline 不支持 position fixed""模块必须有 ErrorBoundary 包裹"，这些是强制性可验证的。knowledge 是知识层，放项目架构文档、API 文档、各端差异对照表，是参考性非强制的。OpenSpec 是接口规格层，定义 moduleKey 完整列表及其 Props。.aicx 是配置文件，声明哪些文件纳入 AI 上下文。

价值就是 AI 生成的代码自动符合项目规范，减少 review 来回修改的次数。`,
  },
  {
    id: 5023,
    category: '技能考察',
    difficulty: 'hard',
    question: 'AI 在多仓项目中做影响面分析具体怎么实现？准确率如何？有哪些局限？',
    answer: `AI 影响面分析实现：

场景：修改模块 A 的某个接口/行为，需知道哪些模块受影响。

实现方式：
1. 提供上下文：模块依赖图、事件订阅关系、SharedStore 使用关系、import 链
2. AI 分析流程：
   输入："修改 sku 模块的 selectedSkuId 数据结构"
   -> 查找 selectedSkuId 在 SharedStore 中的定义
   -> 搜索所有 observe selectedSkuId 的模块
   -> 分析下游 computed 依赖链
   -> 输出影响面报告

输出示例：
- 直接影响：price 模块（读取 skuId 计算价格）
- 直接影响：bottomBar 模块（展示选中 SKU 信息）
- 直接影响：time 模块（根据 SKU 展示可约时间）
- 间接影响：track 模块（埋点包含 skuId）

准确率：
- 直接依赖（import/Store读取）：> 95%
- 间接依赖（事件链路）：约 80%
- 隐式依赖（动态方式）：约 50%

局限性：
1. 动态依赖难追踪：moduleRegistry[key] 动态注册
2. 跨仓分析需要全量代码上下文
3. 运行时行为（条件分支中的依赖）难以静态分析
4. 需要持续维护 knowledge 文档准确性

改进方向：结合 AST 分析、建立自动更新的依赖图、引入测试覆盖率辅助`,
    oralAnswer: `AI 影响面分析的实现方式是：给 AI 提供模块依赖图、事件订阅关系、SharedStore 使用关系和 import 链这些上下文，然后让它分析某个修改会影响哪些模块。

比如输入是"修改 sku 模块的 selectedSkuId 数据结构"，AI 会查找 selectedSkuId 在 SharedStore 中的定义，搜索所有 observe 这个字段的模块，分析下游 computed 依赖链，最终输出影响面报告——直接影响 price、bottomBar、time 模块，间接影响 track 埋点模块。

准确率方面，直接依赖比如 import 和 Store 读取超过 95%。间接依赖比如事件链路约 80%。隐式依赖比如动态注册方式约 50%。

局限性主要是动态依赖难追踪、跨仓分析需要全量代码上下文、运行时行为难静态分析、knowledge 文档需要持续维护准确性。改进方向是结合 AST 分析建立自动更新的依赖图。`,
  },

  // ============ 技能10: Git Flow + 热更新 ============
  {
    id: 5024,
    category: '技能考察',
    difficulty: 'easy',
    question: 'RN 热更新（PushY/CodePush）原理是什么？为什么 RN 可以热更新而原生不行？',
    answer: `热更新原理：

为什么 RN 可以热更新：
- RN 业务逻辑在 JS Bundle 中
- JS 是解释执行的（运行时加载）
- 只需替换 JS Bundle 文件，下次启动加载新 Bundle
- 原生代码是编译后的二进制，替换需要重新安装

热更新流程：
1. 开发者打包新 Bundle 上传到热更新服务器
2. App 启动时检查是否有新版本
3. 有新版本则后台下载新 Bundle
4. 下次启动加载新 Bundle

PushY（美团内部）工作流：
开发者端：npm run bundle -> pushy publish -> 设置灰度比例
App 端：checkUpdate() -> downloadBundle() -> 存储本地 -> 下次启动加载

vs CodePush（微软）：原理相同，但 CodePush 用微软云国内访问慢

限制：
- 只能更新 JS 代码和资源文件
- 不能更新 Native 模块
- Apple 政策不允许改变 App 主要功能`,
    oralAnswer: `RN 能热更新的根本原因是它的业务逻辑在 JS Bundle 里，JS 是解释执行的，运行时加载。所以只需要替换 JS Bundle 文件，下次启动加载新 Bundle 就行了。原生代码是编译后的二进制文件，替换需要重新安装，所以不能热更新。

热更新流程是：开发者打包新 Bundle 上传到服务器，App 启动时检查是否有新版本，有的话后台下载新 Bundle，下次启动加载新 Bundle 生效。

PushY 是国内方案用国内 CDN 快，CodePush 是微软的用国外服务器国内慢而且已经停维了。原理相同，都是下载替换 Bundle。

限制是只能更新 JS 代码和资源文件，不能更新 Native 模块，Apple 政策也不允许通过热更新改变 App 的主要功能。`,
  },
  {
    id: 5025,
    category: '技能考察',
    difficulty: 'medium',
    question: '如果热更新推送了有 Bug 的 Bundle，用户已经下载了，怎么处理？',
    answer: `热更新事故处理：

紧急止血（5分钟内）：
1. 暂停推送：PushY 后台暂停当前版本推送
2. 强制回滚：标记版本为废弃，设置回滚目标
   已下载用户下次启动检查更新 -> 发现回滚指令 -> 删除问题包 -> 加载上一版本
3. 严重 Bug 时的保护：
   function loadBundle() {
     try { loadNewBundle(); }
     catch (e) { loadBuiltInBundle(); reportRollback(); }
   }

预防机制：
1. 启动检测：启动后 5 秒内 crash 自动标记 Bundle 不可用
2. 灰度发布：5% -> 观察 -> 20% -> 50% -> 100%
3. 签名校验：Bundle 有数字签名防篡改
4. 最小可用版本：服务端配置，低于此版本强制更新
5. 自动暂停：Error 率突增 3 倍时自动暂停推送`,
    oralAnswer: `如果推了有 Bug 的 Bundle 用户已经下载了，处理分两步。

紧急止血 5 分钟内要完成：第一步暂停推送，PushY 后台暂停当前版本。第二步强制回滚，标记版本为废弃并设置回滚目标。已下载用户下次启动检查更新会发现回滚指令，删除问题包加载上一版本。严重 Bug 的话还有兜底保护——如果新 Bundle 加载失败就自动回退到内置 Bundle。

预防机制方面：启动后 5 秒内 crash 自动标记 Bundle 不可用。灰度发布 5% 到 20% 到 50% 到 100% 逐步放量。Bundle 有数字签名防篡改。服务端配置最小可用版本。Error 率突增 3 倍自动暂停推送。`,
  },
  {
    id: 5026,
    category: '技能考察',
    difficulty: 'hard',
    question: '你们的多环境发布流程是怎样的？从开发到上线经过几个环境？',
    answer: `多环境发布流程：

环境划分（4层）：
1. DEV：开发者本地 + 开发服务器，连接 mock/测试 BFF
2. QA/TEST：独立测试集群，QA 功能/回归测试
3. STAGING/预发：和生产配置一致，真实数据验证
4. PROD：生产环境，灰度 -> 全量

发布流程：
DEV（feature 分支开发）
  -> MR + Code Review
QA（合入 develop，部署测试环境）
  -> QA 测试通过
STAGING（合入 release，预发验证）
  -> 验收通过
PROD（合入 main，灰度全量）

RN 热更新特殊流程：
1. 本地打包 Bundle
2. 上传 PushY（指定环境）
3. 测试/预发环境验证
4. 灰度推送线上用户

分支策略（Git Flow）：
- main：生产代码
- develop：开发主分支
- feature/*：功能分支
- release/*：发布分支
- hotfix/*：紧急修复

多仓协调：模块仓发 npm -> 装配仓升级版本 -> QA 验证 -> 出 Bundle 推送`,
    oralAnswer: `我们发布流程是 4 层环境：DEV、QA、STAGING 预发、PROD 生产。

代码流转路径是这样：feature 分支开发完提 MR 做 Code Review，合入 develop 部署到测试环境让 QA 验证，测试通过合入 release 分支部署预发，预发用真实数据验证没问题后合入 main 灰度上线。

RN 热更新有自己的流程，和原生发版不一样：本地打包 Bundle，上传 PushY 指定环境，先在测试和预发验证，最后灰度推送线上用户。

分支策略用的 Git Flow：main 是生产代码，develop 是开发主分支，feature 分支做功能，release 分支做发布，hotfix 做紧急修复。

多仓协调比较特殊：模块仓先发 npm 包，装配仓升级对应版本，QA 在装配仓验证，最后出 Bundle 推送。整个流程 CI/CD 串起来，每个环节都有自动化卡点。`,
  },

  // ============ 综合深度题 ============
  {
    id: 5027,
    category: '技能考察',
    difficulty: 'hard',
    question: '面试官说"你简历写了熟悉 XX，请深入讲讲底层实现"，你怎么准备？以 MobX 为例。',
    answer: `应对"深入底层"类问题的方法论：

对简历上每个"熟悉"的技术，准备三层深度：
- 会用（API层）：90% 的人能答
- 理解原理（机制层）：50% 的人能答
- 源码/设计思想（底层）：10% 的人能答

以 MobX 为例：

第一层（会用）：
observable 定义状态，action 修改，computed 派生，observer 自动响应

第二层（原理）：
MobX 核心是响应式：
- observable 用 Proxy 拦截属性访问
- observer 组件渲染时自动收集依赖（读取了哪些 observable）
- observable 变化时通知所有依赖它的 observer 重渲染

依赖收集过程：
1. observer 组件开始渲染
2. 设置全局 derivation = 当前组件
3. 渲染中读取 store.price -> Proxy get 拦截
4. 记录 {store.price -> 当前组件}
5. 渲染结束清除 derivation

第三层（源码/设计）：
核心数据结构：
- ObservableValue：存储值 + 观察者列表
- Derivation：observer/computed，持有依赖列表
- Reaction：连接 observable 和 side effect
- Transaction：批量更新避免中间态触发渲染

面试回答技巧：
1. 先说结论和核心机制
2. 展开关键实现细节
3. 对比其他方案（体现广度）
4. 不确定的诚实说"源码层面我了解到这里"`,
    oralAnswer: `遇到"深入讲讲底层实现"这类问题，我的准备方法是对简历上每个"熟悉"的技术准备三层深度。

第一层是 API 层，就是会用，90% 的人能答到。第二层是原理机制层，50% 的人能答。第三层是源码和设计思想层，10% 的人能答。面试的区分度就在第二三层。

拿 MobX 举例。第一层就是 observable 定义状态、action 修改、computed 派生、observer 自动响应，这些基础用法。

第二层我会讲响应式原理：observable 底层用 Proxy 拦截属性访问，observer 组件渲染时自动收集依赖——就是记录你读取了哪些 observable 属性。变化时通知所有依赖它的 observer 重渲染。依赖收集过程是：组件开始渲染时设置全局 derivation，渲染中读取属性被 Proxy get 拦截，记录依赖关系，渲染结束清除。

第三层是核心数据结构：ObservableValue 存值加观察者列表，Derivation 持有依赖列表，Reaction 连接 observable 和副作用，Transaction 批量更新避免中间态触发渲染。

回答技巧是先说结论，再展开细节，然后对比其他方案体现广度，不确定的就诚实说"源码层面我了解到这里"。`,
  },
  {
    id: 5028,
    category: '技能考察',
    difficulty: 'hard',
    question: '你简历技能涵盖面很广（RN/小程序/Harmony/AI），面试官质疑"广而不精"，你怎么应对？',
    answer: `应对"广而不精"质疑：

面试官的担心：3年经验写这么多技术，是不是都只是"用过"？

应对策略：

1. 明确主线（核心竞争力）：
"我的核心是 React Native 跨端开发和性能优化。其他技术（小程序/Harmony/AI）都是围绕这条主线展开的。小程序是详情页多端落地，AI 是提升开发效率的工具。"

2. 深度证明（用数据和细节）：
- RN 性能：首屏从 800ms 优化到 200ms
- 稳定性：JS Error 率下降 X%，治理了 N 个场景
- 架构：SDUI 模块化体系支撑 20+ 模块并行开发

3. 广度的价值（不是劣势）：
"在美团详情页，一个需求涉及 MRN/小程序/H5 多端。只懂单端无法做统一化建设。我的广度是业务驱动的。"

4. 深度案例准备（至少2-3个）：
- MRNBox 快照的设计思路
- 首屏跳变问题的系统性治理
- AI Coding 工程化的落地效果

关键原则：
- 承认有主次
- 用案例证明深度
- 展示学习能力
- 诚实：不熟的说"了解/使用过"`,
    oralAnswer: `面对"广而不精"的质疑，我会从四个角度回应。

首先明确主线：我的核心是 React Native 跨端开发和性能优化，其他技术都围绕这条主线。小程序是详情页多端落地的需要，Harmony 是跟进鸿蒙生态，AI 是提升开发效率的工具探索。不是什么都想学，是业务驱动的。

然后用数据证明深度：RN 性能我把首屏从 800ms 优化到 200ms，稳定性方面 JS Error 率下降明显治理了多个场景，架构上 SDUI 模块化体系支撑 20 多个模块并行开发。这些不是"用过"能做到的。

第三点是广度的价值：在美团详情页一个需求可能同时涉及 MRN、小程序、H5 多端。只懂单端根本做不了统一化建设。我的广度不是兴趣驱动而是业务驱动。

最后准备 2 到 3 个深度案例随时展开讲：MRNBox 快照的设计思路、首屏跳变的系统性治理、AI Coding 工程化落地效果。关键原则就是承认有主次，用案例证明深度，展示学习能力，不熟的诚实说"了解过"。`,
  },
];
