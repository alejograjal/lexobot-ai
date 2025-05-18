<div style="text-align:center;">
  <img src="LexoBot-AI.png" alt="alt text" height="300" width="300" />
</div>

# 🧠 LexoBot AI

LexoBot AI is an intelligent assistant designed to make it easy for residents and administrators of condominiums or residential communities to consult internal regulations and rules of coexistence. Powered by open-source artificial intelligence, it allows users to ask questions in natural language and receive fast, accurate, and user-friendly answers based on uploaded documents.

## 🚀 Key Features
- 📄 Upload of regulation documents restricted to superusers.
- 💬 Chat interface for users to ask questions naturally.
- 🧠 Natural Language Processing using open-source AI models.
- 🔐 Access control to protect sensitive content and admin features.
- 🏘️ Designed for all community sizes: small, medium, or large condominiums.

## 💼 Use Cases
- Residents asking about specific rules or policies.
- Admins automating frequently asked questions.
- Improving transparency and communication in residential communities.

## ⚙️ Suggested Tech Stack
- **Backend**: Python (FastAPI), Node.js, or similar.
- **Frontend**: React or Next.js.
- **AI**: Open-source LLMs such as Ollama, LangChain, LlamaIndex, etc.
- **Storage**: PostgreSQL, SQLite, or MongoDB.
- **Deployment**: Docker + VPS or cloud platforms.

## 🔧 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/alejograjal/lexobot-ai.git
cd lexobot-ai
```

### 2. Backend Setup
Make sure you have Python and FastAPI installed.

```bash
# Navigate backend
cd backend

# Create virtual environment and activate it
python3.11 -m venv .venv
source .venv/bin/activate

# Install backend dependencies
pip install -r requirements.txt

# Execute it
uvicorn app.main:app --reload
```

### 3. Frontend Setup
Ensure Node.js is installed.

```bash
# Install frontend dependencies
cd frontend
npm install
```

### 4. Deployment
Run the application using Docker.

```bash
docker-compose up --build
```

## 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
