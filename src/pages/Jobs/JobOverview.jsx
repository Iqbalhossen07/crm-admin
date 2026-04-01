import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const JobOverview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // মোডাল এবং ড্রপডাউন স্টেট
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [activePaymentId, setActivePaymentId] = useState(null);

  // ডামি ডাটা
  const [job] = useState({
    task_id: id || 1,
    task_name: "Api ingration",
    project_name: "Web Design",
    task_status: "IN PROGRESS",
    created_by: "Admin",
    task_budget: 5000.0,
    paid_budget: 2500.0,
    due_budget: 2500.0,
    estimate_finish_time: "Mar 01, 2026",
    dev_name: "Iqbal Hossen",
    dev_budget: 100.0,
    dev_paid: 20.0,
    dev_due: 80.0,
    description: "Describe the progress, notes, or feedback here...",
  });

  const profit = job.task_budget - job.dev_budget;

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 450, damping: 30 },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 10,
      transition: { duration: 0.15 },
    },
  };
  return (
    <div className="w-full pb-10 custom-scrollbar">
      {/* ১. টপ হেডার */}
      <header className="flex flex-col sm:flex-row items-center justify-between bg-white/80 backdrop-blur-xl border border-gray-100 rounded-[24px] px-6 py-4 shadow-sm mb-8 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-sm border border-indigo-100">
            <i className="fa-solid fa-list-check text-xl"></i>
          </div>
          <div>
            <h1 className="text-2xl font-black font-merriweather text-gray-900 leading-tight tracking-tight">
              Task Details
            </h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
              ID: #TSK-{String(job.task_id).padStart(4, "0")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <Link
            to={`/jobs/edit/${id}`}
            className="px-5 py-2.5 bg-green-50 text-green-700 hover:bg-green-100 font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"
          >
            <i className="fa-solid fa-pencil"></i> Edit
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 bg-[#111827] text-white font-bold text-[10px] uppercase tracking-widest rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95"
          >
            <i className="fa-solid fa-arrow-left"></i> Back
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* ২. বাম পাশ */}
        <div className="xl:col-span-7 space-y-8">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden relative">
            <div className="h-2 w-full bg-[#0F8FF0]"></div>
            <div className="p-10">
              <div className="flex gap-3 mb-6">
                <span className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100">
                  <i className="fa-solid fa-spinner fa-spin mr-1"></i>{" "}
                  {job.task_status}
                </span>
                <span className="px-3 py-1.5 bg-red-50 text-red-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-red-100">
                  PAYMENT: INCOMPLETED
                </span>
              </div>
              <h2 className="text-4xl font-black text-gray-900 font-merriweather mb-6">
                {job.task_name}
              </h2>
              <div className="inline-flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100 mb-10">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-folder-open text-indigo-500"></i>
                </div>
                <div className="pr-4 min-w-0">
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">
                    Project Name
                  </p>
                  <p className="text-sm font-black text-gray-900 truncate">
                    {job.project_name}
                  </p>
                </div>
              </div>
              {/* Economics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-8 border-t border-gray-100">
                <div className="col-span-full mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-3 py-1 rounded-lg">
                    Client Economics
                  </span>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">
                    Created By
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-blue-900 text-white rounded-full flex items-center justify-center text-[10px] font-black">
                      AD
                    </div>
                    <p className="text-xs font-bold text-gray-900">
                      {job.created_by}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">
                    Client Budget
                  </p>
                  <p className="text-xl font-black text-gray-900">
                    £{job.task_budget.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">
                    Paid / Due
                  </p>
                  <p className="text-sm font-black text-green-600">
                    £{job.paid_budget.toLocaleString()}{" "}
                    <span className="text-gray-300 mx-1">/</span>{" "}
                    <span className="text-red-500">
                      £{job.due_budget.toLocaleString()}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">
                    Deadline
                  </p>
                  <p className="text-xs font-bold text-gray-700 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100 inline-block">
                    <i className="fa-regular fa-calendar mr-2 text-orange-500"></i>
                    {job.estimate_finish_time}
                  </p>
                </div>
              </div>
              {/* Internal Costings */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-8 border-y border-gray-100 bg-gray-50/30 -mx-10 px-10">
                <div className="col-span-full mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-50 px-3 py-1 rounded-lg">
                    Internal Costings
                  </span>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">
                    Assigned Dev
                  </p>
                  <p className="text-xs font-bold text-gray-900 flex items-center gap-2">
                    <i className="fa-solid fa-code text-blue-500"></i>
                    {job.dev_name}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">
                    Dev Budget
                  </p>
                  <p className="text-xl font-black text-gray-900">
                    £{job.dev_budget.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">
                    Dev Paid / Due
                  </p>
                  <p className="text-sm font-black text-green-600">
                    £{job.dev_paid.toLocaleString()}{" "}
                    <span className="text-gray-300 mx-1">/</span>{" "}
                    <span className="text-red-500">
                      £{job.dev_due.toLocaleString()}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">
                    Profit Margin
                  </p>
                  <p
                    className={`text-xs font-black px-3 py-1.5 rounded-lg border inline-block ${profit >= 0 ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-rose-600 bg-rose-50 border-rose-100"}`}
                  >
                    +
                    {profit >= 0
                      ? `£${profit.toLocaleString()}`
                      : `-£${Math.abs(profit).toLocaleString()}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ৩. ডান পাশ */}
        <div className="xl:col-span-5 space-y-8">
          {/* Activity Log */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-3">
                <i className="fa-solid fa-timeline text-indigo-500"></i>{" "}
                Activity Log
              </h3>
              <button
                onClick={() => setIsUpdateModalOpen(true)}
                className="px-4 py-2 bg-black text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-gray-800 shadow-md active:scale-95 flex items-center gap-2"
              >
                <i className="fa-solid fa-plus"></i> ADD
              </button>
            </div>
            <div className="p-8 max-h-[450px] overflow-y-auto custom-scrollbar space-y-6">
              {[1, 2].map((item, index) => (
                <div
                  key={index}
                  className="relative pl-8 border-l-2 border-indigo-50 last:border-0 pb-2"
                >
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-blue-500 shadow-sm"></div>
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${index % 2 === 0 ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-indigo-50 text-indigo-600 border-indigo-100"}`}
                        >
                          {index % 2 === 0 ? "DEVELOPER" : "ADMIN"}
                        </span>
                        <span className="text-xs font-bold text-gray-900">
                          {index % 2 === 0 ? "Iqbal Hossen" : "Toukir Ahmed"}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-gray-400">
                        28 Feb, 2026
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 font-medium leading-relaxed">
                      Detailed task progress description here.
                    </p>
                    <button className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-indigo-100 hover:bg-indigo-100 transition-colors">
                      <i className="fa-solid fa-link"></i> View Attachment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Client Payments (Fixing Overflow) */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 relative">
            <div className="p-6 border-b border-gray-50 flex items-center bg-gray-50/30 rounded-t-[2.5rem]">
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-3">
                <i className="fa-solid fa-money-bill-wave text-emerald-500"></i>{" "}
                Client Payments
              </h3>
            </div>
            <div className="p-6">
              <div className="bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm flex items-center justify-between relative">
                <div>
                  <h4 className="text-lg font-black text-gray-900">£500.00</h4>
                  <p className="text-[10px] font-bold text-gray-400 mt-1">
                    26 Feb, 2026
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg bg-red-50 text-red-500 text-[9px] font-black uppercase tracking-widest border border-red-100 mr-2">
                    REJECTED
                  </span>

                  <div className="flex items-center gap-2 relative">
                    <button className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-all">
                      <i className="fa-solid fa-image text-xs"></i>
                    </button>
                    <button className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all">
                      <i className="fa-solid fa-file-invoice text-xs"></i>
                    </button>

                    {/* Status dropdown controller */}
                    <div className="relative">
                      <button
                        onClick={() =>
                          setActivePaymentId(activePaymentId === 1 ? null : 1)
                        }
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all shadow-sm active:scale-90 ${activePaymentId === 1 ? "bg-orange-500 text-white" : "bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white"}`}
                      >
                        <i className="fa-solid fa-rotate text-xs"></i>
                      </button>

                      <AnimatePresence>
                        {activePaymentId === 1 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 bottom-full mb-2 w-36 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-gray-100 p-2 z-[100]"
                          >
                            <button className="w-full text-left px-4 py-2.5 text-[10px] font-black uppercase text-green-600 hover:bg-green-50 rounded-xl transition-colors">
                              Accept
                            </button>
                            <button className="w-full text-left px-4 py-2.5 text-[10px] font-black uppercase text-yellow-600 hover:bg-yellow-50 rounded-xl transition-colors">
                              Pending
                            </button>
                            <button className="w-full text-left px-4 py-2.5 text-[10px] font-black uppercase text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                              Reject
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <button
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                    >
                      <i className="fa-solid fa-trash text-xs"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ৪. পোস্ট অ্যাক্টিভিটি মোডাল */}
      <AnimatePresence>
        {isUpdateModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUpdateModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            ></motion.div>
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-[2.5rem] max-w-lg w-full relative z-10 overflow-hidden shadow-2xl"
            >
              <div className="bg-[#111827] px-8 py-6 flex justify-between items-center">
                <h3 className="text-white text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3">
                  <i className="fa-solid fa-paper-plane text-blue-400"></i> POST
                  ACTIVITY UPDATE
                </h3>
                <button
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <i className="fa-solid fa-xmark text-xl"></i>
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">
                    UPDATE DETAILS
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Describe the progress..."
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0F8FF0]/20 transition-all font-medium text-gray-700"
                  ></textarea>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">
                    REFERENCE LINK (OPTIONAL)
                  </label>
                  <input
                    type="text"
                    placeholder="https://..."
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0F8FF0]/20 transition-all font-medium text-gray-700"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">
                    DATE OF UPDATE
                  </label>
                  <input
                    type="date"
                    defaultValue="2026-03-31"
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0F8FF0]/20 transition-all font-medium text-gray-700"
                  />
                </div>
                <button className="w-full py-5 bg-[#111827] text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl hover:bg-black transition-all shadow-xl flex items-center justify-center gap-3">
                  <i className="fa-solid fa-rocket"></i> POST ACTIVITY
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ৫. ডিলিট কনফার্মেশন মোডাল */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            ></motion.div>
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full relative z-10 text-center shadow-2xl"
            >
              <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border-8 border-white shadow-inner">
                <i className="fa-solid fa-trash-can text-4xl"></i>
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-2 font-merriweather leading-tight">
                Confirm?
              </h3>
              <p className="text-gray-500 text-sm font-bold mb-10 leading-relaxed">
                Are you absolutely sure you want to delete this payment record?
                This is permanent.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-4 bg-gray-100 text-gray-500 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-gray-200"
                >
                  CANCEL
                </button>
                <button className="flex-1 py-4 bg-red-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-red-700 shadow-xl shadow-red-200">
                  YES, DELETE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobOverview;
