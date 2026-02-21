import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, User } from 'lucide-react';
import { useMealStore } from '../store/useMealStore';
import { useAuth } from '../contexts/AuthContext';
import { useToastStore } from '../store/useToastStore';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const { goals, updateGoals } = useMealStore();
    const { profile, updateProfile } = useAuth();
    const { addToast } = useToastStore();

    const [name, setName] = useState(profile?.name || '');
    const [calories, setCalories] = useState(goals.calories.toString());
    const [protein, setProtein] = useState(goals.protein.toString());
    const [carbs, setCarbs] = useState(goals.carbs.toString());
    const [fat, setFat] = useState(goals.fat.toString());
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setName(profile?.name || '');
            setCalories(goals.calories.toString());
            setProtein(goals.protein.toString());
            setCarbs(goals.carbs.toString());
            setFat(goals.fat.toString());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const newGoals = {
            calories: Number(calories) || 2000,
            protein: Number(protein) || 0,
            carbs: Number(carbs) || 0,
            fat: Number(fat) || 0,
        };

        try {
            await updateGoals(newGoals);
            await updateProfile({ name, goals: newGoals });
            addToast('success', 'Metas salvas com sucesso!');
            onClose();
        } catch {
            addToast('error', 'Erro ao salvar metas. Tente novamente.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Perfil & Metas</h2>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none text-zinc-500 dark:text-zinc-400"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Form */}
                        <form id="settings-form" onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">

                            {/* Name field */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                    Nome
                                </label>
                                <div className="relative">
                                    <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Seu nome"
                                        className="w-full pl-11 pr-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-zinc-100"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                    Meta Diária (kcal)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="9999"
                                    required
                                    value={calories}
                                    onChange={(e) => setCalories(e.target.value)}
                                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-zinc-100 font-bold text-lg"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Proteína (g)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={protein}
                                        onChange={(e) => setProtein(e.target.value)}
                                        className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-zinc-100"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Carbs (g)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={carbs}
                                        onChange={(e) => setCarbs(e.target.value)}
                                        className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-zinc-100"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Gordura (g)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={fat}
                                        onChange={(e) => setFat(e.target.value)}
                                        className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-zinc-100"
                                    />
                                </div>
                            </div>

                        </form>

                        <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800">
                            <button
                                type="submit"
                                form="settings-form"
                                disabled={isSaving}
                                className="w-full py-3 flex items-center justify-center gap-2 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-xl font-bold transition-all focus-visible:ring-4 outline-none disabled:opacity-60"
                            >
                                <Check size={18} />
                                <span>{isSaving ? 'Salvando...' : 'Salvar'}</span>
                            </button>
                        </div>

                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
