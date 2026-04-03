import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useHeader } from "../components/layout/HeaderContext";
import Loader from "./Loader/Loader";
import api from "../api/axios";

const PaymentLedger = () => {
  const { setHeaderData } = useHeader();

  // API States
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [clients, setClients] = useState([]);
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0 });

  // Filter States
  const [filters, setFilters] = useState({
    client_id: "",
    start_date: "",
    end_date: "",
  });

  // Modal & Interaction States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeStatusId, setActiveStatusId] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    setHeaderData({
      title: "Payment Ledger",
      subtitle: "Track, filter, and manage all transactions",
      icon: "fa-solid fa-file-invoice-dollar",
    });
    fetchClients();
    fetchPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setHeaderData]);

  // ক্লায়েন্ট ড্রপডাউনের জন্য ডাটা আনা
  const fetchClients = async () => {
    try {
      const res = await api.get("/admin/clients");
      setClients(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch clients", err);
    }
  };

  // ফিল্টার অনুযায়ী পেমেন্ট এবং স্ট্যাটস আনা
  const fetchPayments = async () => {
    setLoading(true);
    try {
      const { client_id, start_date, end_date } = filters;
      let url = `/admin/payments?`;

      if (client_id) url += `client_id=${client_id}&`;
      if (start_date && end_date)
        url += `start_date=${start_date}&end_date=${end_date}`;

      const res = await api.get(url);
      setPayments(res.data.data || []);
      setStats(res.data.stats || { total: 0, approved: 0, pending: 0 });
    } catch (err) {
      console.error("Failed to fetch payments", err);
      Swal.fire("Error", "Could not load payments data.", "error");
    } finally {
      setLoading(false);
    }
  };

  // ডেট ফরম্যাটার
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // স্ট্যাটাস কালার লজিক
  const getStatusColor = (status) => {
    const s = status?.toLowerCase() || "";
    if (s === "completed" || s === "accepted")
      return "bg-green-50 text-green-700 border-green-100";
    if (s === "rejected") return "bg-red-50 text-red-700 border-red-100";
    return "bg-orange-50 text-orange-700 border-orange-100"; // Pending
  };

  // এনিমেশন ভেরিয়েন্টস
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

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.15, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.1 } },
  };

  return (
    <div className="w-full pb-10">
      {/* ১. ফিল্টার ও স্ট্যাটাস কার্ড */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-8">
        <div className="lg:col-span-8 bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1 w-full">
            <select
              value={filters.client_id}
              onChange={(e) =>
                setFilters({ ...filters, client_id: e.target.value })
              }
              className="w-full bg-gray-50 border border-gray-200 text-xs font-bold rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#0F8FF0]/20 appearance-none cursor-pointer"
            >
              <option value="">All Clients...</option>
              {clients.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="date"
              value={filters.start_date}
              onChange={(e) =>
                setFilters({ ...filters, start_date: e.target.value })
              }
              className="bg-gray-50 border border-gray-200 text-xs font-bold rounded-xl px-4 py-3 outline-none"
            />
            <input
              type="date"
              value={filters.end_date}
              onChange={(e) =>
                setFilters({ ...filters, end_date: e.target.value })
              }
              className="bg-gray-50 border border-gray-200 text-xs font-bold rounded-xl px-4 py-3 outline-none"
            />
            <button
              onClick={fetchPayments}
              className="px-6 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#0F8FF0] active:scale-95 transition-all"
            >
              Apply
            </button>
          </div>
        </div>

        <div className="lg:col-span-4 grid grid-cols-3 gap-4">
          <div className="bg-emerald-50 p-5 rounded-[24px] border border-emerald-100 text-center shadow-sm flex flex-col justify-center">
            <p className="text-[9px] font-black text-emerald-600 uppercase mb-1">
              Total
            </p>
            <h3 className="text-xl font-black text-info-700">
              £
              {Number(stats.total).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </h3>
          </div>
          <div className="bg-emerald-50 p-5 rounded-[24px] border border-emerald-100 text-center shadow-sm flex flex-col justify-center">
            <p className="text-[9px] font-black text-emerald-600 uppercase mb-1">
              Approved
            </p>
            <h3 className="text-xl font-black text-emerald-700">
              £
              {Number(stats.approved).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </h3>
          </div>
          <div className="bg-orange-50 p-5 rounded-[24px] border border-orange-100 text-center shadow-sm flex flex-col justify-center">
            <p className="text-[9px] font-black text-orange-600 uppercase mb-1">
              Pending
            </p>
            <h3 className="text-xl font-black text-orange-700">
              £
              {Number(stats.pending).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </h3>
          </div>
        </div>
      </div>

      {/* ২. পেমেন্ট টেবিল সেকশন */}
      {loading ? (
        <div className="py-20 text-center">
          <Loader />
        </div>
      ) : payments.length === 0 ? (
        /* 🔥 Empty State (কোনো ডাটা না থাকলে) */
        <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm p-20 text-center flex flex-col items-center justify-center">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 border-2 border-dashed border-gray-200">
            <i className="fa-solid fa-receipt text-4xl text-gray-300"></i>
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2 font-merriweather">
            No Transactions Found
          </h3>
          <p className="text-sm text-gray-400 font-bold max-w-sm mx-auto mb-6 leading-relaxed">
            We couldn't find any payment records matching your current filters.
            Try adjusting the date range or client.
          </p>
          <button
            onClick={() => {
              setFilters({ client_id: "", start_date: "", end_date: "" });
              setTimeout(() => fetchPayments(), 100);
            }}
            className="px-6 py-3 bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-all"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div
          className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm relative"
          style={{ overflow: "visible" }}
        >
          <div
            className="overflow-x-auto custom-scrollbar"
            style={{ overflow: "visible" }}
          >
            <table
              className="w-full text-left whitespace-nowrap border-collapse"
              style={{ overflow: "visible" }}
            >
              <thead className="bg-gray-50/80 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-8 py-5">Client & Project</th>
                  <th className="px-6 py-5">Task Details</th>
                  <th className="px-6 py-5 text-right">Amount</th>
                  <th className="px-6 py-5 text-center">Status</th>
                  <th className="px-8 py-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody
                className="divide-y divide-gray-50"
                style={{ overflow: "visible" }}
              >
                {payments.map((row) => (
                  <tr
                    key={row._id}
                    className="hover:bg-gray-50/50 transition-colors"
                    style={{ overflow: "visible" }}
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            row.client_id?.image ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(row.client_id?.name || "User")}&background=random`
                          }
                          className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover"
                          alt=""
                        />
                        <div>
                          <p className="font-black text-gray-900 text-sm">
                            {row.client_id?.name || "Unknown Client"}
                          </p>
                          <p className="text-[10px] font-bold text-indigo-500 uppercase">
                            {row.project_id?.project_name || "General Payment"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-bold text-gray-700 text-sm">
                      {row.job_id?.job_name || "N/A"}
                      <p className="text-[10px] text-gray-400 mt-0.5 font-bold">
                        <i className="fa-regular fa-calendar mr-1"></i>
                        {formatDate(row.createdAt)}
                      </p>
                    </td>
                    <td className="px-6 py-5 text-right font-black text-gray-900">
                      £{Number(row.paid_amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getStatusColor(row.status)}`}
                      >
                        {row.status || "Pending"}
                      </span>
                    </td>
                    <td
                      className="px-8 py-5 text-center"
                      style={{ overflow: "visible" }}
                    >
                      <div
                        className="flex items-center justify-center gap-1.5 relative"
                        style={{ overflow: "visible" }}
                      >
                        {row.payment_screenshot && (
                          <a
                            href={row.payment_screenshot}
                            target="_blank"
                            rel="noreferrer"
                            className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all"
                          >
                            <i className="fa-solid fa-image text-xs"></i>
                          </a>
                        )}

                        <Link
                          to={`/payments/invoice/${row._id}`}
                          className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"
                        >
                          <i className="fa-solid fa-file-invoice text-xs"></i>
                        </Link>

                        <button
                          onClick={() => {
                            setSelectedPayment(row);
                            setIsEditModalOpen(true);
                          }}
                          className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all"
                        >
                          <i className="fa-solid fa-pencil text-xs"></i>
                        </button>

                        {/* 🔄 STATUS DROPDOWN (ফিক্সড পজিশন) */}
                        <div
                          className="relative"
                          style={{ overflow: "visible" }}
                        >
                          <button
                            onClick={() =>
                              setActiveStatusId(
                                activeStatusId === row._id ? null : row._id,
                              )
                            }
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${activeStatusId === row._id ? "bg-orange-500 text-white" : "bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white"}`}
                          >
                            <i className="fa-solid fa-rotate text-xs"></i>
                          </button>

                          <AnimatePresence>
                            {activeStatusId === row._id && (
                              <motion.div
                                variants={dropdownVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="absolute right-0 top-full mt-2 w-36 bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-gray-100 p-2 z-[100] flex flex-col gap-1"
                              >
                                <button className="w-full text-left px-4 py-2 text-[10px] font-black uppercase text-green-600 hover:bg-green-50 rounded-xl transition-colors">
                                  Completed
                                </button>
                                <button className="w-full text-left px-4 py-2 text-[10px] font-black uppercase text-yellow-600 hover:bg-yellow-50 rounded-xl transition-colors">
                                  Pending
                                </button>
                                <button className="w-full text-left px-4 py-2 text-[10px] font-black uppercase text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                                  Rejected
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedPayment(row);
                            setIsDeleteModalOpen(true);
                          }}
                          className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"
                        >
                          <i className="fa-solid fa-trash text-xs"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ৩. এডিট মোডাল */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden relative z-10"
            >
              <div className="bg-gray-900 p-6 text-white flex justify-between items-center">
                <h3 className="font-black uppercase tracking-widest text-xs flex items-center gap-2">
                  <i className="fa-solid fa-pen-to-square text-emerald-400"></i>{" "}
                  Edit Payment Record
                </h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-white/50 hover:text-white"
                >
                  <i className="fa-solid fa-xmark text-xl"></i>
                </button>
              </div>
              <div className="p-8 space-y-5 text-left">
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-1">
                    Payment Amount (£)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-gray-400 font-black">
                      £
                    </span>
                    <input
                      type="number"
                      defaultValue={selectedPayment?.paid_amount}
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 pl-10 pr-4 text-sm font-bold focus:ring-2 focus:ring-[#0F8FF0]/20 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-1">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    defaultValue={
                      selectedPayment?.createdAt
                        ? new Date(selectedPayment.createdAt)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#0F8FF0]/20 outline-none"
                  />
                </div>
                <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs shadow-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 mt-4">
                  <i className="fa-solid fa-save"></i> Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ৪. ডিলিট কনফার্মেশন */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
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
              <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border-8 border-white shadow-inner">
                <i className="fa-solid fa-trash-can text-4xl"></i>
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-2 font-merriweather">
                Confirm?
              </h3>
              <p className="text-gray-500 text-sm font-bold mb-10 leading-relaxed text-center">
                Are you sure you want to delete payment for <br />
                <span className="text-gray-900 font-black">
                  £{selectedPayment?.paid_amount}
                </span>
                ? This is permanent.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-4 bg-gray-100 text-gray-500 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-gray-200 transition-all"
                >
                  CANCEL
                </button>
                <button className="flex-1 py-4 bg-red-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-red-200 hover:bg-red-700 transition-all active:scale-95">
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

export default PaymentLedger;
