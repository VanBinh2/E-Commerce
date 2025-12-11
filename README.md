# Minimal Free Dashboard (PRO + ENTERPRISE)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/react-18.x-61dafb.svg)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-3.x-38bdf8.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg)

A high-performance, enterprise-grade SaaS Dashboard built with a **Minimal Free** design philosophy. This application combines a clean, whitespace-driven interface (inspired by Vercel/Linear) with powerful backend logic, designed for scalability from startups to large organizations.

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Preview](#-preview)
- [Architecture & Database](#-architecture--database)
- [Getting Started](#-getting-started)
- [Environment Configuration](#-environment-configuration)
- [Project Structure](#-project-structure)
- [Roadmap](#-roadmap)
- [License](#-license)

---

## 🚀 Features

### Core (Standard)
*   **Dashboard Analytics:** Interactive widgets for sales, revenue, and user growth.
*   **Project Management:** CRUD operations for projects with status tracking.
*   **Task Management:** Switchable views (Table / Kanban Board) for task handling.
*   **User Management:** Basic user profiles and directory.
*   **Clean UI:** Responsive design using TailwindCSS and Lucide Icons.

### 💎 PRO Features
*   **Real-time Updates:** Socket-based updates for task movements and notifications.
*   **Multi-role Access:** Granular control for Admin, Employee, and Customer roles.
*   **Advanced UX:** Skeletal loading states, smooth transitions (`fade-in`), and toast notifications.
*   **Data Export:** Export reports to CSV/PDF formats.

### 🏢 ENTERPRISE Features
*   **Audit Logging:** Complete history of user actions and system changes.
*   **System Health:** Real-time monitoring of API latency and server status.
*   **Permissions Matrix:** Complex role-based access control (RBAC) visualization.
*   **Queue Monitoring:** Visualizing background job processing status.

---

## 🛠 Tech Stack

*   **Frontend:** React 18 / Next.js
*   **Styling:** TailwindCSS, Shadcn UI (Concepts), Lucide React
*   **Charts:** Recharts
*   **Backend:** Node.js, Express (Rest API)
*   **Database:** MongoDB Atlas
*   **State Management:** React Hooks / Context / Redux (Optional)

---

## 📸 Preview

*(Place your screenshots here)*

| Dashboard | Kanban Board |
|:---:|:---:|
| ![Dashboard Placeholder](https://placehold.co/600x400?text=Dashboard+Preview) | ![Kanban Placeholder](https://placehold.co/600x400?text=Kanban+Preview) |

---

## 🏗 Architecture & Database

The system follows a Microservices-ready architecture pattern.

### MongoDB Connection

This project uses MongoDB Atlas. Configure your connection string in the `.env` file.

**Connection String:**
```bash
mongodb+srv://binhlienminhhuyenthoai_db_user:<db_password>@cluster0.qw9l05j.mongodb.net/?appName=Cluster0
```

> **⚠️ Important:** Replace `<db_password>` with your actual database user password. Ensure your IP address is whitelisted in MongoDB Atlas Network Access.

### Data Models
*   **Users:** Stores authentication, profiles, and RBAC roles.
*   **Products:** Inventory items with stock management.
*   **Orders:** Transactional data linking Users and Products.
*   **AuditLogs:** (Enterprise) Immutable records of system activities.

---

## ⚡ Getting Started

### Prerequisites
*   Node.js (v16 or higher)
*   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/minimal-free-dashboard.git
    cd minimal-free-dashboard
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory based on the example below:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Connection
# Replace <db_password> with your actual password
MONGO_URI=mongodb+srv://binhlienminhhuyenthoai_db_user:<db_password>@cluster0.qw9l05j.mongodb.net/?appName=Cluster0

# Security
JWT_SECRET=your_super_secret_key_change_this
```

---

## ▶️ Running the Application

### Development Mode
Runs both client (React) and mock server (if enabled) concurrently.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the client.

### Production Build

```bash
npm run build
npm start
```

---

## 📂 Project Structure

```plaintext
minimal-dashboard/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components (Card, Button, Drawer)
│   ├── pages/           # Route components (Dashboard, Products, Login)
│   ├── services/        # API calls (mockBackend.ts or axios setup)
│   ├── hooks/           # Custom React hooks (useAuth, useFetch)
│   ├── types/           # TypeScript interfaces
│   ├── utils/           # Helper functions
│   └── App.tsx          # Main entry point & Routing logic
├── server/              # Backend API (Node/Express)
│   ├── config/          # DB connection
│   ├── controllers/     # Route logic
│   ├── models/          # Mongoose Schemas
│   └── routes/          # API Endpoints
├── .env                 # Environment variables
└── README.md            # Project documentation
```

---

## 🗺 Roadmap

- [x] **v1.0:** Core Dashboard & User Auth.
- [x] **v2.0:** Enterprise Admin Panel & Role Management.
- [ ] **v2.5:** Dark Mode Support.
- [ ] **v3.0:** React Native Mobile App Integration.
- [ ] **v3.5:** AI-powered Analytics Predictions.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
