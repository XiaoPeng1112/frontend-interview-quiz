import { Question } from './types';

export const rnHandwritingQuestions: Question[] = [
  {
    id: 2001,
    category: 'RN 手写题',
    difficulty: 'medium',
    question: '手写一个 React Native 无限滚动列表（下拉刷新 + 上拉加载更多）',
    answer: `核心实现：

\`\`\`tsx
const InfiniteList = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = async (pageNum: number, isRefresh = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await api.getList({ page: pageNum, size: 20 });
      if (isRefresh) {
        setData(res.list);
      } else {
        setData(prev => [...prev, ...res.list]);
      }
      setHasMore(res.list.length === 20);
      setPage(pageNum);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData(1, true);
  };

  const onEndReached = () => {
    if (hasMore && !loading) {
      fetchData(page + 1);
    }
  };

  return (
    <FlatList
      data={data}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <ListItem item={item} />}
      onRefresh={onRefresh}
      refreshing={refreshing}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.3}
      ListFooterComponent={loading ? <ActivityIndicator /> : null}
    />
  );
};
\`\`\`

关键点：
1. 防止重复请求（loading 判断）
2. onEndReachedThreshold 设为 0.3 提前触发
3. 下拉刷新重置数据，上拉加载追加数据
4. hasMore 判断是否还有更多数据`,
    oralAnswer: `这题考的是 FlatList 的实际使用。核心就是维护 page 和 loading 两个状态，下拉刷新的时候 page 重置为 1 然后替换数据，上拉加载的时候 page+1 然后追加数据。有个关键点是防止重复请求，loading 为 true 就不要再发了。onEndReachedThreshold 设 0.3 左右比较好，太小的话用户会感觉到等待。`,
  },
  {
    id: 2002,
    category: 'RN 手写题',
    difficulty: 'medium',
    question: '手写防抖（debounce）和节流（throttle），要求支持取消和立即执行',
    answer: `\`\`\`typescript
// 防抖：最后一次触发后等待 delay 执行
function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
  immediate = false
) {
  let timer: ReturnType<typeof setTimeout> | null = null;

  const debounced = function(this: any, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer);
    
    if (immediate && !timer) {
      fn.apply(this, args);
    }
    
    timer = setTimeout(() => {
      if (!immediate) fn.apply(this, args);
      timer = null;
    }, delay);
  };

  debounced.cancel = () => {
    if (timer) clearTimeout(timer);
    timer = null;
  };

  return debounced;
}

// 节流：每 interval 时间只执行一次
function throttle<T extends (...args: any[]) => any>(
  fn: T,
  interval: number,
  options = { leading: true, trailing: true }
) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastTime = 0;

  const throttled = function(this: any, ...args: Parameters<T>) {
    const now = Date.now();
    
    if (!lastTime && !options.leading) lastTime = now;
    
    const remaining = interval - (now - lastTime);
    
    if (remaining <= 0) {
      if (timer) { clearTimeout(timer); timer = null; }
      lastTime = now;
      fn.apply(this, args);
    } else if (!timer && options.trailing) {
      timer = setTimeout(() => {
        lastTime = options.leading ? Date.now() : 0;
        timer = null;
        fn.apply(this, args);
      }, remaining);
    }
  };

  throttled.cancel = () => {
    if (timer) clearTimeout(timer);
    timer = null;
    lastTime = 0;
  };

  return throttled;
}
\`\`\`

防抖应用：搜索输入、窗口 resize
节流应用：滚动监听、按钮点击防重复`,
    oralAnswer: `防抖和节流的核心区别：防抖是"等你停下来才执行"，节流是"每隔一段时间执行一次"。防抖的实现就是每次触发都清除上一个定时器重新计时。节流的实现是记录上次执行时间，如果距离上次执行超过了间隔就执行。进阶点是支持 leading（首次立即执行）和 trailing（最后一次也执行），以及 cancel 取消方法。RN 里搜索框用防抖，列表滚动监听用节流。`,
  },
  {
    id: 2003,
    category: 'RN 手写题',
    difficulty: 'medium',
    question: '手写 Promise.all 和 Promise.race',
    answer: `\`\`\`typescript
// Promise.all：全部成功才 resolve，任一失败就 reject
function promiseAll<T>(promises: Promise<T>[]): Promise<T[]> {
  return new Promise((resolve, reject) => {
    if (promises.length === 0) return resolve([]);
    
    const results: T[] = new Array(promises.length);
    let count = 0;
    
    promises.forEach((p, index) => {
      Promise.resolve(p).then(
        (value) => {
          results[index] = value;  // 保持顺序
          count++;
          if (count === promises.length) resolve(results);
        },
        (reason) => reject(reason)  // 任一失败立即 reject
      );
    });
  });
}

// Promise.race：第一个完成的（成功或失败）决定结果
function promiseRace<T>(promises: Promise<T>[]): Promise<T> {
  return new Promise((resolve, reject) => {
    promises.forEach(p => {
      Promise.resolve(p).then(resolve, reject);
    });
  });
}

// Promise.allSettled：等所有完成，返回每个的状态
function promiseAllSettled<T>(promises: Promise<T>[]) {
  return Promise.all(
    promises.map(p => 
      Promise.resolve(p).then(
        value => ({ status: 'fulfilled' as const, value }),
        reason => ({ status: 'rejected' as const, reason })
      )
    )
  );
}
\`\`\`

关键点：
1. Promise.all 用 count 计数而不是 results.length（可能有 empty slot）
2. results[index] 保证结果顺序与输入一致
3. Promise.resolve(p) 包裹处理非 Promise 值
4. 空数组 Promise.all 直接 resolve([])`,
    oralAnswer: `Promise.all 的核心思路是创建一个新 Promise，内部用计数器追踪完成数量。每个 promise 完成时把结果按 index 放到数组里，计数器加一，等计数器等于总数就 resolve。有一个注意点是结果要按顺序，所以用 index 而不是 push。任何一个 reject 就直接 reject 整个。Promise.race 更简单，谁先完成就用谁的结果。`,
  },
  {
    id: 2004,
    category: 'RN 手写题',
    difficulty: 'hard',
    question: '手写一个 EventEmitter（发布订阅模式）',
    answer: `\`\`\`typescript
type Listener = (...args: any[]) => void;

class EventEmitter {
  private events: Map<string, Listener[]> = new Map();

  on(event: string, listener: Listener): this {
    const listeners = this.events.get(event) || [];
    listeners.push(listener);
    this.events.set(event, listeners);
    return this;
  }

  once(event: string, listener: Listener): this {
    const wrapper: Listener = (...args) => {
      listener(...args);
      this.off(event, wrapper);
    };
    wrapper._original = listener;  // 保留原引用，支持 off
    return this.on(event, wrapper);
  }

  off(event: string, listener: Listener): this {
    const listeners = this.events.get(event);
    if (!listeners) return this;
    this.events.set(
      event,
      listeners.filter(l => l !== listener && l._original !== listener)
    );
    return this;
  }

  emit(event: string, ...args: any[]): boolean {
    const listeners = this.events.get(event);
    if (!listeners || listeners.length === 0) return false;
    // 拷贝一份防止 once 中删除导致遍历问题
    [...listeners].forEach(l => l(...args));
    return true;
  }

  removeAllListeners(event?: string): this {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
    return this;
  }
}
\`\`\`

RN 中 EventEmitter 的应用场景：
- DeviceEventEmitter（Native → JS 通信）
- NativeEventEmitter（新架构）
- 跨组件通信（非父子关系）
- 全局事件总线`,
    oralAnswer: `发布订阅模式的核心就是一个 Map，key 是事件名，value 是回调函数数组。on 就是往数组里 push，emit 就是把数组里的函数全执行一遍，off 就是从数组里过滤掉。有两个细节：once 的实现是包一层 wrapper，执行后自动 off 掉自己；emit 时要拷贝数组再遍历，防止 once 里删除导致遍历出错。在 RN 里这个模式很常见，Native 给 JS 发事件就是用 EventEmitter。`,
  },
  {
    id: 2005,
    category: 'RN 手写题',
    difficulty: 'medium',
    question: '手写深拷贝（支持循环引用、特殊类型）',
    answer: `\`\`\`typescript
function deepClone<T>(obj: T, map = new WeakMap()): T {
  // 基础类型直接返回
  if (obj === null || typeof obj !== 'object') return obj;
  
  // 处理循环引用
  if (map.has(obj as object)) return map.get(obj as object);
  
  // 处理特殊类型
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags) as any;
  if (obj instanceof Map) {
    const result = new Map();
    map.set(obj as object, result);
    obj.forEach((val, key) => result.set(deepClone(key, map), deepClone(val, map)));
    return result as any;
  }
  if (obj instanceof Set) {
    const result = new Set();
    map.set(obj as object, result);
    obj.forEach(val => result.add(deepClone(val, map)));
    return result as any;
  }
  
  // 数组和普通对象
  const result = Array.isArray(obj) ? [] : Object.create(Object.getPrototypeOf(obj));
  map.set(obj as object, result);
  
  // 拷贝所有自有属性（包括 Symbol）
  const keys = [...Object.keys(obj), ...Object.getOwnPropertySymbols(obj)];
  for (const key of keys) {
    result[key] = deepClone((obj as any)[key], map);
  }
  
  return result;
}
\`\`\`

核心考察点：
1. WeakMap 处理循环引用（为什么不用 Map？避免内存泄漏）
2. 特殊类型：Date、RegExp、Map、Set
3. 保持原型链：Object.create(Object.getPrototypeOf(obj))
4. Symbol 属性也要拷贝`,
    oralAnswer: `深拷贝的思路是递归，但有几个关键点。第一是循环引用，用 WeakMap 记录已经拷贝过的对象，遇到就直接返回缓存。为什么用 WeakMap 不用 Map？因为 WeakMap 的 key 是弱引用，拷贝完对象被回收时不会内存泄漏。第二是特殊类型要单独处理，Date 要 new Date，RegExp 要 new RegExp。第三是要用 Object.create 保持原型链。面试中如果时间紧，先写基础版本（递归 + 循环引用），再提一下特殊类型的处理就可以了。`,
  },
  {
    id: 2006,
    category: 'RN 手写题',
    difficulty: 'hard',
    question: '手写一个带并发限制的请求调度器（Scheduler）',
    answer: `\`\`\`typescript
class RequestScheduler {
  private maxConcurrent: number;
  private running = 0;
  private queue: Array<() => void> = [];

  constructor(maxConcurrent: number) {
    this.maxConcurrent = maxConcurrent;
  }

  add<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const run = () => {
        this.running++;
        task()
          .then(resolve, reject)
          .finally(() => {
            this.running--;
            this.next();
          });
      };

      if (this.running < this.maxConcurrent) {
        run();
      } else {
        this.queue.push(run);
      }
    });
  }

  private next() {
    if (this.queue.length > 0 && this.running < this.maxConcurrent) {
      const task = this.queue.shift()!;
      task();
    }
  }
}

// 使用示例
const scheduler = new RequestScheduler(3);

const urls = ['/api/1', '/api/2', '/api/3', '/api/4', '/api/5'];
const results = await Promise.all(
  urls.map(url => scheduler.add(() => fetch(url).then(r => r.json())))
);
\`\`\`

应用场景：
- 图片批量上传限制并发
- API 请求限流（避免服务端压力）
- RN 中多张图片同时下载控制`,
    oralAnswer: `并发调度器的核心就是一个队列加一个计数器。add 方法接收一个返回 Promise 的函数，如果当前并发数没到上限就立即执行，否则放入队列。每个任务完成后（finally 里），计数器减一然后看队列里有没有等待的任务，有就取出来执行。这个在 RN 里很实用，比如批量上传图片限制最多同时 3 个上传，或者列表预加载图片不想一次性发太多请求。`,
  },
  {
    id: 2007,
    category: 'RN 手写题',
    difficulty: 'medium',
    question: '手写一个自定义 Hook：useDebounce 和 useThrottle',
    answer: `\`\`\`typescript
import { useState, useEffect, useRef, useCallback } from 'react';

// useDebounce - 值防抖
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
}

// useDebounceFn - 函数防抖
function useDebounceFn<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
) {
  const fnRef = useRef(fn);
  fnRef.current = fn;  // 始终指向最新的函数
  
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  
  const debouncedFn = useCallback((...args: Parameters<T>) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fnRef.current(...args), delay);
  }, [delay]);
  
  // 组件卸载时清理
  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);
  
  return debouncedFn;
}

// useThrottle - 值节流
function useThrottle<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastUpdated = useRef(Date.now());
  
  useEffect(() => {
    const now = Date.now();
    if (now - lastUpdated.current >= interval) {
      lastUpdated.current = now;
      setThrottledValue(value);
    } else {
      const timer = setTimeout(() => {
        lastUpdated.current = Date.now();
        setThrottledValue(value);
      }, interval - (now - lastUpdated.current));
      return () => clearTimeout(timer);
    }
  }, [value, interval]);
  
  return throttledValue;
}
\`\`\`

使用场景：
- useDebounce：搜索输入联想
- useDebounceFn：按钮点击防重复提交
- useThrottle：滚动位置跟踪`,
    oralAnswer: `useDebounce 很简单，就是 useEffect 里设置 setTimeout，value 变化时清除上一个重新计时。useDebounceFn 稍复杂一点，关键是用 useRef 保持函数引用最新（避免闭包陷阱），用 useCallback 保证返回的防抖函数引用稳定。useThrottle 的思路是记录上次更新时间，如果超过间隔就立即更新，否则设个定时器等到间隔结束再更新。这些在 RN 里用得很多，搜索框、按钮防连点都需要。`,
  },
  {
    id: 2008,
    category: 'RN 手写题',
    difficulty: 'hard',
    question: '手写一个 LRU Cache（最近最少使用缓存）',
    answer: `\`\`\`typescript
class LRUCache<K, V> {
  private capacity: number;
  private cache: Map<K, V>;  // Map 保持插入顺序

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key: K): V | undefined {
    if (!this.cache.has(key)) return undefined;
    
    // 移到最新位置（删除再插入）
    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // 删除最久未使用的（Map 第一个元素）
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  get size(): number {
    return this.cache.size;
  }
}

// 使用场景：图片缓存、API 响应缓存
const imageCache = new LRUCache<string, string>(100);
imageCache.put('avatar_url', 'base64...');
imageCache.get('avatar_url'); // 命中缓存并提升优先级
\`\`\`

为什么用 Map 而不是普通对象？
1. Map 保证 key 的插入顺序
2. Map.keys().next() 可以高效获取第一个 key
3. delete + set = 移动到末尾（最近使用）

时间复杂度：get O(1)，put O(1)

RN 中应用：图片缓存策略、接口数据缓存、路由栈管理`,
    oralAnswer: `LRU 缓存的核心思路是"最近使用的排后面，最久没用的排前面，满了就删前面的"。利用 JS Map 天然保持插入顺序的特性，get 的时候先删再插就相当于移到了最后（最新），put 的时候如果满了就用 keys().next().value 拿到第一个（最旧的）删掉。整个实现很简洁，get 和 put 都是 O(1)。在 RN 里做图片缓存或者 API 缓存都会用到这个思路。`,
  },
  {
    id: 2009,
    category: 'RN 手写题',
    difficulty: 'medium',
    question: '手写 Array.prototype.reduce 和 Array.prototype.flat',
    answer: `\`\`\`typescript
// 手写 reduce
Array.prototype.myReduce = function<T, U>(
  callback: (acc: U, cur: T, index: number, arr: T[]) => U,
  initialValue?: U
): U {
  const arr = this;
  let acc: U;
  let startIndex: number;

  if (initialValue !== undefined) {
    acc = initialValue;
    startIndex = 0;
  } else {
    if (arr.length === 0) throw new TypeError('Reduce of empty array with no initial value');
    acc = arr[0] as unknown as U;
    startIndex = 1;
  }

  for (let i = startIndex; i < arr.length; i++) {
    acc = callback(acc, arr[i], i, arr);
  }

  return acc;
};

// 手写 flat（递归版）
function flat(arr: any[], depth = 1): any[] {
  if (depth <= 0) return arr.slice();
  
  return arr.reduce((acc, item) => {
    if (Array.isArray(item)) {
      return acc.concat(flat(item, depth - 1));
    }
    return acc.concat(item);
  }, []);
}

// 非递归版（用栈）
function flatIterative(arr: any[], depth = Infinity): any[] {
  const stack: Array<[any, number]> = arr.map(item => [item, depth]);
  const result: any[] = [];
  
  while (stack.length) {
    const [item, d] = stack.shift()!;
    if (Array.isArray(item) && d > 0) {
      stack.unshift(...item.map(i => [i, d - 1] as [any, number]));
    } else {
      result.push(item);
    }
  }
  return result;
}
\`\`\`

reduce 关键点：
1. 有初始值从 index 0 开始，无初始值从 index 1 开始
2. 空数组无初始值要抛 TypeError

flat 关键点：
1. depth 控制展开层数
2. 递归版简洁但有栈溢出风险
3. 迭代版用队列/栈模拟，更安全`,
    oralAnswer: `reduce 的关键是处理有没有初始值两种情况：有初始值就从 index 0 开始遍历，累加器初始化为 initialValue；没有的话就从 index 1 开始，累加器初始化为第一个元素。空数组又没有初始值要抛错。flat 的实现最简洁的方式是用 reduce 递归，每个元素判断是不是数组，是的话递归 flat 并 concat，depth 减一直到 0 就停止展开。`,
  },
  {
    id: 2010,
    category: 'RN 手写题',
    difficulty: 'hard',
    question: '手写一个简易版 React useState 和 useEffect（理解 Hooks 原理）',
    answer: `\`\`\`typescript
// 简易 Hooks 实现（帮助理解原理）
let hookStates: any[] = [];  // 存储所有 hook 状态
let hookIndex = 0;           // 当前 hook 索引

function useState<T>(initialValue: T): [T, (newVal: T | ((prev: T) => T)) => void] {
  const currentIndex = hookIndex;
  
  // 首次渲染用 initialValue，后续用存储的值
  if (hookStates[currentIndex] === undefined) {
    hookStates[currentIndex] = initialValue;
  }
  
  const setState = (newValue: T | ((prev: T) => T)) => {
    if (typeof newValue === 'function') {
      hookStates[currentIndex] = (newValue as Function)(hookStates[currentIndex]);
    } else {
      hookStates[currentIndex] = newValue;
    }
    render(); // 触发重新渲染
  };
  
  hookIndex++;
  return [hookStates[currentIndex], setState];
}

function useEffect(callback: () => (void | (() => void)), deps?: any[]) {
  const currentIndex = hookIndex;
  const prevDeps = hookStates[currentIndex]?.deps;
  const prevCleanup = hookStates[currentIndex]?.cleanup;
  
  const hasChanged = !prevDeps || !deps || 
    deps.some((dep, i) => !Object.is(dep, prevDeps[i]));
  
  if (hasChanged) {
    // 执行上一次的清理函数
    if (prevCleanup) prevCleanup();
    // 异步执行 effect
    setTimeout(() => {
      const cleanup = callback();
      hookStates[currentIndex] = { deps, cleanup };
    });
  }
  
  hookIndex++;
}

function render() {
  hookIndex = 0;  // 重置索引，保证 hook 调用顺序一致
  // ReactDOM.render(...)
}
\`\`\`

核心原理：
1. Hooks 靠调用顺序（index）定位状态 → 不能在条件语句中调用
2. useState 用闭包的 currentIndex 保持对正确位置的引用
3. useEffect 用 Object.is 浅比较 deps 决定是否重新执行
4. 每次渲染 hookIndex 重置为 0，按顺序重新关联`,
    oralAnswer: `理解 Hooks 原理的关键是：React 内部维护一个数组（Fiber 上是链表），每个 hook 调用按顺序占一个位置。useState 就是在数组的当前位置存值，setState 时更新那个位置然后触发重渲染。useEffect 是在当前位置存 deps 和 cleanup，每次渲染时比较新旧 deps，变了就执行。这就是为什么 hook 不能放在 if 里——因为顺序变了就对不上了。面试中能说出"靠索引定位、不能条件调用"就算理解了核心。`,
  },
];
