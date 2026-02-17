
export type QuestionType = 'Pilihan Ganda' | 'Pilihan Jamak (MCMA)' | '(Benar/Salah)' | '(Sesuai/Tidak Sesuai)' | string;

export interface Question {
  no: number;
  tipe: QuestionType;
  level: string;
  materi: string;
  soal: string;
  img?: string;
  a: string;
  b: string;
  c: string;
  d: string;
  e?: string;
  kunci: string;
  pembahasan: string;
  token: string;
}

export interface HeaderInfo {
  schoolName: string;
  subject: string;
  grade: string;
  academicYear: string;
  timeLimit: string;
}

export interface AppSettings {
  columns: 1 | 2 | 3;
  showKop: boolean;
  showExplanation: boolean;
  fontSize: number;
  globalAlign: 'left' | 'center' | 'right' | 'justify';
}
