import { Question } from './types';

export const jsQuestions: Question[] = [
  {
    id: 301,
    category: 'JavaScript',
    difficulty: 'easy',
    question: '说说 var、let、const 的区别？',
    answer: `var：变量提升，可重复声明，函数作用域。
let：暂时性死区，不可重复声明，块级作用域。
const：必须初始化，不可重新赋值（引用类型属性可修改），块级作用域。

推荐：优先 const，需重新赋值用 let，避免 var。`,
  },
  {
    id: 302,
    category: 'JavaScript',
    difficulty: 'medium',
    question: '解释事件循环（Event Loop）机制？',
    answer: `JS 单线程，通过事件循环实现异步：

1. 调用栈：同步代码入栈执行
2. 微任务队列：Promise.then、queueMicrotask
3. 宏任务队列：setTimeout、setInterval、I/O

顺序：同步 → 清空微任务 → 取一个宏任务 → 清空微任务 → 循环

输出题：console.log('1'); setTimeout(()=>log('2'),0); Promise.resolve().then(()=>log('3')); log('4');
结果：1 4 3 2`,
  },
  {
    id: 303,
    category: 'JavaScript',
    difficulty: 'medium',
    question: '什么是闭包？应用场景？',
    answer: `闭包：函数能记住并访问其词法作用域，即使在外部执行。

本质：函数 + 引用的外部变量。

场景：数据私有化、柯里化、防抖/节流、缓存 memoize。

注意：可能导致内存泄漏，用完解除引用。`,
  },
  {
    id: 304,
    category: 'JavaScript',
    difficulty: 'hard',
    question: '手写 Promise.all？',
    answer: `function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) return reject(new TypeError('需要数组'));
    const results = [];
    let completed = 0;
    if (promises.length === 0) return resolve([]);

    promises.forEach((p, i) => {
      Promise.resolve(p).then(
        value => {
          results[i] = value;
          if (++completed === promises.length) resolve(results);
        },
        reason => reject(reason)
      );
    });
  });
}

要点：Promise.resolve 包装非 Promise、索引保序、任一 reject 立即 reject、空数组直接 resolve。`,
  },
  {
    id: 305,
    category: 'JavaScript',
    difficulty: 'medium',
    question: '深拷贝和浅拷贝的区别？',
    answer: `浅拷贝：只复制第一层。方法：Object.assign、{...obj}、slice。

深拷贝：递归复制所有层级。方法：
1. JSON.parse(JSON.stringify(obj)) — 不支持函数/undefined/循环引用
2. structuredClone(obj) — 原生 API，推荐
3. 手写递归（WeakMap 处理循环引用）

function deepClone(obj, map = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (map.has(obj)) return map.get(obj);
  const clone = Array.isArray(obj) ? [] : {};
  map.set(obj, clone);
  for (const key of Object.keys(obj)) clone[key] = deepClone(obj[key], map);
  return clone;
}`,
  },
  {
    id: 306,
    category: 'JavaScript',
    difficulty: 'medium',
    question: '原型链是什么？如何实现继承？',
    answer: `每个对象有 __proto__ 指向构造函数的 prototype，形成原型链。属性查找沿链向上至 null。

实例 → Constructor.prototype → Object.prototype → null

ES6 继承：class Child extends Parent {}

ES5 寄生组合继承：
function Child(...args) { Parent.call(this, ...args); }
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;`,
  },
  {
    id: 307,
    category: 'JavaScript',
    difficulty: 'hard',
    question: 'async/await 的原理是什么？与 Generator 的关系？',
    answer: `async/await 是 Generator + 自动执行器的语法糖。

Generator 版本：
function* fetchData() {
  const res = yield fetch('/api');
  const data = yield res.json();
  return data;
}

async/await 版本：
async function fetchData() {
  const res = await fetch('/api');
  const data = await res.json();
  return data;
}

原理：
1. async 函数返回 Promise
2. await 暂停执行，等待 Promise resolve
3. 编译器将其转为状态机（类似 Generator 的 yield）
4. 自动执行器驱动状态流转

错误处理：try/catch 捕获 reject，或 .catch() 链式处理。`,
  },
  {
    id: 308,
    category: 'JavaScript',
    difficulty: 'hard',
    question: '手写防抖和节流？',
    answer: `防抖（Debounce）：等待 n 秒执行，期间再触发重新计时。
场景：搜索输入、resize。

function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

节流（Throttle）：每 n 秒最多执行一次。
场景：滚动、拖拽、按钮防重复。

function throttle(fn, interval) {
  let last = 0;
  return function(...args) {
    const now = Date.now();
    if (now - last >= interval) {
      last = now;
      fn.apply(this, args);
    }
  };
}`,
  },
];
