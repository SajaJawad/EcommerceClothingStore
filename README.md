# 🛍️ E-Commerce Clothing Store

A full-stack e-commerce web application built to provide a complete online shopping experience for customers and an efficient management system for administrators.

The platform includes product discovery, shopping cart management, wishlist functionality, authentication, checkout, order tracking, and a dedicated admin dashboard for managing products and customer orders.

---

## 🌐 Live Demo

[View Live Project](https://ecommerce-clothing-store-ten.vercel.app/)

> Replace `YOUR_LIVE_DEMO_LINK` with your deployed project URL.

---

## ✨ Features

### 👤 Customer Features

* User authentication using JWT
* Product browsing and discovery
* Product search and filtering
* Product details pages
* Shopping cart management
* Update product quantities
* Wishlist functionality
* Checkout workflow
* Stripe Checkout integration
* Cash on Delivery option
* Customer order tracking
* Responsive design across desktop, tablet, and mobile devices

### 🛠️ Admin Features

* Admin dashboard
* Product management
* Add, update, and delete products
* Product image uploads
* Order management
* Order status management
* Automatic order-status updates using periodic API polling

---

## 🧰 Tech Stack

### Frontend

* React.js
* JavaScript
* Tailwind CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose

### Authentication

* JWT Authentication

### Payments

* Stripe Checkout
* Cash on Delivery

### Media Management

* Multer
* Cloudinary

---

## 🏗️ Application Architecture

The project follows a full-stack architecture with a React frontend communicating with a Node.js and Express.js backend through REST APIs.

The backend handles:

* Authentication
* Product management
* Order management
* Database operations
* Administrative functionality
* Payment workflows

MongoDB Atlas is used as the main database, while Mongoose is used for data modeling.

Cloudinary is used to store product images uploaded through the Admin Dashboard.

---

## 🔐 Authentication

The application uses JWT-based authentication to manage protected functionality and authenticated user sessions.

Authentication is used to protect customer and administrative workflows.

---

## 💳 Checkout & Payments

The application supports two checkout options:

### Stripe Checkout

Customers can complete online payments using Stripe Checkout.

### Cash on Delivery

Customers can also select Cash on Delivery during the purchasing process.

---

## 🖼️ Image Uploads

Product images are uploaded through the Admin Dashboard.

The upload workflow uses:

* Multer
* Cloudinary

This allows administrators to upload and manage product media without storing large image files directly inside the application.

---

## 📦 Order Management

Customers can track their orders after checkout.

Administrators can manage orders through the Admin Dashboard.

The project also implements periodic API polling to automatically refresh and update order statuses.

---

## 📱 Responsive Design

The application is designed to work across:

* Desktop
* Tablet
* Mobile

Tailwind CSS is used to build responsive layouts and reusable interface components.

---

## ⚙️ Installation

Clone the repository:

```bash
git clone YOUR_REPOSITORY_URL
```

Move into the project directory:

```bash
cd ecommerce-clothing-store
```

Install dependencies:

```bash
npm install
```

If the frontend and backend are stored in separate directories, install dependencies for both:

```bash
cd frontend
npm install

cd ../backend
npm install
```

---

## 🔑 Environment Variables

Create the required `.env` files for the frontend and backend.

Typical environment variables may include:

```env
MONGODB_URI=
JWT_SECRET=
STRIPE_SECRET_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Do not upload real environment variables or secret keys to GitHub.

Add `.env` to your `.gitignore` file.

---

## ▶️ Running the Project

Start the frontend:

```bash
npm run dev
```

Start the backend:

```bash
npm run server
```

> Update these commands if your project uses different scripts.

---

## 📂 Main Functionality

```text
E-Commerce Platform
│
├── Customer Interface
│   ├── Products
│   ├── Search & Filtering
│   ├── Cart
│   ├── Wishlist
│   ├── Authentication
│   ├── Checkout
│   └── Order Tracking
│
├── Admin Dashboard
│   ├── Product Management
│   ├── Image Uploads
│   └── Order Management
│
└── Backend API
    ├── Node.js
    ├── Express.js
    ├── MongoDB
    ├── Mongoose
    └── JWT Authentication
```

---

## 🎯 Project Goals

This project was developed to demonstrate practical full-stack web development skills, including:

* Building reusable React interfaces
* Designing responsive layouts
* Developing REST APIs
* Implementing authentication
* Working with MongoDB and Mongoose
* Integrating third-party payment services
* Managing cloud-based media uploads
* Building administrative workflows
* Connecting frontend and backend applications

---

## 👩‍💻 Developer

**Saja Qudeih**

Software Engineer & Frontend Developer

* GitHub: [SajaJawad](https://github.com/SajaJawad)
* Portfolio: https://portfolio-lake-chi-20.vercel.app/
* Demo: https://ecommerce-clothing-store-ten.vercel.app/

---

## 📄 License

This project is intended for portfolio and educational purposes.
