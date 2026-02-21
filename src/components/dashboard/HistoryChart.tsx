import { useMealStore } from '../../store/useMealStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useTheme } from '../../hooks/useTheme';

interface ChartPayload {
    name: string;
    calories: number;
    isOver: boolean;
    isToday: boolean;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: ReadonlyArray<{ value?: number; payload: ChartPayload }>;
    goals?: {
        calories: number;
    };
}

const CustomTooltip = ({ active, payload, goals }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
        const isOver = (payload[0].payload as { name: string; isOver: boolean }).isOver;
        return (
            <div className="bg-white dark:bg-zinc-800 p-3 rounded-xl shadow-xl border border-zinc-100 dark:border-zinc-700">
                <p className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">{payload[0].payload.name}</p>
                <p className={`font-semibold ${isOver ? 'text-red-500' : 'text-emerald-500'}`}>
                    {payload[0].value} kcal
                </p>
                <p className="text-xs text-zinc-500 mt-1">Meta: {goals?.calories || 2000}</p>
            </div>
        );
    }
    return null;
};

export function HistoryChart() {
    const { theme } = useTheme();
    const { meals, goals } = useMealStore();

    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    const data = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));

        // Format date string to match store format (YYYY-MM-DD)
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        // Aggregate calories for this specific date
        const dailyCalories = meals
            .filter(meal => meal.dateStr === dateStr)
            .reduce((sum, meal) => sum + meal.calories, 0);

        const isToday = i === 6;

        return {
            name: days[d.getDay()],
            calories: dailyCalories,
            isOver: dailyCalories > goals.calories,
            isToday
        };
    });

    return (
        <div className="flex flex-col w-full mb-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-zinc-800 to-zinc-500 dark:from-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent mb-6">
                Últimos 7 dias
            </h2>
            <div className="h-64 w-full bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 p-4 pt-6">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: theme === 'dark' ? '#71717a' : '#a1a1aa', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: theme === 'dark' ? '#71717a' : '#a1a1aa', fontSize: 12 }}
                        />
                        <Tooltip content={(props) => <CustomTooltip {...(props as CustomTooltipProps)} goals={goals} />} cursor={{ fill: theme === 'dark' ? '#27272a' : '#f4f4f5' }} />
                        <Bar dataKey="calories" radius={[6, 6, 6, 6]} maxBarSize={40}>
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.isOver ? (theme === 'dark' ? '#f87171' : '#ef4444') : (theme === 'dark' ? '#34d399' : '#10b981')}
                                    opacity={entry.isToday ? 1 : 0.6}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
