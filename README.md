# HD Notes - Secure Note-Taking Application

A full-stack note-taking application built with React, TypeScript, Node.js, and MongoDB. HD Notes provides a secure and intuitive platform for users to create, manage, and organize their notes with robust authentication and responsive design.

## Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Features
- ✅ **Secure Authentication**: Email/OTP and Google OAuth login/signup
- ✅ **JWT Authorization**: Secure API access with JSON Web Tokens
- ✅ **CRUD Operations**: Create, read, update, and delete notes
- ✅ **Responsive Design**: Works seamlessly on mobile and desktop devices
- ✅ **Modern UI**: Clean, intuitive interface with Tailwind CSS
- ✅ **Form Validation**: Client and server-side input validation
- ✅ **Error Handling**: Comprehensive error messages for user feedback

## Technology Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT, Google OAuth, Email/OTP
- **Development Tools**: dotenv, nodemailer, cors, axios
- **Version Control**: Git

## Prerequisites
Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) (v8 or higher)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Git](https://git-scm.com/)

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/your-username/hd-notes.git
cd hd-notes
```

### 2. Install dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Set up environment variables

#### Backend (.env)
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/notesdb?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:5173
```

#### Frontend (.env)
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000
```

## Configuration

### MongoDB Setup
1. Create a MongoDB Atlas account or use a local instance
2. Create a database named `notesdb`
3. Update the `MONGODB_URI` in your backend `.env` file with your connection string

### Gmail Configuration for OTP
To enable email OTP functionality:
1. Use a Gmail account for sending OTPs
2. Enable 2-Step Verification
3. Generate an App Password
4. Use the App Password in `EMAIL_PASS` instead of your regular password

## Usage

### 1. Start the development servers
```bash
# In one terminal, start the backend
cd backend
npm run dev

# In another terminal, start the frontend
cd ../frontend
npm run dev
```

### 2. Access the application
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

### 3. Application Flow
1. Visit the welcome page at `/`
2. Click "Create Account" to sign up with email/OTP or Google
3. After verification, you'll be redirected to the dashboard
4. Create, edit, and manage your notes
5. Sign out to log out of the application

## Project Structure
```
hd-notes/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   └── Note.ts
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   └── noteRoutes.ts
│   │   ├── middleware/
│   │   │   └── auth.ts
│   │   ├── server.ts
│   │   └── utils/
│   │       └── otp.ts
│   ├── .env
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── WelcomePage.tsx
│   │   │   ├── SignUp.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   └── Dashboard.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── utils/
│   │   │   └── axiosInstance.ts
│   │   ├── types/
│   │   │   └── api.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env
│   └── package.json
├── README.md
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Send OTP for login
- `POST /api/auth/verify-otp` - Verify OTP and complete authentication
- `POST /api/auth/google` - Google OAuth login

### Notes
- `GET /api/notes` - Get all user notes
- `POST /api/notes` - Create a new note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note

## Environment Variables

### Backend
| Variable | Description |
|---------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT token generation |
| `EMAIL_USER` | Gmail address for sending OTPs |
| `EMAIL_PASS` | App password for Gmail |
| `FRONTEND_URL` | Frontend origin for CORS |

### Frontend
| Variable | Description |
|---------|-------------|
| `VITE_API_URL` | Backend API base URL |

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request


## Acknowledgments
- Built with ❤️ using React and TypeScript
- Inspired by the need for secure, user-friendly note-taking applications
- Special thanks to the open-source community for the amazing tools and libraries used in this project

---

**Note**: This application uses `dotenvx` for enhanced environment variable security. For production deployments, consider using encrypted environment variables with `dotenvx` to protect sensitive information.