import React, { useEffect, useMemo, useState } from 'react';
import { Search, Info, Book, Heart, Zap, Shield, Sparkles, Wind, CheckCircle2, AlertCircle, Lightbulb, Flame, BookOpen, Brain, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

interface Category {
  name: string;
  description: string;
}

interface VocabItem {
  word: string;
  category: string;
  definition: string;
  intensity: 'Low' | 'Medium' | 'High' | string;
  source?: string;
}

interface LearningGuide {
  bodySignals: string[];
  likelyTriggers: string[];
  signalMeaning: string;
  underlyingNeeds: string[];
  helpfulReactions: string[];
  unhelpfulReactions: string[];
  healthyNextStep: string;
  reflectionPrompt: string;
}

interface DiscriminationExercise {
  leftEmotion: string;
  rightEmotion: string;
  keyDifference: string;
  quickCheck: string;
}

interface QuizScenario {
  id: string;
  title: string;
  situation: string;
  options: string[];
  correctEmotion: string;
  explanation: string;
}

interface QuizStats {
  attempts: number;
  correct: number;
  lastPlayedAt: string | null;
}

interface BodySignalActivity {
  signal: string;
  correctEmotions: string[];
  incorrectEmotions: string[];
}

interface IntensityChallenge {
  category: string;
  emotions: Array<{ word: string; intensity: 'Low' | 'Medium' | 'High' }>;
}

interface ReflectionPromptActivity {
  prompt: string;
  hints: string[];
  keyPoints: string[];
}

const CATEGORY_STYLES: Record<string, { icon: React.ComponentType<{ size?: number }>; color: string; border: string }> = {
  Joyful: { icon: Sparkles, color: 'bg-yellow-100 text-yellow-700', border: 'border-yellow-200' },
  Peaceful: { icon: Wind, color: 'bg-teal-100 text-teal-700', border: 'border-teal-200' },
  Powerful: { icon: Zap, color: 'bg-orange-100 text-orange-700', border: 'border-orange-200' },
  Sad: { icon: Wind, color: 'bg-blue-100 text-blue-700', border: 'border-blue-200' },
  Fearful: { icon: Shield, color: 'bg-purple-100 text-purple-700', border: 'border-purple-200' },
  Angry: { icon: Heart, color: 'bg-red-100 text-red-700', border: 'border-red-200' },
};

const LEARNING_GUIDES: Record<string, LearningGuide> = {
  Joyful: {
    bodySignals: ['Lightness in the chest', 'Smiling or energized posture', 'Warmth and openness'],
    likelyTriggers: ['Achievement or progress', 'Meaningful connection', 'Positive feedback'],
    signalMeaning: 'Something valuable is present. Joy signals what to repeat and protect.',
    underlyingNeeds: ['Celebration', 'Connection', 'Purpose'],
    helpfulReactions: ['Savor the moment for 20 seconds', 'Share gratitude with someone', 'Use this energy on a meaningful task'],
    unhelpfulReactions: ['Ignoring the moment completely', 'Overcommitting from excitement', 'Comparing your joy to others'],
    healthyNextStep: 'Write one sentence about what created this feeling so you can intentionally repeat it.',
    reflectionPrompt: 'What helped this feeling grow today, and how can you repeat it this week?',
  },
  Peaceful: {
    bodySignals: ['Slow breathing', 'Relaxed shoulders', 'Steady attention'],
    likelyTriggers: ['Quiet environment', 'Completion of tasks', 'Emotional safety'],
    signalMeaning: 'Your system feels safe enough to rest and integrate.',
    underlyingNeeds: ['Rest', 'Stability', 'Balance'],
    helpfulReactions: ['Protect your boundaries', 'Anchor with a short calming routine', 'Use the calm window for planning'],
    unhelpfulReactions: ['Filling all available time with tasks', 'Dismissing rest as laziness', 'Staying in avoidance mode'],
    healthyNextStep: 'Set one small boundary that protects your calm for the next 24 hours.',
    reflectionPrompt: 'What conditions made this calm possible, and what boundary keeps it protected?',
  },
  Powerful: {
    bodySignals: ['Focused attention', 'Strong posture', 'Motivation to act'],
    likelyTriggers: ['Preparedness', 'Supportive feedback', 'Clear goals'],
    signalMeaning: 'You are ready to act. This emotion signals capacity and agency.',
    underlyingNeeds: ['Autonomy', 'Competence', 'Momentum'],
    helpfulReactions: ['Channel energy into one specific action', 'Break goals into first steps', 'Track and celebrate small wins'],
    unhelpfulReactions: ['Overconfidence without planning', 'Taking on everything at once', 'Ignoring recovery needs'],
    healthyNextStep: 'Use this momentum on one high-priority task within the next hour.',
    reflectionPrompt: 'Where can you direct this energy so it supports your priorities this week?',
  },
  Sad: {
    bodySignals: ['Low energy', 'Tight throat or heavy chest', 'Withdrawal from activities'],
    likelyTriggers: ['Loss or disappointment', 'Disconnection', 'Overload without support'],
    signalMeaning: 'Something meaningful feels lost or unmet; sadness signals a need for care and connection.',
    underlyingNeeds: ['Comfort', 'Validation', 'Belonging'],
    helpfulReactions: ['Name what hurts directly', 'Seek gentle support', 'Lower demands temporarily'],
    unhelpfulReactions: ['Total isolation', 'Harsh self-criticism', 'Pretending you are fine when not'],
    healthyNextStep: 'Send one honest message to a trusted person about how you are feeling.',
    reflectionPrompt: 'What are you grieving or missing right now, and what would feel supportive today?',
  },
  Fearful: {
    bodySignals: ['Racing thoughts', 'Fast heartbeat', 'Restlessness or avoidance'],
    likelyTriggers: ['Uncertainty', 'Evaluation pressure', 'Conflict or risk'],
    signalMeaning: 'Your system perceives possible threat and asks for safety and clarity.',
    underlyingNeeds: ['Safety', 'Predictability', 'Reassurance'],
    helpfulReactions: ['Separate facts from fears', 'Choose one controllable action', 'Regulate body before decisions'],
    unhelpfulReactions: ['Catastrophizing', 'Endless reassurance checking', 'Avoiding all uncertainty'],
    healthyNextStep: 'Take a 2-minute breathing reset and write one controllable next action.',
    reflectionPrompt: 'What part is uncertain, and what one concrete step can you control next?',
  },
  Angry: {
    bodySignals: ['Heat or tension', 'Jaw or shoulder tightness', 'Urge to react quickly'],
    likelyTriggers: ['Boundary violations', 'Unfairness', 'Blocked goals'],
    signalMeaning: 'A boundary, value, or expectation feels crossed. Anger signals protection and action needs.',
    underlyingNeeds: ['Respect', 'Fairness', 'Agency'],
    helpfulReactions: ['Pause before responding', 'Name the boundary clearly', 'Communicate assertively and specifically'],
    unhelpfulReactions: ['Explosive reactions', 'Passive-aggressive silence', 'Rumination without action'],
    healthyNextStep: 'Draft a calm boundary statement: “When X happens, I need Y.”',
    reflectionPrompt: 'Which boundary feels crossed, and how can you communicate it clearly without escalation?',
  },
};

const DISCRIMINATION_EXERCISES: DiscriminationExercise[] = [
  {
    leftEmotion: 'Anxious',
    rightEmotion: 'Excited',
    keyDifference: 'Both feel high energy. Anxiety predicts threat; excitement predicts opportunity.',
    quickCheck: 'Ask: “Am I expecting danger, or possibility?”',
  },
  {
    leftEmotion: 'Lonely',
    rightEmotion: 'Rejected',
    keyDifference: 'Lonely is absence of connection. Rejected adds a sense of personal exclusion or not being wanted.',
    quickCheck: 'Ask: “Do I need more connection, or am I processing a specific exclusion?”',
  },
  {
    leftEmotion: 'Overwhelmed',
    rightEmotion: 'Burned out',
    keyDifference: 'Overwhelmed is acute overload right now. Burned out is chronic depletion over time.',
    quickCheck: 'Ask: “Is this a temporary spike, or have I felt drained for weeks?”',
  },
];

const QUIZ_SCENARIOS: QuizScenario[] = [
  {
    id: 'deadline-1',
    title: 'Night Before Deadline',
    situation:
      'You have two assignments due tomorrow. Your heart is racing and your thoughts keep jumping to worst-case outcomes.',
    options: ['Excited', 'Anxious', 'Grateful', 'Peaceful'],
    correctEmotion: 'Anxious',
    explanation:
      'Anxiety often includes threat-focused thoughts and body activation. The signal here is uncertainty and a need for structure/safety.',
  },
  {
    id: 'groupchat-1',
    title: 'Friends Made Plans Without You',
    situation:
      'You saw pictures in the group chat from an outing you were not invited to. You feel a heavy ache and keep replaying it.',
    options: ['Lonely', 'Rejected', 'Bored', 'Proud'],
    correctEmotion: 'Rejected',
    explanation:
      'Lonely is missing connection in general, while rejected includes feeling specifically excluded or not chosen.',
  },
  {
    id: 'exam-week-1',
    title: 'Week 10 Exhaustion',
    situation:
      'For several weeks you have felt drained, detached from classes, and less effective despite trying harder.',
    options: ['Overwhelmed', 'Burned out', 'Motivated', 'Calm'],
    correctEmotion: 'Burned out',
    explanation:
      'Overwhelm is usually acute and short-term. Burnout is a prolonged pattern of depletion, detachment, and reduced effectiveness.',
  },
  {
    id: 'presentation-1',
    title: 'Nailed the Presentation',
    situation:
      'You just finished presenting to the class and got positive feedback. You feel a sense of relief mixed with pride.',
    options: ['Grateful', 'Confident', 'Relieved', 'All of these'],
    correctEmotion: 'All of these',
    explanation:
      'Complex emotions often blend. Relief (uncertainty resolved), confidence (capability), and gratitude (positive reception) can coexist in one moment.',
  },
];

const BODY_SIGNAL_ACTIVITIES: BodySignalActivity[] = [
  {
    signal: 'Your chest feels tight; thoughts race to worst outcomes',
    correctEmotions: ['Anxious', 'Fearful', 'Overwhelmed'],
    incorrectEmotions: ['Joyful', 'Peaceful', 'Grateful'],
  },
  {
    signal: 'Warmth in your chest, smiling without effort, lightness in your shoulders',
    correctEmotions: ['Joyful', 'Grateful', 'Hopeful'],
    incorrectEmotions: ['Sad', 'Angry', 'Fearful'],
  },
  {
    signal: 'Heat rising, jaw clenched, urge to defend or respond',
    correctEmotions: ['Angry', 'Frustrated', 'Irritated'],
    incorrectEmotions: ['Peaceful', 'Calm', 'Content'],
  },
  {
    signal: 'Heaviness in your chest, slow movements, withdrawal from activity',
    correctEmotions: ['Sad', 'Melancholy', 'Disheartened'],
    incorrectEmotions: ['Empowered', 'Determined', 'Confident'],
  },
];

const REFLECTION_PROMPTS: ReflectionPromptActivity[] = [
  {
    prompt: 'When do you feel most peaceful?',
    hints: [
      'Think about a time when your body felt calm',
      'What were you doing, and who was around?',
      'What boundaries or conditions made that possible?',
    ],
    keyPoints: ['Identify your peace triggers', 'Recognize patterns', 'Protect those conditions'],
  },
  {
    prompt: 'What does frustrated feel like in your body?',
    hints: [
      'Notice the physical sensations',
      'What happened right before?',
      'What boundary or need was crossed?',
    ],
    keyPoints: ['Body awareness improves emotional clarity', 'Frustration signals needs', 'Action often helps'],
  },
];

const QUIZ_PROGRESS_KEY = 'vocab_quiz_progress';

const INTENSITY_SCORE: Record<string, number> = {
  Low: 1,
  Medium: 2,
  High: 3,
};

const envApiUrl = (import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_API_URL;
const API_BASE_URL = envApiUrl || 'http://localhost:8001/api';

export const VocabBuilder: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'explore' | 'learn' | 'practice' | 'quiz'>('explore');
  const [categories, setCategories] = useState<Category[]>([]);
  const [emotionLibrary, setEmotionLibrary] = useState<VocabItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWord, setSelectedWord] = useState<VocabItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Learn tab states
  const [currentBodySignalIndex, setCurrentBodySignalIndex] = useState(0);
  const [bodySignalAnswers, setBodySignalAnswers] = useState<Record<string, string | null>>({});
  const [intensityChallengeAnswers, setIntensityChallengeAnswers] = useState<string[]>([]);
  const [currentReflectionIndex, setCurrentReflectionIndex] = useState(0);
  const [reflectionInputs, setReflectionInputs] = useState<Record<number, string>>({});

  // Practice tab states
  const [currentDiscriminationIndex, setCurrentDiscriminationIndex] = useState(0);
  const [discriminationAnswers, setDiscriminationAnswers] = useState<Record<string, string | null>>({});
  const [scenarioMatchStats, setScenarioMatchStats] = useState({ correct: 0, attempted: 0 });

  // Quiz tab states
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedScenarioOption, setSelectedScenarioOption] = useState<string | null>(null);
  const [showScenarioFeedback, setShowScenarioFeedback] = useState(false);
  const [quizStats, setQuizStats] = useState<QuizStats>(() => {
    try {
      const raw = localStorage.getItem(QUIZ_PROGRESS_KEY);
      if (!raw) {
        return { attempts: 0, correct: 0, lastPlayedAt: null };
      }
      const parsed = JSON.parse(raw) as QuizStats;
      return {
        attempts: parsed.attempts || 0,
        correct: parsed.correct || 0,
        lastPlayedAt: parsed.lastPlayedAt || null,
      };
    } catch {
      return { attempts: 0, correct: 0, lastPlayedAt: null };
    }
  });

  const categoryButtons = useMemo(
    () =>
      categories.map((category) => {
        const style = CATEGORY_STYLES[category.name] || CATEGORY_STYLES.Peaceful;
        return { ...category, ...style };
      }),
    [categories]
  );

  const filteredLibrary = useMemo(() => {
    return emotionLibrary.filter((item) => {
      const matchesSearch = searchQuery.trim() === '' || item.word.toLowerCase().includes(searchQuery.toLowerCase()) || item.definition.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !activeCategory || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [emotionLibrary, searchQuery, activeCategory]);

  const currentBodySignal = BODY_SIGNAL_ACTIVITIES[currentBodySignalIndex];
  const currentReflectionPrompt = REFLECTION_PROMPTS[currentReflectionIndex];
  const currentDiscrimation = DISCRIMINATION_EXERCISES[currentDiscriminationIndex];
  const currentScenario = QUIZ_SCENARIOS[currentScenarioIndex];

  const learningGuide = selectedWord
    ? LEARNING_GUIDES[selectedWord.category] || LEARNING_GUIDES.Peaceful
    : null;

  const emotionLadderSuggestions = useMemo(() => {
    if (!selectedWord) {
      return [] as VocabItem[];
    }
    const currentScore = INTENSITY_SCORE[selectedWord.intensity] || 2;
    return emotionLibrary
      .filter((item) => item.word !== selectedWord.word && item.category === selectedWord.category)
      .filter((item) => (INTENSITY_SCORE[item.intensity] || 2) < currentScore)
      .slice(0, 4);
  }, [selectedWord, emotionLibrary]);

  const quizAccuracy = quizStats.attempts > 0 ? Math.round((quizStats.correct / quizStats.attempts) * 100) : 0;
  const bodySignalAccuracy = currentBodySignalIndex > 0 ? Math.round(((currentBodySignalIndex - (Object.keys(bodySignalAnswers).filter(k => !bodySignalAnswers[k]).length)) / currentBodySignalIndex) * 100) : 0;

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/vocab/categories`);
        if (!response.ok) {
          throw new Error('Failed to load categories');
        }
        const data = (await response.json()) as Category[];
        setCategories(data);
      } catch {
        setError('Could not load vocabulary categories.');
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const loadVocab = async () => {
      setIsLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set('q', searchQuery.trim());
      if (activeCategory) params.set('category', activeCategory);
      params.set('limit', '40');
      try {
        const response = await fetch(`${API_BASE_URL}/vocab/search?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('Failed to load vocabulary terms');
        const data = (await response.json()) as { items: VocabItem[] };
        setEmotionLibrary(data.items || []);
        if (selectedWord) {
          const updatedSelected = (data.items || []).find((item) => item.word === selectedWord.word);
          setSelectedWord(updatedSelected || null);
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError('Unable to load words right now. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    const timeoutId = setTimeout(loadVocab, 250);
    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [activeCategory, searchQuery]);

  const useInReflection = () => {
    if (!selectedWord) {
      return;
    }

    const params = new URLSearchParams({
      word: selectedWord.word,
      category: selectedWord.category,
      definition: selectedWord.definition,
      reflection_prompt: learningGuide?.reflectionPrompt || '',
      body_prompt: 'What did you feel in your body?',
      need_prompt: 'What did you need in that moment?',
      coping_action: learningGuide?.healthyNextStep || '',
    });

    navigate(`/reflections?${params.toString()}`);
  };

  const handleScenarioChoice = (option: string) => {
    if (showScenarioFeedback) {
      return;
    }

    const isCorrect = option === currentScenario.correctEmotion;
    const updatedStats: QuizStats = {
      attempts: quizStats.attempts + 1,
      correct: quizStats.correct + (isCorrect ? 1 : 0),
      lastPlayedAt: new Date().toISOString(),
    };

    setSelectedScenarioOption(option);
    setShowScenarioFeedback(true);
    setQuizStats(updatedStats);
    localStorage.setItem(QUIZ_PROGRESS_KEY, JSON.stringify(updatedStats));
  };

  const moveToNextScenario = () => {
    setCurrentScenarioIndex((index) => (index + 1) % QUIZ_SCENARIOS.length);
    setSelectedScenarioOption(null);
    setShowScenarioFeedback(false);
  };

  const bodySignalCorrectCount = Object.keys(bodySignalAnswers).filter(
    (k) => {
      const idx = parseInt(k.split('-')[2]);
      const activity = BODY_SIGNAL_ACTIVITIES[idx];
      return activity && bodySignalAnswers[k] && activity.correctEmotions.includes(bodySignalAnswers[k]!);
    }
  ).length;

  const handleBodySignalAnswer = (emotion: string) => {
    const key = `body-signal-${currentBodySignalIndex}`;
    setBodySignalAnswers({ ...bodySignalAnswers, [key]: emotion });
  };

  const moveToNextBodySignal = () => {
    if (currentBodySignalIndex < BODY_SIGNAL_ACTIVITIES.length - 1) {
      setCurrentBodySignalIndex(currentBodySignalIndex + 1);
    } else {
      setCurrentBodySignalIndex(0);
    }
  };

  const handleDiscriminationAnswer = (answer: string) => {
    const key = `discrim-${currentDiscriminationIndex}`;
    setDiscriminationAnswers({ ...discriminationAnswers, [key]: answer });
  };

  const moveToNextDiscrimination = () => {
    if (currentDiscriminationIndex < DISCRIMINATION_EXERCISES.length - 1) {
      setCurrentDiscriminationIndex(currentDiscriminationIndex + 1);
    } else {
      setCurrentDiscriminationIndex(0);
    }
  };

  const tabs: Array<{ id: 'explore' | 'learn' | 'practice' | 'quiz'; label: string; icon: React.ComponentType<{ size: number }> }> = [
    { id: 'explore', label: 'Explore', icon: BookOpen },
    { id: 'learn', label: 'Learn', icon: Brain },
    { id: 'practice', label: 'Practice', icon: Lightbulb },
    { id: 'quiz', label: 'Quiz', icon: Target },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <header className="flex flex-col gap-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Emotion Vocabulary Builder</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-2xl">
            Building emotional granularity—the ability to precisely name what you feel—is proven to improve mental health and emotional regulation.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 -mx-4 px-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-4 px-4 font-semibold transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* EXPLORE TAB */}
      {activeTab === 'explore' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Search Bar */}
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search emotions..."
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-6 py-2 rounded-full font-bold transition-all ${!activeCategory ? 'bg-gray-900 dark:bg-gray-700 text-white shadow-lg' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            >
              All
            </button>
            {categoryButtons.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all border ${
                  activeCategory === cat.name
                    ? `${cat.color} ${cat.border} shadow-lg scale-105`
                    : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <cat.icon size={16} />
                {cat.name}
              </button>
            ))}
          </div>

          {/* Vocabulary Grid & Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Word Cards */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              {isLoading && <div className="col-span-full py-16 text-center text-gray-500">Loading vocabulary...</div>}
              {error && !isLoading && (
                <div className="col-span-full py-10 px-6 text-center bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-3xl border border-red-200 dark:border-red-900/30">
                  {error}
                </div>
              )}
              <AnimatePresence mode="popLayout">
                {!isLoading &&
                  !error &&
                  filteredLibrary.map((item) => (
                    <motion.button
                      key={item.word}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      onClick={() => setSelectedWord(item)}
                      className={`p-6 rounded-3xl text-left transition-all ${
                        selectedWord?.word === item.word
                          ? 'bg-teal-600 text-white shadow-xl ring-4 ring-teal-50 dark:ring-teal-900/30'
                          : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-teal-200 dark:hover:border-teal-800 hover:shadow-md'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-xl font-bold">{item.word}</h4>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${
                            selectedWord?.word === item.word
                              ? 'bg-white/20'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300'
                          }`}
                        >
                          {item.intensity}
                        </span>
                      </div>
                      <p
                        className={`text-sm line-clamp-2 ${selectedWord?.word === item.word ? 'text-teal-50/80' : 'text-gray-500 dark:text-gray-400'}`}
                      >
                        {item.definition}
                      </p>
                    </motion.button>
                  ))}
              </AnimatePresence>
              {!isLoading && !error && filteredLibrary.length === 0 && (
                <div className="col-span-full py-20 text-center bg-gray-50 dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                  <Book className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
                  <p className="text-gray-400 dark:text-gray-500 font-medium">No results found for your search.</p>
                </div>
              )}
            </div>

            {/* Details Panel */}
            <div className="lg:sticky lg:top-8 space-y-6">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-[32px] border border-gray-100 dark:border-gray-700 shadow-sm min-h-[500px] flex flex-col">
                {selectedWord ? (
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      {categoryButtons.find((c) => c.name === selectedWord.category) && (
                        <div
                          className={`p-3 rounded-2xl ${
                            categoryButtons.find((c) => c.name === selectedWord.category)?.color
                          }`}
                        >
                          {React.createElement(
                            categoryButtons.find((c) => c.name === selectedWord.category)!.icon,
                            { size: 24 }
                          )}
                        </div>
                      )}
                      <div>
                        <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                          {selectedWord.category}
                        </span>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{selectedWord.word}</h3>
                      </div>
                    </div>

                    <div className="space-y-4 flex-1">
                      <div>
                        <h5 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                          <Info size={16} className="text-teal-500" /> Definition
                        </h5>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl">
                          {selectedWord.definition}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-100 dark:border-orange-900/40">
                          <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-1">Intensity</p>
                          <p className="font-bold text-orange-700 dark:text-orange-300 text-sm">{selectedWord.intensity}</p>
                        </div>
                        <div className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded-2xl border border-teal-100 dark:border-teal-900/40">
                          <p className="text-[10px] font-bold text-teal-400 uppercase tracking-widest mb-1">Type</p>
                          <p className="font-bold text-teal-700 dark:text-teal-300 text-sm">
                            {selectedWord.source === 'datamuse' ? 'Related' : 'Primary'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={useInReflection}
                      className="w-full py-3 mt-4 bg-gray-900 dark:bg-gray-700 text-white font-bold rounded-2xl hover:bg-black dark:hover:bg-gray-600 transition-colors text-sm"
                    >
                      Use in Reflection
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                    <Book size={64} className="mb-4 text-gray-300 dark:text-gray-600" />
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                      Select a word to see its details and use cases.
                    </p>
                  </div>
                )}
              </div>

              {selectedWord && learningGuide && (
                <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-6 rounded-[32px] text-white overflow-hidden relative">
                  <Sparkles className="absolute top-4 right-4 text-white/20 w-8 h-8" />
                  <h4 className="font-bold mb-2 relative z-10">Key Insight</h4>
                  <p className="text-teal-50/85 text-xs relative z-10">{learningGuide.signalMeaning}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* LEARN TAB */}
      {activeTab === 'learn' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Body Signals Recognition */}
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-[32px] p-8 space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Body Signals Activity</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Learn to recognize emotions through physical sensations.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-100 dark:border-amber-900/40 bg-amber-50/80 dark:bg-amber-900/20 p-5 space-y-3">
                <p className="text-sm font-bold text-amber-900 dark:text-amber-200">Signal: "{currentBodySignal.signal}"</p>
                <p className="text-xs text-amber-800/70 dark:text-amber-300/70">Which emotions might you feel?</p>
              </div>

              <div className="space-y-2">
                {[...currentBodySignal.correctEmotions, ...currentBodySignal.incorrectEmotions].sort().map((option) => {
                  const isCorrect = currentBodySignal.correctEmotions.includes(option);
                  const isSelected = bodySignalAnswers[`body-signal-${currentBodySignalIndex}`] === option;

                  return (
                    <button
                      key={option}
                      onClick={() => handleBodySignalAnswer(option)}
                      className={`w-full p-4 rounded-2xl text-left font-semibold transition-all border ${
                        isSelected
                          ? isCorrect
                            ? 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200'
                            : 'bg-rose-100 dark:bg-rose-900/30 border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-200'
                          : 'bg-white dark:bg-gray-900/40 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-teal-300 dark:hover:border-teal-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {isSelected && (
                          <span className="text-sm">
                            {isCorrect ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={moveToNextBodySignal}
                className="w-full py-3 bg-teal-600 dark:bg-teal-700 hover:bg-teal-700 dark:hover:bg-teal-800 text-white font-bold rounded-2xl transition-colors"
              >
                Next Signal ({currentBodySignalIndex + 1}/{BODY_SIGNAL_ACTIVITIES.length})
              </button>

              <div className="text-center">
                <p className="text-sm font-semibold text-teal-600 dark:text-teal-400">
                  Correct: {bodySignalCorrectCount}/{currentBodySignalIndex + 1}
                </p>
              </div>
            </div>

            {/* Learning Guide for Selected Word */}
            {selectedWord && learningGuide && (
              <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-[32px] p-8 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  {categoryButtons.find((c) => c.name === selectedWord.category) && (
                    <div
                      className={`p-3 rounded-2xl ${
                        categoryButtons.find((c) => c.name === selectedWord.category)?.color
                      }`}
                    >
                      {React.createElement(
                        categoryButtons.find((c) => c.name === selectedWord.category)!.icon,
                        { size: 20 }
                      )}
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{selectedWord.word}</h3>
                </div>

                <div className="grid grid-cols-1 gap-3 max-h-[500px] overflow-y-auto pr-2">
                  <div className="p-3 rounded-2xl bg-gray-50/70 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-700">
                    <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                      Body Signals
                    </p>
                    <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                      {learningGuide.bodySignals.map((signal) => (
                        <li key={signal}>• {signal}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-2xl bg-gray-50/70 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-700">
                    <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                      Likely Triggers
                    </p>
                    <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                      {learningGuide.likelyTriggers.map((trigger) => (
                        <li key={trigger}>• {trigger}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-2xl bg-teal-50/80 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-900/40">
                    <p className="text-[11px] font-bold text-teal-700 dark:text-teal-300 uppercase tracking-widest mb-1">
                      What It Signals
                    </p>
                    <p className="text-xs text-teal-800 dark:text-teal-200">{learningGuide.signalMeaning}</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-emerald-50/80 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/40">
                    <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-widest mb-2">
                      Healthy Next Step
                    </p>
                    <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
                      {learningGuide.healthyNextStep}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* PRACTICE TAB */}
      {activeTab === 'practice' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Discrimination Exercises */}
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-[32px] p-8 space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Discrimination Exercise</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Learn to distinguish between similar emotions.
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/80 dark:bg-blue-900/20 p-5">
                  <p className="text-sm font-bold text-blue-900 dark:text-blue-200 mb-2">
                    {currentDiscrimation.leftEmotion} <span className="text-gray-500 mx-2">vs</span> {currentDiscrimation.rightEmotion}
                  </p>
                  <p className="text-xs text-blue-900/70 dark:text-blue-300/70">{currentDiscrimation.keyDifference}</p>
                </div>

                <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/80 dark:bg-indigo-900/20 p-4">
                  <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                    <Lightbulb size={14} className="inline mr-1" />
                    {currentDiscrimation.quickCheck}
                  </p>
                </div>

                <button
                  onClick={moveToNextDiscrimination}
                  className="w-full py-3 bg-teal-600 dark:bg-teal-700 hover:bg-teal-700 dark:hover:bg-teal-800 text-white font-bold rounded-2xl transition-colors"
                >
                  Next Exercise ({currentDiscriminationIndex + 1}/{DISCRIMINATION_EXERCISES.length})
                </button>
              </div>
            </div>

            {/* Reflection Prompts */}
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-[32px] p-8 space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Reflection Practice</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Deepen your self-awareness through guided prompts.
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-purple-100 dark:border-purple-900/40 bg-purple-50/80 dark:bg-purple-900/20 p-5">
                  <p className="text-sm font-bold text-purple-900 dark:text-purple-200">"{currentReflectionPrompt.prompt}"</p>
                </div>

                <textarea
                  placeholder="Write your reflection here..."
                  value={reflectionInputs[currentReflectionIndex] || ''}
                  onChange={(e) =>
                    setReflectionInputs({ ...reflectionInputs, [currentReflectionIndex]: e.target.value })
                  }
                  className="w-full p-4 h-32 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/40 text-gray-900 dark:text-gray-100 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />

                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Hints:</p>
                  {currentReflectionPrompt.hints.map((hint) => (
                    <div key={hint} className="p-2 rounded-xl bg-gray-50 dark:bg-gray-900/30 text-xs text-gray-600 dark:text-gray-400">
                      💡 {hint}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    if (currentReflectionIndex < REFLECTION_PROMPTS.length - 1) {
                      setCurrentReflectionIndex(currentReflectionIndex + 1);
                    } else {
                      setCurrentReflectionIndex(0);
                    }
                  }}
                  className="w-full py-3 bg-teal-600 dark:bg-teal-700 hover:bg-teal-700 dark:hover:bg-teal-800 text-white font-bold rounded-2xl transition-colors"
                >
                  Next Prompt ({currentReflectionIndex + 1}/{REFLECTION_PROMPTS.length})
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* QUIZ TAB */}
      {activeTab === 'quiz' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-[32px] p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Scenario Challenge</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Pick the best-fit emotion and learn from the explanation.
                </p>
              </div>
              <div className="text-sm font-semibold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 border border-teal-100 dark:border-teal-900/40 rounded-xl px-4 py-2">
                Score: {quizStats.correct}/{quizStats.attempts} ({quizAccuracy}%)
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-900/30 p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">
                {currentScenario.title}
              </p>
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{currentScenario.situation}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentScenario.options.map((option) => {
                const isSelected = selectedScenarioOption === option;
                const isCorrectOption = option === currentScenario.correctEmotion;

                let optionStyle = 'bg-white dark:bg-gray-900/40 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300';
                if (showScenarioFeedback && isCorrectOption) {
                  optionStyle = 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300';
                } else if (showScenarioFeedback && isSelected && !isCorrectOption) {
                  optionStyle = 'bg-rose-50 dark:bg-rose-900/20 border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-300';
                } else if (isSelected) {
                  optionStyle = 'bg-teal-50 dark:bg-teal-900/20 border-teal-300 dark:border-teal-700 text-teal-800 dark:text-teal-300';
                }

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleScenarioChoice(option)}
                    className={`p-4 rounded-xl border text-left font-semibold transition-all ${optionStyle}`}
                    disabled={showScenarioFeedback}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {showScenarioFeedback && (
              <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/80 dark:bg-indigo-900/20 p-5 space-y-2">
                <p className="text-sm font-bold text-indigo-800 dark:text-indigo-300">
                  {selectedScenarioOption === currentScenario.correctEmotion
                    ? '✓ Correct!'
                    : `Best fit: ${currentScenario.correctEmotion}`}
                </p>
                <p className="text-sm text-indigo-900/80 dark:text-indigo-200">{currentScenario.explanation}</p>
              </div>
            )}

            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {quizStats.lastPlayedAt
                  ? `Last played: ${new Date(quizStats.lastPlayedAt).toLocaleString()}`
                  : 'Start your first scenario challenge.'}
              </p>
              <button
                type="button"
                onClick={moveToNextScenario}
                className="px-5 py-2.5 bg-gray-900 dark:bg-gray-700 text-white font-bold rounded-xl hover:bg-black dark:hover:bg-gray-600 transition-colors text-sm"
              >
                Next Scenario
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
