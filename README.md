# MERN Task Management Application

A full-stack task management application built with MongoDB, Express.js, React.js, and Node.js. Features user authentication, real-time updates with Socket.io, and a clean, intuitive user interface.

## 🚀 Features

### Phase 1: Core Features (Completed ✅)
- **User Authentication**: Secure registration and login system with JWT tokens
- **Task Management**: Create, read, update, and delete tasks (CRUD operations)
- **Real-time Updates**: Instant task updates across all connected clients using Socket.io
- **Task Filtering**: Filter tasks by status (pending, in-progress, completed)
- **Search Functionality**: Search tasks by title and description
- **Priority Levels**: Set task priorities (low, medium, high)
- **Due Dates**: Set and track task due dates with overdue indicators
- **Responsive Design**: Clean and intuitive UI that works on all devices
- **Task Statistics**: Dashboard with task count and status overview
- **Subtasks & Comments**: Break down tasks and collaborate with comments
- **Tags & Categories**: Organize tasks with custom tags and categories
- **Dark/Light Theme**: Toggle between dark and light mode
- **Notifications**: Toast notifications for all user actions

### Phase 2: Advanced Features (In Progress 🚀)
- **Kanban Board View**: Drag-and-drop task management with status columns
- **Calendar View**: Monthly calendar with task visualization
- **Analytics Dashboard**: Productivity metrics and performance insights
- **Multiple View Options**: List, Kanban, Calendar, and Analytics views
- **Advanced Filtering**: Filter by priority, due date, tags, and assignees
- **Task Export**: Export tasks to JSON format for backup

### Phase 3: Enterprise Features (Planned 📋)
- **Team Collaboration**: Share tasks and assign to team members
- **File Attachments**: Upload and attach files to tasks
- **Recurring Tasks**: Create tasks that repeat on schedule
- **Task Templates**: Save and reuse task templates
- **Mobile PWA**: Progressive Web App for mobile access
- **AI Features**: AI-powered task prioritization and suggestions
- **Advanced Security**: 2FA, OAuth integration, enterprise SSO
- **Multi-workspace Support**: Manage multiple task projects

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Context API** - State management
- **Axios** - HTTP client
- **Socket.io-client** - Real-time communication
- **React Toastify** - Notifications
- **Lucide React** - Icons

## 🏗️ Production-Level Features & Architecture

### 1. Security Best Practices ✅

#### Authentication & Authorization
- **JWT Tokens**: Stateless user authentication with JSON Web Tokens
- **Protected Routes**: Middleware validates tokens before accessing endpoints
- **Role-Based Access Control**: Admin and user role management
- **Session Management**: Secure token storage and refresh mechanisms

#### Password Security
- **Bcrypt Hashing**: Secure password hashing with salt rounds (12)
- **Password Validation**: Minimum 6 characters, strength requirements
- **Secure Comparison**: Constant-time password comparison to prevent timing attacks

#### Input Validation & Sanitization
- **Server-side Validation**: Express middleware validates all inputs
- **XSS Prevention**: HTML sanitization and content security policies
- **NoSQL Injection Prevention**: Query parameterization and input escaping
- **Rate Limiting**: Protection against brute force attacks

#### CORS & Environment Security
- **CORS Configuration**: Restricted to authorized origins only
- **Environment Variables**: Sensitive data stored in `.env` files (never committed)
- **HTTPS Ready**: Application structure supports SSL/TLS encryption
- **Security Headers**: X-Frame-Options, X-Content-Type-Options configuration

### 2. Scalable & Performant Architecture ✅

#### Modular Code Structure
**Backend**:
- `/models`: Mongoose schemas (User, Task, Subtask, Comment)
- `/routes`: Organized API endpoints (auth, tasks)
- `/middleware`: Authentication, error handling, validation
- `/controllers`: Business logic separation (planned)

