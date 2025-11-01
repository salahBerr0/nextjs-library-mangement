"use client";
import { categories } from '../../lib/mockData';

export default function SearchFilters({selectedCategory,onCategoryChange}) {
  return (
    <main className="flex flex-wrap gap-2">
      {categories.map(cat => (
        <button key={cat} onClick={() => onCategoryChange(cat)} className={`px-4 py-2 rounded-lg font-medium transition ${ selectedCategory === cat  ? 'bg-gradient-to-r from-indigo-800 to-blue-600 text-white'  : 'bg-gray-950 border-[1px] border-blue-700 text-gray-300 hover:bg-gray-700'}`}>{cat}</button>
      ))}
    </main>
  );
}