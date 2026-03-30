# 🀄 Mahjong Host Platform - Setup Guide

## Quick Start (Local Development)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Go to https://supabase.com and create a new project
2. Copy your project credentials:
   - Project URL
   - Anon/Public Key
   - Service Role Key

3. Run the database migration:
   - Go to Supabase Dashboard → SQL Editor
   - Copy contents of `supabase/schema.sql`
   - Execute the SQL

4. Update `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 3. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

---

## Current Features (Prototype)

✅ **Implemented:**
- Home page with mahjong aesthetic
- Login page (phone OTP - mock for prototype)
- Host dashboard (list games)
- Create game form
- Public RSVP page with real-time updates (mock)
- Responsive mobile design
- Mahjong color palette and UI components

🚧 **Mock Data (Not Connected to Supabase Yet):**
- Authentication (accepts any 6-digit OTP)
- Game creation (generates share code but doesn't save)
- RSVP submission (shows in UI but doesn't persist)

---

## Next Steps

### Phase 1: Connect to Supabase

1. **Authentication:**
   - Implement Supabase Auth with phone provider
   - Replace mock OTP with real Twilio integration
   - Add session management

2. **Game CRUD:**
   - `app/api/games/route.ts` - Create game
   - `app/api/games/[id]/route.ts` - Update/delete game
   - Connect dashboard to fetch real games

3. **RSVP:**
   - `app/api/rsvps/route.ts` - Submit RSVP
   - Real-time subscription with Supabase

4. **Admin Approval:**
   - Create admin dashboard at `/admin`
   - Approve/reject pending hosts

### Phase 2: Real-Time Features

- Set up Supabase real-time subscriptions
- Update RSVP list instantly when new player joins
- Show live seat count

### Phase 3: Deployment

1. Push to GitHub
2. Connect to Vercel
3. Set environment variables in Vercel
4. Deploy!

---

## File Structure

```
├── app/
│   ├── page.tsx              # Home page
│   ├── login/page.tsx        # Host login
│   ├── dashboard/page.tsx    # Host dashboard
│   ├── games/
│   │   └── new/page.tsx      # Create game form
│   └── join/
│       └── [shareCode]/      # Public RSVP page
│           └── page.tsx
├── components/
│   └── ui/                   # Reusable UI components
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Card.tsx
├── lib/
│   ├── supabase/             # Supabase client config
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── types.ts
│   └── utils.ts              # Helper functions
└── supabase/
    └── schema.sql            # Database schema
```

---

## Testing

### Test Login Flow
1. Go to http://localhost:3000/login
2. Enter any Taiwan phone number (e.g., 0912-345-678)
3. Enter any 6-digit code (e.g., 123456)
4. Should redirect to dashboard

### Test Game Creation
1. Login first
2. Click "建立新局" on dashboard
3. Fill in form
4. Click "建立遊戲"
5. Copy the shareable link

### Test RSVP
1. Open the shareable link (or go to http://localhost:3000/join/abc12345)
2. Fill in name and phone
3. Submit RSVP
4. Should see success message

---

## Environment Variables

Required for production:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Twilio (for SMS OTP)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# App URL (for shareable links)
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

---

## Troubleshooting

**Build errors:**
- Make sure Node.js >= 18
- Delete `node_modules` and `.next`, then `npm install` again

**Supabase connection issues:**
- Check `.env.local` has correct credentials
- Ensure RLS policies are set up correctly

**Styling issues:**
- Run `npm run dev` to rebuild Tailwind CSS
- Check browser console for errors

---

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [PRD.md](./PRD.md) - Full product requirements
- [PROTOTYPE-SCOPE.md](./PROTOTYPE-SCOPE.md) - Prototype scope

---

**Built by Puchitotto (ぷちとっと) for the Tomato Team** 🍑🀄
