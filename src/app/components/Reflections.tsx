import React, { useState } from 'react';
import { BookOpen, Plus, Search, Calendar, Trash2, Edit2, Bookmark, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface Entry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: string;
  tags: string[];
}

const mockEntries: Entry[] = [
  {
    id: '1',
    date: 'Jan 28, 2026',
    title: 'Morning Clarity',
    content: 'Felt very focused this morning after a short meditation. The world felt a bit quieter than usual.',
    mood: 'Peaceful',
    tags: ['Meditation', 'Focus']
  },
  {
    id: '2',
    date: 'Jan 26, 2026',
    title: 'Tough Meeting',
    content: 'The client meeting didn\'t go as planned. I felt defensive at first, but managed to take some deep breaths and listen.',
    mood: 'Stress',
    tags: ['Work', 'Growth']
  }
];

export const Reflections: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>(mockEntries);
  const [isAdding, setIsAdding] = useState(false);
  const [newEntry, setNewEntry] = useState({ title: '', content: '', mood: 'Calm' });
  const [searchQuery, setSearchQuery] = useState('');

  const handleSave = () => {
    if (!newEntry.title || !newEntry.content) {
      toast.error('Please fill in both title and content');
      return;
    }
    const entry: Entry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      ...newEntry,
      tags: []
    };
    setEntries([entry, ...entries]);
    setIsAdding(false);
    setNewEntry({ title: '', content: '', mood: 'Calm' });
    toast.success('Reflection saved.');
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
    toast.success('Entry deleted');
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
          onClick={() => setIsAdding(true)}
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
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Write something...</h3>
              <button onClick={() => setIsAdding(false)} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">Cancel</button>
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
                  onClick={handleSave}
                  className="px-8 py-3 bg-teal-600 text-white font-bold rounded-2xl hover:bg-teal-700 transition-all shadow-lg shadow-teal-100"
                >
                  Save Entry
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
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/30 rounded-xl transition-all">
                  <Edit2 size={18} />
                </button>
                <button 
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
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
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
