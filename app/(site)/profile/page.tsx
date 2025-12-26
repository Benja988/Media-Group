// app/profile/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, Mail, Calendar, Music, Headphones, Users, 
  Settings, Edit2, Camera, MapPin, Globe, Link as LinkIcon,
  Bell, Shield, CreditCard, LogOut, Save, X
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, updateProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    location: '',
    website: '',
  });

  // Mock user data (replace with actual user data from your auth system)
  const [profileData, setProfileData] = useState({
    name: 'Alex Johnson',
    email: 'alex@example.com',
    bio: 'Music enthusiast and radio host. Love discovering new indie artists and sharing fresh sounds.',
    location: 'Nairobi, Kenya',
    website: 'alexjohnson.com',
    joinDate: '2024-01-15',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    coverImage: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070',
    stats: {
      stations: 12,
      playlists: 8,
      followers: 245,
      following: 156,
    },
    recentActivity: [
      { id: 1, type: 'station', title: 'Indie Vibes', action: 'created', time: '2 hours ago' },
      { id: 2, type: 'playlist', title: 'Chill Beats', action: 'updated', time: '1 day ago' },
      { id: 3, type: 'follow', title: 'Jazz Lounge', action: 'started following', time: '2 days ago' },
    ],
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    // Simulate loading user data
    setTimeout(() => {
      setLoading(false);
      setEditForm({
        name: profileData.name,
        bio: profileData.bio,
        location: profileData.location,
        website: profileData.website,
      });
    }, 500);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProfileData(prev => ({
        ...prev,
        ...editForm,
      }));
      
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <User className="h-4 w-4" /> },
    { id: 'activity', label: 'Activity', icon: <Music className="h-4 w-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Cover Image */}
      <div className="relative h-48 md:h-64 bg-gradient-to-r from-purple-600/20 to-blue-600/20">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        
        <div className="container-width relative h-full">
          <div className="absolute -bottom-12 left-0 flex items-end gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl border-4 border-background bg-card overflow-hidden">
                <img 
                  src={profileData.avatar} 
                  alt={profileData.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {isEditing && (
                <button className="absolute bottom-1 right-1 p-1.5 bg-primary rounded-lg text-primary-foreground hover:bg-primary/90">
                  <Camera className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* User Info */}
            <div className="pb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-card border border-border rounded-lg px-3 py-1.5 text-foreground"
                    placeholder="Your name"
                  />
                ) : (
                  profileData.name
                )}
              </h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {profileData.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-width pt-16 pb-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="lg:w-1/4 space-y-6">
            {/* Stats Card */}
            <div className="card-base card-padding-md">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Stats
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{profileData.stats.stations}</div>
                  <div className="text-sm text-muted-foreground">Stations</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{profileData.stats.playlists}</div>
                  <div className="text-sm text-muted-foreground">Playlists</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{profileData.stats.followers}</div>
                  <div className="text-sm text-muted-foreground">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{profileData.stats.following}</div>
                  <div className="text-sm text-muted-foreground">Following</div>
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className="card-base card-padding-md">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <User className="h-4 w-4" />
                Information
              </h3>
              <div className="space-y-3">
                {isEditing ? (
                  <>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-1">Bio</label>
                      <textarea
                        value={editForm.bio}
                        onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                        className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground"
                        rows={3}
                        placeholder="Tell us about yourself"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-1">Location</label>
                      <input
                        type="text"
                        value={editForm.location}
                        onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground"
                        placeholder="Your location"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-1">Website</label>
                      <input
                        type="url"
                        value={editForm.website}
                        onChange={(e) => setEditForm(prev => ({ ...prev, website: e.target.value }))}
                        className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground"
                        placeholder="Your website"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start gap-3">
                      <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Bio</p>
                        <p className="text-sm text-foreground">{profileData.bio}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="text-sm text-foreground">{profileData.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Website</p>
                        <a 
                          href={`https://${profileData.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                          {profileData.website}
                          <LinkIcon className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Member since</p>
                        <p className="text-sm text-foreground">
                          {new Date(profileData.joinDate).toLocaleDateString('en-US', { 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {isEditing ? (
                <div className="flex gap-2 mt-6">
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditForm({
                        name: profileData.name,
                        bio: profileData.bio,
                        location: profileData.location,
                        website: profileData.website,
                      });
                    }}
                    className="p-2 border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full mt-6 flex items-center justify-center gap-2 border border-border py-2 rounded-lg font-medium hover:bg-muted transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit Profile
                </button>
              )}
            </div>

            {/* Quick Actions */}
            <div className="card-base card-padding-md">
              <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg hover:bg-muted transition-colors">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">Notifications</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg hover:bg-muted transition-colors">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">Privacy</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg hover:bg-muted transition-colors">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">Billing</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Tabs */}
            <div className="flex border-b border-border mb-6">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Recent Stations */}
                <div className="card-base card-padding-md">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <Headphones className="h-4 w-4" />
                      Recent Stations
                    </h3>
                    <Link href="/stations" className="text-sm text-primary hover:underline">
                      View all
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="group cursor-pointer">
                        <div className="aspect-square rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 mb-2 overflow-hidden">
                          <div className="w-full h-full flex items-center justify-center">
                            <Music className="h-12 w-12 text-primary/50" />
                          </div>
                        </div>
                        <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                          Station {i}
                        </h4>
                        <p className="text-sm text-muted-foreground">Last played: 2 hours ago</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="card-base card-padding-md">
                  <h3 className="font-semibold text-foreground mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {profileData.recentActivity.map(activity => (
                      <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                        <div className="p-2 rounded-lg bg-primary/10">
                          {activity.type === 'station' && <Headphones className="h-4 w-4 text-primary" />}
                          {activity.type === 'playlist' && <Music className="h-4 w-4 text-primary" />}
                          {activity.type === 'follow' && <Users className="h-4 w-4 text-primary" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-foreground">
                            You <span className="font-medium">{activity.action}</span>{' '}
                            <span className="font-medium text-primary">{activity.title}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="card-base card-padding-md">
                <h3 className="font-semibold text-foreground mb-6">All Activity</h3>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Music className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Listened to "Chill Vibes Radio"</p>
                          <p className="text-sm text-muted-foreground">2 hours ago • 45 minutes</p>
                        </div>
                      </div>
                      <button className="text-sm text-primary hover:underline">
                        View details
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="card-base card-padding-md">
                <h3 className="font-semibold text-foreground mb-6">Account Settings</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-foreground mb-3">Email & Notifications</h4>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-3 border border-border rounded-lg cursor-pointer hover:bg-muted">
                        <div>
                          <p className="font-medium text-foreground">Email notifications</p>
                          <p className="text-sm text-muted-foreground">Receive updates via email</p>
                        </div>
                        <input type="checkbox" className="h-4 w-4" defaultChecked />
                      </label>
                      <label className="flex items-center justify-between p-3 border border-border rounded-lg cursor-pointer hover:bg-muted">
                        <div>
                          <p className="font-medium text-foreground">Push notifications</p>
                          <p className="text-sm text-muted-foreground">Receive browser notifications</p>
                        </div>
                        <input type="checkbox" className="h-4 w-4" defaultChecked />
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-3">Privacy</h4>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-3 border border-border rounded-lg cursor-pointer hover:bg-muted">
                        <div>
                          <p className="font-medium text-foreground">Public profile</p>
                          <p className="text-sm text-muted-foreground">Allow others to view your profile</p>
                        </div>
                        <input type="checkbox" className="h-4 w-4" defaultChecked />
                      </label>
                      <label className="flex items-center justify-between p-3 border border-border rounded-lg cursor-pointer hover:bg-muted">
                        <div>
                          <p className="font-medium text-foreground">Activity status</p>
                          <p className="text-sm text-muted-foreground">Show when you're online</p>
                        </div>
                        <input type="checkbox" className="h-4 w-4" />
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-3">Danger Zone</h4>
                    <div className="p-4 border border-red-500/20 rounded-lg bg-red-500/5">
                      <p className="font-medium text-foreground mb-2">Delete Account</p>
                      <p className="text-sm text-muted-foreground mb-3">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <button className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}