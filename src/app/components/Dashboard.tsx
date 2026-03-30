import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { TrendingUp, Smile, CloudRain, Zap, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface CheckIn {
  id: number;
  mood: number;
  energy: number;
  emotions: string[];
  created_at: string;
}

interface MoodDataPoint {
  day: string;
  mood: number;
  energy: number;
}

interface EmotionData {
  name: string;
  count: number;
  color: string;
}

const EMOTION_COLORS: Record<string, string> = {
  'Joy': '#FACC15',
  'Calm': '#2DD4BF',
  'Anxiety': '#A78BFA',
  'Sadness': '#60A5FA',
  'Anger': '#F87171',
  'Fear': '#FB923C',
  'Confusion': '#06B6D4',
  'Contentment': '#10B981',
};

const envApiUrl = (import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_API_URL;
const API_BASE_URL = envApiUrl || 'http://localhost:8001/api';
const AUTH_TOKEN_KEY = 'auth_token';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [moodData, setMoodData] = useState<MoodDataPoint[]>([]);
  const [emotionDistribution, setEmotionDistribution] = useState<EmotionData[]>([]);
  const [averageMood, setAverageMood] = useState<string>('--');
  const [checkInCount, setCheckInCount] = useState<number>(0);
  const [primaryEmotion, setPrimaryEmotion] = useState<string>('--');
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<7 | 30>(7);

  useEffect(() => {
    const fetchCheckInData = async () => {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/checkins/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch check-ins');
        }

        const checkIns: CheckIn[] = await response.json();
        
        processCheckInData(checkIns, timeRange);
      } catch (error) {
        console.error('Error fetching check-ins:', error);
        
      } finally {
        setLoading(false);
      }
    };

    fetchCheckInData();
  }, [timeRange]);


  const processCheckInData = (checkIns: CheckIn[], days: number) => {
    
    const lastDays = getLastDays(days);
    
    
    const dataByDay = new Map<string, { moods: number[]; energies: number[] }>();
    checkIns.forEach((checkin) => {
      const date = new Date(checkin.created_at);
      const dayKey = getDayKey(date);
      
      if (!dataByDay.has(dayKey)) {
        dataByDay.set(dayKey, { moods: [], energies: [] });
      }
      
      const dayData = dataByDay.get(dayKey)!;
      dayData.moods.push(checkin.mood);
      dayData.energies.push(checkin.energy);
    });

   
    const moodTrend = lastDays.map((dayObj) => {
      const data = dataByDay.get(dayObj.key);
      const mood = data ? Math.round(data.moods.reduce((a, b) => a + b, 0) / data.moods.length) : 0;
      const energy = data ? Math.round(data.energies.reduce((a, b) => a + b, 0) / data.energies.length) : 0;
      
      return {
        day: dayObj.label,
        mood,
        energy,
      };
    });

    setMoodData(moodTrend);
    setCheckInCount(checkIns.length);

   
    if (checkIns.length > 0) {
      const avgMood = checkIns.reduce((sum, c) => sum + c.mood, 0) / checkIns.length;
      setAverageMood(getMoodLabel(avgMood));
    }

   
    const emotionCount = new Map<string, number>();
    checkIns.forEach((checkin) => {
      checkin.emotions.forEach((emotion) => {
        emotionCount.set(emotion, (emotionCount.get(emotion) || 0) + 1);
      });
    });

    
    const emotions = Array.from(emotionCount.entries())
      .map(([name, count]) => ({
        name,
        count,
        color: EMOTION_COLORS[name] || '#64748B',
      }))
      .sort((a, b) => b.count - a.count);

    setEmotionDistribution(emotions);
    
    if (emotions.length > 0) {
      setPrimaryEmotion(emotions[0].name);
    }
  };

  const getLastDays = (numDays: number) => {
    const days = [];
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = numDays - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const label = numDays === 7 ? dayLabels[date.getDay()] : `${date.getMonth() + 1}/${date.getDate()}`;
      days.push({
        key: getDayKey(date),
        label,
      });
    }
    
    return days;
  };

  const getDayKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getMoodLabel = (mood: number) => {
    if (mood >= 4.5) return 'Excellent';
    if (mood >= 3.5) return 'Great';
    if (mood >= 2.5) return 'Okay';
    if (mood >= 1.5) return 'Low';
    return 'Poor';
  };
  
  return (
    <div className="space-y-8">
      <header>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Welcome back, {user?.username}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Your emotional journey over the last {timeRange} days.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setTimeRange(7)}
              className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
                timeRange === 7
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange(30)}
              className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
                timeRange === 30
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              30 Days
            </button>
          </div>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
          <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-2xl flex items-center justify-center text-teal-600 dark:text-teal-400">
            <Smile size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Average Mood</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{loading ? '--' : averageMood}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{timeRange}-Day Check-ins</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{loading ? '--' : `${checkInCount} entries`}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400">
            <Heart size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Primary Emotion</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{loading ? '--' : primaryEmotion}</p>
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
