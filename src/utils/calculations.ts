import { Gender, ActivityLevel } from '../types';

/**
 * Calculates Basal Metabolic Rate using the Mifflin-St Jeor Equation
 */
export const calculateBMR = (
  weightKg: number,
  heightCm: number,
  age: number,
  gender: Gender
): number => {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === 'female' ? base - 161 : base + 5;
};

/**
 * Multiplies BMR by activity multiplier to get TDEE (Total Daily Energy Expenditure)
 * Subtracts an aggressive deficit since it's a fitness/dieting app context.
 */
export const calculateDailyCalorieGoal = (bmr: number, activityLevel: ActivityLevel): number => {
  let multiplier = 1.2;
  switch (activityLevel) {
    case 'sedentary': multiplier = 1.2; break;
    case 'light': multiplier = 1.375; break;
    case 'moderate': multiplier = 1.55; break;
    case 'active': multiplier = 1.725; break;
    case 'very_active': multiplier = 1.9; break;
  }
  
  const tdee = Math.round(bmr * multiplier);
  // Default to a 500 cal deficit for weight loss, but never below 1200 for safety
  return Math.max(1200, tdee - 500);
};

export const calculateBodyFatEstimate = (weightKg: number, heightCm: number, age: number, gender: Gender): number => {
  // Very rough BMI-based body fat estimation formula
  const bmi = weightKg / Math.pow(heightCm / 100, 2);
  const bf = gender === 'female'
    ? 1.20 * bmi + 0.23 * age - 5.4
    : 1.20 * bmi + 0.23 * age - 16.2;
  
  return Math.max(5, Math.min(60, Number(bf.toFixed(1)))); // Clamp between 5 and 60%
};
