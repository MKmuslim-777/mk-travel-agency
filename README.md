**Mk-Travel-Agency** is a high-performance, dynamic travel booking platform built with the **MERN Stack** and **Next.js**. It provides a seamless experience for travelers to explore world-class destinations while offering a powerful multi-role dashboard for administrative management.

---

## 🚀 Live Demo
🔗 [View Live Site](https://mk-travel-agency.vercel.app/)

---

## 🌟 Key Features

### 👤 User Experience
- **Dynamic Tour Search:** Easily find packages based on destinations.
- **Detailed Package View:** Comprehensive information, pricing, and high-quality image galleries for every tour.
- **Secure Booking:** A streamlined process for users to book their favorite trips.
- **Personal Dashboard:** Users can track their booking history and manage their profiles.

### 🛠️ Admin & Moderator Power
- **Role-Based Access Control (RBAC):** Distinct permissions for **Admin**, **Moderator**, and **User**.
- **Advanced Package Management:** Admins and Moderators can Add, Update, and Delete packages.
- **Smart Image Validation:** Specialized logic requiring a minimum of **3 images** and a maximum of **7 images** per package to ensure quality.
- **User Management:** Admins can promote or demote users to different roles (Admin/Moderator/User).
- **Safety Measures:** Integrated confirmation toasts (using SweetAlert2/React Hot Toast) for sensitive actions like deletions.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), Tailwind CSS, DaisyUI
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** Firebase & JWT (JSON Web Tokens)
- **Deployment:** Vercel

---

## 📂 Project Structure Overview

```text
mk-travel-agency/
├── src/
│   ├── app/            # Next.js App Router (Pages & Logic)
│   ├── components/     # Reusable UI Components
│   ├── hooks/          # Custom React Hooks
│   ├── lib/            # Utility functions & DB configs
│   └── styles/         # Global styles & Tailwind config
├── public/             # Static assets (icons, images)
└── server/             # Express.js backend logic (if separate)
⚙️ Installation & Setup
Clone the repository:

Bash
git clone [https://github.com/MKmuslim-777/mk-travel-agency.git](https://github.com/MKmuslim-777/mk-travel-agency.git)
cd mk-travel-agency
Install dependencies:

Bash
npm install
Set up environment variables (.env):
Create a .env.local file and add your credentials:

Code snippet
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
Run the development server:

Bash
npm run dev
📸 Screenshots
(Tip: Add some high-quality screenshots of your landing page and dashboard here to make it visually appealing!)

🤝 Contribution
If you have any suggestions or want to contribute to this project, feel free to open an issue or create a pull request.

Developed with ❤️ by Muslim Uddin Mk


---

### 💡 এই README-টি যেভাবে ব্যবহার করবেন:
১. আপনার প্রজেক্টের রুট ডিরেক্টরিতে (Root Directory) থাকা `README.md` ফাইলটি ওপেন করুন।
২. আগের সব লেখা ডিলিট করে উপরের কোডটি পেস্ট করে দিন।
৩. গিটহাবে **Commit** করে দিন।

এটি আপনার প্রোফাইলকে অনেক বেশি প্রফেশনাল দেখাবে। **আপনার কি আগামীকাল ড্যাশবোর্ড বা ইমেজ ভ্যালিডেশনের কোড নিয়ে কোনো কনফিউশন আছে? আমি কি সেই লজিকগুলো এখনই ক্লিয়ার করে দেব?**
