export interface Question {
  id: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  answer: string;
  oralAnswer?: string;
}
