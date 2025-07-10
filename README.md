# 🛍️ ThriftWorld – Global Marketplace for Second-Hand & New Products

ThriftWorld is a real-time marketplace web application designed to let users from anywhere in the world post both used and new products, connect with potential buyers, and chat directly — no middleman, no online payment. Whether you're decluttering your closet or hunting for a deal, ThriftWorld helps make the exchange smooth, social, and secure.


<img width="1920" height="3370" alt="screencapture-thriftwebsite-fly-dev-2025-07-10-15_16_58" src="https://github.com/user-attachments/assets/a423fdd7-52d4-48d1-9d06-7e75bf7b274b" />


## 🚀 Features

- **🔐 User Authentication** via Clerk (OAuth & JWT)
- **📩 Real-Time Messaging** using Socket.IO
- **📬 Email Notifications** (via Nodemailer) when users receive new messages
- **🧵 Product Listings** with image, description, and price
- **🔍 Search Functionality** to find any product
- **🏷️ Users can mark listings** as Available or Sold
- **🗃️ My Listings page** for sellers to manage their items
- **🚫 Report Item feature** to flag inappropriate or fraudulent listings
- **💬 Buyer-Seller Chat** to agree on pickup/delivery — no online payment
- **📱 Responsive UI** using Bootstrap 5

---

## 🧰 Tech Stack

### 🔧 Backend
- **Node.js** & **Express.js** – API server & route handling
- **Socket.IO** – Real-time messaging layer
- **Supabase PostgreSQL** – Cloud-based relational DB
- **Nodemailer** – Email notifications
- **Clerk** – Authentication (OAuth, session, user profiles)
- **Axios** – API communication

### 🎨 Frontend
- **React** (Vite)
- **Redux** – Global state management
- **Bootstrap 5** – Responsive, mobile-first UI
- **Socket.IO Client** – WebSocket messaging
- **Axios** – Data fetching

---

## 🌐 Live Demo

- 🟢 **Hosted on Fly.io**
- 🔗 [**https://thriftwebsite.fly.dev/**]

---

## 📦 Installation Guide

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/thriftworld.git
   cd thriftworld
Install Dependencies

Backend
bash
Copy
Edit
cd backend
npm install
Frontend
bash
Copy
Edit
cd frontend
npm install
Configure Environment Variables

🗂️ Backend .env file

env
Copy
Edit
PORT=4000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_service_role_or_anon_key
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_secret_key
CLERK_SECRET_KEY=your_clerk_backend_key
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password_or_app_password
FRONTEND_URL=http://localhost:3000
Run the App Locally

Start Backend
bash
Copy
Edit
cd backend
npm run dev
Start Frontend
bash
Copy
Edit
cd frontend
npm run dev
✨ Key User Flows
🛒 Post & Browse Products
Users can upload product images, descriptions, prices.

Visitors can search and filter available products.

💬 Real-Time Chat
Socket.IO enables instant one-on-one chat.

Users are notified via email when a new message is received.

No payment is done online — users chat and agree on collection or delivery.

🛠️ Manage Listings
Logged-in users can edit, delete, or mark their listings as Sold.

Reported listings are flagged for admin review.
