import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useHeader } from "../../components/layout/HeaderContext";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/axios";
import Loader from "../Loader/Loader";
import Swal from "sweetalert2";

const DeveloperProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setHeaderData } = useHeader();

  // API States
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  // Modal States
  const [isUpdatesModalOpen, setIsUpdatesModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Action States
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);

  useEffect(() => {
    setHeaderData({
      title: "Developer Profile",
      subtitle: "Manage assignments and payouts",
      icon: "fa-solid fa-laptop-code",
    });
    fetchProfileData();
  }, [id, setHeaderData]);

  const fetchProfileData = async () => {
    try {
      const res = await api.get(`/admin/developers/${id}`);
      setProfileData(res.data.data);
    } catch (err) {
      console.error("Error fetching developer profile", err);
      Swal.fire("Error", "Could not load developer profile.", "error");
      navigate("/developers");
    } finally {
      setLoading(false);
    }
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

  // এনিমেশন কনফিগ
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 500, damping: 30 },
    },
    exit: { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.15 } },
  };

  if (loading) return <Loader />;
  if (!profileData) return null;

  const { developer: dev, stats, jobs, payments } = profileData;

  return (
    <div className="w-full pb-10 custom-scrollbar">
      {/* ১. প্রোফাইল হেডার কার্ড */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 sm:gap-8 mb-8">
        <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center gap-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full -mr-6 -mt-6 pointer-events-none"></div>
          <div className="relative shrink-0 z-10">
            <img
              src={
                dev.image ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(dev.name)}&background=0D8ABC&color=fff&size=128`
              }
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-[1.5rem] shadow-md object-cover border-4 border-white"
              alt={dev.name}
            />
            <span
              className={`absolute -bottom-1 -right-1 w-5 h-5 ${dev.status === "active" ? "bg-emerald-500" : "bg-gray-400"} border-4 border-white rounded-full`}
            ></span>
          </div>
          <div className="z-10 min-w-0">
            <h2 className="text-2xl font-black font-merriweather text-gray-900 leading-tight mb-1 truncate">
              {dev.name}
            </h2>
            <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest bg-blue-50 inline-block px-2 py-1 rounded-md mb-3 truncate max-w-full">
              {dev.skills || "Team Member"}
            </p>
            <p className="text-xs text-gray-500 font-bold flex items-center gap-2 mb-1 truncate">
              <i className="fa-solid fa-envelope w-4"></i> {dev.email}
            </p>
            <p className="text-xs text-gray-500 font-bold flex items-center gap-2 truncate">
              <i className="fa-solid fa-phone w-4"></i> {dev.phone}
            </p>
          </div>
        </div>

        <div className="xl:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Total Jobs",
              val: stats.total_tasks,
              icon: "fa-list-check",
              color: "gray",
            },
            {
              label: "Total Earned",
              val: `£${Number(stats.total_budget).toLocaleString()}`,
              icon: "fa-sack-dollar",
              color: "blue",
            },
            {
              label: "Paid Out",
              val: `£${Number(stats.total_paid).toLocaleString()}`,
              icon: "fa-money-bill-trend-up",
              color: "emerald",
            },
            {
              label: "Pending Pay",
              val: `£${Number(stats.total_due).toLocaleString()}`,
              icon: "fa-clock",
              color: "rose",
            },
          ].map((s, i) => (
            <div
              key={i}
              className={`bg-white p-6 rounded-[2rem] shadow-sm border border-${s.color === "gray" ? "gray-100" : s.color + "-100"} flex flex-col justify-center relative overflow-hidden`}
            >
              <i
                className={`fa-solid ${s.icon} absolute -right-2 -bottom-2 text-5xl text-${s.color}-50 opacity-50`}
              ></i>
              <p
                className={`text-[10px] font-black text-${s.color === "gray" ? "gray-400" : s.color + "-500"} uppercase tracking-widest mb-1 relative z-10`}
              >
                {s.label}
              </p>
              <h3
                className={`text-2xl sm:text-3xl font-black text-${s.color === "gray" ? "gray-900" : s.color + "-700"} relative z-10`}
              >
                {s.val}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {/* ২. Assigned Tasks টেবিল */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
            <i className="fa-solid fa-list-check text-indigo-500"></i> Assigned
            Tasks
          </h3>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 pl-6">Task Name</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Budget</th>
                <th className="px-4 py-3 text-right">Paid</th>
                <th className="px-4 py-3 text-right">Due</th>
                <th className="px-4 py-3 text-center pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <tr
                    key={job._id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-4 py-4 pl-6">
                      <p className="text-sm font-black text-gray-900 truncate max-w-[200px]">
                        {job.job_name}
                      </p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase mt-0.5">
                        Project: {job.project_id?.project_name || "N/A"}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span
                        className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border ${job.job_status === "Completed" ? "border-green-100 bg-green-50 text-green-600" : "border-blue-100 bg-blue-50 text-blue-600"}`}
                      >
                        {job.job_status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right font-black text-gray-900">
                      £{Number(job.developer_budget).toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-right font-black text-emerald-600">
                      £{Number(job.developer_paid).toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-right font-black text-rose-600">
                      £{Number(job.developer_due).toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-center pr-6">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setIsUpdatesModalOpen(true)}
                          className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all border border-blue-100 flex items-center gap-1.5"
                        >
                          <i className="fa-solid fa-timeline"></i> Updates
                        </button>
                        {job.developer_due > 0 && (
                          <button
                            onClick={() => {
                              setSelectedTask({
                                id: job._id,
                                name: job.job_name,
                                due: job.developer_due,
                              });
                              setIsPayModalOpen(true);
                            }}
                            className="px-3 py-1.5 bg-black text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-md"
                          >
                            Pay Dev
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-8 text-gray-400 font-bold text-sm"
                  >
                    No tasks assigned yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ৩. Payout History টেবিল */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden mb-8 relative">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50 relative z-10">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
            <i className="fa-solid fa-clock-rotate-left text-emerald-500"></i>{" "}
            Payout History
          </h3>
        </div>
        <div className="overflow-x-auto p-4 relative z-10">
          <table className="w-full text-left whitespace-nowrap border-separate border-spacing-y-2">
            <thead className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <tr>
                <th className="px-4 py-2 pl-6">Date</th>
                <th className="px-4 py-2">Task Reference</th>
                <th className="px-4 py-2 text-right">Amount Paid</th>
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.length > 0 ? (
                payments.map((pay) => (
                  <tr
                    key={pay._id}
                    className="bg-gray-50/50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 pl-6 rounded-l-2xl border-y border-l border-gray-100">
                      <p className="text-xs font-black text-gray-900">
                        {formatDate(pay.createdAt)}
                      </p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase mt-0.5">
                        ID: #{String(pay._id).slice(-6).toUpperCase()}
                      </p>
                    </td>
                    <td className="px-4 py-3 border-y border-gray-100">
                      <p className="text-xs font-bold text-gray-700">
                        {pay.job_id?.job_name || "Unknown Task"}
                      </p>
                    </td>
                    <td className="px-4 py-3 border-y border-gray-100 text-right">
                      <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                        £{Number(pay.paid_amount).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 pr-6 rounded-r-2xl border-y border-r border-gray-100 text-center">
                      <button
                        onClick={() => {
                          setSelectedPaymentId(pay._id);
                          setIsDeleteModalOpen(true);
                        }}
                        className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all mx-auto"
                      >
                        <i className="fa-solid fa-trash text-xs"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-8 text-gray-400 font-bold text-sm"
                  >
                    No payment history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ৪. MODALS SECTION (Unchanged UI, just wired to state) */}
      <AnimatePresence>
        {/* 🔥 Record Dev Payout Modal */}
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
              className="bg-white rounded-[2.5rem] max-w-lg w-full relative z-10 overflow-hidden shadow-2xl"
            >
              <div className="bg-[#111827] px-8 py-5 flex justify-between items-center text-white">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3">
                  <i className="fa-solid fa-wallet text-emerald-400"></i> RECORD
                  DEV PAYOUT
                </h3>
                <button
                  onClick={() => setIsPayModalOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <i className="fa-solid fa-xmark text-lg"></i>
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100 flex justify-between items-center">
                  <div className="min-w-0 pr-4">
                    <p className="text-[9px] font-black text-gray-400 uppercase mb-1">
                      TASK
                    </p>
                    <p className="text-lg font-black text-gray-900 truncate">
                      {selectedTask?.name}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[9px] font-black text-gray-400 uppercase mb-1">
                      AMOUNT DUE
                    </p>
                    <p className="text-xl font-black text-red-600">
                      £{selectedTask?.due}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">
                    PAYING AMOUNT (£)
                  </label>
                  <input
                    type="number"
                    defaultValue={selectedTask?.due}
                    max={selectedTask?.due}
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#0F8FF0]/20 outline-none font-black text-gray-700 text-lg"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">
                    PAYMENT DATE
                  </label>
                  <input
                    type="date"
                    defaultValue={new Date().toISOString().split("T")[0]}
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#0F8FF0]/20 outline-none font-bold text-gray-700"
                  />
                </div>
                <button className="w-full py-5 bg-[#00A378] text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl hover:bg-[#008f68] transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20">
                  <i className="fa-solid fa-paper-plane"></i> RECORD TRANSFER
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* 🔥 Task Updates Modal (Static for now as discussed) */}
        {isUpdatesModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUpdatesModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-[2.5rem] max-w-lg w-full relative z-10 overflow-hidden shadow-2xl"
            >
              <div className="bg-[#111827] px-8 py-5 flex justify-between items-center text-white">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3">
                  <i className="fa-solid fa-timeline text-blue-400"></i> TASK
                  UPDATES
                </h3>
                <button
                  onClick={() => setIsUpdatesModalOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <i className="fa-solid fa-xmark text-lg"></i>
                </button>
              </div>
              <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div className="relative pl-8 border-l-2 border-blue-100 space-y-8">
                  {[1, 2].map((_, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-white border-4 border-blue-500 shadow-sm"></div>
                      <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-black text-blue-600 uppercase">
                            Developer Update
                          </span>
                          <span className="text-[10px] text-gray-400">
                            28 Feb 2026
                          </span>
                        </div>
                        <p className="text-xs text-gray-700 font-bold leading-relaxed">
                          Updated the API integration and fixed bugs.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* 🔥 Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full relative z-10 text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-lg">
                <i className="fa-solid fa-trash-can text-3xl"></i>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2 font-merriweather">
                Delete Record?
              </h3>
              <p className="text-gray-500 text-sm font-bold mb-8 leading-relaxed">
                Are you sure you want to remove this payout record? This cannot
                be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-4 bg-gray-100 text-gray-500 font-black text-[10px] uppercase tracking-widest rounded-2xl"
                >
                  CANCEL
                </button>
                <button className="flex-1 py-4 bg-red-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-red-200">
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

export default DeveloperProfile;
