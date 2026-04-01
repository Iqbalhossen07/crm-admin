import React from "react";

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full space-y-6">
      <div className="relative">
        {/* বাইরের ব্ল্যাক রিং */}
        <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
        {/* মাঝখানের পালস */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-black/5 rounded-full animate-pulse"></div>
      </div>

      <div className="flex flex-col items-center">
        <p className="text-gray-900 font-black text-[10px] tracking-[0.3em] uppercase animate-pulse font-merriweather">
          Synchronizing Data
        </p>
        <div className="flex space-x-1.5 mt-2">
          <span className="w-1 h-1 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-1 h-1 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-1 h-1 bg-black rounded-full animate-bounce"></span>
        </div>
      </div>
    </div>
  );
};

export default Loader;
