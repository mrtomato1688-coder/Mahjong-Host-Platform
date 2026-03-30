# 🗄️ Supabase Setup Guide

Complete guide to set up Supabase for the Mahjong Host Platform.

---

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"New project"**
3. Fill in project details:
   - **Name:** `mahjong-host-platform` (or any name you prefer)
   - **Database Password:** Generate a strong password (save it securely!)
   - **Region:** Choose closest to Taiwan (e.g., `ap-northeast-1` or `ap-southeast-1`)
   - **Pricing Plan:** Free tier is sufficient for prototype
4. Click **"Create new project"**
5. Wait ~2 minutes for project to initialize

---

## Step 2: Run Database Schema

1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Copy the entire contents of `supabase/schema.sql` from this repo
4. Paste into the SQL editor
5. Click **"Run"** (or press `Ctrl+Enter`)
6. You should see: **"Success. No rows returned"**

### What This Creates:
- ✅ `hosts` table - Host profiles
- ✅ `games` table - Game sessions with start/end time
- ✅ `game_menu_items` table - F&B menu for each game
- ✅ `rsvps` table - Player RSVPs with food preferences
- ✅ `admin_users` table - Admin users for approval flow
- ✅ Row Level Security (RLS) policies
- ✅ Indexes for performance
- ✅ Automatic timestamp triggers

---

## Step 3: Get API Keys

1. In Supabase dashboard, go to **Settings** → **API**
2. Find the following credentials:

### You'll need:
- **Project URL** (e.g., `https://abcdefgh.supabase.co`)
- **anon public key** (starts with `eyJhbGc...`)
- **service_role key** (starts with `eyJhbGc...`)

⚠️ **Important:** 
- `anon` key is safe for client-side (public)
- `service_role` key is **SECRET** - only use server-side

---

## Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and fill in your Supabase credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your_anon_key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your_service_role_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. **Never commit `.env.local`** - it's already in `.gitignore`

---

## Step 5: Enable Realtime (for Live RSVPs)

1. In Supabase dashboard, go to **Database** → **Replication**
2. Find the `rsvps` table
3. Toggle **"Enable realtime"** to ON
4. Click **"Save"**

This allows the RSVP page to update live when new players join! 🎉

---

## Step 6: Test the Connection

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Go to http://localhost:3000
3. Try creating a game:
   - Login (use any phone number, OTP is mock for now)
   - Dashboard → "建立新局"
   - Fill in game details
   - Add F&B items
   - Click "建立遊戲"

4. If successful, you should:
   - See a success message
   - Get a shareable link
   - See the game in your dashboard

5. Test RSVP:
   - Copy the game link
   - Open in a new incognito window (or different browser)
   - Fill in RSVP form
   - Select F&B preferences
   - Submit

6. Go back to the first window:
   - The new RSVP should appear **instantly** (real-time!)
   - No page refresh needed

---

## Step 7: Verify in Supabase Dashboard

1. Go to **Table Editor** in Supabase dashboard
2. Check these tables:

### `games` table:
- Should see your created game
- `start_time` and `end_time` fields populated
- `share_code` generated (8 random chars)

### `game_menu_items` table:
- Should see F&B items linked to your game
- Each item has `item_name` and `item_emoji`

### `rsvps` table:
- Should see your RSVP
- `food_preferences` is an array (e.g., `["🍺 啤酒", "🍜 麵食"]`)

---

## Troubleshooting

### "Failed to create game" Error:
- Check that `.env.local` has correct credentials
- Make sure `SUPABASE_SERVICE_ROLE_KEY` is set
- Verify schema ran successfully (check Table Editor)

### "找不到此遊戲" on RSVP page:
- Game might not have been created in database
- Check `games` table in Supabase dashboard
- Verify share code matches URL

### Real-time updates not working:
- Check that Realtime is enabled for `rsvps` table
- Open browser console - look for WebSocket connection
- Make sure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set

### "Row Level Security" errors:
- RLS policies might not have been created
- Re-run the schema SQL (it's idempotent, safe to run multiple times)
- Check **Authentication** → **Policies** in Supabase dashboard

---

## Optional: Create a Test Host

For testing, you can manually insert a host record:

1. Go to **SQL Editor** in Supabase
2. Run this query:

```sql
INSERT INTO hosts (id, phone, name, approved)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '0912345678',
  '測試主辦人',
  true
);
```

This matches the `mockHostId` used in the API routes.

---

## Next Steps

✅ Supabase is now set up!  
✅ All CRUD operations work  
✅ Real-time RSVPs enabled  

You can now:
- Deploy to Vercel (see `DEPLOYMENT.md`)
- Set up real authentication (Twilio SMS OTP)
- Test with real users
- Add more features (edit game, cancel game, etc.)

---

## Useful Supabase Links

- 📖 [Supabase Documentation](https://supabase.com/docs)
- 🔒 [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- ⚡ [Realtime Documentation](https://supabase.com/docs/guides/realtime)
- 🧪 [SQL Editor](https://supabase.com/dashboard/project/_/sql)

---

**Questions?** Check the Supabase dashboard's built-in documentation or ask in the project Discord/Slack! 🍅
