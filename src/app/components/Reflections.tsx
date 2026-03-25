import React, { useEffect, useState } from 'react';
import { BookOpen, Plus, Search, Calendar, Trash2, Edit2, Bookmark, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { useLocation, useNavigate } from 'react-router-dom';

interface Entry {
  id: number;
  date: string;
  title: string;
  content: string;
  mood: string;
  tags: string[];
}

interface ReflectionResponse {
  id: number;
  title: string;
  content: string;
  mood: string;
  tags: string[] | null;
  created_at: string;
}

const AUTH_TOKEN_KEY = 'auth_token';
const envApiUrl = (import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_API_URL;
const API_BASE_URL = envApiUrl || 'http://localhost:8001/api';

const toEntry = (reflection: ReflectionResponse): Entry => ({
  id: reflection.id,
  date: new Date(reflection.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }),
  title: reflection.title,
  content: reflection.content,
  mood: reflection.mood,
  tags: reflection.tags || [],
});

const parseApiError = async (response: Response) => {
  try {
    const data = await response.json();
    if (typeof data?.detail === 'string') {
      return data.detail;
    }
  } catch {
    return null;
  }
  return null;
};

const apiRequest = async <T,>(path: string, options: RequestInit = {}, token?: string): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const apiMessage = await parseApiError(response);
    throw new Error(apiMessage || 'Request failed. Please try again.');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};

