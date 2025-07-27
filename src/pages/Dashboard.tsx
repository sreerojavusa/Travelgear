import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Profile, Rental } from '../lib/supabase';
import { User, Calendar, Package, CreditCard } from 'lucide-react';

export function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  async function fetchUserData() {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Fetch recent rentals
      const { data: rentalsData } = await supabase
        .from('rentals')
        .select(`
          *,
          items (
            title,
            image_urls,
            brand
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (rentalsData) {
        setRentals(rentalsData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {profile?.full_name || user?.email}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-6">
              <div className="bg-teal-100 p-3 rounded-full">
                <User className="h-6 w-6 text-teal-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 ml-4">Profile</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Full Name</label>
                <p className="text-gray-900">{profile?.full_name || 'Not set'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{profile?.email || user?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-gray-900">{profile?.phone || 'Not set'}</p>
              </div>
              <button className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors">
                Edit Profile
              </button>
            </div>
          </div>

          {/* Stats and Recent Rentals */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{rentals.length}</p>
                    <p className="text-gray-600">Total Rentals</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Package className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {rentals.filter(r => r.status === 'confirmed').length}
                    </p>
                    <p className="text-gray-600">Active Rentals</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="bg-orange-100 p-3 rounded-full">
                    <CreditCard className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{rentals.reduce((sum, rental) => sum + rental.total_amount, 0).toFixed(2)}
                    </p>
                    <p className="text-gray-600">Total Spent</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Rentals */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Rentals</h3>
              
              {rentals.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No rentals yet</p>
                  <p className="text-gray-400 text-sm">Start exploring our gear collection!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {rentals.map((rental) => (
                    <div
                      key={rental.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-teal-300 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={rental.items?.image_urls?.[0] || 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg'}
                          alt={rental.items?.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">{rental.items?.title}</h4>
                          <p className="text-sm text-gray-600">{rental.items?.brand}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(rental.rental_start).toLocaleDateString()} - {new Date(rental.rental_end).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(rental.status)}`}>
                          {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                        </span>
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          ₹{rental.total_amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}