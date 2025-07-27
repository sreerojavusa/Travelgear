/*
# Initial Schema for Trip Gear Rental Platform

1. New Tables
   - `profiles` - User profiles with additional information
   - `categories` - Product categories (clothes, accessories, etc.)
   - `items` - Rental items with details and pricing
   - `rentals` - User rental transactions and history
   - `cart_items` - Shopping cart functionality

2. Security
   - Enable RLS on all tables
   - Add policies for authenticated users
   - Secure access based on user ownership

3. Sample Data
   - Categories for different types of gear
   - Sample rental items with realistic pricing
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text,
  created_at timestamptz DEFAULT now()
);

-- Create items table
CREATE TABLE IF NOT EXISTS items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category_id uuid REFERENCES categories(id),
  daily_rate decimal(10,2) NOT NULL,
  weekly_rate decimal(10,2),
  deposit_amount decimal(10,2) DEFAULT 0,
  sizes text[],
  colors text[],
  brand text,
  condition text DEFAULT 'excellent',
  image_urls text[],
  availability boolean DEFAULT true,
  stock_quantity integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  phone text,
  address jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create rentals table
CREATE TABLE IF NOT EXISTS rentals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  item_id uuid REFERENCES items(id),
  rental_start date NOT NULL,
  rental_end date NOT NULL,
  total_amount decimal(10,2) NOT NULL,
  deposit_amount decimal(10,2) DEFAULT 0,
  status text DEFAULT 'pending',
  size_selected text,
  color_selected text,
  special_requests text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  item_id uuid REFERENCES items(id) ON DELETE CASCADE,
  rental_start date NOT NULL,
  rental_end date NOT NULL,
  size_selected text,
  color_selected text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Items are viewable by everyone"
  ON items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own rentals"
  ON rentals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create rentals"
  ON rentals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own cart"
  ON cart_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own cart"
  ON cart_items FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert sample categories
INSERT INTO categories (name, description, icon) VALUES
  ('Outerwear', 'Jackets, coats, and protective clothing', 'coat'),
  ('Footwear', 'Hiking boots, water shoes, and specialty footwear', 'footprints'),
  ('Backpacks & Bags', 'Travel backpacks, duffel bags, and day packs', 'backpack'),
  ('Camping Gear', 'Tents, sleeping bags, and camping equipment', 'tent'),
  ('Water Sports', 'Wetsuits, life jackets, and water gear', 'waves'),
  ('Winter Gear', 'Ski jackets, snow pants, and winter accessories', 'snowflake'),
  ('Accessories', 'Hats, gloves, and travel accessories', 'shirt');

-- Insert sample items
INSERT INTO items (title, description, category_id, daily_rate, weekly_rate, deposit_amount, sizes, colors, brand, image_urls) VALUES
  (
    'Patagonia Down Sweater Jacket',
    'Lightweight, packable down jacket perfect for layering on mountain adventures.',
    (SELECT id FROM categories WHERE name = 'Outerwear'),
    15.00, 80.00, 50.00,
    ARRAY['XS', 'S', 'M', 'L', 'XL'],
    ARRAY['Black', 'Navy', 'Red'],
    'Patagonia',
    ARRAY['https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg']
  ),
  (
    'Osprey Atmos 65L Backpack',
    'Lightweight hiking backpack with Anti-Gravity suspension system.',
    (SELECT id FROM categories WHERE name = 'Backpacks & Bags'),
    12.00, 65.00, 75.00,
    ARRAY['S', 'M', 'L'],
    ARRAY['Graphite Grey', 'Unity Blue'],
    'Osprey',
    ARRAY['https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg']
  ),
  (
    'Salomon X Ultra 3 Hiking Boots',
    'Lightweight hiking shoes with excellent grip and protection.',
    (SELECT id FROM categories WHERE name = 'Footwear'),
    8.00, 45.00, 40.00,
    ARRAY['US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
    ARRAY['Black', 'Brown', 'Grey'],
    'Salomon',
    ARRAY['https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg']
  ),
  (
    'REI Co-op Half Dome 2 Plus Tent',
    '2-person backpacking tent with excellent weather protection.',
    (SELECT id FROM categories WHERE name = 'Camping Gear'),
    20.00, 110.00, 100.00,
    ARRAY['One Size'],
    ARRAY['Orange', 'Green'],
    'REI Co-op',
    ARRAY['https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg']
  );