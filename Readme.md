# 🛒 E-Commerce Application

A full-stack e-commerce application built with **React**, **Node.js**, **Express**, and **MongoDB**. Features include user authentication, product management, shopping cart, payment processing with Stripe, and admin analytics.

![E-Commerce Screenshot](frontend/public/screenshot-for-readme.png)

## ✨ Features

### 🔐 **Authentication & Authorization**
- JWT-based authentication with refresh tokens
- Role-based access control (Customer/Admin)
- Secure password hashing with bcrypt
- Redis session management

### 🛍️ **Shopping Experience**
- Product browsing with categories
- Shopping cart functionality
- Coupon system with discounts
- Stripe payment integration
- Order tracking and history

### 👑 **Admin Panel**
- Product management (CRUD operations)
- Sales analytics with interactive charts
- User management
- Coupon creation and management
- Real-time sales data visualization

### 🎨 **UI/UX**
- Responsive design with Tailwind CSS
- Smooth animations with Framer Motion
- Interactive charts with Recharts
- Toast notifications for user feedback

## 🚀 Tech Stack

### **Frontend**
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Zustand** - State management
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **Recharts** - Data visualization

### **Backend**
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Redis** - Caching & session storage
- **JWT** - Authentication
- **Stripe** - Payment processing
- **Cloudinary** - Image storage

### **Security & DevOps**
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **bcryptjs** - Password hashing
- **Environment variables** - Configuration management

## 📦 Installation & Setup

### **Prerequisites**
- Node.js (v16 or higher)
- MongoDB database
- Redis instance (Upstash recommended)
- Cloudinary account
- Stripe account

### **1. Clone the Repository**
```bash
git clone https://github.com/kgpgaurav/ecom_.git
cd ecom_
```

### **2. Install Dependencies**
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### **3. Environment Configuration**
Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000

# Database Configuration
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.pyhpdrg.mongodb.net/ecommerce_db?retryWrites=true&w=majority&appName=Cluster0

# Redis Configuration
UPSTASH_REDIS_URL=rediss://default:<password>@thankful-mosquito-34443.upstash.io:6379
UPSTASH_REDIS_TOKEN=your_redis_token

# Authentication Secrets
ACCESS_TOKEN_SECRET=your_super_secret_access_token
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# Client URL
CLIENT_URL=http://localhost:5173

# Environment
NODE_ENV=development
```

> **⚠️ Security Note:** Replace all placeholder values with your actual credentials. Never commit the `.env` file to version control.

### **4. Start the Application**

#### **Development Mode**
```bash
# Start backend server (runs on port 3000)
npm run dev

# In a new terminal, start frontend (runs on port 5173)
cd frontend
npm run dev
```

#### **Production Mode**
```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🛡️ API Endpoints

### **Authentication**
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/refresh-token` - Refresh access token

### **Products**
- `GET /api/products` - Get all products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/recommendations` - Get recommended products
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### **Cart**
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `DELETE /api/cart` - Remove item from cart
- `PUT /api/cart/:id` - Update cart item quantity

### **Payments**
- `POST /api/payments/create-checkout-session` - Create Stripe checkout
- `POST /api/payments/checkout-success` - Handle successful payment

### **Coupons**
- `GET /api/coupons` - Get available coupons
- `GET /api/coupons/validate/:code` - Validate coupon
- `POST /api/coupons` - Create coupon (Admin only)

### **Analytics** (Admin only)
- `GET /api/analytics` - Get sales analytics data

## 📁 Project Structure

```
├── backend/
│   ├── controllers/          # Route controllers
│   ├── middleware/           # Custom middleware
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── lib/                 # Utility libraries
│   └── server.js            # Server entry point
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   ├── stores/         # Zustand stores
│   │   └── lib/            # Utility functions
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── .env                    # Environment variables
├── .gitignore             # Git ignore rules
└── package.json           # Backend dependencies
```

## 🔧 Available Scripts

### **Root Directory Scripts (Backend)**
```bash
# Development
npm run dev          # Start backend with nodemon (auto-restart)
npm start           # Start backend in production mode
npm run build       # Install all dependencies and build frontend
npm test            # Run tests (currently not configured)
```

### **Frontend Scripts (from frontend/ directory)**
```bash
cd frontend

# Development
npm run dev         # Start Vite development server (port 5173)
npm run build       # Build frontend for production
npm run preview     # Preview production build locally
npm run lint        # Run ESLint for code quality
```

### **Complete Development Setup**
```bash
# Terminal 1: Start backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm run dev
```

### **Production Build Process**
```bash
# Build everything (runs automatically on deployment)
npm run build
# This will:
# 1. Install backend dependencies
# 2. Install frontend dependencies
# 3. Build frontend for production
```

## 🛠️ Configuration

### **Database Setup**
1. Create a MongoDB cluster (MongoDB Atlas recommended)
2. Create a database named `ecommerce_db`
3. Update `MONGO_URI` in your `.env` file

### **Redis Setup**
1. Create an Upstash Redis instance
2. Update `UPSTASH_REDIS_URL` and `UPSTASH_REDIS_TOKEN` in your `.env` file

### **Cloudinary Setup**
1. Create a Cloudinary account
2. Update Cloudinary credentials in your `.env` file

### **Stripe Setup**
1. Create a Stripe account
2. Get your secret key from Stripe dashboard
3. Update `STRIPE_SECRET_KEY` in your `.env` file

## 🚀 Deployment

### **Option 1: Separate Deployment (Recommended)**

#### **Backend Deployment (Render/Railway/Heroku)**
```bash
# Your backend is ready to deploy with:
# Build Command: npm install
# Start Command: npm start
# Environment: Node.js
```

#### **Frontend Deployment (Render Static/Vercel/Netlify)**
```bash
# Frontend build configuration:
# Root Directory: frontend
# Build Command: npm install && npm run build
# Publish Directory: dist
```

### **Option 2: Combined Deployment**
```bash
# Deploy everything together:
# Build Command: npm run build
# Start Command: npm start
# This builds frontend and serves it via backend
```

### **Environment Variables for Production**
Set these on your hosting platform:
```env
NODE_ENV=production
PORT=10000  # Or your hosting platform's default
MONGO_URI=your_mongodb_connection_string
UPSTASH_REDIS_URL=your_redis_url
UPSTASH_REDIS_TOKEN=your_redis_token
ACCESS_TOKEN_SECRET=your_super_secret_access_token
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
STRIPE_SECRET_KEY=your_live_stripe_secret_key
CLIENT_URL=https://your-frontend-domain.com
```

### **Quick Deploy Commands**
```bash
# Prepare for deployment
git add .
git commit -m "Deploy to production"
git push origin main

# For Heroku (combined deployment)
heroku create your-app-name
git push heroku main
```

> **📋 Detailed Deployment Guide:** Check `DEPLOYMENT_GUIDE.md` for step-by-step instructions for different hosting platforms.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Kumar Gaurav Prakash**
- GitHub: [@kgpgaurav](https://github.com/kgpgaurav)

## 🙏 Acknowledgments

- Thanks to all the open-source libraries used in this project
- Special thanks to the React and Node.js communities

---

⭐ If you found this project helpful, please give it a star!  

