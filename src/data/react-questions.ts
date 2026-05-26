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
  },
];
