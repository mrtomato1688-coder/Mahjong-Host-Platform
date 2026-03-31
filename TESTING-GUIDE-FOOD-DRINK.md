# 🧪 Testing Guide - Food & Drink Price/Quantity Feature

**For:** E3  
**Feature:** Price and quantity configuration for F&B menu items  
**Developer:** Puchitotto (ぷちとっと) 🍅  
**Date:** 2026-03-31

---

## 🚀 Quick Start

### Step 1: Update Supabase Database

Before testing, you need to run the database migration:

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Open your project
3. Navigate to **SQL Editor** (left sidebar)
4. Click **"New query"**
5. Open this file: `supabase/migrations/001_add_price_quantity_to_menu_items.sql`
6. Copy the entire content
7. Paste into SQL Editor
8. Click **"Run"** (or press `Ctrl+Enter`)
9. You should see: **"Success. No rows returned"**

**Alternative:** If you prefer, you can run the complete schema by using `supabase/schema.sql`, but this will recreate all tables (only do this if you're okay losing existing data).

---

### Step 2: Start Development Server

```bash
cd "C:\Users\Aaron Lin\Projects\Mahjong-Host-Platform"
npm run dev
```

Open: http://localhost:3000

---

## 🧪 Test Scenarios

### Scenario 1: Create Game with Preset F&B Items

**Steps:**
1. Go to Dashboard
2. Click "建立新局"
3. Fill in basic info (date, time, location, seats)
4. Enable "提供餐飲選項" checkbox
5. Click on preset items: 🍺 啤酒, 🥤 汽水
6. Notice they appear in "已選擇項目" section with default prices:
   - 啤酒: $50, quantity 0 (unlimited)
   - 汽水: $30, quantity 0 (unlimited)

**Expected:**
- ✅ Items show up with emoji, name, price, and quantity
- ✅ Price displays as "💰 $50"
- ✅ Quantity displays as "📦 無限" (when 0)

---

### Scenario 2: Edit Price and Quantity

**Steps:**
1. After selecting items (from Scenario 1)
2. Click "編輯" button on 啤酒
3. Edit mode appears with two input fields
4. Change price to `60`
5. Change quantity to `20`
6. Click "完成"

**Expected:**
- ✅ Input fields appear when clicking "編輯"
- ✅ Can type numbers into price and quantity fields
- ✅ After clicking "完成", display updates to:
  - "💰 $60"
  - "📦 20份"

---

### Scenario 3: Add Custom F&B Item with Price/Quantity

**Steps:**
1. Scroll to "新增自訂項目" section
2. Enter emoji: `🍟`
3. Enter name: `鹹酥雞`
4. Enter price: `100`
5. Enter quantity: `15`
6. Click the "+" button

**Expected:**
- ✅ Custom item appears in "已選擇項目" section
- ✅ Shows: 🍟 鹹酥雞
- ✅ Shows: 💰 $100
- ✅ Shows: 📦 15份

---

### Scenario 4: Create Game and View RSVP Page

**Steps:**
1. After configuring F&B items (Scenarios 1-3), fill in all required fields
2. Click "建立遊戲"
3. Success modal appears with shareable link
4. Copy the link
5. Open link in a **new incognito window** (or different browser)

**Expected on RSVP Page:**
- ✅ Menu items display in a vertical list
- ✅ Each item shows:
  - Emoji and name
  - Price (💰 $60)
  - Quantity info:
    - "📦 充足供應" if quantity is 0
    - "📦 剩20份" if quantity > 0
- ✅ Can select multiple items with checkboxes

---

### Scenario 5: Test "Out of Stock" Display

**To simulate this, you need to manually set quantity to 0 in the database:**

1. Go to Supabase Dashboard → **Table Editor**
2. Find `game_menu_items` table
3. Find a menu item
4. Set its `quantity` to `0` (for unlimited) or any low number
5. Refresh the RSVP page

**OR** create a new game with an item that has quantity = 1:
1. Add item with quantity `1`
2. Create game
3. Open RSVP page
4. Item shows "📦 剩1份"

**Expected:**
- ✅ Item shows correct remaining quantity
- ✅ (Future enhancement: quantity decreases when ordered)

---

### Scenario 6: View Dashboard with F&B Items

**Steps:**
1. After creating games with F&B items
2. Go to Dashboard
3. Look at game cards

**Expected:**
- ✅ Game cards show a "餐飲選項" section
- ✅ Menu items displayed as chips: `🍺 啤酒 $60 (20份)`
- ✅ Items without quantity limit show: `🥤 汽水 $30`

---

## 🎯 Visual Checklist

### Game Creation Page:

- [ ] "提供餐飲選項" checkbox toggles F&B section
- [ ] Preset items have default prices (check values match)
- [ ] Clicking preset item adds it to "已選擇項目"
- [ ] "編輯" button toggles edit mode
- [ ] Price and quantity inputs accept numbers
- [ ] "完成" button closes edit mode
- [ ] Custom item form has 4 fields: emoji, name, price, quantity
- [ ] "+" button adds custom item to list
- [ ] "X" button removes item from list
- [ ] Visual display shows "💰" and "📦" icons

### RSVP Page:

- [ ] Menu items display in vertical list (not grid)
- [ ] Each item shows emoji, name, price, quantity
- [ ] Price format: "💰 $50"
- [ ] Quantity format: "📦 剩10份" or "📦 充足供應"
- [ ] Checkboxes work correctly
- [ ] Selected items show checkmark ✓
- [ ] Mobile-friendly layout

### Dashboard:

- [ ] Game cards show "餐飲選項" section
- [ ] Menu items display as compact chips
- [ ] Price and quantity visible

---

## 🐛 Known Issues / Limitations

### Current Limitations:

1. **No automatic quantity tracking:**
   - Quantity does NOT decrease when players order
   - It's display-only for now
   - Host must manually track inventory

2. **No payment integration:**
   - Prices are informational only
   - No automatic total calculation
   - No payment processing

3. **No "sold out" enforcement:**
   - Items with quantity 0 can still be selected
   - Visual indicator only (grayed out)
   - Future: disable checkbox when out of stock

### Future Enhancements:

See `FOOD-DRINK-UPDATE.md` section "🔮 Future Enhancements" for planned features.

---

## 📊 Test Data Examples

### Good Test Cases:

**Preset Items (Default Prices):**
- 🍺 啤酒: $50
- 🥤 汽水: $30
- 🍜 麵食: $80
- 🍕 披薩: $120
- 🍱 便當: $100
- 🍪 點心: $40
- 🍵 茶飲: $35
- ☕ 咖啡: $45

**Custom Items to Try:**
- 🍟 鹹酥雞: $100, qty 15
- 🍗 炸雞: $120, qty 10
- 🥟 水餃: $60, qty 0 (unlimited)
- 🍰 蛋糕: $150, qty 1
- 🍾 紅酒: $300, qty 5

### Edge Cases to Test:

- Price = 0 (free item)
- Quantity = 0 (unlimited)
- Quantity = 1 (very limited)
- Very high price (e.g., $9999)
- Very high quantity (e.g., 999)
- Empty custom item name (should be disabled)
- Special characters in name (should work)

---

## 🚨 If Something Breaks

### Common Issues:

**"Column does not exist" error:**
- Migration didn't run successfully
- Re-run the migration SQL in Supabase

**Menu items don't show price/quantity:**
- Check browser console for errors
- Verify Supabase API keys in `.env.local`
- Refresh the page

**TypeScript errors:**
```bash
npm run type-check
```

**Build errors:**
```bash
npm run build
```

### Debugging Steps:

1. **Check Supabase Table Editor:**
   - Go to `game_menu_items` table
   - Verify `price` and `quantity` columns exist
   - Check that data is being saved

2. **Check Browser Console:**
   - Open DevTools (F12)
   - Look for red errors
   - Check Network tab for failed API calls

3. **Check API Response:**
   - Open Network tab in DevTools
   - Create a game with F&B items
   - Check POST /api/games request payload
   - Verify it includes `price` and `quantity`

4. **Verify Environment Variables:**
   ```bash
   cat .env.local
   ```
   Make sure `NEXT_PUBLIC_SUPABASE_URL` and keys are set

---

## ✅ Success Criteria

Your testing is successful if:

- [x] Can create games with F&B items that have prices
- [x] Can edit prices and quantities after adding items
- [x] Custom items accept all fields (emoji, name, price, quantity)
- [x] RSVP page displays prices correctly
- [x] RSVP page shows quantity information
- [x] Dashboard shows menu items with prices
- [x] Data persists after page refresh
- [x] No TypeScript or build errors
- [x] Mobile-responsive design works well

---

## 📸 Screenshots to Take (Optional)

If you want to share results:

1. Game creation page with edited F&B items
2. RSVP page showing prices and quantities
3. Dashboard with game cards showing menu items
4. Success modal after creating game

---

## 🎉 Next Steps

After testing:

1. **If everything works:**
   - Ready to deploy to Vercel!
   - See `DEPLOYMENT.md` for instructions
   - Update production Supabase with migration

2. **If issues found:**
   - Note down what broke
   - Share screenshots/errors with Puchitotto
   - We'll fix and re-test

3. **Feedback:**
   - UX improvements?
   - Additional features needed?
   - Default prices correct?

---

## 🍅 Happy Testing!

Enjoy the new F&B price and quantity features! 🍺🥤🍜

**Questions?** Ping Puchitotto on the tomato team! 🍅

---

**Files Changed:**
- Database: `supabase/schema.sql`, `supabase/migrations/001_*.sql`
- Types: `lib/supabase/types.ts`
- Frontend: `app/games/new/page.tsx`, `app/join/[shareCode]/page.tsx`, `app/dashboard/page.tsx`
- Backend: `app/api/games/route.ts`
- Docs: `FOOD-DRINK-UPDATE.md`, `TESTING-GUIDE-FOOD-DRINK.md`

**Git Commit:** `96fe6fc` - "feat: Add price and quantity to food & beverage menu items"
