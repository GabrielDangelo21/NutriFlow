import { Plus } from 'lucide-react';
import type { Meal, MealCategory } from '../../types';
import { MealCard } from './MealCard';

interface MealCategorySectionProps {
    title: string;
    meals: Meal[];
    onRemove: (id: string) => void;
    onChangeCategory: (id: string, category: MealCategory) => void;
    onEdit: (meal: Meal) => void;
    onAddClick: () => void;
}

export function MealCategorySection({ title, meals, onRemove, onChangeCategory, onEdit, onAddClick }: MealCategorySectionProps) {
    const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);

    return (
        <div className="flex flex-col mb-6">
            {/* Category Header */}
            <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">{title}</h3>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                        {totalCalories} kcal
                    </span>
                    <button
                        onClick={onAddClick}
                        className="p-1 rounded-full text-zinc-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors cursor-pointer"
                        aria-label={`Adicionar a ${title}`}
                    >
                        <Plus size={20} />
                    </button>
                </div>
            </div>

            {/* Meals List */}
            {meals.length > 0 ? (
                <div className="flex flex-col gap-3">
                    {meals.map((meal) => (
                        <MealCard key={meal.id} meal={meal} onRemove={onRemove} onChangeCategory={onChangeCategory} onEdit={onEdit} />
                    ))}
                </div>
            ) : (
                /* Empty State */
                <div className="flex items-center justify-center p-6 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/50">
                    <span className="text-sm text-zinc-400 dark:text-zinc-500 font-medium">Nenhum item adicionado</span>
                </div>
            )}
        </div>
    );
}
