# SupportFlow — AI-Assisted Customer Support Desk

An MVP support ticket management system where customers submit tickets, AI performs automated triage (category, priority, summary), and agents review the AI suggestions before resolving tickets.

## Live Links

- **Frontend:** https://femhack-2026-m1z4.vercel.app
- **Backend API:** https://femhack-2026-eight.vercel.app

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, React Router
- **Backend:** Node.js, Express (ES Modules)
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens), bcrypt for password hashing
- **AI Service:** Google Gemini API
- **Real-time:** Polling-based live updates (ticket status & conversation refresh every 3 seconds)
- **Deployment:** Vercel (frontend + backend, separate projects)

## Demo Credentials

| Role     | Email               | Password    |
|----------|---------------------|-------------|
| Customer | customer@demo.com   | password123 |
| Agent    | agent@demo.com      | password123 |

## AI Tools/Services Declaration

- **Google Gemini API** is used for automated ticket triage.
- Primary model: `gemini-3.1-flash-lite`
- Fallback model: `gemini-2.5-flash` (used automatically if the primary model fails or times out)
- If both models fail, the ticket is still created and can be handled manually by an agent — AI is never a blocking dependency.
- The AI's suggested category, priority, and summary are always shown to the agent for review before being confirmed and saved.

## Core Workflow

1. Customer registers/logs in and submits a support ticket (subject, description, category).
2. Backend calls Gemini AI to generate a suggested category, priority, and summary.
3. Ticket appears on the Agent Dashboard with the AI suggestion attached.
4. Agent reviews/edits the AI suggestion and confirms it (human-in-the-loop).
5. Agent assigns the ticket to themselves, updates status, and exchanges messages with the customer.
6. Agent resolves the ticket with a mandatory resolution note.
7. A resolved ticket is locked from further changes unless explicitly reopened by an agent.

## Data Model

### User
| Field     | Type   | Notes                              |
|-----------|--------|-------------------------------------|
| name      | String | required                            |
| email     | String | required, unique                    |
| password  | String | required, hashed via bcrypt         |
| role      | String | enum: customer / agent / admin (default: customer) |

### Ticket
| Field           | Type     | Notes                                          |
|------------------|----------|-------------------------------------------------|
| ticketNumber     | String   | auto-generated, unique                          |
| subject          | String   | required                                        |
| description      | String   | required                                        |
| customer         | ObjectId | ref: User                                       |
| assignedAgent    | ObjectId | ref: User, nullable                             |
| category         | String   | enum: Billing / Technical / General / Account / Other (final, human-confirmed) |
| priority         | String   | enum: Low / Medium / High (final, human-confirmed) |
| status           | String   | enum: New / Assigned / In Progress / Resolved   |
| aiSuggestion     | Object   | { category, priority, summary, generatedAt, failed } — raw AI output, separate from final fields |
| resolutionNote   | String   | required to mark ticket as Resolved             |
| resolvedAt       | Date     | nullable                                        |

### Message
| Field       | Type     | Notes                        |
|-------------|----------|-------------------------------|
| ticket      | ObjectId | ref: Ticket                  |
| sender      | ObjectId | ref: User                    |
| senderRole  | String   | enum: customer / agent       |
| text        | String   | required                     |

## API Endpoints

### Auth
| Method | Endpoint              | Access        | Description         |
|--------|------------------------|---------------|----------------------|
| POST   | /api/auth/register     | Public        | Register new customer |
| POST   | /api/auth/login        | Public        | Login, returns JWT   |
| GET    | /api/auth/me           | Authenticated | Get current user     |

### Tickets
| Method | Endpoint                        | Access          | Description                          |
|--------|----------------------------------|------------------|----------------------------------------|
| POST   | /api/tickets                    | Customer         | Create ticket (triggers AI triage)     |
| GET    | /api/tickets                    | Authenticated    | List tickets (role-based filtering)    |
| GET    | /api/tickets/:id                | Authenticated    | Get single ticket                      |
| PUT    | /api/tickets/:id                | Customer (owner) | Update ticket (re-triggers AI triage)  |
| PATCH  | /api/tickets/:id/assign         | Agent/Admin      | Assign ticket to self                  |
| PATCH  | /api/tickets/:id/status         | Agent/Admin      | Update status (Assigned/In Progress)   |
| PATCH  | /api/tickets/:id/review-ai      | Agent/Admin      | Confirm/edit AI category & priority    |
| PATCH  | /api/tickets/:id/resolve        | Agent/Admin      | Resolve ticket (resolutionNote required) |
| PATCH  | /api/tickets/:id/reopen         | Agent/Admin      | Reopen a resolved ticket               |

### Messages
| Method | Endpoint                              | Access       | Description            |
|--------|-----------------------------------------|--------------|--------------------------|
| POST   | /api/tickets/:ticketId/messages         | Authenticated | Send message on ticket  |
| GET    | /api/tickets/:ticketId/messages         | Authenticated | Get ticket conversation |

## Business Rules Enforced

- Only authenticated users can access ticket routes.
- Customers can only view/edit/message their own tickets.
- Agents can only update tickets assigned to them.
- A resolved ticket cannot be changed through the normal workflow — must be reopened first.
- Resolving a ticket requires a non-empty resolution note.
- AI suggestion values are validated against allowed enums before being saved.
- API keys (Gemini, JWT secret, DB credentials) are stored only in backend environment variables — never exposed to the frontend.

## Local Setup

### Backend
```bash
cd backend
npm install
# create a .env file with:
# MONGODB_URI=your_mongodb_atlas_uri
# JWT_SECRET=your_jwt_secret
# JWT_EXPIRES_IN=7d
# CLIENT_URL=http://localhost:5173
# GEMINI_API_KEY=your_gemini_api_key
# PRIMARY=gemini-3.1-flash-lite
# FALLBACK=gemini-2.5-flash
npm run seed   # creates demo customer + agent accounts
npm run dev
```

### Frontend
```bash
cd frontend
npm install
# create a .env file with:
# VITE_API_URL=http://localhost:5000
npm run dev
```

## Real-Time Feature

The ticket detail page polls the backend every 3 seconds to refresh the conversation and ticket status, so new agent replies or status changes appear without a manual page refresh.