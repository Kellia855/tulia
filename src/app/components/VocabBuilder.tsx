import React, { useState } from 'react';
import { Search, Info, Book, Heart, Zap, Shield, Sparkles, Wind } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const categories = [
  { name: 'Joyful', icon: Sparkles, color: 'bg-yellow-100 text-yellow-700', border: 'border-yellow-200' },
  { name: 'Peaceful', icon: Wind, color: 'bg-teal-100 text-teal-700', border: 'border-teal-200' },
  { name: 'Powerful', icon: Zap, color: 'bg-orange-100 text-orange-700', border: 'border-orange-200' },
  { name: 'Sad', icon: Wind, color: 'bg-blue-100 text-blue-700', border: 'border-blue-200' },
  { name: 'Fearful', icon: Shield, color: 'bg-purple-100 text-purple-700', border: 'border-purple-200' },
  { name: 'Angry', icon: Heart, color: 'bg-red-100 text-red-700', border: 'border-red-200' },
];

const emotionLibrary = [
  { word: 'Grateful', category: 'Joyful', definition: 'Feeling or showing an appreciation of kindness; thankful.', intensity: 'Medium' },
  { word: 'Serene', category: 'Peaceful', definition: 'Calm, peaceful, and untroubled; tranquil.', intensity: 'Low' },
  { word: 'Empowered', category: 'Powerful', definition: 'Feeling strong and confident, especially in controlling one\'s life and claiming one\'s rights.', intensity: 'High' },
  { word: 'Melancholy', category: 'Sad', definition: 'A feeling of pensive sadness, typically with no obvious cause.', intensity: 'Low' },
  { word: 'Apprehensive', category: 'Fearful', definition: 'Anxious or fearful that something bad or unpleasant will happen.', intensity: 'Medium' },
  { word: 'Enraged', category: 'Angry', definition: 'Very angry; furious.', intensity: 'High' },
  { word: 'Content', category: 'Peaceful', definition: 'In a state of peaceful happiness.', intensity: 'Low' },
  { word: 'Exuberant', category: 'Joyful', definition: 'Filled with or characterized by a lively energy and excitement.', intensity: 'High' },
  { word: 'Isolated', category: 'Sad', definition: 'Feeling alone or detached from others.', intensity: 'Medium' },
  { word: 'Resilient', category: 'Powerful', definition: 'Able to withstand or recover quickly from difficult conditions.', intensity: 'Medium' },
];

export const VocabBuilder: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWord, setSelectedWord] = useState<typeof emotionLibrary[0] | null>(null);

  const filteredLibrary = emotionLibrary.filter(item => {
    const matchesCategory = activeCategory ? item.category === activeCategory : true;
    const matchesSearch = item.word.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Emotion Vocabulary Builder</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xl">
            Building emotional granularity—the ability to precisely name what you feel—is proven to improve mental health and emotional regulation.
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search emotions..."
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      {/* Categories */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-6 py-2 rounded-full font-bold transition-all ${!activeCategory ? 'bg-gray-900 dark:bg-gray-700 text-white shadow-lg shadow-gray-200 dark:shadow-none' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(cat.name)}
            className={`
              flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all border
              ${activeCategory === cat.name 
                ? `${cat.color} ${cat.border} shadow-lg scale-105` 
                : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}
            `}
          >
            <cat.icon size={16} />
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Library List */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredLibrary.map((item) => (
              <motion.button
                key={item.word}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => setSelectedWord(item)}
                className={`
                  p-6 rounded-3xl text-left transition-all group
                  ${selectedWord?.word === item.word 
                    ? 'bg-teal-600 text-white shadow-xl shadow-teal-100 dark:shadow-none ring-4 ring-teal-50 dark:ring-teal-900/30' 
                    : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-teal-200 dark:hover:border-teal-800 hover:shadow-md'}
                `}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-xl font-bold">{item.word}</h4>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${selectedWord?.word === item.word ? 'bg-white/20' : 'bg-gray-100 text-gray-500'}`}>
                    {item.intensity}
                  </span>
                </div>
                <p className={`text-sm line-clamp-2 ${selectedWord?.word === item.word ? 'text-teal-50/80' : 'text-gray-500'}`}>
                  {item.definition}
                </p>
              </motion.button>
            ))}
          </AnimatePresence>
          {filteredLibrary.length === 0 && (
            <div className="col-span-full py-20 text-center bg-gray-50 dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
              <Book className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
              <p className="text-gray-400 dark:text-gray-500 font-medium">No results found for your search.</p>
            </div>
          )}
        </div>

        {/* Details Panel */}
        <div className="lg:sticky lg:top-8 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-[32px] border border-gray-100 dark:border-gray-700 shadow-sm min-h-[400px">
            {selectedWord ? (
              <motion.div
                key={selectedWord.word}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  {categories.find(c => c.name === selectedWord.category) && (
                    <div className={`p-3 rounded-2xl ${categories.find(c => c.name === selectedWord.category)?.color}`}>
                      {React.createElement(categories.find(c => c.name === selectedWord.category)!.icon, { size: 24 })}
                    </div>
                  )}
                  <div>
                    <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{selectedWord.category}</span>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{selectedWord.word}</h3>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h5 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                      <Info size={16} className="text-teal-500" /> Definition
                    </h5>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl">
                      {selectedWord.definition}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                      <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-1">Intensity</p>
                      <p className="font-bold text-orange-700">{selectedWord.intensity}</p>
                    </div>
                    <div className="p-4 bg-teal-50 rounded-2xl border border-teal-100">
                      <p className="text-[10px] font-bold text-teal-400 uppercase tracking-widest mb-1">Type</p>
                      <p className="font-bold text-teal-700">Primary</p>
                    </div>
                  </div>

                  <button className="w-full py-4 bg-gray-900 dark:bg-gray-700 text-white font-bold rounded-2xl hover:bg-black dark:hover:bg-gray-600 transition-colors shadow-lg shadow-gray-200 dark:shadow-none">
                    Use in Reflection
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                <Book size={64} className="mb-4 text-gray-300 dark:text-gray-600" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">Select a word to see its<br />details and use cases.</p>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-8 rounded-[32px] text-white overflow-hidden relative">
            <Sparkles className="absolute top-4 right-4 text-white/20 w-12 h-12" />
            <h4 className="font-bold text-lg mb-2 relative z-10">Pro Tip</h4>
            <p className="text-teal-50/80 text-sm relative z-10">
              When you feel "Bad", try to look closer. Are you "Lonely", "Frustrated", or "Overwhelmed"? Each one needs a different kind of support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
