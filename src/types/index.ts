export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type NutritionSource = 'usda' | 'openfoodfacts' | 'manual';
export type SyncStatus = 'synced' | 'pending' | 'failed';
export type Gender = 'male' | 'female' | 'other';
export type QueueActionType = 'PROFILE_UPDATE' | 'FOOD_LOG' | 'WORKOUT_LOG' | 'SCORE_ENTRY';

export interface UserProfile {
  id: string; // uuid
  email?: string;
  name: string;
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  bodyFatPercentage?: number;
  bmr: number;
  dailyCalorieGoal: number;
  onboardingCompleted: boolean;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface FoodLog {
  id: string; // uuid
  userId: string;
  foodName: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  servingSizeG: number;
  source: NutritionSource;
  consumedAt: string; // ISO dates for the logs
  dateKey: string; // YYYY-MM-DD for fast querying
  syncStatus: SyncStatus;
}

export interface WorkoutLog {
  id: string; // uuid
  userId: string;
  type: string;
  durationMinutes: number;
  caloriesBurned?: number;
  completedAt: string; // ISO
  dateKey: string; // YYYY-MM-DD
  syncStatus: SyncStatus;
}

export interface FitnessScoreInfo {
  id: string; // uuid
  userId: string;
  dateKey: string; // YYYY-MM-DD
  score: number;
  reason: 'daily_rollup' | 'workout_bonus' | 'calorie_goal_met' | 'manual';
  createdAt: string; // ISO
  syncStatus: SyncStatus;
}

export interface PendingSyncItem {
  id: string; // local uuid for the queue item itself
  type: QueueActionType;
  payload: any;
  createdAt: string; // ISO
  retryCount: number;
}
