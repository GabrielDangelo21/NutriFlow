import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Meal, DailyGoals, MealCategory } from '../types';

interface MealState {
    selectedDateStr: string;
    meals: Meal[];
    goals: DailyGoals;
    loading: boolean;
    setSelectedDate: (dateStr: string) => void;
    addMeal: (meal: Omit<Meal, 'id'>) => Promise<void>;
    removeMeal: (id: string) => Promise<void>;
    updateMealCategory: (id: string, category: MealCategory) => Promise<void>;
    updateMeal: (id: string, meal: Partial<Omit<Meal, 'id'>>) => Promise<void>;
    updateGoals: (goals: DailyGoals) => Promise<void>;
    fetchMeals: () => Promise<void>;
    fetchGoals: () => Promise<void>;
    clearStore: () => void;
}

const getTodayStr = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const useMealStore = create<MealState>()((set) => ({
    selectedDateStr: getTodayStr(),
    meals: [],
    goals: {
        calories: 2000,
        protein: 150,
        carbs: 200,
        fat: 65,
    },
    loading: false,

    setSelectedDate: (dateStr) => set({ selectedDateStr: dateStr }),

    fetchMeals: async () => {
        set({ loading: true });
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { set({ loading: false }); return; }

        const { data, error } = await supabase
            .from('meals')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching meals:', error);
            set({ loading: false });
            return;
        }

        const meals: Meal[] = (data || []).map((row) => ({
            id: row.id,
            name: row.name,
            calories: row.calories,
            protein: row.protein,
            carbs: row.carbs,
            fat: row.fat,
            time: row.time,
            category: row.category,
            dateStr: row.date_str,
            imageUrl: row.image_url || undefined,
        }));

        set({ meals, loading: false });
    },

    fetchGoals: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from('profiles')
            .select('calories_goal, protein_goal, carbs_goal, fat_goal')
            .eq('id', user.id)
            .single();

        if (error) {
            console.error('Error fetching goals:', error);
            return;
        }

        set({
            goals: {
                calories: data.calories_goal,
                protein: data.protein_goal,
                carbs: data.carbs_goal,
                fat: data.fat_goal,
            },
        });
    },

    addMeal: async (meal) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase.from('meals').insert({
            user_id: user.id,
            name: meal.name,
            calories: meal.calories,
            protein: meal.protein,
            carbs: meal.carbs,
            fat: meal.fat,
            time: meal.time,
            category: meal.category,
            date_str: meal.dateStr,
            image_url: meal.imageUrl || null,
        }).select().single();

        if (error) {
            console.error('Error adding meal:', error);
            return;
        }

        const newMeal: Meal = {
            id: data.id,
            name: data.name,
            calories: data.calories,
            protein: data.protein,
            carbs: data.carbs,
            fat: data.fat,
            time: data.time,
            category: data.category,
            dateStr: data.date_str,
            imageUrl: data.image_url || undefined,
        };

        set((state) => ({ meals: [...state.meals, newMeal] }));
    },

    removeMeal: async (id) => {
        const { error } = await supabase.from('meals').delete().eq('id', id);
        if (error) {
            console.error('Error removing meal:', error);
            return;
        }
        set((state) => ({ meals: state.meals.filter((m) => m.id !== id) }));
    },

    updateMealCategory: async (id, category) => {
        const { error } = await supabase.from('meals').update({ category }).eq('id', id);
        if (error) {
            console.error('Error updating meal category:', error);
            return;
        }
        set((state) => ({
            meals: state.meals.map((m) => m.id === id ? { ...m, category: category as MealCategory } : m),
        }));
    },

    updateMeal: async (id, meal) => {
        const updates: any = {};
        if (meal.name !== undefined) updates.name = meal.name;
        if (meal.calories !== undefined) updates.calories = meal.calories;
        if (meal.protein !== undefined) updates.protein = meal.protein;
        if (meal.carbs !== undefined) updates.carbs = meal.carbs;
        if (meal.fat !== undefined) updates.fat = meal.fat;
        if (meal.time !== undefined) updates.time = meal.time;
        if (meal.category !== undefined) updates.category = meal.category;
        if (meal.dateStr !== undefined) updates.date_str = meal.dateStr;
        if (meal.imageUrl !== undefined) updates.image_url = meal.imageUrl || null;

        const { error } = await supabase.from('meals').update(updates).eq('id', id);
        if (error) {
            console.error('Error updating meal:', error);
            return;
        }

        set((state) => ({
            meals: state.meals.map((m) => m.id === id ? { ...m, ...meal } : m),
        }));
    },

    updateGoals: async (goals) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase.from('profiles').update({
            calories_goal: goals.calories,
            protein_goal: goals.protein,
            carbs_goal: goals.carbs,
            fat_goal: goals.fat,
            updated_at: new Date().toISOString(),
        }).eq('id', user.id);

        if (error) {
            console.error('Error updating goals:', error);
            return;
        }

        set({ goals });
    },

    clearStore: () => {
        set({
            meals: [],
            goals: { calories: 2000, protein: 150, carbs: 200, fat: 65 },
            selectedDateStr: getTodayStr(),
        });
    },
}));
