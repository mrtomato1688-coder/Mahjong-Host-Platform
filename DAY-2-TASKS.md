# 🀄 Day 2 Tasks - Complete All Functionalities

**Date:** 2026-03-30  
**Goal:** Make the prototype fully functional with database, time picker, and F&B configuration

---

## ✅ Tasks to Complete

### 1. **Supabase Setup & Integration**
- [ ] Create Supabase project
- [ ] Execute database schema from `supabase/schema.sql`
- [ ] Set up environment variables
- [ ] Connect authentication (real Supabase Auth)
- [ ] Test database connection

### 2. **Enhanced Time Selection**
- [ ] Replace freeform time input with proper time picker
- [ ] Add start time picker (HH:MM format)
- [ ] Add end time picker (HH:MM format)
- [ ] Display as "14:00 - 18:00" format
- [ ] Validate: end time must be after start time

**UI Design:**
```
時間 *
┌─────────────────┐  到  ┌─────────────────┐
│ 14:00 ▼        │  →  │ 18:00 ▼        │
└─────────────────┘      └─────────────────┘
(開始時間)                (結束時間)
```

### 3. **Food & Beverage Configuration**
- [ ] Add F&B section to game creation form
- [ ] Host can add menu items (name + emoji)
- [ ] Pre-set common options (beer, soda, snacks, meals)
- [ ] Host can enable/disable F&B for a game

**Database Schema Addition:**
```sql
CREATE TABLE game_menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  item_name VARCHAR(100) NOT NULL,
  item_emoji VARCHAR(10),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE rsvps ADD COLUMN food_preferences TEXT[];
```

**UI Design (Create Game):**
```
食物飲料選項 (選填)
┌────────────────────────────────┐
│ ☑ 提供餐飲選項                  │
│                                 │
│ 已選擇項目:                     │
│ [🍺 啤酒] [x]                   │
│ [🥤 汽水] [x]                   │
│ [🍜 麵食] [x]                   │
│                                 │
│ 新增選項:                       │
│ [🍕 Pizza] [+ 新增]             │
│                                 │
│ 快速選擇:                       │
│ [+ 啤酒] [+ 汽水] [+ 麵食]      │
│ [+ 便當] [+ 披薩] [+ 點心]      │
└────────────────────────────────┘
```

**UI Design (RSVP Page):**
```
食物飲料
☑ 🍺 啤酒
☑ 🥤 汽水
☐ 🍜 麵食
```

### 4. **Complete Game CRUD Operations**

**Create:**
- [x] Form UI (done)
- [ ] Save to Supabase `games` table
- [ ] Save F&B items to `game_menu_items` table
- [ ] Generate unique share code (server-side)
- [ ] Return game ID and share code

**Read:**
- [ ] Dashboard: Fetch host's games from Supabase
- [ ] Display upcoming games (date >= today)
- [ ] Display past games (date < today)
- [ ] Show accurate RSVP count from database

**Update:**
- [ ] Edit game form (pre-populate existing data)
- [ ] Update game details in database
- [ ] Update F&B menu items

**Delete/Cancel:**
- [ ] Add cancel button
- [ ] Update game status to "cancelled"
- [ ] Notify players (future enhancement)

### 5. **RSVP System with Real-time**

**RSVP Submission:**
- [ ] Save to Supabase `rsvps` table
- [ ] Validate duplicate phone numbers
- [ ] Check if game is full
- [ ] Save F&B preferences (array of selected items)

**Real-time Updates:**
- [ ] Set up Supabase real-time subscription
- [ ] Listen to `rsvps` table changes
- [ ] Update RSVP list live (no page refresh)
- [ ] Update seat count live
- [ ] Show new RSVP animation

**Display RSVPs:**
- [ ] Fetch RSVPs for a game
- [ ] Show player name, timestamp
- [ ] Show F&B selections (if any)
- [ ] Host dashboard: show all RSVPs with phone numbers

### 6. **Authentication Flow**

**Phone OTP:**
- [ ] Implement Supabase Auth with phone provider
- [ ] Send OTP via Twilio (or use Supabase built-in SMS)
- [ ] Verify OTP
- [ ] Create session (JWT)
- [ ] Store session in cookies

**Session Management:**
- [ ] Protected routes middleware
- [ ] Redirect to login if not authenticated
- [ ] Logout functionality
- [ ] Session persistence (remember me)

**Mock OTP for Prototype:**
- [ ] Keep mock OTP option for testing (environment variable flag)
- [ ] Production uses real SMS

### 7. **UI Polish**

- [ ] Loading states (spinners, skeleton screens)
- [ ] Error states (form validation, API errors)
- [ ] Empty states (no games yet, no RSVPs)
- [ ] Success messages (toasts/alerts)
- [ ] Confirmation dialogs (cancel game, etc.)

### 8. **Mobile Optimization**

- [ ] Test all pages on mobile (especially RSVP)
- [ ] Touch-friendly tap targets (min 44px)
- [ ] Optimize form inputs for mobile keyboards
- [ ] Test time picker on iOS Safari and Android Chrome

### 9. **Deployment**

- [ ] Push all changes to GitHub
- [ ] Connect to Vercel
- [ ] Set environment variables in Vercel
- [ ] Deploy to production
- [ ] Test production URL
- [ ] Share with E3 for testing

---

## 🎨 Enhanced UI Wireframes

### Create Game Form (Enhanced)

