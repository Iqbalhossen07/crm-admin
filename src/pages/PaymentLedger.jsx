import React, { useState, useEffect } from 'react';
import { useHeader } from '../components/layout/HeaderContext';
import { motion, AnimatePresence } from 'framer-motion';

const PaymentLedger = () => {
    const { setHeaderData } = useHeader();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [activeStatusId, setActiveStatusId] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState(null);

    const [payments] = useState([
        { id: 1, client_name: "Iqbal Hossen", project_name: "WEB DESIGN", task_name: "Api ingration", amount: 500.00, payment_date: "26 Feb, 2026", status: "Rejected", client_img: "https://ui-avatars.com/api/?name=Iqbal+Hossen&background=0D8ABC&color=fff" },
        { id: 2, client_name: "Toukir Ahmed", project_name: "S TECH", task_name: "Dashboard UI", amount: 1200.00, payment_date: "28 Feb, 2026", status: "Accepted", client_img: "https://ui-avatars.com/api/?name=Toukir+Ahmed&background=random" }
    ]);

    useEffect(() => {
        setHeaderData({
            title: 'Payment Ledger',
            subtitle: 'Track, filter, and manage all transactions',
            icon: 'fa-solid fa-file-invoice-dollar'
        });
    }, [setHeaderData]);

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 10 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 500, damping: 30 } },
        exit: { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.15 } }
    };

    const dropdownVariants = {
        hidden: { opacity: 0, y: -10, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.15, ease: "easeOut" } },
        exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.1 } }
    };

    return (
        <div className="w-full pb-10">
            
            {/* ১. ফিল্টার ও স্ট্যাটাস কার্ড */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-8">
                <div className="lg:col-span-8 bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 items-center">
                    <div className="flex-1 w-full">
                        <select className="w-full bg-gray-50 border border-gray-200 text-xs font-bold rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#0F8FF0]/20 appearance-none cursor-pointer">
                            <option value="">All Clients...</option>
                            <option value="1">Iqbal Hossen</option>
                        </select>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <input type="date" className="bg-gray-50 border border-gray-200 text-xs font-bold rounded-xl px-4 py-3 outline-none" />
                        <button className="px-6 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#0F8FF0] transition-all">Apply</button>
                    </div>
                </div>
                <div className="lg:col-span-4 grid grid-cols-2 gap-4">
                    <div className="bg-emerald-50 p-5 rounded-[24px] border border-emerald-100 text-center shadow-sm flex flex-col justify-center">
                        <p className="text-[9px] font-black text-emerald-600 uppercase mb-1">Approved</p>
                        <h3 className="text-xl font-black text-emerald-700">£5,400.00</h3>
                    </div>
                    <div className="bg-orange-50 p-5 rounded-[24px] border border-orange-100 text-center shadow-sm flex flex-col justify-center">
                        <p className="text-[9px] font-black text-orange-600 uppercase mb-1">Pending</p>
                        <h3 className="text-xl font-black text-orange-700">£1,200.00</h3>
                    </div>
                </div>
            </div>

            {/* ২. পেমেন্ট টেবিল সেকশন */}
            {/* এই মেইন কন্টেইনারে overflow-visible ইম্পর্ট্যান্ট */}
            <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm relative" style={{ overflow: 'visible' }}>
                <div className="overflow-x-auto custom-scrollbar" style={{ overflow: 'visible' }}>
                    <table className="w-full text-left whitespace-nowrap border-collapse" style={{ overflow: 'visible' }}>
                        <thead className="bg-gray-50/80 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 sticky top-0 z-10">
                            <tr>
                                <th className="px-8 py-5">Client & Project</th>
                                <th className="px-6 py-5">Task Details</th>
                                <th className="px-6 py-5 text-right">Amount</th>
                                <th className="px-6 py-5 text-center">Status</th>
                                <th className="px-8 py-5 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50" style={{ overflow: 'visible' }}>
                            {payments.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50/50 transition-colors" style={{ overflow: 'visible' }}>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <img src={row.client_img} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="" />
                                            <div>
                                                <p className="font-black text-gray-900 text-sm">{row.client_name}</p>
                                                <p className="text-[10px] font-bold text-indigo-500 uppercase">{row.project_name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 font-bold text-gray-700 text-sm">
                                        {row.task_name}
                                        <p className="text-[10px] text-gray-400 mt-0.5 font-bold"><i className="fa-regular fa-calendar mr-1"></i>{row.payment_date}</p>
                                    </td>
                                    <td className="px-6 py-5 text-right font-black text-gray-900">£{row.amount.toFixed(2)}</td>
                                    <td className="px-6 py-5 text-center">
                                        <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${row.status === 'Accepted' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-center" style={{ overflow: 'visible' }}>
                                        <div className="flex items-center justify-center gap-1.5 relative" style={{ overflow: 'visible' }}>
                                            <button className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all"><i className="fa-solid fa-image text-xs"></i></button>
                                            <button className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"><i className="fa-solid fa-file-invoice text-xs"></i></button>
                                            <button onClick={() => { setSelectedPayment(row); setIsEditModalOpen(true); }} className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all"><i className="fa-solid fa-pencil text-xs"></i></button>

                                            {/* 🔄 STATUS DROPDOWN (ফিক্সড পজিশন) */}
                                            <div className="relative" style={{ overflow: 'visible' }}>
                                                <button 
                                                    onClick={() => setActiveStatusId(activeStatusId === row.id ? null : row.id)} 
                                                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${activeStatusId === row.id ? 'bg-orange-500 text-white' : 'bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white'}`}
                                                >
                                                    <i className="fa-solid fa-rotate text-xs"></i>
                                                </button>
                                                
                                                <AnimatePresence>
                                                    {activeStatusId === row.id && (
                                                        <motion.div 
                                                            variants={dropdownVariants} 
                                                            initial="hidden" animate="visible" exit="exit" 
                                                            // top-full দিয়ে নিচে নামিয়ে দিয়েছি এবং z-index ১০০ করেছি
                                                            className="absolute right-0 top-full mt-2 w-36 bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-gray-100 p-2 z-[100] flex flex-col gap-1"
                                                        >
                                                            <button className="w-full text-left px-4 py-2 text-[10px] font-black uppercase text-green-600 hover:bg-green-50 rounded-xl transition-colors">Accept</button>
                                                            <button className="w-full text-left px-4 py-2 text-[10px] font-black uppercase text-yellow-600 hover:bg-yellow-50 rounded-xl transition-colors">Pending</button>
                                                            <button className="w-full text-left px-4 py-2 text-[10px] font-black uppercase text-red-600 hover:bg-red-50 rounded-xl transition-colors">Reject</button>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                            <button onClick={() => setIsDeleteModalOpen(true)} className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"><i className="fa-solid fa-trash text-xs"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ৩. এডিট মোডাল */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <motion.div variants={modalVariants} initial="hidden" animate="visible" exit="exit" className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden relative z-10">
                            <div className="bg-gray-900 p-6 text-white flex justify-between items-center">
                                <h3 className="font-black uppercase tracking-widest text-xs flex items-center gap-2"><i className="fa-solid fa-pen-to-square text-emerald-400"></i> Edit Payment Record</h3>
                                <button onClick={() => setIsEditModalOpen(false)} className="text-white/50 hover:text-white"><i className="fa-solid fa-xmark text-xl"></i></button>
                            </div>
                            <div className="p-8 space-y-5 text-left">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-1">Payment Amount (£)</label>
                                    <div className="relative"><span className="absolute left-4 top-3.5 text-gray-400 font-black">£</span><input type="number" defaultValue={selectedPayment?.amount} className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 pl-10 pr-4 text-sm font-bold focus:ring-2 focus:ring-[#0F8FF0]/20 outline-none" /></div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-1">Payment Date</label>
                                    <input type="date" className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#0F8FF0]/20 outline-none" />
                                </div>
                                <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs shadow-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 mt-4"><i className="fa-solid fa-save"></i> Save Changes</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ৪. ডিলিট কনফার্মেশন */}
            <AnimatePresence>
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <motion.div variants={modalVariants} initial="hidden" animate="visible" exit="exit" className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full relative z-10 text-center shadow-2xl">
                            <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border-8 border-white shadow-inner"><i className="fa-solid fa-trash-can text-4xl"></i></div>
                            <h3 className="text-3xl font-black text-gray-900 mb-2 font-merriweather">Confirm?</h3>
                            <p className="text-gray-500 text-sm font-bold mb-10 leading-relaxed text-center">Are you absolutely sure? This is permanent.</p>
                            <div className="flex gap-4">
                                <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-4 bg-gray-100 text-gray-500 font-black text-[10px] uppercase tracking-widest rounded-2xl">CANCEL</button>
                                <button className="flex-1 py-4 bg-red-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-red-200">YES, DELETE</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default PaymentLedger;