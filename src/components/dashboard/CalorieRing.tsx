import { motion } from 'framer-motion';

interface CalorieRingProps {
    consumed: number;
    goal: number;
}

export function CalorieRing({ consumed, goal }: CalorieRingProps) {
    const percentage = Math.min((consumed / goal) * 100, 100);
    const remaining = Math.max(goal - consumed, 0);
    const isOver = consumed > goal;

    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    // Determine color based on progress
    let ringColor = 'text-emerald-500 dark:text-emerald-400';
    if (isOver) {
        ringColor = 'text-red-500 dark:text-red-400';
    } else if (percentage > 85) {
        ringColor = 'text-amber-500 dark:text-amber-400';
    }

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800">
            <div className="relative flex items-center justify-center mb-6">
                {/* Background Ring */}
                <svg className="w-40 h-40 transform -rotate-90">
                    <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        className="text-zinc-100 dark:text-zinc-800"
                    />
                    {/* Progress Ring */}
                    <motion.circle
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        cx="80"
                        cy="80"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeLinecap="round"
                        className={ringColor}
                    />
                </svg>

                {/* Center Text */}
                <div className="absolute flex flex-col items-center justify-center text-center">
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`text-4xl font-bold tracking-tight ${isOver ? 'text-red-500 dark:text-red-400' : 'text-zinc-900 dark:text-zinc-50'}`}
                    >
                        {remaining}
                    </motion.span>
                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-1 uppercase tracking-wider">
                        {isOver ? 'Excedentes' : 'Restantes'}
                    </span>
                </div>
            </div>

            {/* Stats Below Ring */}
            <div className="flex justify-between w-full max-w-[200px] px-2 text-sm">
                <div className="flex flex-col items-center">
                    <span className="text-zinc-500 dark:text-zinc-400 font-medium mb-1">Consumidas</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-50">{consumed}</span>
                </div>
                <div className="w-px bg-zinc-200 dark:bg-zinc-800"></div>
                <div className="flex flex-col items-center">
                    <span className="text-zinc-500 dark:text-zinc-400 font-medium mb-1">Meta Dia</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-50">{goal}</span>
                </div>
            </div>

            {/* Goal percentage */}
            {consumed > 0 && (
                <span className={`text-xs font-semibold mt-2 ${
                    isOver
                        ? 'text-red-500 dark:text-red-400'
                        : percentage > 85
                        ? 'text-amber-500 dark:text-amber-400'
                        : 'text-emerald-500 dark:text-emerald-400'
                }`}>
                    {Math.round((consumed / goal) * 100)}% da meta
                </span>
            )}
        </div>
    );
}
