import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface MacroPieChartProps {
    protein: number;
    carbs: number;
    fat: number;
}

const MACROS = [
    { key: 'carbs', label: 'Carboidratos', color: '#3b82f6' },
    { key: 'protein', label: 'Proteínas', color: '#10b981' },
    { key: 'fat', label: 'Gorduras', color: '#a855f7' },
] as const;

interface TooltipProps {
    active?: boolean;
    payload?: Array<{ name: string; value: number; payload: { label: string } }>;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-zinc-800 px-3 py-2 rounded-xl shadow-xl border border-zinc-100 dark:border-zinc-700 text-xs">
                <span className="font-semibold text-zinc-800 dark:text-zinc-100">{payload[0].payload.label}</span>
                <span className="text-zinc-500 dark:text-zinc-400 ml-1">{payload[0].value}%</span>
            </div>
        );
    }
    return null;
};

export function MacroPieChart({ protein, carbs, fat }: MacroPieChartProps) {
    const total = protein + carbs + fat;

    if (total === 0) {
        return (
            <div className="flex flex-col gap-4 p-5 bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800">
                <p className="text-sm font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Distribuição de Macros</p>
                <p className="text-sm text-zinc-400 dark:text-zinc-500 text-center py-4">Sem dados hoje</p>
            </div>
        );
    }

    const data = MACROS.map(({ key, label, color }) => {
        const value = key === 'carbs' ? carbs : key === 'protein' ? protein : fat;
        return {
            label,
            color,
            value: Math.round((value / total) * 100),
            grams: value,
        };
    });

    return (
        <div className="flex flex-col gap-4 p-5 bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800">
            <p className="text-sm font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Distribuição de Macros</p>
            <div className="flex items-center gap-4">
                {/* Donut */}
                <div className="w-28 h-28 flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={32}
                                outerRadius={52}
                                dataKey="value"
                                strokeWidth={2}
                                stroke="transparent"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="flex flex-col gap-2 flex-1">
                    {data.map((entry) => (
                        <div key={entry.label} className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
                                <span className="text-xs text-zinc-600 dark:text-zinc-400">{entry.label}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50">{entry.value}%</span>
                                <span className="text-[10px] text-zinc-400">({entry.grams}g)</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
