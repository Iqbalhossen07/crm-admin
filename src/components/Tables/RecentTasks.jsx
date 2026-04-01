import React from 'react';
import { motion } from 'framer-motion';

const RecentTasks = () => {
  const tasks = [
    { id: 1, name: "Landing Page UI", project: "Sets Tech App", status: "Completed" },
    { id: 2, name: "Database Design", project: "CRM Project", status: "Pending" },
    { id: 3, name: "API Fixes", project: "Portfolio", status: "Completed" },
    { id: 4, name: "Client Meeting", project: "Admin Panel", status: "In Progress" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col h-full hover:shadow-md transition-all"
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="font-bold text-sm md:text-lg text-gray-800 font-merriweather tracking-tight">Recent Tasks</h3>
        </div>
        <button className="text-[10px] font-bold uppercase text-[#0F8FF0] bg-blue-50 px-4 py-2 rounded-xl hover:bg-black hover:text-white transition-all duration-300">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100 group hover:border-[#0F8FF0]/30 transition-all duration-300">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-gray-500 shadow-sm shrink-0 group-hover:bg-black group-hover:text-white transition-all duration-300">
                <i className="fa-solid fa-check-to-slot text-lg"></i>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate tracking-tight">{task.name}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase truncate tracking-widest mt-0.5">{task.project}</p>
              </div>
            </div>
            <span className={`text-[9px] font-black uppercase px-3 py-2 rounded-lg border ${
              task.status === 'Completed' 
              ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
              : 'bg-orange-50 text-orange-600 border-orange-100'
            }`}>
              {task.status}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecentTasks;