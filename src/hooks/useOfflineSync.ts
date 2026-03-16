import { useEffect, useCallback, useRef } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { supabase } from '../services/supabase';
import { useAppStore } from '../context/store';
import { PendingSyncItem } from '../types';

export const useOfflineSync = () => {
  const isSyncing = useRef(false);
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const pendingSync = useAppStore((state) => state.pendingSync);
  const clearPendingSync = useAppStore((state) => state.clearPendingSync);

  const processQueue = useCallback(async () => {
    if (!isAuthenticated || pendingSync.length === 0 || isSyncing.current) return;

    try {
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) return;

      isSyncing.current = true;
      const successfulIds: string[] = [];

      for (const item of pendingSync) {
        let success = false;
        try {
          // Serialize camelCase to snake_case payload based on the entity
          const { type, payload } = item;
          // E.g. queueSyncAction('FOOD_LOG', { foodName: 'Apple', calories: 95 })

          if (type === 'PROFILE_UPDATE') {
            const { error } = await supabase.from('users').upsert({
              id: payload.id,
              email: payload.email,
              name: payload.name,
              age: payload.age,
              gender: payload.gender,
              height_cm: payload.heightCm,
              weight_kg: payload.weightKg,
              activity_level: payload.activityLevel,
              bmr: payload.bmr,
              daily_calorie_goal: payload.dailyCalorieGoal,
              body_fat_percentage: payload.bodyFatPercentage,
              onboarding_completed: payload.onboardingCompleted,
              updated_at: new Date().toISOString(),
            });
            success = !error;
            if (error) console.error('Sync error PROFILE_UPDATE', error);

          } else if (type === 'FOOD_LOG') {
            const { error } = await supabase.from('food_logs').upsert({
              id: payload.id,
              user_id: payload.userId,
              food_name: payload.foodName,
              calories: payload.calories,
              protein_g: payload.proteinG,
              carbs_g: payload.carbsG,
              fat_g: payload.fatG,
              serving_size_g: payload.servingSizeG,
              source: payload.source,
              consumed_at: payload.consumedAt,
              date_key: payload.dateKey
            });
            success = !error;
            if (error) console.error('Sync error FOOD_LOG', error);

          } else if (type === 'WORKOUT_LOG') {
            const { error } = await supabase.from('workouts').upsert({
              id: payload.id,
              user_id: payload.userId,
              type: payload.type,
              duration_minutes: payload.durationMinutes,
              calories_burned: payload.caloriesBurned,
              completed_at: payload.completedAt,
              date_key: payload.dateKey
            });
            success = !error;
            if (error) console.error('Sync error WORKOUT_LOG', error);

          } else if (type === 'SCORE_ENTRY') {
            const { error } = await supabase.from('fitness_scores').upsert({
              id: payload.id,
              user_id: payload.userId,
              date_key: payload.dateKey,
              score: payload.score,
              reason: payload.reason,
            });
            success = !error;
            if (error) console.error('Sync error SCORE_ENTRY', error);
          }

          if (success) {
            successfulIds.push(item.id);
          }
        } catch (err) {
          console.error(`Error processing queue item ${item.id}`, err);
        }
      }

      if (successfulIds.length > 0) {
        clearPendingSync(successfulIds);
        useAppStore.setState({ lastSyncTime: new Date().toISOString() });
      }

    } finally {
      isSyncing.current = false;
    }
  }, [pendingSync, isAuthenticated, clearPendingSync]);

  // Listen to network changes
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected && pendingSync.length > 0) {
        processQueue();
      }
    });
    
    // Also try on mount
    processQueue();

    return unsubscribe;
  }, [processQueue, pendingSync.length]);
  
  return {
    isSyncing: isSyncing.current,
    pendingCount: pendingSync.length
  };
};
