# 🎨 Collaborative UML Drawing Tool

A **real-time collaborative canvas application** built with **React (Vite + TypeScript)** and **Node.js (Express + Socket.IO)**.  
It allows users to **draw, edit, and collaborate** on shapes, UML diagrams, and custom canvases with **AI-powered UML generation** using the **Google Gemini API**.  

---

## ✨ Features

- 🖌 **Drawing Tools**
  - Circle, Rectangle, Diamond, Line  
  - Text tool, Freehand drawing brush  
  - Hand tool & Selection tool  
  - Eraser tool  

- 🎨 **Shape Management**
  - Lock & unlock shapes  
  - Edit attributes (color, stroke, size, text)  
  - Move & resize shapes  
  - Undo / Redo system with `HistoryManager`  
  - Shape layering system *(planned)*  
  - Grouping and multi-shape selection *(planned)*  

- 🌓 **Canvas Options**
  - Custom theme support  
  - Dark & Light mode  
  - Zooming functionality  

- 🤖 **AI Integration**
  - Generate **UML Class Diagrams** using **Gemini API**  

- ⚡ **Collaboration**
  - Real-time updates with **Socket.IO**  
  - Multiple users can draw/edit simultaneously  
  - *(Currently works locally, cloud deployment planned)*  

- 📱 **Upcoming Improvements**
  - Mobile & tablet responsive UI  
  - Shape grouping & advanced editing  
  - Better UI interface for interaction  

---

## 🛠 Tech Stack

### **Frontend**
- ⚛️ React + TypeScript  
- 🎨 CSS (custom themes)  
- ⚡ Vite for bundling  
- 🔌 Socket.IO client   

### **Backend**
- 🌐 Express.js (TypeScript)  
- 🔌 Socket.IO for real-time collaboration  
- 🌍 CORS + dotenv for configs  
- 🤖 @google/generative-ai  

---

## 📂 Project Structure

```bash
doodle-desk/
├── client/               # Front-end application
├── server/               # Back-end application
├── package.json          # For managing both (if using a monorepo setup)
└── README.md             # Project documentation

client/
├── node_modules/
├── public/
├── src/
│   ├── assets/           # Static assets like images and fonts
│   ├── classes/          # Class-based logic or utilities
│   ├── components/       # Reusable UI components
│   ├── display/          # Page-level components/views
│   ├── hooks/            # Custom React Hooks
│   ├── services/         # API calls and external services
│   ├── style/            # Global or theme-specific styles
│   ├── type/             # TypeScript definition files
│   ├── App.tsx           # Main application component
│   ├── index.css         # Global styles
│   └── main.tsx          # Entry point for the React application
├── package.json
└── ... other config files

server/
├── node_modules/
├── src/                  # Server source code (controllers, routes, models, etc.)
├── .env                  # Environment variables (IGNORED by .gitignore)
├── package.json          # Project dependencies and scripts
├── package-lock.json     # Specific dependency tree
├── tsconfig.json

```
---

## 🚀 Getting Started

### 1️⃣ Clone Repository

git clone https://github.com/NofilHafeez/doodle-desk.git
cd doodle-desk

### 2️⃣ Setup Frontend
cd client
npm install
npm run dev

### 3️⃣ Setup Backend
cd server
npm install
npm run dev


### 4️⃣ Environment Variables
PORT=5000
GEMINI_API_KEY=your_api_key_here

### 🖥 Usage

- Open frontend (https://doodledesk.vercel.app/)
- Start drawing shapes or UML diagrams
- Use AI Tool to auto-generate UML class diagrams
- Collaborate in real-time with multiple users

### 🔮 Future Roadmap

- ✅ Mobile & tablet responsive design
- ✅ Layering system for shapes
- ✅ Multiple shape selection & grouping
- ✅ Export canvas as image / PDF
- ✅ Cloud deployment for collaboration

### 🧑‍💻 Development (OOP Structure)

This project is structured in Object-Oriented Programming (OOP):
- Shape (base class)
- Circle, Rectangle, Line, Diamond, Text (inherit Shape)
- DrawingBrush (freehand tool)
- HistoryManager (undo/redo system)
- ShapeHistory (stores shape states)
- Utils & Helpers for reusable logic

### 🤝 Contributing
- Fork the project
- Create your feature branch (git checkout -b feature/AmazingFeature)
- Commit your changes (git commit -m 'Add AmazingFeature')
- Push to the branch (git push origin feature/AmazingFeature)
- Open a Pull Request


