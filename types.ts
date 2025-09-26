
export interface Course {
  code: string;
  name: string;
  credits: number;
}

export type SemesterCourses = Record<string, Course[]>;

export type GradePoints = Record<string, number>;

export interface SemesterResult {
  id: number;
  totalCredits: number;
  totalPoints: number;
}
