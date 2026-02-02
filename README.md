# Doctor Appointment Booking System

A full-stack web application for scheduling medical appointments. This project serves as a capstone assignment to demonstrate system architecture, database integrity, and modern web technologies.

## Development Methodology & Attribution

**Note on AI Usage:**
This project explores an AI-assisted development workflow. The goal was to act as a System Architect, delegating specific implementation tasks to automated tools.

* **Architecture & Integration:** Designed by **Temirlan**. Responsible for the database schema, system configuration (Arch Linux, Postgres), and connecting frontend with backend.
* **UI/UX Design:** The visual interface was prototyped using **Figma AI**. The React implementation follows this generated design.
* **Backend Implementation:** The Rust (Axum) logic and boilerplate code were generated with the assistance of LLMs, then reviewed and deployed by the author.


---

## 📸 Screenshots

<div align="center">
  <img src="image-1.png" alt="Home Page" width="45%" />
  <img src="image-2.png" alt="Booking Modal" width="45%" />
</div>

---

## Tech Stack

**Backend**
* Rust (Axum framework)
* PostgreSQL
* SQLx (Database queries)

**Frontend**
* React
* Vite
* TailwindCSS

## Features

* **REST API:** Handles booking requests and doctor data retrieval.
* **Data Safety:** Uses PostgreSQL constraints to prevent conflicting appointments (double-booking).
* **Responsive UI:** Works on mobile and desktop devices.
* **State Management:** React hooks for real-time interface updates.

---

## Setup Instructions

### Prerequisites
* Rust & Cargo installed
* Node.js & npm installed
* PostgreSQL running locally

### 1. Setup Database
Create a PostgreSQL database and configure the `.env` file in the `backend` folder:
```bash
# inside /backend/.env 
DATABASE_URL=postgres://postgres:your_password@localhost/appointment_db
SERVER_HOST=127.0.0.1
SERVER_PORT=8080 
```


### 2. Run Backend (Rust)

```bash
cd backend
cargo run
# The server will start at http://localhost:8080
# Migrations will apply automatically!
```

### 3. Run Frontend (React)
```bash
cd frontend
npm install
npm run dev
# The UI will start at http://localhost:5173
```

