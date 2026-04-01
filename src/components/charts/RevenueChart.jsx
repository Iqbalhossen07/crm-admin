import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const RevenueChart = () => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#000',
        padding: 12,
        cornerRadius: 10,
        displayColors: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.04)', drawBorder: false },
        ticks: { font: { size: 10, weight: 'bold' }, color: '#9ca3af' },
      },
      x: {
        grid: { display: true, color: 'rgba(0, 0, 0, 0.03)' },
        ticks: { font: { size: 10, weight: 'bold' }, color: '#9ca3af' },
      },
    },
    elements: {
      line: { tension: 0.4 },
      point: {
        radius: 4,
        backgroundColor: '#fff',
        borderColor: '#0F8FF0',
        borderWidth: 2,
        hoverRadius: 6,
      },
    },
  };

  const data = {
    labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    datasets: [
      {
        fill: true,
        label: 'Revenue',
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        borderColor: '#0F8FF0',
        borderWidth: 3,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(15, 143, 240, 0.1)');
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          return gradient;
        },
      },
    ],
  };

  return (
    /* তোর দেওয়া HTML অনুযায়ী সাদা ব্যাকগ্রাউন্ড আর প্রিমিয়াম কন্টেইনার */
    <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm w-full h-full flex flex-col transition-all hover:shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-sm md:text-lg text-gray-800 font-merriweather tracking-tight">
          Revenue Growth
        </h3>
        {/* ছোট একটা স্ট্যাটাস ডট */}
        <div className="w-2 h-2 rounded-full bg-[#0F8FF0] animate-pulse shadow-[0_0_10px_#0F8FF0]"></div>
      </div>

      <div className="flex-1 h-64 sm:h-80 relative">
        <Line options={options} data={data} />
      </div>
    </div>
  );
};

export default RevenueChart;