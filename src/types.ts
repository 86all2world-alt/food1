export interface CookingTip {
  scienceSecret: string;
  bestPairing: string;
  teacherWord: string;
}

export interface Ingredient {
  name: string;
  keyNutrients: string;
  growthHelp: string;
  cookingTip: CookingTip;
  safetyAlerts: string[];
}

export interface QuizItem {
  question: string;
  answer: boolean;
  explanation: string;
}

export interface LunchChallenge {
  menuName: string;
  description: string;
  benefitReason: string;
}

export interface SeasonalData {
  month: number;
  ingredients: Ingredient[];
  quiz: QuizItem[];
  lunchChallenge: LunchChallenge;
}

export interface GenerateRequest {
  sourceText: string;
  month: number;
  gradeLevel: string; // 'elementary' | 'middle' | 'high'
}

export interface GenerateResponse {
  success: boolean;
  data?: SeasonalData;
  error?: string;
  rawResponse?: string;
}
