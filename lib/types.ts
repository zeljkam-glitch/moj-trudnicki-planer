export type AppSection = "today" | "appointments" | "story" | "preparations" | "bag" | "hospital" | "expenses" | "birth-plan" | "education" | "after-birth" | "notes" | "more";

export type ItemStatus = "need" | "planned" | "bought" | "gift" | "skip";
export type Priority = "essential" | "useful" | "later";
export type TaskOwner = "me" | "partner" | "together";
export type PlannerMode = "essential" | "complete";
export type MoodValue = "calm" | "tired" | "worried" | "good" | "rest";

export interface Settings {
  name: string;
  dueDate: string;
  hospital: string;
  hospitalAddress: string;
  hospitalPhone: string;
  supportPhone: string;
  firstPregnancy: boolean;
  trackExpenses: boolean;
  plannerMode: PlannerMode;
  onboardingComplete: boolean;
}

export interface PreparationItem {
  id: string;
  name: string;
  group: "mama" | "beba";
  category: string;
  priority: Priority;
  status: ItemStatus;
  quantity?: string;
  note?: string;
  plannedCost?: number;
  paidCost?: number;
  store?: string;
  plannedMonth?: string;
  phases?: ("before" | "hospital" | "after")[];
  custom?: boolean;
  owner?: TaskOwner;
}

export interface BagItem {
  id: string;
  name: string;
  bag: string;
  packed: boolean;
  custom?: boolean;
}

export interface Expense {
  id: string;
  name: string;
  category: string;
  planned: number;
  paid: number;
  isGift: boolean;
}

export interface BirthPlan {
  fullName: string;
  supportPerson: string;
  hospital: string;
  allergies: string;
  therapy: string;
  fears: string;
  atmosphere: string[];
  positions: string;
  induction: string;
  epidural: string;
  episiotomy: string;
  cesarean: string;
  skinToSkin: boolean;
  breastfeeding: boolean;
  cord: string;
  roomingIn: string;
  photos: string;
  babyExamWithMother: boolean;
  notes: string;
}

export interface AdminTask {
  id: string;
  name: string;
  description: string;
  deadline: string;
  completed: boolean;
}

export interface PregnancyStory {
  partnerName: string;
  babyName: string;
  lastPeriod: string;
  pregnancyFound: string;
  firstUltrasound: string;
  firstHeartbeat: string;
  firstMovement: string;
  firstBabyPurchase: string;
  nurseryReady: string;
  lastUltrasound: string;
  birthDate: string;
  healthGoals: string;
  birthGoals: string;
  wellbeingGoals: string;
  practicalGoals: string;
  homeGoals: string;
  postpartumGoals: string;
  advice: string[];
  compliments: string[];
  mantra: string;
}

export interface ReadingItem {
  id: string;
  title: string;
  author: string;
  topics: string;
  read: boolean;
  isbn?: string;
  url?: string;
  source?: string;
  custom?: boolean;
}

export interface CourseItem {
  id: string;
  name: string;
  location: string;
  duration: string;
  applyBy: string;
  registered: boolean;
  custom?: boolean;
}

export interface PlannerNote {
  id: string;
  title: string;
  body: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  questions: string[];
  notes: string;
  completed: boolean;
}

export interface MoodEntry {
  date: string;
  mood: MoodValue;
}

export interface PlannerState {
  settings: Settings;
  preparations: PreparationItem[];
  bagItems: BagItem[];
  expenses: Expense[];
  birthPlan: BirthPlan;
  adminTasks: AdminTask[];
  story: PregnancyStory;
  readingList: ReadingItem[];
  courses: CourseItem[];
  notes: PlannerNote[];
  appointments: Appointment[];
  moodEntries: MoodEntry[];
}
