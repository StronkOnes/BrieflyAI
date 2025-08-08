
import React, { useState } from 'react';
import { researchAndSummarize, generateArticle, generateDerivativeContent } from '../services/geminiService';
import { HistoryItem, TabKey } from '../types';
import Teleprompter from './Teleprompter';

const Spinner = () => (
  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
);

const TeleprompterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 19V5a2 2 0 012-2h10a2 2 0 012 2v14l-3-2-4 2-4-2-3 2z" />
  </svg>
);


type DerivativeType = 'shorts' | 'podcast' | 'video';

interface Props {
  onArticleGenerated: (data: { topic: string; article: string }) => void;
  addToHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
}

const ResearchAndArticle: React.FC<Props> = ({ onArticleGenerated, addToHistory }) => {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingDerivative, setLoadingDerivative] = useState<DerivativeType | null>(null);
  
  const [researchSummary, setResearchSummary] = useState('');
  const [article, setArticle] = useState('');
  const [derivativeContent, setDerivativeContent] = useState({ shorts: '', podcast: '', video: '' });

  const [error, setError] = useState('');
  const [activeOutputTab, setActiveOutputTab] = useState('article');
  const [teleprompterScript, setTeleprompterScript] = useState<string | null>(null);


  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic.');
      return;
    }
    setIsLoading(true);
    setError('');
    setResearchSummary('');
    setArticle('');
    setDerivativeContent({ shorts: '', podcast: '', video: '' });
    setActiveOutputTab('article');

    try {
      const summary = await researchAndSummarize(topic);
      if (summary.startsWith('Error:')) {
          setError(summary);
          setResearchSummary('');
      } else {
        setResearchSummary(summary);
        addToHistory({ type: TabKey.RESEARCH_ARTICLE, topic: `Research: ${topic}`, content: summary });
        const generatedArticle = await generateArticle(summary);
        if (generatedArticle.startsWith('Error:')) {
          setError(generatedArticle);
          setArticle('');
        } else {
          setArticle(generatedArticle);
          onArticleGenerated({ topic, article: generatedArticle });
          addToHistory({ type: TabKey.RESEARCH_ARTICLE, topic: `Article: ${topic}`, content: generatedArticle });
        }
      }
    } catch (e) {
      const err = e as Error;
      setError(`An unexpected error occurred: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGenerateDerivative = async (type: DerivativeType) => {
    if (!article) return;
    setLoadingDerivative(type);
    setError('');
    
    try {
      const result = await generateDerivativeContent(article, type);
      if (result.startsWith('Error:')) {
        setError(result);
      } else {
        setDerivativeContent(prev => ({ ...prev, [type]: result }));
        setActiveOutputTab(type);
        const typeName = type.charAt(0).toUpperCase() + type.slice(1);
        addToHistory({ type: TabKey.RESEARCH_ARTICLE, topic: `${typeName} for: ${topic}`, content: result });
      }
    } catch (e) {
      const err = e as Error;
      setError(`An unexpected error occurred: ${err.message}`);
    } finally {
      setLoadingDerivative(null);
    }
  }
  
  const outputTabs = [
      { key: 'article', label: 'Article' },
      { key: 'shorts', label: 'Shorts' },
      { key: 'podcast', label: 'Podcast' },
      { key: 'video', label: 'Video Script' },
  ];
  
  const getCurrentScriptForTeleprompter = () => {
    switch (activeOutputTab) {
      case 'article': return article;
      case 'shorts': return derivativeContent.shorts;
      case 'podcast': return derivativeContent.podcast;
      case 'video': return derivativeContent.video;
      default: return '';
    }
  };

  const scriptForTeleprompter = getCurrentScriptForTeleprompter();


  return (
    <div className="p-8 h-full flex flex-col space-y-6">
      {teleprompterScript && (
        <Teleprompter script={teleprompterScript} onClose={() => setTeleprompterScript(null)} />
      )}

      <header>
        <h1 className="text-3xl font-bold text-white">Research & Content Suite</h1>
        <p className="text-slate-400 mt-1">Generate research, a full article, and derivative content like scripts and social posts.</p>
      </header>

      <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., 'The future of renewable energy'"
            className="flex-grow bg-slate-700 text-white placeholder-slate-400 rounded-md px-4 py-3 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
            disabled={isLoading}
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading || !topic.trim()}
            className="flex justify-center items-center gap-2 bg-violet-600 text-white font-bold py-3 px-6 rounded-md hover:bg-violet-700 disabled:bg-violet-400/50 disabled:cursor-not-allowed transition duration-200"
          >
            {isLoading ? <><Spinner /> Generating...</> : 'Generate Content'}
          </button>
        </div>
        {error && <p className="text-red-400 mt-4">{error}</p>}
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 flex-grow min-h-0">
        <div className="bg-slate-800/50 p-6 rounded-lg shadow-md flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Research Summary</h2>
          <div className="bg-slate-900 rounded-md p-4 flex-grow overflow-y-auto whitespace-pre-wrap font-mono text-slate-300">
            {isLoading && !researchSummary && <p>Researching topic...</p>}
            {researchSummary}
          </div>
        </div>
        <div className="bg-slate-800/50 p-6 rounded-lg shadow-md flex flex-col">
          <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Generated Content</h2>
              <div className="flex items-center gap-4">
                 <button
                    onClick={() => setTeleprompterScript(scriptForTeleprompter)}
                    disabled={!scriptForTeleprompter || isLoading}
                    className="flex items-center gap-2 bg-violet-600 text-white font-semibold py-1.5 px-3 rounded-md hover:bg-violet-700 disabled:bg-violet-400/50 disabled:cursor-not-allowed transition"
                    title="Open in Teleprompter"
                  >
                    <TeleprompterIcon />
                    <span>Teleprompter</span>
                  </button>
                <div className="flex space-x-2">
                    {(['shorts', 'podcast', 'video'] as DerivativeType[]).map(type => (
                        <button key={type} onClick={() => handleGenerateDerivative(type)} disabled={!article || !!loadingDerivative} className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-1 px-3 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5">
                        {loadingDerivative === type ? <><Spinner/> Writing...</> : `Write ${type.charAt(0).toUpperCase() + type.slice(1)}`}
                        </button>
                    ))}
                </div>
              </div>
          </div>
          <div className="border-b border-slate-700 mb-4">
              <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                {outputTabs.map(tab => (
                    (tab.key === 'article' || derivativeContent[tab.key as DerivativeType]) && (
                    <button key={tab.key} onClick={() => setActiveOutputTab(tab.key)} className={`${ activeOutputTab === tab.key ? 'border-violet-500 text-violet-400' : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500' } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}>
                        {tab.label}
                    </button>
                    )
                ))}
              </nav>
          </div>
          <div className="bg-slate-900 rounded-md p-4 flex-grow flex flex-col text-slate-300 leading-relaxed min-h-[200px]">
            {isLoading && researchSummary && !article && <p className="flex-shrink-0 mb-2">Writing article...</p>}
            {activeOutputTab === 'article' ? (
                <textarea
                    value={article}
                    onChange={(e) => setArticle(e.target.value)}
                    placeholder="Generated article will appear here. You can also paste your own text to use with the teleprompter."
                    className="w-full flex-grow bg-transparent resize-none focus:outline-none placeholder-slate-500"
                />
            ) : (
                <div className="overflow-y-auto whitespace-pre-wrap flex-grow">
                    {activeOutputTab === 'shorts' && derivativeContent.shorts}
                    {activeOutputTab === 'podcast' && derivativeContent.podcast}
                    {activeOutputTab === 'video' && derivativeContent.video}
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchAndArticle;
