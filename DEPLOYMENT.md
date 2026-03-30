# 🚀 Deployment Guide - Vercel

Deploy the Mahjong Host Platform to production on Vercel.

---

## Prerequisites

✅ Supabase project set up (see `SUPABASE-SETUP.md`)  
✅ Code pushed to GitHub  
✅ Vercel account (free tier works)

---

## Step 1: Connect GitHub to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select **"Continue with GitHub"** (if not already connected)
5. Authorize Vercel to access your GitHub repos
6. Find and select: `mrtomato1688-coder/Mahjong-Host-Platform`
7. Click **"Import"**

---

## Step 2: Configure Project Settings

### Framework Preset:
- Should auto-detect: **Next.js**
- ✅ No changes needed

### Build Command:
```bash
next build
```

### Output Directory:
```bash
.next
```

### Install Command:
```bash
npm install
```

### Development Command:
```bash
next dev
```

✅ All defaults are correct - click **"Deploy"** (but wait, we need env vars first!)

---

## Step 3: Add Environment Variables

**IMPORTANT:** Before deploying, add your environment variables!

1. In Vercel project settings, go to **"Environment Variables"**
2. Add the following variables:

### Required Variables:

| Key | Value | Environment |
|-----|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` | Production |
| `NEXT_PUBLIC_APP_URL` | (Auto-set by Vercel) | Preview, Development |

### How to Add:
1. Click **"Add"**
2. Enter variable name (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
3. Paste the value
4. Select environments (usually all three)
5. Click **"Save"**

### Where to Find Values:
- Supabase URL & Keys: Supabase Dashboard → Settings → API
- App URL: Will be provided after first deploy (or use custom domain)

---

## Step 4: Deploy!

1. After adding all environment variables
2. Click **"Deploy"** (or **"Redeploy"** if already attempted)
3. Wait ~2-3 minutes for build to complete
4. Vercel will show deployment progress in real-time

### Build Logs:
- ✅ Installing dependencies...
- ✅ Building application...
- ✅ Optimizing production build...
- ✅ Deployment ready!

---

## Step 5: Test Production URL

1. Vercel will provide a URL: `https://mahjong-host-platform-xxx.vercel.app`
2. Open it in your browser
3. Test the flow:
   - ✅ Home page loads
   - ✅ Login works (mock OTP for now)
   - ✅ Dashboard shows (empty at first)
   - ✅ Create a game
   - ✅ Copy RSVP link
   - ✅ Open RSVP link in incognito
   - ✅ Submit RSVP
   - ✅ RSVP appears instantly (real-time!)

---

## Step 6: Update NEXT_PUBLIC_APP_URL

After first deploy:

1. Copy your production URL (e.g., `https://mahjong-host-platform-xxx.vercel.app`)
2. Go to Vercel → Project Settings → Environment Variables
3. Update `NEXT_PUBLIC_APP_URL` for **Production** environment
4. Click **"Redeploy"** to apply changes

This ensures share links use the correct domain!

---

## Step 7: Set Up Custom Domain (Optional)

### Free Vercel Domain:
- `https://mahjong-host-platform.vercel.app` (auto-assigned)
- Works immediately, no setup needed

### Custom Domain (e.g., `mahjong.yourdomain.com`):

1. Go to Vercel → Project Settings → **Domains**
2. Click **"Add"**
3. Enter your domain (e.g., `mahjong.yourdomain.com`)
4. Follow DNS instructions:
   - Add `CNAME` record pointing to `cname.vercel-dns.com`
   - Or use Vercel nameservers
5. Wait for DNS propagation (~1 hour)
6. Vercel will auto-provision SSL certificate
7. Update `NEXT_PUBLIC_APP_URL` to your custom domain

---

## Step 8: Configure Supabase for Production

### Update Allowed Origins:

1. Go to Supabase Dashboard → **Authentication** → **URL Configuration**
2. Add your Vercel URL to **Site URL**:
   ```
   https://mahjong-host-platform-xxx.vercel.app
   ```
3. Add to **Redirect URLs**:
   ```
   https://mahjong-host-platform-xxx.vercel.app/**
   ```

This allows authentication callbacks to work on production!

---

## Continuous Deployment

✅ **Auto-Deploy on Push:**  
Every time you push to `main` branch, Vercel will automatically:
1. Pull latest code
2. Run build
3. Deploy to production
4. Update live site

✅ **Preview Deployments:**  
Push to any branch → Vercel creates a preview URL for testing

---

## Monitoring & Analytics

### Vercel Analytics:
1. Go to Vercel → Project → **Analytics**
2. See visitor stats, page views, performance

### Supabase Dashboard:
1. Go to Supabase → **Database** → **Table Editor**
2. Monitor games, RSVPs in real-time

### Logs:
1. Vercel → **Deployments** → Click any deployment
2. View build logs, function logs, errors

---

## Rollback (if needed)

If a deployment breaks:

1. Go to Vercel → **Deployments**
2. Find a previous working deployment
3. Click **"⋯"** (three dots)
4. Click **"Promote to Production"**
5. Instant rollback! 🎉

---

## Performance Optimization

### Vercel Features Auto-Enabled:
- ✅ **Edge Caching** - Static assets cached globally
- ✅ **Automatic HTTPS** - SSL certificate included
- ✅ **Image Optimization** - Next.js Image component optimized
- ✅ **Compression** - Gzip/Brotli enabled

### Supabase Connection Pooling:
- Free tier: 500 concurrent connections
- Upgrade if needed (unlikely for prototype)

---

## Troubleshooting

### Build Fails:
- Check build logs in Vercel
- Ensure all dependencies are in `package.json`
- Run `npm run build` locally first to test

### Environment Variables Not Working:
- Make sure they're set for the correct environment (Production/Preview)
- Redeploy after adding new variables
- Check for typos in variable names

### API Routes Return 500:
- Check Vercel Function Logs
- Ensure `SUPABASE_SERVICE_ROLE_KEY` is set
- Verify Supabase connection from deployed URL

### Real-time Not Working:
- Check browser console for WebSocket errors
- Ensure `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
- Verify Realtime is enabled in Supabase dashboard

### Share Links Don't Work:
- Update `NEXT_PUBLIC_APP_URL` to production URL
- Redeploy after changing env vars

---

## Cost Breakdown (Free Tier)

### Vercel:
- ✅ Free for personal projects
- ✅ 100 GB bandwidth/month
- ✅ Unlimited deployments

### Supabase:
- ✅ Free for prototypes
- ✅ 500 MB database
- ✅ 1 GB file storage
- ✅ 50,000 monthly active users

**Total Cost: $0/month** 🎉

---

## Going to Production (Paid Plans)

When ready to launch:

### Vercel Pro ($20/month):
- Custom domains
- Password protection
- Analytics
- Priority support

### Supabase Pro ($25/month):
- 8 GB database
- 100 GB file storage
- Daily backups
- Point-in-time recovery

---

## Next Steps

✅ Deployed to Vercel!  
✅ Real users can access it  
✅ Auto-deploys on git push  

Now:
- Share the URL with E3
- Gather feedback
- Iterate on features
- Add analytics (Google Analytics, Mixpanel, etc.)
- Set up monitoring (Sentry for errors)

---

## Useful Links

- 📖 [Vercel Documentation](https://vercel.com/docs)
- 🚀 [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- 🔧 [Vercel CLI](https://vercel.com/docs/cli) - Deploy from terminal
- 📊 [Vercel Analytics](https://vercel.com/analytics)

---

**Congrats! Your app is live! 🍅🀄**
