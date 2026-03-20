# Talky

Talky is a real-time communication platform that enables users to connect through video calls, messaging, and live interactions. It is built using a modern full-stack architecture with real-time capabilities powered by WebSockets.


## Features

- 🔐 User Authentication (JWT-based)
- 📹 Real-time Video Calling
- 💬 Instant Messaging
- ⚡ Real-time communication using Socket.IO
- 🌐 Responsive UI with modern design
- 🍪 Secure session handling using cookies
- 🔄 Live connection updates (join/leave events)


## Tech Stack

**Client:** React (Vite),Material UI (MUI),React Router,Socket.IO Client,CSS

**Server:** Node.js,Express.js,MongoDB (Mongoose),Socket.IO,JWT Authentication,bcrypt (Password hashing)


## Run Locally

### 🔧 Prerequisites

Make sure you have installed:

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas)

---


Clone the project

```bash
  git clone https://github.com/Coder-Anindita/talky-video-call.git
```


### ⚙️ Setup Backend

```bash
  cd backend
  npm install
```

Create a .env file inside the backend/ folder and add the following:

```bash
    PORT=3000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_secret_key
    CLIENT_URL=http://localhost:5173
```
Start the backend server:

```bash
  npm run dev
```

## 🎨 Setup Frontend

```bash
    cd frontend
    npm install
    npm run dev
```
## 🌍 Access the Application
- Frontend: http://localhost:5173
- Backend: http://localhost:3000


## 🌍 Environment Switching
Ensure your frontend is configured to use the local backend:

```bash
    let IS_PROD = true;

    const server = IS_PROD
    ? "https://talkybackend.onrender.com"
    : "http://localhost:3000";

    export default server;
```

## 🌐 Live Demo

🚀 Experience the app live:

- 🔗 Frontend: https://talkyfrontend.onrender.com

- 🔗 Backend API: https://talkybackend.onrender.com

⚠️ Note: Backend may take a few seconds to wake up (free hosting on Render).


## Authors
Anindita Chakraborty
[@Coder-Anindita](https://www.github.com/Coder-Anindita)

