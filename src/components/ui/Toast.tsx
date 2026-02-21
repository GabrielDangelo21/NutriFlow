import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useToastStore } from '../../store/useToastStore';
import type { Toast, ToastType } from '../../store/useToastStore';

const config: Record<ToastType, { icon: React.ReactNode; classes: string }> = {
    success: {
        icon: <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />,
        classes: 'bg-white dark:bg-zinc-900 border-emerald-200 dark:border-emerald-500/30',
    },
    error: {
        icon: <AlertCircle size={18} className="text-red-500 flex-shrink-0" />,
        classes: 'bg-white dark:bg-zinc-900 border-red-200 dark:border-red-500/30',
    },
    info: {
        icon: <Info size={18} className="text-blue-500 flex-shrink-0" />,
        classes: 'bg-white dark:bg-zinc-900 border-blue-200 dark:border-blue-500/30',
    },
};

function ToastItem({ toast }: { toast: Toast }) {
    const { removeToast } = useToastStore();
    const { icon, classes } = config[toast.type];

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-lg shadow-black/10 min-w-[260px] max-w-[340px] ${classes}`}
        >
            {icon}
            <span className="text-sm font-medium text-zinc-800 dark:text-zinc-100 flex-1">{toast.message}</span>
            <button
                onClick={() => removeToast(toast.id)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors flex-shrink-0"
            >
                <X size={14} />
            </button>
        </motion.div>
    );
}

export function ToastContainer() {
    const { toasts } = useToastStore();

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-[9999] items-center pointer-events-none">
            <AnimatePresence mode="sync">
                {toasts.map((toast) => (
                    <div key={toast.id} className="pointer-events-auto">
                        <ToastItem toast={toast} />
                    </div>
                ))}
            </AnimatePresence>
        </div>
    );
}
