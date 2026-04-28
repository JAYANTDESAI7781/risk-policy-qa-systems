# 🏦 Risk Sentinel — Banking Risk Policy Q&A System

![Project](https://img.shields.io/badge/Project-Major%20Project-blue)
![Python](https://img.shields.io/badge/Python-3.10%2B-green)
![React](https://img.shields.io/badge/React-18-61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688)
![Groq](https://img.shields.io/badge/AI-Groq%20%2B%20Llama%203.3-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

> An AI-powered Banking Risk Policy Question & Answer System that provides real-time risk analysis covering Indian and International banking regulations.

---

## 👥 Team Members

| Name | Enrollment No |
|------|--------------|
| Jayant Desai | EN22CS301464 |
| Satyam Kachhi | EN22CS301884 |
| Asif Mansoori | EN23CS3L1005 |

**Guide:** Mr. Ankit Gupta
**University:** Medicaps University, Indore
**Department:** Computer Science & Engineering

---

## 📌 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Indian Banking Laws Covered](#indian-banking-laws-covered)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Running the Backend](#running-the-backend)
- [Running the Frontend](#running-the-frontend)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [How It Works](#how-it-works)
- [Future Scope](#future-scope)

---

## 📖 About the Project

**Risk Sentinel** is a full-stack web application that allows users to ask banking risk-related questions and receive intelligent, structured risk analysis powered by AI.

The system analyzes queries against:
- 🇮🇳 **Indian Banking Laws** — RBI, SARFAESI, IBC, PMLA, FEMA, SEBI
- 🌍 **International Standards** — Basel III, Dodd-Frank, AML/KYC, FATF

Each response includes:
- Risk Level (LOW / MEDIUM / HIGH / CRITICAL)
- Risk Score (0–100)
- Risk Factors
- Policy Recommendations
- Regulatory References
- Indian Banking Context

---

## ✨ Features

- 🔍 **AI-Powered Q&A** — Ask any banking risk question in natural language
- 🇮🇳 **Indian Banking Focus** — Covers RBI, SARFAESI, IBC, PMLA and more
- 📊 **Risk Score Meter** — Animated 0–100 risk scoring with visual gauge
- 🎯 **Risk Level Badges** — Color-coded LOW / MEDIUM / HIGH / CRITICAL
- 📋 **Regulatory References** — Cites actual laws and circulars
- 📈 **Dashboard** — Overview of all queries with charts and statistics
- 📋 **Reports** — Filterable table of all analyses with CSV export
- ⚙️ **Settings** — Configurable thresholds, model selection, display options
- 🕐 **Query History** — Browse and revisit past analyses
- 🔐 **Secure** — API keys stored in `.env`, never exposed

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18 + Vite | User Interface |
| Backend | Python + FastAPI | REST API Server |
| AI Model | Groq API + Llama 3.3 70B | Risk Analysis Engine |
| HTTP Client | httpx | Async API calls |
| Data Validation | Pydantic | Request/Response validation |
| Server | Uvicorn | ASGI server |
| Secrets | python-dotenv | Environment variables |

---

## 🇮🇳 Indian Banking Laws Covered

| Law | Description |
|-----|-------------|
| RBI Act 1934 | Establishes RBI & monetary policy |
| Banking Regulation Act 1949 | Core law governing Indian banks |
| SARFAESI Act 2002 | NPA recovery without court intervention |
| IBC 2016 | Insolvency & Bankruptcy resolution |
| PMLA 2002 | Prevention of Money Laundering |
| FEMA 1999 | Foreign Exchange Management |
| SEBI Regulations | Capital markets & investment banking |
| KYC/AML RBI 2016 | Customer verification master directions |
| NPA Classification | 90-day default rule |
| Priority Sector Lending | 40% lending to priority sectors |
| CRR & SLR | Cash Reserve & Statutory Liquidity Ratio |
| PCA Framework | Prompt Corrective Action by RBI |
| UPI/RTGS/NEFT | Digital Payment regulations |

---

## 📁 Project Structure

```
risk-sentinel/
│
├── backend/                    # Python FastAPI Backend
│   ├── main.py                 # Main API server
│   ├── requirements.txt        # Python dependencies
│   ├── .env                    # API keys (NOT uploaded to GitHub)
│   └── .gitignore              # Git ignore rules
│
├── frontend/                   # React Frontend
│   ├── src/
│   │   └── App.jsx             # Main React component
│   ├── index.html              # HTML entry point
│   ├── package.json            # Node dependencies
│   └── vite.config.js          # Vite configuration
│
└── README.md                   # This file
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:
- Python 3.10+
- Node.js 18+
- A free Groq API key from [console.groq.com](https://console.groq.com)

---

## 🐍 Running the Backend

**Step 1 — Go to backend folder:**
```bash
cd backend
```

**Step 2 — Install dependencies:**
```bash
pip install -r requirements.txt
```

**Step 3 — Create `.env` file:**
```bash
# Create a file called .env in the backend folder
GROQ_API_KEY=your_groq_api_key_here
```

**Step 4 — Run the server:**
```bash
python main.py
```

✅ Backend runs at: `http://127.0.0.1:8000`

---

## ⚛️ Running the Frontend

**Step 1 — Go to frontend folder:**
```bash
cd frontend
```

**Step 2 — Install dependencies:**
```bash
npm install
```

**Step 3 — Start the app:**
```bash
npm run dev
```

✅ Frontend runs at: `http://localhost:5173`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API status check |
| GET | `/api/health` | Health check with model info |
| POST | `/api/query` | Process a risk query |

### POST /api/query

**Request Body:**
```json
{
  "query": "What is the credit risk exposure for NPA accounts under RBI guidelines?"
}
```

**Response:**
```json
{
  "answer": "Detailed risk analysis...",
  "risk_level": "HIGH",
  "risk_score": 72,
  "risk_factors": ["High NPA ratio", "Inadequate provisioning"],
  "recommendations": ["Increase provisioning", "Implement SARFAESI"],
  "regulatory_refs": ["RBI Master Circular on NPAs", "SARFAESI Act 2002"],
  "category": "Credit Risk",
  "confidence": 88,
  "indian_context": "Under RBI guidelines, NPA is classified after 90 days...",
  "timestamp": "2026-04-28T10:30:00",
  "query": "What is the credit risk exposure..."
}
```

---

## ⚙️ How It Works

```
User types question
        ↓
React Frontend (App.jsx)
        ↓ POST /api/query
FastAPI Backend (main.py)
        ↓ Sends to Groq API
Llama 3.3 70B AI Model
        ↓ Returns structured JSON
FastAPI parses & validates
        ↓
React displays results:
  • Risk Level Badge
  • Risk Score Meter
  • Risk Factors
  • Recommendations  
  • Regulatory References
  • Indian Banking Context
```

---

## 📊 Risk Level Classification

| Level | Score Range | Color | Meaning |
|-------|------------|-------|---------|
| LOW | 0 - 25 | 🟢 Green | Minimal risk, standard precautions |
| MEDIUM | 26 - 50 | 🟡 Yellow | Moderate risk, monitor closely |
| HIGH | 51 - 75 | 🟠 Orange | Significant risk, immediate action |
| CRITICAL | 76 - 100 | 🔴 Red | Severe risk, urgent intervention |

---

## 🔐 Security

- API keys are stored in `.env` file
- `.env` is listed in `.gitignore` — never uploaded to GitHub
- CORS is configured for local development
- No sensitive data is stored in the codebase

---

## 🔮 Future Scope

- [ ] Add PostgreSQL database for persistent storage
- [ ] User authentication and login system
- [ ] Fine-tuned model on actual RBI circulars and banking documents
- [ ] PDF upload — analyze risk from uploaded documents
- [ ] Email alerts for critical risk queries
- [ ] Multi-language support (Hindi, Gujarati)
- [ ] Mobile app using React Native
- [ ] Deploy on AWS / Azure cloud

---

## 📚 References

1. RBI Official Website — [rbi.org.in](https://rbi.org.in)
2. Basel III Framework — [bis.org](https://www.bis.org)
3. SARFAESI Act 2002 — Ministry of Finance, India
4. IBC 2016 — Insolvency and Bankruptcy Board of India
5. Groq API Documentation — [console.groq.com](https://console.groq.com)
6. FastAPI Documentation — [fastapi.tiangolo.com](https://fastapi.tiangolo.com)
7. React Documentation — [react.dev](https://react.dev)
8. FATF Recommendations — [fatf-gafi.org](https://www.fatf-gafi.org)

---

## 📄 License

This project is submitted as a Major Project for B.Tech CSE at Medicaps University, Indore.

---

<div align="center">
  Built with ❤️ by Jayant Desai, Satyam Kachhi & Asif Mansoori
  <br/>
  Medicaps University, Indore — 2026
</div>
