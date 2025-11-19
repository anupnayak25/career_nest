# Career Nest Website

The official web application for Career Nest, built with React and Vite. This modern, responsive platform enables students and administrators to manage, attempt, and evaluate technical, HR, and programming quizzes, as well as video interviews.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Available Scripts](#available-scripts)
- [Pages and Routes](#pages-and-routes)
- [Components](#components)
- [Services](#services)
- [State Management](#state-management)
- [Styling](#styling)
- [Deployment](#deployment)
- [Contributing](#contributing)

## ✨ Features

### For Students
- 📝 **Quiz Management**
  - Attempt Technical, HR, and Programming quizzes
  - View quiz instructions and time limits
  - Submit answers and view results
  - Review attempted quizzes

- 🎥 **Video Interviews**
  - Record and upload video responses
  - View video questions
  - Submit video answers for AI evaluation

- 📊 **Dashboard**
  - View available quizzes and assignments
  - Track completion status
  - View scores and feedback
  - Personal profile management

### For Administrators
- ➕ **Question Management**
  - Create and edit quiz questions
  - Manage multiple question types (HR, Technical, Programming)
  - Set quiz parameters (time limits, marks, due dates)
  - Bulk question upload

- 📹 **Video Management**
  - Upload video interview questions
  - Organize video question sets
  - Monitor student submissions

- 📈 **Evaluation**
  - Trigger AI-powered batch evaluations
  - View student performance analytics
  - Export results

### General Features
- 🔐 Secure authentication with JWT
- 📱 Responsive design for all devices
- 🎨 Modern UI with Tailwind CSS
- ⚡ Fast page loads with Vite
- 🔄 Auto-login for returning users
- 🚦 Route protection for authenticated pages

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite 5
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: React Context API
- **UI Components**: Custom components with Tailwind
- **Icons**: Heroicons/Lucide React
- **Deployment**: Vercel-ready

## 🚀 Getting Started

### Prerequisites

- Node.js v18.0.0 or higher
- npm or yarn package manager
- Backend API running (see [backend README](../backend/README.md))

### Installation

1. **Clone the repository** (if not already done)
   ```bash
   git clone https://github.com/anupnayak25/career_nest.git
   cd career_nest/website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Create .env file
   touch .env
   
   # Add the following:
   echo "VITE_API_URL=http://localhost:5000" > .env
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173` by default.

### Quick Start

1. Register a new account at `/signup`
2. Login at `/signin`
3. Access dashboard at `/dashboard`
4. Students can attempt quizzes
5. Admins can manage questions

## 📁 Project Structure

```
website/
├── public/               # Static assets
│   └── vite.svg         # Vite logo
├── src/
│   ├── assets/          # Images, fonts, etc.
│   ├── components/      # Reusable React components
│   │   ├── CreateQuestion.jsx
│   │   ├── NavBar.jsx
│   │   ├── QuestionCard.jsx
│   │   └── Loading.jsx
│   ├── context/         # React Context providers
│   │   └── AuthContext.jsx
│   ├── pages/           # Page components
│   │   ├── Home.jsx
│   │   ├── Signin.jsx
│   │   ├── Signup.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Video.jsx
│   │   ├── QuestionManagementPage.jsx
│   │   ├── ProfilePage.jsx
│   │   └── NotFound.jsx
│   ├── services/        # API service layer
│   │   └── ApiService.jsx
│   ├── ui/              # UI utility components
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # React entry point
│   ├── index.css        # Global styles
│   └── PrivateRoute.jsx # Route protection
├── .env                 # Environment variables
├── .gitignore          # Git ignore rules
├── eslint.config.js    # ESLint configuration
├── index.html          # HTML entry point
├── package.json        # Dependencies
├── postcss.config.js   # PostCSS configuration
├── tailwind.config.js  # Tailwind CSS configuration
├── vercel.json         # Vercel deployment config
├── vite.config.js      # Vite configuration
└── README.md          # This file
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the website root:

```env
# Backend API URL
VITE_API_URL=http://localhost:5000

# For production:
# VITE_API_URL=https://api.yourdomain.com
```

**Note**: All environment variables must be prefixed with `VITE_` to be accessible in the application.

### Vite Configuration

The `vite.config.js` file contains build and development server settings:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
})
```

## 📜 Available Scripts

### Development

```bash
# Start development server with hot reload
npm run dev
```

### Production Build

```bash
# Build for production
npm run build

# Output will be in the dist/ folder
```

### Linting

```bash
# Check for lint errors
npm run lint

# Fix auto-fixable lint errors
npm run lint:fix
```

### Preview Production Build

```bash
# Preview production build locally
npm run preview
```

## 🗺️ Pages and Routes

### Public Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | Landing page |
| `/signin` | Signin | User login |
| `/signup` | Signup | User registration |

### Protected Routes (Authentication Required)

| Route | Component | Description |
|-------|-----------|-------------|
| `/dashboard` | Dashboard | Main dashboard |
| `/profile` | ProfilePage | User profile |
| `/video` | Video | Video interview interface |
| `/questions` | QuestionManagementPage | Question management (Admin) |
| `/view-attempted/:type/:id` | ViewAttempted | Review submitted answers |

### Route Protection

Routes are protected using the `PrivateRoute` component:

```jsx
<Route
  path="/dashboard"
  element={
    <PrivateRoute>
      <Dashboard />
    </PrivateRoute>
  }
/>
```

## 🧩 Components

### NavBar
Navigation bar with role-based menu items.

**Props**: None (uses AuthContext)

**Usage**:
```jsx
<NavBar />
```

### QuestionCard
Displays quiz information card.

**Props**:
- `question`: Question object
- `type`: Question type (hr, technical, programming)
- `onAttempt`: Callback function

### CreateQuestion
Form component for creating new questions.

**Props**:
- `type`: Question type
- `onSuccess`: Success callback

### Loading
Loading spinner component.

**Usage**:
```jsx
<Loading />
```

## 🔌 Services

### ApiService

Centralized API communication layer using Axios.

**Key Methods**:

```javascript
import ApiService from './services/ApiService';

// Authentication
await ApiService.post('/api/auth/login', { email, password });
await ApiService.post('/api/auth/register', userData);

// Get quiz data
const response = await ApiService.get('/api/hr/questions');

// Submit answer
await ApiService.post('/api/hr/submit', answerData);

// Upload file
await ApiService.post('/api/video/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
```

**Features**:
- Automatic JWT token attachment
- Request/response interceptors
- Error handling
- Base URL configuration from environment

## 🎯 State Management

### AuthContext

Manages user authentication state across the application.

**Usage**:

```jsx
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please login</div>;
  }
  
  return <div>Welcome {user.name}</div>;
}
```

**Provided Values**:
- `user`: Current user object
- `isAuthenticated`: Boolean authentication status
- `login(token, userData)`: Login function
- `logout()`: Logout function

## 🎨 Styling

### Tailwind CSS

The project uses Tailwind CSS for styling. Configuration is in `tailwind.config.js`:

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        // Add custom colors
      }
    },
  },
  plugins: [],
}
```

### Custom Styles

Global styles are in `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom utility classes */
@layer components {
  .btn-primary {
    @apply bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600;
  }
}
```

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Configure Environment Variables**
   - Go to Vercel dashboard
   - Add `VITE_API_URL` with your production API URL

### Deploy to Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

3. **Configure Environment Variables**
   - Add `VITE_API_URL` in Netlify dashboard

### Deploy to GitHub Pages

1. **Install gh-pages**
   ```bash
   npm install -g gh-pages
   ```

2. **Update `vite.config.js`**
   ```javascript
   export default defineConfig({
     base: '/career_nest/',
     // ... other config
   })
   ```

3. **Deploy**
   ```bash
   npm run build
   gh-pages -d dist
   ```

For more deployment options, see [DEPLOYMENT.md](../DEPLOYMENT.md)

## 🤝 Contributing

See the main project [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Create a feature branch
2. Make changes
3. Test locally with `npm run dev`
4. Run linter with `npm run lint`
5. Build with `npm run build`
6. Create pull request

## 📝 License

This project is for educational and demonstration purposes.

## 📞 Support

For issues or questions:
- Check the [main README](../README.md)
- Open an issue on GitHub
- Contact the development team

---

Built with ❤️ using React and Vite