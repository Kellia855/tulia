import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smile, Frown, Meh, Angry, Wind, Zap, Heart, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

const steps = [
  { id: 'mood', title: 'Overall Mood', subtitle: 'How would you describe your general state right now?' },
  { id: 'intensity', title: 'Energy Level', subtitle: 'How much energy do you feel in your body?' },
  { id: 'emotions', title: 'Specific Emotions', subtitle: 'Pick the words that best describe what you feel.' },
];

const moods = [
  { label: 'Great', icon: Smile, color: 'text-yellow-500', bg: 'bg-yellow-50', value: 5 },
  { label: 'Good', icon: Smile, color: 'text-teal-500', bg: 'bg-teal-50', value: 4 },
  { label: 'Okay', icon: Meh, color: 'text-gray-500', bg: 'bg-gray-50', value: 3 },
  { label: 'Difficult', icon: Frown, color: 'text-blue-500', bg: 'bg-blue-50', value: 2 },
  { label: 'Awful', icon: Frown, color: 'text-red-500', bg: 'bg-red-50', value: 1 },
];

const energyLevels = [
  { label: 'Very Low', icon: Wind, value: 1 },
  { label: 'Low', icon: Wind, value: 2 },
  { label: 'Moderate', icon: Zap, value: 3 },
  { label: 'High', icon: Zap, value: 4 },
  { label: 'Very High', icon: Zap, value: 5 },
];

const emotionWords = [
  'Grateful', 'Anxious', 'Confident', 'Overwhelmed', 'Content', 
  'Irritated', 'Lonely', 'Inspired', 'Tired', 'Excited', 
  'Peaceful', 'Bored', 'Stressed', 'Loved', 'Insecure'
];

export const CheckIn: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState({
    mood: null as number | null,
    energy: 3,
    emotions: [] as string[],
  });
  const [isFinished, setIsFinished] = useState(false);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsFinished(true);
      toast.success('Check-in saved! Good job checking in with yourself.');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const toggleEmotion = (word: string) => {
    setData(prev => ({
      ...prev,
      emotions: prev.emotions.includes(word)
        ? prev.emotions.filter(e => e !== word)
        : [...prev.emotions, word]
    }));
  };

  if (isFinished) {
    return (
      <div className="max-w-xl mx-auto text-center py-20">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle2 size={48} />
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Well Done!</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">You've successfully completed your emotional check-in. Taking this moment is a powerful step in your wellness journey.</p>
        <button 
          onClick={() => {
            setIsFinished(false);
            setCurrentStep(0);
            setData({ mood: null, energy: 3, emotions: [] });
          }}
          className="px-8 py-3 bg-teal-600 text-white font-bold rounded-2xl hover:bg-teal-700 transition-colors"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{steps[currentStep].title}</h2>
          <span className="text-sm font-semibold text-teal-600 dark:text-teal-400">Step {currentStep + 1} of {steps.length}</span>
        </div>
        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-teal-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
        <p className="text-gray-500 dark:text-gray-400 mt-4">{steps[currentStep].subtitle}</p>
      </div>

      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 gap-4"
            >
              {moods.map((mood) => (
                <button
                  key={mood.label}
                  onClick={() => setData({ ...data, mood: mood.value })}
                  className={`
                    flex items-center justify-between p-6 rounded-3xl border-2 transition-all duration-200
                    ${data.mood === mood.value 
                      ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 shadow-md translate-y-[-2px]' 
                      : 'border-transparent bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm'}
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${mood.bg} dark:opacity-90 ${mood.color}`}>
                      <mood.icon size={28} />
                    </div>
                    <span className="text-xl font-bold text-gray-800 dark:text-gray-200">{mood.label}</span>
                  </div>
                  {data.mood === mood.value && <CheckCircle2 className="text-teal-500" />}
                </button>
              ))}
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12 py-8"
            >
              <div className="flex justify-between items-end">
                {energyLevels.map((level) => (
                  <div key={level.label} className="flex flex-col items-center gap-3">
                    <div 
                      className={`
                        w-16 rounded-2xl transition-all duration-300
                        ${data.energy >= level.value ? 'bg-purple-500' : 'bg-gray-200 dark:bg-gray-700'}
                      `}
                      style={{ height: `${level.value * 24}px` }}
                    />
                    <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{level.label}</span>
                  </div>
                ))}
              </div>
              <input 
                type="range" 
                min="1" 
                max="5" 
                step="1"
                value={data.energy}
                onChange={(e) => setData({ ...data, energy: parseInt(e.target.value) })}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-wrap gap-3 py-4"
            >
              {emotionWords.map((word) => (
                <button
                  key={word}
                  onClick={() => toggleEmotion(word)}
                  className={`
                    px-6 py-3 rounded-full font-semibold transition-all duration-200 border-2
                    ${data.emotions.includes(word)
                      ? 'bg-teal-600 border-teal-600 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-teal-200 hover:bg-teal-50 dark:hover:bg-teal-900/20'}
                  `}
                >
                  {word}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all
            ${currentStep === 0 ? 'text-gray-300 dark:text-gray-600 pointer-events-none' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}
          `}
        >
          <ChevronLeft size={20} /> Back
        </button>
        <button
          onClick={handleNext}
          disabled={currentStep === 0 && data.mood === null}
          className={`
            flex items-center gap-2 px-8 py-3 rounded-2xl font-bold shadow-lg transition-all
            ${currentStep === 0 && data.mood === null 
              ? 'bg-gray-200 text-gray-400 pointer-events-none shadow-none' 
              : 'bg-teal-600 text-white hover:bg-teal-700 shadow-teal-100'}
          `}
        >
          {currentStep === steps.length - 1 ? 'Finish' : 'Next'} <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};
