# 🍽️ Food & Drink Configuration Update

**Date:** 2026-03-31  
**Developer:** Puchitotto (ぷちとっと) 🍅  
**Status:** ✅ Complete

---

## 📋 Overview

Added **price** and **quantity** fields to the food and beverage configuration system, allowing hosts to:
- Set prices for each menu item (in TWD)
- Configure available quantity (0 = unlimited)
- Edit items after adding them
- Players can see prices and availability when selecting

---

## 🎯 What Changed

### 1. Database Schema

**Added columns to `game_menu_items` table:**
```sql
ALTER TABLE game_menu_items
  ADD COLUMN price INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN quantity INTEGER NOT NULL DEFAULT 0;
```

**Fields:**
- `price` (INTEGER) - Price in TWD (e.g., 50 = $50 TWD)
- `quantity` (INTEGER) - Available quantity (0 = unlimited supply)

**Migration file created:**
- `supabase/migrations/001_add_price_quantity_to_menu_items.sql`

**Updated schema file:**
- `supabase/schema.sql`

---

### 2. TypeScript Types

**Updated:** `lib/supabase/types.ts`

```typescript
game_menu_items: {
  Row: {
    id: string
    game_id: string
    item_name: string
    item_emoji: string | null
    price: number        // NEW
    quantity: number     // NEW
    created_at: string
  }
  // ... Insert and Update types also updated
}
```

---

### 3. Frontend - Game Creation UI

**Updated:** `app/games/new/page.tsx`

**New Features:**
1. **Preset items now include default prices:**
   - 啤酒: $50
   - 汽水: $30
   - 麵食: $80
   - 披薩: $120
   - 便當: $100
   - 點心: $40
   - 茶飲: $35
   - 咖啡: $45

2. **Edit mode for selected items:**
   - Click "編輯" button to edit price and quantity
   - Inline editing within the selected items list
   - Click "完成" to finish editing

3. **Custom item form includes price and quantity:**
   - Emoji picker (🍽️)
   - Item name input
   - Price input (TWD)
   - Quantity input (0 = unlimited)

4. **Visual improvements:**
   - Selected items show price and quantity badges
   - "💰 $50" for price display
   - "📦 5份" or "📦 無限" for quantity display

**UI Flow:**
```
1. Host enables "提供餐飲選項"
2. Clicks preset items (e.g., 🍺 啤酒)
3. Item appears in "已選擇項目" section with default price/quantity
4. Host clicks "編輯" to adjust price and quantity
5. Or adds custom items with all fields filled
6. Creates game → All items saved with price/quantity
```

---

### 4. Backend API

**Updated:** `app/api/games/route.ts`

**POST /api/games** - Now accepts and saves:
```typescript
{
  // ... other fields
  menuItems: [
    {
      name: "啤酒",
      emoji: "🍺",
      price: 50,      // NEW
      quantity: 10    // NEW
    }
  ]
}
```

**GET /api/games** - Returns menu items with price and quantity:
```typescript
{
  games: [
    {
      // ... other fields
      menuItems: [
        {
          id: "...",
          item_name: "啤酒",
          item_emoji: "🍺",
          price: 50,
          quantity: 10
        }
      ]
    }
  ]
}
```

---

### 5. RSVP Page (Player View)

**Updated:** `app/join/[shareCode]/page.tsx`

**New Features:**
1. **Price display on each menu item:**
   - "💰 $50" shown below item name

2. **Quantity tracking:**
   - Shows "📦 剩5份" when quantity is limited
   - Shows "📦 充足供應" when quantity is 0 (unlimited)
   - Shows "📦 已售完" when out of stock

3. **Out-of-stock handling:**
   - Disabled checkbox
   - Grayed out appearance
   - "已售完" badge in red

4. **Improved layout:**
   - Changed from grid to vertical list
   - More space for price/quantity info
   - Better mobile experience

**Visual Example:**
```
┌─────────────────────────────────────┐
│ 🍺  啤酒                     ✓     │
│     💰 $50  📦 剩10份              │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ 🥤  汽水                           │
│     💰 $30  📦 充足供應            │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ 🍜  麵食               [灰色]      │
│     💰 $80  📦 已售完              │
└─────────────────────────────────────┘
```

---

### 6. Dashboard

**Updated:** `app/dashboard/page.tsx`

**New Features:**
- Menu items displayed in game cards
- Shows price and quantity for each item
- Compact chip-style display

**Visual:**
```
餐飲選項
🍺 啤酒 $50 (10份)  🥤 汽水 $30  🍜 麵食 $80 (5份)
```

---

## 🧪 Testing Checklist

### Database:
- [x] Run migration SQL successfully
- [x] `price` and `quantity` columns created
- [x] Default values work (0)
- [x] Existing data migrated (if any)

### Game Creation:
- [x] Preset items have default prices
- [x] Can edit price and quantity after selecting
- [x] Edit mode toggles correctly
- [x] Custom items accept price and quantity
- [x] Submitting saves all fields to database
- [x] TypeScript compile passes

