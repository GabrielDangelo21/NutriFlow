import { useMemo } from 'react';
import { useMealStore } from '../../store/useMealStore';
import { Flame, TrendingUp, Target } from 'lucide-react';

function getDateStr(daysAgo: number): string {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function WeeklySummary() {
    const { meals, goals } = useMealStore();

    const stats = useMemo(() => {
        const last7 = Array.from({ length: 7 }, (_, i) => getDateStr(6 - i));

        const dailyTotals = last7.map((dateStr) =>
            meals
                .filter((m) => m.dateStr === dateStr)
                .reduce((sum, m) => sum + m.calories, 0)
        );

        const daysWithMeals = dailyTotals.filter((c) => c > 0);
        const avgCalories = daysWithMeals.length > 0
            ? Math.round(daysWithMeals.reduce((a, b) => a + b, 0) / daysWithMeals.length)
            : 0;

        const isOnGoal = (cal: number) =>
            cal > 0 && cal >= goals.calories * 0.8 && cal <= goals.calories * 1.2;

        const daysOnGoal = dailyTotals.filter(isOnGoal).length;

        // Streak: count backwards from today
        let streak = 0;
        for (let i = 6; i >= 0; i--) {
            if (isOnGoal(dailyTotals[i])) {
                streak++;
            } else {
                break;
            }
        }

        return { avgCalories, daysOnGoal, streak };
    }, [meals, goals.calories]);

    const metrics = [
        {
            icon: <TrendingUp size={18} className="text-blue-500" />,
            label: 'Média diária',
            value: stats.avgCalories > 0 ? `${stats.avgCalories}` : '—',
            unit: stats.avgCalories > 0 ? 'kcal' : '',
            bg: 'bg-blue-50 dark:bg-blue-500/10',
        },
        {
            icon: <Target size={18} className="text-emerald-500" />,
            label: 'Dias na meta',
            value: `${stats.daysOnGoal}`,
            unit: '/ 7',
            bg: 'bg-emerald-50 dark:bg-emerald-500/10',
        },
        {
            icon: <Flame size={18} className="text-orange-500" />,
            label: 'Sequência',
            value: `${stats.streak}`,
            unit: stats.streak === 1 ? 'dia' : 'dias',
            bg: 'bg-orange-50 dark:bg-orange-500/10',
        },
    ];

    return (
        <div className="flex flex-col w-full mb-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-zinc-800 to-zinc-500 dark:from-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent mb-6">
                Resumo Semanal
            </h2>
            <div className="grid grid-cols-3 gap-3">
                {metrics.map((m) => (
                    <div
                        key={m.label}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl ${m.bg} border border-transparent`}
                    >
                        <div className="p-2 bg-white dark:bg-zinc-900 rounded-xl shadow-sm">
                            {m.icon}
                        </div>
                        <div className="text-center">
                            <div className="flex items-baseline justify-center gap-1">
                                <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{m.value}</span>
                                {m.unit && <span className="text-xs text-zinc-500 dark:text-zinc-400">{m.unit}</span>}
                            </div>
                            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-tight">{m.label}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
