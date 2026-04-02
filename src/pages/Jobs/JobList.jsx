import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useHeader } from "../../components/layout/HeaderContext";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/axios";
import Swal from "sweetalert2";
import Loader from "../Loader/Loader";

const JobList = () => {
  const { setHeaderData } = useHeader();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const projectId = searchParams.get("project_id");

  // স্টেটস
  const [jobs, setJobs] = useState([]);
  const [projectsList, setProjectsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // মোডাল স্টেটস
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // ১. হেডার সেটআপ
  useEffect(() => {
    setHeaderData({
      title: projectId ? "Project Jobs" : "All Job Logs",
      subtitle: "Manage and track all workflow tasks",
      icon: "fa-solid fa-list-check",
    });
  }, [setHeaderData, projectId]);

  // ২. প্রজেক্ট লিস্ট এবং জব ডাটা ফেচ করা
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // ড্রপডাউনের জন্য প্রজেক্ট লিস্ট
        const projRes = await api.get("/admin/jobs/projects-list");
        setProjectsList(projRes.data.data);

        // জব লিস্ট (প্রজেক্ট আইডি থাকলে ফিল্টার হয়ে আসবে)
        const url = projectId
          ? `/admin/jobs?project_id=${projectId}`
          : "/admin/jobs";
        const jobRes = await api.get(url);

        // 🎯 লেটেস্ট জব আগে আনার জন্য ডাটা রিভার্স করে স্টেটে রাখা হলো
        const sortedData = jobRes.data.data.reverse();
        setJobs(sortedData);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [projectId]);

  // ফিল্টার লজিক
  const filteredJobs = jobs.filter(
    (job) =>
      job.job_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.project_id?.project_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  // 🎯 ডিলিট হ্যান্ডেলার (অস্থায়ী থেকে পার্মানেন্ট!)
  const handleDelete = async () => {
    if (!selectedJob) return;

    try {
      // ব্যাকএন্ডে ডিলিট রিকোয়েস্ট পাঠানো হচ্ছে
      const res = await api.delete(`/admin/jobs/${selectedJob._id}`);

      if (res.data.success) {
        // ডিলিট সফল হলে স্টেট থেকে ওই জবটা সরিয়ে দেওয়া হচ্ছে (পেজ রিলোড ছাড়াই)
        setJobs(jobs.filter((job) => job._id !== selectedJob._id));
        setIsDeleteModalOpen(false);

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Job has been completely removed.",
          timer: 2000,
          showConfirmButton: false,
          borderRadius: "2rem",
        });
      }
    } catch (error) {
      console.error("Delete Error:", error);
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: error.response?.data?.error || "Could not delete the job.",
        borderRadius: "2rem",
      });
    }
  };

  // ডেট ফরম্যাটার
  const formatDate = (dateString) => {
    if (!dateString) return "TBA";
    const options = { day: "2-digit", month: "short", year: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  // এনিমেশন কনফিগ
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

  return (
    <motion.div initial="hidden" animate="visible" className="w-full pb-10">
      {/* 🎯 সার্চ, ফিল্টার এবং অ্যাড জব বাটন */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between mb-8 gap-4 px-1">
        {/* সার্চ ইনপুট */}
        <div className="relative w-full xl:w-80 group shrink-0">
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0F8FF0]/20 shadow-sm transition-all"
          />
          <span className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#0F8FF0]">
            <i className="fa-solid fa-magnifying-glass text-sm"></i>
          </span>
        </div>

        {/* ফিল্টার ড্রপডাউন এবং বাটনস */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
          {/* প্রজেক্ট সিলেক্ট ড্রপডাউন */}
          <div className="relative w-full sm:w-64 shrink-0">
            <select
              value={projectId || ""}
              onChange={(e) => {
                if (e.target.value)
                  navigate(`/jobs?project_id=${e.target.value}`);
                else navigate(`/jobs`);
              }}
              className="w-full appearance-none bg-white border border-gray-200 rounded-xl py-3 pl-4 pr-10 text-xs font-black uppercase tracking-widest text-gray-700 outline-none focus:ring-2 focus:ring-[#0F8FF0]/20 shadow-sm cursor-pointer"
            >
              <option value="">ALL PROJECTS</option>
              {projectsList.map((proj) => (
                <option key={proj._id} value={proj._id}>
                  {proj.project_name} ({proj.client_id?.name})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
              <i className="fa-solid fa-chevron-down text-xs"></i>
            </div>
          </div>

          {/* ক্লিয়ার ফিল্টার বাটন */}
          {(searchTerm || projectId) && (
            <button
              onClick={() => {
                setSearchTerm("");
                navigate("/jobs");
              }}
              className="px-5 py-3 bg-red-50 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-red-100 transition-all shrink-0"
            >
              <i className="fa-solid fa-xmark mr-1"></i> Clear
            </button>
          )}

          {/* Add Job বাটন (শুধুমাত্র প্রজেক্ট আইডি থাকলে দেখাবে) */}
          {projectId && (
            <Link
              to={`/jobs/add?project_id=${projectId}`}
              className="w-full sm:w-auto flex justify-center items-center gap-2 px-6 py-3 bg-black text-white rounded-xl text-[10px] uppercase tracking-widest font-black shadow-lg hover:bg-[#0F8FF0] transition-all shrink-0 active:scale-95"
            >
              <i className="fa-solid fa-plus text-sm"></i> Add Job
            </Link>
          )}
        </div>
      </div>

      {/* 🎯 কার্ড গ্রিড (আপনার অরিজিনাল স্লিম ডিজাইন) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
        <AnimatePresence>
          {filteredJobs.map((job) => (
            <motion.div
              layout
              key={job._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50 relative flex flex-col h-full hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="bg-gray-50 text-gray-500 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-gray-100 flex items-center gap-1.5 truncate max-w-[60%]">
                  <i className="fa-solid fa-folder-open text-gray-400"></i>{" "}
                  {job.project_id?.project_name}
                </span>
                <span
                  className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${job.job_status === "Completed" ? "bg-green-50 text-green-600 border-green-100" : "bg-blue-50 text-blue-600 border-blue-100"}`}
                >
                  {job.job_status}
                </span>
              </div>

              <div className="mb-4">
                <h4 className="text-xl font-black text-gray-900 leading-tight mb-2 font-merriweather">
                  {job.job_name}
                </h4>
                <div className="flex items-center gap-2">
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-1">
                    <i className="fa-solid fa-user-pen"></i> BY:{" "}
                    {job.created_by}
                  </p>
                  <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                  <p className="text-[9px] text-[#0F8FF0] font-black uppercase tracking-widest flex items-center gap-1 truncate">
                    <i className="fa-solid fa-code"></i> DEV:{" "}
                    {job.developer_id?.name || "Unassigned"}
                  </p>
                </div>
              </div>

              {/* টাইমলাইন */}
              <div className="mb-5 bg-gray-50/50 border border-gray-100 p-4 rounded-2xl flex items-center gap-3">
                <div className="bg-white h-9 w-9 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-calendar-days text-gray-400 text-sm"></i>
                </div>
                <div>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                    Timeline
                  </p>
                  <p className="text-[11px] font-black text-gray-700 tracking-wide">
                    {formatDate(job.start_time)}{" "}
                    <span className="text-gray-300 mx-0.5">→</span>{" "}
                    {formatDate(job.estimate_finish_time)}
                  </p>
                </div>
              </div>

              {/* বাজেটিং বক্স */}
              <div className="flex items-center justify-between py-3 mb-5 border-t border-gray-50">
                <div className="text-center flex-1">
                  <p className="text-[8px] font-black text-gray-400 uppercase mb-0.5">
                    Total
                  </p>
                  <p className="text-[13px] font-black text-gray-900">
                    £{job.job_budget?.toLocaleString()}
                  </p>
                </div>
                <div className="w-px h-6 bg-gray-100 mx-1"></div>
                <div className="text-center flex-1">
                  <p className="text-[8px] font-black text-green-500 uppercase mb-0.5">
                    Paid
                  </p>
                  <p className="text-[13px] font-black text-green-600">
                    £{job.paid_budget?.toLocaleString()}
                  </p>
                </div>
                <div className="w-px h-6 bg-gray-100 mx-1"></div>
                <div className="text-center flex-1 bg-red-50/50 rounded-xl py-1.5">
                  <p className="text-[8px] font-black text-red-400 uppercase mb-0.5">
                    Due
                  </p>
                  <p className="text-[13px] font-black text-red-600">
                    £{job.due_budget?.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* অ্যাকশন বাটনস */}
              <div className="flex items-center justify-between mt-auto gap-3">
                <button
                  onClick={() => {
                    setSelectedJob(job);
                    setIsPayModalOpen(true);
                  }}
                  disabled={job.due_budget <= 0}
                  className={`px-5 h-10 rounded-full text-[10px] font-black uppercase tracking-[0.1em] flex items-center gap-2 shadow-sm transition-all active:scale-95 ${job.due_budget > 0 ? "bg-black text-white hover:bg-[#0F8FF0] shadow-lg" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                >
                  <i className="fa-solid fa-coins"></i>{" "}
                  {job.due_budget > 0 ? "PAY" : "PAID"}
                </button>
                <div className="flex items-center gap-2">
                  {" "}
                  {/* opacity এবং group-hover ক্লাসগুলো সরিয়ে দেওয়া হয়েছে */}
                  <Link
                    to={`/jobs/view/${job._id}`}
                    className="h-9 w-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-[#0F8FF0] hover:text-white transition-all border border-blue-100 shadow-sm"
                  >
                    <i className="fas fa-eye text-sm"></i>
                  </Link>
                  <Link
                    to={`/jobs/edit/${job._id}`}
                    className="h-9 w-9 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all border border-green-100 shadow-sm"
                  >
                    <i className="fas fa-pencil text-sm"></i>
                  </Link>
                  <button
                    onClick={() => {
                      setSelectedJob(job);
                      setIsDeleteModalOpen(true);
                    }}
                    className="h-9 w-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all border border-red-100 shadow-sm"
                  >
                    <i className="fas fa-trash text-sm"></i>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 🎯 এম্পটি স্টেট (No Jobs Found) */}
      {filteredJobs.length === 0 && !loading && (
        <div className="col-span-full text-center py-20 bg-white rounded-[3rem] border border-gray-100 shadow-sm mt-4">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fa-solid fa-folder-open text-4xl text-gray-300"></i>
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-2 font-merriweather">
            No Jobs Found
          </h3>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
            {projectId
              ? "No jobs exist for this project yet."
              : "Try adjusting your search or filters."}
          </p>
          {projectId && (
            <Link
              to={`/jobs/add?project_id=${projectId}`}
              className="inline-flex items-center gap-2 mt-6 px-8 py-3.5 bg-black text-white rounded-xl text-[10px] uppercase tracking-widest font-black shadow-lg hover:bg-[#0F8FF0] transition-all"
            >
              <i className="fa-solid fa-plus"></i> Create First Job
            </Link>
          )}
        </div>
      )}

      {/* 🎯 RECORD PAYMENT MODAL */}
      <AnimatePresence>
        {isPayModalOpen && selectedJob && (
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
              <div className="bg-[#111827] px-8 py-5 flex justify-between items-center">
                <h3 className="text-white text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3">
                  <i className="fa-solid fa-money-bill-transfer text-green-400"></i>{" "}
                  RECORD PAYMENT
                </h3>
                <button
                  onClick={() => setIsPayModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <i className="fa-solid fa-xmark text-lg"></i>
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100 flex justify-between items-center">
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                      TASK NAME
                    </p>
                    <p className="text-lg font-black text-gray-900 font-merriweather">
                      {selectedJob.job_name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                      DUE AMOUNT
                    </p>
                    <p className="text-xl font-black text-red-600">
                      £{selectedJob.due_budget?.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">
                    PAYMENT AMOUNT (£)
                  </label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                      £
                    </span>
                    <input
                      type="number"
                      defaultValue={selectedJob.due_budget}
                      className="w-full pl-10 pr-5 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#0F8FF0]/20 outline-none font-black text-gray-700 text-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">
                    PAYMENT DATE
                  </label>
                  <input
                    type="date"
                    defaultValue={new Date().toISOString().split("T")[0]}
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#0F8FF0]/20 outline-none font-bold text-gray-700 uppercase tracking-widest"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">
                    SCREENSHOT / RECEIPT
                  </label>
                  <div className="flex items-center w-full bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                    <button className="px-6 py-4 bg-indigo-50 text-indigo-600 font-black text-[10px] uppercase tracking-widest border-r border-indigo-100 hover:bg-indigo-100 transition-all">
                      BROWSE...
                    </button>
                    <p className="px-4 text-[11px] text-gray-400 font-bold">
                      No file selected.
                    </p>
                  </div>
                </div>

                <button className="w-full py-5 bg-black text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl hover:shadow-xl hover:shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                  <i className="fa-solid fa-check"></i> CONFIRM PAYMENT
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🎯 DELETE CONFIRMATION */}
      <AnimatePresence>
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
                Confirm?
              </h3>
              <p className="text-gray-500 text-sm font-bold mb-8">
                Delete this job record permanently?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-4 bg-gray-100 text-gray-500 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-gray-200"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-4 bg-red-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-lg hover:bg-red-700 active:scale-95 transition-all"
                >
                  YES, DELETE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default JobList;