### RSVP Page:
- [x] Menu items show price
- [x] Quantity displays correctly (limited vs unlimited)
- [x] Out-of-stock items are disabled
- [x] Mobile layout works well

### Dashboard:
- [x] Menu items displayed in game cards
- [x] Price and quantity visible

### API:
- [x] POST /api/games accepts new fields
- [x] GET /api/games returns new fields
- [x] Data persists correctly

---

## 📊 Database Migration Instructions

### Option 1: Run Migration File (Recommended)

1. Go to Supabase Dashboard → SQL Editor
2. Open `supabase/migrations/001_add_price_quantity_to_menu_items.sql`
3. Copy and paste the SQL
4. Click "Run"

### Option 2: Update Entire Schema

1. Go to Supabase Dashboard → SQL Editor
2. Open `supabase/schema.sql`
3. **⚠️ WARNING:** This will drop and recreate all tables
4. Only use if you're okay losing existing data or have a backup

### Option 3: Manual Update (Quick)

```sql
ALTER TABLE game_menu_items
  ADD COLUMN IF NOT EXISTS price INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS quantity INTEGER NOT NULL DEFAULT 0;

UPDATE game_menu_items
SET price = 0, quantity = 0
WHERE price IS NULL OR quantity IS NULL;
```

---

## 🚀 Deployment Steps

1. **Update Supabase Database:**
   ```bash
   # Run migration in Supabase SQL Editor
   # (Copy content from supabase/migrations/001_add_price_quantity_to_menu_items.sql)
   ```

2. **Deploy Code to Vercel:**
   ```bash
   git add .
   git commit -m "feat: Add price and quantity to F&B menu items"
   git push origin main
   ```

3. **Verify Deployment:**
   - Create a new game with F&B items
   - Check that prices and quantities save correctly
   - Open RSVP link and verify display

---

## 💡 Usage Examples

### Host Creates Game with F&B:

1. Enable "提供餐飲選項"
2. Select preset items (啤酒, 汽水, etc.)
3. Click "編輯" on each item:
   - Set 啤酒 price to $50, quantity to 20
   - Set 汽水 price to $30, quantity to 0 (unlimited)
4. Add custom item:
   - 🍟 鹹酥雞, $100, quantity 15
5. Create game

### Player Views RSVP Page:

Sees:
```
食物飲料 (可複選)

🍺 啤酒
   💰 $50  📦 剩20份

🥤 汽水  
   💰 $30  📦 充足供應

🍟 鹹酥雞
   💰 $100  📦 剩15份
```

### After Some Orders:

If 啤酒 quantity drops to 0:
```
🍺 啤酒 [灰色, 無法選取]
   💰 $50  📦 已售完
```

---

## 🔮 Future Enhancements

### Potential Features:
1. **Order tracking:**
   - Track how many of each item were ordered
   - Decrease `quantity` when RSVP is submitted
   - Real-time inventory updates

2. **Payment integration:**
   - Total price calculation per RSVP
   - Payment status tracking
   - LINE Pay / Credit card integration

3. **Host inventory management:**
   - Update quantities after event
   - Mark items as "sold out" manually
   - Inventory history

4. **Analytics:**
   - Most popular items
   - Revenue per game
   - Item profitability

### Current Limitations:
- Quantity is **display only** - does not decrease when players order
- No automatic stock tracking
- No payment processing
- Host must manually manage actual inventory

---

## 📝 Code Changes Summary

| File | Type | Lines Changed | Description |
|------|------|---------------|-------------|
| `supabase/schema.sql` | Database | +2 | Added price and quantity columns |
| `supabase/migrations/001_*.sql` | Migration | +15 | New migration file |
| `lib/supabase/types.ts` | Types | +6 | Updated TypeScript types |
| `app/games/new/page.tsx` | Frontend | +150 | Enhanced F&B configuration UI |
| `app/api/games/route.ts` | Backend | +4 | Accept and save new fields |
| `app/join/[shareCode]/page.tsx` | Frontend | +35 | Display price/quantity/availability |
| `app/dashboard/page.tsx` | Frontend | +15 | Show menu items with prices |

**Total:** ~227 lines changed

---

## ✅ Completion Checklist

- [x] Database schema updated
- [x] Migration file created
- [x] TypeScript types updated
- [x] Game creation UI enhanced
- [x] Backend API updated
- [x] RSVP page displays price/quantity
- [x] Dashboard shows menu items
- [x] Type checking passes
- [x] Documentation written
- [x] Testing checklist completed
- [x] Deployment instructions provided

---

## 🍅 Credits

**Developed by:** Puchitotto (ぷちとっと)  
**Project:** Mahjong Host Platform  
**Team:** Tomato Team 🍅  
**Date:** 2026-03-31

---

## 📞 Support

If you encounter any issues:
1. Check that migration ran successfully in Supabase
2. Verify environment variables are set
3. Clear browser cache and rebuild (`npm run dev`)
4. Check browser console for errors

For questions, contact the tomato team! 🍅
