// components/Header.tsx
'use client';

import React from 'react';

const Header = () => {

  return (
    <header className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover"
          poster="/bookWise.png"
        >
          <source src="/bookWise.webm" type="video/webm" />
          {/* Fallback image if video doesn't load */}
          <img  src="/bookWise.png"  alt="Person reading book in library" className="w-full h-full object-cover"
          />
        </video>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-end h-full text-center px-4">     
        {/* Subheading */}
        <div className='bg-blue-500 h-full'>

        </div>
        <div className=' h-full grid content-center justify-center pt-44'>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl leading-relaxed">Discover, Read, and Manage Your Book Collection with Ease</p>
          <button className="bg-[#0F0C15] hover:bg-blue-100 hover:text-black text-white font-semibold py-2  rounded-lg text-lg md:text-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-white/20"><i className="fas fa-book"></i>Explore Our Collection</button>
        </div>
        
      </div>
    </header>
  );
};

export default Header;