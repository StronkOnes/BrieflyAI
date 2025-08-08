
import React, { useState } from 'react';
import { summarizeCrmData } from '../services/geminiService';
import { HistoryItem, TabKey } from '../types';

const Spinner = () => (
  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
);

interface Props {
  addToHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
}

const CrmSummaryGenerator: React.FC<Props> = ({ addToHistory }) => {
  const [crmData, setCrmData] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleGenerate = async () => {
    if (!crmData.trim()) {
      setError('Please paste some CRM data to summarize.');
      return;
    }
    setIsLoading(true);
    setError('');
    setSummary('');

    try {
      const result = await summarizeCrmData(crmData);
      if (result.startsWith('Error:')) {
        setError(result);
      } else {
        setSummary(result);
        addToHistory({
            type: TabKey.CRM_SUMMARY,
            topic: `CRM Summary: ${crmData.substring(0, 40)}...`,
            content: result
        });
      }
    } catch (e) {
      const err = e as Error;
      setError(`An unexpected error occurred: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 h-full flex flex-col space-y-6">
       <header>
        <h1 className="text-3xl font-bold text-white">CRM Summary Generator</h1>
        <p className="text-slate-400 mt-1">Paste a raw CRM record to generate a clean, professional summary for management.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6 flex-grow">
        {/* Input */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg flex flex-col">
            <label htmlFor="crm-data" className="text-xl font-semibold mb-4">Paste CRM Data Here</label>
            <textarea
                id="crm-data"
                value={crmData}
                onChange={(e) => setCrmData(e.target.value)}
                placeholder="e.g., Lead: John Smith, Status: Contacted, Last Activity: Follow-up call 2 days ago..."
                className="flex-grow w-full bg-slate-700 text-white placeholder-slate-400 rounded-md p-4 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
                disabled={isLoading}
            />
        </div>
        {/* Output */}
        <div className="bg-slate-800/50 p-6 rounded-lg shadow-md flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Generated Summary</h2>
            <div className="bg-slate-900 rounded-md p-4 flex-grow overflow-y-auto whitespace-pre-wrap text-slate-300 leading-relaxed">
                {isLoading ? <div className="flex items-center gap-2"><Spinner/> Generating summary...</div> : summary}
            </div>
        </div>
      </div>
      
       <div className="flex-shrink-0">
         <button
            onClick={handleGenerate}
            disabled={isLoading || !crmData.trim()}
            className="w-full md:w-auto flex justify-center items-center gap-2 bg-violet-600 text-white font-bold py-3 px-6 rounded-md hover:bg-violet-700 disabled:bg-violet-400/50 disabled:cursor-not-allowed transition duration-200"
          >
            {isLoading ? <><Spinner /> Generating...</> : 'Generate Summary'}
          </button>
          {error && <p className="text-red-400 mt-4">{error}</p>}
       </div>
    </div>
  );
};

export default CrmSummaryGenerator;
