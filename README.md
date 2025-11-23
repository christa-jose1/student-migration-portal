# 🌍 Student Migration Portal
*A comprehensive web application designed to assist students in managing study abroad and migration processes.*

---

## 🚀 Core Features

### 🔐 Admin Panel
| Module | Description |
|--------|-------------|
| 👤 User Management | Monitor login activities & manage user accounts |
| 🎓 Course Management | Add, delete & upload university courses |
| 🔑 Role Management | Switch roles between Admin ↔ User |
| 📝 Content Moderation | Moderate forum posts & student discussions |
| 📂 Resource Management | Upload/remove country-specific study guides |
| ❓ FAQ Management | Add/delete frequently asked questions |

### 👥 User Interface
| Feature | Description |
|--------|-------------|
| 🤖 AI Chatbot | Query handling & instant student support |
| 💬 Real-time Private Chat | One-to-one messaging between users |
| 🏫 University Explorer | Explore universities with course & requirement details |
| 🌍 Community Forum | Create posts, comment & engage in discussions |
| 📘 Resource Center | Download university requirement documents |
| ❓ FAQ Section | Access frequently asked questions instantly |
| ⛅ Weather Integration | Live weather for university destination cities |

---

## 🛠️ Tech Stack

### 🎨 Frontend
- ⚡ React (Vite)
- 🟦 TypeScript
- 🎨 Tailwind CSS

### 🖥️ Backend
- 🟩 Node.js
- 🚀 Express.js

### 🔒 Authentication
- 🔑 Firebase Authentication

### 🗄️ Database
- 🍃 MongoDB

### 🌐 Third-Party APIs
- 💬 Chatbase Chatbot (Embed Integration)
- 🌦️ OpenWeatherMap API



---

## Installation & Setup

### Prerequisites
Ensure you have Node.js and npm installed on your system.

### Clone the Repository

```bash
git clone https://github.com/christa-jose1/student-migration-portal.git
cd student-migration-portal
```

### Backend Setup

```bash
cd server
npm install
npm run dev
```

### Frontend Setup

```bash
cd ../client
npm install
npm run dev
```

### Environment Variables

**Server Configuration** (`.env`)

```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
SMTP_USER=your_email
SMTP_PASS=your_password
```

**Client Configuration** (`.env`)

```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_WEATHER_API_KEY=your_weather_api_key
```

---

## Screenshots

### Authentication & Home

**Login Page**

![Login Page](https://github.com/user-attachments/assets/c938f302-7d49-4e10-8aa1-24fbd93c6f9a)

**Home Page**

![Home Page](https://github.com/user-attachments/assets/0dc3edde-ede2-4f94-b235-844b581432c5)

<details>
<summary><strong>Additional Home Page Screenshots</strong></summary>

![Home Page Extended](https://github.com/user-attachments/assets/5aca876c-a2f8-4010-8df8-041530f481cc  )
![](https://github.com/user-attachments/assets/2d1c0509-747d-47d0-95c8-8fc857ab9892)
![Landing Page](https://github.com/user-attachments/assets/046e5795-07c8-4fac-911f-9ea866ba64d5)



</details>

### Communication Features

**Private Messaging**

![Private Chat](https://github.com/user-attachments/assets/d92db5d0-7e7a-49f1-9b03-9f2e1b69b959)


**Community Forum**

![Community Forum](https://github.com/user-attachments/assets/fa94aa59-1ace-4ef2-9b35-255270ad0ec9)


### University Exploration

**Countries & Courses**

![Country & Courses](https://github.com/user-attachments/assets/d7f5d061-0d6b-4363-a209-ed0f38e7f205)

<details>
<summary><strong>Additional Country Specific  Page Screenshots</strong></summary>

![Country Page Extended](https://github.com/user-attachments/assets/a268232d-138d-44e2-af9e-364ebe61ad34)

</details>

### Admin Dashboard

**User Management & Role Switching**

![User Management](https://github.com/user-attachments/assets/3eaf0642-c7cb-44fe-9baa-d6f8be08b147)

**Forum Moderation**

![Forum Moderation](https://github.com/user-attachments/assets/e5f7a8c8-9e35-4f22-8399-52f9485b92b3)

**University & Course Management**

![University Management](https://github.com/user-attachments/assets/3b23902c-681b-43f7-9e6d-82b61ad2abb8)

**Study Guide Management**

![Guide Management](https://github.com/user-attachments/assets/8a10f431-6f90-4ff0-9a20-af78d3d3563f)

**FAQ Management**

![FAQ Management](https://github.com/user-attachments/assets/bfbfd5c4-8add-4262-b218-7c218752be89)

📄 License

This project is licensed under the MIT License.

💡 Acknowledgements

Thanks to all open-source tools & APIs that power the platform.
