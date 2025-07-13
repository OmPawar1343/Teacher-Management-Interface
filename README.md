# Teacher Management Interface

A modern React app for managing teachers, students, classes, attendance, and schedules—styled with glassmorphism and dark mode.

---

## 🚀 Live Demo

[https://teacher-management-systen.netlify.app/](https://teacher-management-systen.netlify.app/)

---

## 📹 Loom Video Walkthrough

[Loom Video: Code Walkthrough, Features, and Design Decisions](https://www.loom.com/share/cd3522d9cf0c4e8a9b4b717be1f3f5af?sid=09860544-62d0-4530-bdc8-25af230de1f0)

---

## 📦 Repository

[GitHub: OmPawar1343/Teacher-Management-Interface](https://github.com/OmPawar1343/Teacher-Management-Interface)

---

## 🛠️ Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/OmPawar1343/Teacher-Management-Interface.git
   cd Teacher-Management-Interface
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm start
   ```
4. **Open in browser:**  
   Visit [http://localhost:3000](http://localhost:3000)

---

## ℹ️ App Overview

- Manage teachers, students, and classes (CRUD)
- Track attendance (present/absent/late)
- View schedules and reports
- CSV import/export for bulk data
- Animated welcome splash, glassmorphism, dark mode, responsive UI
- All data is stored in your browser (no backend required)

---

## ✨ Features

- **Teacher Management:**  
  Add, edit, delete, and view teacher profiles (name, age, birth date, subject, hobby, email, phone, gender, DOB, address).

- **Student Management:**  
  Manage student records (name, roll, gender, class, section). All students are assigned to class 10A by default.

- **Class Management:**  
  Create classes by subject, assign teachers, and auto-assign students. Default classes include Mathematics, Physics, English, History, and Chemistry (all 10A).

- **Attendance Tracking:**  
  Mark daily attendance (present/absent/late) for each class. Attendance works for all default 10A classes.

- **Schedule Management:**  
  View and manage class schedules and the school calendar.

- **Reports & Analytics:**  
  View class-wise attendance summaries and analytics. See present/absent/late counts per class.

- **CSV Import/Export:**  
  Bulk manage students and teachers via CSV files.

- **Animated Welcome Splash:**  
  Engaging intro animation using BlurText and Framer Motion.

- **Responsive UI:**  
  Works on desktop and mobile, with glassmorphism and dark mode.

- **LocalStorage Persistence:**  
  All data is stored in the browser for simplicity and offline use—no backend required.

---

## 🎨 Design Decisions & Rationale

- **Glassmorphism & Dark Mode:**  
  For a modern, visually appealing, and eye-friendly interface.

- **LocalStorage:**  
  All data is stored in the browser for simplicity, privacy, and offline use.

- **Component-based Architecture:**  
  Promotes code reuse and maintainability.

- **Framer Motion:**  
  Used for smooth, modern animations (e.g., splash screen).

- **Mobile-first Design:**  
  Ensures usability on all devices.

- **CSV Support:**  
  Makes bulk data management easy for users.

---

## 📝 Assumptions

- **No Backend:**  
  All data is stored in LocalStorage; no server or database is required.

- **Single User:**  
  The app is designed for use by a single teacher/admin at a time.

- **Offline Capable:**  
  The app works without an internet connection after initial load.

- **Modern Browser:**  
  Requires a browser with ES6+ support.

- **Initial Data:**  
  All students and classes are set to 10A by default for demo/testing.

---

## ℹ️ Notes

- **Attendance:**  
  By default, all students are in class 10 A. Attendance works for these classes. To use other classes, add them via the Classes section.



---

For a video walkthrough, see the [Loom video](https://www.loom.com/share/cd3522d9cf0c4e8a9b4b717be1f3f5af?sid=09860544-62d0-4530-bdc8-25af230de1f0).




