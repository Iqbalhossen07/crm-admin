import React from 'react';
import { useHeader } from './HeaderContext';

const Header = ({ onMenuClick }) => {
  const { headerData } = useHeader();

  return (
    <header className="bg-white/80 backdrop-blur-xl px-4 sm:px-8 py-3 sm:py-5 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm border border-gray-100 flex justify-between items-center sticky top-2 sm:top-4 z-30 transition-all mx-1 mt-4 sm:mt-0"> 
      {/* mt-2 এবং top-2 যোগ করা হয়েছে যাতে মোবাইলে উপরে গ্যাপ থাকে */}
      
      <div className="flex items-center gap-3 sm:gap-4">
        {/* মোবাইল মেনু বাটন - এখন কাজ করবে */}
        {/* <button 
          onClick={onMenuClick} 
          className="lg:hidden w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black bg-gray-50 border border-gray-200 rounded-xl transition-all active:scale-95"
        >
          <i className="fa-solid fa-bars text-lg"></i>
        </button> */}

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 text-[#0F8FF0] rounded-xl sm:rounded-2xl hidden sm:flex items-center justify-center border border-gray-100 shadow-inner">
            <i className={`${headerData.icon} text-xl sm:text-2xl`}></i>
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-black font-merriweather text-gray-900 leading-tight">
              {headerData.title}
            </h1>
            <p className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5 font-bold uppercase tracking-[0.2em]">
              {headerData.subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <div className="text-right hidden sm:block border-r border-gray-100 pr-6 mr-2">
          <p className="font-bold text-gray-900 text-sm leading-none">Admin Panel</p>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">Sets Tech</p>
        </div>
        
        <div className="relative group cursor-pointer">
          <img 
            src="https://ui-avatars.com/api/?name=Admin&background=000&color=fff&size=128" 
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border-2 border-white shadow-md transition-transform group-hover:scale-105" 
            alt="Admin" 
          />
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></span>
        </div>
      </div>
    </header>
  );
};

export default Header;