import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
    id: string;
    type: ToastType;
    message: string;
}

interface ToastState {
    toasts: Toast[];
    addToast: (type: ToastType, message: string, duration?: number) => void;
    removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>()((set) => ({
    toasts: [],

    addToast: (type, message, duration = 4000) => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        set((state) => ({ toasts: [...state.toasts, { id, type, message }] }));
        setTimeout(() => {
            set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
        }, duration);
    },

    removeToast: (id) => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    },
}));
