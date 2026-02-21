import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FavoriteItem {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

interface FavoritesState {
    favorites: FavoriteItem[];
    addFavorite: (item: Omit<FavoriteItem, 'id'>) => void;
    removeFavorite: (id: string) => void;
    isFavorite: (name: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
    persist(
        (set, get) => ({
            favorites: [],

            addFavorite: (item) => {
                const id = Date.now().toString();
                set((state) => ({
                    favorites: [...state.favorites, { ...item, id }],
                }));
            },

            removeFavorite: (id) => {
                set((state) => ({
                    favorites: state.favorites.filter((f) => f.id !== id),
                }));
            },

            isFavorite: (name) => {
                return get().favorites.some((f) => f.name === name);
            },
        }),
        { name: 'nutriflow-favorites' }
    )
);
