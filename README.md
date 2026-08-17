# 💬 LiveChat — Real-Time MERN Chat Application

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.io" />
  <img src="https://img.shields.io/badge/Chakra--UI-319795?style=for-the-badge&logo=chakra-ui&logoColor=white" alt="Chakra UI" />
</p>

<p align="center">
  A full-stack, real-time messaging web platform engineered with the <strong>MERN stack</strong> and <strong>Socket.IO WebSockets</strong>. Designed for high performance, bi-directional communication, robust authentication, and an intuitive user experience.
</p>

<p align="center">
  <a href="https://mern-stack-livechatapp.vercel.app" target="_blank"><strong>🚀 Live Demo</strong></a> •
  <a href="https://github.com/Af-Than/MERN-STACK-LIVECHATAPP/issues"><strong>Report Bug</strong></a> •
  <a href="https://github.com/Af-Than/MERN-STACK-LIVECHATAPP/issues"><strong>Request Feature</strong></a>
</p>

---

## 🌟 Key Highlights & Features

### ⚡ Real-Time Communication
- **Bidirectional WebSockets**: Instant message delivery with sub-100ms latency using Socket.IO.
- **Live Typing Indicators**: Real-time feedback showing when conversation partners are typing.
- **Audio & Visual Alerts**: Custom notification sound alerts and dynamic badge counters on incoming messages.

### 👥 Group & Direct Messaging
- **1-on-1 Direct Chats**: Private end-to-end user messaging conversations.
- **Full Group Chat Management**: Create groups, rename rooms, and add or remove members dynamically with admin-level role enforcement.
- **Dynamic User Search**: Debounced, regex-backed user search for discovering and initiating chats.

### 🔐 Security & Architecture
- **JWT (JSON Web Token) Authentication**: Stateless, cryptographically signed authentication stored securely.
- **Password Hashing**: Secure salt rounds via `bcryptjs` with pre-save Mongoose middleware hooks.
- **Protected Routes & Middleware**: Granular middleware authorization preventing unauthorized endpoint access.
- **CORS & Environment Isolation**: Configured origin whitelisting across multi-cloud deployments (Vercel + Render).

### 🎨 Modern UI/UX
- Responsive design tailored with **Chakra UI** and modern design tokens.
- **Cloudinary Integration**: Direct image upload for avatars and profile customization.
- Guest user credentials for 1-click evaluation by recruiters.

---

## 🛠️ Tech Stack & Architecture

### **Frontend**
- **Framework**: React.js (v19)
- **Component Library**: Chakra UI
- **Routing**: React Router DOM (v7)
- **HTTP Client**: Axios (configured with interceptors and base routing)
- **Real-Time Client**: Socket.IO Client
- **State Management**: React Context API

### **Backend**
- **Runtime**: Node.js
- **Server Framework**: Express.js
- **Database**: MongoDB Atlas (via Mongoose ODM)
- **WebSockets**: Socket.IO Server
- **Security**: JSON Web Tokens (JWT), bcryptjs, CORS
- **Media Storage**: Cloudinary CDN

---

## 📂 Project Architecture

```plaintext
MERN-STACK-LIVECHATAPP/
├── backend/
│   ├── config/             # DB connection & token generation
│   ├── controllers/        # Route controllers (user, chat, message)
│   ├── middleware/         # Auth verification & error handlers
│   ├── models/             # Mongoose schemas (User, Chat, Message)
│   ├── routes/             # Express API routes
│   └── server.js           # Server entry point & Socket.IO initialization
├── frontend/
│   ├── public/             # Static assets & HTML template
│   └── src/
│       ├── components/     # Reusable UI (Auth, Chats, Modals, User Items)
│       ├── config/         # Chat logic helper functions
│       ├── context/        # React Context for global state
│       ├── pages/          # Chat & Homepage view layouts
│       ├── App.js          # App component & routes
│       └── index.js        # React DOM entry point
└── package.json            # Root configuration & scripts
```

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.x or higher)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account or local MongoDB instance
- [Cloudinary](https://cloudinary.com/) account (optional, for image upload)

### 1. Clone the Repository
```bash
git clone https://github.com/Af-Than/MERN-STACK-LIVECHATAPP.git
cd MERN-STACK-LIVECHATAPP
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:3000
```

Create a `.env` file in the `frontend/` directory:
```env
REACT_APP_SERVER_URL=http://localhost:5000
REACT_APP_API_ENDPOINT=http://localhost:5000
```

### 3. Install Dependencies & Run

#### Backend:
```bash
npm install
npm run dev
```

#### Frontend:
```bash
cd frontend
npm install
npm start
```

Your app should now be running locally at `http://localhost:3000` with the backend server active at `http://localhost:5000`.

---

## 🌐 Deployment Overview

| Layer | Provider | Status |
| :--- | :--- | :--- |
| **Frontend** | [Vercel](https://vercel.com) | ![Vercel](https://img.shields.io/badge/Deployed-000000?style=flat-square&logo=vercel&logoColor=white) |
| **Backend** | [Render](https://render.com) | ![Render](https://img.shields.io/badge/Deployed-46E3B7?style=flat-square&logo=render&logoColor=white) |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) | ![MongoDB](https://img.shields.io/badge/Cloud-4EA94B?style=flat-square&logo=mongodb&logoColor=white) |

---

## 👨‍💻 Author

**Afthan**
- **GitHub**: [@Af-Than](https://github.com/Af-Than)
- **Project Repository**: [MERN-STACK-LIVECHATAPP](https://github.com/Af-Than/MERN-STACK-LIVECHATAPP)

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
