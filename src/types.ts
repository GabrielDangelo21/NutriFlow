export type MealCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface Meal {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    time: string; // "HH:mm" format
    category: MealCategory;
    dateStr: string; // "YYYY-MM-DD" format
    imageUrl?: string; // Base64 encoded image string or URL
}

export interface DailyGoals {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'athlete';
export type GoalType = 'lose' | 'maintain' | 'gain';
export type Gender = 'male' | 'female' | 'other';

export interface Profile {
    name: string;
    goals: DailyGoals;
    weight?: number;
    height?: number;
    birthDate?: string;
    gender?: Gender;
    activityLevel?: ActivityLevel;
    goalType?: GoalType;
    targetWeight?: number;
    avatarUrl?: string;
}
