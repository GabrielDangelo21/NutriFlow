import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    ArrowLeft,
    Weight,
    Ruler,
    Calendar,
    Target,
    Save,
    CheckCircle2,
    Camera
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToastStore } from '../../store/useToastStore';
import imageCompression from 'browser-image-compression';
import type { ActivityLevel, GoalType, Gender } from '../../types';

interface ProfileEditorProps {
    onBack: () => void;
}

const activityLevels: { value: ActivityLevel; label: string; description: string }[] = [
    { value: 'sedentary', label: 'Sedentário', description: 'Trabalho de escritório, pouco exercício' },
    { value: 'light', label: 'Leve', description: 'Exercício 1-3 vezes/semana' },
    { value: 'moderate', label: 'Moderado', description: 'Exercício 3-5 vezes/semana' },
    { value: 'active', label: 'Ativo', description: 'Exercício diário intenso' },
    { value: 'athlete', label: 'Atleta', description: 'Treino profissional 2x por dia' },
];

const goalTypes: { value: GoalType; label: string }[] = [
    { value: 'lose', label: 'Perder Peso' },
    { value: 'maintain', label: 'Manter Peso' },
    { value: 'gain', label: 'Ganhar Massa' },
];

const genders: { value: Gender; label: string }[] = [
    { value: 'male', label: 'Masculino' },
    { value: 'female', label: 'Feminino' },
    { value: 'other', label: 'Outro' },
];

