import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useHeader } from "../../components/layout/HeaderContext";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/axios"; // 🎯 আপনার API ইমপোর্ট
import Swal from "sweetalert2";
import Loader from "../Loader/Loader"; // 🎯 লোডার

// এনিমেশন কনফিগ (আপনার দেওয়া হুবহু)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};
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
  hidden: { opacity: 0, y: 10, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.15, ease: "easeOut" },
  },
  exit: { opacity: 0, y: 10, scale: 0.9, transition: { duration: 0.1 } },
};

const ClientOverview = () => {
  const { setHeaderData } = useHeader();
  const { id } = useParams();
  const navigate = useNavigate();

  // 🎯 ডাইনামিক স্টেটস
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState({});
  const [stats, setStats] = useState({
    total_bill: 0,
    total_paid: 0,
    total_due: 0,
    total_projects: 0,
  });
  const [projects, setProjects] = useState([]);
  const [payments, setPayments] = useState([]);

  // মডাল স্টেটস
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [activeStatusId, setActiveStatusId] = useState(null);

  // 🎯 ডাটা ফেচিং (Overview API থেকে)
  const fetchClientData = async () => {
    try {
      const res = await api.get(`/admin/clients/${id}/overview`);
      const { client_info, stats, projects, payments } = res.data.data;

      setClient(client_info);
      setStats(stats);
      setProjects(projects);
      setPayments(payments);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to load client data", "error");
      navigate("/clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientData();
  }, [id]);

  useEffect(() => {
    if (client.name) {
      setHeaderData({
        title: "Client Overview",
        subtitle: client.company_name || "Individual Client",
        icon: "fa-solid fa-user-tie",
      });
    }
  }, [setHeaderData, client]);

  // 🎯 পেমেন্ট স্ট্যাটাস আপডেট হ্যান্ডেলার
  const handleStatusUpdate = async (paymentId, newStatus) => {
    try {
      const res = await api.put(`/admin/payments/${paymentId}/status`, {
        status: newStatus,
      });
      if (res.data.success) {
        setActiveStatusId(null); // ড্রপডাউন বন্ধ করা
        fetchClientData(); // রিয়েল-টাইম ডাটা রিফ্রেশ (টোটাল পেইড/ডিউ আপডেট হওয়ার জন্য)
      }
    } catch (err) {
      Swal.fire("Error", "Failed to update payment status", "error");
    }
  };

  // 🎯 পেমেন্ট ডিলিট হ্যান্ডেলার
  const handleDeletePayment = async () => {
    try {
      // (আপনার যদি ডিলিট পেমেন্ট রাউট থাকে, তবে এখানে বসাবেন)
      // await api.delete(`/admin/payments/${selectedPaymentId}`);

      // আপাতত শুধু UI থেকে সরানো ও রিফ্রেশ লজিক দিলাম:
      setPayments(payments.filter((p) => p._id !== selectedPaymentId));
      setIsDeleteModalOpen(false);
      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Payment deleted",
        timer: 1500,
        showConfirmButton: false,
      });
      fetchClientData(); // রিক্যালকুলেট
    } catch (err) {
      Swal.fire("Error", "Could not delete payment", "error");
    }
  };

  // Date ফরমেটার হেল্পার
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) return <Loader />;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex-1 overflow-y-auto overflow-x-hidden pr-1 sm:pr-2 pb-10 w-full custom-scrollbar"
    >
      {/* ১. হেডার সেকশন */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/80 backdrop-blur-xl px-4 sm:px-6 py-4 rounded-2xl sm:rounded-[2rem] shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4 sticky top-0 z-30"
      >
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 text-[#0F8FF0] rounded-xl flex items-center justify-center border border-blue-100 shrink-0">
              <i className="fa-solid fa-user-tie text-lg sm:text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black font-merriweather text-gray-900 leading-tight">
                Client Overview
              </h1>
              <p className="text-[10px] sm:text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                {client.company_name || "Individual"}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Link
            to={`/clients/edit/${client._id}`}
            className="flex-1 sm:flex-none justify-center px-4 py-2.5 bg-blue-50 text-[#0F8FF0] hover:bg-[#0F8FF0] hover:text-white font-bold text-[10px] sm:text-xs uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 shadow-sm"
          >
            <i className="fa-solid fa-pencil"></i> Edit Profile
          </Link>
          <Link
            to="/clients"
            className="flex-1 sm:flex-none justify-center px-4 py-2.5 bg-[#111827] hover:bg-black text-white font-bold text-[10px] sm:text-xs uppercase rounded-xl transition-all flex items-center gap-2 active:scale-95 shadow-md"
          >
            <i className="fa-solid fa-arrow-left"></i> Back
          </Link>
        </div>
      </motion.header>

      {/* ২. প্রোফাইল ও স্ট্যাটাস */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 mb-8 mt-2">
        <motion.div
          variants={itemVariants}
          className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden flex flex-col justify-center text-center group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-full -mr-8 -mt-8 pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
          <div className="relative z-10 flex flex-col items-center mb-6">
            <motion.img
              whileHover={{ scale: 1.05 }}
              src={
                client.image ||
                `https://ui-avatars.com/api/?name=${client.name}&background=0F8FF0&color=fff&size=256`
              }
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full shadow-md border-4 border-white mb-4 object-cover"
            />
            <h2 className="text-2xl sm:text-3xl font-black font-merriweather text-gray-900">
              {client.name}
            </h2>
            <span className="bg-blue-50/80 text-[#0F8FF0] px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100 mt-2 flex items-center gap-2">
              <i className="fa-solid fa-building"></i>
              {client.company_name || "Individual Client"}
            </span>
          </div>
          <div className="space-y-3 relative z-10 bg-gray-50/80 p-4 rounded-2xl border border-gray-100 text-left w-full text-xs font-bold text-gray-600">
            <p className="flex items-center gap-3 truncate">
              <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 shrink-0 shadow-sm">
                <i className="fa-solid fa-envelope"></i>
              </span>
              {client.email}
            </p>
            <p className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 shrink-0 shadow-sm">
                <i className="fa-solid fa-phone"></i>
              </span>
              {client.phone}
            </p>
          </div>
        </motion.div>

        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 content-start">
          {[
            {
              label: "Total Bill",
              val: stats.total_bill,
              bg: "bg-blue-100",
              icon: "fa-file-invoice-dollar",
              textCol: "text-gray-900",
              iconCol: "text-[#0F8FF0]",
            },
            {
              label: "Total Paid",
              val: stats.total_paid,
              bg: "bg-green-100",
              icon: "fa-hand-holding-dollar",
              textCol: "text-green-600",
              iconCol: "text-green-600",
            },
            {
              label: "Total Due",
              val: stats.total_due,
              bg: "bg-red-100",
              icon: "fa-triangle-exclamation",
              textCol: stats.total_due > 0 ? "text-red-600" : "text-gray-900",
              iconCol: stats.total_due > 0 ? "text-red-600" : "text-gray-400",
            },
            {
              label: "Active Projects",
              val: stats.total_projects,
              bg: "bg-purple-100",
              icon: "fa-diagram-project",
              textCol: "text-purple-600",
              iconCol: "text-purple-600",
              isNumber: true,
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col justify-center relative overflow-hidden group hover:shadow-lg transition-all"
            >
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded ${stat.bg} ${stat.iconCol} flex items-center justify-center`}
                >
                  <i className={`fa-solid ${stat.icon} text-[10px]`}></i>
                </span>{" "}
                {stat.label}
              </p>
              <h2
                className={`text-2xl sm:text-4xl font-black font-merriweather ${stat.textCol} mt-2`}
              >
                {stat.isNumber
                  ? stat.val
                  : `£ ${Number(stat.val).toLocaleString()}`}
              </h2>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ৩. Projects Section */}
      <motion.div
        variants={itemVariants}
        className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden mb-8"
      >
        <div className="p-5 sm:p-8 flex justify-between items-center border-b border-gray-50 bg-gray-50/20">
          <div>
            <h3 className="font-black text-xl sm:text-2xl font-merriweather text-gray-900 leading-tight">
              Projects
            </h3>
            <p className="text-[10px] sm:text-xs text-gray-500 font-bold mt-1 uppercase tracking-[0.2em]">
              Full project roadmap
            </p>
          </div>
          <Link
            to={`/projects/add?client_id=${client._id}`}
            className="px-5 py-2.5 bg-black text-white rounded-xl hover:bg-[#0F8FF0] transition-all flex items-center gap-2 text-xs font-black  tracking-widest"
          >
            <i className="fa-solid fa-plus"></i> New Project
          </Link>
        </div>

        <div className="p-4 sm:p-0">
          {projects.length === 0 ? (
            <div className="p-8 text-center text-gray-400 font-bold text-sm">
              No projects found.
            </div>
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                  <thead className="text-gray-400 text-[10px] uppercase font-black tracking-widest border-b border-gray-100">
                    <tr>
                      <th className="px-8 py-4">Created At</th>
                      <th className="px-6 py-4">Project Name</th>
                      <th className="px-6 py-4 text-right">Budget</th>
                      <th className="px-6 py-4 text-right">Paid</th>
                      <th className="px-6 py-4 text-right">Due</th>
                      <th className="px-8 py-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {projects.map((proj) => (
                      <tr
                        key={proj._id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-8 py-5 text-gray-500 font-bold text-xs">
                          {formatDate(proj.created_at)}
                        </td>
                        <td className="px-6 py-5 font-black text-gray-900">
                          {proj.project_name}
                        </td>
                        <td className="px-6 py-5 font-black text-gray-900 text-right">
                          £{Number(proj.project_budget || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-5 font-black text-green-600 text-right">
                          £{Number(proj.paid_budget || 0).toLocaleString()}
                        </td>
                        <td
                          className={`px-6 py-5 font-black text-right ${proj.due_budget > 0 ? "text-red-600" : "text-gray-400"}`}
                        >
                          £{Number(proj.due_budget || 0).toLocaleString()}
                        </td>
                        <td className="px-8 py-5 text-center">
                          <Link
                            to={`/jobs?project_id=${proj._id}`}
                            className="w-9 h-9 inline-flex items-center justify-center bg-blue-50 text-[#0F8FF0] rounded-xl hover:bg-[#0F8FF0] hover:text-white transition-all shadow-sm"
                          >
                            <i className="fa-solid fa-arrow-right text-xs"></i>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Mobile */}
              <div className="sm:hidden space-y-4">
                {projects.map((proj) => (
                  <div
                    key={proj._id}
                    className="p-5 bg-gray-50/50 border border-gray-100 rounded-3xl"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[9px] font-black text-gray-400 uppercase">
                          {formatDate(proj.created_at)}
                        </span>
                        <h4 className="text-base font-black text-gray-900 mt-0.5">
                          {proj.project_name}
                        </h4>
                      </div>
                      <Link
                        to={`/jobs?project_id=${proj._id}`}
                        className="w-8 h-8 flex items-center justify-center bg-[#0F8FF0] text-white rounded-lg"
                      >
                        <i className="fa-solid fa-arrow-right text-xs"></i>
                      </Link>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-white p-2.5 rounded-xl border border-gray-100 text-center">
                        <p className="text-[8px] text-gray-400 font-black uppercase">
                          Budget
                        </p>
                        <p className="text-[11px] font-black text-gray-900">
                          £{Number(proj.project_budget || 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-gray-100 text-center">
                        <p className="text-[8px] text-green-500 font-black uppercase">
                          Paid
                        </p>
                        <p className="text-[11px] font-black text-green-600">
                          £{Number(proj.paid_budget || 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-gray-100 text-center">
                        <p
                          className={`text-[8px] font-black uppercase ${proj.due_budget > 0 ? "text-red-500" : "text-gray-400"}`}
                        >
                          Due
                        </p>
                        <p
                          className={`text-[11px] font-black ${proj.due_budget > 0 ? "text-red-700" : "text-gray-700"}`}
                        >
                          £{Number(proj.due_budget || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </motion.div>

      {/* ৪. Payment History Section */}
      <motion.div
        variants={itemVariants}
        className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm overflow-visible"
      >
        <div className="p-5 sm:p-8 border-b border-gray-50 bg-gray-50/20 rounded-t-[2.5rem]">
          <h3 className="font-black text-xl sm:text-2xl font-merriweather text-gray-900">
            Payment History
          </h3>
          <p className="text-[10px] sm:text-xs text-gray-500 font-bold mt-1 uppercase tracking-[0.2em]">
            Transaction logs
          </p>
        </div>

        <div className="p-4 sm:p-0">
          {payments.length === 0 ? (
            <div className="p-8 text-center text-gray-400 font-bold text-sm">
              No payment history found.
            </div>
          ) : (
            <>
              {/* Desktop */}
              <div
                className="hidden sm:block overflow-x-auto"
                style={{ overflow: "visible" }}
              >
                <table
                  className="w-full text-left whitespace-nowrap"
                  style={{ overflow: "visible" }}
                >
                  <thead className="text-gray-400 text-[10px] uppercase font-black tracking-widest border-b border-gray-100">
                    <tr>
                      <th className="px-8 py-4">Date</th>
                      <th className="px-6 py-4">Project / Task</th>
                      <th className="px-6 py-4 text-right">Amount</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-8 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody
                    className="divide-y divide-gray-50"
                    style={{ overflow: "visible" }}
                  >
                    {payments.map((pay) => (
                      <tr
                        key={pay._id}
                        className="hover:bg-gray-50/50 transition-colors"
                        style={{ overflow: "visible" }}
                      >
                        <td className="px-8 py-5 text-gray-500 font-bold text-xs">
                          {formatDate(pay.createdAt)}
                        </td>
                        <td className="px-6 py-5">
                          <p className="font-bold text-gray-900 text-sm">
                            {pay.job_id?.job_name || "General Payment"}
                          </p>
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                            {pay.project_id?.project_name}
                          </p>
                        </td>
                        <td className="px-6 py-5 font-black text-gray-900 text-right text-sm">
                          £{Number(pay.paid_amount || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span
                            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase border border-white 
                            ${pay.status?.toLowerCase() === "accepted" || pay.status?.toLowerCase() === "completed" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}
                          >
                            {pay.status}
                          </span>
                        </td>
                        <td
                          className="px-8 py-5 text-center"
                          style={{ overflow: "visible" }}
                        >
                          <div
                            className="flex items-center justify-center gap-2 relative"
                            style={{ overflow: "visible" }}
                          >
                            <Link
                              to={`/payments/invoice/${pay._id}`}
                              className="w-8 h-8 flex items-center justify-center bg-blue-50 text-[#0F8FF0] rounded-lg shadow-sm border border-blue-100"
                            >
                              <i className="fa-solid fa-file-invoice"></i>
                            </Link>

                            {/* 🔄 Status dropdown বাটন */}
                            <div className="relative">
                              <button
                                onClick={() =>
                                  setActiveStatusId(
                                    activeStatusId === pay._id ? null : pay._id,
                                  )
                                }
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${activeStatusId === pay._id ? "bg-orange-500 text-white" : "bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white"}`}
                              >
                                <i className="fa-solid fa-rotate text-xs"></i>
                              </button>
                              <AnimatePresence>
                                {activeStatusId === pay._id && (
                                  <motion.div
                                    variants={dropdownVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="absolute right-0 bottom-full mb-2 w-32 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-[99] flex flex-col gap-1"
                                  >
                                    <button
                                      onClick={() =>
                                        handleStatusUpdate(pay._id, "Accepted")
                                      }
                                      className="w-full text-left px-3 py-2 text-[10px] font-black uppercase text-green-600 hover:bg-green-50 rounded-lg"
                                    >
                                      Accept
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleStatusUpdate(pay._id, "Pending")
                                      }
                                      className="w-full text-left px-3 py-2 text-[10px] font-black uppercase text-yellow-600 hover:bg-yellow-50 rounded-lg"
                                    >
                                      Pending
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleStatusUpdate(pay._id, "Rejected")
                                      }
                                      className="w-full text-left px-3 py-2 text-[10px] font-black uppercase text-red-600 hover:bg-red-50 rounded-lg"
                                    >
                                      Reject
                                    </button>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>

                            <button
                              onClick={() => {
                                setSelectedPaymentId(pay._id);
                                setIsDeleteModalOpen(true);
                              }}
                              className="w-8 h-8 bg-red-50 text-red-600 rounded-lg shadow-sm border border-red-100"
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Mobile */}
              <div className="sm:hidden space-y-4">
                {payments.map((pay) => (
                  <div
                    key={pay._id}
                    className="p-5 bg-gray-50/50 border border-gray-100 rounded-3xl relative"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-black text-gray-400">
                        {formatDate(pay.created_at)}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-md text-[8px] font-black uppercase border border-white 
                        ${pay.status?.toLowerCase() === "accepted" || pay.status?.toLowerCase() === "completed" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}
                      >
                        {pay.status}
                      </span>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm font-black text-gray-900">
                        {pay.job_id?.job_name || "General Payment"}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">
                        {pay.project_id?.project_name}
                      </p>
                    </div>
                    <div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-gray-100">
                      <span className="text-base font-black text-gray-900">
                        £{Number(pay.paid_amount || 0).toLocaleString()}
                      </span>
                      <div className="flex gap-2 relative">
                        <Link
                          to={`/payments/invoice/${pay._id}`}
                          className="w-8 h-8 flex items-center justify-center bg-blue-50 text-[#0F8FF0] rounded-lg border border-blue-100"
                        >
                          <i className="fa-solid fa-file-invoice text-xs"></i>
                        </Link>

                        {/* Status dropdown mobile */}
                        <div className="relative">
                          <button
                            onClick={() =>
                              setActiveStatusId(
                                activeStatusId === pay._id ? null : pay._id,
                              )
                            }
                            className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center"
                          >
                            <i className="fa-solid fa-rotate text-xs"></i>
                          </button>
                          <AnimatePresence>
                            {activeStatusId === pay._id && (
                              <motion.div
                                variants={dropdownVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="absolute right-0 bottom-full mb-2 w-32 bg-white rounded-xl shadow-2xl border border-gray-100 p-2 z-[99] flex flex-col gap-1"
                              >
                                <button
                                  onClick={() =>
                                    handleStatusUpdate(pay._id, "Accepted")
                                  }
                                  className="w-full text-left px-3 py-1.5 text-[9px] font-black uppercase text-green-600"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() =>
                                    handleStatusUpdate(pay._id, "Pending")
                                  }
                                  className="w-full text-left px-3 py-1.5 text-[9px] font-black uppercase text-yellow-600"
                                >
                                  Pending
                                </button>
                                <button
                                  onClick={() =>
                                    handleStatusUpdate(pay._id, "Rejected")
                                  }
                                  className="w-full text-left px-3 py-1.5 text-[9px] font-black uppercase text-red-600"
                                >
                                  Reject
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedPaymentId(pay._id);
                            setIsDeleteModalOpen(true);
                          }}
                          className="w-8 h-8 bg-red-50 text-red-600 rounded-lg border border-red-100"
                        >
                          <i className="fa-solid fa-trash text-xs"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </motion.div>

      {/* ৫. ডিলিট এলার্ট */}
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
              <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border-8 border-white shadow-inner">
                <i className="fa-solid fa-trash-can text-4xl"></i>
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-2 font-merriweather leading-tight">
                Confirm?
              </h3>
              <p className="text-gray-500 text-sm font-bold mb-10 leading-relaxed">
                Are you absolutely sure you want to delete this payment record?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-4 bg-gray-100 text-gray-500 font-black text-[10px] uppercase rounded-2xl"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleDeletePayment}
                  className="flex-1 py-4 bg-red-600 text-white font-black text-[10px] uppercase rounded-2xl active:scale-95 shadow-xl"
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

export default ClientOverview;
