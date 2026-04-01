import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useHeader } from "../../components/layout/HeaderContext";

const ClientList = () => {
  const { setHeaderData } = useHeader();

  // ডিলিট মোডাল স্টেট
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);

  useEffect(() => {
    setHeaderData({
      title: "Our Clients",
      subtitle: "Manage your client profiles",
      icon: "fa-solid fa-users",
    });
  }, [setHeaderData]);

  const [clients] = useState([
    {
      id: 1,
      name: "Iqbal Hossen",
      company_name: "SETS TECH",
      email: "iqbal@setstech.com",
      phone: "+880170000000",
      image: "",
      total_budget: 45000,
      total_paid: 32000,
      total_due: 13000,
    },
    {
      id: 2,
      name: "Toukir Ahmed",
      company_name: "S TECH",
      email: "toukirofficial1996@gmail.com",
      phone: "07496261310",
      image: "",
      total_budget: 0,
      total_paid: 0,
      total_due: 0,
    },
  ]);

  // এনিমেশন কনফিগ (তোর চাওয়া অনুযায়ী ফাস্ট এবং স্ন্যাপি)
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

  return (
    <main className="flex-1 overflow-y-auto pb-10">
      {/* ১. সার্চ বার এবং অ্যাড ক্লায়েন্ট বাটন */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-6 sm:mb-8 gap-3 px-1">
        <div className="relative w-full sm:w-72 group">
          <input
            type="text"
            placeholder="Search by name or company..."
            className="w-full bg-white border border-gray-200 rounded-xl sm:rounded-2xl py-3 sm:py-2.5 pl-10 sm:pl-11 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-black/5 transition-all shadow-sm"
          />
          <span className="absolute left-3.5 sm:left-4 top-3.5 sm:top-3 text-gray-400 group-focus-within:text-black transition-colors">
            <i className="fa-solid fa-magnifying-glass text-sm"></i>
          </span>
        </div>
        <Link
          to="/clients/add"
          className="w-full sm:w-auto flex justify-center items-center gap-2 px-6 py-3 sm:py-2.5 bg-black text-white rounded-xl sm:rounded-2xl text-sm font-black tracking-widest transition-colors duration-200 hover:bg-[#0F8FF0] active:scale-95"
        >
          <i className="fa-solid fa-user-plus text-xs"></i>
          <span>Add Client</span>
        </Link>
      </div>

      {/* ২. ক্লায়েন্ট কার্ড গ্রিড */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
        {clients.map((client) => (
          <div
            key={client.id}
            className="client-card bg-white p-5 sm:p-6 rounded-3xl sm:rounded-[2rem] shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-all duration-300"
          >
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-5 pb-5 border-b border-gray-50">
                <div className="flex items-center gap-3 w-full sm:w-auto overflow-hidden">
                  <img
                    src={
                      client.image ||
                      `https://ui-avatars.com/api/?name=${client.name}&background=random&size=128`
                    }
                    className="w-12 h-12 rounded-full shadow-sm object-cover shrink-0 border border-gray-100"
                    alt="client"
                  />
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-bold font-merriweather text-gray-900 leading-tight truncate">
                      {client.name}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-gray-500 font-extrabold mt-1 truncate uppercase tracking-widest">
                      <i className="fa-solid fa-building text-gray-400 mr-1"></i>
                      {client.company_name || "Individual"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-full sm:w-auto sm:text-right shrink-0 bg-gray-50 sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none border border-gray-100 sm:border-0">
                  <p className="text-[11px] text-gray-600 font-bold flex items-center sm:justify-end gap-2 truncate">
                    <i className="fa-solid fa-envelope text-gray-400 sm:order-last"></i>
                    <span className="truncate sm:max-w-[140px]">
                      {client.email}
                    </span>
                  </p>
                  <p className="text-[11px] text-gray-600 font-bold flex items-center sm:justify-end gap-2">
                    <i className="fa-solid fa-phone text-gray-400 sm:order-last"></i>
                    <span>{client.phone}</span>
                  </p>
                </div>
              </div>

              {/* Amounts Section */}
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-indigo-50/50 border border-indigo-50 p-2 sm:p-2.5 rounded-xl text-center">
                  <p className="text-[8px] sm:text-[9px] text-indigo-500 font-black uppercase tracking-widest mb-0.5">
                    Amounts
                  </p>
                  <p className="text-xs sm:text-[13px] font-black text-indigo-700">
                    £{client.total_budget.toLocaleString()}
                  </p>
                </div>
                <div className="flex-1 bg-green-50/50 border border-green-50 p-2 sm:p-2.5 rounded-xl text-center">
                  <p className="text-[8px] sm:text-[9px] text-green-500 font-black uppercase tracking-widest mb-0.5">
                    Paid
                  </p>
                  <p className="text-xs sm:text-[13px] font-black text-green-700">
                    £{client.total_paid.toLocaleString()}
                  </p>
                </div>
                <div
                  className={`flex-1 ${client.total_due > 0 ? "bg-red-50/50 border-red-50" : "bg-gray-50/50 border-gray-50"} border p-2 sm:p-2.5 rounded-xl text-center`}
                >
                  <p
                    className={`text-[8px] sm:text-[9px] ${client.total_due > 0 ? "text-red-500" : "text-gray-400"} font-black uppercase tracking-widest mb-0.5`}
                  >
                    Due
                  </p>
                  <p
                    className={`text-xs sm:text-[13px] font-black ${client.total_due > 0 ? "text-red-700" : "text-gray-700"}`}
                  >
                    £{client.total_due.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions Section */}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-5 pt-5 border-t border-gray-100 gap-3">
              <button className="w-full sm:w-auto justify-center px-4 sm:px-5 h-10 sm:h-9 rounded-xl sm:rounded-full bg-black text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-md hover:bg-gray-800 transition-colors">
                <i className="fa-solid fa-list-check"></i> Manage Projects
              </button>
              <div className="flex items-center justify-center gap-2 w-full sm:w-auto border-t sm:border-0 pt-3 sm:pt-0 border-gray-50">
                <Link
                  to={`/clients/view/${client.id}`}
                  className="flex-1 sm:flex-none h-8 w-8 rounded-xl sm:rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-[#0F8FF0] hover:text-white transition-all shadow-sm"
                >
                  <i className="fas fa-eye text-sm"></i>
                </Link>
                <Link
                  to={`/clients/edit/${client.id}`}
                  className="flex-1 sm:flex-none h-8 w-8 rounded-xl sm:rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all shadow-sm"
                >
                  <i className="fas fa-pencil-alt text-sm"></i>
                </Link>
                {/* Delete Button */}
                <button
                  onClick={() => {
                    setSelectedClientId(client.id);
                    setIsDeleteModalOpen(true);
                  }}
                  className="flex-1 sm:flex-none h-8 w-8 rounded-xl sm:rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm"
                >
                  <i className="fas fa-trash-alt text-sm"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ডিলিট কনফার্মেশন এলার্ট মোডাল */}
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
              className="bg-white rounded-[2.5rem] p-8 sm:p-10 max-w-sm w-full relative z-10 text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-lg">
                <i className="fa-solid fa-trash-can text-3xl"></i>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2 font-merriweather">
                Are you sure?
              </h3>
              <p className="text-gray-500 text-sm font-bold mb-8 leading-relaxed">
                You are about to delete this client record. This action cannot
                be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-4 bg-gray-100 text-gray-500 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button className="flex-1 py-4 bg-red-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-red-700 shadow-lg shadow-red-200 active:scale-95 transition-all">
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default ClientList;