**Frontend**:
- `/components`: Reusable UI components (TaskCard, TaskForm, Header)
- `/pages`: Page-level components (Login, Register, Dashboard)
- `/context`: Global state management (AuthContext, TaskContext)
- `/hooks`: Custom React hooks (useAuth, useTasks)

#### Database Optimization
- **Indexes**: Created on frequently queried fields (userId, email, taskStatus)
- **Lean Queries**: Mongoose `.lean()` for read-only operations
- **Aggregation Pipelines**: MongoDB aggregation for complex queries
- **Connection Pooling**: Optimized MongoDB connection management

#### Frontend Performance
- **Code Splitting**: Lazy loading of route components
- **React Memoization**: useMemo and useCallback for expensive operations
- **Component Optimization**: Functional components with hooks
- **Bundle Size**: Optimized dependencies and tree-shaking

#### Caching & Compression
- **Response Compression**: Gzip compression for API responses
- **Client-side Caching**: Browser caching for static assets
- **Redis Integration**: (Planned) for session and data caching

### 3. Robust API Design ✅

#### RESTful Architecture
- **Clean Endpoints**: `/api/auth`, `/api/tasks`, `/api/tasks/:id`
- **HTTP Methods**: Proper use of GET, POST, PUT, DELETE
- **Status Codes**: Correct HTTP status codes (200, 201, 400, 401, 500)
- **Meaningful Responses**: Consistent JSON response format

```javascript
// Standard Response Format
{
  success: boolean,
  data: object,
  message: string,
  error: string | null
}
```

#### Error Handling
- **Centralized Middleware**: All errors handled uniformly
- **Error Logging**: Console and file logging for debugging
- **Client Feedback**: User-friendly error messages
- **Error Recovery**: Graceful error recovery and fallbacks

#### Input Validation
- **Schema Validation**: Mongoose schema validation on model level
- **Middleware Validation**: Express middleware for request validation
- **Type Checking**: JavaScript type checking and object structure validation
- **Sanitization**: User input sanitization to prevent attacks

#### API Documentation
- Clear route structure with comments
- Request/response examples in code
- Error scenarios documented
- (Planned) Swagger/OpenAPI documentation

### 4. State Management & Frontend Architecture ✅

#### Global State Management
- **AuthContext**: Authentication state, user info, login/logout
- **TaskContext**: Tasks list, real-time updates, CRUD operations
- **Context Hooks**: useAuth(), useTasks() custom hooks
- **Local Storage**: Persistent token storage

#### Component Architecture
- **Functional Components**: All components are functional with hooks
- **Custom Hooks**: Reusable logic (useAuth, useTasks)
- **Component Composition**: Nested, reusable components
- **Props Drilling Prevention**: Context API reduces prop drilling

#### Routing & Navigation
- **React Router v6**: Protected routes and navigation
- **ProtectedRoute Component**: Guards authenticated endpoints
- **Route Transitions**: Smooth navigation between pages
- **Redirect Logic**: Automatic redirect based on auth state

#### Styling & Theming
- **CSS Modules**: Modular styling for components
- **Inline Styles**: React inline styles for dynamic theming
- **Dark/Light Modes**: Full theme support with context
- **Responsive Design**: Mobile-first approach with media queries
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation

#### Accessibility (a11y)
- **ARIA Labels**: Descriptive labels for screen readers
- **Keyboard Navigation**: Full keyboard support
- **Color Contrast**: WCAG AA compliant color combinations
- **Semantic HTML**: Proper use of HTML elements
- **Focus Management**: Visible focus indicators

### 5. Real-time & Interactive Features ✅

#### WebSocket Communication
- **Socket.io Integration**: Bidirectional real-time communication
- **Event Listeners**: Task create, update, delete events
- **Auto-reconnection**: Automatic reconnection on disconnect
- **Room Management**: User-specific task rooms

#### User Experience
- **Optimistic UI Updates**: Immediate UI feedback on user actions
- **Loading States**: Loading indicators for async operations
- **Toast Notifications**: Success, error, and info notifications
- **Skeleton Screens**: Placeholder content while loading

