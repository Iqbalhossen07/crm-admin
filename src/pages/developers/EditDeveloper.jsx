import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHeader } from '../../components/layout/HeaderContext';
import { motion } from 'framer-motion';

const EditDeveloper = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setHeaderData } = useHeader();
    
    // তোর PHP ডাটা অনুযায়ী ইনিশিয়াল স্টেট
    const [imagePreview, setImagePreview] = useState("https://ui-avatars.com/api/?name=Iqbal+Hossen&background=0D8ABC&color=fff&size=128");
    const [formData, setFormData] = useState({
        name: 'Iqbal Hossen', // ডামি ভ্যালু (পরে API থেকে আসবে)
        email: 'iqbal@example.com',
        phone: '+880 1234 567890',
        password: '', // পাসওয়ার্ড ফাঁকা থাকবে
        skills: 'Laravel, React, API Integration',
        status: 'Active'
    });

    useEffect(() => {
        setHeaderData({
            title: 'Edit Developer',
            subtitle: 'Update team member details',
            icon: 'fa-solid fa-user-pen'
        });
    }, [setHeaderData]);

    // ইমেজ প্রিভিউ লজিক
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // এনিমেশন কনফিগ (তোর সেই ফাস্ট অ্যান্ড স্ন্যাপি ফিল)
    const cardVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.98 },
        visible: { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            transition: { type: "spring", stiffness: 450, damping: 30 } 
        }
    };

    return (
        <motion.div 
            initial="hidden" animate="visible" 
            className="flex-1 overflow-y-auto overflow-x-hidden pr-1 sm:pr-2 pb-10 w-full custom-scrollbar"
        >
            {/* ১. প্রিমিয়াম হেডার */}
            <motion.header 
                variants={cardVariants}
                className="flex-shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white/80 backdrop-blur-xl border border-gray-100 rounded-[20px] sm:rounded-[24px] px-5 py-4 shadow-sm mb-6 gap-4 sticky top-0 z-30"
            >
                <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    <button className="lg:hidden p-2.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors">
                        <i className="fa-solid fa-bars text-sm"></i>
                    </button>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 text-green-600 rounded-xl hidden sm:flex items-center justify-center shadow-sm border border-green-200 shrink-0">
                        <i className="fa-solid fa-user-pen text-lg sm:text-xl"></i>
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-black font-merriweather text-gray-900 leading-tight">Edit Developer</h1>
                        <p className="text-[10px] sm:text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Update team member details</p>
                    </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 sm:gap-5">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="w-full sm:w-auto justify-center px-5 py-3 sm:py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg transition-all flex items-center gap-2 active:scale-95"
                    >
                        <i className="fa-solid fa-arrow-left"></i> Back
                    </button>
                    <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
                    <div className="hidden sm:flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-sm font-bold text-gray-900 leading-tight">Admin Panel</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Sets Tech</p>
                        </div>
                        <img src="https://ui-avatars.com/api/?name=Sets+Tech&background=0D8ABC&color=fff" className="w-11 h-11 rounded-xl border-2 border-gray-100 shadow-sm shrink-0" alt="Admin" />
                    </div>
                </div>
            </motion.header>

            <form className="space-y-5 sm:space-y-6 max-w-4xl mx-auto mt-2" onSubmit={(e) => e.preventDefault()}>
                
                {/* Section 1: Account Details */}
                <motion.div variants={cardVariants} className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-[24px] sm:rounded-[30px] p-5 sm:p-8 shadow-sm cute-card relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full -mr-6 -mt-6 pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>
                    <h2 className="text-lg sm:text-xl font-bold font-merriweather text-gray-900 mb-5 border-b border-gray-200/50 pb-4 relative z-10">
                        <i className="fa-solid fa-id-card text-blue-600 mr-2"></i> 1. Account Details
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 relative z-10">
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">Full Name *</label>
                            <input type="text" name="name" value={formData.name} required onChange={handleChange} className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-[#0F8FF0]/10 text-sm font-bold text-gray-800 transition-all shadow-sm" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">Email Address *</label>
                            <input type="email" name="email" value={formData.email} required onChange={handleChange} className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-[#0F8FF0]/10 text-sm font-bold text-gray-800 transition-all shadow-sm" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">Phone Number</label>
                            <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-[#0F8FF0]/10 text-sm font-bold text-gray-800 transition-all shadow-sm" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">Change Password</label>
                            <input type="password" name="password" placeholder="Leave blank to keep current" onChange={handleChange} className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-[#0F8FF0]/10 text-sm font-bold text-gray-800 transition-all shadow-sm" />
                        </div>
                    </div>
                </motion.div>

                {/* Section 2: Professional & Status */}
                <motion.div variants={cardVariants} className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-[24px] sm:rounded-[30px] p-5 sm:p-8 shadow-sm cute-card relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-bl-full -mr-6 -mt-6 pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>
                    <h2 className="text-lg sm:text-xl font-bold font-merriweather text-gray-900 mb-5 border-b border-gray-200/50 pb-4 relative z-10">
                        <i className="fa-solid fa-code text-purple-600 mr-2"></i> 2. Professional & Status
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 relative z-10">
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">Core Skills</label>
                            <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="Laravel, React..." className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-[#0F8FF0]/10 text-sm font-bold text-gray-800 transition-all shadow-sm" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">Account Status</label>
                            <div className="relative">
                                <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-[#0F8FF0]/10 text-sm font-bold text-gray-800 transition-all shadow-sm appearance-none cursor-pointer">
                                    <option value="Active">Active (Can Login)</option>
                                    <option value="Inactive">Inactive (Access Revoked)</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500"><i className="fa-solid fa-chevron-down text-xs"></i></div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Section 3: Profile Image */}
                <motion.div variants={cardVariants} className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-[24px] sm:rounded-[30px] p-5 sm:p-8 shadow-sm cute-card relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-bl-full -mr-6 -mt-6 pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>
                    <h2 className="text-lg sm:text-xl font-bold font-merriweather text-gray-900 mb-5 border-b border-gray-200/50 pb-4 relative z-10">
                        <i className="fa-solid fa-image text-orange-600 mr-2"></i> 3. Profile Image
                    </h2>
                    
                    <div className="relative z-10 flex items-center gap-6">
                        <img src={imagePreview} className="w-24 h-24 rounded-2xl shadow-sm object-cover border-2 border-white bg-gray-100" alt="Preview" />
                        <div>
                            <input type="file" name="image" id="edit_image" className="hidden" accept="image/*" onChange={handleImageChange} />
                            <button 
                                type="button" 
                                onClick={() => document.getElementById('edit_image').click()}
                                className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-xs font-black uppercase tracking-widest rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
                            >
                                Change Image
                            </button>
                            <p className="text-[10px] text-gray-400 font-bold mt-2">Leave empty to keep current image.</p>
                        </div>
                    </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div variants={cardVariants} className="pt-2 pb-8">
                    <button 
                        type="submit" 
                        className="w-full sm:w-auto sm:float-right justify-center px-8 py-4 bg-[#111827] text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:bg-green-600 active:scale-95 sm:hover:-translate-y-1 transition-all duration-300 flex items-center gap-3"
                    >
                        <i className="fa-solid fa-save text-lg"></i> Save Changes
                    </button>
                    <div className="clear-both"></div>
                </motion.div>
            </form>
        </motion.div>
    );
};

export default EditDeveloper;