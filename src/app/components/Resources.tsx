import React from 'react';
import { Phone, ExternalLink, Globe, LifeBuoy, Heart, AlertCircle, MessageSquare } from 'lucide-react';

const helplines = [
  { 
    name: 'Crisis Text Line', 
    action: 'Text HOME to 741741', 
    desc: 'Free, 24/7 crisis counseling in the US & Canada.',
    type: 'Crisis'
  },
  { 
    name: 'National Suicide Prevention Lifeline', 
    action: 'Call 988', 
    desc: 'Support for people in distress, prevention and crisis resources.',
    type: 'Crisis'
  },
  { 
    name: 'The Trevor Project', 
    action: 'Call 1-866-488-7386', 
    desc: 'Crisis intervention and suicide prevention for LGBTQ youth.',
    type: 'Targeted'
  },
  { 
    name: 'NAMI HelpLine', 
    action: 'Call 1-800-950-NAMI', 
    desc: 'Information, resource referrals and support for people living with a mental health condition.',
    type: 'Information'
  },
];

const externalResources = [
  { title: 'Psychology Today', url: 'https://www.psychologytoday.com', desc: 'Find therapists, teletherapy, and mental health information.' },
  { title: 'Mindfulness.org', url: 'https://www.mindful.org', desc: 'Practical tools and insights for mindfulness and meditation.' },
  { title: 'Headspace', url: 'https://www.headspace.com', desc: 'Meditation and sleep made simple.' },
  { title: 'Calm', url: 'https://www.calm.com', desc: 'App for Sleep, Meditation and Relaxation.' },
];

export const Resources: React.FC = () => {
  return (
    <div className="space-y-12 pb-20">
      <header>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Mental Health Resources</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-2xl">
          You don't have to navigate this alone. Here are some trusted helplines and organizations that offer support and information.
        </p>
      </header>

      {/* Immediate Support */}
      <section className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-[32px] p-8 md:p-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center text-red-600 dark:text-red-400">
            <AlertCircle size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-red-900 dark:text-red-400">Need immediate help?</h3>
            <p className="text-red-700/70 dark:text-red-400/70 text-sm font-medium">If you are in danger, please contact your local emergency services.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {helplines.map((line) => (
            <div key={line.name} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-red-100 dark:border-red-900/30 group hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${line.type === 'Crisis' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'}`}>
                  {line.type}
                </span>
                <Phone size={18} className="text-red-400 group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">{line.name}</h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{line.desc}</p>
              <div className="inline-block px-4 py-2 bg-red-600 text-white font-bold rounded-xl text-sm group-hover:bg-red-700 transition-colors">
                {line.action}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Directory Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
              <Globe size={24} className="text-teal-500" /> Digital Resources
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {externalResources.map((res) => (
                <a 
                  key={res.title}
                  href={res.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl hover:border-teal-300 dark:hover:border-teal-700 hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-gray-900 dark:text-gray-100">{res.title}</h4>
                      <ExternalLink size={16} className="text-gray-300 dark:text-gray-600 group-hover:text-teal-500" />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{res.desc}</p>
                  </div>
                  <span className="text-xs text-teal-600 dark:text-teal-400 font-semibold mt-4">Visit Website</span>
                </a>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
              <LifeBuoy size={24} className="text-teal-500" /> Support Communities
            </h3>
            <div className="bg-teal-50 dark:bg-teal-900/20 p-8 rounded-3xl border border-teal-100 dark:border-teal-900/30">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-2xl text-teal-600 dark:text-teal-400 shadow-sm">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-teal-900 dark:text-teal-400">Join a Support Group</h4>
                  <p className="text-teal-800/60 dark:text-teal-400/60 text-sm mt-1 leading-relaxed">
                    Connecting with others who share similar experiences can be incredibly healing. Peer support groups provide a safe space to share and learn.
                  </p>
                  <button className="mt-4 px-6 py-2 bg-white dark:bg-gray-800 text-teal-700 dark:text-teal-400 font-bold rounded-xl text-sm hover:bg-teal-100 dark:hover:bg-gray-700 transition-colors border border-teal-200 dark:border-teal-800">
                    Find groups near you
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <Heart size={32} className="text-teal-500 mb-4" />
            <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-gray-100">Self-Care Reminder</h4>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
              Seeking help is a sign of strength, not weakness. You are worthy of support, care, and a fulfilling life.
            </p>
            <ul className="space-y-3">
              {['Drink water', 'Take 5 deep breaths', 'Step outside', 'Call a friend'].map(item => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-400" /> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 p-8 rounded-3xl border border-orange-100 dark:border-orange-900/30">
            <h4 className="font-bold text-orange-900 dark:text-orange-400 mb-2">Feedback & Suggestions</h4>
            <p className="text-orange-800/60 dark:text-orange-400/60 text-sm mb-4">
              Know of a resource that should be here? Let us know.
            </p>
            <button className="text-orange-700 dark:text-orange-400 font-bold text-sm hover:underline">Contact Support Team</button>
          </div>
        </div>
      </div>
    </div>
  );
};
