import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import HomePage from './components/Homepage';
import ProviderList from './components/providers/ProviderList';
import MyBookings from './components/requests/MyBookings';
import ServiceRequestCreate from './components/requests/ServiceRequestCreate';
import BillGeneration from './components/bills/BillGeneration';
import ServicesPage from './components/Servicepage';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import ProviderRequests  from './components/providers/ProviderRequest';
import ProviderDashboard from './components/providers/ProviderDashboard';
import ProviderRoute from './components/providers/ProviderRoute';
import AdminDashboard from './components/Admin/AdminDashboard';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Routes (example approach) */}
        <Route path="/providers" element={<ProviderList />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/request-service" element={<ServiceRequestCreate />} />
        <Route path="/generate-bill" element={<BillGeneration />} />
        <Route path="/services" element={<ServicesPage />}/>
        <Route path="/provider-requests" element={<ProviderRequests />} />
        <Route element={<ProviderRoute />}>
          <Route path="/provider-dashboard" element={<ProviderDashboard />} />
        </Route>
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        

        {/* Default redirect to Homepage */}
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;