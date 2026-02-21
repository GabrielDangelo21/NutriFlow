import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, BookOpen, Zap } from 'lucide-react';
import { useMealStore } from '../../store/useMealStore';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { FOOD_LIBRARY } from '../../data/foodLibrary';
import type { MealCategory, Meal } from '../../types';
import type { FoodItem } from '../../data/foodLibrary';

interface AddMealModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultCategory?: MealCategory;
    mealToEdit?: Meal | null;
}

export function AddMealModal({ isOpen, onClose, defaultCategory = 'breakfast', mealToEdit }: AddMealModalProps) {
    const { addMeal, updateMeal, selectedDateStr } = useMealStore();

    const [name, setName] = useState('');
    const [calories, setCalories] = useState('');
    const [protein, setProtein] = useState('');
    const [carbs, setCarbs] = useState('');
    const [fat, setFat] = useState('');
    const [time, setTime] = useState('');
    const [category, setCategory] = useState<MealCategory>(defaultCategory);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState('');
    const [quickTab, setQuickTab] = useState<'favorites' | 'library'>('favorites');

    const { favorites } = useFavoritesStore();

    const fillFromQuick = (item: FoodItem | { name: string; calories: number; protein: number; carbs: number; fat: number }) => {
        setName(item.name);
        setCalories(String(item.calories));
        setProtein(String(item.protein));
        setCarbs(String(item.carbs));
        setFat(String(item.fat));
        setFormError('');
    };

    // Set state when modal opens or mealToEdit changes
    useEffect(() => {
        if (isOpen) {
            setFormError('');
            if (mealToEdit) {
                setName(mealToEdit.name);
                setCalories(String(mealToEdit.calories));
                setProtein(String(mealToEdit.protein));
                setCarbs(String(mealToEdit.carbs));
                setFat(String(mealToEdit.fat));
                setTime(mealToEdit.time);
                setCategory(mealToEdit.category);
            } else {
                const now = new Date();
                setTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
                setCategory(defaultCategory);
                // Reset form
                setName('');
                setCalories('');
                setProtein('');
                setCarbs('');
                setFat('');
            }
        }
    }, [isOpen, mealToEdit, defaultCategory]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !calories) return;

        const caloriesNum = Number(calories);
        if (caloriesNum > 9999) {
            setFormError('O valor máximo de calorias por refeição é 9999 kcal.');
            return;
        }

        setFormError('');
        setIsSubmitting(true);

        try {
            if (mealToEdit) {
                await updateMeal(mealToEdit.id, {
                    name,
                    calories: caloriesNum,
                    protein: Number(protein) || 0,
                    carbs: Number(carbs) || 0,
                    fat: Number(fat) || 0,
                    time,
                    category,
                });
            } else {
                await addMeal({
                    name,
                    calories: caloriesNum,
                    protein: Number(protein) || 0,
                    carbs: Number(carbs) || 0,
                    fat: Number(fat) || 0,
                    time,
                    category,
                    dateStr: selectedDateStr,
                });
            }
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="relative w-full max-w-md bg-white dark:bg-zinc-950 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                            <h2 className="text-xl font-bold bg-gradient-to-r from-zinc-800 to-zinc-500 dark:from-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent">
                                {mealToEdit ? 'Editar Refeição' : 'Nova Refeição'}
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none text-zinc-500 dark:text-zinc-400"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="overflow-y-auto p-6 pt-4">
                            <form id="add-meal-form" onSubmit={handleSubmit} className="flex flex-col gap-5">

                                {/* Quick Start Section */}
                                {!mealToEdit && (
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <Zap size={14} className="text-amber-500" />
                                            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Início Rápido</span>
                                        </div>
                                        {/* Tabs */}
                                        <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1">
                                            <button
                                                type="button"
                                                onClick={() => setQuickTab('favorites')}
                                                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${quickTab === 'favorites' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 dark:text-zinc-400'}`}
                                            >
                                                <Star size={12} fill={quickTab === 'favorites' ? 'currentColor' : 'none'} />
                                                Favoritos
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setQuickTab('library')}
                                                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${quickTab === 'library' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 dark:text-zinc-400'}`}
                                            >
                                                <BookOpen size={12} />
                                                Biblioteca
                                            </button>
                                        </div>
                                        {/* Items scroll */}
                                        {quickTab === 'favorites' && favorites.length === 0 ? (
                                            <p className="text-xs text-zinc-400 dark:text-zinc-500 text-center py-3 italic">
                                                Toque em ★ em qualquer refeição para salvar aqui.
                                            </p>
                                        ) : (
                                            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
                                                {(quickTab === 'favorites' ? favorites : FOOD_LIBRARY).map((item) => (
                                                    <button
                                                        key={item.name}
                                                        type="button"
                                                        onClick={() => fillFromQuick(item)}
                                                        className="flex-shrink-0 flex flex-col items-start gap-0.5 px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all text-left"
                                                    >
                                                        <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 line-clamp-1 max-w-[120px]">{item.name}</span>
                                                        <span className="text-[10px] text-zinc-500 dark:text-zinc-400">{item.calories} kcal</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Name */}
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="name" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                        O que você comeu? *
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Ex: Tapioca com ovos"
                                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all dark:text-zinc-100"
                                    />
                                </div>

                                {/* Category & Time */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="category" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                            Refeição
                                        </label>
                                        <select
                                            id="category"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value as MealCategory)}
                                            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all dark:text-zinc-100 appearance-none"
                                        >
                                            <option value="breakfast">Café da Manhã</option>
                                            <option value="lunch">Almoço</option>
                                            <option value="snack">Lanche</option>
                                            <option value="dinner">Jantar</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="time" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                            Horário
                                        </label>
                                        <input
                                            id="time"
                                            type="time"
                                            required
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all dark:text-zinc-100"
                                        />
                                    </div>
                                </div>

                                {/* Calories */}
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="calories" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                        Calorias Totais (kcal) *
                                    </label>
                                    <input
                                        id="calories"
                                        type="number"
                                        min="0"
                                        max="9999"
                                        step="1"
                                        required
                                        value={calories}
                                        onChange={(e) => { setCalories(e.target.value); setFormError(''); }}
                                        placeholder="Ex: 350"
                                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all dark:text-zinc-100 font-bold text-lg"
                                    />
                                    {formError && (
                                        <p className="text-xs text-red-500 mt-0.5">{formError}</p>
                                    )}
                                </div>

                                {/* Macros */}
                                <div className="grid grid-cols-3 gap-3 pt-2">
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="protein" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Proteína (g)</label>
                                        <input
                                            id="protein"
                                            type="number"
                                            min="0"
                                            max="999"
                                            value={protein}
                                            onChange={(e) => setProtein(e.target.value)}
                                            placeholder="0"
                                            className="w-full px-3 py-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-900 dark:text-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="carbs" className="text-xs font-semibold text-blue-600 dark:text-blue-400">Carbs (g)</label>
                                        <input
                                            id="carbs"
                                            type="number"
                                            min="0"
                                            max="999"
                                            value={carbs}
                                            onChange={(e) => setCarbs(e.target.value)}
                                            placeholder="0"
                                            className="w-full px-3 py-2 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-900 dark:text-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="fat" className="text-xs font-semibold text-purple-600 dark:text-purple-400">Gordura (g)</label>
                                        <input
                                            id="fat"
                                            type="number"
                                            min="0"
                                            max="999"
                                            value={fat}
                                            onChange={(e) => setFat(e.target.value)}
                                            placeholder="0"
                                            className="w-full px-3 py-2 bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 text-purple-900 dark:text-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>

                            </form>
                        </div>

                        {/* Footer with Submit */}
                        <div className="p-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 pb-8 sm:pb-6 rounded-b-3xl">
                            <button
                                type="submit"
                                form="add-meal-form"
                                disabled={isSubmitting}
                                className="w-full py-4 px-6 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white rounded-xl font-bold transition-all focus-visible:ring-4 focus-visible:ring-emerald-500/30 outline-none shadow-lg shadow-emerald-500/20 disabled:opacity-60 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                        <span>Salvando...</span>
                                    </>
                                ) : (
                                    'Salvar Refeição'
                                )}
                            </button>
                        </div>

                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
