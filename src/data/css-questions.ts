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
    oralAnswer: `盒模型就是每个元素由外到内分四层：margin、border、padding、content。

标准盒模型（content-box）中，width 和 height 只包含 content 部分，加 padding 和 border 会让元素实际尺寸变大。IE 盒模型（border-box）中，width 和 height 包含 content + padding + border，设置多少实际就是多少。

实践中推荐全局设置 box-sizing: border-box，因为计算更直观，不用再手动减去 padding 和 border。大多数现代 CSS 框架也都是这么做的。`,
  },
  {
    id: 502,
    category: 'CSS',
    difficulty: 'medium',
    question: 'BFC 是什么？如何触发？',
    answer: `BFC（块级格式化上下文）：独立渲染区域，内部布局不影响外部。

触发：float 非 none、position absolute/fixed、display inline-block/flex/grid、overflow 非 visible。

作用：阻止 margin 重叠、清除浮动、阻止浮动覆盖。`,
    oralAnswer: `BFC 就是块级格式化上下文，是一个独立的渲染区域，内部的布局不会影响外部元素。

触发 BFC 的条件有：float 不为 none、position 为 absolute 或 fixed、display 为 inline-block、flex、grid、overflow 不为 visible。

它的主要作用有三个：一是阻止相邻元素的 margin 重叠（属于不同 BFC 的元素 margin 不会合并）；二是清除浮动（BFC 会包含内部的浮动元素计算高度）；三是阻止浮动覆盖（BFC 不会与浮动元素重叠）。`,
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
    oralAnswer: `flex: 1 是一个简写，展开是 flex: 1 1 0%。三个值分别是 flex-grow: 1 表示占剩余空间的比例为 1；flex-shrink: 1 表示空间不足时可以缩小；flex-basis: 0% 表示初始大小为 0，纯按比例分配。

要和 flex: auto 和 flex: none 区分。flex: auto 是 1 1 auto，基于内容大小再分配剩余空间；flex: none 是 0 0 auto，完全不伸缩，固定大小；flex: 1 是 1 1 0%，忽略内容本身大小，纯按比例均分空间。

实际开发中 flex: 1 最常用，用于让元素均等分配容器空间或填满剩余空间。`,
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
    oralAnswer: `实现 16:9 等比例容器有两种方案。

传统方案是用 padding-top 百分比。因为 padding 的百分比是相对父元素宽度计算的，所以设置 padding-top: 56.25%（9/16）就能实现 16:9 比例。然后内容用绝对定位 inset: 0 填满容器。

现代方案是直接用 CSS 的 aspect-ratio 属性，写 aspect-ratio: 16 / 9 就行，简洁直观。兼容性已经很好了，Chrome 88、Firefox 89、Safari 15 以上都支持，推荐优先使用。`,
  },
];
