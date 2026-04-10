# 🎭 Live Mood Tracker

A real-time mood tracking web app that lets you update and display your current mood instantly.

Built with modern full-stack tools and a clean, interactive UI.

---

## 🚀 Live Demo
👉 https://anushrav-live.vercel.app

---

## ✨ Features

- ⚡ Real-time mood updates using Supabase
- 🎯 Dynamic mood categories (Rock Bottom → GOD MODE)
- 🔐 Hidden admin panel (`/control7x9k`) with password protection
- 🎨 Modern UI with glassmorphism + glowing gradients
- ⏱️ Live "last updated" timer
- 📱 Fully responsive design

---

## 🧠 Mood System

| Range | Status | Emoji |
|------|--------|------|
| 0–20 | Rock Bottom | 😭 |
| 20–40 | Down Bad | 😔 |
| 40–60 | Hanging In There | 😐 |
| 60–90 | Chillin | 😎 |
| 90–100 | GOD MODE | 🚀 |

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS  
- **Backend:** Supabase (PostgreSQL + Realtime)  
- **Auth (Admin):** Custom password protection  
- **Deployment:** Vercel  

---

## ⚙️ Setup Locally

### 1. Clone repo

```bash
git clone https://github.com/YOUR_USERNAME/mood-tracker.git
cd mood-tracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Create a table called `moods` with the following schema:
   - `id` (uuid, primary key)
   - `mood` (integer, 0-100)
   - `updated_at` (timestamp with time zone)
3. Enable Row Level Security (RLS) and create policies for read/write access
4. Enable Realtime for the `moods` table

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Admin Panel

Access the admin panel at `/control7x9k` to update your mood. The password is set in `lib/auth.ts`.

---

## 🚀 Deployment

Deploy to Vercel:

1. Push your code to GitHub
2. Connect your repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a PR

---

## 📄 License

MIT License - feel free to use this project for your own mood tracking needs!