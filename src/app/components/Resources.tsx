import React, { useEffect, useState } from 'react';
import { Phone, ExternalLink, Globe, LifeBuoy, Heart, AlertCircle, MessageSquare } from 'lucide-react';

const envApiUrl = (import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_API_URL;
const API_BASE_URL = envApiUrl || 'http://localhost:8001/api';

interface Helpline {
  id: number;
  name: string;
  action: string;
  description: string;
  resource_type: string;
  countries: string[];
  available_24_7: string | null;
}

interface DigitalResource {
  id: number;
  title: string;
  url: string;
  description: string;
  accessibility: string[];
  relevant_regions: string[];
}

interface SupportGroup {
  id: number;
  name: string;
  url: string | null;
  focus: string;
  format: string;
  countries: string[];
  language: string[];
}

export const Resources: React.FC = () => {
  const [helplines, setHelplines] = useState<Helpline[]>([]);
  const [externalResources, setExternalResources] = useState<DigitalResource[]>([]);
  const [supportGroups, setSupportGroups] = useState<SupportGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadResources = async () => {
      setIsLoading(true);
      setError('');
      try {
        console.log('Loading resources from:', API_BASE_URL);
        
       
        const helplinesResponse = await fetch(`${API_BASE_URL}/resources/helplines`);
        console.log('Helplines response status:', helplinesResponse.status);
        if (helplinesResponse.ok) {
          const data = await helplinesResponse.json();
          console.log('Helplines data:', data);
          setHelplines(data);
        } else {
          console.error('Failed to load helplines:', helplinesResponse.status);
        }

     
        const digitalResponse = await fetch(`${API_BASE_URL}/resources/digital-resources`);
        console.log('Digital resources response status:', digitalResponse.status);
        if (digitalResponse.ok) {
          const data = await digitalResponse.json();
          console.log('Digital resources data:', data);
          setExternalResources(data);
        } else {
          console.error('Failed to load digital resources:', digitalResponse.status);
        }

      
        const groupsResponse = await fetch(`${API_BASE_URL}/resources/support-groups`);
        console.log('Support groups response status:', groupsResponse.status);
        if (groupsResponse.ok) {
          const data = await groupsResponse.json();
          console.log('Support groups data:', data);
          setSupportGroups(data);
        } else {
          console.error('Failed to load support groups:', groupsResponse.status);
        }
      } catch (err) {
        console.error('Error loading resources:', err);
        setError('Could not load resources. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadResources();
  }, []);
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
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {helplines.map((line) => (
            <div key={line.name} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-red-100 dark:border-red-900/30 group hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${line.resource_type === 'Crisis' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'}`}>
                  {line.resource_type}
                </span>
                <Phone size={18} className="text-red-400 group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">{line.name}</h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">{line.description}</p>
              {line.available_24_7 && <p className="text-gray-400 dark:text-gray-500 text-xs mb-4">Available: {line.available_24_7}</p>}
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
                    <p className="text-sm text-gray-500 dark:text-gray-400">{res.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {res.accessibility.map((item) => (
                        <span key={item} className="text-xs bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 px-2 py-1 rounded">
                          {item}
                        </span>
                      ))}
                    </div>
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
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-2xl text-teal-600 dark:text-teal-400 shadow-sm shrink-0">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-teal-900 dark:text-teal-400">Join a Support Group</h4>
                  <p className="text-teal-800/60 dark:text-teal-400/60 text-sm mt-1 leading-relaxed">
                    Connecting with others who share similar experiences can be incredibly healing. Peer support groups provide a safe space to share and learn.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {supportGroups.map((group) => (
                  <a
                    key={group.name}
                    href={group.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white dark:bg-gray-800 border border-teal-100 dark:border-teal-900/30 rounded-2xl p-5 hover:border-teal-300 dark:hover:border-teal-700 hover:shadow-md transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <h5 className="font-bold text-gray-900 dark:text-gray-100 leading-snug">{group.name}</h5>
                        <ExternalLink size={16} className="text-gray-300 dark:text-gray-600 group-hover:text-teal-500 shrink-0" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{group.focus}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-2 py-1 rounded">
                          {group.format}
                        </span>
                        {Array.isArray(group.language) && group.language.map((lang) => (
                          <span key={lang} className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2 py-1 rounded">
                            {lang}
                          </span>
                        ))}
                      </div>
                      {Array.isArray(group.countries) && group.countries.length > 0 && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">Active in: {group.countries.join(", ")}</p>
                      )}
                    </div>
                  </a>
                ))}
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
              Seeking help is a sign of strength, not weakness. You are worthy of support, care and a fulfilling life.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
