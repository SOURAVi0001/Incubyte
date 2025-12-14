# Sweet Shop Management System

A full-stack MERN application for managing a sweet shop's inventory, featuring user authentication, role-based access control (Admin/User), and real-time stock updates. Built with a strict Test-Driven Development (TDD) methodology.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Axios, React Router
- **Backend:** Node.js, Express.js, Mongoose
- **Database:** MongoDB
- **Testing:** Jest, Supertest

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- MongoDB (Local instance running on port 27017 or cloud URI)

### Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the server:
    ```bash
    npm start
    ```
    The server runs on `http://localhost:5001`.
4.  Run Tests:
    ```bash
    npm test
    ```

### Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user and receive JWT

### Sweets (Inventory)

- `GET /api/sweets` - Get all sweets (Public)
- `POST /api/sweets` - Create a new sweet (Admin only)
- `POST /api/sweets/:id/purchase` - Purchase a sweet (Decrements stock)
- `POST /api/sweets/:id/restock` - Restock a sweet (Admin only)

## My AI Usage

I utilized GitHub Copilot to accelerate the development process using a strict Test-Driven Development (TDD) approach. This workflow was chosen to ensure code robustness and maintain high standards of reliability.

1.  **TDD Scaffolding**: I instructed the AI to write the Jest/Supertest test suites **before** writing any implementation code. This ensured that all business logic and edge cases (e.g., preventing purchases when out of stock, restricting admin routes) were clearly defined and verifiable from the start.
2.  **Boilerplate Generation**: Once the tests were confirmed as accurate representations of the requirements, I used the AI to generate the necessary controller, model, and route boilerplate to satisfy those tests.

This workflow allowed me to focus on logic verification and architectural decisions rather than spending time on repetitive syntax typing, resulting in a more reliable application built in less time.
