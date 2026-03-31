-- Migration: Add price and quantity to game_menu_items
-- Date: 2026-03-31
-- Author: Puchitotto

-- Add price and quantity columns to game_menu_items
ALTER TABLE game_menu_items
  ADD COLUMN IF NOT EXISTS price INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS quantity INTEGER NOT NULL DEFAULT 0;

-- Add comment to clarify price is in TWD cents (e.g., 100 = $1 TWD)
COMMENT ON COLUMN game_menu_items.price IS 'Price in TWD (integer, e.g., 50 = $50 TWD)';
COMMENT ON COLUMN game_menu_items.quantity IS 'Available quantity (0 = unlimited)';

-- Update existing rows to have default values
UPDATE game_menu_items
SET price = 0, quantity = 0
WHERE price IS NULL OR quantity IS NULL;
