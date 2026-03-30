# 🀄 麻將揪咖 (Mahjong Host Platform)

**輕鬆揪團，一鍵開局** (Easy Invites, One-Click Games)

A web platform for mahjong game hosts to organize games effortlessly. Hosts create sessions, share links, and players RSVP themselves — no more endless phone calls!

---

## 🎯 Features

- **For Hosts:**
  - Create game sessions with date, time, location
  - Generate unique shareable links
  - Auto-send invitations via LINE Official Account
  - Track RSVPs in real-time
  - Manage multiple games from dashboard

- **For Players:**
  - View game details via shared link
  - RSVP with just name + phone (no login required)
  - See who else is attending
  - Real-time seat availability updates

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
- Next.js 14 (TypeScript)
- Tailwind CSS
- Shadcn UI
- Framer Motion

**Backend:**
- Supabase (PostgreSQL + Auth + Real-time)
- LINE Messaging API
- Twilio SMS

**Hosting:**
- Vercel (Frontend)
- Supabase Cloud (Database)

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
