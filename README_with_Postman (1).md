# Dental Appointment Management API

## 📌 Overview
This backend API allows **user authentication**, **patient profile management**, and **appointment scheduling** for a dental clinic.  
It is built with **Node.js**, **Express**, and **MongoDB** and follows an MVC structure.

## 📂 Features
- **User Authentication**: Register, Login (JWT-based)
- **Appointments**: Create, read, update, delete appointments
- **Patient Profiles**: Create/update and retrieve patient details
- **Role-based Access Control**: Admin vs Patient permissions

---

## 📑 API Route Table

| Method  | Endpoint               | Description |
|---------|------------------------|-------------|
| **POST**   | `/api/auth/register`     | Register a new user (default role: patient) |
| **POST**   | `/api/auth/login`        | Login and receive JWT token |
| **GET**    | `/api/appointments`      | Get appointments (admin: all, patient: own) |
| **POST**   | `/api/appointments`      | Create a new appointment |
| **PATCH**  | `/api/appointments/:id`  | Update an appointment |
| **DELETE** | `/api/appointments/:id`  | Delete an appointment |
| **GET**    | `/api/patients/me`       | Get logged-in patient profile |
| **POST**   | `/api/patients`          | Create or update patient profile |

---

## 📌 Authentication
Most endpoints require a **JWT token** sent in the `Authorization` header:
```
Authorization: Bearer <token>
```

---

## 📤 Sample Requests & Responses

### 1️⃣ Register User
**Request**
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```
**Response**
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "60d2f0...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient"
  }
}
```

### 2️⃣ Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "123456"
}
```
**Response**
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "60d2f0...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient"
  }
}
```

### 3️⃣ Create Appointment
```http
POST /api/appointments
Authorization: Bearer jwt-token-here
Content-Type: application/json

{
  "patientName": "John Doe",
  "dentist": "Dr. Smith",
  "date": "2025-08-15T09:00:00Z",
  "reason": "Tooth extraction"
}
```

---

## ⚙️ Setup Instructions

1. **Clone the repository**
```bash
git clone <repo-url>
cd COMP229-GroupProject-Part2
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file**
```env
PORT=8080
MONGO_URI=mongodb://localhost:27017/dental_app
JWT_SECRET=your_jwt_secret
```

4. **Run the server**
```bash
npm start
```
The API will be available at:  
```
http://localhost:8080
```

---

## 🧪 Testing Notes
- Use **Thunder Client** or **Postman** to test each route.
- Test with **valid and invalid tokens**.
- Check **role-based access** by logging in as `admin` and `patient`.
- Test **edge cases** (duplicate email, booking conflicts, missing fields).

---

## 📥 Postman Collection
To speed up testing, you can import the ready-made Postman collection:

[📥 Download Dental_API_Collection.postman_collection.json](Dental_API_Collection.postman_collection.json)

This collection includes:
- Auth (Register, Login)
- Patients (Get & Update Profile)
- Appointments (CRUD)
- Pre-configured environment variables for:
  - `baseUrl`
  - `token`
  - `appointmentId`

---

## 👨‍💻 Maintainer
**Role:** QA & Documentation Lead  
Responsible for API documentation, route testing, and edge case verification.

