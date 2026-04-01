import React, { useEffect } from "react";
import { useHeader } from "../components/layout/HeaderContext";
import { motion } from "framer-motion";
import RevenueChart from "../components/charts/RevenueChart";
import TaskStatusChart from "../components/charts/TaskStatusChart";
import RecentTasks from "../components/Tables/RecentTasks";
import RecentPayments from "../components/Tables/RecentPayments"; 
const Dashboard = () => {
  const { setHeaderData } = useHeader();

  useEffect(() => {
    setHeaderData({
      title: "Dashboard",
      subtitle: "Sets Tech CRM v2.0",
      icon: "fa-solid fa-grip", // ফন্ট অসাম ক্লাস
    });
  }, []);

  const stats = [
    {
      label: "Total Budget",
      val: "£45,200",
      icon: "fa-coins",
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      trend: "+12%",
    },
    {
      label: "Total Paid",
      val: "£32,800",
      icon: "fa-wallet",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      trend: "+8%",
    },
    {
      label: "Total Due",
      val: "£12,400",
      icon: "fa-clock",
      color: "text-rose-600",
      bg: "bg-rose-50",
      trend: "-2%",
    },
    {
      label: "Active Projects",
      val: "24",
      icon: "fa-layer-group",
      color: "text-blue-600",
      bg: "bg-blue-50",
      trend: "+4",
    },
  ];

  return (
    <div className="space-y-10 pb-10">
      {/* Stat Cards */}
     <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
  {stats.map((item, index) => (
    <motion.div
      key={index}
      whileHover={{ y: -8 }}
      className="bg-white p-5 sm:p-7 rounded-[1.8rem] sm:rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-3 sm:gap-5 hover:shadow-xl hover:shadow-gray-200/50 transition-all group"
    >
      {/* আইকন বক্স - মোবাইলে ছোট করা হয়েছে (w-11 h-11) */}
      <div
        className={`w-11 h-11 sm:w-14 sm:h-14 ${item.bg} ${item.color} rounded-xl sm:rounded-[1.5rem] flex items-center justify-center text-lg sm:text-2xl transition-transform group-hover:scale-110 shadow-inner`}
      >
        <i className={`fa-solid ${item.icon}`}></i>
      </div>

      <div>
        {/* লেবেল - মোবাইলে আরও ছোট */}
        <p className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-0.5 sm:mb-1">
          {item.label}
        </p>
        {/* ভ্যালু - মোবাইলে সাইজ কমানো হয়েছে (text-lg) */}
        <h2 className="text-lg sm:text-2xl font-black text-[#030746] tracking-tight">
          {item.val}
        </h2>
      </div>
    </motion.div>
  ))}
</div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* ১. রেভিনিউ গ্রোথ - পিসিতে ২/৩ জায়গা নিবে */}
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>

        {/* ২. টাস্ক স্ট্যাটাস (ডোনাট চার্ট) - পিসিতে ১/৩ জায়গা নিবে */}
        <div className="lg:col-span-1">
          <TaskStatusChart />
        </div>
      </div>

      {/* ৩. রিসেন্ট টাস্ক এবং পেমেন্টস - চার্টের নিচে আসবে */}
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
    <RecentTasks />
    <RecentPayments />
</div>
    </div>
  );
};

export default Dashboard;
