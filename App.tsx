import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DISH_BASES, INGREDIENTS, getRandomItem } from './constants';
import { CrazyFoodCombo } from './types';
import { generateFoodImage } from './services/geminiService';
import FoodCard from './components/FoodCard';
import { ChefHat, Shuffle, Eye, EyeOff, Printer } from 'lucide-react';

const App: React.FC = () => {
  const [items, setItems] = useState<CrazyFoodCombo[]>([]);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  // Check API Key on mount
  useEffect(() => {
    if (!process.env.API_KEY) {
      setApiKeyMissing(true);
    }
  }, []);

  const createRandomCombo = (): CrazyFoodCombo => {
    const base = getRandomItem(DISH_BASES);
    
    // Logic: Try to get one savory and one sweet for maximum weirdness, 
    // or just totally random. Let's maximize contrast.
    let mainIng = getRandomItem(INGREDIENTS);
    let toppingIng = getRandomItem(INGREDIENTS);

    // Prevent same ingredient twice
    while (mainIng.id === toppingIng.id) {
      toppingIng = getRandomItem(INGREDIENTS);
    }

    return {
      id: uuidv4(),
      base,
      mainIngredient: mainIng,
      toppingIngredient: toppingIng,
      isLoading: true,
      isRevealed: false
    };
  };

  const generateImageForItem = async (item: CrazyFoodCombo) => {
    try {
      const imageUrl = await generateFoodImage(item);
      setItems(prev => prev.map(i => 
        i.id === item.id 
          ? { ...i, imageUrl: imageUrl || undefined, isLoading: false } 
          : i
      ));
    } catch (error) {
      setItems(prev => prev.map(i => 
        i.id === item.id 
          ? { ...i, isLoading: false, error: 'Failed' } 
          : i
      ));
    }
  };

  const handleGeneratePoster = useCallback(async () => {
    // Generate 10 placeholders
    const newItems: CrazyFoodCombo[] = Array.from({ length: 10 }, () => createRandomCombo());
    setItems(newItems);

    // Trigger API calls for each (sequential to avoid rate limits, or batched)
    // Using a simple loop here. Gemini handles concurrency well, but let's be safe.
    for (const item of newItems) {
        // Trigger async without awaiting the whole loop
        generateImageForItem(item); 
        // Small delay to stagger requests slightly
        await new Promise(r => setTimeout(r, 200)); 
    }
  }, []);

  const handleRegenerateItem = async (id: string) => {
    const newItem = createRandomCombo();
    // Keep the same ID so it replaces in place
    newItem.id = id; 
    
    setItems(prev => prev.map(i => i.id === id ? newItem : i));
    await generateImageForItem(newItem);
  };

  const toggleRevealAll = (reveal: boolean) => {
    setItems(prev => prev.map(i => ({ ...i, isRevealed: reveal })));
  };

  const handleToggleRevealSingle = (id: string) => {
    setItems(prev => prev.map(i => 
      i.id === id ? { ...i, isRevealed: !i.isRevealed } : i
    ));
  };

  const handlePrint = () => {
    window.print();
  };

  // Initial generation
  useEffect(() => {
    if (!apiKeyMissing && items.length === 0) {
      handleGeneratePoster();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKeyMissing]); 

  if (apiKeyMissing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-md text-center">
          <ChefHat size={64} className="mx-auto text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Falta la API Key</h1>
          <p className="text-gray-600">
            Por favor, configura la variable <code>process.env.API_KEY</code> para usar el generador de Comida Loca.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border-b-4 border-orange-300 print:shadow-none print:border-0">
        <div className="flex items-center gap-4">
          <div className="bg-orange-100 p-3 rounded-full print:bg-transparent print:p-0">
            <ChefHat size={40} className="text-orange-600" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 print:text-black">
              COMIDA LOCA
            </h1>
            <p className="text-gray-500 font-medium print:text-gray-800">Ejercicio 5: ¿De chocolate o con chocolate?</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center no-print">
          <button 
            onClick={handleGeneratePoster}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold shadow-md transition-colors"
          >
            <Shuffle size={18} />
            Nuevo Póster
          </button>
          
          <button 
            onClick={() => toggleRevealAll(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-semibold transition-colors"
          >
            <Eye size={18} />
            Soluciones
          </button>
          
          <button 
            onClick={() => toggleRevealAll(false)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
          >
            <EyeOff size={18} />
            Ocultar
          </button>

          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold shadow-md transition-colors ml-2"
          >
            <Printer size={18} />
            Imprimir
          </button>
        </div>
      </header>

      {/* Grid */}
      <main className="flex-grow">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 print:gap-4">
          {items.map((item) => (
            <FoodCard 
              key={item.id} 
              item={item} 
              onRegenerate={handleRegenerateItem}
              onToggleReveal={handleToggleRevealSingle}
            />
          ))}
        </div>
      </main>

      {/* Footer / Instructions */}
      <footer className="mt-12 text-center bg-white/50 p-6 rounded-xl border border-orange-100 no-print">
        <h3 className="text-lg font-bold text-orange-800 mb-2 handwritten text-2xl">Instrucciones para el estudiante:</h3>
        <p className="text-gray-700 max-w-2xl mx-auto">
          Mira las imágenes extrañas. Describe qué es cada plato usando <span className="font-bold bg-yellow-200 px-1 rounded">DE</span> para el ingrediente principal y <span className="font-bold bg-green-200 px-1 rounded">CON</span> para el acompañamiento.
        </p>
        <p className="mt-2 text-sm text-gray-500">Ejemplo: Una tarta <span className="font-bold">de</span> hamburguesa <span className="font-bold">con</span> helado.</p>
      </footer>
    </div>
  );
};

export default App;