import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if we have valid Supabase credentials
const hasValidCredentials = supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'your_supabase_project_url_here' &&
  supabaseAnonKey !== 'your_supabase_anon_key_here' &&
  !supabaseUrl.includes('your-project.supabase.co');

// Use demo values if credentials are not properly configured
const finalUrl = hasValidCredentials ? supabaseUrl : 'https://demo.supabase.co';
const finalKey = hasValidCredentials ? supabaseAnonKey : 'demo-key';

// Create client with demo values if environment variables are not set
export const supabase = createClient(finalUrl, finalKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Check if we're using demo credentials
export const isUsingDemoCredentials = !hasValidCredentials;

// Types
export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  created_at: string;
}

export interface Item {
  id: string;
  title: string;
  description?: string;
  category_id: string;
  daily_rate: number;
  weekly_rate?: number;
  deposit_amount: number;
  sizes?: string[];
  colors?: string[];
  brand?: string;
  condition: string;
  image_urls?: string[];
  availability: boolean;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
  categories?: Category;
}

export interface Profile {
  id: string;
  email?: string;
  full_name?: string;
  phone?: string;
  address?: any;
  created_at: string;
  updated_at: string;
}

export interface Rental {
  id: string;
  user_id: string;
  item_id: string;
  rental_start: string;
  rental_end: string;
  total_amount: number;
  deposit_amount: number;
  status: string;
  size_selected?: string;
  color_selected?: string;
  special_requests?: string;
  created_at: string;
  updated_at: string;
  items?: Item;
}

export interface CartItem {
  id: string;
  user_id: string;
  item_id: string;
  rental_start: string;
  rental_end: string;
  size_selected?: string;
  color_selected?: string;
  created_at: string;
  items?: Item;
}