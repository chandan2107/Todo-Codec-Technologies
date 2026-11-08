# TaskFlow - Advanced MERN Architecture To-Do List Application

An enterprise-grade, full-stack Task Management application built with the **MERN** stack (MongoDB, Express.js, React.js, Node.js). Engineered with clean MVC separation, robust JWT authentication, server-side validation, aggregation pipelines, pagination, multi-attribute filtering, sorting, and an interactive task workflow (Pending, In-Progress, Completed) with Grid, Kanban Board, and List views.

---

## 🚀 Key Highlights & Features

### 1. Robust Backend Architecture (Node.js & Express.js)
- **MVC Clean Separation**: Explicit isolation between routes, controllers, models, and validation middleware.
- **JWT-Based Authentication**: Secure stateless token authentication with `bcryptjs` password hashing and protected API routes.
- **Server-Side Validation**: Built using `express-validator` to strictly validate and sanitize payloads before reaching business logic.
- **Structured Error Handling**: Centralized error middleware handling MongoDB duplicate keys (`E11000`), CastErrors (invalid ObjectIds), validation failures (`422`), expired/invalid tokens (`401`), and unhandled server errors (`500`).
- **RESTful Endpoints & Analytics**: MongoDB aggregation pipelines (`$group`, `$match`) computing live task counts, completion percentages, priorities, and overdue alerts.

### 2. High-Performance Frontend (React.js & Vite)
- **React Hooks & Modular Components**: Custom hooks (`useAuth`, `useTasks`, `useDebounce`) providing clean state management without boilerplate.
- **Task Status Workflow**: Interactive lifecycle tracking across `Pending`, `In-Progress`, and `Completed`.
- **Multiple View Modes**:
  - **Grid View**: Responsive task cards with priority badges, due dates, tags, and quick-action transition buttons.
  - **Kanban Board**: Drag/click multi-column board view categorizing tasks by lifecycle stage.
  - **Compact List Table**: High-density view for quick status triage and management.
- **Search, Filtering, & Sorting**: Real-time debounced keyword search, status filter chips, priority dropdowns, and multi-field sorting (Date Created, Due Date, Priority, Title).
- **Pagination**: Server-driven pagination with configurable limits and quick page navigation.
- **Toast Notifications & Dialogs**: Global toast notifications and accessible modal dialogs for task creation, editing, and delete confirmations.

---

## 📁 Project Architecture

```
todoo/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB Mongoose connection
│   │   ├── controllers/
│   │   │   ├── authController.js     # User registration, login, profile logic
│   │   │   └── taskController.js     # Full CRUD, status update, analytics aggregation
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.js     # JWT verification & route protection
│   │   │   ├── errorMiddleware.js    # Global error handling & 404 handler
│   │   │   └── validateMiddleware.js # express-validator error formatter
│   │   ├── models/
│   │   │   ├── User.js               # User schema with bcrypt password hashing
│   │   │   └── Task.js               # Task schema with indexes & text search
│   │   ├── routes/
│   │   │   ├── authRoutes.js         # /api/auth routes
│   │   │   └── taskRoutes.js         # /api/tasks routes
│   │   ├── validators/
│   │   │   ├── authValidator.js      # Input validation chains for auth
│   │   │   └── taskValidator.js      # Input validation chains for tasks
│   │   ├── utils/
│   │   │   ├── apiResponse.js        # Standardized API response wrappers
│   │   │   └── jwt.js                # JWT sign & verify helpers
│   │   ├── seed.js                   # Database seeding script with sample tasks
│   │   ├── testApi.js                # Automated end-to-end API test runner
│   │   └── server.js                 # Express application entrypoint
│   ├── .env                          # Backend environment variables
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── axiosClient.js        # Axios instance with JWT interceptors
│   │   │   ├── authApi.js            # Auth API calls
│   │   │   └── taskApi.js            # Task API calls
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── tasks/
│   │   │   │   ├── TaskCard.jsx
│   │   │   │   ├── TaskFilters.jsx
│   │   │   │   ├── TaskKanban.jsx
│   │   │   │   ├── TaskListTable.jsx
│   │   │   │   ├── TaskModal.jsx
│   │   │   │   ├── TaskPriorityBadge.jsx
│   │   │   │   ├── TaskStats.jsx
│   │   │   │   └── TaskStatusBadge.jsx
│   │   │   └── ui/
│   │   │       ├── ConfirmDialog.jsx
│   │   │       ├── Modal.jsx
│   │   │       ├── Navbar.jsx
│   │   │       └── Pagination.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Authentication state & actions
│   │   │   └── ToastContext.jsx      # Global toast notification system
│   │   ├── hooks/
│   │   │   ├── useDebounce.js        # Search input debouncer
│   │   │   └── useTasks.js           # Task state, pagination, and filter hook
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx     # Main task workspace
│   │   │   ├── LoginPage.jsx         # Sign in with demo prefill
│   │   │   ├── RegisterPage.jsx      # New user registration
│   │   │   └── NotFoundPage.jsx      # 404 page
│   │   ├── App.jsx                   # Router configuration
│   │   ├── index.css                 # Tailwind CSS styles
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── package.json                      # Root workspace scripts
└── README.md
```

