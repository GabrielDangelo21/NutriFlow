import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../contexts/AuthContext';
import { Moon, Sun, LogOut } from 'lucide-react';
import logo from '../assets/logo.png';

interface AppLayoutProps {
    children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
    const { theme, toggleTheme } = useTheme();
    const { profile, signOut } = useAuth();

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-300 font-sans">
            <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-md">
                    <div className="flex items-center gap-2">
                        <img src={logo} alt="NutriFlow Logo" className="w-8 h-8 rounded-lg shadow-sm" />
                        <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
                            NutriFlow
                        </h1>
                        {profile?.name && (
                            <span className="text-xs text-zinc-400 dark:text-zinc-500 hidden sm:inline">
                                Olá, {profile.name.split(' ')[0]}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none"
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? <Moon size={20} className="text-zinc-600" /> : <Sun size={20} className="text-zinc-400" />}
                        </button>
                        <button
                            onClick={signOut}
                            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none"
                            aria-label="Sair"
                            title="Sair da conta"
                        >
                            <LogOut size={18} className="text-zinc-400 hover:text-red-500 transition-colors" />
                        </button>
                    </div>
                </div>
            </header>
            <main className="container mx-auto px-4 py-6 max-w-md">
                {children}
            </main>
        </div>
    );
}
