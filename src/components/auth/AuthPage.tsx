import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Login } from './Login';
import { Register } from './Register';
import { useTheme } from '../../hooks/useTheme';
import { Moon, Sun } from 'lucide-react';

type AuthView = 'login' | 'register';

export function AuthPage() {
    const [view, setView] = useState<AuthView>('login');
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-300 font-sans flex flex-col">
            {/* Minimal header with theme toggle */}
            <div className="absolute top-4 right-4">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors outline-none"
                    aria-label="Toggle theme"
                >
                    {theme === 'light' ? <Moon size={20} className="text-zinc-600" /> : <Sun size={20} className="text-zinc-400" />}
                </button>
            </div>

            {/* Content centered */}
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <AnimatePresence mode="wait">
                    {view === 'login' ? (
                        <Login key="login" onSwitchToRegister={() => setView('register')} />
                    ) : (
                        <Register key="register" onSwitchToLogin={() => setView('login')} />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
