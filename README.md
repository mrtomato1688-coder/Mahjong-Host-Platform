# 🀄 麻將揪咖 (Mahjong Host Platform)

**輕鬆揪團，一鍵開局** (Easy Invites, One-Click Games)

A web platform for mahjong game hosts to organize games effortlessly. Hosts create sessions, share links, and players RSVP themselves — no more endless phone calls!

**Status:** ✅ Day 2 Complete - All core features implemented!

---

## 🚀 Quick Start

**Want to test it right now?**

```bash
# Clone and install
git clone https://github.com/mrtomato1688-coder/Mahjong-Host-Platform.git
cd Mahjong-Host-Platform
npm install

# Set up Supabase (5 min) - See SUPABASE-SETUP.md
# Add .env.local with your Supabase credentials

# Run
npm run dev
```

**Full guides:**
- 📖 [QUICKSTART.md](QUICKSTART.md) - 10-minute setup
- 🗄️ [SUPABASE-SETUP.md](SUPABASE-SETUP.md) - Database setup
- 🚀 [DEPLOYMENT.md](DEPLOYMENT.md) - Deploy to Vercel
- 📊 [PROGRESS-DAY-2.md](PROGRESS-DAY-2.md) - What's been built

---

## 🎯 Features

- **For Hosts:**
  - ✅ Create game sessions with date, start/end time pickers, location
  - ✅ Configure food & beverage menu (beer, soda, snacks, etc.)
  - ✅ Generate unique 8-character shareable links
  - ✅ Track RSVPs in real-time with live updates
  - ✅ Manage multiple games from dashboard
  - ✅ See who selected which F&B items

- **For Players:**
  - ✅ View game details via shared link (no login required)
  - ✅ RSVP with just name + phone
  - ✅ Select food & beverage preferences
  - ✅ See who else is attending in real-time
  - ✅ Real-time seat availability updates
  - ✅ Mobile-optimized experience

---

## 🎨 Design

Authentic mahjong aesthetic inspired by traditional Hong Kong/Taiwan mahjong parlors:
- Deep jade green (felt table)
- Ivory mahjong tiles
- Chinese red accents
- 3D tile-styled cards
- Authentic sound effects

---

## 🛠️ Tech Stack

**Frontend:**
- Next.js 15 (App Router, TypeScript)
- Tailwind CSS
- React 19
- Lucide Icons

**Backend:**
- Supabase (PostgreSQL + Auth + Realtime)
- Next.js API Routes (Server Actions)
- Row Level Security (RLS)

**Hosting:**
- Vercel (Frontend + Edge Functions)
- Supabase Cloud (Database)

**Future:**
- LINE Messaging API (Phase 3)
- Twilio SMS OTP (Phase 3)

---

## 📂 Project Structure

```
mahjong-host-platform/
├── PRD.md                 # Product Requirements Document
├── README.md              # This file
├── docs/                  # Additional documentation
│   ├── API.md            # API documentation
│   ├── DATABASE.md       # Database schema
│   └── DEPLOYMENT.md     # Deployment guide
├── src/                   # Source code (Next.js app)
│   ├── app/              # App router pages
│   ├── components/       # React components
│   ├── lib/              # Utilities & helpers
│   └── styles/           # Global styles
├── public/               # Static assets
│   ├── sounds/           # Mahjong sound effects
│   └── images/           # Icons, logos
└── supabase/             # Database migrations & config
    ├── migrations/
    └── config.toml
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- LINE Developers account (for OA)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/Mahjong-Host-Platform.git
cd Mahjong-Host-Platform

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase & LINE credentials

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

Open http://localhost:3000 to see the app.

---

## 📚 Documentation

- **[PRD.md](./PRD.md)** - Comprehensive product requirements
- **[API.md](./docs/API.md)** - API endpoint specifications
- **[DATABASE.md](./docs/DATABASE.md)** - Database schema & RLS policies
- **[DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - Production deployment guide

---

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Run type checking
npm run type-check

# Run linting
npm run lint
```

---

## 📦 Deployment

**Automatic deployment via Vercel:**
1. Connect GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Push to `main` branch → auto-deploy

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed instructions.

---

## 🗓️ Roadmap

### Phase 1: Core MVP ✅ (Weeks 1-3)
- [x] PRD completed
- [ ] Authentication (Phone OTP)
- [ ] Game creation & management
- [ ] Public RSVP page
- [ ] Real-time updates
- [ ] Mahjong aesthetic UI

### Phase 2: LINE Integration (Week 4)
- [ ] LINE OA connection
- [ ] Auto-send game invitations
- [ ] Message templates

### Phase 3: Polish (Week 5)
- [ ] Sound effects
- [ ] Animations
- [ ] Mobile optimization
- [ ] Performance tuning

### Phase 4: Beta Testing (Week 6)
- [ ] Recruit beta hosts
- [ ] Gather feedback
- [ ] Bug fixes

### Future Enhancements
- [ ] Host analytics
- [ ] Automated reminders
- [ ] Calendar integration
- [ ] Payment integration
- [ ] Multi-language support

---

## 👥 Team

- **Product Owner:** E3 (イーシャン)
- **Tech Lead:** Puchitotto (ぷちとっと)
- **Commander:** Tomatotto (とまとっと) 🍑

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

- Traditional mahjong culture (Hong Kong, Taiwan, Macau)
- OpenClaw AI agent framework
- Supabase & Vercel teams

---

## 📞 Support

- **Email:** support@mahjong.host
- **Issues:** [GitHub Issues](https://github.com/YOUR_USERNAME/Mahjong-Host-Platform/issues)
- **Discussions:** [GitHub Discussions](https://github.com/YOUR_USERNAME/Mahjong-Host-Platform/discussions)

---

🀄 **Built with love by the Tomato Team** 🍅
