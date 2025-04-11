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
import ProviderRequests from './components/providers/ProviderRequest';
import ProviderDashboard from './components/providers/ProviderDashboard';
import ProviderRoute from './components/providers/ProviderRoute';
import AdminDashboard from './components/Admin/AdminDashboard';
import AddProvider from './components/Admin/AddProvider';
import AdminProvidersList from './components/Admin/AdminProviderList';
import VerifyEmail from './components/auth/VerifyEmail';
import ToastProvider from './components/common/ToastProvider';
import AboutUs from './components/AboutUs';
import ContactPage from './components/ContactPage';

import './App.css';

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/contact" element={<ContactPage />} />
          

          {/* Protected Routes */}
          <Route path="/providers" element={<ProviderList />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/request-service" element={<ServiceRequestCreate />} />
          <Route path="/generate-bill" element={<BillGeneration />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/provider-requests" element={<ProviderRequests />} />

          {/* Provider Protected Route */}
          <Route element={<ProviderRoute />}>
            <Route path="/provider-dashboard" element={<ProviderDashboard />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/add-provider" element={<AddProvider />} />
          <Route path="/providerslist" element={<AdminProvidersList />} />

          {/* Default Route to Homepage */}
          <Route path="/" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
