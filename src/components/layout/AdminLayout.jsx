import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const AdminLayout = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  // ১. ইনভয়েস পেজ ডিটেক্ট করার সলিড লজিক
  const isInvoicePage = location.pathname.split('/').includes('invoice');

  // ২. তোর অরিজিনাল ওভারভিউ পেজ লিস্ট (কিচ্ছু বাদ দেওয়া হয়নি)
  const isOverviewPage = location.pathname.includes('clients/add') || 
                        location.pathname.includes('clients/edit') || 
                        location.pathname.includes('clients/view') ||
                        location.pathname.includes('projects/add') ||
                        location.pathname.includes('projects/view') ||
                        location.pathname.includes('projects/edit')||
                        location.pathname.includes('jobs/add')||
                        location.pathname.includes('jobs/view')||
                        location.pathname.includes('jobs/edit')||
                        location.pathname.includes('developers/add')||
                        location.pathname.includes('developers/edit');

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-inter">
      
      {/* ৩. সাইডবার হাইড লজিক (ইনভয়েস হলে রেন্ডারই হবে না) */}
      {!isInvoicePage && (
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      )}
      
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        
        {/* ৪. হেডার হাইড লজিক (ইনভয়েস এবং ওভারভিউ পেজে দেখাবে না) */}
        {!isInvoicePage && !isOverviewPage && (
          <div className="px-4 sm:px-6 lg:px-10 lg:pt-6 sm:pt-8"> 
             <Header setIsOpen={setIsOpen} /> 
          </div>
        )}

        {/* ৫. মেইন কন্টেন্ট এরিয়া - ইনভয়েস পেজ হলে সব প্যাডিং ও মার্জিন হাওয়া */}
        <main className={`flex-1 overflow-x-hidden overflow-y-auto ${
          isInvoicePage 
          ? 'p-0 m-0 bg-white z-[100]' // p-0 m-0 মানে কোনো গ্যাপ থাকবে না
          : 'px-4 sm:px-6 lg:px-10 py-4 mt-2 pb-32 lg:pb-10'
        }`}>
          <div className={`${isInvoicePage ? 'w-full h-full' : 'max-w-[1600px] mx-auto w-full'}`}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;