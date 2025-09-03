✅ README.md
markdown
Copy
Edit
# AutoPost AI - Mini Project

AutoPost AI is a mini project that uses AI to generate, schedule, and automate social media posts. It integrates Google Gemini API for content generation and Unsplash API for images.

## 🔧 Features
- AI-generated post content using Gemini API
- Random image selection from Unsplash
- Post scheduling system
- Clean UI with React frontend
- Node.js + Express backend

## 📁 Project Structure
autopost-ai/
├── backend/
│ └── server.js
├── frontend/
│ └── React app files
└── .env

bash
Copy
Edit

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/your-username/autopost-ai.git
cd autopost-ai
2. Install dependencies
bash
Copy
Edit
cd backend && npm install
cd ../frontend && npm install
3. Create .env files in backend/ and frontend/
ini
Copy
Edit
GEMINI_API_KEY=your_key_here
UNSPLASH_ACCESS_KEY=your_key_here
4. Run the project
bash
Copy
Edit
# Run backend
cd backend
npm start

# Run frontend
cd ../frontend
npm start