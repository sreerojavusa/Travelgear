import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, Item, Category, isUsingDemoCredentials } from '../lib/supabase';
import { ItemCard } from '../components/ItemCard';
import { useAuth } from '../contexts/AuthContext';
import { Loader, Filter, TrendingUp, Shield, Clock, ChevronDown } from 'lucide-react';

export function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const gearSectionRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);

  // Demo data for when Supabase is not configured
  const demoCategories: Category[] = [
    { id: '1', name: 'Outerwear', description: 'Jackets and coats', icon: 'coat', created_at: new Date().toISOString() },
    { id: '2', name: 'Footwear', description: 'Hiking boots and shoes', icon: 'footprints', created_at: new Date().toISOString() },
    { id: '3', name: 'Backpacks', description: 'Travel backpacks', icon: 'backpack', created_at: new Date().toISOString() },
    { id: '4', name: 'Camping Gear', description: 'Tents and sleeping bags', icon: 'tent', created_at: new Date().toISOString() },
    { id: '5', name: 'Winter Gear', description: 'Ski jackets and snow equipment', icon: 'snowflake', created_at: new Date().toISOString() },
    { id: '6', name: 'Water Sports', description: 'Wetsuits and water gear', icon: 'waves', created_at: new Date().toISOString() },
  ];

  const demoItems: Item[] = [
    {
      id: '1',
      title: 'Waterproof Trekking Jacket',
      description: 'Lightweight waterproof jacket perfect for monsoon trekking and outdoor adventures.',
      category_id: '1',
      daily_rate: 150.00,
      weekly_rate: 800.00,
      deposit_amount: 500.00,
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Black', 'Navy', 'Red'],
      brand: 'Patagonia',
      condition: 'excellent',
      image_urls: ['https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg'],
      availability: true,
      stock_quantity: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Trekking Backpack 65L',
      description: 'Large capacity backpack with rain cover. Perfect for multi-day treks and camping.',
      category_id: '3',
      daily_rate: 120.00,
      weekly_rate: 650.00,
      deposit_amount: 800.00,
      sizes: ['S', 'M', 'L'],
      colors: ['Graphite Grey', 'Unity Blue'],
      brand: 'Osprey',
      condition: 'excellent',
      image_urls: ['https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg'],
      availability: true,
      stock_quantity: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Trekking Boots - Waterproof',
      description: 'High-ankle waterproof boots with excellent grip for rocky terrains and river crossings.',
      category_id: '2',
      daily_rate: 80.00,
      weekly_rate: 450.00,
      deposit_amount: 600.00,
      sizes: ['US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
      colors: ['Black', 'Brown', 'Grey'],
      brand: 'Salomon',
      condition: 'excellent',
      image_urls: ['https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg'],
      availability: true,
      stock_quantity: 5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '4',
      title: 'Dome Tent - 2 Person',
      description: 'Easy setup dome tent with rainfly. Perfect for weekend camping and base camps.',
      category_id: '4',
      daily_rate: 200.00,
      weekly_rate: 1100.00,
      deposit_amount: 1200.00,
      sizes: ['One Size'],
      colors: ['Orange', 'Green'],
      brand: 'REI Co-op',
      condition: 'excellent',
      image_urls: ['https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg'],
      availability: true,
      stock_quantity: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '5',
      title: 'Packable Rain Poncho',
      description: 'Ultra-light rain poncho that packs into a small pouch. Essential for sudden weather changes.',
      category_id: '1',
      daily_rate: 60.00,
      weekly_rate: 320.00,
      deposit_amount: 300.00,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'Red', 'Blue'],
      brand: 'Arc\'teryx',
      condition: 'excellent',
      image_urls: ['https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg'],
      availability: true,
      stock_quantity: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '6',
      title: 'Trail Running Shoes',
      description: 'Lightweight shoes with superior grip for trail running and day hikes on varied terrain.',
      category_id: '2',
      daily_rate: 70.00,
      weekly_rate: 380.00,
      deposit_amount: 400.00,
      sizes: ['US 6', 'US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
      colors: ['Brown', 'Grey', 'Black'],
      brand: 'Merrell',
      condition: 'good',
      image_urls: ['https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg'],
      availability: true,
      stock_quantity: 4,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '7',
      title: 'Daypack 30L',
      description: 'Comfortable daypack with multiple pockets and hydration compatibility for day treks.',
      category_id: '3',
      daily_rate: 80.00,
      weekly_rate: 420.00,
      deposit_amount: 500.00,
      sizes: ['One Size'],
      colors: ['Black', 'Grey', 'Blue'],
      brand: 'The North Face',
      condition: 'excellent',
      image_urls: ['https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg'],
      availability: true,
      stock_quantity: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '8',
      title: 'Sleeping Bag - All Season',
      description: 'Comfortable sleeping bag rated for all seasons. Compact and warm for high-altitude camping.',
      category_id: '4',
      daily_rate: 140.00,
      weekly_rate: 750.00,
      deposit_amount: 800.00,
      sizes: ['Regular', 'Long'],
      colors: ['Blue', 'Green', 'Grey'],
      brand: 'REI Co-op',
      condition: 'excellent',
      image_urls: ['https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg'],
      availability: true,
      stock_quantity: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '9',
      title: 'Winter Jacket & Pants',
      description: 'Insulated winter set with waterproof outer shell. Perfect for high-altitude winter treks.',
      category_id: '5',
      daily_rate: 250.00,
      weekly_rate: 1300.00,
      deposit_amount: 1500.00,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'Blue', 'Red'],
      brand: 'Columbia',
      condition: 'excellent',
      image_urls: ['https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg'],
      availability: true,
      stock_quantity: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '10',
      title: 'River Crossing Suit',
      description: '3mm neoprene suit for river crossings and water activities during treks.',
      category_id: '6',
      daily_rate: 180.00,
      weekly_rate: 950.00,
      deposit_amount: 1000.00,
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Black', 'Blue'],
      brand: 'O\'Neill',
      condition: 'excellent',
      image_urls: ['https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg'],
      availability: true,
      stock_quantity: 4,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '11',
      title: 'Rock Climbing Gear Set',
      description: 'Complete climbing safety set with harness, helmet, and belay device for rock climbing.',
      category_id: '4',
      daily_rate: 120.00,
      weekly_rate: 650.00,
      deposit_amount: 1200.00,
      sizes: ['S', 'M', 'L'],
      colors: ['Black', 'Blue'],
      brand: 'Black Diamond',
      condition: 'excellent',
      image_urls: ['https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg'],
      availability: true,
      stock_quantity: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '12',
      title: 'Portable Gas Stove',
      description: 'Compact gas stove with wind shield. Essential for cooking during camping and treks.',
      category_id: '4',
      daily_rate: 50.00,
      weekly_rate: 280.00,
      deposit_amount: 400.00,
      sizes: ['One Size'],
      colors: ['Silver'],
      brand: 'MSR',
      condition: 'good',
      image_urls: ['https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg'],
      availability: true,
      stock_quantity: 5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '13',
      title: 'High Altitude Boots',
      description: 'Insulated boots for high altitude and snow conditions. Waterproof with excellent insulation.',
      category_id: '2',
      daily_rate: 160.00,
      weekly_rate: 850.00,
      deposit_amount: 1000.00,
      sizes: ['US 6', 'US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
      colors: ['Black', 'Brown'],
      brand: 'Sorel',
      condition: 'excellent',
      image_urls: ['https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg'],
      availability: true,
      stock_quantity: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '14',
      title: 'Trekking Poles - Adjustable',
      description: 'Lightweight carbon fiber trekking poles with shock absorption for knee protection.',
      category_id: '7',
      daily_rate: 40.00,
      weekly_rate: 220.00,
      deposit_amount: 300.00,
      sizes: ['Adjustable'],
      colors: ['Black', 'Blue'],
      brand: 'Black Diamond',
      condition: 'excellent',
      image_urls: ['https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg'],
      availability: true,
      stock_quantity: 6,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '15',
      title: 'Headlamp - Rechargeable',
      description: 'Bright LED headlamp with USB charging. Essential for early morning starts and night navigation.',
      category_id: '7',
      daily_rate: 30.00,
      weekly_rate: 160.00,
      deposit_amount: 200.00,
      sizes: ['One Size'],
      colors: ['Black', 'Red'],
      brand: 'Petzl',
      condition: 'excellent',
      image_urls: ['https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg'],
      availability: true,
      stock_quantity: 8,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '16',
      title: 'Insulated Water Bottle',
      description: 'Vacuum insulated steel bottle that keeps drinks hot/cold for 24 hours.',
      category_id: '7',
      daily_rate: 25.00,
      weekly_rate: 140.00,
      deposit_amount: 150.00,
      sizes: ['500ml', '750ml', '1L'],
      colors: ['Steel', 'Black', 'Blue'],
      brand: 'Hydro Flask',
      condition: 'excellent',
      image_urls: ['https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg'],
      availability: true,
      stock_quantity: 10,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '17',
      title: 'Camping Chair - Lightweight',
      description: 'Ultra-light folding chair that packs small. Perfect for base camps and rest stops.',
      category_id: '4',
      daily_rate: 60.00,
      weekly_rate: 320.00,
      deposit_amount: 400.00,
      sizes: ['One Size'],
      colors: ['Green', 'Blue', 'Grey'],
      brand: 'Helinox',
      condition: 'excellent',
      image_urls: ['https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg'],
      availability: true,
      stock_quantity: 4,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '18',
      title: 'Quick-Dry Trekking Pants',
      description: 'Lightweight quick-dry pants with zip-off legs. Converts to shorts for versatility.',
      category_id: '1',
      daily_rate: 90.00,
      weekly_rate: 480.00,
      deposit_amount: 500.00,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Khaki', 'Grey', 'Navy'],
      brand: 'Patagonia',
      condition: 'excellent',
      image_urls: ['https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg'],
      availability: true,
      stock_quantity: 5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '19',
      title: 'Camping Cookware Set',
      description: 'Lightweight titanium cookware set with pot, pan, and utensils for 2 people.',
      category_id: '4',
      daily_rate: 80.00,
      weekly_rate: 420.00,
      deposit_amount: 600.00,
      sizes: ['2-Person Set'],
      colors: ['Titanium'],
      brand: 'MSR',
      condition: 'excellent',
      image_urls: ['https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg'],
      availability: true,
      stock_quantity: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '20',
      title: 'Gaiters - Waterproof',
      description: 'Waterproof leg gaiters to keep debris and water out of boots during treks.',
      category_id: '7',
      daily_rate: 35.00,
      weekly_rate: 190.00,
      deposit_amount: 250.00,
      sizes: ['S', 'M', 'L'],
      colors: ['Black', 'Grey'],
      brand: 'Outdoor Research',
      condition: 'excellent',
      image_urls: ['https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg'],
      availability: true,
      stock_quantity: 6,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  useEffect(() => {
    fetchData();
  }, [selectedCategory]);

  async function fetchData() {
    try {
      setLoading(true);

      if (isUsingDemoCredentials) {
        // Use demo data when Supabase is not configured
        setCategories(demoCategories);
        
        let filteredItems = demoItems;
        if (selectedCategory !== 'all') {
          filteredItems = demoItems.filter(item => item.category_id === selectedCategory);
        }
        setItems(filteredItems);
      } else {
        // Fetch categories
        const { data: categoriesData } = await supabase
          .from('categories')
          .select('*')
          .order('name');

        if (categoriesData) {
          setCategories(categoriesData);
        }

        // Fetch items with category filter
        let query = supabase
          .from('items')
          .select(`
            *,
            categories (
              id,
              name,
              icon
            )
          `)
          .eq('availability', true)
          .order('created_at', { ascending: false });

        if (selectedCategory !== 'all') {
          query = query.eq('category_id', selectedCategory);
        }

        const { data: itemsData } = await query;

        if (itemsData) {
          setItems(itemsData);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback to demo data on error
      setCategories(demoCategories);
      setItems(demoItems);
    } finally {
      setLoading(false);
    }
  }

  const handleRent = (item: Item, selectedSize?: string, selectedColor?: string) => {
    if (!user) {
      alert('Please sign in to rent items');
      return;
    }
    
    // Store rental item in localStorage for checkout
    const rentalData = {
      item,
      selectedSize,
      selectedColor,
      rentalDays: 7, // Default to 7 days
      quantity: 1
    };
    localStorage.setItem('currentRental', JSON.stringify(rentalData));
    
    // Redirect to checkout
    navigate('/checkout');
  };

  const handleAddToCart = (item: Item, selectedSize?: string, selectedColor?: string) => {
    if (!user) {
      alert('Please sign in to add items to your cart');
      return;
    }
    
    // Get existing cart items
    const existingCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    
    // Create new cart item
    const cartItem = {
      id: Date.now().toString(), // Simple ID generation
      item_id: item.id,
      title: item.title,
      brand: item.brand,
      daily_rate: item.daily_rate,
      weekly_rate: item.weekly_rate,
      image_url: item.image_urls?.[0] || 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',
      quantity: 1,
      rental_days: 7,
      size_selected: selectedSize,
      color_selected: selectedColor,
      deposit_amount: item.deposit_amount
    };
    
    // Add to cart
    existingCart.push(cartItem);
    localStorage.setItem('cartItems', JSON.stringify(existingCart));
    
    // Show success message
    alert(`${item.title} has been added to your cart!`);
  };

  const scrollToGear = () => {
    gearSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-teal-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading amazing gear...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Background Image */}
      <div 
        className="relative text-white"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Rent. Adventure. Return.
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Get premium outdoor gear for your next adventure without the commitment. 
              From hiking boots to camping equipment, we've got everything you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={scrollToGear}
                className="bg-white text-teal-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors transform hover:scale-105"
              >
                Browse Gear
              </button>
              <button 
                onClick={scrollToHowItWorks}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-teal-600 transition-colors transform hover:scale-105"
              >
                How It Works
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-white opacity-70" />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-teal-200 transition-colors">
                <TrendingUp className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">Top-brand gear maintained to the highest standards</p>
            </div>
            <div className="text-center group">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fully Insured</h3>
              <p className="text-gray-600">All rentals covered with comprehensive insurance</p>
            </div>
            <div className="text-center group">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Rentals</h3>
              <p className="text-gray-600">Rent by the day, week, or longer for better rates</p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div ref={howItWorksRef} className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Getting the gear you need for your adventure is simple and straightforward</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-teal-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="font-semibold mb-2">Browse & Select</h3>
              <p className="text-gray-600 text-sm">Choose from our extensive collection of premium outdoor gear</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="font-semibold mb-2">Book Your Dates</h3>
              <p className="text-gray-600 text-sm">Select your rental period and complete the booking process</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="font-semibold mb-2">Pick Up or Delivery</h3>
              <p className="text-gray-600 text-sm">Collect your gear or have it delivered to your location</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
              <h3 className="font-semibold mb-2">Adventure & Return</h3>
              <p className="text-gray-600 text-sm">Enjoy your adventure and return the gear when you're done</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Items */}
      <div ref={gearSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isUsingDemoCredentials && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Demo Mode</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>You're viewing demo data. To connect to a real database, set up your Supabase credentials in the .env file.</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Available Gear</h2>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <span className="text-gray-700">Filter by category:</span>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === 'all'
                ? 'bg-teal-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-teal-300'
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category.id
                  ? 'bg-teal-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-teal-300'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No items found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onRent={handleRent}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}