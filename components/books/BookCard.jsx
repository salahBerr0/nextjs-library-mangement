"use client";
import { Edit2, Trash2, BookOpen, User, Calendar, Copy, Star } from 'lucide-react';
import { useState, useRef } from 'react';

export default function BookCard({book,isAdmin,isExpanded,onExpand,onEdit,onDelete,onBorrow,onReturn,isBorrowed}) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const modalRef = useRef(null);
  const cardRef = useRef(null);

  // Common drag handlers for both states
  const handleMouseDown = (e, isExpandedView = false) => {
    // Don't drag if clicking on buttons or interactive elements
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
      return;
    }
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    
    // Prevent text selection during drag
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    setPosition({
      x: newX,
      y: newY
    });
  };

const handleMouseUp = () => {
  setIsDragging(false);
  if (!isExpanded) {
    setPosition({ x: 0, y: 0 });
  }
  else{
        setPosition({ x: 0, y: 50 });

  }
};

  const handleClose = (e) => {
    e.stopPropagation();
    // Reset position when closing
    setPosition({ x: 0, y: 0 });
    onExpand(null);
  };

  const handleAction = (action, e) => {
    e.stopPropagation();
    action(book);
  };

  const handleExpand = (e) => {
    e.stopPropagation();
    setPosition({ x: 0, y: 50 });
    onExpand(book);
  };

  return (
    <>
      {!isExpanded ? (
        // Collapsed View
        <div  ref={cardRef} className={`group relative bg-white rounded-2xl overflow-hidden w-[320px] h-[440px] transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl shadow-lg border border-gray-100 ${  isDragging ? 'cursor-grabbing' : 'cursor-grab'}`} style={{  transform: `translate(${position.x}px, ${position.y}px)`,  transition: isDragging ? 'none' : 'transform 0.2s ease'}} onMouseDown={(e) => handleMouseDown(e, false)} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
          <img  src={book.coverImage}   alt={book.title}   className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"/>
          <div className="absolute z-0 inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Overlay with Book Information */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
            {/* Top Section - Category & Likes */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
              <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/30">
                {book.category}
              </span>
              <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                <span className="text-white text-xs font-medium"><i className='fas fa-clover text-indigo-600/50'></i> {book.likes || 0}</span>
              </div>
            </div>

            {/* Bottom Section - Status & Copies */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between mb-3">
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm ${ book.copies > 0  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' : 'bg-red-500/20 text-red-300 border border-red-400/30'}`}>{book.copies > 0 ? 'Available' : 'Unavailable'}</span>
                <span className="text-gray-300 text-sm bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">{book.copies} {book.copies === 1 ? 'copy' : 'copies'}</span>
              </div>

              {/* See Details Button */}
              <button  onClick={handleExpand} className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white py-3 rounded-xl transition-all duration-300 transform hover:scale-105 border border-white/30 font-medium flex items-center justify-center gap-2"><BookOpen size={16} />See Details</button>
            </div>
          </div>
        </div>
      ) : (
        // Expanded View - Draggable and Responsive
        <div  className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 z-50 animate-fade-in overflow-y-auto pt-16" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
          <div  ref={modalRef} className={`bg-white rounded-3xl p-6 w-full max-w-4xl mx-auto shadow-2xl border border-gray-100 animate-scale-in modal-content ${  isDragging ? 'cursor-grabbing' : 'cursor-grab'}`} style={{  transform: `translate(${position.x}px, ${position.y}px)`,  transition: isDragging ? 'none' : 'transform 0.2s ease',marginTop: '2rem'}} onMouseDown={(e) => handleMouseDown(e, true)}>
            <div className="flex flex-col lg:flex-row gap-12">
              <article className="flex-shrink-0 relative mx-auto lg:mx-0">
                <div className="relative">
                  <img  src={book.coverImage}   alt={book.title}   className="w-48 h-64 sm:w-56 sm:h-72 md:w-64 md:h-80 lg:w-72 lg:h-96 object-cover rounded-2xl shadow-2xl"/>
                  <div className="absolute -inset-3 sm:-inset-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl -z-10 transform rotate-2"/>
                  {/* Likes on cover in expanded view */}
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1.5 rounded-full">
                    <span className="text-gray-700 text-xs sm:text-sm font-medium"><i className='fas fa-clover text-indigo-700'></i> {book.likes || 0}</span>
                  </div>
                </div>
              </article>
              
              {/* Book Details */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-4 sm:mb-4">
                  <div className="flex-1 min-w-0 mr-4">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 leading-tight break-words">{book.title}</h2>
                    {book.publishedYear && (<span className="text-gray-500">{book.publishedYear}</span>)}
                    <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
                      <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-800 text-xs sm:text-sm font-medium px-2 py-1 sm:px-3 sm:py-1.5 rounded-full"><BookOpen size={12} className="sm:w-3 sm:h-3" />{book.category}</span>
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium ${ book.copies > 0  ? 'bg-emerald-100 text-emerald-800'  : 'bg-red-100 text-red-800'}`}>{book.copies > 0 ? 'Available' : 'Out of Stock'}</span>
                    </div>
                  </div>
                  <button  onClick={handleClose} className="flex-shrink-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors duration-200"><span className="text-xl sm:text-2xl">×</span></button>
                </div>
                
                {/* Book Description */}
                <div className="mb-6 sm:mb-8 h-28 overflow-y-auto">
                  <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
                    {book.description || "No description available for this book."}
                  </p>
                </div>
                
                {/* Metadata Grid - Responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <User size={16} className="text-gray-500 flex-shrink-0 sm:w-4 sm:h-4" />
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm text-gray-500">Author</div>
                      <div className="font-medium text-gray-900 text-sm sm:text-base truncate">{book.author}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Copy size={16} className="text-gray-500 flex-shrink-0 sm:w-4 sm:h-4" />
                    <div>
                      <div className="text-xs sm:text-sm text-gray-500">Copies Available</div>
                      <div className="font-medium text-gray-900 text-sm sm:text-base">
                        {book.copies} {book.copies === 1 ? 'copy' : 'copies'}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons - Responsive */}
                <div className="flex flex-wrap gap-2 sm:gap-3 items-center justif">
                  {book.copies > 0 && !isBorrowed && (
                   <button onClick={(e) => {
  e.stopPropagation();
  onBorrow(book.id);  // Passer book.id au lieu de book
}}  className="flex items-center gap-2 bg-gradient-to-br from-indigo-900 to-blue-500 hover:bg-blue-300 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl transition-all duration-300 hover:shadow-lg font-semibold text-sm sm:text-base flex-1 sm:flex-none justify-center"><BookOpen size={16} className="sm:w-4 sm:h-4" />Borrow Book</button>
                  )}
                  
                  {isBorrowed && (
                    <button onClick={(e) => {
  e.stopPropagation();
  onReturn(book.id);  // Passer book.id au lieu de book
}} className="flex items-center gap-2 bg-gradient-to-br from-emerald-900 to-blue-500 hover:bg-blue-300 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl transition-all duration-300 hover:shadow-lg font-semibold text-sm sm:text-base flex-1 sm:flex-none justify-center">Return Book</button>
                  )}
                  
                  {isAdmin && (
                    <>
                      <button  onClick={(e) => handleAction(onEdit, e)}  className="flex items-center bg-gray-500 hover:bg-gray-600 text-white w-10 h-10 rounded-xl transition-all duration-300 justify-center"><Edit2 size={4} className="sm:w-4 sm:h-4" /></button>
                      <button  onClick={(e) => handleAction(onDelete, e)}  className="flex items-center bg-red-500 hover:bg-red-600flex hover:bg-gray-600 text-white w-10 h-10 rounded-xl transition-all duration-300 justify-center"><Trash2 size={14} className="sm:w-4 sm:h-4" /></button>
                    </>
                  )}

                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}