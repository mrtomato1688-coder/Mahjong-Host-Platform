# 🀄 Mahjong Host Platform - Product Requirements Document

**Version:** 1.0  
**Date:** 2026-03-30  
**Owner:** E3 (イーシャン)  
**Status:** Ready for Development

---

## 📖 Table of Contents

1. [Product Overview](#product-overview)
2. [Goals & Success Metrics](#goals--success-metrics)
3. [User Personas](#user-personas)
4. [User Stories](#user-stories)
5. [Feature Specifications](#feature-specifications)
6. [User Flow Diagrams](#user-flow-diagrams)
7. [UI Wireframes](#ui-wireframes)
8. [Technical Architecture](#technical-architecture)
9. [Database Schema](#database-schema)
10. [API Specifications](#api-specifications)
11. [Design Guidelines](#design-guidelines)
12. [Development Roadmap](#development-roadmap)

---

## 🎯 Product Overview

### Problem Statement
Mahjong game hosts currently spend excessive time manually coordinating games through individual phone calls and messages. They need to:
- Call each player individually to check availability
- Track responses manually
- Coordinate food & beverage preferences
- Send repeated reminders

**This is inefficient, time-consuming, and error-prone.**

### Solution
A web platform where verified hosts can:
1. Create game sessions with time, location, and details
2. Generate unique shareable links
3. Auto-send invitations via LINE Official Account
4. Track RSVPs in real-time
5. View consolidated participant lists

Players can:
1. View game details via shared link
2. RSVP with one click (no login required)
3. See who else is attending
4. Receive automatic confirmations

### Key Differentiators
- **Authentic mahjong aesthetic** - feels like sitting at a real table
- **LINE OA integration** - native to Taiwan/HK messaging culture
- **Zero friction for players** - no app download or registration required
- **Host verification** - quality control, builds trust

---

## 📊 Goals & Success Metrics

### Primary Goals
1. **Reduce coordination time for hosts by 80%** (from ~2 hours to ~15 minutes per game)
2. **Achieve 90%+ RSVP response rate** (vs. current ~60% via manual calls)
3. **Onboard 50 verified hosts in first 3 months**

### Success Metrics (6 months)
- **Host Metrics:**
  - 50+ verified hosts
  - Average 4+ games created per host/month
  - 80%+ host retention rate
  
- **Player Metrics:**
  - 500+ unique players
  - 90%+ RSVP completion rate
  - <30 seconds average time to RSVP

- **Technical Metrics:**
  - 99%+ uptime
  - <2 second page load time
  - Mobile compatibility 100%

---

## 👥 User Personas

### Persona 1: Host (Primary User)

**「明哥」 - Experienced Mahjong Host**
- Age: 45-65
- Occupation: Business owner / Retiree
- Tech Savvy: Medium (uses LINE, basic apps)
- Pain Points:
  - Spends 2+ hours organizing each game via phone calls
  - Players forget or don't respond
  - Hard to track who's confirmed
  - Difficult to coordinate F&B orders

**Goals:**
- Organize games quickly and efficiently
- Get reliable RSVPs
- Maintain professional reputation
- Focus on hosting, not admin work

---

### Persona 2: Player (Secondary User)

**「阿華」 - Regular Mahjong Player**
- Age: 35-60
- Occupation: Various (office worker, entrepreneur, homemaker)
- Tech Savvy: Medium (uses LINE daily)
- Pain Points:
  - Misses game invitations in busy LINE chats
  - Forgets to respond to host
  - Doesn't know who else is attending
  - Hard to change availability after confirming

**Goals:**
- Quickly see game details
- Easy one-click RSVP
- Know who else is playing
- Receive reminders

---

## 📝 User Stories

### Host Stories

**Epic 1: Account Management**
- ✅ As a host, I want to register with my phone number, so I can create a secure account
- ✅ As a host, I need admin approval before accessing the platform, so only legitimate hosts can use it
- ✅ As a host, I want to log in with OTP (one-time password), so I don't need to remember passwords

**Epic 2: Game Creation**
- ✅ As a host, I want to create a game session with date/time/location, so players know when and where
- ✅ As a host, I want to set the number of seats (4, 8, 12), so I can organize multiple tables
- ✅ As a host, I want to add optional notes (stakes, rules), so players understand the game format
- ✅ As a host, I want to generate a unique shareable link, so I can invite players easily

**Epic 3: Invitations**
- ✅ As a host, I want to auto-send game links via LINE OA, so I don't need to manually message everyone
- ✅ As a host, I want to copy the shareable link, so I can paste it in my LINE group chat

**Epic 4: Tracking & Management**
- ✅ As a host, I want to see real-time RSVP status, so I know who's confirmed
- ✅ As a host, I want to view past games, so I can reference previous sessions
- ✅ As a host, I want to edit or cancel games, so I can handle last-minute changes
- ✅ As a host, I want to see player contact info, so I can follow up if needed

---

### Player Stories

**Epic 5: Viewing & RSVPing**
- ✅ As a player, I want to open a game link without logging in, so I can RSVP quickly
- ✅ As a player, I want to see game details (date/time/location/notes), so I can decide if I can attend
- ✅ As a player, I want to see who else is attending, so I know the group composition
- ✅ As a player, I want to RSVP with just my name and phone, so registration is fast
- ✅ As a player, I want to see real-time seat availability, so I know if the game is full

**Epic 6: Updates**
- ✅ As a player, I want to receive a confirmation message after RSVPing, so I have proof
- ✅ As a player, I want to change my RSVP status, so I can update if plans change

---

## 🔧 Feature Specifications

### Phase 1: Core MVP (Weeks 1-3)

#### 1.1 Host Authentication
**Requirements:**
- Phone number-based registration
- OTP verification via SMS (Twilio)
- Admin approval workflow (manual approval by E3)
- Session management (JWT tokens)

**User Flow:**
1. Host enters phone number on registration page
2. System sends 6-digit OTP
3. Host enters OTP to verify
4. Account created with status "pending approval"
5. Admin receives notification, approves host
6. Host receives approval notification, can log in

**Technical Notes:**
- Use Supabase Auth with phone provider
- Custom approval field in `hosts` table
- Admin dashboard for approval management

---

#### 1.2 Game Session Creation
**Requirements:**
- Form inputs: Date, Time Slot, Location, Max Seats, Notes
- Generate unique 8-character share code (e.g., `abc12345`)
- Create shareable URL: `https://mahjong.host/join/{share_code}`
- Save to database with host association

**Validation Rules:**
- Date must be today or future
- Time slot required (freeform text, e.g., "下午2點-6點")
- Location required (max 200 chars)
- Max seats: 4, 8, or 12 (default 4)
- Notes optional (max 500 chars)

**UI Components:**
```
┌──────────────────────────────────┐
│  建立新局 (Create New Game)       │
├──────────────────────────────────┤
│                                   │
│  日期 *                           │
│  [📅 2026-04-05]                 │
│                                   │
│  時段 *                           │
│  [下午2點 - 6點]                  │
│                                   │
│  地點 *                           │
│  [明哥家 - 台北市信義區松仁路]    │
│                                   │
│  桌數 *                           │
│  ◉ 1桌 (4人)                      │
│  ○ 2桌 (8人)                      │
│  ○ 3桌 (12人)                     │
│                                   │
│  備註 (選填)                       │
│  [小賭怡情，每台$10，              │
│   自摸加倍]                        │
│                                   │
│  [取消]  [建立遊戲] ←             │
│                                   │
└──────────────────────────────────┘
```

**Success State:**
After creation, show modal:
```
┌──────────────────────────────────┐
│  ✅ 遊戲建立成功！                │
├──────────────────────────────────┤
│                                   │
│  分享連結:                         │
│  https://mahjong.host/join/abc123 │
│                                   │
│  [📋 複製連結]  [發送 LINE 訊息]  │
│                                   │
└──────────────────────────────────┘
```

---

#### 1.3 Shareable RSVP Page
**Requirements:**
- Public page (no auth required)
- Show game details
- Display current RSVPs with real-time updates
- RSVP form: Name, Phone, Status
- Visual seat availability indicator

**URL Structure:**
`https://mahjong.host/join/{share_code}`

**Page Layout:**
```
┌─────────────────────────────────────┐
│         🀄 麻將局報名                │
├─────────────────────────────────────┤
│                                      │
│  主辦人: 明哥                        │
│  📅 2026年4月5日 (六)                │
│  🕐 下午2點 - 6點                    │
│  📍 明哥家 - 台北市信義區松仁路      │
│  💬 小賭怡情，每台$10，自摸加倍      │
│                                      │
├─────────────────────────────────────┤
│  報名狀況: 2/4 人                    │
│                                      │
│  座位 1: ✅ 阿明 (0912-345-678)      │
│  座位 2: ✅ 小華 (0923-456-789)      │
│  座位 3: ⬜ (空位)                   │
│  座位 4: ⬜ (空位)                   │
│                                      │
├─────────────────────────────────────┤
│  我要報名                            │
│                                      │
│  姓名 *                              │
│  [________________]                  │
│                                      │
│  手機號碼 *                          │
│  [09__-___-___]                      │
│                                      │
│  狀態                                │
│  ◉ 確定參加                          │
│  ○ 不克參加                          │
│  ○ 再看看                            │
│                                      │
│  [確認送出]                          │
│                                      │
└─────────────────────────────────────┘
```

**Real-Time Updates:**
- Use Supabase real-time subscriptions
- When new RSVP submitted, all viewers see update instantly
- Show subtle animation when seat fills

**Validation:**
- Name: 2-20 characters, required
- Phone: Taiwan format (09XX-XXX-XXX), required
- Prevent duplicate phone numbers for same game

---

#### 1.4 Host Dashboard
**Requirements:**
- List all games (upcoming first, then past)
- Show RSVP count per game
- Quick actions: View Details, Copy Link, Edit, Cancel

**Dashboard Layout:**
```
┌─────────────────────────────────────────────┐
│  🀄 我的局 (My Games)        [+ 建立新局]   │
├─────────────────────────────────────────────┤
│                                              │
│  即將開始 (2)                                │
│                                              │
│  ┌──────────────────────────────────────┐  │
│  │ 📅 4月5日 (六) 14:00-18:00           │  │
│  │ 📍 明哥家                             │  │
│  │ 👥 3/4 人已報名                       │  │
│  │                                       │  │
│  │ [查看詳情] [複製連結] [編輯] [取消]  │  │
│  └──────────────────────────────────────┘  │
│                                              │
│  ┌──────────────────────────────────────┐  │
│  │ 📅 4月12日 (六) 19:00-23:00          │  │
│  │ 📍 阿華家                             │  │
│  │ 👥 1/8 人已報名 (2桌)                 │  │
│  │                                       │  │
│  │ [查看詳情] [複製連結] [編輯] [取消]  │  │
│  └──────────────────────────────────────┘  │
│                                              │
│  過往記錄 (5)                                │
│  [顯示更多...]                               │
│                                              │
└─────────────────────────────────────────────┘
```

**Game Detail View:**
- Full RSVP list with names, phones, timestamps
- Copy all phone numbers (for WhatsApp/LINE group creation)
- Export to CSV
- Send reminder message

---

### Phase 2: LINE Integration (Week 4)

#### 2.1 LINE OA Connection
**Approach:** Central LINE OA (simpler for MVP)

**Requirements:**
- E3 creates one LINE Official Account
- Platform sends messages via LINE Messaging API
- Hosts don't need their own LINE OA

**Setup Flow:**
1. E3 registers LINE OA: "麻將揪咖小幫手"
2. Get Channel Access Token from LINE Developers Console
3. Store token in environment variables
4. Create message templates

**Technical Implementation:**
- LINE Messaging API v2
- Webhook endpoint for handling responses (future)
- Message quota: Free tier = 500 messages/month (sufficient for MVP)

---

#### 2.2 Auto-Send Game Links
**Requirements:**
- After creating game, host can click "發送 LINE 訊息"
- Host enters LINE IDs or phone numbers of invitees
- System sends templated message with game link

**Message Template:**
```
🀄 新局來了！

主辦人: 明哥
📅 4月5日 (六) 下午2點-6點
📍 明哥家 - 台北市信義區

👉 點此報名: 
https://mahjong.host/join/abc123

快來揪團打牌吧！
```

**UI Flow:**
```
┌──────────────────────────────────┐
│  發送 LINE 訊息                   │
├──────────────────────────────────┤
│                                   │
│  收件人 (輸入 LINE ID 或電話)     │
│  ┌────────────────────────────┐  │
│  │ @johndoe, 0912-345-678     │  │
│  │ @janedoe, 0923-456-789     │  │
│  │                             │  │
│  └────────────────────────────┘  │
│  (以逗號分隔)                     │
│                                   │
│  預覽訊息:                        │
│  ┌────────────────────────────┐  │
│  │ 🀄 新局來了！               │  │
│  │ 主辦人: 明哥                │  │
│  │ 📅 4月5日 (六) 下午2點...   │  │
│  └────────────────────────────┘  │
│                                   │
│  [取消]  [發送給 2 位好友]       │
│                                   │
└──────────────────────────────────┘
```

**Alternative (Simpler for MVP):**
- Just show "分享到 LINE" button
- Opens LINE app with pre-filled message
- User selects recipients manually in LINE
- Avoids complex contact management

---

### Phase 3: Polish & Enhancements (Week 5)

#### 3.1 Sound Effects
**Requirements:**
- Authentic mahjong tile sounds
- Subtle, not annoying
- Can be muted

**Sound Events:**
- Button click → tile click sound
- RSVP submitted → tile shuffle
- Game full → winning hand "湊齊了！" chime

**Implementation:**
- Use Howler.js for web audio
- Host sounds on CDN or embed small MP3s
- LocalStorage preference for mute

---

#### 3.2 Animations
**Requirements:**
- Smooth, mahjong-themed transitions
- Not too flashy (professional feel)

**Key Animations:**
- Game cards: Tile flip on hover
- RSVP submission: Confetti (if seat fills)
- Dashboard: Fade-in/slide-up for new games
- Loading states: Spinning mahjong tile

**Implementation:**
- Framer Motion for React animations
- CSS transitions for simple effects

---

#### 3.3 Mobile Optimization
**Requirements:**
- 100% mobile-responsive
- Touch-friendly tap targets (min 44px)
- Fast loading on 4G

**Key Considerations:**
- RSVP page is most important (players are mobile-first)
- Test on iOS Safari and Android Chrome
- Optimize images (WebP format)
- Lazy load non-critical assets

---

## 🎨 Design Guidelines

### Visual Identity

**Brand Name:** 麻將揪咖 (Mahjong Host Platform)  
**Tagline:** 輕鬆揪團，一鍵開局 (Easy Invites, One-Click Games)

---

### Color Palette

**Primary Colors:**
- **Mahjong Green:** `#0B6E4F` (felt table)
- **Tile Ivory:** `#F5F3E7` (mahjong tiles)
- **Lucky Red:** `#C1121F` (accents, CTAs)

**Secondary Colors:**
- **Dark Wood:** `#2C1810` (backgrounds)
- **Gold:** `#D4AF37` (highlights, premium features)
- **Neutral Gray:** `#4A4A4A` (text)

**Functional Colors:**
- Success: `#2D7A4F` (confirmed RSVPs)
- Warning: `#F77F00` (maybe status)
- Error: `#D62828` (declined / errors)

---

### Typography

**Primary Font:** Noto Sans TC (Google Fonts)
- Headers: Bold (700)
- Body: Regular (400)
- Captions: Light (300)

**Secondary Font (English):** Inter
- Clean, modern, pairs well with Noto Sans

**Font Sizes (Mobile-First):**
```css
--text-xs: 0.75rem;   /* 12px - captions */
--text-sm: 0.875rem;  /* 14px - body small */
--text-base: 1rem;    /* 16px - body */
--text-lg: 1.125rem;  /* 18px - subheadings */
--text-xl: 1.5rem;    /* 24px - headings */
--text-2xl: 2rem;     /* 32px - page titles */
```

---

### UI Components

**Buttons:**
```
Primary (CTA):
┌──────────────┐
│ 確認送出 →   │  ← Red background, white text
└──────────────┘

Secondary:
┌──────────────┐
│ 取消         │  ← Outlined, transparent bg
└──────────────┘

Ghost:
[複製連結 📋]    ← Text only, no border
```

**Cards (Game Tiles):**
```
┌─────────────────────┐
│  🀄                 │ ← Mahjong tile icon
│  4月5日 (六)        │
│  下午2點-6點        │
│  📍 明哥家          │
│  👥 3/4            │
└─────────────────────┘
3D shadow, subtle hover lift
```

**Form Inputs:**
```
Label (above):
姓名 *

Input field:
┌───────────────────┐
│ 請輸入您的姓名    │ ← Placeholder text
└───────────────────┘

Error state:
┌───────────────────┐
│ (empty)           │ ← Red border
└───────────────────┘
⚠️ 請輸入姓名
```

---

### Iconography

**Style:** Outlined (not filled), consistent stroke width

**Key Icons:**
- 🀄 Mahjong tile (brand icon)
- 📅 Calendar (date)
- 🕐 Clock (time)
- 📍 Location pin
- 👥 People (RSVPs)
- 📋 Copy (link copy)
- ✅ Checkmark (confirmed)
- ⏰ Reminder
- 🔗 Link

**Source:** Heroicons or Lucide (open-source, customizable)

---

### Micro-interactions

**Hover States:**
- Buttons: Darken 10%, scale up 2%
- Game cards: Lift shadow, rotate 2deg
- Links: Underline

**Active States:**
- Buttons: Scale down 98%
- Cards: Slight press-down effect

**Loading States:**
- Skeleton screens (not spinners)
- Pulse animation on placeholders

---

## 🏗️ Technical Architecture

### High-Level Architecture

```
┌─────────────┐
│   Browser   │
│  (Next.js)  │
└──────┬──────┘
       │
       │ HTTPS
       ▼
┌─────────────┐
│   Vercel    │ ← Frontend Hosting + Serverless Functions
└──────┬──────┘
       │
       │ API Calls
       ▼
┌─────────────┐
│  Supabase   │ ← Database + Auth + Real-time
└──────┬──────┘
       │
       │ Webhooks/API
       ▼
┌─────────────┐
│ LINE API    │ ← Messaging
│ Twilio SMS  │ ← OTP
└─────────────┘
```

---

### Tech Stack Detailed

**Frontend:**
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v3
- **UI Library:** Shadcn UI (customized)
- **Animations:** Framer Motion
- **Forms:** React Hook Form + Zod validation
- **State Management:** Zustand (lightweight)
- **Audio:** Howler.js

**Backend:**
- **BaaS:** Supabase
  - PostgreSQL database
  - Supabase Auth (phone OTP)
  - Row Level Security (RLS)
  - Real-time subscriptions
  - Edge Functions (serverless)

**External APIs:**
- **LINE Messaging API:** Send invitations
- **Twilio:** SMS OTP backup

**Hosting & Deployment:**
- **Frontend:** Vercel (auto-deploy from GitHub)
- **Database:** Supabase Cloud (managed PostgreSQL)
- **Domain:** TBD (suggest: `mahjong.host` or `麻將揪咖.tw`)

**DevOps:**
- **Version Control:** GitHub
- **CI/CD:** Vercel automatic deployments
- **Monitoring:** Vercel Analytics + Sentry (errors)
- **Logging:** Supabase Logs

---

### Security Considerations

**Authentication:**
- Phone OTP via Supabase Auth
- JWT tokens with 7-day expiry
- HttpOnly cookies for token storage

**Authorization:**
- Row Level Security (RLS) in Supabase
- Hosts can only access their own games
- Public RSVP pages are read-only (except form submission)

**Data Privacy:**
- Player phone numbers visible only to host of that game
- No data sharing with third parties
- GDPR-compliant (if expanding to EU)

**Rate Limiting:**
- Supabase built-in rate limits
- Custom limits on OTP requests (max 3 per hour per phone)
- RSVP submission: max 5 per IP per game

---

## 🗄️ Database Schema

### Tables

#### `hosts`
```sql
CREATE TABLE hosts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  approved BOOLEAN DEFAULT FALSE,
  line_oa_connected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_hosts_phone ON hosts(phone);
CREATE INDEX idx_hosts_approved ON hosts(approved);
```

#### `games`
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
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_games_host_id ON games(host_id);
CREATE INDEX idx_games_share_code ON games(share_code);
CREATE INDEX idx_games_date ON games(date);
CREATE INDEX idx_games_status ON games(status);

-- Function to generate unique share code
CREATE OR REPLACE FUNCTION generate_share_code()
RETURNS VARCHAR(8) AS $$
DECLARE
  chars TEXT := 'abcdefghijklmnopqrstuvwxyz0123456789';
  result VARCHAR(8) := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;
```

#### `rsvps`
```sql
CREATE TABLE rsvps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  player_name VARCHAR(100) NOT NULL,
  player_phone VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'declined', 'maybe')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent duplicate RSVPs from same phone for same game
  UNIQUE(game_id, player_phone)
);

-- Indexes
CREATE INDEX idx_rsvps_game_id ON rsvps(game_id);
CREATE INDEX idx_rsvps_status ON rsvps(status);
```

#### `admin_users`
```sql
-- For E3 to approve hosts
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert E3 as first admin (run after deployment)
-- INSERT INTO admin_users (phone, name) VALUES ('E3_PHONE_NUMBER', 'E3');
```

---

### Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE hosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

-- Hosts can only read/update their own data
CREATE POLICY "Hosts can view own profile"
  ON hosts FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Hosts can update own profile"
  ON hosts FOR UPDATE
  USING (auth.uid() = id);

-- Hosts can only view/edit their own games
CREATE POLICY "Hosts can view own games"
  ON games FOR SELECT
  USING (host_id = auth.uid());

CREATE POLICY "Hosts can create games"
  ON games FOR INSERT
  WITH CHECK (host_id = auth.uid());

CREATE POLICY "Hosts can update own games"
  ON games FOR UPDATE
  USING (host_id = auth.uid());

-- Public can view active games by share code (for RSVP page)
CREATE POLICY "Public can view games by share code"
  ON games FOR SELECT
  USING (status = 'active');

-- RSVPs: Host can view all for their games
CREATE POLICY "Hosts can view RSVPs for own games"
  ON rsvps FOR SELECT
  USING (
    game_id IN (SELECT id FROM games WHERE host_id = auth.uid())
  );

-- Public can create RSVPs (for RSVP page submission)
CREATE POLICY "Public can create RSVPs"
  ON rsvps FOR INSERT
  WITH CHECK (true);

-- Public can view RSVPs for a game (to see who's attending)
CREATE POLICY "Public can view RSVPs"
  ON rsvps FOR SELECT
  USING (true);
```

---

## 🔌 API Specifications

### REST API Endpoints

**Base URL:** `https://mahjong.host/api`

---

#### Authentication

**POST `/api/auth/register`**
```json
Request:
{
  "phone": "+886912345678",
  "name": "明哥"
}

Response:
{
  "success": true,
  "message": "OTP sent to phone",
  "sessionId": "abc123xyz"
}
```

**POST `/api/auth/verify-otp`**
```json
Request:
{
  "sessionId": "abc123xyz",
  "otp": "123456"
}

Response:
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "phone": "+886912345678",
    "name": "明哥",
    "approved": false
  }
}
```

**POST `/api/auth/login`**
```json
Request:
{
  "phone": "+886912345678"
}

Response:
{
  "success": true,
  "message": "OTP sent",
  "sessionId": "xyz789"
}
```

---

#### Games

**POST `/api/games` (Protected)**
```json
Request:
Headers: { "Authorization": "Bearer jwt_token" }
Body:
{
  "date": "2026-04-05",
  "timeSlot": "下午2點-6點",
  "location": "明哥家 - 台北市信義區",
  "maxSeats": 4,
  "notes": "小賭怡情，每台$10"
}

Response:
{
  "success": true,
  "game": {
    "id": "uuid",
    "shareCode": "abc12345",
    "shareUrl": "https://mahjong.host/join/abc12345",
    "date": "2026-04-05",
    "timeSlot": "下午2點-6點",
    "location": "明哥家 - 台北市信義區",
    "maxSeats": 4,
    "notes": "小賭怡情，每台$10",
    "createdAt": "2026-03-30T15:00:00Z"
  }
}
```

**GET `/api/games` (Protected)**
```json
Response:
{
  "success": true,
  "games": [
    {
      "id": "uuid",
      "shareCode": "abc12345",
      "date": "2026-04-05",
      "timeSlot": "下午2點-6點",
      "location": "明哥家",
      "maxSeats": 4,
      "rsvpCount": 3,
      "status": "active"
    }
  ]
}
```

**GET `/api/games/:shareCode` (Public)**
```json
Response:
{
  "success": true,
  "game": {
    "id": "uuid",
    "hostName": "明哥",
    "date": "2026-04-05",
    "timeSlot": "下午2點-6點",
    "location": "明哥家 - 台北市信義區",
    "maxSeats": 4,
    "notes": "小賭怡情，每台$10",
    "rsvps": [
      {
        "playerName": "阿明",
        "status": "confirmed",
        "createdAt": "2026-03-30T14:00:00Z"
      },
      {
        "playerName": "小華",
        "status": "confirmed",
        "createdAt": "2026-03-30T14:30:00Z"
      }
    ],
    "availableSeats": 2
  }
}
```

**PATCH `/api/games/:id` (Protected)**
```json
Request:
{
  "status": "cancelled"
}

Response:
{
  "success": true,
  "game": { ... }
}
```

---

#### RSVPs

**POST `/api/rsvps` (Public)**
```json
Request:
{
  "gameId": "uuid_or_share_code",
  "playerName": "阿華",
  "playerPhone": "+886923456789",
  "status": "confirmed"
}

Response:
{
  "success": true,
  "rsvp": {
    "id": "uuid",
    "gameId": "uuid",
    "playerName": "阿華",
    "status": "confirmed",
    "createdAt": "2026-03-30T15:30:00Z"
  }
}

Error (game full):
{
  "success": false,
  "error": "GAME_FULL",
  "message": "此局已滿員"
}

Error (duplicate RSVP):
{
  "success": false,
  "error": "ALREADY_REGISTERED",
  "message": "此手機號碼已報名"
}
```

**GET `/api/games/:id/rsvps` (Protected - Host only)**
```json
Response:
{
  "success": true,
  "rsvps": [
    {
      "id": "uuid",
      "playerName": "阿明",
      "playerPhone": "+886912345678",
      "status": "confirmed",
      "createdAt": "2026-03-30T14:00:00Z"
    }
  ]
}
```

---

#### Admin (E3 only)

**GET `/api/admin/pending-hosts` (Protected - Admin only)**
```json
Response:
{
  "success": true,
  "hosts": [
    {
      "id": "uuid",
      "name": "新主辦人",
      "phone": "+886912345678",
      "createdAt": "2026-03-30T10:00:00Z"
    }
  ]
}
```

**POST `/api/admin/approve-host` (Protected - Admin only)**
```json
Request:
{
  "hostId": "uuid"
}

Response:
{
  "success": true,
  "message": "Host approved"
}
```

---

### Real-Time Subscriptions (Supabase)

**Subscribe to game RSVPs:**
```javascript
// Frontend code
const subscription = supabase
  .from('rsvps')
  .on('INSERT', payload => {
    // New RSVP added - update UI
    console.log('New RSVP:', payload.new);
  })
  .on('UPDATE', payload => {
    // RSVP status changed
    console.log('RSVP updated:', payload.new);
  })
  .subscribe();
```

---

## 📱 User Flow Diagrams

### Flow 1: Host Creates Game & Shares

```
┌────────────┐
│ Host Login │
└─────┬──────┘
      │
      ▼
┌───────────────────┐
│ Dashboard         │
│ Click "建立新局"  │
└─────┬─────────────┘
      │
      ▼
┌──────────────────────┐
│ Fill Game Details    │
│ - Date               │
│ - Time               │
│ - Location           │
│ - Seats              │
└─────┬────────────────┘
      │
      ▼
┌───────────────────────┐
│ Click "建立遊戲"      │
└─────┬─────────────────┘
      │
      ▼
┌────────────────────────┐
│ Success Modal          │
│ - Show share link      │
│ - [複製連結]           │
│ - [發送 LINE 訊息]     │
└─────┬──────────────────┘
      │
      ├─────────────────┐
      │                 │
      ▼                 ▼
┌─────────────┐   ┌──────────────┐
│ Copy Link   │   │ Send via LINE│
│ Paste in    │   │ Auto-message │
│ LINE group  │   │ to contacts  │
└─────────────┘   └──────────────┘
```

---

### Flow 2: Player Receives Link & RSVPs

```
┌──────────────────┐
│ Receive LINE msg │
│ with game link   │
└─────┬────────────┘
      │
      ▼
┌──────────────────┐
│ Click link       │
│ Opens RSVP page  │
└─────┬────────────┘
      │
      ▼
┌──────────────────────┐
│ View game details    │
│ - Date/Time/Location │
│ - Current RSVPs (2/4)│
└─────┬────────────────┘
      │
      ▼
┌──────────────────┐
│ Fill RSVP form   │
│ - Name           │
│ - Phone          │
│ - Status         │
└─────┬────────────┘
      │
      ▼
┌──────────────────┐
│ Click "確認送出" │
└─────┬────────────┘
      │
      ▼
┌──────────────────────┐
│ Validation           │
│ - Check duplicates   │
│ - Check seats full   │
└─────┬────────────────┘
      │
      ├──── Error ────┐
      │               │
      ▼               ▼
┌─────────────┐ ┌──────────────┐
│ Success!    │ │ Error msg    │
│ "報名成功"  │ │ "已額滿" or  │
│             │ │ "已報名過"   │
│ [返回首頁]  │ └──────────────┘
└─────────────┘
```

---

### Flow 3: Admin Approves Host

```
┌─────────────────┐
│ New host signs  │
│ up              │
└─────┬───────────┘
      │
      ▼
┌──────────────────────┐
│ Account created      │
│ Status: "pending"    │
└─────┬────────────────┘
      │
      ▼
┌──────────────────────┐
│ E3 receives notif    │
│ (email or dashboard) │
└─────┬────────────────┘
      │
      ▼
┌──────────────────────┐
│ E3 logs into admin   │
│ Views pending hosts  │
└─────┬────────────────┘
      │
      ▼
┌───────────────────────┐
│ E3 reviews host info  │
│ - Name                │
│ - Phone               │
│ - Registration date   │
└─────┬─────────────────┘
      │
      ▼
┌──────────────────┐
│ E3 clicks        │
│ "批准" (Approve) │
└─────┬────────────┘
      │
      ▼
┌──────────────────────┐
│ Host status updated  │
│ approved = true      │
└─────┬────────────────┘
      │
      ▼
┌──────────────────────┐
│ Host receives SMS    │
│ "您的帳號已通過審核" │
└─────┬────────────────┘
      │
      ▼
┌──────────────────┐
│ Host can now     │
│ login & create   │
│ games            │
└──────────────────┘
```

---

## 🚀 Development Roadmap

### Pre-Development (Week 0)
- [x] PRD finalized
- [ ] GitHub repo created
- [ ] Figma wireframes (optional)
- [ ] Domain purchased (e.g., `mahjong.host`)
- [ ] Supabase project created
- [ ] LINE OA registered
- [ ] Twilio account set up

---

### Phase 1: Core MVP (Weeks 1-3)

**Week 1: Foundation**
- [ ] Initialize Next.js project with TypeScript
- [ ] Set up Tailwind CSS + Shadcn UI
- [ ] Configure Supabase connection
- [ ] Create database schema + RLS policies
- [ ] Implement phone OTP authentication
- [ ] Build basic host registration flow
- [ ] Create admin approval dashboard (minimal)

**Deliverable:** Hosts can register and get approved

---

**Week 2: Game Creation & RSVP**
- [ ] Build host dashboard (list games)
- [ ] Create game creation form
- [ ] Implement unique share code generation
- [ ] Build public RSVP page
- [ ] Implement RSVP form submission
- [ ] Add real-time RSVP updates (Supabase subscriptions)
- [ ] Add seat availability logic

**Deliverable:** End-to-end flow working (host creates → player RSVPs)

---

**Week 3: UI Polish & Mahjong Aesthetic**
- [ ] Apply mahjong color palette
- [ ] Design custom tile-styled cards
- [ ] Add mahjong tile icons
- [ ] Implement responsive mobile design
- [ ] Add form validation + error states
- [ ] Create loading states
- [ ] Test on mobile devices

**Deliverable:** Functional MVP with authentic mahjong feel

---

### Phase 2: LINE Integration (Week 4)

- [ ] Integrate LINE Messaging API
- [ ] Create message templates
- [ ] Build "Share to LINE" feature (browser share API)
- [ ] Optional: Direct send to LINE contacts
- [ ] Test message delivery
- [ ] Add delivery status tracking

**Deliverable:** Hosts can auto-share via LINE

---

### Phase 3: Polish & Launch Prep (Week 5)

- [ ] Add sound effects (tile clicks, shuffles)
- [ ] Implement subtle animations (Framer Motion)
- [ ] Add copy-to-clipboard functionality
- [ ] Create host onboarding tutorial
- [ ] Write help documentation
- [ ] Set up error monitoring (Sentry)
- [ ] Performance optimization
- [ ] SEO optimization (meta tags, OG images)
- [ ] Security audit
- [ ] Load testing

**Deliverable:** Production-ready platform

---

### Phase 4: Beta Testing (Week 6)

- [ ] Recruit 5-10 beta hosts
- [ ] Create test games
- [ ] Gather feedback
- [ ] Fix bugs
- [ ] Iterate on UX issues
- [ ] Prepare marketing materials

**Deliverable:** Validated product ready for public launch

---

### Post-Launch Enhancements (Future)

**Phase 5: Advanced Features**
- [ ] Host analytics (game history, attendance rates)
- [ ] Player profiles (frequent players, preferences)
- [ ] Automated reminders (24h before game)
- [ ] Calendar integration (Google Calendar, Apple Calendar)
- [ ] Multi-language support (English, Cantonese)
- [ ] Payment integration (optional stakes collection)
- [ ] Rating system (players rate hosts & vice versa)

**Phase 6: Growth Features**
- [ ] Referral program (hosts invite other hosts)
- [ ] Public game discovery (find nearby games)
- [ ] Premium host subscriptions
- [ ] White-label solution (mahjong parlors can use platform)

---

## 📏 Success Criteria

### MVP Launch Criteria (Week 5)

**Must Have:**
- ✅ Host registration + approval works
- ✅ Hosts can create games
- ✅ Players can RSVP via shareable link
- ✅ Real-time RSVP updates
- ✅ Mobile-responsive design
- ✅ Mahjong aesthetic implemented
- ✅ LINE sharing works (at minimum via browser share)
- ✅ No critical bugs

**Nice to Have:**
- Sound effects
- Advanced animations
- Direct LINE OA sending

---

### 3-Month Success Metrics

- 50+ verified hosts
- 200+ games created
- 1,000+ RSVPs submitted
- 90%+ RSVP completion rate (players who click link actually RSVP)
- 80%+ host retention (hosts create 2nd game)
- <1% error rate
- 99% uptime

---

## 🧪 Testing Plan

### Unit Tests
- Authentication flows
- Form validations
- API endpoints
- Database queries

### Integration Tests
- End-to-end user flows
- Real-time subscriptions
- External API integrations (LINE, Twilio)

### Manual Testing
- Mobile device testing (iOS Safari, Android Chrome)
- Cross-browser testing (Chrome, Safari, Firefox)
- Accessibility (WCAG 2.1 AA compliance)
- Performance (Lighthouse score >90)

---

## 📞 Support & Maintenance

**Bug Reports:**
- In-app feedback form
- Email: support@mahjong.host

**Host Support:**
- Onboarding tutorial (first login)
- FAQ page
- WhatsApp/LINE support channel (E3 initially)

**Monitoring:**
- Vercel Analytics (performance)
- Sentry (error tracking)
- Supabase logs (database issues)
- Weekly health checks

---

## 📄 Appendices

### A. Competitor Analysis

**Existing Solutions:**
1. **Manual (Current State):**
   - Pros: Free, familiar
   - Cons: Time-consuming, error-prone

2. **WhatsApp/LINE Groups:**
   - Pros: Built-in messaging
   - Cons: Messages get buried, no structured RSVP

3. **Google Forms:**
   - Pros: Free, easy to create
   - Cons: Not real-time, no mahjong aesthetic, generic

4. **Eventbrite/Meetup:**
   - Pros: Established platforms
   - Cons: Overkill for small games, not Taiwan-localized

**Our Advantage:**
- Taiwan-first design (LINE integration, Traditional Chinese)
- Mahjong-specific aesthetic (not generic event platform)
- Real-time updates (see RSVPs instantly)
- Zero friction for players (no login required)

---

### B. Glossary

- **Host:** Organizer of mahjong games
- **Player:** Person attending mahjong game
- **RSVP:** Confirmation of attendance (Répondez s'il vous plaît)
- **Share Code:** Unique 8-character code for each game (e.g., `abc12345`)
- **LINE OA:** LINE Official Account (business messaging account)
- **OTP:** One-Time Password (SMS verification code)
- **RLS:** Row Level Security (database access control)

---

### C. References

**Technical Docs:**
- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- LINE Messaging API: https://developers.line.biz/en/docs/messaging-api/
- Twilio SMS: https://www.twilio.com/docs/sms

**Design Inspiration:**
- Traditional mahjong parlors (Hong Kong, Taiwan)
- Classic tile designs
- Vintage gambling aesthetics

---

## ✅ Sign-Off

**Product Owner:** E3 (イーシャン)  
**Tech Lead:** Puchitotto (ぷちとっと)  
**Date:** 2026-03-30  

**Approved for Development:** ✅

---

**Next Steps:**
1. Create GitHub repository
2. Set up Supabase project
3. Initialize Next.js app
4. Begin Phase 1 development

🀄 Let's build something amazing! 🀄
