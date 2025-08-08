
import React, { useState } from 'react';
import { planCampaign } from '../services/geminiService';
import { HistoryItem, TabKey } from '../types';

const Spinner = () => (
  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
);

interface Props {
  addToHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
}

const CampaignPlanner: React.FC<Props> = ({ addToHistory }) => {
  const [goal, setGoal] = useState('');
  const [plan, setPlan] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleGenerate = async () => {
    if (!goal.trim()) {
      setError('Please enter a business goal.');
      return;
    }
    setIsLoading(true);
    setError('');
    setPlan('');
    
    try {
      const result = await planCampaign(goal);
      if (result.startsWith('Error:')) {
        setError(result);
      } else {
        setPlan(result);
        addToHistory({
            type: TabKey.CAMPAIGN_PLANNER,
            topic: `Campaign Plan: ${goal}`,
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
    <div className="p-8 space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-white">Marketing Campaign Planner</h1>
        <p className="text-slate-400 mt-1">Describe your business goal to generate a 4-week content plan.</p>
      </header>

      <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g., 'Increase brand awareness in the tech startup community'"
            className="flex-grow bg-slate-700 text-white placeholder-slate-400 rounded-md px-4 py-3 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
            disabled={isLoading}
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading || !goal.trim()}
            className="flex justify-center items-center gap-2 bg-violet-600 text-white font-bold py-3 px-6 rounded-md hover:bg-violet-700 disabled:bg-violet-400/50 disabled:cursor-not-allowed transition duration-200"
          >
            {isLoading ? <><Spinner /> Generating...</> : 'Generate Plan'}
          </button>
        </div>
        {error && <p className="text-red-400 mt-4">{error}</p>}
      </div>
      
      <div className="bg-slate-800/50 p-6 rounded-lg shadow-md min-h-[400px]">
        <h2 className="text-xl font-semibold mb-4 text-white">Generated Campaign Plan</h2>
        {isLoading ? (
            <div className="flex items-center justify-center h-full text-slate-400">
                <Spinner/>
                <span className="ml-3">Generating plan...</span>
            </div>
        ) : (
             <div className="bg-slate-900 rounded-md p-4 flex-grow overflow-y-auto whitespace-pre-wrap text-slate-300 leading-relaxed">
                {plan || "Enter a goal and click 'Generate Plan' to see results here."}
            </div>
        )}
      </div>
    </div>
  );
};

export default CampaignPlanner;
