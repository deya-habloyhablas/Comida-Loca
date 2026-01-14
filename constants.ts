import { DishBase, Ingredient } from './types';

// Keywords from Exercise C
export const DISH_BASES: DishBase[] = [
  { id: 'helado', nameEs: 'Helado', nameEn: 'Ice Cream scoop', article: 'Un' },
  { id: 'sopa', nameEs: 'Sopa', nameEn: 'Soup bowl', article: 'Una' },
  { id: 'ensalada', nameEs: 'Ensalada', nameEn: 'Salad', article: 'Una' },
  { id: 'tarta', nameEs: 'Tarta', nameEn: 'Cake', article: 'Una' },
  { id: 'tortilla', nameEs: 'Tortilla', nameEn: 'Spanish Omelette (Tortilla)', article: 'Una' },
  { id: 'hamburguesa', nameEs: 'Hamburguesa', nameEn: 'Burger', article: 'Una' },
  { id: 'lentejas', nameEs: 'Lentejas', nameEn: 'Lentil stew', article: 'Unas' },
];

export const INGREDIENTS: Ingredient[] = [
  // Sweet
  { id: 'chocolate', nameEs: 'chocolate', nameEn: 'chocolate', type: 'sweet' },
  { id: 'vainilla', nameEs: 'vainilla', nameEn: 'vanilla', type: 'sweet' },
  { id: 'fresa', nameEs: 'fresa', nameEn: 'strawberries', type: 'sweet' },
  { id: 'chuches', nameEs: 'chuches', nameEn: 'gummy candies', type: 'sweet' },
  { id: 'galletas', nameEs: 'galletas', nameEn: 'cookies', type: 'sweet' },
  
  // Savory
  { id: 'chorizo', nameEs: 'chorizo', nameEn: 'chorizo sausage', type: 'savory' },
  { id: 'pescado', nameEs: 'pescado', nameEn: 'raw fish', type: 'savory' },
  { id: 'queso', nameEs: 'queso', nameEn: 'melted cheese', type: 'savory' },
  { id: 'spaguetti', nameEs: 'espaguetis', nameEn: 'spaghetti', type: 'savory' },
  { id: 'pepinillos', nameEs: 'pepinillos', nameEn: 'pickles', type: 'savory' },
  { id: 'ketchup', nameEs: 'kétchup', nameEn: 'ketchup', type: 'savory' },
  { id: 'huevo', nameEs: 'huevo frito', nameEn: 'fried egg', type: 'savory' },
  
  // Weird/Objects
  { id: 'piedras', nameEs: 'piedras', nameEn: 'rocks', type: 'weird' },
  { id: 'flores', nameEs: 'flores', nameEn: 'flowers', type: 'weird' },
  { id: 'juguetes', nameEs: 'juguetes', nameEn: 'small plastic toys', type: 'weird' },
];

export const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
