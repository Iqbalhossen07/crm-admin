import React from 'react';
import { motion } from 'framer-motion';

const RecentPayments = () => {
  const payments = [
    { id: 1, client: "Iqbal Hossen", amount: 1200.00, status: "Completed" },
    { id: 2, client: "Sets Tech", amount: 850.50, status: "Pending" },
    { id: 3, client: "Sarah Khan", amount: 2500.00, status: "Completed" },
    { id: 4, client: "Alex Smith", amount: 150.00, status: "Pending" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white p-5 sm:p-8 rounded-[1.8rem] sm:rounded-[2.5rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden flex flex-col h-full hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-500"
    >
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 sm:mb-8">
        <div>
          <h3 className="font-black text-sm sm:text-lg text-gray-800 font-merriweather tracking-tight">Recent Payments</h3>
        </div>
        <button className="text-[8px] sm:text-[10px] font-black uppercase text-[#0F8FF0] bg-blue-50/50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl hover:bg-black hover:text-white transition-all duration-300 active:scale-95">
          View All
        </button>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] border-b border-gray-50">
            <tr>
              <th className="pb-3 sm:pb-5">Client Name</th>
              <th className="pb-3 sm:pb-5 text-right">Amount</th>
              <th className="pb-3 sm:pb-5 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50/50">
            {payments.map((pay) => (
              <tr key={pay.id} className="group hover:bg-gray-50/30 transition-colors">
                <td className="py-3 sm:py-5">
                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* Avatar Circle - Smaller on mobile */}
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-50 flex items-center justify-center text-[9px] sm:text-[10px] text-gray-500 font-black border border-gray-100 shadow-sm group-hover:bg-white transition-colors">
                      {pay.client.charAt(0)}
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-gray-800 tracking-tight">{pay.client}</span>
                  </div>
                </td>
                <td className="py-3 sm:py-5 text-right font-black text-gray-900 text-xs sm:text-sm tracking-tighter">
                  £{pay.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td className="py-3 sm:py-5 text-center">
                  <span className={`text-[7px] sm:text-[9px] px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg uppercase font-black tracking-widest inline-block ${
                    pay.status === 'Completed' 
                    ? 'bg-[#10B981] text-white shadow-[0_4px_12px_rgba(16,185,129,0.2)]' 
                    : 'bg-gray-100 text-gray-500'
                  }`}>
                    {pay.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default RecentPayments;