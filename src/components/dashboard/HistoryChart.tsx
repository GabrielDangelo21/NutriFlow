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
    const { goals } = useMealStore();

    // Real implementation would read 7 days from the store.
    // For the V1 mock, we generate 7 days based on the current date,
    // heavily simplifying just to show the Recharts integration.
    const today = new Date();
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    const data = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (6 - i));

        const isToday = i === 6;
        let calories = 0;

        if (isToday) {
            calories = 1730; // Hardcoded mock
        } else {
            // Pseudo-random but deterministic for the render
            calories = goals.calories - 400 + (Math.sin(i) * 0.5 + 0.5) * 800;
        }

        return {
            name: days[d.getDay()],
            calories: Math.round(calories),
            isOver: calories > goals.calories,
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
