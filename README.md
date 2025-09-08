# 🌍 Student Migration Portal  

_A comprehensive web application designed to assist students with migration and study abroad processes._  

---

## 🚀 Features  

### 🛡️ **Admin Panel**
- 🧑‍💼 **User Management** – Monitor login activities & manage user accounts  
- 🎓 **Course Management** – Add, remove, and upload university courses  
- 🔑 **Role Management** – Switch roles between admin and regular user  
- 📝 **Content Moderation** – Moderate forum posts and discussions  
- 📂 **Resource Management** – Upload/remove country-specific guides  
- ❓ **FAQ Management** – Add & delete frequently asked questions  

### 🎓 **User Interface**
- 🤖 **AI Chatbot** – Chatbot for  queries
- 👥**Real_time Private chat** – Real-time private one to one chat between two people
- 🏫 **University Explorer** – Browse and explore universities with details  
- 💬 **Forum System** – Create posts, comment & engage in common  discussions  
- 📘 **Resource Center** – Download university requirement guides  
- ❓ **FAQ Section** – Access frequently asked questions  
- ⛅ **Weather Integration** – Live weather info for university locations  

---

## 🛠️ Technologies Used  

### 🎨 **Frontend**
- ⚡ React (Vite) – Modern framework for building UIs  
- 🟦 TypeScript – Type-safe JavaScript development  
- 🎨 Tailwind CSS – Utility-first responsive CSS framework  

### 🖥️ **Backend**
- 🟩 Node.js – JavaScript runtime environment  
- 🚀 Express.js – Fast, unopinionated Node.js web framework  

### 🔒 **Authentication**
- 🔑 Firebase Authentication – Secure login & authorization  

### 🗄️ **Database**
- 🍃 MongoDB – NoSQL database for flexible storage  

### 🌐 **APIs & Services**
- 💬 Chatbase Chatbot (Embed Integration) – AI-powered chatbot  
- 🌦️ OpenWeatherMap API – Weather data for university locations  

---

## ⚙️ Installation  


1️⃣ Clone the Repository  

git clone https://github.com/christa-jose1/student-migration-portal.git

cd student-migration-portal

2️⃣ Backend Setup

cd server
npm install

3️⃣ Frontend Setup

cd ../client
npm install

4️⃣ Environment Configuration

🔧 Server.env

MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
SMTP_USER=your_email
SMTP_PASS=your_password

🔧 Client .env

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_WEATHER_API_KEY=your_weather_api_key

