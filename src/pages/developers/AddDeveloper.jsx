import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHeader } from '../../components/layout/HeaderContext';
import { motion } from 'framer-motion';

const AddDeveloper = () => {
    const navigate = useNavigate();
    const { setHeaderData } = useHeader();
    
    // স্টেটস
    const [imagePreview, setImagePreview] = useState("https://ui-avatars.com/api/?name=New+Dev&background=e2e8f0&color=94a3b8&size=128");
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        skills: ''
    });

    useEffect(() => {
        setHeaderData({
            title: 'Add Developer',
            subtitle: 'Onboard a new team member',
            icon: 'fa-solid fa-user-plus'
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

    // এনিমেশন কনফিগ
    const cardVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.98 },
        visible: { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            transition: { type: "spring", stiffness: 400, damping: 30 } 
        }
    };

    return (
        <motion.div 
            initial="hidden" animate="visible" 
            className="flex-1 overflow-y-auto overflow-x-hidden pr-1 sm:pr-2 pb-10 w-full custom-scrollbar"
        >
            {/* ১. প্রফেশনাল হেডার */}
            <motion.header 
                variants={cardVariants}
                className="flex-shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white/80 backdrop-blur-xl border border-gray-100 rounded-[20px] sm:rounded-[24px] px-5 py-4 shadow-sm mb-6 gap-4 sticky top-0 z-30"
            >
                <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    <button className="lg:hidden p-2.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors">
                        <i className="fa-solid fa-bars text-sm"></i>
                    </button>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 text-blue-600 rounded-xl hidden sm:flex items-center justify-center shadow-sm border border-blue-200 shrink-0">
                        <i className="fa-solid fa-user-plus text-lg sm:text-xl"></i>
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-black font-merriweather text-gray-900 leading-tight">Add Developer</h1>
                        <p className="text-[10px] sm:text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Onboard a new team member</p>
                    </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 sm:gap-5">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="w-full sm:w-auto justify-center px-5 py-3 sm:py-2.5 bg-[#111827] hover:bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg transition-all flex items-center gap-2 active:scale-95"
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
                            <input type="text" name="name" required placeholder="e.g. John Doe" className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-sm font-bold text-gray-800 transition-all shadow-sm" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">Email Address (Login ID) *</label>
                            <input type="email" name="email" required placeholder="john@example.com" className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-sm font-bold text-gray-800 transition-all shadow-sm" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">Phone Number</label>
                            <input type="text" name="phone" placeholder="+44 123 456 7890" className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-sm font-bold text-gray-800 transition-all shadow-sm" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">Login Password *</label>
                            <input type="password" name="password" required placeholder="••••••••" className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-sm font-bold text-gray-800 transition-all shadow-sm" onChange={handleChange} />
                        </div>
                    </div>
                </motion.div>

                {/* Section 2: Professional Details */}
                <motion.div variants={cardVariants} className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-[24px] sm:rounded-[30px] p-5 sm:p-8 shadow-sm cute-card relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-bl-full -mr-6 -mt-6 pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>
                    <h2 className="text-lg sm:text-xl font-bold font-merriweather text-gray-900 mb-5 border-b border-gray-200/50 pb-4 relative z-10">
                        <i className="fa-solid fa-code text-purple-600 mr-2"></i> 2. Professional Details
                    </h2>
                    <div className="relative z-10">
                        <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">Core Skills (Comma Separated)</label>
                        <input type="text" name="skills" placeholder="Laravel, React, API Integration..." className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 text-sm font-bold text-gray-800 transition-all shadow-sm" onChange={handleChange} />
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
                            <input type="file" name="image" id="dev_image" className="hidden" accept="image/*" onChange={handleImageChange} />
                            <button 
                                type="button" 
                                onClick={() => document.getElementById('dev_image').click()}
                                className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-xs font-black uppercase tracking-widest rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
                            >
                                Choose Image
                            </button>
                            <p className="text-[10px] text-gray-400 font-bold mt-2">JPG, PNG or GIF. Max 2MB.</p>
                        </div>
                    </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div variants={cardVariants} className="pt-2 pb-8">
                    <button 
                        type="submit" 
                        className="w-full sm:w-auto sm:float-right justify-center px-10 py-4 bg-[#111827] text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:bg-blue-600 active:scale-95 sm:hover:-translate-y-1 transition-all duration-300 flex items-center gap-3"
                    >
                        <i className="fa-solid fa-plus-circle text-lg"></i> Create Developer
                    </button>
                    <div className="clear-both"></div>
                </motion.div>
            </form>
        </motion.div>
    );
};

export default AddDeveloper;