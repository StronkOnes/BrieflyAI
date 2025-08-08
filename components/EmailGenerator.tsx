
import React, { useState } from 'react';
import { writeEmailTemplate } from '../services/geminiService';
import { HistoryItem, TabKey } from '../types';


const Spinner = () => (
  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
);

interface Props {
  addToHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
}

const EmailGenerator: React.FC<Props> = ({ addToHistory }) => {
  const [scenario, setScenario] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleGenerate = async () => {
    if (!scenario.trim()) {
      setError('Please describe an email scenario.');
      return;
    }
    setIsLoading(true);
    setError('');
    setEmail('');
    
    try {
      const result = await writeEmailTemplate(scenario);
      if (result.startsWith('Error:')) {
        setError(result);
      } else {
        setEmail(result);
        addToHistory({
            type: TabKey.EMAIL_GENERATOR,
            topic: `Email: ${scenario}`,
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
        <h1 className="text-3xl font-bold text-white">Email Template Generator</h1>
        <p className="text-slate-400 mt-1">Describe a use case to generate a professional email template.</p>
      </header>

      <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            placeholder="e.g., 'A follow-up email after a sales demo'"
            className="flex-grow bg-slate-700 text-white placeholder-slate-400 rounded-md px-4 py-3 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
            disabled={isLoading}
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading || !scenario.trim()}
            className="flex justify-center items-center gap-2 bg-violet-600 text-white font-bold py-3 px-6 rounded-md hover:bg-violet-700 disabled:bg-violet-400/50 disabled:cursor-not-allowed transition duration-200"
          >
            {isLoading ? <><Spinner /> Generating...</> : 'Generate Email'}
          </button>
        </div>
        {error && <p className="text-red-400 mt-4">{error}</p>}
      </div>
      
      <div className="bg-slate-800/50 p-6 rounded-lg shadow-md min-h-[400px]">
        <h2 className="text-xl font-semibold mb-4 text-white">Generated Email</h2>
        {isLoading ? (
            <div className="flex items-center justify-center h-full text-slate-400">
                <Spinner/>
                <span className="ml-3">Generating email...</span>
            </div>
        ) : (
             <div className="bg-slate-900 rounded-md p-4 flex-grow overflow-y-auto whitespace-pre-wrap text-slate-300 leading-relaxed">
                {email || "Enter a scenario and click 'Generate Email' to see results."}
            </div>
        )}
      </div>
    </div>
  );
};

export default EmailGenerator;
