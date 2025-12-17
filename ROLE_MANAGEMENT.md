# Hospital Admin Panel - Role Management System

A comprehensive Next.js admin panel for hospital management with role-based access control supporting **Admin**, **Receptionist**, **Doctor**, and **Laboratory** roles.

![Next.js](https://img.shields.io/badge/Next.js-16.0.10-black)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.16-38bdf8)

## 🌟 Features

- **Role-Based Access Control**: Four distinct user roles with customized dashboards and navigation
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **Modern UI**: Beautiful, responsive design with dark mode support
- **Dashboard Variants**: Different dashboard layouts for each role
- **Dynamic Navigation**: Role-specific sidebar menus
- **MongoDB Integration**: Mongoose ODM for data management

## 📋 Table of Contents

- [Roles Overview](#roles-overview)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [User Management](#user-management)
- [Role-Based Features](#role-based-features)
- [Project Structure](#project-structure)
- [Development](#development)

## 👥 Roles Overview

### 1. **Admin** (Full Access)
- Complete system access
- Dashboard with analytics and charts
- Full navigation menu
- User management capabilities
- Access to all features

### 2. **Receptionist** (Front Desk Operations)
- Card-based dashboard interface
- No sidebar navigation (uses action cards)
- Features:
  - Dashboard overview
  - Add new donors
  - Active donor cases management
  - Donor history tracking
  - Semen management
  - Notifications

### 3. **Doctor** (Medical Operations)
- Dashboard with analytics
- Focused navigation menu
- Features:
  - Active donors
  - Donor history
  - Medical reports
  - Patient data access

### 4. **Laboratory** (Lab Management)
- Dashboard with analytics
- Lab-specific navigation
- Features:
  - Semen storage management
  - Lab tests
  - Donor history
  - Sample tracking

## 🚀 Installation

### Prerequisites

- Node.js 18+ 
- MongoDB database
- npm or yarn package manager

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hospital-AdminPanel
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables** (see [Environment Setup](#environment-setup))

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🔧 Environment Setup

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/hospital-admin
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hospital-admin

# JWT Secret (use a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# API Endpoint
NEXT_PUBLIC_API_END_POINT=http://localhost:3000/api
```

### Generating a Secure JWT Secret

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or using OpenSSL
openssl rand -hex 32
```

## 👤 User Management

### Creating Users

#### Method 1: Using Sign-Up Page (Default: Admin Role)

1. Navigate to `/auth/sing-up`
2. Fill in the registration form
3. User will be created with **admin** role by default

#### Method 2: Direct Database Creation

Connect to your MongoDB database and insert users:

```javascript
// Example: Creating a receptionist user
db.users.insertOne({
  fullName: "Jane Doe",
  email: "receptionist@hospital.com",
  password: "$2a$10$...", // Use bcrypt to hash the password
  role: "receptionist",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

#### Method 3: Using MongoDB Compass or Studio 3T

1. Connect to your database
2. Navigate to the `users` collection
3. Insert a new document with the following structure:

```json
{
  "fullName": "John Smith",
  "email": "doctor@hospital.com",
  "password": "hashed_password_here",
  "role": "doctor",
  "createdAt": "2025-12-17T00:00:00.000Z",
  "updatedAt": "2025-12-17T00:00:00.000Z"
}
```

**Note**: Password must be hashed using bcrypt. You can use this Node.js script:

```javascript
const bcrypt = require('bcryptjs');
const password = 'your-password';
const hashedPassword = bcrypt.hashSync(password, 10);
console.log(hashedPassword);
```

### Available Roles

When creating users, use one of these exact role values:
- `admin` - Full system access
- `receptionist` - Front desk operations
- `doctor` - Medical operations
- `laboratory` - Lab management

## 🎯 Role-Based Features

### Admin Dashboard
- **Overview Cards**: Quick stats and metrics
- **Charts**: Payment overview, weekly profit
- **Full Navigation**: Access to all menu items
- **User Management**: Can manage all users (future feature)

### Receptionist Dashboard
- **Card-Based Interface**: 6 action cards for quick access
- **No Sidebar**: Streamlined interface for efficiency
- **Time Display**: Current time and date
- **User Profile**: Employee ID and role display
- **Quick Actions**:
  - View dashboard
  - Add new donors
  - Manage active cases
  - View donor history
  - Semen management
  - Check notifications

### Doctor Dashboard
- **Analytics Dashboard**: Same as admin
- **Focused Navigation**: Medical-specific menu items
- **Patient Access**: View and manage patient data
- **Medical Reports**: Access to all medical documentation

### Laboratory Dashboard
- **Analytics Dashboard**: Same as admin
- **Lab Navigation**: Lab-specific menu items
- **Sample Management**: Track and manage samples
- **Test Results**: Record and view lab tests

## 📁 Project Structure

```
hospital-AdminPanel/
├── src/
│   ├── app/
│   │   ├── (home)/
│   │   │   ├── dashboard/
│   │   │   │   └── page.jsx          # Main dashboard page
│   │   │   └── layout.jsx            # Role-aware layout
│   │   ├── auth/
│   │   │   ├── sign-in/              # Login page
│   │   │   └── sing-up/              # Registration page
│   │   └── api/
│   │       └── auth/                 # Authentication APIs
│   ├── components/
│   │   ├── Auth/                     # Authentication components
│   │   ├── Dashboard/
│   │   │   ├── DashboardSwitcher.jsx # Role-based router
│   │   │   ├── AdminDashboard.jsx    # Admin dashboard
│   │   │   └── ReceptionistDashboard.jsx # Receptionist dashboard
│   │   └── Layouts/
│   │       ├── sidebar/
│   │       │   └── data/
│   │       │       └── index.js      # Role-based navigation
│   │       └── header/
│   ├── modals/
│   │   └── userModal.js              # User schema with roles
│   ├── utils/
│   │   └── roleUtils.js              # Role management utilities
│   └── controller/
│       └── authcontroller.js         # Authentication logic
├── .env.local                        # Environment variables
└── package.json
```

## 🔐 Authentication Flow

1. **User Login**: User enters credentials at `/auth/sign-in`
2. **Validation**: Server validates credentials and generates JWT
3. **Token Storage**: JWT stored in cookies and localStorage
4. **User Data**: Complete user object (including role) stored in localStorage
5. **Role Detection**: `DashboardSwitcher` reads role from localStorage
6. **Dashboard Routing**: User redirected to role-specific dashboard
7. **Navigation**: Sidebar loads role-specific menu items

## 🛠️ Development

### Running the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
npm start
```

### Code Structure Guidelines

- **Components**: Reusable UI components in `/src/components`
- **Pages**: Next.js pages in `/src/app`
- **Utilities**: Helper functions in `/src/utils`
- **Modals**: Database schemas in `/src/modals`
- **Controllers**: Business logic in `/src/controller`

## 🔑 Key Files

### Role Management
- `src/utils/roleUtils.js` - Role constants and helper functions
- `src/modals/userModal.js` - User schema with role enum
- `src/components/Layouts/sidebar/data/index.js` - Role-based navigation

### Authentication
- `src/components/Auth/SigninWithPassword.jsx` - Login component
- `src/controller/authcontroller.js` - Auth business logic
- `src/app/api/auth/sign-in/route.js` - Login API endpoint

### Dashboards
- `src/components/Dashboard/DashboardSwitcher.jsx` - Role router
- `src/components/Dashboard/AdminDashboard.jsx` - Admin interface
- `src/components/Dashboard/ReceptionistDashboard.jsx` - Receptionist interface

## 🎨 Customization

### Adding New Roles

1. **Update User Schema** (`src/modals/userModal.js`):
   ```javascript
   enum: ["admin", "receptionist", "doctor", "laboratory", "new-role"]
   ```

2. **Add Role Constant** (`src/utils/roleUtils.js`):
   ```javascript
   export const ROLES = {
     // ... existing roles
     NEW_ROLE: "new-role",
   };
   ```

3. **Create Navigation** (`src/components/Layouts/sidebar/data/index.js`):
   ```javascript
   const NEW_ROLE_NAV = [
     // ... navigation items
   ];
   ```

4. **Create Dashboard Component**:
   ```javascript
   // src/components/Dashboard/NewRoleDashboard.jsx
   ```

5. **Update DashboardSwitcher** (`src/components/Dashboard/DashboardSwitcher.jsx`):
   ```javascript
   case ROLES.NEW_ROLE:
     return <NewRoleDashboard />;
   ```

## 🐛 Troubleshooting

### Issue: "Invalid role" error
**Solution**: Ensure the role in the database exactly matches one of: `admin`, `receptionist`, `doctor`, `laboratory`

### Issue: Redirected to login after successful authentication
**Solution**: Check that localStorage is enabled in your browser and JWT_SECRET is set in `.env.local`

### Issue: Sidebar not showing correct menu items
**Solution**: Clear localStorage and login again to refresh user data

### Issue: MongoDB connection error
**Solution**: Verify MONGODB_URI in `.env.local` and ensure MongoDB is running

## 📝 License

This project is based on NextAdmin template. Please refer to the original license.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📧 Support

For issues and questions, please open an issue in the repository.

---

**Built with ❤️ using Next.js, React, and MongoDB**
