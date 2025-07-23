# 🏢 IPO Management System

A full-stack web application for managing IPO listings, prospectus downloads, and investor subscriptions. Built with React and Django REST Framework.

---

## 🚀 Features

- 📊 View detailed IPO listings with industry, issue price, dates & status
- 📄 Download RHP and DRHP PDFs with stable file links
- 🧾 Secure subscription flow for investors with OTP token
- 🖼️ Company logos auto-mapped via naming convention
- ✅ Frontend & backend integration for dynamic content
- 📂 Fixed file naming for easy file management and predictable downloads

---

## 🛠 Tech Stack

| Frontend      | Backend            | Styling           | Deployment |
|---------------|--------------------|-------------------|------------|
| React         | Django REST        | Tailwind CSS      | Vercel / Render |
| Axios         | PostgreSQL / SQLite | Custom Components | GitHub |

---

## 📁 Folder Structure
ipo-frontend/ │ ├── public/ │   └── pdfs/ │       ├── demo-rhp.pdf │       └── demo-drhp.pdf ├── src/ │   ├── components/ │   └── App.js │ ipo-backend/ ├── media/     🔒 [optional] ├── core/ │   ├── models.py │   ├── serializers.py │   ├── views.py

---

## ⚙️ Setup & Installation

```bash
# Backend Setup
cd ipo-backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Frontend Setup
cd ipo-frontend
npm install
npm start
💡 Developer Notes
- PDFs are saved to /frontend/public/pdfs/ using Django’s custom upload logic
- Downloads triggered via JavaScript to prevent cross-origin 404s
- Subscription token passed as prop to restrict form access
- File names are fixed as demo-rhp.pdf and demo-drhp.pdf for simplicity
🙌 Credits
Made by Shiv Shukla
Intern at Bluestock 💼
Focused on seamless UX + technical precision
