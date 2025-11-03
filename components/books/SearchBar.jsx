import { Search } from 'lucide-react';

export default function SearchBar({ searchTerm, onSearchChange }) {
    return(
        <main className="grid z-0 w-full px-5 content-center justify-items-center" >
            <div className="flex-1 rounded-xl relative backdrop-blur-sm w-full z-30 max-w-2xl ">
                <Search className="absolute  left-3 top-1/2 transform -translate-y-1/2 text-black/50 w-4 h-4" />
                <input className="w-full pl-10 pr-4 py-2.5 bg-white/90 text-indigo-950 border-indigo-600 border-[1px] rounded-xl transition-all duration-200" style={{boxShadow:'0 0 5px #5a9bd6'}} type="text" placeholder="Search books, authors, ISBN..."  value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} />
            </div>
        </main>
    )
}