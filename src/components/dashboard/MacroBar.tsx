import { motion } from 'framer-motion';

interface MacroBarProps {
    label: string;
    consumed: number;
    goal: number;
    baseColorClass: string; // e.g., 'bg-blue-500'
}

export function MacroBar({ label, consumed, goal, baseColorClass }: MacroBarProps) {
    const percentage = Math.min((consumed / goal) * 100, 100);
    const isOver = consumed > goal;
    const isWarning = percentage > 85 && percentage <= 100;

    // Determine actual color based on progress status
    let barColor = baseColorClass;
    if (isOver) barColor = 'bg-red-500 dark:bg-red-400';
    else if (isWarning) barColor = 'bg-amber-500 dark:bg-amber-400';

    return (
        <div className="flex flex-col w-full">
            <div className="flex justify-between items-end mb-1.5">
                <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{label}</span>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    <span className={`font-medium ${isOver ? 'text-red-500 dark:text-red-400' : 'text-zinc-900 dark:text-zinc-100'}`}>
                        {consumed}g
                    </span>
                    <span className="mx-0.5">/</span>
                    <span>{goal}g</span>
                </div>
            </div>

            {/* Background Track */}
            <div className="h-2.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                {/* Fill */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`h-full rounded-full ${barColor}`}
                />
            </div>
        </div>
    );
}