export const Reflections: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoadingEntries, setIsLoadingEntries] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<number | null>(null);
  const [newEntry, setNewEntry] = useState({ title: '', content: '', mood: 'Calm' });
  const [searchQuery, setSearchQuery] = useState('');

  const resetEditor = () => {
    setIsAdding(false);
    setEditingEntryId(null);
    setNewEntry({ title: '', content: '', mood: 'Calm' });
  };

  useEffect(() => {
    const loadReflections = async () => {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) {
        setIsLoadingEntries(false);
        return;
      }

      try {
        const reflections = await apiRequest<ReflectionResponse[]>('/reflections', { method: 'GET' }, token);
        setEntries(reflections.map(toEntry));
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to load reflections');
      } finally {
        setIsLoadingEntries(false);
      }
    };

    loadReflections();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const word = params.get('word')?.trim();
    const definition = params.get('definition')?.trim();
    const category = params.get('category')?.trim();
    const reflectionPrompt = params.get('reflection_prompt')?.trim();
    const bodyPrompt = params.get('body_prompt')?.trim();
    const needPrompt = params.get('need_prompt')?.trim();
    const copingAction = params.get('coping_action')?.trim();

    if (!word) {
      return;
    }

    const moodByCategory: Record<string, string> = {
      Joyful: 'Grateful',
      Peaceful: 'Calm',
      Powerful: 'Grateful',
      Sad: 'Confused',
      Fearful: 'Stressed',
      Angry: 'Stressed',
    };

    setEditingEntryId(null);
    setNewEntry({
      title: `Reflecting on ${word}`,
      content: [
        `I notice I feel ${word.toLowerCase()} today.${definition ? ` ${definition}` : ''}`,
        '',
        'What happened?',
        'I noticed this feeling when... ',
        '',
        bodyPrompt || 'What did you feel in your body?',
        'I felt... ',
        '',
        needPrompt || 'What did you need in that moment?',
        'I needed... ',
        '',
        reflectionPrompt || 'What is one helpful step you can take next?',
        'One next step is... ',
        '',
        copingAction ? `Suggested coping action: ${copingAction}` : '',
      ]
        .filter(Boolean)
        .join('\n'),
      mood: moodByCategory[category || ''] || 'Calm',
    });
    setIsAdding(true);

    navigate('/reflections', { replace: true });
  }, [location.search, navigate]);

  const handleSave = async () => {
    if (!newEntry.title || !newEntry.content) {
      toast.error('Please fill in both title and content');
      return;
    }

    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      toast.error('Please sign in again to save reflections.');
      return;
    }

    setIsSaving(true);
    try {
      if (editingEntryId !== null) {
        const updatedReflection = await apiRequest<ReflectionResponse>(
          `/reflections/${editingEntryId}`,
          {
            method: 'PUT',
            body: JSON.stringify({ ...newEntry }),
          },
          token
        );

        setEntries((current) =>
          current.map((entry) => (entry.id === editingEntryId ? toEntry(updatedReflection) : entry))
        );
        toast.success('Reflection updated.');
      } else {
        const savedReflection = await apiRequest<ReflectionResponse>(
          '/reflections',
          {
            method: 'POST',
            body: JSON.stringify({ ...newEntry, tags: [] }),
          },
          token
        );

        setEntries((current) => [toEntry(savedReflection), ...current]);
        toast.success('Reflection saved.');
      }

      resetEditor();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save reflection');
    } finally {
      setIsSaving(false);
    }
  };

  const startEditing = (entry: Entry) => {
    setEditingEntryId(entry.id);
    setNewEntry({
      title: entry.title,
      content: entry.content,
      mood: entry.mood,
    });
    setIsAdding(true);
  };

  const deleteEntry = async (id: number) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      toast.error('Please sign in again to delete reflections.');
      return;
    }

    try {
      await apiRequest<void>(`/reflections/${id}`, { method: 'DELETE' }, token);
      setEntries((current) => current.filter((entry) => entry.id !== id));
      toast.success('Entry deleted');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete reflection');
    }
  };

  const filteredEntries = entries.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Personal Reflections</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">A safe space for your thoughts, feelings, and growth.</p>
        </div>
        <button 
          onClick={() => {
            setEditingEntryId(null);
            setNewEntry({ title: '', content: '', mood: 'Calm' });
            setIsAdding(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white font-bold rounded-2xl hover:bg-teal-700 transition-all shadow-lg shadow-teal-100"
        >
          <Plus size={20} /> New Reflection
        </button>
      </header>

      {/* Search and Filters */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search your reflections..."
          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-400 transition-all shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* New Entry Modal/Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-[32px] border border-teal-100 dark:border-teal-900/30 shadow-xl shadow-teal-50/50 dark:shadow-none"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {editingEntryId !== null ? 'Edit reflection' : 'Write something...'}
              </h3>
              <button onClick={resetEditor} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">Cancel</button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Title of your reflection"
                className="w-full px-0 py-2 text-2xl font-bold border-none focus:ring-0 placeholder:text-gray-300 dark:placeholder:text-gray-600 bg-transparent text-gray-900 dark:text-gray-100"
                value={newEntry.title}
                onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
              />
              <div className="flex gap-3 mb-4">
                {['Calm', 'Grateful', 'Stressed', 'Confused'].map(m => (
                  <button
                    key={m}
                    onClick={() => setNewEntry({ ...newEntry, mood: m })}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${newEntry.mood === m ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <textarea
                placeholder="What's on your mind?"
                rows={6}
                className="w-full px-0 py-2 text-lg text-gray-600 dark:text-gray-400 border-none focus:ring-0 resize-none placeholder:text-gray-300 dark:placeholder:text-gray-600 bg-transparent"
                value={newEntry.content}
                onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
              />
              <div className="flex justify-end pt-4 border-t border-gray-50 dark:border-gray-700">
                <button 
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-8 py-3 bg-teal-600 text-white font-bold rounded-2xl hover:bg-teal-700 transition-all shadow-lg shadow-teal-100"
                >
                  {isSaving ? 'Saving...' : editingEntryId !== null ? 'Update Entry' : 'Save Entry'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Entry List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredEntries.map((entry) => (
          <motion.div 
            key={entry.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="group bg-white dark:bg-gray-800 p-8 rounded-[32px] border border-gray-50 dark:border-gray-700 hover:border-teal-100 dark:hover:border-teal-900/30 hover:shadow-md transition-all relative overflow-hidden"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3 text-gray-400 dark:text-gray-500">
                <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                  <Calendar size={14} /> {entry.date}
                </div>
                <div className="flex items-center gap-1.5 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 px-3 py-1 rounded-full text-xs font-bold">
                  <Bookmark size={14} /> {entry.mood}
                </div>
              </div>
              <div className="relative z-10 flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => startEditing(entry)}
                  className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/30 rounded-xl transition-all"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  type="button"
                  onClick={() => deleteEntry(entry.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            
            <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">{entry.title}</h4>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              {entry.content}
            </p>

            <div className="flex items-center gap-4 text-xs font-semibold text-gray-400 dark:text-gray-500">
              <div className="flex items-center gap-1">
                <Clock size={14} /> 2 min read
              </div>
              <div className="flex gap-2">
                {entry.tags.map(tag => (
                  <span key={tag} className="text-teal-600 hover:underline cursor-pointer">#{tag}</span>
                ))}
              </div>
            </div>
            
            <div className="pointer-events-none absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
          </motion.div>
        ))}

        {filteredEntries.length === 0 && (
          <div className="py-32 text-center">
            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300 dark:text-gray-600">
              <BookOpen size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No entries yet</h3>
            <p className="text-gray-500 dark:text-gray-400">Start your journey by writing your first reflection.</p>
          </div>
        )}
      </div>
    </div>
  );
};
