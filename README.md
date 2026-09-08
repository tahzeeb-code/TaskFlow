# TaskFlow MVP

TaskFlow is a secure, Kanban-style task-management web application. It allows individuals and small teams to organize projects and manage work seamlessly.

## Features

- **Authentication**: Secure user registration, login, and JWT-based session management.
- **Project Management**: Create, view, edit, and delete projects.
- **Kanban Board**: Drag-and-drop task management across "To Do", "In Progress", and "Done" statuses.
- **Task Management**: Create, edit, and delete tasks within specific projects.
- **Dashboard**: High-level overview of workspace metrics and recent projects.
- **My Tasks**: A consolidated view of all assigned tasks.
- **Responsive Design**: Optimized for desktop, tablet, and mobile.

## Tech Stack

### Frontend
- React.js (Vite)
- React Router DOM
- Tailwind CSS
- `@hello-pangea/dnd` for Drag and Drop
- `lucide-react` for Icons
- `axios` for API calls

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT)
- bcryptjs for password hashing

## Project Structure

```
taskflow/
├── backend/            # Express server and APIs
│   ├── config/         # Database connection
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middlewares (auth, errors)
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routes
│   └── server.js       # Entry point
└── frontend/           # React application
    ├── src/
    │   ├── api/        # Axios API client setup
    │   ├── components/ # Reusable UI components
    │   ├── context/    # React Context (Auth)
    │   ├── pages/      # Application pages (Dashboard, Board, etc.)
    │   └── routes/     # Route protection logic
    └── tailwind.config.js
```

## Setup & Installation

### Prerequisites
- Node.js installed
- MongoDB installed locally or a MongoDB Atlas URI

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory (you can copy `.env.example`):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

Run the backend server:
```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

Run the frontend application:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate a user
- `GET /api/auth/me` - Get current user profile (Protected)

### Projects (Protected)
- `GET /api/projects` - Get all user projects
- `POST /api/projects` - Create a project
- `GET /api/projects/:projectId` - Get a specific project
- `PATCH /api/projects/:projectId` - Update a project
- `DELETE /api/projects/:projectId` - Delete a project and its tasks

### Tasks (Protected)
- `GET /api/projects/:projectId/tasks` - Get tasks for a specific project
- `POST /api/projects/:projectId/tasks` - Create a task in a project
- `PATCH /api/tasks/:taskId` - Update a task (e.g., status, title)
- `DELETE /api/tasks/:taskId` - Delete a task
- `GET /api/tasks` - Get all tasks assigned to the user

## Unimplemented Optional Features
- Drag-and-drop ordering within the same column is supported visually by the library, but persisting the exact index ordering in the backend is out of MVP scope (status changes are fully persisted).
- The metric chart is implemented as a CSS circular progress indicator rather than using a heavy charting library.
