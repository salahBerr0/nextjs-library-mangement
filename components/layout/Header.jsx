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
<p className="text-3xl font-bold 
text-white/90 mb-10 max-w-4xl leading-relaxed">
  Explore Our Collection
</p>

        </div>
        
      </div>
    </header>
  );
};

export default Header;