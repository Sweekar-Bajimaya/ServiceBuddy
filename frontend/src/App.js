import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import HomePage from './components/Homepage';
import ProviderList from './components/providers/ProviderList';
import MyBookings from './components/requests/MyBookings';
import ServiceRequestCreate from './components/requests/ServiceRequestCreate';
import BillGeneration from './components/bills/BillGeneration';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes (example approach) */}
        <Route path="/providers" element={<ProviderList />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/request-service" element={<ServiceRequestCreate />} />
        <Route path="/generate-bill" element={<BillGeneration />} />

        {/* Default redirect to Homepage */}
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;