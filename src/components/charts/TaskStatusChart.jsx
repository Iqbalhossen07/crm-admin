import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { motion } from 'framer-motion';

ChartJS.register(ArcElement, Tooltip, Legend);

const TaskStatusChart = () => {
  const data = {
    labels: ['In Progress', 'Remaining'],
    datasets: [
      {
        data: [75, 25],
        // সবুজের বদলে এখন তোর সেকেন্ডারি নীল কালার
        backgroundColor: ['#0F8FF0', '#F3F4F9'], 
        borderWidth: 0,
        cutout: '83%',
        borderRadius: [50, 0], 
        hoverOffset: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    hover: { mode: null },
    animation: {
      duration: 0 
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] w-full h-full flex flex-col transition-all hover:shadow-xl hover:shadow-gray-200/40">
      
      <div className="text-center mb-4">
        <h3 className="font-bold text-lg sm:text-lg text-gray-800 font-merriweather tracking-tight">
          Task Status
        </h3>
     
      </div>

      <div className="flex-1 relative flex items-center justify-center scale-90 sm:scale-95"> 
        
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 60, 
            damping: 12, 
            duration: 1.5,
            delay: 0.2 
          }}
          className="w-full h-48 sm:h-56 flex items-center justify-center"
        >
          <Doughnut data={data} options={options} />
        </motion.div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="text-3xl sm:text-4xl font-black text-gray-900 font-merriweather"
            >
              75%
            </motion.span>
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="text-[9px] text-gray-400 font-bold uppercase tracking-widest"
            >
              Done
            </motion.span>
        </div>
      </div>

      <div className="mt-6 flex justify-center items-center gap-2">
        {/* লিজেন্ড এর ডট কালার এবং শ্যাডোও নীল করা হয়েছে */}
        <span className="w-2.5 h-2.5 rounded-full bg-[#0F8FF0] shadow-[0_0_12px_rgba(15,143,240,0.5)] animpulse"></span>
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
          In Progress
        </span>
      </div>
    </div>
  );
};

export default TaskStatusChart;