import { Question } from './types';

export const cssQuestions: Question[] = [
  {
    id: 501,
    category: 'CSS',
    difficulty: 'easy',
    question: 'CSS 盒模型是什么？标准和 IE 盒模型的区别？',
    answer: `盒模型：margin → border → padding → content。

标准（content-box）：width/height 只含 content。
IE（border-box）：width/height 含 content + padding + border。

推荐全局 border-box，计算更直观：box-sizing: border-box;`,
  },
  {
    id: 502,
    category: 'CSS',
    difficulty: 'medium',
    question: 'BFC 是什么？如何触发？',
    answer: `BFC（块级格式化上下文）：独立渲染区域，内部布局不影响外部。

触发：float 非 none、position absolute/fixed、display inline-block/flex/grid、overflow 非 visible。

作用：阻止 margin 重叠、清除浮动、阻止浮动覆盖。`,
  },
  {
    id: 503,
    category: 'CSS',
    difficulty: 'medium',
    question: 'Flex 布局中 flex: 1 代表什么？',
    answer: `flex: 1 即 flex: 1 1 0%：
- flex-grow: 1 — 占剩余空间比例 1
- flex-shrink: 1 — 空间不足可缩小
- flex-basis: 0% — 初始大小 0，纯比例分配

区分：
- flex: auto = 1 1 auto（基于内容再分配）
- flex: none = 0 0 auto（不伸缩）
- flex: 1 = 1 1 0%（忽略内容，纯比例）`,
  },
  {
    id: 504,
    category: 'CSS',
    difficulty: 'hard',
    question: '如何实现自适应等比例容器（16:9）？',
    answer: `方法一：padding-top 百分比
.container { width: 100%; padding-top: 56.25%; position: relative; }
.content { position: absolute; inset: 0; }
（padding 百分比相对父元素宽度）

方法二：aspect-ratio（现代方案，推荐）
.container { width: 100%; aspect-ratio: 16 / 9; }
兼容性好（Chrome 88+, Firefox 89+, Safari 15+）。`,
  },
];
