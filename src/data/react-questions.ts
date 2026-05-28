import { Question } from './types';

export const reactQuestions: Question[] = [
  {
    id: 201,
    category: 'React',
    difficulty: 'easy',
    question: 'React 中 useState 和 useRef 有什么区别？',
    answer: `useState：触发重渲染，返回 [state, setState]，用于驱动 UI 更新。
useRef：不触发重渲染，返回 { current: value }，用于存储可变值。

useRef 常见用途：引用 DOM、保存定时器 ID、保存上一次 state、在 effect 中引用最新值。`,
    oralAnswer: `这两个 Hook 最核心的区别是：useState 更新会触发组件重渲染，useRef 更新不会。useState 返回一个状态值和 setter 函数，适合驱动 UI 更新的数据。useRef 返回一个 { current: value } 的对象，修改 current 不会触发渲染。

useRef 的常见用途包括：引用 DOM 节点，保存定时器 ID 方便清理，保存上一次的 state 值做对比，以及在 effect 和回调中引用最新值避免闭包陷阱。简单说，需要界面响应的用 useState，只是存值不需要渲染的用 useRef。`,
  },
  {
    id: 202,
    category: 'React',
    difficulty: 'medium',
    question: 'useEffect 和 useLayoutEffect 的区别？',
    answer: `useEffect：浏览器绘画后异步执行，不阻塞渲染。适合数据请求、订阅。

useLayoutEffect：DOM 变更后、绘画前同步执行，阻塞渲染。适合读取/修改 DOM 布局。

顺序：render → DOM 更新 → useLayoutEffect → 绘画 → useEffect

建议：优先 useEffect，出现闪烁时用 useLayoutEffect。`,
    oralAnswer: `这两个的区别主要在执行时机。useEffect 是在浏览器完成绘制之后异步执行，不会阻塞渲染，适合数据请求、事件订阅这些不需要立即影响布局的操作。

useLayoutEffect 是在 DOM 变更完成后、浏览器绘制之前同步执行的，它会阻塞渲染。适合需要读取或修改 DOM 布局的场景，比如测量元素尺寸后调整位置。

执行顺序是：render → DOM 更新 → useLayoutEffect → 浏览器绘制 → useEffect。实践中优先用 useEffect，只有当出现界面闪烁（比如元素先显示在错误位置然后跳到正确位置）时才换 useLayoutEffect。`,
  },
  {
    id: 203,
    category: 'React',
    difficulty: 'medium',
    question: 'React 常见性能优化手段？',
    answer: `1. React.memo：props 不变跳过渲染
2. useMemo：缓存计算结果
3. useCallback：缓存函数引用
4. 虚拟列表：大数据只渲染可见区域
5. React.lazy + Suspense：按需加载
6. 避免内联对象/函数
7. 状态下沉到需要的子组件
8. 列表使用稳定唯一 key`,
    oralAnswer: `React 性能优化我一般从几个层面来做。首先是避免不必要的重渲染，React.memo 包裹组件让 props 不变时跳过渲染，useMemo 缓存计算结果，useCallback 缓存函数引用防止子组件没必要的重渲染。

然后是渲染量优化，大数据列表用虚拟列表只渲染可见区域，React.lazy 加 Suspense 做按需加载减少首屏 Bundle 体积。

还有一些编码习惯：避免在 JSX 中写内联对象或内联函数，因为每次渲染都会创建新引用导致 memo 失效；状态尽量下沉到真正需要的子组件，减少父组件不必要的重渲染；列表项给稳定唯一的 key，不要用 index。`,
  },
  {
    id: 204,
    category: 'React',
    difficulty: 'hard',
    question: 'React Fiber 架构是什么？解决了什么问题？',
    answer: `React 16 引入的新协调引擎。

解决：旧 Stack Reconciler 递归不可中断，大型更新阻塞主线程卡顿。

核心思想：
1. 可中断渲染：工作拆分为 Fiber 节点小单元，可让出主线程
2. 优先级调度：用户输入 > 动画 > 数据请求
3. 双缓冲：current/workInProgress tree 无闪烁切换

Fiber 节点形成链表（child/sibling/return），便于遍历和中断恢复。是并发模式和 Suspense 的基础。`,
    oralAnswer: `Fiber 是 React 16 引入的新协调引擎，解决的是旧的 Stack Reconciler 的问题。旧架构用递归方式遍历组件树，一旦开始就不能中断，如果组件树很大，就会长时间占用主线程导致界面卡顿。

Fiber 的核心思想是把渲染工作拆分成小单元，每个 Fiber 节点就是一个工作单元。处理完一个节点后可以检查有没有更高优先级的任务，有的话就让出主线程。它还引入了优先级调度，用户输入优先级最高，然后是动画，最后是数据请求。

Fiber 节点通过 child、sibling、return 三个指针形成链表结构，便于遍历和中断后恢复。另外用双缓冲机制，current tree 和 workInProgress tree 交替，完成后一次性切换，避免闪烁。这是后来并发模式和 Suspense 的基础。`,
  },
  {
    id: 205,
    category: 'React',
    difficulty: 'hard',
    question: 'React 18/19 有哪些重要新特性？',
    answer: `React 18：
- 并发渲染：可中断、可恢复
- Automatic Batching：所有更新自动批处理
- useTransition / startTransition：标记低优先级更新
- useDeferredValue：延迟非紧急内容
- Suspense 增强：服务端流式渲染
- useId：稳定唯一 ID

React 19：
- React Compiler：自动优化（不再需手动 memo）
- Server Components：减少客户端 JS
- Actions + useActionState：简化表单/异步
- useOptimistic：乐观更新
- use() API：组件中直接 await Promise
- ref 作为 prop（无需 forwardRef）`,
    oralAnswer: `React 18 最重要的是引入了并发渲染，渲染过程可以中断和恢复。配套的 API 有 useTransition 和 startTransition，可以把某些更新标记为低优先级，不阻塞用户交互；useDeferredValue 可以延迟非紧急内容的更新。另外 Automatic Batching 让所有更新自动批处理，以前只有事件处理器里才会批处理。Suspense 也增强了，支持服务端流式渲染。

React 19 的亮点是 React Compiler，它能自动做记忆化优化，以后开发者基本不需要手动写 memo、useMemo、useCallback 了。Server Components 让组件可以在服务端渲染，减少发送到客户端的 JS 体积。Actions 和 useActionState 简化了表单和异步操作的处理。use() API 可以在组件中直接 await Promise。还有一个小但很实用的改进是 ref 可以直接作为 prop 传递，不再需要 forwardRef 包裹了。`,
  },
  {
    id: 206,
    category: 'React',
    difficulty: 'medium',
    question: 'Hooks 闭包陷阱是什么？如何解决？',
    answer: `问题：useEffect/useCallback 中引用的 state 是创建时的快照，非最新值。

典型：setInterval 中 count 永远是 0。

解决方案：
1. 正确设置依赖数组
2. 函数式更新：setCount(prev => prev + 1)
3. useRef 保存最新值：ref.current = count
4. useLatest 自定义 Hook

React 19 Compiler 能自动处理大部分闭包问题。`,
    oralAnswer: `闭包陷阱是 Hooks 里最常见的坑。问题在于 useEffect 或 useCallback 内部引用的 state 是创建时的快照，不是最新值。最典型的例子是在 setInterval 里打印 count，会发现永远是 0，因为闭包捕获的是初始值。

解决方案有几种：第一是正确设置依赖数组，让 effect 在依赖变化时重新创建；第二是用函数式更新，比如 setCount(prev => prev + 1)，这样不依赖外部的 count 值；第三是用 useRef 保存最新值，每次渲染时更新 ref.current，在回调里读 ref.current；还可以封装一个 useLatest 自定义 Hook 来简化这个模式。React 19 的 Compiler 能自动处理大部分闭包问题，以后这类问题会少很多。`,
  },
  {
    id: 207,
    category: 'React',
    difficulty: 'medium',
    question: 'React Context 的性能问题和解决方案？',
    answer: `问题：Context value 变化时，所有消费者组件都会重渲染，即使只用了其中一个字段。

解决方案：
1. 拆分 Context：将频繁变化和稳定的数据分开
2. useMemo 包裹 value：避免父组件渲染导致 value 引用变化
3. React.memo 消费组件：配合选择性消费
4. 使用状态管理库（Zustand/Jotai）：天然支持精确订阅
5. use-context-selector：社区方案，选择性订阅
6. React 19 的 use() + Compiler 自动优化`,
    oralAnswer: `Context 的性能问题在于，只要 Provider 的 value 变了，所有消费这个 Context 的组件都会重渲染，即使某个组件只用了其中一个字段。比如你把 user 和 theme 放在同一个 Context 里，改 theme 时只用了 user 的组件也会重渲染。

解决方案有几个思路。首先是拆分 Context，把频繁变化的和稳定的数据分开放。然后是用 useMemo 包裹 Provider 的 value，避免父组件每次渲染时创建新对象导致引用变化。消费组件用 React.memo 包裹配合选择性消费。

更彻底的方案是用状态管理库，像 Zustand 和 Jotai 都天然支持精确订阅，只有你用到的那部分状态变了才重渲染。社区也有 use-context-selector 这样的方案做选择性订阅。React 19 的 Compiler 加上 use() API 也能自动优化这类问题。`,
  },
];
