# E-Commerce Enterprise Platform

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/react-18.x-61dafb.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.x-blue.svg)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-3.x-38bdf8.svg)

Giải pháp Thương mại điện tử Doanh nghiệp toàn diện với giao diện khách hàng hiệu suất cao, hệ thống quản trị CMS mạnh mẽ, thông báo thời gian thực và xử lý thanh toán mô phỏng. Được xây dựng bằng các công nghệ web hiện đại để tối ưu hiệu suất và khả năng mở rộng.

## 📋 Yêu cầu hệ thống

- Node.js 16.x hoặc cao hơn
- npm 8.x hoặc cao hơn
- Git

## 🚀 Bắt đầu nhanh

### 1. Cài đặt dự án

```bash
# Clone dự án
git clone [đường-dẫn-đến-repository]

# Di chuyển vào thư mục dự án
cd e-commerce

# Cài đặt các dependencies
npm install --legacy-peer-deps
```

### 2. Chạy dự án

```bash
# Khởi động chế độ phát triển
npm run dev

# Build cho production
npm run build

# Xem trước bản build
npm run preview
```

### 3. Truy cập ứng dụng

- Ứng dụng sẽ chạy tại: [http://localhost:5173](http://localhost:5173)
- Trang quản trị: [http://localhost:5173/admin](http://localhost:5173/admin)

## 🔧 Xử lý sự cố

Nếu gặp lỗi về phiên bản package, hãy thử:

```bash
# Xóa node_modules và package-lock.json
rm -r -force node_modules
rm package-lock.json

# Cài đặt lại dependencies
npm install --legacy-peer-deps
```

## 🛠 Công nghệ sử dụng

- **Frontend:** React 18, Vite, TypeScript
- **Styling:** Tailwind CSS, Framer Motion, Lucide Icons
- **Quản lý state:** Zustand
- **Form:** React Hook Form
- **Biểu đồ:** Recharts
- **Định tuyến:** React Router v6

## 📝 Ghi chú phát triển

- Luôn chạy `npm run lint` trước khi commit code
- Tuân thủ quy ước đặt tên và cấu trúc thư mục
- Viết test cho các component và hàm mới

## 📄 Giấy phép

Dự án này được cấp phép theo giấy phép MIT - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 🙏 Cảm ơn

Cảm ơn bạn đã quan tâm đến dự án này! Nếu bạn thấy dự án hữu ích, hãy cho một ⭐ trên GitHub.

---

## 🚀 Tính năng chính

### 🛍️ Customer Storefront (Premium UX)
*   **Advanced Filtering:** Filter products by Price Range, Category, and Search.
*   **Smart Cart:** Persistent cart state (localStorage) with slide-out drawer.
*   **Multi-Step Checkout:** Seamless flow from Shipping -> Payment -> Confirmation.
*   **Payment Simulation:** Mock integration for Credit Card (Stripe-like) flows.
*   **Responsive Design:** Mobile-first architecture using Tailwind CSS.

### 💼 Admin CMS (Enterprise)
*   **Dashboard Analytics:** Revenue charts, Sales trends, and Visitor stats using `Recharts`.
*   **Product Management:** Full CRUD (Create, Read, Update, Delete) with Modal forms.
*   **Data Tables:** Clean, paginated views for inventory management.
*   **Role-Based Access:** Protected routes ensuring only Admins can access the CMS.

### ⚡ Real-Time & Systems
*   **Notification Engine:** Global Toast system for alerts (Success, Error, Info).
*   **Event Simulation:** Simulates "Live" orders coming in every 30s to demonstrate WebSocket capabilities.
*   **State Management:** Powered by `Zustand` for atomic, performance-optimized state.

---

## 🛠 Tech Stack

| Domain | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, TypeScript |
| **Styling** | Tailwind CSS, Framer Motion, Lucide Icons |
| **State** | Zustand (Persist Middleware) |
| **Forms** | React Hook Form |
| **Charts** | Recharts |
| **Routing** | React Router v6 |
| **Backend (Mock)** | LocalStorage Service Layer (Simulating REST API) |

---

## 📦 Project Structure

```plaintext
src/
├── components/
│   ├── ui/             # Core Design System (Button, Card, Toast, Modal)
│   └── ...
├── features/           # (Planned) Domain specific logic
├── layouts/            # MainLayout (Store), AdminLayout (CMS)
├── pages/
│   ├── admin/          # Dashboard, Products, Analytics
│   └── ...             # Shop, ProductDetail, Checkout, Login
├── services/           # Mock API Service Layer
├── store/              # Zustand Global Stores (Auth, Cart, UI)
└── types/              # TypeScript Interfaces
```

---

## ⚡ Getting Started

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Run Development Server**
    ```bash
    npm run dev
    ```

3.  **Explore the App**
    *   **Storefront:** [http://localhost:5173](http://localhost:5173)
    *   **Admin Panel:** [http://localhost:5173/admin](http://localhost:5173/admin)
    *   *Credentials:* `admin@eflyer.com` / `admin`

---

## 🔮 Future Roadmap

- [ ] **Backend Integration:** Replace Mock Service with Node.js/NestJS + PostgreSQL.
- [ ] **Real Payment:** Connect Stripe API keys.
- [ ] **User Profile:** Order history and address book.
- [ ] **CMS Content:** Blog and Banner management.

---

## 📄 License

MIT License.
