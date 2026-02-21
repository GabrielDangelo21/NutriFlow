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
