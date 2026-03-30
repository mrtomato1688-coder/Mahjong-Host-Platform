# 🀄 Polished Prototype Scope

**Target Delivery:** April 5-6, 2026 (5-7 days)  
**Goal:** Testable, polished prototype with core features

---

## ✅ Must-Have Features

### 1. Host Authentication
- Phone-based login (mock OTP for prototype, real Supabase Auth)
- Simple registration flow
- Session management (JWT)
- **Skip:** Admin approval (auto-approve for prototype)

### 2. Host Dashboard
- List all created games (upcoming + past)
- Show RSVP count per game (e.g., "3/4 confirmed")
- Quick actions: View Details, Copy Link, Edit
- Clean mahjong-styled UI

### 3. Game Creation
- Form inputs:
  - Date (calendar picker)
  - Time slot (text input, e.g., "下午2點-6點")
  - Location (text input)
  - Max seats (radio: 4, 8, or 12)
  - Notes (optional textarea)
- Generate unique 8-char share code
- Show success modal with shareable link
- Save to Supabase

### 4. Shareable RSVP Page
- Public URL: `/join/[shareCode]`
- Display:
  - Game details (date, time, location, notes)
  - Current RSVPs (name + timestamp)
  - Seat availability (e.g., "2/4 seats filled")
- RSVP form:
  - Name (required)
  - Phone (required, Taiwan format)
  - Status: Confirmed / Declined / Maybe
- Validation:
  - Prevent duplicate phone numbers
  - Check if game is full
- Real-time updates (Supabase subscriptions)

### 5. Real-Time Updates
- Use Supabase real-time subscriptions
- When player RSVPs, all viewers see update instantly
- Subtle animation when seat fills

### 6. Mahjong Aesthetic
- **Color palette:**
  - Primary: Jade green `#0B6E4F`
  - Ivory: `#F5F3E7`
  - Red accent: `#C1121F`
  - Dark wood: `#2C1810`
- **Typography:** Noto Sans TC + Inter
- **UI elements:**
  - 3D tile-styled game cards
  - Subtle shadows and depth
  - Rounded corners (like mahjong tiles)
- **Icons:** Lucide React (outlined style)
- Mobile-first responsive design

---

## 🚫 Explicitly Skipped (For Speed)

- Admin approval workflow (all hosts auto-approved)
- LINE OA integration (just copy link manually)
- SMS/email notifications
- Sound effects
- Advanced animations (Framer Motion)
- Payment integration
- Multi-language (Chinese only)
- Host profile editing
- Game deletion/cancellation (edit only)

---

## 🛠️ Tech Stack

**Frontend:**
- Next.js 14 (App Router, TypeScript)
- Tailwind CSS
- Shadcn UI (pre-built components)
- Lucide React (icons)
- React Hook Form + Zod (form validation)

**Backend:**
- Supabase:
  - PostgreSQL database
  - Supabase Auth (phone OTP)
  - Real-time subscriptions
  - Row Level Security

**Deployment:**
- Vercel (auto-deploy from GitHub)

---

## 📊 Database Schema (Simplified)

### `hosts` table
```sql
CREATE TABLE hosts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `games` table
```sql
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_id UUID NOT NULL REFERENCES hosts(id) ON DELETE CASCADE,
  share_code VARCHAR(8) UNIQUE NOT NULL,
  date DATE NOT NULL,
  time_slot VARCHAR(50) NOT NULL,
  location VARCHAR(200) NOT NULL,
  max_seats INTEGER NOT NULL DEFAULT 4 CHECK (max_seats IN (4, 8, 12)),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_games_share_code ON games(share_code);
CREATE INDEX idx_games_host_id ON games(host_id);
```

### `rsvps` table
```sql
CREATE TABLE rsvps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  player_name VARCHAR(100) NOT NULL,
  player_phone VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'declined', 'maybe')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(game_id, player_phone)
);

CREATE INDEX idx_rsvps_game_id ON rsvps(game_id);
```

### RLS Policies
```sql
-- Enable RLS
ALTER TABLE hosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

-- Hosts can view/edit own games
CREATE POLICY "Hosts can manage own games"
  ON games FOR ALL
  USING (host_id = auth.uid());

-- Public can view active games
CREATE POLICY "Public can view games"
  ON games FOR SELECT
  USING (true);

-- Public can create RSVPs
CREATE POLICY "Public can create RSVPs"
  ON rsvps FOR INSERT
  WITH CHECK (true);

-- Public can view RSVPs
CREATE POLICY "Public can view RSVPs"
  ON rsvps FOR SELECT
  USING (true);
