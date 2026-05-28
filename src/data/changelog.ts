export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  changes: {
    type: 'feature' | 'optimize' | 'fix';
    description: string;
    detail?: string;
  }[];
}

export const changelog: ChangelogEntry[] = [
  {
    version: '2.1.0',
    date: '2025-05-28',
    title: '性能优化 & 体验升级',
    changes: [
      {
        type: 'optimize',
        description: 'Code Splitting — Markdown 渲染器懒加载',
        detail: '将 react-syntax-highlighter + ReactMarkdown 拆为独立 chunk（275KB），仅在展开答案时按需加载。首屏 JS 从 562KB 降至 290KB，减少 48%。',
      },
      {
        type: 'optimize',
        description: 'App.tsx 职责拆分 — 自定义 Hooks 提取',
        detail: '从 App.tsx 抽出 useAuth、useFavorites、useSync、useInterviewHistory、useTheme 五个自定义 Hook，主文件从复杂业务逻辑简化为纯组合层，可维护性大幅提升。',
      },
      {
        type: 'optimize',
        description: 'Tab 懒挂载策略',
        detail: '替代原有 display:none 始终挂载全部 Tab 的方式，改为 mountedTabs Set 跟踪已激活 Tab，首次切换才挂载组件，之后保活不销毁，减少初始渲染负担。',
      },
      {
        type: 'optimize',
        description: '列表增量加载（IntersectionObserver）',
        detail: '首屏仅渲染 20 条题目，通过 IntersectionObserver 监测滚动到底部自动加载更多（每次 +20），避免一次性渲染数百张卡片导致的卡顿。',
      },
      {
        type: 'feature',
        description: '随机刷题模式',
        detail: '题库页标题栏新增「随机一题」按钮，点击随机抽取当前分类下的题目，以弹窗形式展示，方便快速复习。',
      },
      {
        type: 'feature',
        description: '深色 / 浅色主题切换',
        detail: '页面右上角新增主题切换按钮，支持深色（默认）和浅色两种主题。基于 CSS 自定义属性 + data-theme 属性实现，偏好自动持久化到 localStorage。',
      },
      {
        type: 'optimize',
        description: 'PWA 离线支持确认',
        detail: '确认 Service Worker 已正确配置注册，支持离线访问和添加到主屏幕。',
      },
    ],
  },
  {
    version: '2.0.0',
    date: '2025-05-27',
    title: '全题库口语版答案 & UI 优化',
    changes: [
      {
        type: 'feature',
        description: '全部题目新增 oralAnswer（口语版答案）',
        detail: '为所有 13 个数据文件、数百道题目添加了口语化面试回答版本，方便模拟真实面试场景练习。',
      },
      {
        type: 'fix',
        description: '修复切换 Tag 到「全部」不滚动到顶部的问题',
      },
      {
        type: 'fix',
        description: 'UI 间距优化',
        detail: '统一各区域间距，修复 stats-bar 与 sync-panel 之间、筛选栏与列表之间的间距不一致问题。',
      },
      {
        type: 'optimize',
        description: '收藏页 Tag 尺寸缩小',
        detail: '缩小收藏页顶部筛选 Tag 的 padding 和字号，视觉更紧凑。',
      },
    ],
  },
  {
    version: '1.0.0',
    date: '2025-05-25',
    title: '初始版本',
    changes: [
      {
        type: 'feature',
        description: '前端面试题库上线',
        detail: '涵盖 React Native、React、JavaScript、TypeScript、CSS、网络、性能优化、浏览器、AI 前端、工程化、架构设计等 15+ 分类。',
      },
      {
        type: 'feature',
        description: '收藏 & 标记系统',
        detail: '支持收藏、已掌握、薄弱三种标记，数据持久化到 localStorage。',
      },
      {
        type: 'feature',
        description: 'GitHub OAuth + Gist 云同步',
        detail: '支持 GitHub 登录，将收藏和标记数据同步到 Gist，实现多设备共享。',
      },
      {
        type: 'feature',
        description: '模拟面试模式',
        detail: '支持选题、计时、面试流程模拟和历史记录回顾。',
      },
    ],
  },
];
