-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Hosts table
CREATE TABLE IF NOT EXISTS hosts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  approved BOOLEAN DEFAULT FALSE,
  line_oa_connected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for hosts
CREATE INDEX IF NOT EXISTS idx_hosts_phone ON hosts(phone);
CREATE INDEX IF NOT EXISTS idx_hosts_approved ON hosts(approved);

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

-- Games table
CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_id UUID NOT NULL REFERENCES hosts(id) ON DELETE CASCADE,
  share_code VARCHAR(8) UNIQUE NOT NULL DEFAULT generate_share_code(),
  date DATE NOT NULL,
  time_slot VARCHAR(50) NOT NULL,
  location VARCHAR(200) NOT NULL,
  max_seats INTEGER NOT NULL DEFAULT 4 CHECK (max_seats IN (4, 8, 12)),
  notes TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for games
CREATE INDEX IF NOT EXISTS idx_games_host_id ON games(host_id);
CREATE INDEX IF NOT EXISTS idx_games_share_code ON games(share_code);
CREATE INDEX IF NOT EXISTS idx_games_date ON games(date);
CREATE INDEX IF NOT EXISTS idx_games_status ON games(status);

-- RSVPs table
CREATE TABLE IF NOT EXISTS rsvps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  player_name VARCHAR(100) NOT NULL,
  player_phone VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'declined', 'maybe')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(game_id, player_phone)
);

-- Indexes for rsvps
CREATE INDEX IF NOT EXISTS idx_rsvps_game_id ON rsvps(game_id);
CREATE INDEX IF NOT EXISTS idx_rsvps_status ON rsvps(status);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE hosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Hosts can view own profile" ON hosts;
DROP POLICY IF EXISTS "Hosts can update own profile" ON hosts;
DROP POLICY IF EXISTS "Hosts can view own games" ON games;
DROP POLICY IF EXISTS "Hosts can create games" ON games;
DROP POLICY IF EXISTS "Hosts can update own games" ON games;
DROP POLICY IF EXISTS "Public can view games by share code" ON games;
DROP POLICY IF EXISTS "Hosts can view RSVPs for own games" ON rsvps;
DROP POLICY IF EXISTS "Public can create RSVPs" ON rsvps;
DROP POLICY IF EXISTS "Public can view RSVPs" ON rsvps;

-- RLS Policies for hosts
CREATE POLICY "Hosts can view own profile"
  ON hosts FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Hosts can update own profile"
  ON hosts FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for games
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

-- RLS Policies for rsvps
CREATE POLICY "Hosts can view RSVPs for own games"
  ON rsvps FOR SELECT
  USING (
    game_id IN (SELECT id FROM games WHERE host_id = auth.uid())
  );

CREATE POLICY "Public can create RSVPs"
  ON rsvps FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can view RSVPs"
  ON rsvps FOR SELECT
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update updated_at
DROP TRIGGER IF EXISTS update_hosts_updated_at ON hosts;
CREATE TRIGGER update_hosts_updated_at
  BEFORE UPDATE ON hosts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_games_updated_at ON games;
CREATE TRIGGER update_games_updated_at
  BEFORE UPDATE ON games
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_rsvps_updated_at ON rsvps;
CREATE TRIGGER update_rsvps_updated_at
  BEFORE UPDATE ON rsvps
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