### 6. Testing & Quality Assurance ✅

#### Code Quality
- **ESLint**: Enforced code style and best practices
- **Error Boundaries**: React error boundaries for crash prevention
- **Console Warnings**: Development warnings for debugging

#### Testing Infrastructure (Planned)
- **Unit Tests**: Jest for component and function testing
- **Integration Tests**: Testing API and context integration
- **E2E Tests**: Cypress for full user flow testing
- **Coverage Reports**: Code coverage tracking

#### Code Organization
- **Git Version Control**: Organized commit history
- **Branch Strategy**: Feature branches and main branch protection
- **Code Comments**: Self-documenting code with JSDoc
- **Consistent Naming**: Clear, descriptive variable and function names

### 7. Deployment & DevOps ✅

#### Development Environment
- **Node.js**: v22.19.0 with npm packages
- **Nodemon**: Auto-reload on file changes
- **Environment Variables**: `.env` file configuration
- **Local MongoDB**: Development database setup

#### Production Readiness (Planned)
- **Docker**: Containerization for backend and frontend
- **Docker Compose**: Multi-container orchestration
- **Environment Separation**: Development, staging, production configs
- **Health Checks**: Server health monitoring endpoints

#### CI/CD Pipeline (Planned)
- **GitHub Actions**: Automated testing and deployment
- **Automated Tests**: Run tests on every commit
- **Build Automation**: Automated build process
- **Deployment Automation**: One-click deployment to production

#### Monitoring & Logging (Planned)
- **Error Logging**: Centralized error tracking
- **Performance Monitoring**: Response time and resource tracking
- **User Analytics**: User behavior and engagement tracking
- **Uptime Monitoring**: Service availability tracking

### 8. Developer Experience ✅

#### Development Tools
- **Nodemon**: Auto-restart server on changes
- **React DevTools**: Browser extension for debugging
- **MongoDB Compass**: GUI for database management
- **Postman**: API testing and documentation
- **VS Code Extensions**: ESLint, Prettier integration

#### Code Consistency
- **Prettier**: Automatic code formatting
- **ESLint**: Code quality enforcement
- **Consistent Structure**: Organized file structure
- **Naming Conventions**: Consistent naming patterns

#### Version Control
- **Git**: Local version control
- **GitHub**: Remote repository hosting
- **Branching Strategy**: Feature branch workflow
- **Commit Messages**: Clear, descriptive commit messages

### 9. User Experience Enhancements ✅

#### Responsive Design
- **Mobile-First**: Design optimized for mobile devices
- **Breakpoints**: Tablet and desktop optimizations
- **Flexible Layout**: CSS Grid and Flexbox usage
- **Touch-Friendly**: Large buttons and spacing for touch

#### Loading & Performance
- **Loading States**: Clear loading indicators
- **Skeleton Screens**: Placeholder content
- **Progressive Enhancement**: Core functionality works without JS
- **Lazy Loading**: Images and components load on demand

#### User Feedback
- **Toast Notifications**: Success/error/info messages
- **Form Validation**: Real-time input validation
- **Error Messages**: Clear, actionable error descriptions
- **Confirmation Dialogs**: Important action confirmations

#### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Semantic HTML and ARIA
- **Color Contrast**: WCAG AA compliance
- **Focus Indicators**: Clear focus states

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 14 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn** package manager

## 🔧 Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd task-management-app
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment variables file
cp .env.example .env

# Edit .env file with your configuration:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/taskmanager
# JWT_SECRET=your_secret_key_here
# JWT_EXPIRE=7d
# CLIENT_URL=http://localhost:3000
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install
```

### 4. Database Setup

Make sure MongoDB is running on your system:

**For local MongoDB:**
```bash
# Start MongoDB service (varies by OS)
# Windows: Start MongoDB service from Services
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

