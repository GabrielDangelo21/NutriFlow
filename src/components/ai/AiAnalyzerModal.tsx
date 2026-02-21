import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Image as ImageIcon, Sparkles, X, ChevronRight, Check, Trash2, Plus, RefreshCw } from 'lucide-react';
import { useMealStore } from '../../store/useMealStore';
import { analyzeMealImage, analyzeMealText } from '../../services/geminiService';
import type { AIAnalysisResult } from '../../services/geminiService';
import imageCompression from 'browser-image-compression';
import type { MealCategory } from '../../types';
import { useToastStore } from '../../store/useToastStore';

interface AiAnalyzerModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultCategory?: MealCategory;
}

type Step = 'input' | 'processing' | 'review';

const QUICK_SUGGESTIONS = [
    "2 ovos mexidos com 1 pão francês",
    "Prato feito: arroz, feijão, bife e salada",
    "1 scoop de whey com leite desnatado",
    "Tapioca com frango desfiado"
];

export function AiAnalyzerModal({ isOpen, onClose, defaultCategory = 'lunch' }: AiAnalyzerModalProps) {
    const { addMeal, selectedDateStr } = useMealStore();
    const { addToast } = useToastStore();

    // UI State
    const [step, setStep] = useState<Step>('input');
    const [textInput, setTextInput] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Image State
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    // Analysis Result State
    const [editedResult, setEditedResult] = useState<AIAnalysisResult | null>(null);
    const [isRecalculating, setIsRecalculating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<MealCategory>(defaultCategory);

    const resetModal = () => {
        setStep('input');
        setTextInput('');
        setError(null);
        setImagePreview(null);
        setEditedResult(null);
        setIsRecalculating(false);
        setIsSaving(false);
        setSelectedCategory(defaultCategory);
    };

    const handleClose = () => {
        resetModal();
        onClose();
    };

    const handleRecalculate = async () => {
        if (!editedResult) return;
        const validItems = editedResult.items.filter(i => i.trim());
        if (validItems.length === 0) return;

        setIsRecalculating(true);
        try {
            const description = validItems.join(', ');
            const updated = await analyzeMealText(description);
            setEditedResult({
                ...editedResult,
                calories: updated.calories,
                protein: updated.protein,
                carbs: updated.carbs,
                fat: updated.fat,
                portion: updated.portion,
            });
        } catch (err) {
            console.error('Recalculate error:', err);
            addToast('error', 'Erro ao recalcular. Tente novamente.');
        }
        setIsRecalculating(false);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setStep('processing');
            setError(null);

            // Compress image
            const options = {
                maxSizeMB: 0.5,
                maxWidthOrHeight: 1024,
                useWebWorker: true,
            };
            const compressedFile = await imageCompression(file, options);

            // Convert to base64
            const reader = new FileReader();
            reader.readAsDataURL(compressedFile);
            reader.onloadend = async () => {
                const base64String = reader.result as string;
                setImagePreview(base64String);

                // Extract base64 payload
                const base64Payload = base64String.split(',')[1];

                try {
                    const analysis = await analyzeMealImage(base64Payload, compressedFile.type);
                    setEditedResult(analysis);
                    setStep('review');
                } catch (error) {
                    const msg = error instanceof Error ? error.message : 'Erro ao analisar imagem.';
                    setError(msg);
                    addToast('error', msg);
                    setStep('input');
                }
            };
        } catch (error) {
            console.error("Compression error", error);
            const msg = 'Erro ao processar imagem.';
            setError(msg);
            addToast('error', msg);
            setStep('input');
        }
    };

    const handleTextAnalysis = async (text: string) => {
        if (!text.trim()) return;

        try {
            setStep('processing');
            setError(null);
            setImagePreview(null);

            const analysis = await analyzeMealText(text);
            setEditedResult(analysis);
            setStep('review');
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Erro ao analisar texto.';
            setError(msg);
            addToast('error', msg);
            setStep('input');
        }
    };

    const handleSave = async () => {
        if (!editedResult) return;

        const now = new Date();
        const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        setIsSaving(true);
        try {
            await addMeal({
                name: editedResult.name,
                calories: editedResult.calories,
                protein: editedResult.protein,
                carbs: editedResult.carbs,
                fat: editedResult.fat,
                category: selectedCategory,
                time,
                dateStr: selectedDateStr,
                imageUrl: imagePreview || undefined,
            });
            handleClose();
        } catch (err) {
            console.error('Save error:', err);
            addToast('error', 'Erro ao salvar refeição.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, y: '100%' }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative w-full h-[90vh] sm:h-auto sm:max-h-[85vh] sm:max-w-md bg-zinc-50 dark:bg-zinc-950 sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 pb-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 z-10">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-500 dark:text-indigo-400">
                                    <Sparkles size={20} />
                                </div>
                                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">NutriAI</h2>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500 dark:text-zinc-400 outline-none"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto">

                            {/* STEP 1: INPUT */}
                            {step === 'input' && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="p-6 flex flex-col gap-6"
                                >
                                    {error && (
                                        <div className="p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-100 dark:border-red-500/20">
                                            {error}
                                        </div>
                                    )}

                                    <div className="text-center space-y-2">
                                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Como deseja registrar?</h3>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Tire uma foto do prato ou descreva os alimentos em texto.</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => cameraInputRef.current?.click()}
                                            className="flex flex-col items-center justify-center p-6 gap-3 bg-white dark:bg-zinc-900 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/5 transition-all outline-none"
                                        >
                                            <Camera size={32} className="text-zinc-400 dark:text-zinc-500" />
                                            <span className="font-semibold text-zinc-700 dark:text-zinc-300">Câmera</span>
                                        </button>

                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex flex-col items-center justify-center p-6 gap-3 bg-white dark:bg-zinc-900 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/5 transition-all outline-none"
                                        >
                                            <ImageIcon size={32} className="text-zinc-400 dark:text-zinc-500" />
                                            <span className="font-semibold text-zinc-700 dark:text-zinc-300">Galeria</span>
                                        </button>

                                        <input
                                            type="file"
                                            accept="image/*"
                                            capture="environment"
                                            className="hidden"
                                            ref={cameraInputRef}
                                            onChange={handleImageUpload}
                                        />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            ref={fileInputRef}
                                            onChange={handleImageUpload}
                                        />
                                    </div>

                                    <div className="relative flex items-center py-2">
                                        <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
                                        <span className="flex-shrink-0 mx-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">ou digite</span>
                                        <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <div className="relative">
                                            <textarea
                                                value={textInput}
                                                onChange={(e) => setTextInput(e.target.value)}
                                                placeholder="Ex: 200g de frango com batata doce..."
                                                className="w-full p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl resize-none outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                                                rows={3}
                                            />
                                            <button
                                                onClick={() => handleTextAnalysis(textInput)}
                                                disabled={!textInput.trim()}
                                                className="absolute bottom-3 right-3 p-2 bg-indigo-500 text-white rounded-lg disabled:opacity-50 hover:bg-indigo-600 transition-colors"
                                            >
                                                <ChevronRight size={20} />
                                            </button>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {QUICK_SUGGESTIONS.map((suggestion, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setTextInput(suggestion)}
                                                    className="px-3 py-1.5 text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-left"
                                                >
                                                    {suggestion}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 2: PROCESSING */}
                            {step === 'processing' && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center p-12 h-full gap-6 text-center"
                                >
                                    <div className="relative w-24 h-24 flex items-center justify-center">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                            className="absolute inset-0 rounded-full border-4 border-indigo-100 dark:border-indigo-900 border-t-indigo-500"
                                        />
                                        <Sparkles className="text-indigo-500" size={32} />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Analisando Refeição</h3>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                            O NutriAI está calculando os macros e calorias...
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 3: REVIEW */}
                            {step === 'review' && editedResult && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-6 flex flex-col gap-6"
                                >
                                    {/* Visual Overview */}
                                    <div className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
                                        {imagePreview ? (
                                            <div className="w-20 h-20 rounded-xl overflow-hidden shadow-inner flex-shrink-0">
                                                <img src={imagePreview} alt="Review" className="w-full h-full object-cover" />
                                            </div>
                                        ) : (
                                            <div className="w-16 h-16 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center flex-shrink-0 text-indigo-500">
                                                <Sparkles size={24} />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={editedResult.name}
                                                onChange={(e) => setEditedResult({ ...editedResult, name: e.target.value })}
                                                className="w-full font-bold text-lg text-zinc-900 dark:text-white bg-transparent outline-none border-b border-dashed border-zinc-300 dark:border-zinc-700 focus:border-indigo-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Editable Ingredients List */}
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm">Ingredientes Identificados</h4>
                                        <div className="flex flex-col gap-2">
                                            {editedResult.items.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-2">
                                                    <span className="text-xs text-zinc-400 w-5 text-right flex-shrink-0">{idx + 1}.</span>
                                                    <input
                                                        type="text"
                                                        value={item}
                                                        onChange={(e) => {
                                                            const newItems = [...editedResult.items];
                                                            newItems[idx] = e.target.value;
                                                            setEditedResult({ ...editedResult, items: newItems });
                                                        }}
                                                        className="flex-1 px-3 py-2 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newItems = editedResult.items.filter((_, i) => i !== idx);
                                                            setEditedResult({ ...editedResult, items: newItems });
                                                        }}
                                                        className="p-1.5 text-zinc-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors outline-none flex-shrink-0"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setEditedResult({ ...editedResult, items: [...editedResult.items, ''] })}
                                            className="flex items-center gap-1.5 text-xs font-medium text-indigo-500 hover:text-indigo-400 transition-colors outline-none mt-1"
                                        >
                                            <Plus size={14} />
                                            Adicionar ingrediente
                                        </button>
                                    </div>

                                    {/* Recalculate button */}
                                    <button
                                        type="button"
                                        onClick={handleRecalculate}
                                        disabled={isRecalculating}
                                        className="w-full py-2.5 flex items-center justify-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors outline-none disabled:opacity-50"
                                    >
                                        <RefreshCw size={14} className={isRecalculating ? 'animate-spin' : ''} />
                                        {isRecalculating ? 'Recalculando...' : 'Recalcular Nutrição'}
                                    </button>

                                    {/* Edits */}
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-zinc-800 dark:text-zinc-200">Revisão Nutricional</h4>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-1">
                                                <label className="text-xs text-zinc-500 dark:text-zinc-400">Kcal Estimadas</label>
                                                <div className="flex items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="9999"
                                                        className="w-full p-3 bg-transparent outline-none dark:text-white font-bold"
                                                        value={editedResult.calories}
                                                        onChange={(e) => setEditedResult({ ...editedResult, calories: Number(e.target.value) })}
                                                    />
                                                    <span className="pr-3 text-zinc-400 text-sm">kcal</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-1">
                                                <label className="text-xs text-zinc-500 dark:text-zinc-400">Porção Inferida</label>
                                                <div className="flex items-center bg-zinc-100 dark:bg-zinc-800/50 rounded-xl h-full p-3 border border-transparent">
                                                    <span className="text-sm text-zinc-700 dark:text-zinc-300 line-clamp-1">{editedResult.portion}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="flex flex-col gap-1">
                                                <label className="text-xs text-emerald-600 dark:text-emerald-400 text-center font-medium">Proteínas</label>
                                                <div className="flex items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="999"
                                                        className="w-full p-2 text-center bg-transparent outline-none dark:text-white font-semibold"
                                                        value={editedResult.protein}
                                                        onChange={(e) => setEditedResult({ ...editedResult, protein: Number(e.target.value) })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <label className="text-xs text-blue-600 dark:text-blue-400 text-center font-medium">Carbos</label>
                                                <div className="flex items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="999"
                                                        className="w-full p-2 text-center bg-transparent outline-none dark:text-white font-semibold"
                                                        value={editedResult.carbs}
                                                        onChange={(e) => setEditedResult({ ...editedResult, carbs: Number(e.target.value) })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <label className="text-xs text-purple-600 dark:text-purple-400 text-center font-medium">Gorduras</label>
                                                <div className="flex items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="999"
                                                        className="w-full p-2 text-center bg-transparent outline-none dark:text-white font-semibold"
                                                        value={editedResult.fat}
                                                        onChange={(e) => setEditedResult({ ...editedResult, fat: Number(e.target.value) })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </motion.div>
                            )}

                        </div>

                        {/* Footer Only in Review Mode */}
                        {step === 'review' && (
                            <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 z-10 px-6 space-y-3">
                                {/* Category Picker */}
                                <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1">
                                    {(['breakfast', 'lunch', 'snack', 'dinner'] as MealCategory[]).map((cat) => {
                                        const labels: Record<MealCategory, string> = {
                                            breakfast: 'Café',
                                            lunch: 'Almoço',
                                            snack: 'Lanche',
                                            dinner: 'Jantar',
                                        };
                                        const isActive = selectedCategory === cat;
                                        return (
                                            <button
                                                key={cat}
                                                onClick={() => setSelectedCategory(cat)}
                                                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all outline-none ${isActive
                                                        ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                                                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
                                                    }`}
                                            >
                                                {labels[cat]}
                                            </button>
                                        );
                                    })}
                                </div>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="w-full py-3.5 flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-bold transition-all focus-visible:ring-4 focus-visible:ring-indigo-500/30 outline-none disabled:opacity-60"
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                            <span>Salvando...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Check size={20} />
                                            <span>Confirmar Diário</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
