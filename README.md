# 🛠️ Customer Service Helper – Backend API

This is the **backend service** for the Customer Service Helper application, designed to streamline support operations across organizations by uniting agents and AI tools in a shared workflow. It provides endpoints for managing organizations, agents, member profiles, knowledge base articles, QA evaluations, and call wrap-up logic.

---

## 🚀 Project Overview

The Customer Service Helper backend is built with **Node.js**, **Express**, and **MongoDB**. It supports:

- Multi-organization support with seeded data
- Secure JWT-based authentication
- Role-based access control for agents, managers, and admins
- Enforcement of trial limits for agent onboarding
- Modular design ready for deployment to Render or other platforms

---

## 🧪 Tech Stack

| Layer     | Technology             |
| --------- | ---------------------- |
| Runtime   | Node.js                |
| Framework | Express.js             |
| Database  | MongoDB (via Mongoose) |
| Auth      | JSON Web Tokens (JWT)  |
| Security  | Bcrypt, Role Guards    |
| Utilities | Dotenv, CORS, Helmet   |

---

## 📁 Folder Structure

src/ ├── models/ # Mongoose schemas ├── controllers/ # Business logic for API routes ├── middleware/ # Auth and role enforcement ├── routes/ # Express route handlers ├── seed.js # Demo seed script for 3 organizations ├── app.js # Main Express app .env # Environment variables

---

## ✅ Features

- 🔐 Authentication (register/login) via JWT
- 🏢 Organizations: Create, edit, and upgrade plans
- 🧑‍💼 Agents: Add/edit/delete with role-based logic
- 🧾 Knowledge Base: Link articles to reasons for call
- 🧍 Member Profiles: Optional structured data for testing
- 📋 End-Call Flow: Checklist enforcement at call close
- 📈 Trial Enforcement: Limit 3 agents for free-tier orgs

---

## 📦 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/customer-service-helper-be.git
cd customer-service-helper-be
```
