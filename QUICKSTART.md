# 🚀 Quick Start Guide

Get the Mahjong Host Platform running in 10 minutes!

---

## Prerequisites

- Node.js 18+ installed
- Git installed
- Supabase account (free)

---

## 1. Clone & Install (2 min)

```bash
git clone https://github.com/mrtomato1688-coder/Mahjong-Host-Platform.git
cd Mahjong-Host-Platform
npm install
```

---

## 2. Set Up Supabase (5 min)

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy **Project URL** and **API Keys** (Settings → API)
4. Go to **SQL Editor**, run this file: `supabase/schema.sql`
5. Go to **Database → Replication**, enable Realtime for `rsvps` table

---

## 3. Configure Environment (1 min)

Create `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 4. Run Development Server (1 min)

```bash
npm run dev
```

Open http://localhost:3000 🎉

---

## 5. Test It! (2 min)

1. Click "立即開始" → Enter any phone, OTP: `123456`
2. Dashboard → "建立新局"
3. Fill in game details:
   - **Date:** Tomorrow
   - **Time:** 14:00 to 18:00
   - **Location:** Your place
   - **Seats:** 1桌 (4人)
   - **F&B:** Toggle on, select 🍺 啤酒, 🥤 汽水
4. Click "建立遊戲"
5. Copy the share link
6. Open link in **incognito window**
7. Fill in RSVP form, select F&B
8. Submit → Go back to first window → **BOOM!** RSVP appears instantly 🎉

---

## Features Implemented ✅

- ✅ Time pickers (start/end time)
- ✅ F&B configuration (host creates menu, players select)
- ✅ Full Supabase integration
- ✅ Real-time RSVP updates (no refresh needed!)
- ✅ Mobile-responsive
- ✅ Share link generation
- ✅ Duplicate phone validation
- ✅ Seat limit enforcement

---

## Need Help?

- **Setup Issues?** → See `SUPABASE-SETUP.md`
- **Deploy to Vercel?** → See `DEPLOYMENT.md`
- **Feature Details?** → See `PROGRESS-DAY-2.md`
- **Database Schema?** → See `supabase/schema.sql`

---

## Deploy to Production (10 min)

See full guide in `DEPLOYMENT.md`, or quick version:

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import GitHub repo
4. Add environment variables (same as `.env.local`)
5. Deploy!

---

**That's it! You're ready to organize mahjong games like a pro! 🀄🍅**
