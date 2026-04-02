import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useHeader } from "../../components/layout/HeaderContext";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/axios"; // আপনার কাস্টম এক্সিওস
import Swal from "sweetalert2";
import Loader from "../Loader/Loader";

const ProjectList = () => {
  const { setHeaderData } = useHeader();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const clientId = searchParams.get("client_id");
  const [searchTerm, setSearchTerm] = useState("");

  // স্টেট ম্যানেজমেন্ট
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]); // ড্রপডাউনের জন্য ক্লায়েন্ট লিস্ট
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  // ১. হেডার আপডেট এবং ডাটা ফেচিং
  useEffect(() => {
    setHeaderData({
      title: clientId ? "Client Projects" : "All Projects",
      subtitle: "Manage your project assignments",
      icon: "fa-solid fa-folder-open",
    });

    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  // ২. এপিআই থেকে ডাটা আনার লজিক
  const fetchInitialData = async () => {
    try {
      setLoading(true);
      // প্রজেক্ট ফেচ করা (যদি clientId থাকে তবে ফিল্টার হবে)
      const projectUrl = clientId
        ? `/admin/projects?client_id=${clientId}`
        : "/admin/projects";
      const projectRes = await api.get(projectUrl);
      setProjects(projectRes.data.data);

      // ড্রপডাউনের জন্য ক্লায়েন্ট লিস্ট ফেচ করা
      const clientRes = await api.get("/admin/clients");
      setClients(clientRes.data.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      Swal.fire("Error", "Failed to load projects", "error");
    } finally {
      setLoading(false);
    }
  };

  // ৩. ডিলিট লজিক
  const handleDelete = async () => {
    try {
      await api.delete(`/admin/projects/${selectedProjectId}`);
      setProjects(projects.filter((p) => p._id !== selectedProjectId));
      setIsDeleteModalOpen(false);
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Project has been removed successfully.",
        timer: 1500,
        showConfirmButton: false,
        borderRadius: "2rem",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: "Could not delete the project.",
        borderRadius: "2rem",
      });
    }
  };

  // ৪. সার্চ ফিল্টারিং লজিক (Populated ক্লায়েন্টের নাম দিয়েও সার্চ হবে)
  const filteredProjects = projects.filter((proj) => {
    const projectName = proj.project_name?.toLowerCase() || "";
    const clientName = proj.client_id?.name?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    return projectName.includes(search) || clientName.includes(search);
  });

  const handleClientFilter = (id) => {
    if (id) navigate(`/projects?client_id=${id}`);
    else navigate("/projects");
  };

  const springAnimation = {
    type: "spring",
    stiffness: 400,
    damping: 40,
    mass: 1,
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

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full pb-10"
    >
      {/* সার্চ এবং ফিল্টার সেকশন */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-6 sm:mb-8 gap-4 px-1">
        <div className="relative w-full sm:w-72 group">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl sm:rounded-2xl py-2.5 pl-10 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0F8FF0]/20 transition-all shadow-sm"
          />
          <span className="absolute left-3.5 top-3 text-gray-400 group-focus-within:text-[#0F8FF0]">
            <i className="fa-solid fa-magnifying-glass text-sm"></i>
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-56 group">
            <select
              value={clientId || ""}
              onChange={(e) => handleClientFilter(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl sm:rounded-2xl py-2.5 pl-4 pr-10 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0F8FF0]/20 appearance-none cursor-pointer shadow-sm text-gray-600"
            >
              <option value="">All Clients</option>
              {/* ডাইনামিক ক্লায়েন্ট লিস্ট */}
              {clients.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.name}
                </option>
              ))}
            </select>
            <span className="absolute right-4 top-3 text-gray-400 pointer-events-none">
              <i className="fa-solid fa-chevron-down text-sm"></i>
            </span>
          </div>

          <AnimatePresence>
            {clientId && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Link
                  to={`/projects/add?client_id=${clientId}`}
                  className="w-full sm:w-auto flex justify-center items-center gap-2 px-6 py-2.5 bg-black text-white rounded-xl sm:rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-md hover:bg-[#0F8FF0] transition-all"
                >
                  <i className="fa-solid fa-folder-plus text-xs"></i> Add
                  Project
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* গ্রিড সেকশন */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-20"
            >
              <i className="fa-solid fa-folder-open text-6xl text-gray-200 mb-4"></i>
              <p className="text-gray-400 font-bold">No projects found.</p>
            </motion.div>
          ) : (
            filteredProjects.map((proj) => (
              <motion.div
                key={proj._id}
                layout
                variants={{
                  hidden: { opacity: 0, scale: 0.9 },
                  visible: { opacity: 1, scale: 1 },
                }}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.9 }}
                transition={springAnimation}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="project-card bg-white p-5 sm:p-7 rounded-3xl sm:rounded-[2rem] shadow-sm relative overflow-hidden flex flex-col h-full border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-2 mb-4">
                  <img
                    src={
                      proj.client_id?.image ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(proj.client_id?.name || "Unknown")}&background=random`
                    }
                    className="w-6 h-6 rounded-full border border-gray-100 shadow-sm object-cover"
                    alt="client"
                  />
                  <p className="text-[10px] sm:text-[11px] font-extrabold text-gray-400 uppercase tracking-widest truncate">
                    {proj.client_id?.name || "Unknown Client"}
                  </p>
                </div>

                <h3 className="text-lg sm:text-2xl font-black font-merriweather text-gray-900 leading-tight mb-6 truncate">
                  {proj.project_name}
                </h3>

                {/* স্ট্যাটিক জিরো ডাটা */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  <div className="bg-gray-50/50 p-3 rounded-2xl border border-gray-100 text-center">
                    <p className="text-[8px] font-black text-gray-400 uppercase mb-1">
                      Tasks
                    </p>
                    <p className="text-sm font-black text-gray-900">0</p>
                  </div>
                  <div className="bg-orange-50/50 p-3 rounded-2xl border border-orange-50 text-center">
                    <p className="text-[8px] font-black text-orange-500 uppercase mb-1">
                      Pending
                    </p>
                    <p className="text-sm font-black text-orange-600">0</p>
                  </div>
                  <div className="bg-green-50/50 p-3 rounded-2xl border border-green-50 text-center">
                    <p className="text-[8px] font-black text-green-500 uppercase mb-1">
                      Done
                    </p>
                    <p className="text-sm font-black text-green-600">0</p>
                  </div>
                </div>

                {/* স্ট্যাটিক বাজেট ডাটা */}
                <div className="flex items-center justify-between border-y border-gray-50 py-4 mb-6 px-2">
                  <div className="text-center">
                    <p className="text-[8px] font-black text-gray-400 uppercase">
                      Budget
                    </p>
                    <p className="text-xs sm:text-[13px] font-black text-gray-900">
                      £0
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[8px] font-black text-green-500 uppercase">
                      Paid
                    </p>
                    <p className="text-xs sm:text-[13px] font-black text-green-600">
                      £0
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[8px] font-black text-gray-400 uppercase">
                      Due
                    </p>
                    <p className="text-xs sm:text-[13px] font-black text-gray-400">
                      £0
                    </p>
                  </div>
                </div>

                {/* অ্যাকশন বাটনস */}
                <div className="flex flex-col sm:flex-row items-center justify-between mt-auto gap-3">
                  <Link
                    to={`/jobs?project_id=${proj._id}`}
                    className="w-full sm:w-auto px-5 h-10 rounded-xl sm:rounded-full bg-black text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#0F8FF0] transition-all shadow-md"
                  >
                    <i className="fa-solid fa-list-check"></i> Manage Jobs
                  </Link>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/projects/view/${proj._id}`}
                      className="w-9 h-9 rounded-xl bg-blue-100/50 text-blue-600 flex items-center justify-center hover:bg-[#0F8FF0] hover:text-white transition-all"
                    >
                      <i className="fas fa-eye text-xs"></i>
                    </Link>
                    <Link
                      to={`/projects/edit/${proj._id}`}
                      className="w-9 h-9 rounded-xl bg-green-100/50 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all"
                    >
                      <i className="fas fa-pencil-alt text-xs"></i>
                    </Link>
                    <button
                      onClick={() => {
                        setSelectedProjectId(proj._id);
                        setIsDeleteModalOpen(true);
                      }}
                      className="w-9 h-9 rounded-xl bg-red-100/50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"
                    >
                      <i className="fas fa-trash-alt text-xs"></i>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>

      {/* ৪. ডিলিট কনফার্মেশন এলার্ট */}
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
              <h3 className="text-3xl font-black text-gray-900 mb-2 font-merriweather tracking-tight">
                Confirm?
              </h3>
              <p className="text-gray-500 text-sm font-bold mb-10 leading-relaxed">
                Are you absolutely sure you want to delete this project record?
                This is permanent.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-4 bg-gray-100 text-gray-500 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-gray-200 transition-colors"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-4 bg-red-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl active:scale-95 shadow-xl shadow-red-200 transition-all"
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

export default ProjectList;
