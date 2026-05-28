import { Question } from './types';

export const tsQuestions: Question[] = [
  {
    id: 401,
    category: 'TypeScript',
    difficulty: 'easy',
    question: 'interface 和 type 有什么区别？',
    answer: `interface：extends 继承、可重复声明自动合并、不支持联合/映射类型。
type：& 交叉类型、不可重复声明、支持联合/映射/条件类型。

建议：
- 对象/类的形状 → interface（利于扩展）
- 联合类型、工具类型 → type
- 库的公共 API → interface（允许用户扩展）`,
    oralAnswer: `interface 和 type 都能定义对象类型，但有几个关键区别。

interface 支持 extends 继承，可以重复声明自动合并（这叫声明合并），但不支持联合类型和映射类型。type 用交叉类型 & 来组合，不能重复声明，但支持联合类型、映射类型、条件类型这些高级特性。

实践中的建议是：定义对象或类的形状用 interface，因为它更容易扩展；联合类型和工具类型用 type；库的公共 API 用 interface，因为允许使用者通过声明合并来扩展。`,
  },
  {
    id: 402,
    category: 'TypeScript',
    difficulty: 'medium',
    question: '泛型（Generics）是什么？有什么用？',
    answer: `泛型是类型的"参数化"，让函数/类/接口能适配多种类型。

function identity<T>(arg: T): T { return arg; }
identity<string>('hello'); // 类型安全

常见用法：
- 泛型函数：function map<T, U>(arr: T[], fn: (item: T) => U): U[]
- 泛型接口：interface Response<T> { data: T; code: number; }
- 泛型约束：<T extends { id: number }> 限制 T 必须有 id 属性
- 默认泛型：<T = string>

React 中的应用：
- useState<number>(0)
- FC<Props>
- useRef<HTMLDivElement>(null)`,
    oralAnswer: `泛型就是类型的参数化，让我们写的函数、类、接口能适配多种类型而不失去类型安全。用尖括号 T 表示一个类型变量，调用时传入具体类型。

常见用法包括泛型函数（比如 map 函数能处理任意类型数组）、泛型接口（比如通用的 API 响应结构 Response<T>）、泛型约束（用 extends 限制 T 必须满足某个结构）、默认泛型值。

在 React 中很常见，比如 useState<number>(0) 指定状态类型、FC<Props> 指定组件 props 类型、useRef<HTMLDivElement>(null) 指定 DOM 元素类型。泛型让代码既复用又类型安全。`,
  },
  {
    id: 403,
    category: 'TypeScript',
    difficulty: 'hard',
    question: '解释条件类型和 infer 关键字？',
    answer: `条件类型：T extends U ? X : Y

infer 在条件类型中推断类型变量：
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
type ElementType<T> = T extends (infer E)[] ? E : T;

分布式条件类型（裸类型参数分发）：
type ToArray<T> = T extends any ? T[] : never;
ToArray<string | number> → string[] | number[]

这是实现 Omit、Extract、Parameters 等工具类型的基础。`,
    oralAnswer: `条件类型的语法是 T extends U ? X : Y，类似三元运算符，根据 T 是否满足 U 的约束来决定类型。

infer 关键字用在条件类型中，可以“提取”出某个位置的类型。比如 ReturnType 就是用 infer R 提取函数返回值类型，UnwrapPromise 用 infer U 提取 Promise 内部的类型。

还有一个重要特性叫分布式条件类型：当 T 是裸类型参数且传入联合类型时，会对联合的每个成员分别应用条件然后合并结果。比如 ToArray<string | number> 会得到 string[] | number[] 而不是 (string|number)[]。这些是实现 Omit、Extract 等内置工具类型的基础。`,
  },
  {
    id: 404,
    category: 'TypeScript',
    difficulty: 'medium',
    question: 'TypeScript 中 any、unknown、never 的区别？',
    answer: `any：关闭类型检查，可赋值给任何类型，任何类型可赋值给它。尽量避免使用。

unknown：类型安全的 any。任何类型可赋值给它，但使用前必须类型收窄（if/typeof/断言）。

never：不可达类型。函数永远不返回（抛异常/死循环）、穷举检查兜底。

层级：any/unknown 是顶层类型，never 是底层类型。

使用场景：
- 不确定类型 → unknown（强制收窄）
- 函数不返回 → never
- 逃生舱口（尽量少用） → any`,
    oralAnswer: `这三个是 TypeScript 类型系统中的特殊类型。

any 等于关闭类型检查，任何类型都可以赋值给它，它也可以赋值给任何类型。安全性为零，尽量避免使用。

unknown 是类型安全的 any。任何类型可以赋值给它，但使用前必须先做类型收窄（通过 typeof、instanceof、类型断言等）才能访问属性或方法。适合处理不确定类型的输入。

never 是底层类型，表示不可达。常见于永远不会返回的函数（抛异常或死循环），以及穷举检查的兆底 case（确保 switch 覆盖所有情况）。

从类型层级来看，any 和 unknown 是顶层类型，never 是底层类型。`,
  },
  {
    id: 405,
    category: 'TypeScript',
    difficulty: 'hard',
    question: '如何用 TypeScript 实现一个 DeepPartial 类型？',
    answer: `type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object
    ? T[K] extends Function
      ? T[K]
      : DeepPartial<T[K]>
    : T[K];
};

// 使用示例
interface Config {
  server: { host: string; port: number; };
  db: { url: string; pool: { min: number; max: number; }; };
}
type PartialConfig = DeepPartial<Config>;
// server?.host?, db?.pool?.min? 都是可选的

类似的递归类型：
- DeepReadonly<T>：深层只读
- DeepRequired<T>：深层必选
- DeepNonNullable<T>：深层去除 null/undefined`,
    oralAnswer: `DeepPartial 是一个递归类型，把对象所有层级的属性都变成可选的。

实现思路是用映射类型遍历所有 key，每个属性加上问号变为可选。然后判断属性值的类型：如果是对象（但不是函数），就递归应用 DeepPartial；如果是函数或原始类型，就保持原样。

这在配置对象层层嵌套的场景非常有用，比如更新配置时只想传部分字段。类似的递归类型还有 DeepReadonly（深层只读）、DeepRequired（深层必选）、DeepNonNullable（深层去除 null/undefined）等，实现思路都是一样的递归加映射类型。`,
  },
];