```
┌────────────────────────────────────┐
│  建立新局                           │
├────────────────────────────────────┤
│                                     │
│  日期 *                             │
│  [📅 2026-04-05]                   │
│                                     │
│  時間 *                             │
│  ┌──────────┐  到  ┌──────────┐   │
│  │ 14:00 ▼ │  →  │ 18:00 ▼ │   │
│  └──────────┘      └──────────┘   │
│                                     │
│  地點 *                             │
│  [明哥家 - 台北市信義區]           │
│                                     │
│  桌數 *                             │
│  ◉ 1桌 (4人)                       │
│  ○ 2桌 (8人)                       │
│  ○ 3桌 (12人)                      │
│                                     │
│  備註 (選填)                        │
│  [小賭怡情，每台$10]               │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  食物飲料 (選填)                    │
│  ☑ 提供餐飲選項                     │
│                                     │
│  已選擇: 🍺 啤酒, 🥤 汽水          │
│                                     │
│  [🍺 啤酒] [x]  [🥤 汽水] [x]     │
│  [🍜 麵食] [x]  [🍕 披薩] [x]     │
│                                     │
│  新增項目:                          │
│  [輸入名稱...] [選表情] [+新增]    │
│                                     │
│  [取消]  [建立遊戲]                │
│                                     │
└────────────────────────────────────┘
```

### RSVP Page (Enhanced)

```
┌───────────────────────────────────┐
│    🀄 麻將局 - 報名確認            │
├───────────────────────────────────┤
│  主辦人: 明哥                      │
│  📅 2026年4月5日 (六)             │
│  🕐 14:00 - 18:00                 │
│  📍 明哥家 - 台北市信義區          │
│  💬 小賭怡情，每台$10              │
│                                   │
├───────────────────────────────────┤
│  報名狀況: 2/4 人                  │
│                                   │
│  ✅ 阿明 (30分鐘前)               │
│     🍺 啤酒, 🍜 麵食              │
│                                   │
│  ✅ 小華 (15分鐘前)               │
│     🥤 汽水                        │
│                                   │
│  ⬜ (空位)                         │
│  ⬜ (空位)                         │
│                                   │
├───────────────────────────────────┤
│  我要報名                          │
│                                   │
│  姓名 * [_________]               │
│  手機 * [09__-___-___]            │
│                                   │
│  狀態                              │
│  ◉ 確定參加                        │
│  ○ 不克參加                        │
│  ○ 再看看                          │
│                                   │
│  食物飲料 (可複選)                 │
│  ☑ 🍺 啤酒                        │
│  ☑ 🥤 汽水                        │
│  ☐ 🍜 麵食                        │
│  ☐ 🍕 披薩                        │
│                                   │
│  [確認送出]                        │
│                                   │
└───────────────────────────────────┘
```

### Host Dashboard (Enhanced)

```
┌───────────────────────────────────────┐
│  🀄 我的局        [+ 建立新局]        │
├───────────────────────────────────────┤
│                                        │
│  即將開始 (2)                          │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │ 📅 4月5日 (六) 14:00-18:00      │ │
│  │ 📍 明哥家                        │ │
│  │ 👥 3/4 人已報名                  │ │
│  │ 🍴 提供餐飲 (4項)                │ │
│  │                                  │ │
│  │ 報名名單:                        │ │
│  │ • 阿明 (0912-345-678)            │ │
│  │   🍺 啤酒, 🍜 麵食              │ │
│  │ • 小華 (0923-456-789)            │ │
│  │   🥤 汽水                        │ │
│  │ • 阿明 (0934-567-890)            │ │
│  │   🍺 啤酒, 🍕 披薩              │ │
│  │                                  │ │
│  │ [查看詳情] [複製連結] [編輯]    │ │
│  └──────────────────────────────────┘ │
│                                        │
└───────────────────────────────────────┘
```

---

## 🔧 Technical Implementation Notes

### Time Picker Implementation
```typescript
// Use native HTML5 time input (best for mobile)
<input 
  type="time" 
  value={startTime}
  onChange={(e) => setStartTime(e.target.value)}
  className="..."
/>

// Or use a library like react-datepicker for more control
import DatePicker from "react-datepicker";
<DatePicker
  selected={startTime}
  onChange={(time) => setStartTime(time)}
  showTimeSelect
  showTimeSelectOnly
  timeIntervals={15}
  timeCaption="時間"
  dateFormat="HH:mm"
/>
```

### F&B Data Structure
```typescript
// Game menu items (in database)
interface GameMenuItem {
  id: string;
  game_id: string;
  item_name: string;
  item_emoji: string;
}

// Player RSVP with F&B preferences
interface RSVP {
  id: string;
  game_id: string;
  player_name: string;
  player_phone: string;
  status: 'confirmed' | 'declined' | 'maybe';
  food_preferences: string[]; // ["🍺 啤酒", "🍜 麵食"]
}
```

### Real-time Subscription Example
```typescript
// In RSVP page component
useEffect(() => {
  const channel = supabase
    .channel('rsvps')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'rsvps',
        filter: `game_id=eq.${gameId}`,
      },
      (payload) => {
        // Add new RSVP to list
        setRsvps(prev => [...prev, payload.new]);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [gameId]);
```

---

## ⏱️ Estimated Timeline

**Total: 1-2 days**

- Supabase setup: 1 hour
- Time picker: 1 hour
- F&B configuration: 3 hours
- Game CRUD + real-time: 4 hours
- Authentication: 2 hours
- Testing + Polish: 2 hours
- Deployment: 1 hour

---

## 🎯 Definition of Done

- [x] Time picker with start/end time
- [x] F&B menu configuration in game creation
- [x] Players can select F&B preferences in RSVP
- [x] All data saves to Supabase
- [x] Real-time RSVP updates work
- [x] Authentication flow complete
- [x] Mobile-responsive
- [x] Deployed to Vercel
- [x] E3 can create real games and test with friends

---

**Priority Order:**
1. Supabase setup (foundation)
2. Time picker (E3's request)
3. F&B configuration (E3's request)
4. Game CRUD operations
5. Real-time updates
6. Polish & deployment

Let's build! 🀄🍅
