import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { TrendingUp, Smile, CloudRain, Zap, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const moodData = [
  { day: 'Mon', mood: 3, energy: 4 },
  { day: 'Tue', mood: 4, energy: 3 },
  { day: 'Wed', mood: 2, energy: 2 },
  { day: 'Thu', mood: 5, energy: 5 },
  { day: 'Fri', mood: 4, energy: 4 },
  { day: 'Sat', mood: 5, energy: 3 },
  { day: 'Sun', mood: 4, energy: 2 },
];

const emotionDistribution = [
  { name: 'Joy', count: 12, color: '#FACC15' },
  { name: 'Calm', count: 18, color: '#2DD4BF' },
  { name: 'Anxiety', count: 5, color: '#A78BFA' },
  { name: 'Sadness', count: 3, color: '#60A5FA' },
  { name: 'Anger', count: 2, color: '#F87171' },
];

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Welcome back, {user?.username}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Your emotional journey over the last 7 days.</p>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
          <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-2xl flex items-center justify-center text-teal-600 dark:text-teal-400">
            <Smile size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Average Mood</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">Great</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Weekly Check-ins</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">24 entries</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400">
            <Heart size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Primary Emotion</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">Calm</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mood Trend */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100">Mood & Energy Trend</h3>
            <div className="flex gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-teal-600">
                <div className="w-2.5 h-2.5 rounded-full bg-teal-500"></div> Mood
              </div>
              <div className="flex items-center gap-1.5 text-purple-600">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div> Energy
              </div>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={moodData}>
                <defs>
                  <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2DD4BF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2DD4BF" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#A78BFA" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                <YAxis hide domain={[0, 6]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="mood" stroke="#2DD4BF" strokeWidth={3} fillOpacity={1} fill="url(#colorMood)" />
                <Area type="monotone" dataKey="energy" stroke="#A78BFA" strokeWidth={3} fillOpacity={1} fill="url(#colorEnergy)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Emotion Distribution */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-8">Emotion Distribution</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={emotionDistribution} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#4B5563', fontWeight: 600, fontSize: 14}} width={80} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={24}>
                  {emotionDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Call to Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/check-in" className="group bg-teal-600 p-8 rounded-3xl shadow-lg shadow-teal-100 text-white overflow-hidden relative">
          <div className="relative z-10">
            <h4 className="text-2xl font-bold mb-2">How are you feeling now?</h4>
            <p className="text-teal-50/80 mb-6 max-w-sm">Take a moment to check in with yourself and log your current state.</p>
            <div className="flex items-center gap-2 font-semibold">
              Start Check-in <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
          <Heart className="absolute -bottom-6 -right-6 text-white/10 w-48 h-48 group-hover:scale-110 transition-transform duration-500" />
        </Link>

        <div className="bg-[#FAF9F6] dark:bg-gray-800 p-8 rounded-3xl border border-gray-200 dark:border-gray-700">
          <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Daily Reflection</h4>
          <p className="text-gray-600 dark:text-gray-400 mb-6 italic">"What's one thing that brought you peace today?"</p>
          <Link to="/reflections" className="text-teal-600 font-bold hover:underline inline-flex items-center gap-1">
            Write a response <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};
