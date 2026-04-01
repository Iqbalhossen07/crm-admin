import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHeader } from '../../components/layout/HeaderContext';
import { motion, AnimatePresence } from 'framer-motion';

const EditJob = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setHeaderData } = useHeader();

    // তোর PHP $task ডাটা অনুযায়ী স্টেট সেট করা
    const [formData, setFormData] = useState({
        task_id: id || '',
        task_name: 'Api ingration', // ডামি ভ্যালু (তোর ডাটাবেজ থেকে আসবে)
        project_name: 'Web Design',
        project_id: '1',
        task_status: 'In Progress',
        start_time: '2026-03-01',
        estimate_finish_time: '2026-03-31',
        is_free: '0',
        task_budget: '5000.00',
        paid_budget: '2500.00',
        assigned_dev_id: '1',
        dev_budget: '100.00',
        dev_paid: '20.00',
        description: 'Try more and good'
    });

    const secondaryColor = "#0F8FF0";

    // মেইন হেডার ডেটা আপডেট
    useEffect(() => {
        setHeaderData({
            title: 'Edit Job Details',
            subtitle: 'Update parameters for task #' + id,
            icon: 'fa-solid fa-pen-to-square'
        });
    }, [setHeaderData, id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // এনিমেশন কনফিগ (ফাস্ট এবং স্ন্যাপি)
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 15, scale: 0.98 },
        visible: { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            transition: { type: "spring", stiffness: 400, damping: 30 } 
        }
    };

    return (
        <motion.div 
            initial="hidden" animate="visible" variants={containerVariants}
            className="flex-1 overflow-y-auto overflow-x-hidden pr-1 sm:pr-2 pb-10 w-full custom-scrollbar"
        >
            {/* ১. প্রফেশনাল হেডার */}
            <motion.header 
                variants={cardVariants}
                className="flex-shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white/80 backdrop-blur-xl border border-gray-100 rounded-[20px] sm:rounded-[24px] px-5 py-4 shadow-sm mb-6 gap-4 sticky top-0 z-30"
            >
                <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    <button className="lg:hidden p-2.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors">
                        <i className="fa-solid fa-bars text-sm"></i>
                    </button>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 text-indigo-600 rounded-xl hidden sm:flex items-center justify-center shadow-sm border border-indigo-200 shrink-0">
                        <i className="fa-solid fa-pen-to-square text-lg sm:text-xl"></i>
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-black font-merriweather text-gray-900 leading-tight">Edit Job</h1>
                        <p className="text-[10px] sm:text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Update task parameters</p>
                    </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 sm:gap-5">
                    <button 
                        onClick={() => navigate(-1)}
                        className="w-full sm:w-auto justify-center px-5 py-3 sm:py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg transition-all flex items-center gap-2 active:scale-95"
                    >
                        <i className="fa-solid fa-arrow-left"></i> Back
                    </button>
                    <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
                    <div className="hidden sm:flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-sm font-bold text-gray-900 leading-tight">Admin Panel</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Sets Tech</p>
                        </div>
                        <img src="https://ui-avatars.com/api/?name=Sets+Tech&background=0D8ABC&color=fff" className="w-11 h-11 rounded-xl border-2 border-gray-100 shadow-sm shrink-0" alt="Admin" />
                    </div>
                </div>
            </motion.header>

            <form className="space-y-5 sm:space-y-6 max-w-4xl mx-auto mt-2" onSubmit={(e) => e.preventDefault()}>
                
                {/* Section 1: Update Task Details */}
                <motion.div variants={cardVariants} className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-[24px] sm:rounded-[30px] p-5 sm:p-8 shadow-sm cute-card relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-bl-full -mr-6 -mt-6 pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>
                    <h2 className="text-lg sm:text-xl font-bold font-merriweather text-gray-900 mb-5 border-b border-gray-200/50 pb-4 relative z-10">
                        <i className="fa-solid fa-layer-group text-purple-600 mr-2"></i> 1. Update Task Details
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 relative z-10">
                        <div className="md:col-span-2">
                            <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">Task Title *</label>
                            <input 
                                type="text" name="task_name" value={formData.task_name} onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl outline-none focus:ring-2 transition-all shadow-sm font-bold text-gray-800"
                                style={{ "--tw-ring-color": `${secondaryColor}22`, focusBorderColor: secondaryColor }}
                            />
                        </div>
                        
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">Project (Fixed)</label>
                            <input type="text" value={formData.project_name} readOnly className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 cursor-not-allowed" />
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">Status</label>
                            <div className="relative">
                                <select 
                                    name="task_status" value={formData.task_status} onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl outline-none text-sm font-bold text-gray-800 appearance-none cursor-pointer shadow-sm focus:ring-2 focus:ring-[#0F8FF0]/10"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500"><i className="fa-solid fa-chevron-down text-xs"></i></div>
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">Start Date</label>
                            <input type="date" name="start_time" value={formData.start_time} onChange={handleChange} className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl outline-none text-sm font-bold text-gray-800 shadow-sm focus:ring-2 focus:ring-[#0F8FF0]/10" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">Estimate Finish Date</label>
                            <input type="date" name="estimate_finish_time" value={formData.estimate_finish_time} onChange={handleChange} className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl outline-none text-sm font-bold text-gray-800 shadow-sm focus:ring-2 focus:ring-[#0F8FF0]/10" />
                        </div>
                    </div>
                </motion.div>

                {/* Section 2: Billing & Budget */}
                <motion.div variants={cardVariants} className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-[24px] sm:rounded-[30px] p-5 sm:p-8 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-bl-full -mr-6 -mt-6 pointer-events-none"></div>
                    <h2 className="text-lg sm:text-xl font-bold font-merriweather text-gray-900 mb-5 border-b border-gray-200/50 pb-4 relative z-10"><i className="fa-solid fa-file-invoice-dollar text-green-600 mr-2"></i> 2. Client Billing & Budget</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 relative z-10">
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">Is this a Free Task?</label>
                            <div className="relative">
                                <select 
                                    name="is_free" value={formData.is_free} onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl outline-none text-sm font-bold text-gray-800 appearance-none cursor-pointer shadow-sm focus:ring-2 focus:ring-green-500/20"
                                >
                                    <option value="0">No, It's Paid</option>
                                    <option value="1">Yes, Free Task</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500"><i className="fa-solid fa-chevron-down text-xs"></i></div>
                            </div>
                        </div>

                        <AnimatePresence>
                            {formData.is_free === "0" && (
                                <>
                                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                                        <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">Client Charge (£)</label>
                                        <input type="number" step="0.01" name="task_budget" value={formData.task_budget} onChange={handleChange} className="w-full px-4 py-3 bg-green-50/50 border border-green-200 rounded-xl text-base font-black text-green-700 outline-none shadow-sm focus:ring-2 focus:ring-[#0F8FF0]/20" />
                                    </motion.div>
                                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                                        <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">Already Paid (£)</label>
                                        <input type="number" step="0.01" name="paid_budget" value={formData.paid_budget} onChange={handleChange} className="w-full px-4 py-3 bg-blue-50/50 border border-blue-200 rounded-xl text-base font-black text-blue-700 outline-none shadow-sm focus:ring-2 focus:ring-[#0F8FF0]/20" />
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Section 3: Team & Cost */}
                <motion.div variants={cardVariants} className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-[24px] sm:rounded-[30px] p-5 sm:p-8 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full -mr-6 -mt-6 pointer-events-none"></div>
                    <h2 className="text-lg sm:text-xl font-bold font-merriweather text-gray-900 mb-5 border-b border-gray-200/50 pb-4 relative z-10"><i className="fa-solid fa-users-gear text-blue-600 mr-2"></i> 3. Internal Team & Cost</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 relative z-10">
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">Assign Developer</label>
                            <div className="relative">
                                <select 
                                    name="assigned_dev_id" value={formData.assigned_dev_id} onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl outline-none text-sm font-bold text-gray-800 appearance-none cursor-pointer shadow-sm focus:ring-2 focus:ring-blue-500/20"
                                >
                                    <option value="">-- Unassigned --</option>
                                    <option value="1">Iqbal Hossen</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500"><i className="fa-solid fa-chevron-down text-xs"></i></div>
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">Dev Budget (£)</label>
                            <input type="number" step="0.01" name="dev_budget" value={formData.dev_budget} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-base font-black text-gray-800 outline-none focus:ring-2 focus:ring-[#0F8FF0]/20 shadow-sm" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">Dev Paid (£)</label>
                            <input type="number" step="0.01" name="dev_paid" value={formData.dev_paid} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-base font-black text-gray-600 outline-none focus:ring-2 focus:ring-[#0F8FF0]/20 shadow-sm" />
                        </div>
                    </div>
                </motion.div>

                {/* Section 4: Description */}
                <motion.div variants={cardVariants} className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-[24px] sm:rounded-[30px] p-5 sm:p-8 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-bl-full -mr-6 -mt-6 pointer-events-none"></div>
                    <h2 className="text-lg sm:text-xl font-bold font-merriweather text-gray-900 mb-5 border-b border-gray-200/50 pb-4 relative z-10"><i className="fa-solid fa-align-left text-orange-600 mr-2"></i> 4. Task Description</h2>
                    <div className="relative z-10">
                        <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">Instructions / Details</label>
                        <textarea 
                            name="description" rows="4" value={formData.description} onChange={handleChange}
                            className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20 text-sm font-medium text-gray-800 transition-all shadow-sm resize-none"
                        ></textarea>
                    </div>
                </motion.div>

                <motion.div variants={cardVariants} className="pt-2 pb-8 flex justify-end">
                    <button 
                        type="submit" 
                        className="w-full sm:w-auto px-10 py-4 bg-[#111827] text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:bg-black hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center gap-3"
                    >
                        <i className="fa-solid fa-save text-lg"></i> Update Job Details
                    </button>
                </motion.div>
            </form>
        </motion.div>
    );
};

export default EditJob;