
import React from 'react';
import { Category } from '@/types/service';
import { ImageIcon } from 'lucide-react';

interface CategorySectionProps {
  categories: Category[];
  selectedCategory: Category | null;
  onSelectCategory: (category: Category | null) => void;
  primaryColor: string;
}

const CategorySection = ({
  categories,
  selectedCategory,
  onSelectCategory,
  primaryColor
}: CategorySectionProps) => {
  if (categories.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Catégories</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <button
          onClick={() => onSelectCategory(null)}
          className={`
            p-4 rounded-2xl border-2 transition-all duration-300 text-center
            ${selectedCategory === null 
              ? 'border-opacity-100 shadow-lg scale-105' 
              : 'border-gray-200 hover:border-gray-300'
            }
          `}
          style={{
            borderColor: selectedCategory === null ? primaryColor : undefined,
            backgroundColor: selectedCategory === null ? `${primaryColor}10` : 'white'
          }}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mx-auto mb-2">
            <span className="text-lg">🎯</span>
          </div>
          <span className="text-sm font-medium text-gray-700">Tous les services</span>
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category)}
            className={`
              p-4 rounded-2xl border-2 transition-all duration-300 text-center
              ${selectedCategory?.id === category.id 
                ? 'border-opacity-100 shadow-lg scale-105' 
                : 'border-gray-200 hover:border-gray-300'
              }
            `}
            style={{
              borderColor: selectedCategory?.id === category.id ? primaryColor : undefined,
              backgroundColor: selectedCategory?.id === category.id ? `${primaryColor}10` : 'white'
            }}
          >
            {category.imageUrl ? (
              <div className="w-12 h-12 rounded-xl overflow-hidden mx-auto mb-2">
                <img 
                  src={category.imageUrl} 
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2"
                style={{ backgroundColor: category.color || '#f3f4f6' }}
              >
                {category.icon ? (
                  <span className="text-lg">{category.icon}</span>
                ) : (
                  <ImageIcon className="w-6 h-6 text-gray-500" />
                )}
              </div>
            )}
            <span className="text-sm font-medium text-gray-700">{category.name}</span>
            {category.description && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-1">{category.description}</p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
