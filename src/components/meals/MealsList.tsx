import { useMemo } from 'react';
import { useMealStore } from '../../store/useMealStore';
import { MealCategorySection } from './MealCategorySection';
import type { MealCategory } from '../../types';

const CATEGORY_LABELS = {
    breakfast: 'Café da Manhã',
    lunch: 'Almoço',
    snack: 'Lanches',
    dinner: 'Jantar',
};

// Array to guarantee render order
const CATEGORY_ORDER: MealCategory[] = ['breakfast', 'lunch', 'snack', 'dinner'];

interface MealsListProps {
    onAddMeal?: (category: MealCategory) => void;
    onEditMeal?: (meal: any) => void;
}

export function MealsList({ onAddMeal, onEditMeal }: MealsListProps) {
    const { meals, selectedDateStr, removeMeal, updateMealCategory } = useMealStore();

    const todaysMeals = useMemo(
        () => meals.filter((meal) => meal.dateStr === selectedDateStr),
        [meals, selectedDateStr]
    );

    const handleAddClick = (category: MealCategory) => {
        if (onAddMeal) {
            onAddMeal(category);
        }
    };

    return (
        <div className="flex flex-col w-full">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-zinc-800 to-zinc-500 dark:from-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent mb-6">Refeições</h2>

            {CATEGORY_ORDER.map((category) => {
                const categoryMeals = todaysMeals.filter((m) => m.category === category);

                return (
                    <MealCategorySection
                        key={category}
                        title={CATEGORY_LABELS[category]}
                        meals={categoryMeals}
                        onRemove={removeMeal}
                        onChangeCategory={updateMealCategory}
                        onEdit={(meal) => onEditMeal?.(meal)}
                        onAddClick={() => handleAddClick(category)}
                    />
                );
            })}
        </div>
    );
}
