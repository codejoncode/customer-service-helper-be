🛠️ Customer Service Helper – Backend API
This is the backend service for the Customer Service Helper application, designed to streamline support operations across multiple organizations by uniting agents and AI tools in a shared workflow. It provides endpoints for managing organizations, agents, member profiles, knowledge-base articles, QA evaluations, and call wrap-up logic.

🚀 Project Overview
The service is built with Node.js, Express, and MongoDB. Key capabilities include:

- Multi-organization support with seeded demo data
- Secure authentication via JSON Web Tokens (JWT)
- Role-based access control (agents, managers, admins)
- Enforcement of trial limits for free-tier organizations
- Modular architecture ready for deployment to Render, Heroku, or similar

🧪 Tech Stack
| Layer | Technology |
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB (via Mongoose) |
| Auth | JSON Web Tokens (JWT) |
| Security | Bcrypt, custom guards |
| Utilities | Dotenv, CORS, Helmet |

📁 Folder Structure
src/
├── controllers/ # Business logic for API routes
├── middleware/ # Auth, role enforcement, rate limits
├── models/ # Mongoose schemas
├── routes/ # Express route definitions
├── seed.js # Seed script for demo organizations
└── app.js # Main Express application
.env # Environment variables (gitignored)

✅ Features

- 🔐 JWT-based register/login and session management
- 🏢 Organization CRUD with plan tiers and trial agent limits
- 👥 Agent management with roles and status flags
- 📖 Knowledge Base articles linked to call reasons
- 🗒 Member profiles for enriched QA testing
- ✔️ Call wrap-up checklist enforcement
- 🔒 Role guards (allowIfTrainingOrAgent) on protected routes

🔒 Authentication
All auth routes use JWT. A typical flow:

- User registers or logs in with /auth/register or /auth/login.
- Server issues an access token signed with your JWT_SECRET.
- Client includes Authorization: Bearer <token> on subsequent requests.
- Protected routes validate the token and enforce roles.

📝 Environment Variables
| Name | Description |
| MONGODB_URI | MongoDB connection string |
| JWT_SECRET | Secret key for signing and verifying JWTs |
| PORT | Port number for the server (default: 3000) |

Create a file named .env at the project root. Do not commit it.

📦 Getting Started

- Clone the repository
  git clone https://github.com/your-username/customer-service-helper-be.git
  cd customer-service-helper-be
- Install dependencies
  npm install
- Seed demo data (optional)
  node seed.js

🚀 Running the Application

- Development (with auto-reload):
  npm run dev
- Production:
  npm run build
  npm start

🧪 Testing
Run all tests with:
npm test

Test coverage now focuses on:

- JWT token validation and error handling
- Protected route behavior (allowIfTrainingOrAgent)
- Role-specific access checks
- Call wrap-up logic and QA evaluations
  Legacy authentication tests have been removed.

📫 API Overview
Auth

- POST /auth/register
- POST /auth/login
  Organizations
- GET /organizations
- POST /organizations
- PUT /organizations/:id
- DELETE /organizations/:id
  Agents
- GET /agents
- POST /agents
- PUT /agents/:id
- DELETE /agents/:id
  Knowledge Base
- GET /kb-articles
- POST /kb-articles
  Members
- GET /members
- POST /members
  Calls
- POST /calls (start call)
- PUT /calls/:id/wrapup (complete call with checklist)
  All protected routes use the allowIfTrainingOrAgent middleware to enforce role and trial-limit checks.

🤝 Contributing
You’re the primary maintainer right now, but future contributions are welcome:

- Fork the repo
- Create a feature branch (git checkout -b feature/xyz)
- Commit with clear messages
- Open a pull request against main

📜 License

© 2025 Jonathan Holloway
