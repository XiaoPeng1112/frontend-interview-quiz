import { Question } from './types';
import { rnQuestions } from './rn-questions';
import { rnAdvancedQuestions } from './rn-advanced-questions';
import { reactQuestions } from './react-questions';
import { jsQuestions } from './js-questions';
import { tsQuestions } from './ts-questions';
import { cssQuestions } from './css-questions';
import { networkQuestions } from './network-questions';
import { perfQuestions } from './perf-questions';
import { browserQuestions } from './browser-questions';
import { aiQuestions } from './ai-questions';
import { aiAdvancedQuestions } from './ai-advanced-questions';
import { engineeringQuestions } from './engineering-questions';
import { architectureQuestions } from './architecture-questions';

export type { Question };

export const categories = [
  '全部',
  'React Native',
  'RN 架构深度',
  'React',
  'JavaScript',
  'TypeScript',
  'CSS',
  '网络',
  '性能优化',
  '浏览器',
  'AI 前端',
  'AI Native',
  '工程化',
  '架构设计',
];

export const questions: Question[] = [
  ...rnQuestions,
  ...rnAdvancedQuestions,
  ...reactQuestions,
  ...jsQuestions,
  ...tsQuestions,
  ...cssQuestions,
  ...networkQuestions,
  ...perfQuestions,
  ...browserQuestions,
  ...aiQuestions,
  ...aiAdvancedQuestions,
  ...engineeringQuestions,
  ...architectureQuestions,
];
