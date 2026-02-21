import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { DailyGoals } from '../types';

interface Profile {
    name: string;
    goals: DailyGoals;
}

interface AuthContextValue {
    user: User | null;
    session: Session | null;
    profile: Profile | null;
    loading: boolean;
    signUp: (email: string, password: string, name: string, caloriesGoal: number) => Promise<{ error: string | null }>;
    signIn: (email: string, password: string) => Promise<{ error: string | null }>;
    signOut: () => Promise<void>;
    updateProfile: (data: Partial<Profile & { goals: Partial<DailyGoals> }>) => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = useCallback(async (userId: string) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('name, calories_goal, protein_goal, carbs_goal, fat_goal')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching profile:', error);
            return;
        }

        setProfile({
            name: data.name,
            goals: {
                calories: data.calories_goal,
                protein: data.protein_goal,
                carbs: data.carbs_goal,
                fat: data.fat_goal,
            },
        });
    }, []);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
            if (currentSession?.user) {
                fetchProfile(currentSession.user.id);
            }
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
            setSession(newSession);
            setUser(newSession?.user ?? null);
            if (newSession?.user) {
                fetchProfile(newSession.user.id);
            } else {
                setProfile(null);
            }
        });

        return () => subscription.unsubscribe();
    }, [fetchProfile]);

    const signUp = async (email: string, password: string, name: string, caloriesGoal: number) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name },
            },
        });

        if (error) return { error: error.message };

        // Update the profile with the initial calorie goal
        const { data: { user: newUser } } = await supabase.auth.getUser();
        if (newUser) {
            await supabase.from('profiles').update({
                calories_goal: caloriesGoal,
                name,
            }).eq('id', newUser.id);
        }

        return { error: null };
    };

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { error: error.message };
        return { error: null };
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setProfile(null);
    };

    const updateProfile = async (data: Partial<Profile & { goals: Partial<DailyGoals> }>) => {
        if (!user) return;

        const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
        if (data.name !== undefined) updates.name = data.name;
        if (data.goals) {
            if (data.goals.calories !== undefined) updates.calories_goal = data.goals.calories;
            if (data.goals.protein !== undefined) updates.protein_goal = data.goals.protein;
            if (data.goals.carbs !== undefined) updates.carbs_goal = data.goals.carbs;
            if (data.goals.fat !== undefined) updates.fat_goal = data.goals.fat;
        }

        await supabase.from('profiles').update(updates).eq('id', user.id);
        await fetchProfile(user.id);
    };

    const refreshProfile = async () => {
        if (user) await fetchProfile(user.id);
    };

    return (
        <AuthContext.Provider value={{ user, session, profile, loading, signUp, signIn, signOut, updateProfile, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}
