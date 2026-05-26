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
  },
];
