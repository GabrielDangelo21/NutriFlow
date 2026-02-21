export interface FoodItem {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    portion: string;
}

export const FOOD_LIBRARY: FoodItem[] = [
    { name: 'Arroz Branco Cozido', calories: 128, protein: 2, carbs: 28, fat: 0, portion: '100g' },
    { name: 'Feijão Carioca Cozido', calories: 77, protein: 5, carbs: 14, fat: 0, portion: '100g' },
    { name: 'Frango Grelhado', calories: 165, protein: 31, carbs: 0, fat: 4, portion: '100g' },
    { name: 'Carne Bovina Moída', calories: 215, protein: 26, carbs: 0, fat: 12, portion: '100g' },
    { name: 'Ovo Cozido', calories: 77, protein: 6, carbs: 1, fat: 5, portion: '1 unidade (50g)' },
    { name: 'Ovo Mexido (2 unid.)', calories: 182, protein: 13, carbs: 2, fat: 14, portion: '2 ovos + manteiga' },
    { name: 'Pão Francês', calories: 150, protein: 5, carbs: 28, fat: 2, portion: '1 unidade (50g)' },
    { name: 'Banana Prata', calories: 98, protein: 1, carbs: 26, fat: 0, portion: '1 unidade média' },
    { name: 'Maçã', calories: 52, protein: 0, carbs: 14, fat: 0, portion: '1 unidade média (100g)' },
    { name: 'Batata Doce Cozida', calories: 86, protein: 2, carbs: 20, fat: 0, portion: '100g' },
    { name: 'Aveia em Flocos', calories: 394, protein: 14, carbs: 67, fat: 8, portion: '100g' },
    { name: 'Whey Protein (1 scoop)', calories: 120, protein: 24, carbs: 3, fat: 2, portion: '30g' },
    { name: 'Leite Desnatado', calories: 35, protein: 3, carbs: 5, fat: 0, portion: '100ml' },
    { name: 'Iogurte Grego Natural', calories: 97, protein: 9, carbs: 4, fat: 5, portion: '100g' },
    { name: 'Queijo Minas Frescal', calories: 264, protein: 17, carbs: 3, fat: 21, portion: '100g' },
    { name: 'Tapioca com Queijo', calories: 250, protein: 8, carbs: 45, fat: 5, portion: '1 unidade (80g)' },
    { name: 'Granola', calories: 440, protein: 10, carbs: 66, fat: 16, portion: '100g' },
    { name: 'Abacate', calories: 160, protein: 2, carbs: 9, fat: 15, portion: '100g' },
    { name: 'Amendoim Torrado', calories: 567, protein: 26, carbs: 16, fat: 49, portion: '100g' },
    { name: 'Azeite de Oliva', calories: 884, protein: 0, carbs: 0, fat: 100, portion: '100ml' },
    { name: 'Pasta de Amendoim', calories: 588, protein: 25, carbs: 20, fat: 50, portion: '100g' },
    { name: 'Prato Feito (Básico)', calories: 650, protein: 35, carbs: 70, fat: 20, portion: 'arroz+feijão+carne+salada' },
    { name: 'Salada Mista', calories: 25, protein: 2, carbs: 4, fat: 0, portion: '100g' },
    { name: 'Salmão Grelhado', calories: 208, protein: 20, carbs: 0, fat: 13, portion: '100g' },
    { name: 'Macarrão Cozido', calories: 131, protein: 5, carbs: 25, fat: 1, portion: '100g' },
];
