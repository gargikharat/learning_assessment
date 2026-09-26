export type UserRole = 'learner' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  designation: string;
  department: string;
  cadre: string;
  employeeId: string;
  email: string;
  avatarUrl?: string;
  overallProgress: number;
  skillsImprovedCount: number;
  completedCoursesCount: number;
  averageQuizScore: number;
}

export type SkillLevel = 'None' | 'Beginner' | 'Intermediate' | 'Advanced';
export type SkillCategory = 'Statistical' | 'Technical' | 'Governance' | 'Operations';
export type GapPriority = 'High' | 'Medium' | 'Low';

export interface SkillItem {
  id: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  proficiencyScore: number; // 0 - 100
  lastAssessed: string;
  trend: 'up' | 'stable' | 'down';
}

export interface SkillGapItem {
  id: string;
  name: string;
  category: SkillCategory;
  current: SkillLevel;
  required: SkillLevel;
  currentScore: number;
  requiredScore: number;
  gapLevel: GapPriority;
  gapPercent: number; // percentage gap
  description: string;
  targetRole: string;
}

export interface Course {
  id: string;
  title: string;
  source: 'iGOT' | 'NSSTA';
  category: SkillCategory;
  duration: string;
  level: SkillLevel;
  impact: string;
  description: string;
  modulesCount: number;
  rating: number;
  learnersEnrolled: number;
  skillsAddressed: string[];
  syllabus: {
    title: string;
    duration: string;
    completed?: boolean;
    summary: string;
  }[];
  isEnrolled?: boolean;
  progressPercent?: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  referenceSource?: string;
}

export interface Assessment {
  id: string;
  title: string;
  targetSkill: string;
  category: SkillCategory;
  difficulty: SkillLevel;
  questions: QuizQuestion[];
  durationMinutes: number;
  passingScorePercent: number;
  sourceManual?: string;
  createdBy: 'AI Generator' | 'NSSTA Faculty';
  status?: 'Available' | 'Completed';
  lastScore?: number;
  completedAt?: string;
}

export interface DepartmentMetric {
  department: string;
  headcount: number;
  avgProficiency: number;
  highGapCount: number;
  completionRate: number;
}

export interface TraineeRecord {
  id: string;
  name: string;
  cadre: string;
  department: string;
  designation: string;
  readinessScore: number;
  topGap: string;
  enrolledPath: string;
  status: 'On Track' | 'Needs Attention' | 'Certified';
}

export interface UserCourseProgress {
  userId: string;
  courseId: string;
  completedModules: number[];
  progressPercent: number;
  isCompleted: boolean;
  lastAccessed: string;
}

export interface AssessmentResultRecord {
  id: string;
  userId: string;
  assessmentId: string;
  assessmentTitle: string;
  targetSkill: string;
  score: number;
  passed: boolean;
  completedAt: string;
  answers?: Record<number, string>;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'achievement' | 'alert' | 'quiz' | 'schedule';
  read: boolean;
  createdAt?: string;
}
