import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { storage } from '../services/storage';
import { UserProfile, FoodLog, WorkoutLog, FitnessScoreInfo, PendingSyncItem, QueueActionType } from '../types';
import { calculateBMR, calculateDailyCalorieGoal, calculateBodyFatEstimate } from '../utils/calculations';

// MMKV wrapper for Zustand persist middleware
const zustandStorage = {
  setItem: (name: string, value: string) => storage.set(name, value),
  getItem: (name: string) => storage.getString(name) ?? null,
  removeItem: (name: string) => storage.delete(name),
};

interface AppState {
  // Session / Auth
  isAuthenticated: boolean;
  sessionUserId: string | null;
  sessionEmail: string | null;
  
  // Local Data Models
  profile: UserProfile | null;
  foodLogs: FoodLog[];
  workouts: WorkoutLog[];
  scoreEntries: FitnessScoreInfo[];
  
  // Sync Queue
  pendingSync: PendingSyncItem[];
  
  // Aggregated Cache (Calculated or fetched from RPC)
  lastSyncTime: string | null;
  totalScore: number;
  currentStreak: number;
  
  // Actions
  loginAsGuest: () => void;
  logout: () => void;
  saveProfile: (updates: Partial<UserProfile>) => void;
  addFoodLog: (log: Omit<FoodLog, 'id' | 'syncStatus'>) => void;
  addWorkout: (log: Omit<WorkoutLog, 'id' | 'syncStatus'>) => void;
  addScoreEntry: (entry: Omit<FitnessScoreInfo, 'id' | 'syncStatus'>) => void;
  queueSyncAction: (type: QueueActionType, payload: any) => void;
  clearPendingSync: (itemIdsToRemove: string[]) => void;
}

const generateLocalId = () => Math.random().toString(36).substring(2, 15);

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      sessionUserId: null,
      sessionEmail: null,
      
      profile: null,
      foodLogs: [],
      workouts: [],
      scoreEntries: [],
      
      pendingSync: [],
      
      lastSyncTime: null,
      totalScore: 0,
      currentStreak: 0,
      
      loginAsGuest: () => set({
        isAuthenticated: true,
        sessionUserId: 'guest-local-id',
        sessionEmail: 'guest@fitboss.local'
      }),
      
      logout: () => set({
        isAuthenticated: false,
        sessionUserId: null,
        sessionEmail: null
      }),
      
      queueSyncAction: (type, payload) => {
        const item: PendingSyncItem = {
          id: generateLocalId(),
          type,
          payload,
          createdAt: new Date().toISOString(),
          retryCount: 0
        };
        set((state) => ({ pendingSync: [...state.pendingSync, item] }));
      },
      
      clearPendingSync: (idsToRemove) => {
        set((state) => ({
          pendingSync: state.pendingSync.filter(item => !idsToRemove.includes(item.id))
        }));
      },
      
      saveProfile: (updates) => set((state) => {
        const existing = state.profile || {} as UserProfile;
        const merged = { ...existing, ...updates };
        
        // Auto-recalculate metrics on profile update
        if (merged.weightKg && merged.heightCm && merged.age && merged.gender) {
          merged.bmr = calculateBMR(merged.weightKg, merged.heightCm, merged.age, merged.gender);
          merged.dailyCalorieGoal = calculateDailyCalorieGoal(merged.bmr, merged.activityLevel || 'sedentary');
          merged.bodyFatPercentage = calculateBodyFatEstimate(merged.weightKg, merged.heightCm, merged.age, merged.gender);
        }
        
        get().queueSyncAction('PROFILE_UPDATE', merged);
        return { profile: merged as UserProfile };
      }),
      
      addFoodLog: (log) => set((state) => {
        const newLog: FoodLog = { ...log, id: generateLocalId(), syncStatus: 'pending' };
        get().queueSyncAction('FOOD_LOG', newLog);
        return { foodLogs: [...state.foodLogs, newLog] };
      }),
      
      addWorkout: (log) => set((state) => {
        const newLog: WorkoutLog = { ...log, id: generateLocalId(), syncStatus: 'pending' };
        get().queueSyncAction('WORKOUT_LOG', newLog);
        return { workouts: [...state.workouts, newLog] };
      }),
      
      addScoreEntry: (entry) => set((state) => {
        const newEntry: FitnessScoreInfo = { ...entry, id: generateLocalId(), syncStatus: 'pending' };
        get().queueSyncAction('SCORE_ENTRY', newEntry);
        return { 
          scoreEntries: [...state.scoreEntries, newEntry],
          totalScore: state.totalScore + newEntry.score
        };
      })
    }),
    {
      name: 'fitboss-zustand-store',
      storage: createJSONStorage(() => zustandStorage)
    }
  )
);