```

---

## 🎨 Key UI Pages

### 1. Login Page (`/login`)
```
┌────────────────────────────┐
│    🀄 麻將揪咖             │
│                            │
│  手機號碼登入              │
│  ┌──────────────────────┐ │
│  │ 09__-___-___         │ │
│  └──────────────────────┘ │
│                            │
│  [發送驗證碼]              │
│                            │
└────────────────────────────┘
```

### 2. Dashboard (`/dashboard`)
```
┌─────────────────────────────────────┐
│  🀄 我的局        [+ 建立新局]      │
├─────────────────────────────────────┤
│                                      │
│  即將開始 (2)                        │
│                                      │
│  ┌────────────────────────────────┐ │
│  │ 📅 4月5日 (六) 14:00-18:00    │ │
│  │ 📍 明哥家                      │ │
│  │ 👥 3/4 人已報名                │ │
│  │ [查看] [複製連結] [編輯]      │ │
│  └────────────────────────────────┘ │
│                                      │
└─────────────────────────────────────┘
```

### 3. Create Game (`/games/new`)
```
┌────────────────────────────┐
│  建立新局                  │
├────────────────────────────┤
│  日期 *                    │
│  [📅 選擇日期]            │
│                            │
│  時段 *                    │
│  [下午2點-6點]            │
│                            │
│  地點 *                    │
│  [輸入地點]               │
│                            │
│  桌數 *                    │
│  ◉ 1桌 (4人)              │
│  ○ 2桌 (8人)              │
│  ○ 3桌 (12人)             │
│                            │
│  備註 (選填)               │
│  [_________________]       │
│                            │
│  [取消]  [建立遊戲]       │
└────────────────────────────┘
```

### 4. RSVP Page (`/join/[shareCode]`)
```
┌───────────────────────────────┐
│    🀄 麻將局 - 報名確認        │
├───────────────────────────────┤
│  主辦人: 明哥                  │
│  📅 4月5日 (六) 14:00-18:00   │
│  📍 明哥家 - 台北信義區        │
│                               │
│  目前報名: 2/4 人              │
│  ✅ 阿明 (30分鐘前)           │
│  ✅ 小華 (15分鐘前)           │
│  ⬜ (空位)                     │
│  ⬜ (空位)                     │
├───────────────────────────────┤
│  我要報名                      │
│  姓名 * [_________]           │
│  手機 * [09__-___-___]        │
│  ◉ 確定參加                    │
│  ○ 不克參加                    │
│  ○ 再看看                      │
│  [確認送出]                    │
└───────────────────────────────┘
```

---

## 🚀 Development Checklist

### Phase 1: Setup (Day 1)
- [x] PRD reviewed
- [ ] Initialize Next.js 14 app
- [ ] Install dependencies (Supabase, Tailwind, Shadcn UI)
- [ ] Create Supabase project
- [ ] Set up environment variables
- [ ] Create database schema + RLS policies
- [ ] Configure Supabase client

### Phase 2: Authentication (Day 1-2)
- [ ] Set up Supabase Auth (phone provider)
- [ ] Create login page UI
- [ ] Implement OTP flow (mock for prototype)
- [ ] Session management
- [ ] Protected routes (middleware)

### Phase 3: Host Dashboard (Day 2-3)
- [ ] Dashboard layout
- [ ] Fetch games from Supabase
- [ ] Display game cards (mahjong-styled)
- [ ] "Create Game" button → modal/page
- [ ] Copy link functionality
- [ ] Edit game functionality

### Phase 4: Game Creation (Day 3)
- [ ] Create game form UI
- [ ] Form validation (React Hook Form + Zod)
- [ ] Generate unique share code (8 chars)
- [ ] Save to Supabase
- [ ] Success modal with shareable link

### Phase 5: RSVP Page (Day 4-5)
- [ ] Public page route: `/join/[shareCode]`
- [ ] Fetch game details by share code
- [ ] Display game info (date, time, location)
- [ ] Display current RSVPs
- [ ] RSVP form UI
- [ ] Form validation (prevent duplicates, check full)
- [ ] Submit RSVP to Supabase
- [ ] Real-time subscription (Supabase)
- [ ] Update UI on new RSVPs

### Phase 6: Mahjong Aesthetic (Day 5-6)
- [ ] Apply color palette (green, ivory, red)
- [ ] Style game cards as 3D tiles
- [ ] Add mahjong tile icons
- [ ] Responsive mobile design
- [ ] Test on iOS Safari / Android Chrome
- [ ] Polish spacing, typography

### Phase 7: Deployment (Day 6-7)
- [ ] Push to GitHub
- [ ] Connect to Vercel
- [ ] Set environment variables in Vercel
- [ ] Deploy to production
- [ ] Test production URL
- [ ] Fix any deployment issues

---

## ✅ Definition of Done

**Prototype is ready when:**
1. Host can register/login
2. Host can create a game
3. Shareable link is generated
4. Player can open link and RSVP
5. Host sees RSVP appear in real-time
6. Mobile-responsive (works on phone)
7. Mahjong aesthetic applied (looks authentic)
8. Deployed to Vercel (E3 can access via URL)
9. No critical bugs

---

## 🎯 Success Criteria

**User Testing Goals:**
- E3 can create a test game in <2 minutes
- Link is shareable via LINE
- Players can RSVP in <30 seconds
- Real-time updates work smoothly
- UI feels authentic (not generic)

**Technical Goals:**
- Page load <2 seconds
- No console errors
- Mobile-friendly
- Works on Safari + Chrome

---

## 📞 Communication

**Daily Updates:**
- Commit progress to GitHub
- Tag E3 when key features are complete
- Report blockers immediately

**Questions:**
- Check PRD.md first
- Ask E3 if ambiguous

**Deployment:**
- Deploy early (Day 3-4) for E3 to test
- Iterate based on feedback

---

## 🍑 Notes from Tomatotto

Puchitotto, this is a **polished prototype**, not a quick hack. Quality matters:

✅ **Do:**
- Write clean TypeScript
- Use Shadcn UI components (pre-styled)
- Test on mobile constantly
- Commit regularly
- Make it beautiful (mahjong aesthetic is key!)

❌ **Don't:**
- Hardcode values (use env vars)
- Skip error handling
- Ignore mobile design
- Over-engineer (keep it simple)

**Remember:** E3 wants to **test the concept**. It needs to work smoothly and look authentic. Speed matters, but not at the cost of quality.

You've got 5-7 days. Let's ship something impressive! 🀄

— Tomatotto 🍑
