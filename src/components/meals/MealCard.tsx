import { memo, useState, useRef, useEffect } from 'react';
import type { Meal, MealCategory } from '../../types';
import { Trash2, ArrowRightLeft, Pencil, Star } from 'lucide-react';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { useToastStore } from '../../store/useToastStore';

const CATEGORY_LABELS: Record<MealCategory, string> = {
    breakfast: 'Café da Manhã',
    lunch: 'Almoço',
    snack: 'Lanche',
    dinner: 'Jantar',
};

interface MealCardProps {
    meal: Meal;
    onRemove: (id: string) => void;
    onChangeCategory: (id: string, category: MealCategory) => void;
    onEdit: (meal: Meal) => void;
}

export const MealCard = memo(function MealCard({ meal, onRemove, onChangeCategory, onEdit }: MealCardProps) {
    const [showCategoryPicker, setShowCategoryPicker] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const otherCategories = (Object.keys(CATEGORY_LABELS) as MealCategory[]).filter(c => c !== meal.category);

    const { addFavorite, removeFavorite, isFavorite, favorites } = useFavoritesStore();
    const { addToast } = useToastStore();
    const favorited = isFavorite(meal.name);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                showCategoryPicker &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setShowCategoryPicker(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showCategoryPicker]);

    const handleToggleFavorite = () => {
        if (favorited) {
            const fav = favorites.find((f) => f.name === meal.name);
            if (fav) removeFavorite(fav.id);
            addToast('info', `"${meal.name}" removido dos favoritos.`);
        } else {
            addFavorite({
                name: meal.name,
                calories: meal.calories,
                protein: meal.protein,
                carbs: meal.carbs,
                fat: meal.fat,
            });
            addToast('success', `"${meal.name}" adicionado aos favoritos!`);
        }
    };

    return (
        <div className="group relative flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 hover:shadow-md hover:border-zinc-200 dark:hover:border-zinc-700 transition-all">

            {/* Thumbnail */}
            {meal.imageUrl && (
                <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-inner">
                    <img src={meal.imageUrl} alt={meal.name} className="w-full h-full object-cover" />
                </div>
            )}

            {/* Content */}
            <div className="flex-1 flex flex-col justify-center">
                {/* Top Row: Name and Calories */}
                <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 pr-2">
                        <h4 className="font-semibold text-zinc-900 dark:text-zinc-50 leading-tight line-clamp-1">{meal.name}</h4>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">{meal.time}</span>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <span className="font-bold text-zinc-900 dark:text-zinc-50">{meal.calories}</span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-1">kcal</span>
                    </div>
                </div>

                {/* Bottom Row: Macros Badges */}
                <div className="flex gap-2">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[11px] font-medium">
                        <span>P</span>
                        <span>{meal.protein}g</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-[11px] font-medium">
                        <span>C</span>
                        <span>{meal.carbs}g</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 text-[11px] font-medium">
                        <span>G</span>
                        <span>{meal.fat}g</span>
                    </div>
                </div>
            </div>

            {/* Action Buttons (visible on hover) */}
            <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                    onClick={handleToggleFavorite}
                    className={`bg-white dark:bg-zinc-800 p-2 rounded-full shadow-md outline-none transition-colors ${
                        favorited
                            ? 'text-amber-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                            : 'text-zinc-400 hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                    }`}
                    aria-label={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                    title={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                >
                    <Star size={14} fill={favorited ? 'currentColor' : 'none'} />
                </button>
                <button
                    ref={buttonRef}
                    onClick={() => setShowCategoryPicker(!showCategoryPicker)}
                    className="bg-white dark:bg-zinc-800 text-zinc-500 hover:text-indigo-500 p-2 rounded-full shadow-md outline-none hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                    aria-label="Mover refeição"
                    title="Mover para outra refeição"
                >
                    <ArrowRightLeft size={14} />
                </button>
                <button
                    onClick={() => onEdit(meal)}
                    className="bg-white dark:bg-zinc-800 text-zinc-500 hover:text-amber-500 p-2 rounded-full shadow-md outline-none hover:bg-amber-50 dark:hover:bg-amber-900/20"
                    aria-label="Editar refeição"
                    title="Editar refeição"
                >
                    <Pencil size={14} />
                </button>
                <button
                    onClick={() => onRemove(meal.id)}
                    className="bg-white dark:bg-zinc-800 text-red-500 p-2 rounded-full shadow-md outline-none hover:bg-red-50 dark:hover:bg-red-900/20"
                    aria-label="Remover refeição"
                >
                    <Trash2 size={14} />
                </button>
            </div>

            {/* Category Picker Dropdown */}
            {showCategoryPicker && (
                <div
                    ref={dropdownRef}
                    className="absolute top-full right-0 mt-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl z-20 overflow-hidden min-w-[160px]"
                >
                    <p className="px-3 py-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-700">Mover para</p>
                    {otherCategories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => {
                                onChangeCategory(meal.id, cat);
                                setShowCategoryPicker(false);
                            }}
                            className="w-full text-left px-3 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                        >
                            {CATEGORY_LABELS[cat]}
                        </button>
                    ))}
                </div>
            )}

        </div>
    );
});
