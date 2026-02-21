import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/logo.png';

interface LoginProps {
    onSwitchToRegister: () => void;
}

export function Login({ onSwitchToRegister }: LoginProps) {
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const { error: signInError } = await signIn(email, password);
        if (signInError) {
            setError(translateError(signInError));
        }
        setIsLoading(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-sm mx-auto"
        >
            <div className="text-center mb-8">
                <img src={logo} alt="NutriFlow Logo" className="w-16 h-16 mx-auto mb-4 rounded-2xl shadow-lg ring-1 ring-zinc-100 dark:ring-zinc-800" />
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
                    NutriFlow
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm">
                    Entre para acompanhar sua nutrição
                </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="p-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-100 dark:border-red-500/20"
                    >
                        {error}
                    </motion.div>
                )}

                <div className="relative">
                    <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="E-mail"
                        required
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-zinc-900 dark:text-white placeholder:text-zinc-400 transition-all"
                    />
                </div>

                <div className="relative">
                    <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Senha"
                        required
                        minLength={6}
                        className="w-full pl-11 pr-11 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-zinc-900 dark:text-white placeholder:text-zinc-400 transition-all"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 outline-none"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 focus-visible:ring-4 focus-visible:ring-emerald-500/30 outline-none mt-2"
                >
                    {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Entrar'}
                </button>
            </form>

            <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-6">
                Não tem conta?{' '}
                <button
                    onClick={onSwitchToRegister}
                    className="font-semibold text-emerald-500 hover:text-emerald-400 transition-colors outline-none"
                >
                    Criar conta
                </button>
            </p>
        </motion.div>
    );
}

function translateError(msg: string): string {
    if (msg.includes('Invalid login credentials')) return 'E-mail ou senha incorretos.';
    if (msg.includes('Email not confirmed')) return 'Confirme seu e-mail antes de entrar.';
    if (msg.includes('Too many requests')) return 'Muitas tentativas. Tente novamente em breve.';
    return msg;
}
