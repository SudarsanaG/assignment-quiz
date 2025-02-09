export interface Question {
    question: string;
    options: string[];
    correctAnswer: string;
  }
  
  export interface Quiz {
    title: string;
    questions: Question[];
  }
  