**For MongoDB Atlas:**
- Create a cluster on [MongoDB Atlas](https://www.mongodb.com/atlas)
- Get your connection string
- Update the `MONGODB_URI` in your `.env` file

## 🚦 Running the Application

### Development Mode

1. **Start the Backend Server:**
```bash
cd backend
npm run dev
```
The backend will run on `http://localhost:5000`

2. **Start the Frontend Development Server:**
```bash
cd frontend
npm start
```
The frontend will run on `http://localhost:3000`

### Production Mode

1. **Build the Frontend:**
```bash
cd frontend
npm run build
```

2. **Start the Backend:**
```bash
cd backend
npm start
```

## 📁 Project Structure

```
task-management-app/
├── backend/
│   ├── models/
│   │   ├── User.js              # User schema with validation
│   │   └── Task.js              # Task schema with relations
│   ├── routes/
│   │   ├── auth.js              # Authentication endpoints
│   │   └── tasks.js             # Task CRUD endpoints
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication middleware
│   │   └── errorHandler.js      # Centralized error handling
│   ├── utils/
│   │   └── validators.js        # Input validation helpers
│   ├── server.js                # Express server setup
│   ├── package.json             # Backend dependencies
│   ├── .env                     # Environment variables
│   └── .gitignore
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js                # Navigation component
│   │   │   ├── TaskCard.js              # Individual task display
│   │   │   ├── TaskForm.js              # Task creation/editing
│   │   │   ├── ProtectedRoute.js        # Route protection
│   │   │   ├── KanbanBoard.js           # Kanban view component
│   │   │   ├── CalendarView.js          # Calendar view component
│   │   │   └── AnalyticsDashboard.js    # Analytics component
│   │   ├── pages/
│   │   │   ├── Login.js                 # Login page
│   │   │   ├── Register.js              # Registration page
│   │   │   └── Dashboard.js             # Main dashboard
│   │   ├── context/
│   │   │   ├── AuthContext.js           # Authentication state
│   │   │   └── TaskContext.js           # Task state & real-time
│   │   ├── hooks/
│   │   │   ├── useAuth.js               # Authentication hook
│   │   │   └── useTasks.js              # Tasks hook
│   │   ├── App.js                       # Main app component
│   │   ├── index.js                     # Entry point
│   │   ├── index.css                    # Global styles
│   │   └── .env                         # Environment variables
│   ├── package.json             # Frontend dependencies
│   └── .gitignore
├── .gitignore
├── README.md                    # Project documentation
└── package.json                 # Root package.json (optional)
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)

### Tasks
- `GET /api/tasks` - Get all tasks for authenticated user
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## 🔄 Real-time Features

The application uses Socket.io for real-time updates:

- **Task Creation**: Instantly appears for all connected clients
- **Task Updates**: Status changes reflect immediately
- **Task Deletion**: Removed in real-time across all sessions

## 🎨 UI Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Task Status Badges**: Visual indicators for task status
- **Priority Colors**: Color-coded priority levels
- **Due Date Tracking**: Overdue task highlighting
- **Search & Filter**: Easy task organization
- **Toast Notifications**: User feedback for all actions

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment (Heroku example)
1. Create a Heroku app
2. Set environment variables in Heroku Config Vars
3. Deploy using Heroku CLI or GitHub integration

### Frontend Deployment (Netlify/Vercel example)
1. Build the frontend: `npm run build`
2. Deploy the `build` folder to your hosting service
3. Configure environment variables for production API URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Learning Outcomes

This project demonstrates:
- Full-stack JavaScript development
- RESTful API design
- Database modeling with MongoDB
- User authentication with JWT
- Real-time communication with Socket.io
- React hooks and Context API
- State management patterns
- Responsive web design
- CRUD operations
- Error handling and validation

## 🗺️ Development Roadmap

### Phase 1: Core Foundation ✅ (Completed)
- [x] User authentication (JWT + bcrypt)
- [x] Basic CRUD operations
- [x] Real-time updates (Socket.io)
- [x] Task filtering and search
- [x] Responsive UI design
- [x] Task statistics dashboard
- [x] Subtasks and comments
- [x] Tags and categories
- [x] Dark/Light theme toggle
- [x] Toast notifications

### Phase 2: Advanced Views 🚀 (In Progress)
- [ ] Kanban board view with drag-and-drop
- [ ] Calendar view with task visualization
- [ ] Analytics dashboard with metrics
- [ ] Multiple view switching
- [ ] Advanced filtering options
- [ ] Task export functionality
- [ ] Performance optimizations

### Phase 3: Enterprise Features 📋 (Planned)
- [ ] Team collaboration features
- [ ] File attachments upload
- [ ] Recurring task support
- [ ] Task templates
- [ ] Mobile PWA
- [ ] AI-powered suggestions
- [ ] Two-factor authentication
- [ ] OAuth integration (Google, GitHub)
- [ ] Multi-workspace support
- [ ] Advanced reporting

### Phase 4: DevOps & Infrastructure 🔧 (Planned)
- [ ] Docker containerization
- [ ] Docker Compose setup
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Automated testing suite
- [ ] Monitoring and logging
- [ ] Performance tracking
- [ ] Security auditing
- [ ] Load testing

## 🎯 Production Checklist

### Security
- [x] JWT authentication
- [x] Password hashing (bcrypt)
- [x] Input validation
- [x] CORS configuration
- [ ] Rate limiting middleware
- [ ] HTTPS/SSL setup
- [ ] Security headers
- [ ] 2FA implementation
- [ ] Encryption for sensitive data

### Performance
- [x] Modular code structure
- [x] Database indexing
- [x] Client-side optimization
- [ ] Gzip compression
- [ ] Caching strategy
- [ ] CDN integration
- [ ] Image optimization
- [ ] Bundle size optimization

### Reliability
- [x] Error handling
- [x] Input validation
- [ ] Comprehensive logging
- [ ] Error tracking (Sentry)
- [ ] Backup strategy
- [ ] Disaster recovery
- [ ] High availability setup

### Maintenance
- [x] Clear code structure
- [x] Meaningful comments
- [x] Git version control
- [ ] API documentation (Swagger)
- [ ] Architecture documentation
- [ ] Deployment guide
- [ ] Troubleshooting guide

## 🚀 Getting Started for Production

### Pre-deployment Checklist
1. **Environment Setup**
   - [ ] Set up production database (MongoDB Atlas)
   - [ ] Configure environment variables
   - [ ] Set up email service (SendGrid, AWS SES)
   - [ ] Configure CDN for static assets

2. **Security**
   - [ ] Change all default keys and secrets
   - [ ] Enable HTTPS/SSL
   - [ ] Configure firewall rules
   - [ ] Set up DDoS protection

3. **Testing**
   - [ ] Run full test suite
   - [ ] Perform security audit
   - [ ] Load testing
   - [ ] Cross-browser testing

4. **Deployment**
   - [ ] Build optimized frontend bundle
   - [ ] Set up CI/CD pipeline
   - [ ] Configure monitoring and logging
   - [ ] Set up backup and recovery

5. **Post-deployment**
   - [ ] Monitor application health
   - [ ] Track error rates
   - [ ] Analyze user behavior
   - [ ] Plan iterative improvements

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`

2. **CORS Issues**
   - Verify `CLIENT_URL` in backend `.env`
   - Check if both servers are running

3. **Socket.io Connection Issues**
   - Ensure both frontend and backend are using same domain
   - Check firewall settings

4. **JWT Token Issues**
   - Verify `JWT_SECRET` is set in `.env`
   - Check token expiration settings

## 📞 Support

If you encounter any issues or have questions, please:
1. Check the troubleshooting section
2. Search existing issues on GitHub
3. Create a new issue with detailed information

---

Happy coding! 🎉