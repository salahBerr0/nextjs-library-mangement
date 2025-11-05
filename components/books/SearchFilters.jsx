// components/books/SearchFilters.jsx
"use client";

// ✅ Définir les catégories directement dans le composant
const categories = [
  'All', 
  'Fiction', 
  'Non-Fiction', 
  'Science', 
  'Histoire', 
  'Biographie', 
  'Technologie',
  'Romance',
  'Mystery',
  'Science Fiction',
  'Autre'
];

export default function SearchFilters({selectedCategory, onCategoryChange}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            selectedCategory === category
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-500 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}