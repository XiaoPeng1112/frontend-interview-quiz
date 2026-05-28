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
    oralAnswer: `这三个的核心区别在作用域和变量提升。var 是函数作用域，有变量提升（声明会被提到函数顶部，但赋值不会），可以重复声明，容易出错。

let 和 const 是 ES6 引入的，都是块级作用域，有暂时性死区（在声明前访问会报错），不能重复声明。两者的区别是 const 必须初始化且不能重新赋值，但如果是引用类型（对象、数组），属性是可以修改的。

实践中优先用 const，需要重新赋值时用 let，基本不用 var。`,
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
    oralAnswer: `JavaScript 是单线程的，通过事件循环来实现异步。核心概念有三个：调用栈执行同步代码；微任务队列存放 Promise.then、queueMicrotask 这些；宏任务队列存放 setTimeout、setInterval、I/O 回调。

执行顺序是：先执行完所有同步代码，然后清空微任务队列，再取一个宏任务执行，执行完又清空微任务，如此循环。所以微任务的优先级比宏任务高。

举个经典例子：log(1)，setTimeout log(2)，Promise.then log(3)，log(4)。输出是 1 4 3 2——同步先执行 1 和 4，然后微任务 3，最后宏任务 2。`,
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
    oralAnswer: `闭包就是函数能记住并访问它的词法作用域，即使这个函数在定义作用域外部执行。本质上就是函数加上它引用的外部变量。

常见的应用场景包括：数据私有化，比如模块模式中用闭包隐藏内部变量；柯里化，把多参数函数转换为单参数函数链；防抖节流里用闭包保存 timer 变量；缓存 memoize 用闭包保存计算结果。

要注意的是闭包会让外部变量无法被垃圾回收，可能导致内存泄漏，用完后要解除引用。`,
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
    oralAnswer: `手写 Promise.all 的思路是这样的：返回一个新 Promise，接收一个数组，每个元素用 Promise.resolve 包一层确保它是 Promise。维护一个计数器和结果数组。

每个 Promise resolve 时把结果按索引放入数组（保证顺序），计数器加一，当计数器等于数组长度时 resolve 整个结果数组。任何一个 reject 就立即 reject 整个 Promise。还要处理空数组的边界情况，直接 resolve 空数组。

核心要点就是四个：Pomise.resolve 包装确保统一处理、索引保序而不是 push、任一失败立即 reject、空数组直接 resolve。`,
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
    oralAnswer: `浅拷贝只复制第一层属性，嵌套对象还是共享引用。常用方法有 Object.assign、展开运算符、数组的 slice。

深拷贝递归复制所有层级。最简单的是 JSON.parse(JSON.stringify())，但不支持函数、undefined、循环引用、Date、RegExp 这些特殊类型。现代浏览器推荐用 structuredClone()，它是原生 API，支持大多数类型和循环引用。

如果面试要手写，核心思路是递归遍历对象属性，用 WeakMap 处理循环引用：每次克隆前先检查 WeakMap 里有没有这个对象，有就直接返回，没有就存进去然后递归处理。`,
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
    oralAnswer: `原型链的核心是：每个对象都有一个 __proto__ 指向它构造函数的 prototype。当访问一个属性时，如果对象本身没有，就沿着原型链往上找，一直找到 Object.prototype，再往上就是 null 了。

ES6 的继承用 class extends 关键字，写法很简洁。ES5 时代最佳方案是寄生组合继承：在子构造函数里用 Parent.call(this) 继承属性，然后用 Object.create(Parent.prototype) 设置原型链继承方法，最后修复 constructor 指向。这样既能继承属性又能继承方法，而且不会调用两次父构造函数。`,
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
    oralAnswer: `async/await 本质是 Generator 加自动执行器的语法糖。Generator 函数可以通过 yield 暂停执行，然后从外部调用 next() 恢复。async/await 就是把这个过程自动化了。

async 函数返回的是一个 Promise。await 会暂停函数执行，等待后面的 Promise resolve 后才继续。编译器会把 async 函数转换为状态机，类似 Generator 的 yield 机制，内部有一个自动执行器驱动状态流转。

错误处理可以用 try/catch 包裹 await 表达式来捕获 reject，也可以在调用时用 .catch() 链式处理。相比回调地狱和 Promise 链式，async/await 让异步代码读起来像同步代码，可读性好很多。`,
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
    oralAnswer: `防抖和节流都是限制函数执行频率的方法，但策略不同。

防抖是等待 n 秒后才执行，如果期间又触发了就重新计时。典型场景是搜索输入，用户输入过程中不发请求，停止输入 300ms 后再搜索。实现就是每次触发时 clearTimeout 掉上一次的定时器，再设一个新的。

节流是每 n 秒最多执行一次，不管触发多频繁。典型场景是滚动事件、拖拽、按钮防重复点击。实现是记录上次执行时间，每次触发时判断距离上次是否超过 interval，超过才执行。

两个实现都用到了闭包来保存 timer 或 last 变量，还要注意用 apply 保持 this 指向和参数传递。`,
  },
];
