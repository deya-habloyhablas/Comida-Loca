export interface Ingredient {
  id: string;
  nameEs: string;
  nameEn: string;
  type: 'sweet' | 'savory' | 'weird';
}

export interface DishBase {
  id: string;
  nameEs: string;
  nameEn: string;
  article: string; // 'Un', 'Una', 'Unos', 'Unas'
}

export interface CrazyFoodCombo {
  id: string;
  base: DishBase;
  mainIngredient: Ingredient; // "de ..."
  toppingIngredient: Ingredient; // "con ..."
  imageUrl?: string;
  isLoading: boolean;
  isRevealed: boolean;
  error?: string;
}

export interface GenerationRequest {
  prompt: string;
}