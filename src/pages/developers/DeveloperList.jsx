import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useHeader } from '../../components/layout/HeaderContext';
import { motion, AnimatePresence } from 'framer-motion';

const DeveloperList = () => {
    const { setHeaderData } = useHeader();
    const [searchTerm, setSearchTerm] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedDevId, setSelectedDevId] = useState(null);

    // তোর PHP ডাটা স্ট্রাকচার অনুযায়ী ডামি ডাটা
    const [developers] = useState([
        { 
            dev_id: 1, 
            name: "Iqbal Hossen", 
            skills: "Full Stack Developer", 
            email: "iqbal@example.com", 
            phone: "+880 1234 567890", 
            total_tasks: 12, 
            total_budget: 15000, 
            total_paid: 12000, 
            total_due: 3000, 
            status: "Active",
            image: null 
        },
        { 
            dev_id: 2, 
            name: "Toukir Ahmed", 
            skills: "UI/UX Designer", 
            email: "toukir@example.com", 
            phone: "+880 1700 000000", 
            total_tasks: 8, 
            total_budget: 8000, 
            total_paid: 8000, 
            total_due: 0, 
            status: "Active",
            image: null 
        }
    ]);

    useEffect(() => {
        setHeaderData({
            title: 'Developers',
            subtitle: 'Manage your internal team',
            icon: 'fa-solid fa-laptop-code'
        });
    }, [setHeaderData]);

    const filteredDevs = developers.filter(dev => 
        dev.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        dev.skills.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // এনিমেশন ভেরিয়েন্ট
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 400, damping: 30 } }
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 500, damping: 30 } },
        exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } }
    };

    return (
        <div className="w-full pb-10">
            
            {/* ১. সার্চ এবং অ্যাড ডেভেলপার বাটন */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-8 gap-4 px-1">
                <div className="relative w-full sm:w-80 group">
                    <input 
                        type="text" 
                        placeholder="Search by name or skill..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl sm:rounded-2xl py-3 pl-11 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0F8FF0]/20 transition-all shadow-sm"
                    />
                    <span className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#0F8FF0]">
                        <i className="fa-solid fa-magnifying-glass text-sm"></i>
                    </span>
                </div>
                <Link to="/developers/add" className="flex justify-center items-center gap-2 px-6 py-3 bg-[#111827] text-white rounded-xl sm:rounded-2xl text-[10px] sm:text-xs uppercase tracking-widest font-black shadow-lg hover:bg-[#0F8FF0] active:scale-95 transition-all">
                    <i className="fa-solid fa-user-plus"></i> Add Developer
                </Link>
            </div>

            {/* ২. ডেভেলপার কার্ড গ্রিড */}
            <motion.div 
                variants={containerVariants} initial="hidden" animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6"
            >
                <AnimatePresence mode='popLayout'>
                    {filteredDevs.map((dev) => (
                        <motion.div 
                            key={dev.dev_id} variants={itemVariants} layout
                            className="dev-card bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-all group"
                        >
                            <div className="flex-1">
                                {/* প্রোফাইল সেকশন */}
                                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-50">
                                    <div className="relative shrink-0">
                                        <img 
                                            src={dev.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(dev.name)}&background=random&color=fff`} 
                                            className="w-14 h-14 rounded-2xl shadow-md object-cover border-2 border-white group-hover:scale-105 transition-transform" 
                                            alt={dev.name} 
                                        />
                                        <span className={`absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full`} title={dev.status}></span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-lg font-black font-merriweather text-gray-900 leading-tight truncate">{dev.name}</h3>
                                        <p className="text-[10px] text-[#0F8FF0] font-black mt-1 uppercase tracking-widest bg-blue-50 inline-block px-2 py-0.5 rounded-md truncate max-w-full">
                                            {dev.skills}
                                        </p>
                                    </div>
                                </div>

                                {/* কন্টাক্ট ডিটেইলস */}
                                <div className="space-y-2.5 mb-6">
                                    <p className="text-[11px] text-gray-600 font-bold flex items-center gap-2 truncate">
                                        <span className="w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 shrink-0"><i className="fa-solid fa-envelope"></i></span>
                                        <span className="truncate">{dev.email}</span>
                                    </p>
                                    <p className="text-[11px] text-gray-600 font-bold flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 shrink-0"><i className="fa-solid fa-phone"></i></span>
                                        <span>{dev.phone}</span>
                                    </p>
                                </div>

                                {/* স্ট্যাটস গ্রিড (Earned, Paid, Pending) */}
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                    <div className="bg-gray-50/80 border border-gray-100 p-3 rounded-2xl flex flex-col justify-center">
                                        <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Tasks</p>
                                        <p className="text-sm font-black text-gray-900">{dev.total_tasks}</p>
                                    </div>
                                    <div className="bg-blue-50/50 border border-blue-50 p-3 rounded-2xl flex flex-col justify-center">
                                        <p className="text-[9px] text-blue-500 font-black uppercase tracking-widest mb-0.5">Earned</p>
                                        <p className="text-sm font-black text-blue-700">£{dev.total_budget.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-emerald-50/50 border border-emerald-50 p-3 rounded-2xl flex flex-col justify-center">
                                        <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest mb-0.5">Paid</p>
                                        <p className="text-sm font-black text-emerald-700">£{dev.total_paid.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-rose-50/50 border border-rose-50 p-3 rounded-2xl flex flex-col justify-center">
                                        <p className="text-[9px] text-rose-500 font-black uppercase tracking-widest mb-0.5">Pending</p>
                                        <p className="text-sm font-black text-rose-700">£{dev.total_due.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* অ্যাকশন বাটন */}
                            <div className="flex items-center gap-2 mt-6 pt-6 border-t border-gray-50">
                                <Link to={`/developers/view/${dev.dev_id}`} className="flex-1 h-11 rounded-xl bg-[#111827] text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#0F8FF0] transition-all shadow-md">
                                    <i className="fa-solid fa-eye"></i> View Profile
                                </Link>
                                <Link to={`/developers/edit/${dev.dev_id}`} className="w-11 h-11 shrink-0 rounded-xl bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-all">
                                    <i className="fa-solid fa-pencil text-sm"></i>
                                </Link>
                                <button 
                                    onClick={() => { setSelectedDevId(dev.dev_id); setIsDeleteModalOpen(true); }}
                                    className="w-11 h-11 shrink-0 rounded-xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-all"
                                >
                                    <i className="fa-solid fa-trash-can text-sm"></i>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* ৩. এম্পটি স্টেট (যদি কোনো ডাটা না থাকে) */}
            {filteredDevs.length === 0 && (
                <div className="col-span-full text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <i className="fa-solid fa-users-slash text-4xl text-gray-200"></i>
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-2">No Developers Found</h3>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Try adjusting your search criteria</p>
                </div>
            )}

            {/* ৪. প্রিমিয়াম ডিলিট কনফার্মেশন মোডাল */}
            <AnimatePresence>
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <motion.div variants={modalVariants} initial="hidden" animate="visible" exit="exit" className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full relative z-10 text-center shadow-2xl">
                            <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border-8 border-white shadow-inner"><i className="fa-solid fa-trash-can text-4xl"></i></div>
                            <h3 className="text-3xl font-black text-gray-900 mb-2 font-merriweather leading-tight">Remove?</h3>
                            <p className="text-gray-500 text-sm font-bold mb-10 leading-relaxed">Are you sure you want to remove this developer from your team? This action is permanent.</p>
                            <div className="flex gap-4">
                                <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-4 bg-gray-100 text-gray-500 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-gray-200 transition-all">CANCEL</button>
                                <button className="flex-1 py-4 bg-red-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-red-200 active:scale-95 transition-all">YES, DELETE</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default DeveloperList;