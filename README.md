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
- ⚛️ React 19 + TypeScript  
- 🎨 Tailwind CSS (custom themes)  
- ⚡ Vite for bundling  
- 🔗 React Router DOM  
- 🔌 Socket.IO client  
- 🤖 @google/generative-ai  

### **Backend**
- 🌐 Express.js (TypeScript)  
- 🔌 Socket.IO for real-time collaboration  
- 🌍 CORS + dotenv for configs  
- 🤖 @google/generative-ai  

---

## 📂 Project Structure

```bash
frontend/
│── src/
│   ├── components/   # UI components (toolbar, canvas, modals, etc.)
│   ├── hooks/        # Custom hooks
│   ├── utils/        # Helper & utility functions
│   ├── classes/      # OOP classes: Shape, Circle, Rectangle, Line, Diamond, Text, DrawingBrush
│   ├── history/      # HistoryManager & ShapeHistory (undo/redo)
│   ├── App.tsx
│   └── main.tsx
│── package.json

backend/
│── src/
│   ├── server.ts     # Express + Socket.IO server
│   ├── routes/       # API endpoints
│   ├── services/     # AI service integration (Gemini)
│   └── utils/        # Backend helpers
│── package.json

---

## 🚀 Getting Started

### 1️⃣ Clone Repository

git clone https://github.com/your-username/collaborative-uml-tool.git
cd collaborative-uml-tool

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

Open frontend (http://localhost:5173)

Start drawing shapes or UML diagrams

Use AI Tool to auto-generate UML class diagrams

Collaborate in real-time with multiple users

### 🔮 Future Roadmap

✅ Mobile & tablet responsive design

✅ Layering system for shapes

✅ Multiple shape selection & grouping

✅ Export canvas as image / PDF

✅ Cloud deployment for collaboration

### 🧑‍💻 Development (OOP Structure)

This project is structured in Object-Oriented Programming (OOP):

Shape (base class)

Circle, Rectangle, Line, Diamond, Text (inherit Shape)

DrawingBrush (freehand tool)

HistoryManager (undo/redo system)

ShapeHistory (stores shape states)

Utils & Helpers for reusable logic

Encapsulation, abstraction, and clean design principles are followed for scalability.

### 🤝 Contributing

Fork the project

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

```bash

