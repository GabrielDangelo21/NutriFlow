import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Flame, Loader2, Eye, EyeOff, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/logo.png';

interface RegisterProps {
    onSwitchToLogin: () => void;
}

export function Register({ onSwitchToLogin }: RegisterProps) {
    const { signIn, signUp } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [caloriesGoal, setCaloriesGoal] = useState(2000);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const passwordChecks = {
        length: password.length >= 6,
        hasLetter: /[a-zA-Z]/.test(password),
        hasNumber: /\d/.test(password),
    };
    const isPasswordValid = passwordChecks.length && passwordChecks.hasLetter && passwordChecks.hasNumber;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isPasswordValid) return;

        setError(null);
        setIsLoading(true);

        const { error: signUpError } = await signUp(email, password, name, caloriesGoal);
        if (signUpError) {
            setError(translateError(signUpError));
            setIsLoading(false);
            return;
        }

        // Try to auto-login after signup
        const { error: signInError } = await signIn(email, password);
        if (signInError) {
            // If email confirmation is required, show success message
            setSuccess(true);
        }
        setIsLoading(false);
    };

    if (success) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-sm mx-auto text-center"
            >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                    <Check size={32} className="text-emerald-500" />
                </div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Conta criada!</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                    Verifique seu e-mail para confirmar a conta e depois faça login.
                </p>
                <button
                    onClick={onSwitchToLogin}
                    className="font-semibold text-emerald-500 hover:text-emerald-400 transition-colors outline-none"
                >
                    Ir para Login
                </button>
            </motion.div>
        );
    }

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
                    Crie sua conta para começar
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

                {/* Name */}
                <div className="relative">
                    <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nome"
                        required
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-zinc-900 dark:text-white placeholder:text-zinc-400 transition-all"
                    />
                </div>

                {/* Email */}
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

                {/* Password */}
                <div className="relative">
                    <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Senha"
                        required
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

                {/* Password strength indicators */}
                {password.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="flex flex-wrap gap-2 text-xs"
                    >
                        <PasswordCheck valid={passwordChecks.length} label="6+ caracteres" />
                        <PasswordCheck valid={passwordChecks.hasLetter} label="Letra" />
                        <PasswordCheck valid={passwordChecks.hasNumber} label="Número" />
                    </motion.div>
                )}

                {/* Calorie goal */}
                <div className="relative">
                    <Flame size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                        type="number"
                        value={caloriesGoal}
                        onChange={(e) => setCaloriesGoal(Number(e.target.value))}
                        placeholder="Meta diária de calorias"
                        min={500}
                        max={10000}
                        required
                        className="w-full pl-11 pr-16 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-zinc-900 dark:text-white placeholder:text-zinc-400 transition-all"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">kcal</span>
                </div>

                <button
                    type="submit"
                    disabled={isLoading || !isPasswordValid}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 focus-visible:ring-4 focus-visible:ring-emerald-500/30 outline-none mt-2"
                >
                    {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Criar conta'}
                </button>
            </form>

            <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-6">
                Já tem conta?{' '}
                <button
                    onClick={onSwitchToLogin}
                    className="font-semibold text-emerald-500 hover:text-emerald-400 transition-colors outline-none"
                >
                    Entrar
                </button>
            </p>
        </motion.div>
    );
}

function PasswordCheck({ valid, label }: { valid: boolean; label: string }) {
    return (
        <span className={`px-2 py-0.5 rounded-full border transition-colors ${valid
            ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
            : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-400'
            }`}>
            {valid ? '✓' : '○'} {label}
        </span>
    );
}

function translateError(msg: string): string {
    if (msg.includes('already registered')) return 'Este e-mail já está cadastrado.';
    if (msg.includes('valid email')) return 'Insira um e-mail válido.';
    if (msg.includes('Password should be at least')) return 'A senha deve ter no mínimo 6 caracteres.';
    if (msg.includes('Too many requests')) return 'Muitas tentativas. Tente novamente em breve.';
    return msg;
}
