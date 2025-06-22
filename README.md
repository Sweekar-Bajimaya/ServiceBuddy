# ServiceBuddy

ServiceBuddy is a full-stack web application that connects users with local service providers such as electricians, plumbers, and home appliance technicians. It simplifies the process of finding trusted professionals and empowers local technicians with visibility and job opportunities.

## 🔧 Features

- 🔐 User & Technician Registration with Role-Based Access Control
- 📍 Location-Based Technician Recommendations
- 📅 Appointment Booking with Availability Scheduling
- ⭐ User Reviews and Rating System
- 💸 Automated Billing System with Email Integration
- 🔔 Real-Time Notifications for Service Updates
- 🛠 Admin Dashboard for Platform Oversight

## 🧠 Project Objectives

- Simplify hiring of local home repair professionals.
- Improve transparency and trust through reviews and verification.
- Empower technicians with a platform to manage appointments and feedback.
- Create a scalable, user-friendly service management system.

## 🖥️ Technologies Used

### Frontend
- **React.js**
- **Material UI (MUI)**

### Backend
- **Python**
- **Django**
- **Django REST Framework**
- **Django Channels** for WebSocket support

### Database
- **MongoDB**

### Real-Time & Other Tools
- **Redis** (for notifications)
- **SMTP** (email integration for OTPs and bills)
- **WebSockets**

## 🧪 Subsystems Overview

1. **User Management System (UM)**  
   Handles user registration, authentication, role management, password recovery, and session control.

2. **Service Management System (SM)**  
   Lets service providers list services and manage requests. Users can browse, request, and provide reviews.

3. **Billing System (BS)**  
   Automatically generates bills after service completion and emails them to users and providers.

4. **Notification System (NS)**  
   Sends real-time updates and email alerts for actions like bookings, approvals, and billing.

## 🧭 How to Run the Project

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/ServiceBuddy.git
   cd ServiceBuddy

2. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   python manage.py runserver

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start

3. **Database**
   - Ensure MongoDB is running locally or use a MongoDB Atlas URI.

4. **Environment Variables**
   - Configure .env files for backend and frontend with your SMTP settings, MongoDB URI, and Redis config.

## 📸 Screenshots
![image](https://github.com/user-attachments/assets/7ca2a5e5-d820-49b2-ab51-20bdc05ff123)
![image](https://github.com/user-attachments/assets/f84630bc-025c-410c-bcec-9e1335464d9b)
![image](https://github.com/user-attachments/assets/be5dedd5-37cd-4e4a-a310-cedd4e34aa65)
![image](https://github.com/user-attachments/assets/01dc6e1c-d99d-4c7c-96a8-596208cef289)
![image](https://github.com/user-attachments/assets/6961d9b3-c2b6-44b0-9dd4-6c71488a03ab)
![image](https://github.com/user-attachments/assets/441e5920-aafc-4930-8dbb-e89d268c7b9f)



