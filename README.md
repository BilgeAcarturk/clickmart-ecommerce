# ClickMart

ClickMart is a full-stack e-commerce application built with **React**, **Node.js**, **Express.js**, **Prisma ORM**, and **MySQL**.

The project was developed during my Software Development Internship at **ERD Bilgi Teknolojileri A.Ş.** It includes user authentication, role-based authorization, product management, order processing, and administrative operations through a RESTful API architecture.

---

## Features

### Authentication

* User registration
* Secure login
* JWT-based authentication
* Forgot password
* Password reset via email
* Password validation

### Authorization

* Role-based access control
* Customer, Staff, and Administrator roles
* Protected routes
* Automatic token handling with Axios interceptors

### E-Commerce

* Product listing
* Shopping cart
* Checkout workflow
* Order creation
* Order management

### Administration

* Product management
* User management
* Staff management
* Dashboard
* Sales reports

### Backend

* RESTful API
* Prisma ORM integration
* MySQL database
* Global error handling middleware
* Transaction-based order processing
* Email service with Nodemailer
* Request validation

---

## Tech Stack

### Frontend

* React
* Vite
* React Router
* Axios
* CSS

### Backend

* Node.js
* Express.js
* Prisma ORM
* JWT
* Nodemailer

### Database

* MySQL

---

## Project Structure

```text
clickmart-ecommerce
│
├── sales-app-backend
│   ├── prisma
│   ├── src
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── routes
│   │   ├── services
│   │   └── server.js
│   └── package.json
│
└── web
    ├── public
    ├── src
    │   ├── api
    │   ├── components
    │   ├── pages
    │   └── css
    └── package.json
```

---

## Installation

Clone the repository.

```bash
git clone https://github.com/BilgeAcarturk/clickmart-ecommerce.git
```

### Backend

```bash
cd sales-app-backend
npm install
npm run dev
```

### Frontend

```bash
cd web
npm install
npm run dev
```

---

## Environment Variables

Create a `.env` file inside the backend directory.

```env
DATABASE_URL=
JWT_SECRET=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
PORT=4000
```

---

## Technical Highlights

* Developed a full-stack web application using React, Express.js, Prisma ORM, and MySQL.
* Implemented JWT-based authentication and role-based authorization.
* Built a complete checkout workflow from frontend to database.
* Integrated password recovery via email using Nodemailer.
* Used Prisma ORM for database access and transaction management.
* Implemented global error handling for consistent API responses.
* Structured the backend following RESTful API principles.

---

## Author

**Bilge Acartürk**

* GitHub: https://github.com/BilgeAcarturk
* LinkedIn: https://www.linkedin.com/in/bilgeacarturk
