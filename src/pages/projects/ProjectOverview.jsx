import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useHeader } from "../../components/layout/HeaderContext";
import { motion, AnimatePresence } from "framer-motion";

const ProjectOverview = () => {
  const { id } = useParams();
  const { setHeaderData } = useHeader();

  // States
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentToDelete, setPaymentToDelete] = useState(null);

  // ডামি ডাটা
  const [project] = useState({
    project_id: id || 1,
    project_name: "CRM Dashboard Redesign",
    client_id: 101,
    client_name: "Iqbal Hossen",
    description:
      "Full responsive website redesign using React and Tailwind CSS. Target audience is enterprise users.",
    calc_total_budget: 25000.0,
    calc_paid_amount: 18000.0,
    calc_due_amount: 7000.0,
  });

  const [tasks] = useState([
    {
      task_id: 1,
      task_name: "UI/UX Design Phase",
      task_status: "Completed",
      task_budget: 10000,
      paid_budget: 10000,
      due_budget: 0,
      project_id: 1,
    },
    {
      task_id: 2,
      task_name: "Frontend Development",
      task_status: "In Progress",
      task_budget: 15000,
      paid_budget: 8000,
      due_budget: 7000,
      project_id: 1,
    },
  ]);

  const [payments] = useState([
    {
      payment_id: 1,
      payment_date: "2026-03-25",
      task_name: "UI/UX Design Phase",
      amount: 10000,
      status: "Accepted",
      payment_screenshot: "rec1.jpg",
    },
    {
      payment_id: 2,
      payment_date: "2026-03-28",
      task_name: "Frontend Development",
      amount: 8000,
      status: "Pending",
      payment_screenshot: null,
    },
  ]);

  useEffect(() => {
    setHeaderData({
      title: project.project_name,
      subtitle: `Client: ${project.client_name}`,
      icon: "fa-solid fa-folder-open",
    });
  }, [setHeaderData, project]);

  const handleDeleteClick = (payment) => {
    setPaymentToDelete(payment);
    setIsDeleteAlertOpen(true);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const modalVariants = {
    hidden: { scale: 0.9, opacity: 0, y: 20 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 25 },
    },
    exit: { scale: 0.9, opacity: 0, y: 20, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full px-1"
    >
      {/* ১. হেডার সেকশন */}
      <motion.header
        variants={itemVariants}
        className="bg-white/80 backdrop-blur-xl px-4 sm:px-6 py-4 rounded-2xl sm:rounded-[2rem] shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4 sticky top-0 z-30"
      >
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-50 text-[#0F8FF0] rounded-xl flex items-center justify-center shadow-sm border border-indigo-100 shrink-0">
              <i className="fa-solid fa-folder-open text-lg sm:text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black font-merriweather text-gray-900 leading-tight">
                {project.project_name}
              </h1>
              <p className="text-[10px] sm:text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                Client:{" "}
                <Link
                  to={`/clients/view/${project.client_id}`}
                  className="text-[#0F8FF0] hover:underline font-black"
                >
                  {project.client_name}
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Link
            to={`/projects/edit/${project.project_id}`}
            className="flex-1 sm:flex-none justify-center px-4 py-2.5 bg-green-50 text-green-700 hover:bg-green-100 font-bold text-[10px] sm:text-xs uppercase tracking-widest rounded-xl flex items-center gap-2 transition-all active:scale-95"
          >
            <i className="fa-solid fa-pencil"></i> Edit
          </Link>
          <Link
            to="/projects"
            className="flex-1 sm:flex-none justify-center px-4 py-2.5 bg-gray-900 hover:bg-black text-white font-bold text-[10px] sm:text-xs uppercase tracking-widest rounded-xl shadow-md flex items-center gap-2 transition-all active:scale-95"
          >
            <i className="fa-solid fa-arrow-left"></i> Back
          </Link>
        </div>
      </motion.header>

      {/* ২. ডিটেইলস এবং ফিন্যান্স গ্রিড */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 mb-8">
        <motion.div
          variants={itemVariants}
          className="lg:col-span-7 xl:col-span-8 bg-white p-6 sm:p-8 rounded-3xl sm:rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-bl-full -mr-8 -mt-8 pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
          <h2 className="text-lg sm:text-xl font-bold font-merriweather text-gray-900 mb-4 flex items-center gap-2 relative z-10">
            <i className="fa-solid fa-align-left text-[#0F8FF0]"></i> Project
            Details
          </h2>
          <div className="text-sm text-gray-600 font-medium leading-relaxed bg-gray-50/50 p-4 sm:p-5 rounded-2xl border border-gray-50 min-h-[140px] relative z-10">
            {project.description}
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="lg:col-span-5 xl:col-span-4 bg-white p-6 sm:p-8 rounded-3xl sm:rounded-[2rem] shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-50/50 rounded-bl-full -mr-8 -mt-8 pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
          <div className="relative z-10">
            <h2 className="text-lg sm:text-xl font-bold font-merriweather text-gray-900 mb-5 flex items-center gap-2">
              <i className="fa-solid fa-chart-pie text-green-500"></i> Financial
              Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-gray-50/80 p-3 sm:p-4 rounded-2xl border border-gray-100">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Total Budget
                </span>
                <span className="text-sm sm:text-base font-black text-gray-900">
                  £{project.calc_total_budget.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center bg-green-50/50 p-3 sm:p-4 rounded-2xl border border-green-50">
                <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">
                  Total Paid
                </span>
                <span className="text-sm sm:text-base font-black text-green-700">
                  £{project.calc_paid_amount.toLocaleString()}
                </span>
              </div>
              <div
                className={`flex justify-between items-center p-3 sm:p-4 rounded-2xl border ${project.calc_due_amount > 0 ? "bg-red-50/50 border-red-50" : "bg-gray-50 border-gray-50"}`}
              >
                <span
                  className={`text-[10px] font-black uppercase tracking-widest ${project.calc_due_amount > 0 ? "text-red-500" : "text-gray-400"}`}
                >
                  Due Amount
                </span>
                <span
                  className={`text-base sm:text-lg font-black ${project.calc_due_amount > 0 ? "text-red-600" : "text-gray-900"}`}
                >
                  £{project.calc_due_amount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ৩. Task Assignments সেকশন */}
      <motion.div
        variants={itemVariants}
        className="bg-white border border-gray-100 rounded-3xl sm:rounded-[2rem] shadow-sm overflow-hidden mb-8 relative"
      >
        <div className="p-5 sm:p-8 flex justify-between items-center border-b border-gray-50 bg-white/50 backdrop-blur-sm">
          <div>
            <h3 className="font-black text-xl sm:text-2xl font-merriweather text-gray-900">
              Task Assignments
            </h3>
            <p className="text-[10px] sm:text-xs text-gray-500 font-bold mt-1 uppercase tracking-widest">
              Total Tasks:{" "}
              <span className="text-[#0F8FF0] font-black">{tasks.length}</span>
            </p>
          </div>
          <button className="px-4 py-2 sm:px-5 sm:py-2.5 bg-black text-white font-bold text-[10px] sm:text-xs uppercase tracking-widest rounded-xl shadow-md hover:bg-gray-800 transition-all flex items-center gap-2 active:scale-95">
            <i className="fa-solid fa-plus"></i>{" "}
            <span className="hidden sm:inline">New Task</span>
          </button>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto p-5">
          <table className="w-full text-left text-sm text-gray-700 whitespace-nowrap">
            <thead className="text-gray-400 text-[10px] uppercase font-black tracking-widest border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 pl-8">Task Name</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Budget</th>
                <th className="px-6 py-4 text-right">Paid</th>
                <th className="px-6 py-4 text-right">Due</th>
                <th className="px-6 py-4 text-center pr-8">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tasks.map((task) => (
                <tr
                  key={task.task_id}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="px-6 py-5 pl-8 font-black text-gray-900 text-base">
                    {task.task_name}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                        task.task_status === "Completed"
                          ? "bg-green-50 text-green-600 border-green-100"
                          : "bg-orange-50 text-orange-600 border-orange-100"
                      }`}
                    >
                      {task.task_status}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-black text-gray-900 text-right">
                    £{task.task_budget.toLocaleString()}
                  </td>
                  <td className="px-6 py-5 font-bold text-green-600 text-right">
                    £{task.paid_budget.toLocaleString()}
                  </td>
                  <td
                    className={`px-6 py-5 font-black text-right ${task.due_budget > 0 ? "text-red-600" : "text-gray-400"}`}
                  >
                    £{task.due_budget.toLocaleString()}
                  </td>
                  <td className="px-6 py-5 text-center pr-8">
                    <div className="flex items-center justify-center gap-2">
                      {task.due_budget > 0 ? (
                        <button
                          onClick={() => {
                            setSelectedTask(task);
                            setIsPayModalOpen(true);
                          }}
                          className="px-4 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase rounded-lg hover:bg-black transition-all"
                        >
                          Pay
                        </button>
                      ) : (
                        <span className="text-green-600 font-black text-[10px] uppercase">
                          Paid
                        </span>
                      )}
                      <Link
                        to={`/tasks/view/${task.task_id}`}
                        className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-blue-50 transition-colors"
                      >
                        <i className="fa-solid fa-eye text-xs"></i>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View (Card System) */}
        <div className="md:hidden grid grid-cols-1 gap-4 p-4 bg-gray-50/30">
          {tasks.map((task) => (
            <div
              key={task.task_id}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <p className="font-black text-gray-900 text-base leading-tight">
                  {task.task_name}
                </p>
                <span
                  className={`px-2 py-1 rounded-md text-[8px] font-black uppercase border ${task.task_status === "Completed" ? "bg-green-50 text-green-600 border-green-100" : "bg-orange-50 text-orange-600 border-orange-100"}`}
                >
                  {task.task_status}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-5">
                <div className="text-center bg-gray-50 p-2 rounded-xl border border-gray-100">
                  <p className="text-[8px] font-black text-gray-400 uppercase mb-0.5">
                    Budget
                  </p>
                  <p className="text-[11px] font-black text-gray-900">
                    £{task.task_budget}
                  </p>
                </div>
                <div className="text-center bg-green-50/30 p-2 rounded-xl border border-green-50">
                  <p className="text-[8px] font-black text-green-500 uppercase mb-0.5">
                    Paid
                  </p>
                  <p className="text-[11px] font-black text-green-600">
                    £{task.paid_budget}
                  </p>
                </div>
                <div
                  className={`text-center p-2 rounded-xl border ${task.due_budget > 0 ? "bg-red-50/30 border-red-50" : "bg-gray-50 border-gray-50"}`}
                >
                  <p
                    className={`text-[8px] font-black uppercase mb-0.5 ${task.due_budget > 0 ? "text-red-500" : "text-gray-400"}`}
                  >
                    Due
                  </p>
                  <p
                    className={`text-[11px] font-black ${task.due_budget > 0 ? "text-red-600" : "text-gray-900"}`}
                  >
                    £{task.due_budget}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {task.due_budget > 0 && (
                  <button
                    onClick={() => {
                      setSelectedTask(task);
                      setIsPayModalOpen(true);
                    }}
                    className="flex-1 py-3 bg-indigo-600 text-white text-[10px] font-black uppercase rounded-xl flex items-center justify-center gap-2 active:scale-95"
                  >
                    <i className="fa-solid fa-coins"></i> Pay Now
                  </button>
                )}
                <Link
                  to={`/tasks/view/${task.task_id}`}
                  className="w-12 h-10 bg-gray-50 text-gray-400 flex items-center justify-center rounded-xl border border-gray-100"
                >
                  <i className="fa-solid fa-eye text-sm"></i>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ৪. Payment History সেকশন */}
      <motion.div
        variants={itemVariants}
        className="bg-white border border-gray-100 rounded-3xl sm:rounded-[2rem] shadow-sm overflow-hidden mb-10 relative"
      >
        <div className="p-5 sm:p-8 border-b border-gray-50 bg-white/50 backdrop-blur-sm">
          <h3 className="font-black text-xl sm:text-2xl font-merriweather text-gray-900">
            Payment History
          </h3>
          <p className="text-[10px] sm:text-xs text-gray-500 font-bold mt-1 uppercase tracking-widest">
            Transaction logs for this project.
          </p>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto p-5">
          <table className="w-full text-left text-sm text-gray-700 whitespace-nowrap">
            <thead className="text-gray-400 text-[10px] uppercase font-black tracking-widest border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 pl-8">Date</th>
                <th className="px-6 py-4">Reference Task</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Receipt</th>
                <th className="px-6 py-4 text-center pr-8">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {payments.map((pay) => (
                <tr
                  key={pay.payment_id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-5 pl-8 text-xs font-bold text-gray-500">
                    <i className="fa-regular fa-calendar-check mr-2"></i>
                    {pay.payment_date}
                  </td>
                  <td className="px-6 py-5 font-bold text-gray-900">
                    {pay.task_name}
                  </td>
                  <td className="px-6 py-5 font-black text-gray-900 text-right">
                    £{pay.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase border ${
                        pay.status === "Accepted"
                          ? "bg-green-100/50 text-green-700 border-white"
                          : "bg-yellow-100/50 text-yellow-700 border-white"
                      }`}
                    >
                      {pay.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    {pay.payment_screenshot ? (
                      <button className="text-[#0F8FF0] font-black text-[10px] uppercase tracking-widest hover:underline">
                        <i className="fa-solid fa-paperclip mr-1"></i> View
                      </button>
                    ) : (
                      <span className="text-gray-300 font-bold text-[9px] uppercase">
                        No File
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5 text-center pr-8">
                    <div className="flex items-center justify-center gap-2">
                  
                      <Link
                        to={`/payments/Invoice/${pay.payment_id}`}
                        className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-[#0F8FF0] hover:text-white transition-all shadow-sm"
                        title="View Invoice"
                      >
                        <i className="fa-solid fa-file-invoice text-xs"></i>
                      </Link>
                      <button
                        onClick={() => {
                          setSelectedPayment(pay);
                          setIsStatusModalOpen(true);
                        }}
                        className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all shadow-sm"
                      >
                        <i className="fa-solid fa-rotate text-xs"></i>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(pay)}
                        className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm"
                      >
                        <i className="fa-solid fa-trash text-xs"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View (Card System) */}
        <div className="md:hidden grid grid-cols-1 gap-4 p-4 bg-gray-50/30">
          {payments.map((pay) => (
            <div
              key={pay.payment_id}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden"
            >
              <div className="flex justify-between items-center mb-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <i className="fa-regular fa-calendar mr-1"></i>{" "}
                  {pay.payment_date}
                </p>
                <span
                  className={`px-2 py-1 rounded-md text-[8px] font-black uppercase border ${
                    pay.status === "Accepted"
                      ? "bg-green-100/50 text-green-700 border-white"
                      : "bg-yellow-100/50 text-yellow-700 border-white"
                  }`}
                >
                  {pay.status}
                </span>
              </div>
              <p className="font-black text-gray-900 text-sm mb-1">
                {pay.task_name}
              </p>
              <p className="font-black text-gray-900 text-lg mb-4">
                £{pay.amount.toLocaleString()}
              </p>

              <div className="flex gap-2 pt-4 border-t border-gray-50">
                <button className="flex-1 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase">
                  <i className="fa-solid fa-file-invoice"></i> INVOICE
                </button>
                <button
                  onClick={() => {
                    setSelectedPayment(pay);
                    setIsStatusModalOpen(true);
                  }}
                  className="flex-1 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase"
                >
                  <i className="fa-solid fa-rotate"></i> STATUS
                </button>
                <button
                  onClick={() => handleDeleteClick(pay)}
                  className="w-12 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center active:scale-90"
                >
                  <i className="fa-solid fa-trash text-sm"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* --- ALL MODALS --- */}

      <AnimatePresence>
        {/* ৫. Record Payment Modal */}
        {isPayModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPayModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden relative z-10"
            >
              <div className="bg-gray-900 p-6 text-white flex justify-between items-center">
                <h3 className="font-black uppercase tracking-widest text-sm flex items-center gap-2">
                  <i className="fa-solid fa-money-bill-wave text-green-400"></i>{" "}
                  Record Payment
                </h3>
                <button
                  onClick={() => setIsPayModalOpen(false)}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <i className="fa-solid fa-xmark text-xl"></i>
                </button>
              </div>
              <form className="p-8" onSubmit={(e) => e.preventDefault()}>
                <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Task Name
                    </p>
                    <p className="text-xs sm:text-sm font-black text-gray-900 truncate max-w-[150px]">
                      {selectedTask?.task_name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Due Amount
                    </p>
                    <p className="text-sm sm:text-base font-black text-red-600">
                      £{selectedTask?.due_budget}
                    </p>
                  </div>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-500 mb-2 ml-1">
                      Payment Amount (£)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-10 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0F8FF0]/20 transition-all"
                      />
                      <span className="absolute left-4 top-3 text-gray-400 font-black">
                        £
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-500 mb-2 ml-1">
                      Screenshot / Receipt
                    </label>
                    <input
                      type="file"
                      className="w-full text-xs font-black file:bg-indigo-50 file:border-0 file:rounded-xl file:px-4 file:py-2 file:text-indigo-600"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full mt-8 py-4 bg-black text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-lg active:scale-95 transition-all"
                >
                  Confirm Transaction
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* ৬. Status Update Modal */}
        {isStatusModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsStatusModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden relative z-10"
            >
              <div className="bg-[#0F8FF0] p-6 text-white flex justify-between items-center">
                <h3 className="font-black uppercase tracking-widest text-sm flex items-center gap-2">
                  <i className="fa-solid fa-rotate"></i> Update Status
                </h3>
                <button
                  onClick={() => setIsStatusModalOpen(false)}
                  className="text-white/50 hover:text-white"
                >
                  <i className="fa-solid fa-xmark text-xl"></i>
                </button>
              </div>
              <div className="p-8 text-center">
                <p className="text-[10px] font-black text-gray-400 uppercase mb-6 tracking-widest">
                  Update Payment ID: #{selectedPayment?.payment_id}
                </p>
                <select
                  defaultValue={selectedPayment?.status}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-6 text-sm font-black text-gray-800 outline-none focus:ring-2 focus:ring-[#0F8FF0]/20 mb-6 appearance-none text-center"
                >
                  <option value="Pending">Pending Status</option>
                  <option value="Accepted">Accepted / Paid</option>
                  <option value="Rejected">Rejected Payment</option>
                </select>
                <button
                  onClick={() => setIsStatusModalOpen(false)}
                  className="w-full py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs active:scale-95 transition-all shadow-xl shadow-black/10"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* ৭. Delete Confirmation Alert (নতুন) */}
        {isDeleteAlertOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteAlertOpen(false)}
              className="absolute inset-0 bg-red-900/20 backdrop-blur-md"
            />
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white w-full max-w-xs rounded-[2rem] shadow-2xl border border-red-50 p-8 text-center relative z-10"
            >
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-inner border border-red-100">
                <i className="fa-solid fa-trash-can"></i>
              </div>
              <h4 className="text-xl font-black font-merriweather text-gray-900 mb-2">
                Are you sure?
              </h4>
              <p className="text-xs text-gray-500 font-bold mb-8 leading-relaxed">
                This transaction record will be permanently deleted from the
                logs.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteAlertOpen(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-500 font-black text-[10px] uppercase rounded-xl transition-all hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsDeleteAlertOpen(false)}
                  className="flex-1 py-3 bg-red-600 text-white font-black text-[10px] uppercase rounded-xl shadow-lg shadow-red-200 transition-all hover:bg-red-700 active:scale-95"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProjectOverview;
