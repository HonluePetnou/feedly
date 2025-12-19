# Feedly - Google Play Monitoring & AI Analysis System

## 📋 Project Overview

**Feedly** is a comprehensive solution designed to monitor Google Play Store applications, analyze user feedback using advanced AI, and provide actionable insights through a modern dashboard. It combines automated scraping, intelligent sentiment analysis, and a RAG (Retrieval-Augmented Generation) chatbot to help product owners and developers understand user sentiment and improve their apps.

## 🚀 Key Features

- **🔍 Automated Scraping**: real-time collection of reviews and ratings from the Google Play Store for target applications.
- **🧠 AI-Powered Analysis**:
  - **Sentiment Analysis**: Automatically classifies reviews as Positive (🟢), Negative (🔴), or Neutral (⚪).
  - **Categorization**: Groups reviews into categories (e.g., Bugs, UI/UX, Feature Requests) using **Google Gemini**.
- **📊 Interactive Dashboard**:
  - Visual analytics with charts and graphs.
  - Detailed app performance metrics.
  - Real-time review feeds.
- **🤖 RAG Chatbot**: Conversational interface to query your data (e.g., "What are users saying about the latest update?").
- **⚡ Asynchronous Pipeline**: Scalable ETL architecture using Celery and Redis for handling large volumes of data.

---

## 🏗️ System Architecture

The project is divided into three main components:

1.  **Backend (API & Pipeline)**:
    - Build with **FastAPI**.
    - Handles API requests from the frontend.
    - Manages the **ETL Pipeline** (Extract, Transform, Load) for scraping reviews.
    - Uses **Celery** and **Redis** for background tasks.
2.  **AI Engine**:
    - An independent microservice that polls the database for unprocessed reviews.
    - Uses **Google Generative AI** to analyze text and update the database with sentiment and categories.
3.  **Frontend (Dashboard)**:
    - A modern web application built with **Next.js 16** and **React 19**.
    - Styled with **Tailwind CSS 4** for a premium user experience.

---

## 🛠️ Technology Stack

### **Backend**

- **Framework**: FastAPI (Python 3.10+)
- **Database**: PostgreSQL (via SQLAlchemy)
- **Scraping**: Google Play Scraper
- **AI/LLM**: Google Generative AI (Gemini), LangChain (potential usage for RAG)
- **Task Queue**: Celery, Redis
- **Auth**: Python-Jose (JWT), Passlib

### **Frontend**

- **Framework**: Next.js 16 (App Router)
- **Library**: React 19
- **Styling**: Tailwind CSS 4, Lucide React (Icons)
- **State Management**: Zustand
- **Form Handling**: React Hook Form, Zod
- **Charts**: Recharts

### **DevOps & Tools**

- **Containerization**: Docker (recommended for Redis/DB)
- **Version Control**: Git

---

## ⚙️ Installation & Setup

Follow these steps to set up the project locally.

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL
- Redis Server (for Celery tasks)

### 1. Backend Setup

Navigate to the `backend` directory:

```bash
cd backend
```

Create a virtual environment and activate it:

```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Set up environment variables:
Create a `.env` file in `backend/` and configure your database and API keys:

```ini
DATABASE_URL=postgresql://user:password@localhost/feedly_db
GOOGLE_API_KEY=your_gemini_api_key
SECRET_KEY=your_secret_key
ALGORITHM=HS256
```

Initialize the database and run the server:

```bash
# This usually happens automatically on startup in main.py, otherwise run migrations
python src/main.py
# Or run with uvicorn directly
uvicorn src.api:app --reload
```

### 2. AI Engine Setup

The AI Engine needs to run separately to process reviews.

Navigate to the `ai-engine` directory (if separate) or run from root if integrated (check implementation). Assuming it's in `ai-engine`:

```bash
cd ai-engine
# Ensure dependencies are installed (may share with backend or have its own)
# Create a .env file similar to backend if needed
```

Run the AI Engine worker:

```bash
python src/main.py
```

### 3. Frontend Setup

Navigate to the `frontend` directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
# or
yarn install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🚦 Usage Workflow

1.  **Add an App**: Go to the dashboard and add a Google Play app ID (e.g., `com.whatsapp`).
2.  **Start Scraping**: Trigger the scraper via the dashboard or API to fetch reviews.
3.  **AI Processing**: The **AI Engine** will pick up new reviews, analyze them, and tag them with sentiment.
4.  **Visualize**: Refresh the dashboard to see updated charts and insights.
5.  **Chat**: Use the Chatbot page to ask questions about the collected data.

---

## 📂 Project Structure

```
feedly-main/
├── ai-engine/          # AI processing logic (Sentiment, Categories)
│   └── src/
│       ├── analyzer.py # Logic for communicating with Gemini
│       └── main.py     # Main loop for processing reviews
├── backend/            # FastAPI Backend
│   ├── src/
│   │   ├── api.py      # API Entry point
│   │   ├── pipeline/   # ETL Pipeline
│   │   ├── routers/    # API Routes (Auth, Chat, Apps)
│   │   └── scraper/    # Google Play Scraper module
│   └── requirements.txt
├── frontend/           # Next.js Frontend
│   ├── src/
│   │   ├── app/        # App Router pages
│   │   ├── components/ # Reusable UI components
│   │   └── lib/        # Utilities
│   └── package.json
└── docs/               # Project documentation (Diagrams, Specs)
```

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.
