import React from 'react';
import { CrazyFoodCombo } from '../types';
import { RefreshCw, Eye, EyeOff } from 'lucide-react';

interface FoodCardProps {
  item: CrazyFoodCombo;
  onRegenerate: (id: string) => void;
  onToggleReveal: (id: string) => void;
}

const FoodCard: React.FC<FoodCardProps> = ({ item, onRegenerate, onToggleReveal }) => {
  const description = `${item.base.article} ${item.base.nameEs} de ${item.mainIngredient.nameEs} con ${item.toppingIngredient.nameEs}`;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border-4 border-orange-200 hover:border-orange-400 transition-all flex flex-col h-full relative group">
      {/* Image Area */}
      <div className="aspect-square w-full bg-gray-100 relative flex items-center justify-center overflow-hidden">
        {item.isLoading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
            <span className="text-sm text-gray-500 font-medium animate-pulse">Cocinando...</span>
          </div>
        ) : item.error ? (
          <div className="text-center p-4">
            <span className="text-red-400 text-sm">Error al cocinar</span>
            <button 
              onClick={() => onRegenerate(item.id)}
              className="mt-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded no-print"
            >
              Reintentar
            </button>
          </div>
        ) : item.imageUrl ? (
          <img 
            src={item.imageUrl} 
            alt={description} 
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500 print:transform-none"
          />
        ) : (
          <div className="text-gray-300">Sin imagen</div>
        )}

        {/* Action Buttons (Hover) */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity no-print">
           <button 
            onClick={() => onRegenerate(item.id)}
            className="p-1.5 bg-white/90 rounded-full hover:bg-orange-100 text-gray-700 shadow-sm"
            title="Generar nueva combinación"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Text Area */}
      <div className="p-3 bg-orange-50 flex-grow flex flex-col items-center justify-center text-center relative min-h-[80px]">
        {item.isRevealed ? (
          <p className="handwritten text-xl font-bold text-gray-800 leading-tight">
            {description}
          </p>
        ) : (
          <p className="text-gray-400 text-sm italic print:hidden">
            ¿Qué es?
          </p>
        )}
        
        <button 
          onClick={() => onToggleReveal(item.id)}
          className="absolute bottom-2 right-2 text-orange-400 hover:text-orange-600 no-print"
        >
          {item.isRevealed ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
};

export default FoodCard;