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
import { resumeQuestions } from './resume-questions';
import { resumeRound1Questions } from './resume-round1-questions';
import { resumeRound2Questions } from './resume-round2-questions';

export type { Question };

export const categories = [
  '全部',
  '简历针对',
  '一面追问',
  '二面深度',
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
  ...resumeQuestions,
  ...resumeRound1Questions,
  ...resumeRound2Questions,
];
