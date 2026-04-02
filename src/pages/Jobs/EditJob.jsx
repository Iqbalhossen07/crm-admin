import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useHeader } from "../../components/layout/HeaderContext";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/axios";
import Swal from "sweetalert2";
import Loader from "../Loader/Loader";

// 🎯 CKEditor Imports
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const EditJob = () => {
  const navigate = useNavigate();
  const { setHeaderData } = useHeader();

  // URL থেকে Job ID ধরা (ধরে নিচ্ছি রাউট /jobs/edit/:id)
  const { id: jobId } = useParams();

  // স্টেটস
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [projectName, setProjectName] = useState("Loading...");
  const [projectId, setProjectId] = useState("");
  const [developers, setDevelopers] = useState([]);

  // ডেভেলপার চেঞ্জ ট্র্যাক করার জন্য আগের ডেভেলপারের আইডি
  const [originalDevId, setOriginalDevId] = useState("");

  const [formData, setFormData] = useState({
    task_name: "",
    is_free: "0",
    task_budget: "",
    paid_budget: "",
    start_time: "",
    estimate_finish_time: "",
    assigned_dev_id: "",
    dev_budget: "",
    dev_paid: "",
    description: "",
  });

  // Date ফরম্যাট করার হেল্পার ফাংশন (input type="date" এর জন্য YYYY-MM-DD লাগে)
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  useEffect(() => {
    setHeaderData({
      title: "Edit Task",
      subtitle: "Update existing job assignment",
      icon: "fa-solid fa-pen-to-square",
    });

    const fetchInitialData = async () => {
      try {
        if (!jobId) {
          Swal.fire("Error", "Job ID is missing!", "error");
          navigate("/jobs");
          return;
        }

        // ১. জবের ডিটেইলস নিয়ে আসা
        const jobRes = await api.get(`/admin/jobs/${jobId}`);
        const jobData = jobRes.data.data;

        // ২. ফর্মের স্টেটে ডাটা সেট করা
        setFormData({
          task_name: jobData.job_name || "",
          is_free: jobData.is_free || "0",
          task_budget: jobData.job_budget || "",
          paid_budget: jobData.paid_budget || "",
          start_time: formatDateForInput(jobData.start_time),
          estimate_finish_time: formatDateForInput(
            jobData.estimate_finish_time,
          ),
          assigned_dev_id: jobData.developer_id?._id || "",
          dev_budget: jobData.developer_budget || "",
          dev_paid: jobData.developer_paid || "",
          description: jobData.description || "",
        });

        setProjectName(jobData.project_id?.project_name || "Unknown Project");
        setProjectId(jobData.project_id?._id || "");

        // আগের ডেভেলপারের আইডি সেভ রাখা
        setOriginalDevId(jobData.developer_id?._id || "");

        // ৩. ডেভেলপার লিস্ট নিয়ে আসা
        const devRes = await api.get("/admin/developers");
        setDevelopers(devRes.data.data);
      } catch (err) {
        console.error("Failed to load job data", err);
        Swal.fire("Error", "Failed to load task details.", "error");
        navigate(-1);
      } finally {
        setPageLoading(false);
      }
    };

    fetchInitialData();
  }, [setHeaderData, jobId, navigate]);

  // সাধারণ ইনপুট চেঞ্জ হ্যান্ডেলার
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🎯 ডেভেলপার চেঞ্জ করার স্পেশাল হ্যান্ডেলার (সুইট এলার্ট সহ)
  const handleDevChange = (e) => {
    const newDevId = e.target.value;

    if (originalDevId && newDevId !== originalDevId) {
      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to change developers? All dues from the previous developer will be canceled, but previous payment records will remain.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, change it!",
        cancelButtonText: "Cancel",
        borderRadius: "2rem",
      }).then((result) => {
        if (result.isConfirmed) {
          // ইউজার রাজি হলে নতুন ডেভেলপার সেট হবে
          setFormData((prev) => ({ ...prev, assigned_dev_id: newDevId }));
        } else {
          // রাজি না হলে আগেরটাই থেকে যাবে (UI রিভার্ট করতে স্টেট আপডেট করতে হবে না, শুধু e.target.value রিস্টোর করতে হবে, তবে React Controlled Input এ অটো রিস্টোর হয়)
          setFormData((prev) => ({ ...prev, assigned_dev_id: originalDevId }));
        }
      });
    } else {
      setFormData((prev) => ({ ...prev, assigned_dev_id: newDevId }));
    }
  };

  // 🎯 CKEditor এর জন্য হ্যান্ডেলার
  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setFormData((prev) => ({ ...prev, description: data }));
  };

  // 🎯 মেইন সাবমিট লজিক (PUT Request)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      job_name: formData.task_name,
      job_budget:
        formData.is_free === "1" ? 0 : Number(formData.task_budget || 0),
      paid_budget:
        formData.is_free === "1" ? 0 : Number(formData.paid_budget || 0),
      developer_id: formData.assigned_dev_id || null,
      developer_budget: Number(formData.dev_budget || 0),
      developer_paid: Number(formData.dev_paid || 0),
      is_free: formData.is_free,
      start_time: formData.start_time || null,
      estimate_finish_time: formData.estimate_finish_time || null,
      description: formData.description,
    };

    try {
      const res = await api.put(`/admin/jobs/${jobId}`, payload);

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Update Successful!",
          text: "Job details have been updated safely.",
          timer: 2000,
          showConfirmButton: false,
          borderRadius: "2rem",
        });
        // আপডেট শেষে প্রজেক্টের জব লিস্টে ফেরত পাঠানো
        setTimeout(() => navigate(`/jobs?project_id=${projectId}`), 2000);
      }
    } catch (err) {
      console.error("❌ API CALL ERROR:", err.response?.data || err.message);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err.response?.data?.error || "Failed to update job details.",
        borderRadius: "2rem",
      });
    } finally {
      setLoading(false);
    }
  };

  // এনিমেশন কনফিগ
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  if (pageLoading) return <Loader />;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="flex-1 overflow-y-auto overflow-x-hidden pr-1 sm:pr-2 pb-10 w-full custom-scrollbar"
    >
      {/* ১. প্রফেশনাল হেডার */}
      <motion.header
        variants={headerVariants}
        className="flex-shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white/80 backdrop-blur-xl border border-gray-100 rounded-[20px] sm:rounded-[24px] px-5 py-4 shadow-sm mb-6 gap-4 sticky top-0 z-30"
      >
        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 text-blue-600 rounded-xl hidden sm:flex items-center justify-center shadow-sm border border-blue-200 shrink-0">
            <i className="fa-solid fa-pen-to-square text-lg sm:text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black font-merriweather text-gray-900 leading-tight">
              Edit Task
            </h1>
            <p className="text-[10px] sm:text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
              Update existing task details
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 sm:gap-5">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto justify-center px-5 py-3 sm:py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg transition-all flex items-center gap-2 active:scale-95"
          >
            <i className="fa-solid fa-arrow-left"></i> Back
          </button>
        </div>
      </motion.header>

      {/* ২. মেইন ফর্ম এরিয়া */}
      <form
        id="editJobForm"
        className="space-y-5 sm:space-y-6 max-w-4xl mx-auto mt-2"
        onSubmit={handleSubmit}
      >
        {/* Section 1: Basic Task Details */}
        <motion.div
          variants={cardVariants}
          className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-[24px] sm:rounded-[30px] p-5 sm:p-8 shadow-sm cute-card relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-bl-full -mr-6 -mt-6 pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
          <h2 className="text-lg sm:text-xl font-bold font-merriweather text-gray-900 mb-5 border-b border-gray-200/50 pb-4 relative z-10">
            <i className="fa-solid fa-layer-group text-purple-600 mr-2"></i> 1.
            Basic Task Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 relative z-10">
            <div className="md:col-span-2">
              <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">
                Task Title *
              </label>
              <input
                type="text"
                name="task_name"
                value={formData.task_name}
                required
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl outline-none focus:border-[#0F8FF0]/50 focus:ring-2 focus:ring-[#0F8FF0]/20 text-sm font-bold text-gray-800 transition-all shadow-sm"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">
                Link to Project (Fixed)
              </label>
              <input
                type="text"
                value={projectName}
                readOnly
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 cursor-not-allowed shadow-sm uppercase"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">
                Start Date
              </label>
              <input
                type="date"
                name="start_time"
                value={formData.start_time}
                required
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl outline-none focus:border-[#0F8FF0]/50 focus:ring-2 focus:ring-[#0F8FF0]/20 text-sm font-bold text-gray-800 transition-all shadow-sm"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">
                Estimate Finish Date
              </label>
              <input
                type="date"
                name="estimate_finish_time"
                value={formData.estimate_finish_time}
                required
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl outline-none focus:border-[#0F8FF0]/50 focus:ring-2 focus:ring-[#0F8FF0]/20 text-sm font-bold text-gray-800 transition-all shadow-sm"
                onChange={handleChange}
              />
            </div>
          </div>
        </motion.div>

        {/* Section 2: Client Billing & Budget */}
        <motion.div
          variants={cardVariants}
          transition={{ delay: 0.1 }}
          className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-[24px] sm:rounded-[30px] p-5 sm:p-8 shadow-sm cute-card relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-bl-full -mr-6 -mt-6 pointer-events-none group-hover:scale-110 transition-transform"></div>
          <h2 className="text-lg sm:text-xl font-bold font-merriweather text-gray-900 mb-5 border-b border-gray-200/50 pb-4 relative z-10">
            <i className="fa-solid fa-file-invoice-dollar text-green-600 mr-2"></i>{" "}
            2. Client Billing & Budget
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 relative z-10">
            <div>
              <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">
                Is this a Free Task?
              </label>
              <div className="relative">
                <select
                  name="is_free"
                  value={formData.is_free}
                  onChange={handleChange}
                  disabled={Number(formData.paid_budget) > 0} // 🎯 Paid to Free Restriction
                  className={`w-full px-4 py-3 border rounded-xl outline-none text-sm font-bold transition-all shadow-sm appearance-none ${Number(formData.paid_budget) > 0 ? "bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed" : "bg-white/80 border-gray-200 text-gray-800 cursor-pointer focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20"}`}
                >
                  <option value="0">No, It's Paid</option>
                  <option value="1">Yes, Free Task</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <i className="fa-solid fa-chevron-down text-xs"></i>
                </div>
              </div>
              {/* 🎯 Warning Message if disabled */}
              {Number(formData.paid_budget) > 0 && (
                <p className="text-[9px] text-red-500 mt-1 font-bold uppercase tracking-wider">
                  * Cannot switch to free. Payments exist.
                </p>
              )}
            </div>

            <AnimatePresence>
              {formData.is_free === "0" && (
                <>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="budget-fields"
                  >
                    <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">
                      Client Charge (£) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="task_budget"
                      value={formData.task_budget}
                      required
                      placeholder="0.00"
                      className="w-full px-4 py-3 bg-green-50/50 border border-green-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0F8FF0]/20 text-base font-black text-green-700 transition-all shadow-sm"
                      onChange={handleChange}
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="budget-fields"
                  >
                    <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">
                      Already Paid (£)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="paid_budget"
                      value={formData.paid_budget}
                      placeholder="0.00"
                      className="w-full px-4 py-3 bg-blue-50/50 border border-blue-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0F8FF0]/20 text-base font-black text-blue-700 transition-all shadow-sm"
                      onChange={handleChange}
                    />
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Section 3: Internal Team & Cost */}
        <motion.div
          variants={cardVariants}
          transition={{ delay: 0.2 }}
          className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-[24px] sm:rounded-[30px] p-5 sm:p-8 shadow-sm cute-card relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full -mr-6 -mt-6 pointer-events-none group-hover:scale-110 transition-transform"></div>
          <h2 className="text-lg sm:text-xl font-bold font-merriweather text-gray-900 mb-5 border-b border-gray-200/50 pb-4 relative z-10">
            <i className="fa-solid fa-users-gear text-blue-600 mr-2"></i> 3.
            Internal Team & Cost
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 relative z-10">
            <div>
              <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">
                Assign Developer
              </label>
              <div className="relative">
                <select
                  name="assigned_dev_id"
                  value={formData.assigned_dev_id}
                  onChange={handleDevChange} // 🎯 স্পেশাল হ্যান্ডেলার অ্যাড করা হয়েছে
                  className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-sm font-bold text-gray-800 transition-all shadow-sm appearance-none cursor-pointer uppercase"
                >
                  <option value="">-- Do Not Assign Yet --</option>
                  {developers.map((dev) => (
                    <option key={dev._id} value={dev._id}>
                      {dev.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <i className="fa-solid fa-chevron-down text-xs"></i>
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">
                Developer Budget (£)
              </label>
              <input
                type="number"
                step="0.01"
                name="dev_budget"
                value={formData.dev_budget}
                placeholder="0.00"
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-base font-black text-gray-800 transition-all shadow-sm"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">
                Developer Paid (£)
              </label>
              <input
                type="number"
                step="0.01"
                name="dev_paid"
                value={formData.dev_paid}
                placeholder="0.00"
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-base font-black text-gray-800 transition-all shadow-sm"
                onChange={handleChange}
              />
            </div>
          </div>
        </motion.div>

        {/* Section 4: Task Description */}
        <motion.div
          variants={cardVariants}
          transition={{ delay: 0.3 }}
          className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-[24px] sm:rounded-[30px] p-5 sm:p-8 shadow-sm cute-card relative overflow-hidden group custom-ckeditor-wrapper"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-bl-full -mr-6 -mt-6 pointer-events-none group-hover:scale-110 transition-transform"></div>
          <h2 className="text-lg sm:text-xl font-bold font-merriweather text-gray-900 mb-5 border-b border-gray-200/50 pb-4 relative z-10">
            <i className="fa-solid fa-align-left text-orange-600 mr-2"></i> 4.
            Task Description
          </h2>
          <div className="relative z-10">
            <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">
              Instructions / Details
            </label>
            <div className="bg-white/80 border border-gray-200 rounded-xl overflow-hidden shadow-sm focus-within:border-orange-500/50 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all">
              <CKEditor
                editor={ClassicEditor}
                data={formData.description}
                onChange={handleEditorChange}
                config={{
                  placeholder: "Explain what needs to be done...",
                  toolbar: [
                    "heading",
                    "|",
                    "bold",
                    "italic",
                    "link",
                    "bulletedList",
                    "numberedList",
                    "blockQuote",
                    "|",
                    "undo",
                    "redo",
                  ],
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          variants={cardVariants}
          transition={{ delay: 0.4 }}
          className="pt-2 pb-8 flex justify-end"
        >
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-10 py-4 bg-[#0F8FF0] text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:bg-blue-600 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 disabled:bg-gray-400"
          >
            {loading ? (
              <i className="fa-solid fa-spinner fa-spin text-lg"></i>
            ) : (
              <i className="fa-solid fa-floppy-disk text-lg"></i>
            )}
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default EditJob;
