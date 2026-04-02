import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useHeader } from "../../components/layout/HeaderContext";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/axios";
import Loader from "../Loader/Loader";
import Swal from "sweetalert2";

const ProjectOverview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setHeaderData } = useHeader();

  // 🎯 States for API Data
  const [loading, setLoading] = useState(true);
  const [projectInfo, setProjectInfo] = useState(null);
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [payments, setPayments] = useState([]);

  // Modal States
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentToDelete, setPaymentToDelete] = useState(null);

  // 🎯 Fetch Data from API
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const res = await api.get(`/admin/projects/${id}`);
        const { project_info, stats, jobs, payments } = res.data.data;

        setProjectInfo(project_info);
        setStats(stats);
        setJobs(jobs);
        setPayments(payments);

        // Update Header
        setHeaderData({
          title: project_info.project_name,
          subtitle: `Client: ${project_info.client_id?.name || "Unknown"}`,
          icon: "fa-solid fa-folder-open",
        });
      } catch (err) {
        Swal.fire("Error", "Failed to load project details", "error");
        navigate("/projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id, setHeaderData, navigate]);

  const handleDeleteClick = (payment) => {
    setPaymentToDelete(payment);
    setIsDeleteAlertOpen(true);
  };

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

  if (loading) return <Loader />;
  if (!projectInfo) return null;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full px-1 pb-10"
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
                {projectInfo.project_name}
              </h1>
              <p className="text-[10px] sm:text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                Client:{" "}
                <Link
                  to={`/clients/view/${projectInfo.client_id?._id}`}
                  className="text-[#0F8FF0] hover:underline font-black"
                >
                  {projectInfo.client_id?.name}
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Link
            to={`/projects/edit/${projectInfo._id}`}
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
          <div className="text-sm text-gray-600 font-medium leading-relaxed bg-gray-50/50 p-4 sm:p-5 rounded-2xl border border-gray-50 min-h-[140px] relative z-10 prose prose-sm max-w-none">
            {projectInfo.description ? (
              <div
                dangerouslySetInnerHTML={{ __html: projectInfo.description }}
                className="ql-editor-content" // আপনি চাইলে কাস্টম ক্লাস দিতে পারেন
              />
            ) : (
              "No description provided."
            )}
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
                  £{Number(stats?.calc_total_budget || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center bg-green-50/50 p-3 sm:p-4 rounded-2xl border border-green-50">
                <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">
                  Total Paid
                </span>
                <span className="text-sm sm:text-base font-black text-green-700">
                  £{Number(stats?.calc_paid_amount || 0).toLocaleString()}
                </span>
              </div>
              <div
                className={`flex justify-between items-center p-3 sm:p-4 rounded-2xl border ${stats?.calc_due_amount > 0 ? "bg-red-50/50 border-red-50" : "bg-gray-50 border-gray-50"}`}
              >
                <span
                  className={`text-[10px] font-black uppercase tracking-widest ${stats?.calc_due_amount > 0 ? "text-red-500" : "text-gray-400"}`}
                >
                  Due Amount
                </span>
                <span
                  className={`text-base sm:text-lg font-black ${stats?.calc_due_amount > 0 ? "text-red-600" : "text-gray-900"}`}
                >
                  £{Number(stats?.calc_due_amount || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ৩. Job Assignments সেকশন */}
      <motion.div
        variants={itemVariants}
        className="bg-white border border-gray-100 rounded-3xl sm:rounded-[2rem] shadow-sm overflow-hidden mb-8 relative"
      >
        <div className="p-5 sm:p-8 flex justify-between items-center border-b border-gray-50 bg-white/50 backdrop-blur-sm">
          <div>
            <h3 className="font-black text-xl sm:text-2xl font-merriweather text-gray-900">
              Job Assignments
            </h3>
            <p className="text-[10px] sm:text-xs text-gray-500 font-bold mt-1 uppercase tracking-widest">
              Total Jobs:{" "}
              <span className="text-[#0F8FF0] font-black">{jobs.length}</span>
            </p>
          </div>
          <Link
            to={`/jobs/add?project_id=${projectInfo._id}`}
            className="px-4 py-2 sm:px-5 sm:py-2.5 bg-black text-white font-bold text-[10px] sm:text-xs uppercase tracking-widest rounded-xl shadow-md hover:bg-gray-800 transition-all flex items-center gap-2 active:scale-95"
          >
            <i className="fa-solid fa-plus"></i>{" "}
            <span className="hidden sm:inline">New Job</span>
          </Link>
        </div>

        {/* Desktop Table for Jobs */}
        <div className="hidden md:block overflow-x-auto p-5">
          <table className="w-full text-left text-sm text-gray-700 whitespace-nowrap">
            <thead className="text-gray-400 text-[10px] uppercase font-black tracking-widest border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 pl-8">Job Name</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Budget</th>
                <th className="px-6 py-4 text-right">Paid</th>
                <th className="px-6 py-4 text-right">Due</th>
                <th className="px-6 py-4 text-center pr-8">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {jobs.map((job) => (
                <tr
                  key={job._id}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="px-6 py-5 pl-8 font-black text-gray-900 text-base">
                    {job.job_name}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${job.job_status === "Completed" ? "bg-green-50 text-green-600 border-green-100" : "bg-orange-50 text-orange-600 border-orange-100"}`}
                    >
                      {job.job_status}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-black text-gray-900 text-right">
                    £{Number(job.job_budget || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-5 font-bold text-green-600 text-right">
                    £{Number(job.paid_budget || 0).toLocaleString()}
                  </td>
                  <td
                    className={`px-6 py-5 font-black text-right ${job.due_budget > 0 ? "text-red-600" : "text-gray-400"}`}
                  >
                    £{Number(job.due_budget || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-5 text-center pr-8">
                    <div className="flex items-center justify-center gap-2">
                      {job.due_budget > 0 ? (
                        <button
                          onClick={() => {
                            setSelectedTask(job);
                            setIsPayModalOpen(true);
                          }}
                          className="px-4 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase rounded-lg hover:bg-black transition-all"
                        >
                          Pay
                        </button>
                      ) : (
                        <span className="text-green-600 font-black text-[10px] uppercase mr-2">
                          Paid
                        </span>
                      )}
                      <Link
                        to={`/jobs/view/${job._id}`}
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

        {/* Desktop Table for Payments */}
        <div className="hidden md:block overflow-x-auto p-5">
          <table className="w-full text-left text-sm text-gray-700 whitespace-nowrap">
            <thead className="text-gray-400 text-[10px] uppercase font-black tracking-widest border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 pl-8">Date</th>
                <th className="px-6 py-4">Reference Job</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Receipt</th>
                <th className="px-6 py-4 text-center pr-8">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {payments.map((pay) => (
                <tr
                  key={pay._id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-5 pl-8 text-xs font-bold text-gray-500">
                    <i className="fa-regular fa-calendar-check mr-2"></i>{" "}
                    {formatDate(pay.createdAt)}
                  </td>
                  <td className="px-6 py-5 font-bold text-gray-900">
                    {pay.job_id?.job_name || "N/A"}
                  </td>
                  <td className="px-6 py-5 font-black text-gray-900 text-right">
                    £{Number(pay.paid_amount || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase border ${pay.status?.toLowerCase() === "completed" ? "bg-green-100/50 text-green-700 border-white" : "bg-yellow-100/50 text-yellow-700 border-white"}`}
                    >
                      {pay.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    {/* 🎯 Receipt Logic Implementation */}
                    {pay.status?.toLowerCase() === "accepted" &&
                    pay.payment_screenshot ? (
                      <a
                        href={pay.payment_screenshot}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#0F8FF0] font-black text-[10px] uppercase tracking-widest hover:underline cursor-pointer"
                      >
                        <i className="fa-solid fa-paperclip mr-1"></i> View
                      </a>
                    ) : (
                      <span className="text-gray-300 font-bold text-[9px] uppercase">
                        No File
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5 text-center pr-8">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        to={`/payments/invoice/${pay._id}`}
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
      </motion.div>

      {/* --- ALL MODALS (No visual changes, just mapping selectedTask) --- */}
      <AnimatePresence>
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
                      Job Name
                    </p>
                    <p className="text-xs sm:text-sm font-black text-gray-900 truncate max-w-[150px]">
                      {selectedTask?.job_name}
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
                {/* ... (rest of the form remains same) ... */}
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
      </AnimatePresence>
    </motion.div>
  );
};

export default ProjectOverview;
