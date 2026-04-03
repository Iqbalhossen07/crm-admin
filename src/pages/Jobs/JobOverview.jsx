import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/axios";
import Loader from "../Loader/Loader";
import Swal from "sweetalert2";

const JobOverview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // API States
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState(null);
  const [clientPayments, setClientPayments] = useState([]);
  const [devPayments, setDevPayments] = useState([]);

  // Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [activePaymentId, setActivePaymentId] = useState(null);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const res = await api.get(`/admin/jobs/${id}`);
        const {
          job: jobData,
          client_payments,
          developer_payments,
        } = res.data.data;

        setJob(jobData);
        setClientPayments(client_payments);
        setDevPayments(developer_payments);
      } catch (err) {
        console.error("Error fetching job details", err);
        Swal.fire("Error", "Failed to load job details.", "error");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchJobData();
  }, [id, navigate]);

  // Date Formatter
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 450, damping: 30 },
    },
    exit: { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.15 } },
  };

  if (loading) return <Loader />;
  if (!job) return null;

  const profit =
    Number(job.job_budget || 0) - Number(job.developer_budget || 0);

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
              ID: #TSK-{String(job._id).slice(-5).toUpperCase()}
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
        {/* ২. বাম পাশ (Job Details + Dev Payments) */}
        <div className="xl:col-span-7 space-y-8">
          {/* Main Job Details Card */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden relative">
            <div className="h-2 w-full bg-[#0F8FF0]"></div>
            <div className="p-10">
              <div className="flex gap-3 mb-6">
                <span
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${job.job_status === "Completed" ? "bg-green-50 text-green-600 border-green-100" : "bg-blue-50 text-blue-600 border-blue-100"}`}
                >
                  {job.job_status !== "Completed" && (
                    <i className="fa-solid fa-spinner fa-spin mr-1"></i>
                  )}
                  {job.job_status}
                </span>
                <span
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${job.payment_status === "Completed" ? "bg-green-50 text-green-600 border-green-100" : "bg-red-50 text-red-500 border-red-100"}`}
                >
                  PAYMENT: {job.payment_status?.toUpperCase()}
                </span>
              </div>
              <h2 className="text-4xl font-black text-gray-900 font-merriweather mb-6">
                {job.job_name}
              </h2>

              {/* 🎯 Project & Client Info Flex Container */}
              <div className="flex flex-wrap gap-4 mb-10">
                <div className="inline-flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-folder-open text-indigo-500"></i>
                  </div>
                  <div className="pr-4 min-w-0">
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">
                      Project Name
                    </p>
                    <p className="text-sm font-black text-gray-900 truncate">
                      {job.project_id?.project_name || "N/A"}
                    </p>
                  </div>
                </div>

                {/* 🎯 NEW: Client Name Box */}
                <div className="inline-flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-user-tie text-emerald-500"></i>
                  </div>
                  <div className="pr-4 min-w-0">
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">
                      Client Name
                    </p>
                    <p className="text-sm font-black text-gray-900 truncate">
                      {job.client_id?.name || "N/A"}
                    </p>
                  </div>
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
                      {job.created_by.substring(0, 2).toUpperCase()}
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
                    £{Number(job.job_budget).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">
                    Paid / Due
                  </p>
                  <p className="text-sm font-black text-green-600">
                    £{Number(job.paid_budget).toLocaleString()}{" "}
                    <span className="text-gray-300 mx-1">/</span>{" "}
                    <span className="text-red-500">
                      £{Number(job.due_budget).toLocaleString()}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">
                    Deadline
                  </p>
                  <p className="text-xs font-bold text-gray-700 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100 inline-block">
                    <i className="fa-regular fa-calendar mr-2 text-orange-500"></i>
                    {formatDate(job.estimate_finish_time)}
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
                    {job.developer_id?.name || "Unassigned"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">
                    Dev Budget
                  </p>
                  <p className="text-xl font-black text-gray-900">
                    £{Number(job.developer_budget).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">
                    Dev Paid / Due
                  </p>
                  <p className="text-sm font-black text-green-600">
                    £{Number(job.developer_paid).toLocaleString()}{" "}
                    <span className="text-gray-300 mx-1">/</span>{" "}
                    <span className="text-red-500">
                      £{Number(job.developer_due).toLocaleString()}
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
                    {profit >= 0
                      ? `+£${profit.toLocaleString()}`
                      : `-£${Math.abs(profit).toLocaleString()}`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Developer Payments Section (Bottom Left) */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center bg-gray-50/30">
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-3">
                <i className="fa-solid fa-laptop-code text-blue-500"></i>{" "}
                Developer Payments
              </h3>
            </div>
            {devPayments.length > 0 ? (
              <div className="overflow-x-auto p-4">
                <table className="w-full text-left text-sm text-gray-700 whitespace-nowrap">
                  <thead className="text-gray-400 text-[10px] uppercase font-black tracking-widest border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3 text-right">Amount</th>
                      <th className="px-4 py-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {devPayments.map((pay) => (
                      <tr
                        key={pay._id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-4 py-4 text-xs font-bold text-gray-500">
                          {formatDate(pay.createdAt || pay.created_at)}
                        </td>
                        <td className="px-4 py-4 font-black text-gray-900 text-right">
                          £{Number(pay.paid_amount).toLocaleString()}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span
                            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase border ${pay.status?.toLowerCase() === "completed" ? "bg-green-100/50 text-green-700 border-white" : "bg-yellow-100/50 text-yellow-700 border-white"}`}
                          >
                            {pay.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-10 text-center text-gray-400 font-bold text-sm">
                No developer payments recorded yet.
              </div>
            )}
          </div>
        </div>

        {/* ৩. ডান পাশ */}
        <div className="xl:col-span-5 space-y-8">
          {/* Activity Log (আপাদত স্ট্যাটিক) */}
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
                      Detailed task progress description here. (Static)
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Client Payments (Dynamic) */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center bg-gray-50/30">
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-3">
                <i className="fa-solid fa-money-bill-wave text-emerald-500"></i>{" "}
                Client Payments
              </h3>
            </div>
            <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
              {clientPayments.length > 0 ? (
                clientPayments.map((pay) => (
                  <div
                    key={pay._id}
                    className="bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm flex items-center justify-between relative"
                  >
                    <div>
                      <h4 className="text-lg font-black text-gray-900">
                        £{Number(pay.paid_amount).toLocaleString()}
                      </h4>
                      <p className="text-[10px] font-bold text-gray-400 mt-1">
                        {formatDate(pay.createdAt || pay.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border mr-2 ${pay.status?.toLowerCase() === "accepted" || pay.status?.toLowerCase() === "completed" ? "bg-green-50 text-green-600 border-green-100" : "bg-yellow-50 text-yellow-600 border-yellow-100"}`}
                      >
                        {pay.status}
                      </span>
                      {/* Actions */}
                      <div className="flex items-center gap-2 relative">
                        {pay.payment_screenshot && (
                          <a
                            href={pay.payment_screenshot}
                            target="_blank"
                            rel="noreferrer"
                            className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-all"
                          >
                            <i className="fa-solid fa-image text-xs"></i>
                          </a>
                        )}
                        <Link
                          to={`/payments/invoice/${pay._id}`}
                          className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all"
                        >
                          <i className="fa-solid fa-file-invoice text-xs"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 font-bold text-sm py-4">
                  No client payments recorded yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- ALL MODALS --- */}
      <AnimatePresence>
        {isUpdateModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUpdateModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
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
                <button
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="w-full py-5 bg-[#111827] text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl hover:bg-black transition-all shadow-xl flex items-center justify-center gap-3"
                >
                  <i className="fa-solid fa-rocket"></i> POST ACTIVITY
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
