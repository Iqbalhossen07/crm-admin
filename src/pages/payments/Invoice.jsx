import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Invoice = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // ডামি ডাটা (তোর PHP ভেরিয়েবল অনুযায়ী সাজানো)
    const [invoice] = useState({
        payment_id: id || 1,
        payment_date: "2026-03-31",
        status: "Accepted",
        client_name: "Iqbal Hossen",
        company_name: "SETS TECH",
        client_email: "iqbal@setstech.com",
        client_phone: "+880170000000",
        task_name: "CRM Dashboard UI Redesign",
        project_name: "Sets Tech Admin Panel",
        amount: 10000.00
    });

    const handlePrint = () => {
        window.print();
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4 sm:px-6"
        >
            {/* ১. অ্যাকশন বাটন (প্রিন্ট এবং ব্যাক) */}
            <div className="w-full max-w-4xl flex justify-between items-center mb-8 no-print">
                <button 
                    onClick={() => navigate(-1)} 
                    className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold text-xs uppercase tracking-widest rounded-xl shadow-sm hover:bg-gray-50 transition-all flex items-center gap-2 active:scale-95"
                >
                    <i className="fa-solid fa-arrow-left"></i> Go Back
                </button>
                <button 
                    onClick={handlePrint}
                    className="px-5 py-2.5 bg-[#0F8FF0] text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md hover:bg-blue-600 transition-all flex items-center gap-2 active:scale-95"
                >
                    <i className="fa-solid fa-print"></i> Print / Save PDF
                </button>
            </div>

            {/* ২. আসল ইনভয়েস কার্ড */}
            <div className="w-full max-w-4xl bg-white p-10 md:p-16 rounded-[2rem] shadow-2xl print-shadow-none print:p-0 border border-gray-100 relative overflow-hidden">
                
                {/* টপ বর্ডার লাইন */}
                <div className="absolute top-0 left-0 w-full h-2 bg-[#0F8FF0]"></div>

                {/* ৩. ইনভয়েস হেডার */}
                <div className="flex flex-col md:flex-row justify-between items-start border-b border-gray-100 pb-10 mb-10 gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center shadow-md">
                                <i className="fa-solid fa-code text-white text-xl"></i>
                            </div>
                            <span className="text-3xl font-black font-merriweather tracking-tight text-gray-900">Sets Tech</span>
                        </div>
                        <p className="text-sm text-gray-500 font-medium">123 Tech Avenue, Innovation District</p>
                        <p className="text-sm text-gray-500 font-medium">Barishal, Bangladesh</p>
                        <p className="text-sm text-gray-500 font-medium mt-1">hello@setstech.com</p>
                    </div>

                    <div className="md:text-right">
                        <h1 className="text-4xl md:text-5xl font-black font-merriweather text-gray-900 uppercase tracking-widest mb-4">Invoice</h1>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">
                            Invoice No: <span className="text-gray-900">#INV-{String(invoice.payment_id).padStart(5, '0')}</span>
                        </p>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">
                            Date: <span className="text-gray-900">{invoice.payment_date}</span>
                        </p>
                        <div className="mt-3">
                            <span className={`inline-block px-3 py-1 font-black text-[10px] uppercase tracking-widest rounded-lg border ${
                                invoice.status.toLowerCase() === 'accepted' 
                                ? 'bg-green-100 text-green-700 border-green-200' 
                                : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                            }`}>
                                Payment {invoice.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ৪. বিলিং ডিটেইলস */}
                <div className="mb-10">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">Billed To</p>
                    <h3 className="text-xl font-black text-gray-900">{invoice.client_name}</h3>
                    {invoice.company_name && (
                        <p className="text-sm text-gray-600 font-bold mt-1">
                            <i className="fa-solid fa-building text-gray-400 mr-1"></i> {invoice.company_name}
                        </p>
                    )}
                    <p className="text-sm text-gray-500 font-medium mt-1">{invoice.client_email}</p>
                    <p className="text-sm text-gray-500 font-medium">{invoice.client_phone}</p>
                </div>

                {/* ৫. টেবিল */}
                <div className="bg-gray-50/50 rounded-2xl border border-gray-100 overflow-hidden mb-10">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-gray-100/50 border-b border-gray-100">
                            <tr>
                                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Description</th>
                                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <tr>
                                <td className="py-5 px-6 whitespace-normal">
                                    <p className="text-base font-bold text-gray-900">{invoice.task_name}</p>
                                    <p className="text-xs text-gray-500 font-bold mt-1 uppercase tracking-widest">Project: {invoice.project_name}</p>
                                </td>
                                <td className="py-5 px-6 font-black text-gray-900 text-right text-lg">
                                    £ {invoice.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* ৬. সামারি */}
                <div className="flex flex-col items-end mb-16">
                    <div className="w-full md:w-1/2 lg:w-1/3">
                        <div className="flex justify-between py-3 border-b border-gray-100">
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Subtotal</span>
                            <span className="text-sm font-black text-gray-900">£ {invoice.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-gray-100">
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Tax (0%)</span>
                            <span className="text-sm font-black text-gray-900">£ 0.00</span>
                        </div>
                        <div className="flex justify-between py-4 mt-2 bg-blue-50 rounded-xl px-4 border border-blue-100">
                            <span className="text-base font-black text-[#0F8FF0] uppercase tracking-widest">Total Paid</span>
                            <span className="text-xl font-black text-[#0F8FF0]">£ {invoice.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                        </div>
                    </div>
                </div>

                {/* ৭. ফুটার */}
                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                    <div>
                        <p className="text-sm font-bold text-gray-900">Thank you for your business!</p>
                        <p className="text-xs text-gray-500 font-medium mt-1">If you have any questions concerning this invoice, please contact us.</p>
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Created by <span className="text-[#0F8FF0]">Setstech</span>
                    </div>
                </div>
            </div>

            {/* প্রিন্ট স্টাইল */}
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; padding: 0 !important; }
                    .shadow-2xl { shadow: none !important; border: none !important; }
                    * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
                }
            `}} />
        </motion.div>
    );
};

export default Invoice;