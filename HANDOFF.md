# 🀄 Handoff to Puchitotto - Development Kickoff

**Date:** 2026-03-30  
**From:** Tomatotto (Commander)  
**To:** Puchitotto (Lead Developer)  
**Project:** Mahjong Host Platform (麻將揪咖)

---

## 📋 Project Overview

Build a web platform for mahjong game hosts to organize games efficiently. Full details in `PRD.md`.

**GitHub Repo:** https://github.com/mrtomato1688-coder/Mahjong-Host-Platform

---

## 🎯 Your Mission

Implement **Phase 1: Core MVP (Weeks 1-3)** as specified in PRD.md, sections:
- Feature Specifications (1.1 - 1.4)
- Technical Architecture
- Database Schema
- API Specifications

---

## 🛠️ Tech Stack (Confirmed)

**Frontend:**
- Next.js 14 (App Router, TypeScript)
- Tailwind CSS + Shadcn UI
- Framer Motion (animations)
- React Hook Form + Zod (forms)

**Backend:**
- Supabase (PostgreSQL + Auth + Real-time)
- Supabase Auth (Phone OTP)

**External APIs:**
- LINE Messaging API (Phase 2, not MVP)
- Twilio (SMS OTP)

---

## 📦 What's Ready

✅ Git repo initialized  
✅ GitHub repo created: https://github.com/mrtomato1688-coder/Mahjong-Host-Platform  
✅ PRD.md (complete specifications)  
✅ package.json (all dependencies listed)  
✅ .env.example (environment variables template)  
✅ README.md (project overview)  

---

## 🚀 Your First Steps

### Step 1: Initialize Next.js App
```bash
cd "C:\Users\Aaron Lin\Projects\Mahjong-Host-Platform"
npx create-next-app@14 . --typescript --tailwind --app --no-src-dir
```

### Step 2: Install Dependencies
```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs \
  framer-motion react-hook-form zod zustand howler date-fns \
  lucide-react tailwind-merge clsx
```

### Step 3: Set Up Supabase
1. Create Supabase project at https://supabase.com
2. Copy connection details to `.env.local`
3. Run database migrations (SQL from PRD.md section "Database Schema")
4. Set up RLS policies

### Step 4: Build Core Features
Follow PRD.md Phase 1 roadmap:

**Week 1: Foundation**
- [ ] Configure Supabase connection (`lib/supabase.ts`)
- [ ] Implement phone OTP authentication
- [ ] Create host registration flow
- [ ] Build admin approval dashboard (minimal)

**Week 2: Game Creation & RSVP**
- [ ] Host dashboard (list games)
- [ ] Game creation form
- [ ] Public RSVP page (`app/join/[shareCode]/page.tsx`)
- [ ] Real-time RSVP updates

**Week 3: UI Polish**
- [ ] Apply mahjong color palette
- [ ] Tile-styled cards
- [ ] Mobile responsive design
- [ ] Form validation + error handling

---

## 🎨 Design Guidelines

**Color Palette (from PRD.md):**
```css
--mahjong-green: #0B6E4F;
--tile-ivory: #F5F3E7;
--lucky-red: #C1121F;
--dark-wood: #2C1810;
--gold: #D4AF37;
```

**Typography:**
- Primary: Noto Sans TC (Traditional Chinese)
- Secondary: Inter (English)

**UI Style:**
- Authentic mahjong aesthetic (not cutesy/cartoonish)
- 3D tile-styled cards
- Subtle animations
- Mobile-first design

See PRD.md "Design Guidelines" section for full details.

---

## 📊 Database Schema (Priority)

Implement these tables first (SQL in PRD.md):

1. **hosts** - User accounts for game organizers
2. **games** - Game sessions
3. **rsvps** - Player responses
4. **admin_users** - For E3 to approve hosts

**Important:** Enable Row Level Security (RLS) on all tables. Policies defined in PRD.md.

---

## 🔐 Authentication Flow

**Host Registration:**
1. User enters phone number
2. System sends OTP via Twilio
3. User verifies OTP
4. Account created with `approved = false`
5. E3 manually approves in admin dashboard
6. Host can now log in and create games

**Implementation:**
- Use Supabase Auth with phone provider
- Custom `approved` field in `hosts` table
- Check approval status on login

---

## 🎯 MVP Success Criteria

**Must Have (Week 3 deliverable):**
- ✅ Hosts can register + get approved
- ✅ Hosts can create games
- ✅ Unique shareable link generated per game
- ✅ Players can RSVP via link (no login required)
- ✅ Real-time RSVP updates
- ✅ Mobile-responsive
- ✅ Mahjong aesthetic implemented
- ✅ No critical bugs

**Nice to Have:**
- Sound effects (Phase 3)
- Advanced animations (Phase 3)
- LINE OA integration (Phase 2, not MVP)

---

## 📞 Communication

**Questions?**
- Ask E3 directly (via LINE)
- Reference PRD.md for specifications
- Check DATABASE.md and API.md (create these as you build)

**Progress Updates:**
- Commit to GitHub regularly
- Tag E3 when major features are complete
- Report blockers immediately

**Code Review:**
- E3 will review before merging to main
- Keep PRs focused (one feature per PR)

---

## 🚨 Important Notes

1. **No LINE Integration in MVP** - That's Phase 2. Focus on core game creation + RSVP flow first.

2. **Admin Approval is Manual** - E3 will approve hosts via simple dashboard. Don't build complex approval workflow.

3. **Real-time is Critical** - Use Supabase real-time subscriptions for RSVP updates. This is a key differentiator.

4. **Mobile-First** - Most players will access RSVP page on phones. Test on mobile constantly.

5. **Keep It Simple** - MVP should be functional, not perfect. We can polish later.

---

## 📚 Reference Materials

**Primary Docs:**
- `PRD.md` - Your bible for this project
- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs
- Shadcn UI: https://ui.shadcn.com

**Design Inspiration:**
- Traditional mahjong parlors (Hong Kong, Taiwan)
- Think: vintage, authentic, sophisticated

---

## ✅ Checklist Before You Start

- [ ] Read PRD.md in full (especially Phases 1-3)
- [ ] Set up Supabase project
- [ ] Configure environment variables
- [ ] Initialize Next.js app
- [ ] Install dependencies
- [ ] Create database tables + RLS policies
- [ ] Start with authentication flow

---

## 🎉 Let's Build!

You've got this, Puchitotto! This is a clean, well-scoped project with clear requirements. 

**Timeline:** 3 weeks for MVP  
**Expected Completion:** Week of April 20, 2026

Any questions, ping E3 or me. Happy coding! 🀄

— Tomatotto (とまとっと) 🍑