export function ProfileEditor({ onBack }: ProfileEditorProps) {
    const { profile, updateProfile } = useAuth();
    const { addToast } = useToastStore();
    const avatarInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        name: profile?.name || '',
        weight: profile?.weight || 0,
        height: profile?.height || 0,
        birthDate: profile?.birthDate || '',
        gender: profile?.gender || 'male' as Gender,
        activityLevel: profile?.activityLevel || 'moderate' as ActivityLevel,
        goalType: profile?.goalType || 'maintain' as GoalType,
        targetWeight: profile?.targetWeight || 0,
        avatarUrl: profile?.avatarUrl || '',
    });

    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingAvatar(true);
        try {
            const compressed = await imageCompression(file, {
                maxSizeMB: 0.3,
                maxWidthOrHeight: 300,
                useWebWorker: true,
            });

            const reader = new FileReader();
            reader.readAsDataURL(compressed);
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setFormData((prev) => ({ ...prev, avatarUrl: base64 }));
                setIsUploadingAvatar(false);
            };
        } catch (err) {
            console.error('Avatar compression error:', err);
            addToast('error', 'Erro ao processar imagem. Tente outro arquivo.');
            setIsUploadingAvatar(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await updateProfile({
                ...formData,
                weight: Number(formData.weight),
                height: Number(formData.height),
                targetWeight: Number(formData.targetWeight),
                avatarUrl: formData.avatarUrl || undefined,
            });
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            console.error(error);
            addToast('error', 'Erro ao salvar perfil. Tente novamente.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500"
                >
                    <ArrowLeft size={24} />
                </button>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-zinc-800 to-zinc-500 dark:from-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent">
                    Meu Perfil
                </h2>
            </div>

            <form onSubmit={handleSave} className="space-y-8 pb-20">
                {/* Photo Section */}
                <div className="flex flex-col items-center gap-4 py-4">
                    <div className="relative group">
                        <div
                            onClick={() => !isUploadingAvatar && avatarInputRef.current?.click()}
                            className="w-24 h-24 rounded-3xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border-2 border-dashed border-emerald-300 dark:border-emerald-500/30 overflow-hidden group-hover:border-emerald-500 transition-colors cursor-pointer"
                        >
                            {isUploadingAvatar ? (
                                <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                            ) : formData.avatarUrl ? (
                                <img
                                    src={formData.avatarUrl}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User size={48} className="opacity-50" />
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => !isUploadingAvatar && avatarInputRef.current?.click()}
                            disabled={isUploadingAvatar}
                            className="absolute -bottom-2 -right-2 p-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg text-emerald-500 hover:scale-110 transition-transform disabled:opacity-50"
                        >
                            <Camera size={16} />
                        </button>
                    </div>
                    <p className="text-xs text-zinc-400">Toque para alterar foto</p>
                    <input
                        type="file"
                        accept="image/*"
                        ref={avatarInputRef}
                        onChange={handleAvatarChange}
                        className="hidden"
                    />
                </div>

                {/* Info Cards */}
                <div className="grid gap-4">
                    {/* Basic Info */}
                    <div className="p-5 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 text-emerald-500 mb-2">
                            <User size={18} />
                            <span className="text-sm font-bold uppercase tracking-wider">Identidade</span>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-sm font-semibold text-zinc-600 dark:text-zinc-400 ml-1">Nome Completo</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                                placeholder="Seu nome"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-zinc-600 dark:text-zinc-400 ml-1">Nascimento</label>
                                <div className="relative">
                                    <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                                    <input
                                        type="date"
                                        value={formData.birthDate}
                                        onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                                        className="w-full pl-11 pr-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-zinc-600 dark:text-zinc-400 ml-1">Gênero</label>
                                <select
                                    value={formData.gender}
                                    onChange={e => setFormData({ ...formData, gender: e.target.value as Gender })}
                                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                                >
                                    {genders.map(g => (
                                        <option key={g.value} value={g.value}>{g.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Biometry Card */}
                    <div className="p-5 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 text-emerald-500 mb-2">
                            <Weight size={18} />
                            <span className="text-sm font-bold uppercase tracking-wider">Biometria</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-zinc-600 dark:text-zinc-400 ml-1">Peso Atual (kg)</label>
                                <div className="relative">
                                    <Weight size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={formData.weight || ''}
                                        onChange={e => setFormData({ ...formData, weight: Number(e.target.value) })}
                                        className="w-full pl-11 pr-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                                        placeholder="70.0"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-zinc-600 dark:text-zinc-400 ml-1">Altura (cm)</label>
                                <div className="relative">
                                    <Ruler size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                                    <input
                                        type="number"
                                        value={formData.height || ''}
                                        onChange={e => setFormData({ ...formData, height: Number(e.target.value) })}
                                        className="w-full pl-11 pr-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                                        placeholder="170"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Goals Card */}
                    <div className="p-5 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 text-emerald-500 mb-2">
                            <Target size={18} />
                            <span className="text-sm font-bold uppercase tracking-wider">Metas</span>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-zinc-600 dark:text-zinc-400 ml-1">Objetivo</label>
                                <div className="flex gap-2">
                                    {goalTypes.map(gt => (
                                        <button
                                            key={gt.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, goalType: gt.value })}
                                            className={`flex-1 py-2 px-1 rounded-xl text-xs font-bold transition-all border ${formData.goalType === gt.value
                                                ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20'
                                                : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-500'
                                                }`}
                                        >
                                            {gt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {formData.goalType !== 'maintain' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="space-y-2"
                                >
                                    <label className="block text-sm font-semibold text-zinc-600 dark:text-zinc-400 ml-1">Peso Alvo (kg)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={formData.targetWeight || ''}
                                        onChange={e => setFormData({ ...formData, targetWeight: Number(e.target.value) })}
                                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                                        placeholder="65.0"
                                    />
                                </motion.div>
                            )}

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-zinc-600 dark:text-zinc-400 ml-1">Nível de Atividade</label>
                                <select
                                    value={formData.activityLevel}
                                    onChange={e => setFormData({ ...formData, activityLevel: e.target.value as ActivityLevel })}
                                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                                >
                                    {activityLevels.map(al => (
                                        <option key={al.value} value={al.value}>{al.label}</option>
                                    ))}
                                </select>
                                <p className="text-[10px] text-zinc-400 ml-1 italic">
                                    {activityLevels.find(al => al.value === formData.activityLevel)?.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating Save Button */}
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-sm px-6 z-40">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl transition-all ${showSuccess
                            ? 'bg-emerald-500 text-white'
                            : 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:scale-[1.02]'
                            } disabled:opacity-60`}
                    >
                        {isSaving ? (
                            <div className="w-5 h-5 border-2 border-current border-t-transparent animate-spin rounded-full" />
                        ) : showSuccess ? (
                            <>
                                <CheckCircle2 size={20} />
                                <span>Salvo com Sucesso!</span>
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                <span>Salvar Perfil</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
