import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HeaderProvider } from './components/layout/HeaderContext';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/Dashboard';
import ClientList from './pages/clients/ClientList';
import AddClient from './pages/clients/AddClient';
import ClientOverview from './pages/clients/ClientOverview';
import EditClient from './pages/clients/EditClient';
import ProjectList from './pages/projects/ProjectList';
import AddProject from './pages/projects/AddProject';
import EditProject from './pages/projects/EditProject';
import ProjectOverview from './pages/projects/ProjectOverview';
import Invoice from './pages/payments/Invoice';
import JobList from './pages/jobs/JobList';
import AddJob from './pages/jobs/AddJob';
import JobOverview from './pages/jobs/JobOverview'; 
import EditJob from './pages/jobs/EditJob';
import PaymentLedger from './pages/PaymentLedger';
import DeveloperList from './pages/developers/DeveloperList';
import AddDeveloper from './pages/developers/AddDeveloper';
import EditDeveloper from './pages/developers/EditDeveloper';
import DeveloperProfile from './pages/developers/DeveloperProfile';

function App() {
  return (
    <HeaderProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            {/* বাকি সব পেজ এখানে আসবে */}
            <Route path="clients" element={<ClientList />} />
            <Route path="clients/add" element={<AddClient />} />
            <Route path="clients/view/:id" element={<ClientOverview />} />
            <Route path="clients/edit/:id" element={<EditClient />} />
            <Route path="projects" element={<ProjectList />} />
            <Route path="projects/add" element={<AddProject />} />
            <Route path="projects/edit/:id" element={<EditProject />} />
            <Route path="projects/view/:id" element={<ProjectOverview />} />
            <Route path="jobs" element={<JobList />} />
            <Route path='jobs/add' element={<AddJob />} />
            <Route path="jobs/view/:id" element={<JobOverview />} />
            <Route path='jobs/edit/:id' element={<EditJob />} />
             <Route path="payments" element={<PaymentLedger />} />
             <Route path="developers" element={<DeveloperList />} />
             <Route path="developers/add" element={<AddDeveloper />} />
             <Route path="developers/edit/:id" element={<EditDeveloper />} />
             <Route path="developers/view/:id" element={<DeveloperProfile />} />
            <Route path="projects" element={<div className="p-10 font-bold bg-white rounded-3xl border">Projects Loading...</div>} />
            <Route path="tasks" element={<div className="p-10 font-bold bg-white rounded-3xl border">Tasks Loading...</div>} />
            <Route path="payments" element={<div className="p-10 font-bold bg-white rounded-3xl border">Payments Loading...</div>} />
            <Route path="developers" element={<div className="p-10 font-bold bg-white rounded-3xl border">Developers Loading...</div>} />
          </Route>
            <Route path="payments/invoice/:id" element={<Invoice />} />

        </Routes>
      </Router>
    </HeaderProvider>
  );
}

export default App;