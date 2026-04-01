import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useHeader } from '../../components/layout/HeaderContext';
import { motion, AnimatePresence } from 'framer-motion';

const JobList = () => {
  const { setHeaderData } = useHeader();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const projectId = searchParams.get('project_id');
  const [searchTerm, setSearchTerm] = useState('');
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [jobs] = useState([
    {
      task_id: 1,
      project_id: "1",
      project_name: "WEB DESIGN",
      task_name: "Api ingration",
      task_status: "IN PROGRESS",
      created_by: "ADMIN",
      dev_name: "IQBAL HOSSEN",
      start_time: "28 Feb 26",
      estimate_finish_time: "01 Mar 26",
      task_budget: "5,000",
      paid_budget: "2,500",
      due_budget: "2,500",
    }
  ]);

  useEffect(() => {
    setHeaderData({
      title: projectId ? 'Project Jobs' : 'All Job Logs',
      subtitle: 'Manage and track all workflow tasks',
      icon: 'fa-solid fa-list-check'
    });
  }, [setHeaderData, projectId]);

  const filteredJobs = jobs.filter((job) => job.task_name.toLowerCase().includes(searchTerm.toLowerCase()));

  // ফাস্ট এনিমেশন কনফিগ
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { 
        opacity: 1, scale: 1, y: 0, 
        transition: { type: "spring", stiffness: 450, damping: 30 } 
    },
    exit: { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.15 } }
  };

  return (
    <motion.div initial="hidden" animate="visible" className="w-full pb-10">
      
      {/* সার্চ ও ফিল্টার */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-8 gap-3 px-1">
        <div className="relative w-full sm:w-72 group">
          <input type="text" placeholder="Search tasks or projects..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0F8FF0]/20 shadow-sm" />
          <span className="absolute left-3.5 top-3 text-gray-400 group-focus-within:text-[#0F8FF0]"><i className="fa-solid fa-magnifying-glass text-sm"></i></span>
        </div>
        <Link to="/jobs/add" className="w-full sm:w-auto flex justify-center items-center gap-2 px-6 py-2.5 bg-black text-white rounded-xl text-sm font-bold shadow-md hover:bg-[#0F8FF0] transition-all">
            <i className="fa-solid fa-plus"></i> Add Task
        </Link>
      </div>

      {/* কার্ড গ্রিড (স্লিমার ডিজাইন) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
        {filteredJobs.map((job) => (
          <motion.div key={job.task_id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50 relative flex flex-col h-full hover:shadow-md transition-all">
            
            <div className="flex justify-between items-center mb-4">
              <span className="bg-gray-50 text-gray-500 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-gray-100 flex items-center gap-1.5">
                <i className="fa-solid fa-folder-open text-gray-400"></i> {job.project_name}
              </span>
              <span className="bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-blue-100">
                {job.task_status}
              </span>
            </div>

            <div className="mb-4">
              <h4 className="text-xl font-black text-gray-900 leading-tight mb-2 font-merriweather">{job.task_name}</h4>
              <div className="flex items-center gap-2">
                <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-1">
                  <i className="fa-solid fa-user-pen"></i> BY: {job.created_by}
                </p>
                <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                <p className="text-[9px] text-[#0F8FF0] font-black uppercase tracking-widest flex items-center gap-1">
                  <i className="fa-solid fa-code"></i> DEV: {job.dev_name}
                </p>
              </div>
            </div>

            {/* টাইমলাইন (স্লিম ভার্সন) */}
            <div className="mb-5 bg-gray-50/50 border border-gray-100 p-4 rounded-2xl flex items-center gap-3">
              <div className="bg-white h-9 w-9 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center shrink-0">
                <i className="fa-solid fa-calendar-days text-gray-400 text-sm"></i>
              </div>
              <div>
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Timeline</p>
                <p className="text-xs font-black text-gray-700 tracking-wide">
                  {job.start_time} <span className="text-gray-300 mx-0.5">→</span> {job.estimate_finish_time}
                </p>
              </div>
            </div>

            {/* বাজেটিং বক্স (স্লিম ভার্সন) */}
            <div className="flex items-center justify-between py-3 mb-5 border-t border-gray-50">
              <div className="text-center flex-1">
                <p className="text-[8px] font-black text-gray-400 uppercase mb-0.5">Total</p>
                <p className="text-[13px] font-black text-gray-900">£{job.task_budget}</p>
              </div>
              <div className="w-px h-6 bg-gray-100 mx-1"></div>
              <div className="text-center flex-1">
                <p className="text-[8px] font-black text-green-500 uppercase mb-0.5">Paid</p>
                <p className="text-[13px] font-black text-green-600">£{job.paid_budget}</p>
              </div>
              <div className="w-px h-6 bg-gray-100 mx-1"></div>
              <div className="text-center flex-1 bg-red-50/50 rounded-xl py-1.5">
                <p className="text-[8px] font-black text-red-400 uppercase mb-0.5">Due</p>
                <p className="text-[13px] font-black text-red-600">£{job.due_budget}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-auto gap-3">
              <button onClick={() => { setSelectedJob(job); setIsPayModalOpen(true); }} className="px-5 h-10 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-[0.1em] flex items-center gap-2 shadow-lg hover:bg-[#0F8FF0] transition-all active:scale-95">
                <i className="fa-solid fa-coins"></i> PAY
              </button>
              <div className="flex items-center gap-1.5">
                <Link to={`/jobs/view/${job.task_id}`} className="h-9 w-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-[#0F8FF0] hover:text-white transition-all border border-blue-100"><i className="fas fa-eye text-xs"></i></Link>
                <Link to={`/jobs/edit/${job.task_id}`} className="h-9 w-9 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all border border-green-100"><i className="fas fa-pencil text-xs"></i></Link>
                <button onClick={() => setIsDeleteModalOpen(true)} className="h-9 w-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all border border-red-100"><i className="fas fa-trash text-xs"></i></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* RECORD PAYMENT MODAL (হুবহু স্ক্রিনশট অনুযায়ী) */}
      <AnimatePresence>
        {isPayModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPayModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div variants={modalVariants} initial="hidden" animate="visible" exit="exit" className="bg-white rounded-[2.5rem] max-w-lg w-full relative z-10 overflow-hidden shadow-2xl">
              <div className="bg-[#111827] px-8 py-5 flex justify-between items-center">
                <h3 className="text-white text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3">
                  <i className="fa-solid fa-money-bill-transfer text-green-400"></i> RECORD PAYMENT
                </h3>
                <button onClick={() => setIsPayModalOpen(false)} className="text-gray-400 hover:text-white transition-colors"><i className="fa-solid fa-xmark text-lg"></i></button>
              </div>
              <div className="p-8 space-y-6">
                {/* টাস্ক ডিটেইলস বক্স */}
                <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100 flex justify-between items-center">
                   <div>
                     <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">TASK NAME</p>
                     <p className="text-lg font-black text-gray-900 font-merriweather">{selectedJob?.task_name}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">DUE AMOUNT</p>
                     <p className="text-xl font-black text-red-600">£{selectedJob?.due_budget}</p>
                   </div>
                </div>

                {/* পেমেন্ট ইনপুট */}
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">PAYMENT AMOUNT (£)</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">£</span>
                    <input type="number" defaultValue={selectedJob?.due_budget?.replace(',','')} className="w-full pl-10 pr-5 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#0F8FF0]/20 outline-none font-black text-gray-700 text-lg" />
                  </div>
                </div>

                {/* ডেট পিকার */}
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">PAYMENT DATE</label>
                  <input type="date" defaultValue="2026-03-31" className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#0F8FF0]/20 outline-none font-bold text-gray-700 uppercase tracking-widest" />
                </div>

                {/* ফাইল আপলোড */}
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">SCREENSHOT / RECEIPT</label>
                  <div className="flex items-center w-full bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                    <button className="px-6 py-4 bg-indigo-50 text-indigo-600 font-black text-[10px] uppercase tracking-widest border-r border-indigo-100 hover:bg-indigo-100 transition-all">BROWSE...</button>
                    <p className="px-4 text-[11px] text-gray-400 font-bold">No file selected.</p>
                  </div>
                </div>

                {/* কনফার্ম বাটন */}
                <button className="w-full py-5 bg-black text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl hover:shadow-xl hover:shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                  <i className="fa-solid fa-check"></i> CONFIRM PAYMENT
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div variants={modalVariants} initial="hidden" animate="visible" exit="exit" className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full relative z-10 text-center shadow-2xl">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-lg"><i className="fa-solid fa-trash-can text-3xl"></i></div>
              <h3 className="text-2xl font-black text-gray-900 mb-2 font-merriweather">Confirm?</h3>
              <p className="text-gray-500 text-sm font-bold mb-8">Delete this job record permanently?</p>
              <div className="flex gap-3">
                <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-4 bg-gray-100 text-gray-500 font-black text-[10px] uppercase tracking-widest rounded-2xl">CANCEL</button>
                <button className="flex-1 py-4 bg-red-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl">YES, DELETE</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default JobList;