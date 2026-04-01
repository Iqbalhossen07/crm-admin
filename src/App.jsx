import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { HeaderProvider } from "./components/layout/HeaderContext";

// Layout & Auth
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Login from "./pages/Login/Login";

// Pages
import Dashboard from "./pages/Dashboard";
import ClientList from "./pages/clients/ClientList";
import AddClient from "./pages/clients/AddClient";
import ClientOverview from "./pages/clients/ClientOverview";
import EditClient from "./pages/clients/EditClient";
import ProjectList from "./pages/projects/ProjectList";
import AddProject from "./pages/projects/AddProject";
import EditProject from "./pages/projects/EditProject";
import ProjectOverview from "./pages/projects/ProjectOverview";
import Invoice from "./pages/payments/Invoice";
import JobList from "./pages/jobs/JobList";
import AddJob from "./pages/jobs/AddJob";
import JobOverview from "./pages/jobs/JobOverview";
import EditJob from "./pages/jobs/EditJob";
import PaymentLedger from "./pages/PaymentLedger";
import DeveloperList from "./pages/developers/DeveloperList";
import AddDeveloper from "./pages/developers/AddDeveloper";
import EditDeveloper from "./pages/developers/EditDeveloper";
import DeveloperProfile from "./pages/developers/DeveloperProfile";
import Account from "./pages/Account/Account";

function App() {
  return (
    <HeaderProvider>
      <Router>
        <Routes>
          {/* ১. পাবলিক রাউট: লগইন পেইজ (লেআউট ছাড়া) */}
          <Route path="/login" element={<Login />} />

          {/* ২. প্রোটেক্টেড রাউটস: এই অংশটুকু টোকেন ছাড়া দেখা যাবে না */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<AdminLayout />}>
              {/* ইনডেক্স রাউট হিসেবে ড্যাশবোর্ড */}
              <Route index element={<Dashboard />} />

              {/* Clients Routes */}
              <Route path="clients" element={<ClientList />} />
              <Route path="clients/add" element={<AddClient />} />
              <Route path="clients/view/:id" element={<ClientOverview />} />
              <Route path="clients/edit/:id" element={<EditClient />} />

              {/* Projects Routes */}
              <Route path="projects" element={<ProjectList />} />
              <Route path="projects/add" element={<AddProject />} />
              <Route path="projects/edit/:id" element={<EditProject />} />
              <Route path="projects/view/:id" element={<ProjectOverview />} />

              {/* Jobs Routes */}
              <Route path="jobs" element={<JobList />} />
              <Route path="jobs/add" element={<AddJob />} />
              <Route path="jobs/view/:id" element={<JobOverview />} />
              <Route path="jobs/edit/:id" element={<EditJob />} />

              {/* Payments Routes */}
              <Route path="payments" element={<PaymentLedger />} />

              {/* Developers Routes */}
              <Route path="developers" element={<DeveloperList />} />
              <Route path="developers/add" element={<AddDeveloper />} />
              <Route path="developers/edit/:id" element={<EditDeveloper />} />
              <Route
                path="developers/view/:id"
                element={<DeveloperProfile />}
              />

              {/* account */}

              <Route path="account" element={<Account />} />

              {/* Tasks - আপাতত স্ট্যাটিক হিসেবে রেখেছি */}
              <Route
                path="tasks"
                element={
                  <div className="p-10 font-bold bg-white rounded-3xl border tracking-tight">
                    Tasks Section Loading...
                  </div>
                }
              />
            </Route>
          </Route>

          {/* ৩. আলাদা রাউট (লেআউটের বাইরে): ইনভয়েস জেনারেটর */}
          <Route path="payments/invoice/:id" element={<Invoice />} />

          {/* ৪. ভুল কোনো ইউআরএল দিলে অটোমেটিক ড্যাশবোর্ডে বা লগইনে পাঠাবে */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </HeaderProvider>
  );
}

export default App;