---

## 🛠️ REST API Specification

### Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Authenticate credentials & return JWT | No |
| `GET` | `/api/auth/me` | Fetch currently logged-in user profile | Yes (`Bearer <token>`) |
| `PUT` | `/api/auth/profile` | Update user name or change password | Yes (`Bearer <token>`) |

### Task Endpoints (`/api/tasks`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/tasks` | Get tasks with pagination, filters, & sorting | Yes |
| `GET` | `/api/tasks/stats` | Aggregated metrics (totals, status counts, overdue) | Yes |
| `GET` | `/api/tasks/:id` | Get single task by MongoDB ObjectId | Yes |
| `POST` | `/api/tasks` | Create a new task | Yes |
| `PUT` | `/api/tasks/:id` | Full or partial update of task fields | Yes |
| `PATCH`| `/api/tasks/:id/status` | Quick status transition (`Pending`/`In-Progress`/`Completed`) | Yes |
| `DELETE`| `/api/tasks/:id` | Delete a task | Yes |

#### Query Parameters for `GET /api/tasks`:
- `page`: Page number (default: `1`)
- `limit`: Items per page (default: `10`, max: `100`)
- `status`: Filter by status (`All`, `Pending`, `In-Progress`, `Completed`)
- `priority`: Filter by priority (`All`, `Low`, `Medium`, `High`)
- `search`: Case-insensitive regex match against title and description
- `sortBy`: Field to sort on (`createdAt`, `dueDate`, `priority`, `title`)
- `order`: Sort order (`asc` or `desc`)

---

## ⚡ Quickstart Guide

### Prerequisites
- **Node.js** (v18.x or higher)
- **MongoDB** running locally on port `27017` or a MongoDB Atlas URI

### 1. Clone & Install Dependencies
Run the following commands in the project directory:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables
The backend `.env` file is pre-configured with default local settings:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/todo_app
JWT_SECRET=supersecretjwtkey_mern_todoo_2026_secure
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### 3. Seed Demo Data (Optional but Recommended)
Populate MongoDB with demo user credentials and realistic sample tasks:
```bash
cd backend
npm run seed
```

**Demo Account Credentials:**
- **Email**: `demo@taskflow.dev`
- **Password**: `Password123`
*(A "Fill Demo Credentials" button is also provided directly on the Login screen)*

### 4. Run the Application

#### Option A: Run Backend & Frontend in separate terminals

**Terminal 1 (Backend Server):**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

#### Option B: Automated API Verification Suite
To verify all REST endpoints, status workflow transitions, and aggregation pipelines:
```bash
cd backend
node src/server.js   # in one terminal
node src/testApi.js  # in another terminal
```

---

## 🔒 Security Best Practices Implemented
- **Helmet**: Secures Express HTTP headers against well-known web vulnerabilities.
- **CORS Configuration**: Configured with strict origins, credentials, and allowed HTTP methods.
- **Bcrypt Hashing**: Passwords hashed with 10 salt rounds prior to persistence.
- **No Password Leakage**: Passwords omitted via Mongoose `select: false` on models.
- **Stateless Bearer Tokens**: JWTs verified on every private route request.
- **User-Scoped Queries**: All task queries explicitly scoped to `req.user._id` to prevent unauthorized cross-tenant data access.

