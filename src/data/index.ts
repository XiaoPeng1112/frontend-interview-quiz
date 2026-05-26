import { Question } from './types';
import { rnQuestions } from './rn-questions';
import { reactQuestions } from './react-questions';
import { jsQuestions } from './js-questions';
import { tsQuestions } from './ts-questions';
import { cssQuestions } from './css-questions';
import { networkQuestions } from './network-questions';
import { perfQuestions } from './perf-questions';
import { browserQuestions } from './browser-questions';
import { aiQuestions } from './ai-questions';
import { engineeringQuestions } from './engineering-questions';

export type { Question };

export const categories = [
  '全部',
  'React Native',
  'React',
  'JavaScript',
  'TypeScript',
  'CSS',
  '网络',
  '性能优化',
  '浏览器',
  'AI 前端',
  '工程化',
];

export const questions: Question[] = [
  ...rnQuestions,
  ...reactQuestions,
  ...jsQuestions,
  ...tsQuestions,
  ...cssQuestions,
  ...networkQuestions,
  ...perfQuestions,
  ...browserQuestions,
  ...aiQuestions,
  ...engineeringQuestions,
];
