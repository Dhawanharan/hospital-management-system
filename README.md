# Hospital Management System (SaaS)

An enterprise-grade, role-based Hospital Management System (HMS) built with the MERN stack (MongoDB, Express, React, Node.js) and TypeScript. 

This platform digitizes clinical workflows, allowing patients to book appointments, doctors to manage their queues and prescribe medicine, and administrators to oversee hospital operations through real-time analytics.

## 🚀 Tech Stack

### Frontend
- **Framework:** React 19 + Vite (TypeScript)
- **Routing:** React Router v6
- **Styling:** Tailwind CSS v3 + Shadcn/ui
- **State & Data Fetching:** Axios + Context API
- **Data Visualization:** Recharts
- **Document Generation:** jsPDF + html2canvas
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js (v22+)
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose ORM
- **Authentication:** JSON Web Tokens (JWT) + bcrypt
- **Language:** TypeScript

## 🏗 Architecture & Features

This project is structured as a **Monorepo** containing both the `client` and `server` directories. 

### Role-Based Access Control (RBAC)
The system enforces strict route protection and API middleware validation across four distinct roles:
1. **Admin:** Full access. Can register hospital staff (Doctors, Receptionists), manage departments, view global analytics, and oversee the patient registry.
2. **Doctor:** Can view their daily appointment queue, confirm bookings, append clinical notes to Medical Records, and issue digital prescriptions.
3. **Patient:** Can browse departments, book appointments with specific doctors, track appointment statuses, and download past prescriptions as PDFs.
4. **Receptionist:** Has front-desk capabilities to schedule and manage appointments on behalf of patients.

### Key Workflows
- **Appointment Lifecycle:** `Pending -> Confirmed -> Completed` (or `Cancelled`).
- **Electronic Medical Records (EMR):** Doctors capture symptoms, vitals, and diagnoses securely tied to a specific patient and appointment session.
- **PDF Generation:** Prescriptions are dynamically generated on the client side using `jsPDF` for instant patient downloads.
- **Analytics Dashboard:** The Admin portal aggregates database metrics into live visual charts.

---

## 💻 Local Development Setup

### Prerequisites
- Node.js (v22.11.0 or higher)
- MongoDB instance (Atlas cluster or local)

### 1. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```
Start the backend dev server:
```bash
npm run dev
```

### 2. Frontend Setup
```bash
cd client
npm install
```
Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000/api
```
Start the frontend dev server:
```bash
npm run dev
```

### 3. Initial Seeding
To access the system for the first time, you must create a master admin account. Run the database seeder:
```bash
cd server
npx tsx src/seeder.ts
```
*(Default credentials will be `admin@hms.com` / `admin123`)*

---

## 🌍 Production Deployment

This monorepo is configured for easy deployment on platforms like Vercel and Render.

### Backend (Render)
1. Create a New Web Service connected to this repository.
2. Set the **Root Directory** to `server`.
3. Set Build Command: `npm install && npm run build`
4. Set Start Command: `npm start`
5. Inject Environment Variables (`PORT`, `MONGO_URI`, `JWT_SECRET`).

### Frontend (Vercel)
1. Import this repository as a new Vite project.
2. Set the **Root Directory** to `client`.
3. Inject the `VITE_API_URL` environment variable pointing to your live Render backend URL.
4. Deploy.

---
*Built as a comprehensive portfolio piece demonstrating full-stack architecture, RESTful API design, and modern React patterns.*
