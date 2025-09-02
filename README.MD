# OralVis Healthcare – Full-Stack Assignment

A minimal full-stack web app where **Technicians** upload dental scan images and **Dentists** view them.  
Built with **Express + SQLite + Cloudinary + JWT** (backend) and **React (Vite) + axios + react-router-dom + jsPDF** (frontend).

---

## ✨ Features

- **Role-based auth (RBAC)**: Technician / Dentist, JWT on the wire
- **Technician upload**: patient details + JPG/PNG → stored on **Cloudinary**, metadata in **SQLite**
- **Dentist viewer**: list all scans (name, id, type, region, date, thumbnail) + **View Full Image**
- **PDF report**: per-scan downloadable PDF (patient info + embedded image)
- **Seed accounts** for quick testing
- Ready for **Render/Netlify/Vercel** deployment

---

## 🧱 Tech Stack

**Backend:** Node.js, Express, SQLite3, bcryptjs, jsonwebtoken, multer, Cloudinary SDK, dotenv, uuid, morgan  
**Frontend:** React (Vite), axios, react-router-dom, jsPDF  
**Storage:** Cloudinary (images), SQLite (metadata)  

