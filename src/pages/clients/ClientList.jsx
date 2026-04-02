import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useHeader } from "../../components/layout/HeaderContext";
import api from "../../api/axios";
import Swal from "sweetalert2";
import Loader from "../Loader/Loader";

const ClientList = () => {
  const { setHeaderData } = useHeader();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // ডিলিট মোডাল স্টেট
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);

  useEffect(() => {
    setHeaderData({
      title: "Our Clients",
      subtitle: "Manage your client profiles",
      icon: "fa-solid fa-users",
    });
    fetchClients();
  }, [setHeaderData]);

  const fetchClients = async () => {
    try {
      const res = await api.get("/admin/clients");
      setClients(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await api.delete(`/admin/clients/${selectedClientId}`);
      if (res.data.success) {
        setIsDeleteModalOpen(false);
        setClients(clients.filter((c) => c._id !== selectedClientId));
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Client has been removed.",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      Swal.fire("Error", "Could not delete client", "error");
    }
  };

  // সার্চ ফিল্টারিং
  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.company_name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) return <Loader />;

  return (
    <main className="flex-1 overflow-y-auto pb-10 px-2">
      {/* ১. সার্চ বার এবং অ্যাড ক্লায়েন্ট বাটন */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-6 sm:mb-8 gap-3 px-1">
        <div className="relative w-full sm:w-72 group">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or company..."
            className="w-full bg-white border border-gray-200 rounded-xl sm:rounded-2xl py-3 sm:py-2.5 pl-10 sm:pl-11 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-black/5 transition-all shadow-sm"
          />
          <span className="absolute left-3.5 sm:left-4 top-3.5 sm:top-3 text-gray-400 group-focus-within:text-black transition-colors">
            <i className="fa-solid fa-magnifying-glass text-sm"></i>
          </span>
        </div>
        <Link
          to="/clients/add"
          className="w-full sm:w-auto flex justify-center items-center gap-2 px-6 py-3 sm:py-2.5 bg-black text-white rounded-xl sm:rounded-2xl text-sm font-black tracking-widest transition-colors duration-200 hover:bg-[#0F8FF0] active:scale-95 shadow-lg"
        >
          <i className="fa-solid fa-user-plus text-xs"></i>
          <span>Add Client</span>
        </Link>
      </div>

      {/* ২. ক্লায়েন্ট কার্ড গ্রিড */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4 sm:gap-6">
        {filteredClients.map((client) => (
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            key={client._id}
            className="bg-white p-5 sm:p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-xl transition-all duration-500 group"
          >
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-5 pb-5 border-b border-gray-50">
                <div className="flex items-center gap-3 w-full sm:w-auto overflow-hidden">
                  <img
                    src={
                      client.image ||
                      `https://ui-avatars.com/api/?name=${client.name}&background=random`
                    }
                    className="w-14 h-14 rounded-2xl shadow-sm object-cover shrink-0 border-2 border-white group-hover:rotate-3 transition-transform"
                    alt="client"
                  />
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-bold font-merriweather text-gray-900 leading-tight truncate uppercase">
                      {client.name}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-[#0F8FF0] font-black mt-1 truncate uppercase tracking-widest">
                      <i className="fa-solid fa-building mr-1"></i>
                      {client.company_name || "Personal Client"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 w-full sm:w-auto sm:text-right shrink-0">
                  <p className="text-[11px] text-gray-500 font-bold truncate">
                    {client.email}{" "}
                    <i className="fa-solid fa-envelope ml-1 opacity-40"></i>
                  </p>
                  <p className="text-[11px] text-gray-500 font-bold">
                    {client.phone}{" "}
                    <i className="fa-solid fa-phone ml-1 opacity-40"></i>
                  </p>
                </div>
              </div>

              {/* Amounts - আপাতত স্ট্যাটিক থাকবে যতক্ষণ না প্রজেক্ট লজিক করছি */}
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-50 p-2.5 rounded-2xl text-center">
                  <p className="text-[8px] text-gray-400 font-black uppercase tracking-tighter mb-0.5">
                    Budget
                  </p>
                  <p className="text-xs font-black text-gray-900">£0</p>
                </div>
                <div className="flex-1 bg-green-50 p-2.5 rounded-2xl text-center">
                  <p className="text-[8px] text-green-400 font-black uppercase tracking-tighter mb-0.5">
                    Paid
                  </p>
                  <p className="text-xs font-black text-green-700">£0</p>
                </div>
                <div className="flex-1 bg-red-50 p-2.5 rounded-2xl text-center">
                  <p className="text-[8px] text-red-400 font-black uppercase tracking-tighter mb-0.5">
                    Due
                  </p>
                  <p className="text-xs font-black text-red-700">£0</p>
                </div>
              </div>
            </div>

            {/* Actions Section */}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-5 pt-5 border-t border-gray-50 gap-3">
              <Link
                to={`/projects?client_id=${client._id}`}
                className="w-full sm:w-auto justify-center px-5 h-10 rounded-xl bg-black text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-[#0F8FF0] transition-colors shadow-lg"
              >
                <i className="fa-solid fa-layer-group"></i> Manage Projects
              </Link>
              <div className="flex items-center gap-2">
                <Link
                  to={`/clients/view/${client._id}`}
                  className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"
                >
                  <i className="fas fa-eye text-sm"></i>
                </Link>
                <Link
                  to={`/clients/edit/${client._id}`}
                  className="h-9 w-9 rounded-xl bg-gray-50 text-gray-600 flex items-center justify-center hover:bg-black hover:text-white transition-all"
                >
                  <i className="fas fa-pencil-alt text-sm"></i>
                </Link>
                <button
                  onClick={() => {
                    setSelectedClientId(client._id);
                    setIsDeleteModalOpen(true);
                  }}
                  className="h-9 w-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"
                >
                  <i className="fas fa-trash-alt text-sm"></i>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Delete Modal (আপনার ডিজাইন অনুযায়ী) */}
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
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full relative z-10 text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-lg">
                <i className="fa-solid fa-trash-can text-3xl"></i>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2 font-merriweather">
                Confirm Delete?
              </h3>
              <p className="text-gray-500 text-xs font-bold mb-8 leading-relaxed">
                This will also delete the client's login account and cannot be
                undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-4 bg-gray-100 text-gray-400 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-4 bg-red-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-red-700 shadow-lg transition-all active:scale-95"
                >
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
