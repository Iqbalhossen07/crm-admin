import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useHeader } from '../../components/layout/HeaderContext';
import { motion } from 'framer-motion';

const EditClient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setHeaderData } = useHeader();

  // ১. তোর ডাটাবেজ অনুযায়ী স্টেট সেটআপ
  const [client, setClient] = useState({
    id: id || '',
    name: "Iqbal Hossen", // ডামি ডাটা, পরে API থেকে আসবে
    company_name: "SETS TECH",
    email: "iqbal@setstech.com",
    phone: "+880170000000",
    notes: "This is a priority client.",
    image: null
  });

  const [preview, setPreview] = useState(null);

  // ২. পেজ লোড হলে হেডার আপডেট এবং ডিফল্ট প্রিভিউ সেট
  useEffect(() => {
    setHeaderData({
      title: 'Edit Client',
      subtitle: 'Update profile information',
      icon: 'fa-solid fa-user-pen'
    });
    
    // ডিফল্ট প্রিভিউ সেট করা (যদি ইমেজ না থাকে তবে অবতার)
    setPreview(`https://ui-avatars.com/api/?name=${encodeURIComponent(client.name)}&background=0F8FF0&color=fff&size=256`);
  }, [setHeaderData, client.name]);

  // ৩. ইনপুট চেঞ্জ হ্যান্ডেলার
  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient({ ...client, [name]: value });
  };

  // ৪. ইমেজ প্রিভিউ হ্যান্ডেলার
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // ৫. এনিমেশন ভেরিয়েন্ট
  const pageTransition = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, staggerChildren: 0.1 } 
    }
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={pageTransition}
      className="w-full"
    >
      {/* হেডার সেকশন (সেম টু সেম তোর কোড অনুযায়ী) */}
      <header className="bg-white/80 backdrop-blur-xl px-4 sm:px-6 py-4 rounded-2xl sm:rounded-[2rem] shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4 sticky top-0 z-30">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div className="flex items-center gap-3 sm:gap-4">
            <button className="lg:hidden p-2.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors">
              <i className="fa-solid fa-bars text-sm"></i>
            </button>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 text-[#0F8FF0] rounded-xl hidden sm:flex items-center justify-center shadow-sm border border-blue-100 shrink-0">
              <i className="fa-solid fa-user-pen text-lg sm:text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black font-merriweather text-gray-900 leading-tight">Edit Client</h1>
              <p className="text-[10px] sm:text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Update profile information</p>
            </div>
          </div>
          <img src="https://ui-avatars.com/api/?name=Sets+Tech&background=0F8FF0&color=fff" className="w-9 h-9 sm:hidden rounded-xl border border-gray-200 shadow-sm shrink-0" alt="Admin" />
        </div>

        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 sm:gap-5">
          <Link to="/clients" className="w-full sm:w-auto justify-center px-4 py-2.5 bg-gray-900 hover:bg-black text-white font-bold text-[10px] sm:text-xs uppercase tracking-widest rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95">
            <i className="fa-solid fa-arrow-left"></i> Back
          </Link>
          <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
          <div className="hidden sm:flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900 leading-tight">Admin Panel</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Sets Tech</p>
            </div>
            <img src="https://ui-avatars.com/api/?name=Sets+Tech&background=0F8FF0&color=fff" className="w-11 h-11 rounded-xl border-2 border-gray-100 shadow-sm shrink-0" alt="Admin" />
          </div>
        </div>
      </header>

      {/* মেইন ফর্ম সেকশন */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pr-1 sm:pr-2 pb-10 w-full custom-scrollbar">
        <form 
          id="editClientForm" 
          className="space-y-5 sm:space-y-6 max-w-4xl mx-auto"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* Photo Section */}
          <motion.div variants={pageTransition} className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-[24px] sm:rounded-[30px] p-5 sm:p-8 shadow-sm cute-card">
            <h2 className="text-lg sm:text-xl font-bold font-merriweather text-gray-900 mb-5 border-b border-gray-200/50 pb-4">
              <i className="fa-solid fa-image text-purple-600 mr-2"></i> Client Photo
            </h2>
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="relative group">
                <img id="client_preview" src={preview} className="w-28 h-28 sm:w-32 sm:h-32 rounded-[2rem] sm:rounded-[2.5rem] shadow-md object-cover border-4 border-white" alt="preview" />
                <label htmlFor="client_image" className="absolute bottom-1 right-1 w-10 h-10 bg-[#0F8FF0] text-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg cursor-pointer active:scale-95 transition-transform border-2 sm:border-4 border-white">
                  <i className="fa-solid fa-pen-to-square text-sm"></i>
                </label>
                <input type="file" id="client_image" className="hidden" accept="image/*" onChange={handleImageChange} />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm font-bold text-gray-700">Update Profile Picture</p>
                <p className="text-xs text-gray-400 mt-1">Leave blank to keep the current photo.</p>
              </div>
            </div>
          </motion.div>

          {/* Primary Details Section */}
          <motion.div variants={pageTransition} className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-[24px] sm:rounded-[30px] p-5 sm:p-8 shadow-sm cute-card">
            <h2 className="text-lg sm:text-xl font-bold font-merriweather text-gray-900 mb-5 border-b border-gray-200/50 pb-4">
              <i className="fa-solid fa-address-card text-[#0F8FF0] mr-2"></i> 1. Primary Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">Full Name *</label>
                <input type="text" name="name" value={client.name} onChange={handleChange} required className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl outline-none focus:border-[#0F8FF0]/50 focus:ring-2 focus:ring-[#0F8FF0]/20 text-sm font-bold transition-all shadow-sm" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">Company Name</label>
                <input type="text" name="company_name" value={client.company_name} onChange={handleChange} className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl outline-none focus:border-[#0F8FF0]/50 focus:ring-2 focus:ring-[#0F8FF0]/20 text-sm font-bold transition-all shadow-sm" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">Email Address *</label>
                <input type="email" name="email" value={client.email} onChange={handleChange} required className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl outline-none focus:border-[#0F8FF0]/50 focus:ring-2 focus:ring-[#0F8FF0]/20 text-sm font-bold transition-all shadow-sm" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">Phone Number</label>
                <input type="text" name="phone" value={client.phone} onChange={handleChange} className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl outline-none focus:border-[#0F8FF0]/50 focus:ring-2 focus:ring-[#0F8FF0]/20 text-sm font-bold transition-all shadow-sm" />
              </div>
            </div>
          </motion.div>

          {/* Additional Info Section */}
          <motion.div variants={pageTransition} className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-[24px] sm:rounded-[30px] p-5 sm:p-8 shadow-sm cute-card">
            <h2 className="text-lg sm:text-xl font-bold font-merriweather text-gray-900 mb-5 border-b border-gray-200/50 pb-4">
              <i className="fa-solid fa-map-location-dot text-green-600 mr-2"></i> 2. Additional Information
            </h2>
            <div>
              <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">Address & Notes</label>
              <textarea name="notes" rows="4" value={client.notes} onChange={handleChange} className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 text-sm font-bold transition-all shadow-sm resize-none"></textarea>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={pageTransition} className="pt-2 pb-8 flex justify-end">
            <button type="submit" className="w-full sm:w-auto justify-center px-8 py-4 bg-[#0F8FF0] text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:bg-[#0d7ed4] active:scale-[0.98] sm:hover:-translate-y-1 transition-all duration-300 flex items-center gap-3">
              <i className="fa-solid fa-cloud-arrow-up"></i> Update Client Record
            </button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
};

export default EditClient;