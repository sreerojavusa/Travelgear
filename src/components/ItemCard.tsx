import React, { useState } from 'react';
import { Calendar, DollarSign, Heart, ShoppingCart, Star, X } from 'lucide-react';
import { Item } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ItemCardProps {
  item: Item;
  onRent: (item: Item, selectedSize?: string, selectedColor?: string) => void;
  onAddToCart: (item: Item, selectedSize?: string, selectedColor?: string) => void;
}

export function ItemCard({ item, onRent, onAddToCart }: ItemCardProps) {
  const { user } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [actionType, setActionType] = useState<'cart' | 'rent'>('cart');
  
  const imageUrl = item.image_urls?.[0] || 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg';

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      alert('Please sign in to add items to your wishlist');
      return;
    }
    setIsWishlisted(!isWishlisted);
    // TODO: Implement wishlist API call
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!user) {
      alert('Please sign in to add items to your cart');
      return;
    }
    
    // If item has sizes, show size selection modal
    if (item.sizes && item.sizes.length > 0) {
      setActionType('cart');
      setShowSizeModal(true);
    } else {
      // Add directly to cart if no size selection needed
      onAddToCart(item);
    }
  };

  const handleRentNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!user) {
      alert('Please sign in to rent items');
      return;
    }
    
    // If item has sizes, show size selection modal
    if (item.sizes && item.sizes.length > 0) {
      setActionType('rent');
      setShowSizeModal(true);
    } else {
      // Go directly to checkout if no size selection needed
      onRent(item);
    }
  };

  const handleSizeSelection = () => {
    if (item.sizes && item.sizes.length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }

    if (item.colors && item.colors.length > 0 && !selectedColor) {
      alert('Please select a color');
      return;
    }

    if (actionType === 'cart') {
      onAddToCart(item, selectedSize, selectedColor);
    } else {
      onRent(item, selectedSize, selectedColor);
    }
    
    setShowSizeModal(false);
    setSelectedSize('');
    setSelectedColor('');
  };

  const weeklyDiscount = item.weekly_rate && item.daily_rate 
    ? Math.round((1 - (item.weekly_rate / (item.daily_rate * 7))) * 100)
    : 0;

  const monthlyRate = item.weekly_rate ? item.weekly_rate * 3.5 : item.daily_rate * 25;
  const monthlyDiscount = Math.round((1 - (monthlyRate / (item.daily_rate * 30))) * 100);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="relative aspect-w-16 aspect-h-12 overflow-hidden">
          <img
            src={imageUrl}
            alt={item.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
              isWishlisted 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
            }`}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          {/* Condition Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 text-xs rounded-full font-medium ${
              item.condition === 'excellent' 
                ? 'bg-green-100 text-green-800'
                : item.condition === 'good'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {item.condition}
            </span>
          </div>

          {/* Availability Overlay */}
          {!item.availability && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold">Currently Unavailable</span>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-teal-600 font-medium">{item.brand}</span>
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
              <span className="text-xs text-gray-500">4.8</span>
            </div>
          </div>

          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>

          {/* Pricing */}
          <div className="mb-4">
            <div className="flex items-center space-x-1 mb-2">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <span className="text-lg font-bold text-gray-900">₹{item.daily_rate}</span>
              <span className="text-sm text-gray-500">/day</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              {item.weekly_rate && (
                <div className="bg-green-50 p-2 rounded">
                  <div className="font-semibold text-green-800">₹{item.weekly_rate}/week</div>
                  {weeklyDiscount > 0 && (
                    <div className="text-green-600">Save {weeklyDiscount}%</div>
                  )}
                </div>
              )}
              <div className="bg-blue-50 p-2 rounded">
                <div className="font-semibold text-blue-800">₹{monthlyRate.toFixed(0)}/month</div>
                {monthlyDiscount > 0 && (
                  <div className="text-blue-600">Save {monthlyDiscount}%</div>
                )}
              </div>
            </div>
          </div>

          {/* Deposit Info */}
          {item.deposit_amount > 0 && (
            <div className="mb-4 p-2 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700">
                <span className="font-medium">Deposit:</span> ₹{item.deposit_amount} (refundable)
              </p>
            </div>
          )}

          {/* Sizes */}
          {item.sizes && item.sizes.length > 0 && (
            <div className="mb-4">
              <span className="text-xs text-gray-500 block mb-1">Available Sizes:</span>
              <div className="flex flex-wrap gap-1">
                {item.sizes.slice(0, 4).map((size) => (
                  <span
                    key={size}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                  >
                    {size}
                  </span>
                ))}
                {item.sizes.length > 4 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    +{item.sizes.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={handleAddToCart}
              disabled={!item.availability}
              className="flex-1 bg-teal-600 text-white py-2 px-3 rounded-lg hover:bg-teal-700 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Add to Cart</span>
            </button>
            
            <button
              onClick={handleRentNow}
              disabled={!item.availability}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm"
            >
              <Calendar className="h-4 w-4" />
              <span>{item.availability ? 'Rent Now' : 'Unavailable'}</span>
            </button>
          </div>

          {/* Stock Info */}
          {item.stock_quantity <= 3 && item.availability && (
            <p className="text-xs text-orange-600 mt-2 text-center">
              Only {item.stock_quantity} left in stock!
            </p>
          )}
        </div>
      </div>

      {/* Size Selection Modal */}
      {showSizeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Select Options</h3>
              <button
                onClick={() => setShowSizeModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <h4 className="font-medium mb-2">{item.title}</h4>
              <p className="text-sm text-gray-600 mb-4">{item.brand}</p>
              
              {/* Size Selection */}
              {item.sizes && item.sizes.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Size *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {item.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`p-2 text-sm border rounded-lg transition-colors ${
                          selectedSize === size
                            ? 'border-teal-500 bg-teal-50 text-teal-700'
                            : 'border-gray-300 hover:border-teal-300'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {item.colors && item.colors.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Color *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {item.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`p-2 text-sm border rounded-lg transition-colors ${
                          selectedColor === color
                            ? 'border-teal-500 bg-teal-50 text-teal-700'
                            : 'border-gray-300 hover:border-teal-300'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowSizeModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSizeSelection}
                className={`flex-1 px-4 py-2 rounded-lg text-white ${
                  actionType === 'cart'
                    ? 'bg-teal-600 hover:bg-teal-700'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                }`}
              >
                {actionType === 'cart' ? 'Add to Cart' : 'Rent Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}