import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useHeader } from '../../components/layout/HeaderContext';
import { motion } from 'framer-motion';

const AddProject = () => {
  const { setHeaderData } = useHeader();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const selectedClientId = searchParams.get('client_id');

  const [clients] = useState([
    { id: "1", name: "Iqbal Hossen", company_name: "SETS TECH" },
    { id: "2", name: "Toukir Ahmed", company_name: "S TECH" }
  ]);

  useEffect(() => {
    setHeaderData({
      title: 'Add New Project',
      subtitle: 'Register a new client project',
      icon: 'fa-solid fa-folder-plus'
    });
  }, [setHeaderData]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="w-full">
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex-shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white/80 backdrop-blur-xl border border-gray-100 rounded-[20px] sm:rounded-[24px] px-5 py-4 shadow-sm mb-6 gap-4 sticky top-0 z-30"
      >
        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <button className="lg:hidden p-2.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors">
            <i className="fa-solid fa-bars text-sm"></i>
          </button>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-50 text-indigo-600 rounded-xl hidden sm:flex items-center justify-center shadow-sm border border-indigo-100 shrink-0">
            <i className="fa-solid fa-folder-plus text-lg sm:text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black font-merriweather text-gray-900 leading-tight">Add New Project</h1>
            <p className="text-[10px] sm:text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Register a new client project</p>
          </div>
        </div>
        <div className="w-full sm:w-auto">
          <button 
            onClick={() => navigate(-1)} 
            className="w-full sm:w-auto justify-center px-5 py-3 sm:py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg transition-all flex items-center gap-2 active:scale-95"
          >
            <i className="fa-solid fa-arrow-left"></i> Back
          </button>
        </div>
      </motion.header>

      <div className="flex-1 overflow-y-auto overflow-x-hidden pr-1 sm:pr-2 pb-10 w-full custom-scrollbar">
        <form id="addProjectForm" className="space-y-5 sm:space-y-6 max-w-4xl mx-auto mt-2" onSubmit={(e) => e.preventDefault()}>
          <motion.div variants={itemVariants} className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-[24px] sm:rounded-[30px] p-5 sm:p-8 shadow-sm relative overflow-hidden group">
            <h2 className="text-lg sm:text-xl font-bold font-merriweather text-gray-900 mb-5 border-b border-gray-200/50 pb-4 relative z-10">
              <i className="fa-solid fa-folder-open text-indigo-600 mr-2"></i> 1. Project Identification
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 relative z-10">
              <div>
                <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">Project Name *</label>
                <input type="text" placeholder="e.g. Website Redesign" required className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 text-sm font-bold text-gray-800 transition-all shadow-sm" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">Assign Client *</label>
                <div className="relative">
                  {selectedClientId ? (
                    <input type="text" value={clients.find(c => c.id === selectedClientId)?.name || 'Selected Client'} readOnly className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 cursor-not-allowed shadow-sm" />
                  ) : (
                    <div className="relative">
                      <select required className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 text-sm font-bold text-gray-800 transition-all shadow-sm appearance-none cursor-pointer">
                        <option value="" disabled selected>-- Select a Client --</option>
                        {clients.map(client => (
                          <option key={client.id} value={client.id}>{client.name} ({client.company_name})</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <i className="fa-solid fa-chevron-down text-xs"></i>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-[24px] sm:rounded-[30px] p-5 sm:p-8 shadow-sm relative overflow-hidden group">
            <h2 className="text-lg sm:text-xl font-bold font-merriweather text-gray-900 mb-5 border-b border-gray-200/50 pb-4 relative z-10">
              <i className="fa-solid fa-align-left text-orange-600 mr-2"></i> 2. Project Details
            </h2>
            <textarea rows="5" placeholder="Enter project scope..." className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 text-sm font-medium text-gray-800 transition-all shadow-sm resize-none"></textarea>
          </motion.div>

          <motion.div variants={itemVariants} className="pt-2 pb-8 flex justify-end">
            <button type="submit" className="w-full sm:w-auto justify-center px-8 py-4 bg-gray-900 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:bg-black active:scale-[0.98] sm:hover:-translate-y-1 transition-all duration-300 flex items-center gap-3">
              <i className="fa-solid fa-rocket text-lg"></i> Create Project
            </button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
};

export default AddProject;