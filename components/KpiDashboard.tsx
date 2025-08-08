
import React, { useState, useCallback, useEffect } from 'react';
import { Lead, Opportunity, HistoryItem, TabKey } from '../types';
import { analyzeKpiData } from '../services/geminiService';

const Spinner = () => (
  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
);

interface Props {
  leads: Lead[];
  opportunities: Opportunity[];
  onKpiAnalyzed: (analysis: string) => void;
  addToHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
}

const KpiDashboard: React.FC<Props> = ({ leads, opportunities, onKpiAnalyzed, addToHistory }) => {
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalysis = useCallback(async () => {
    setIsLoading(true);
    setError('');
    
    // Only clear analysis if we are triggering manually.
    // setAnalysis(''); 

    const kpiData = `
      LEADS:
      ${JSON.stringify(leads, null, 2)}

      OPPORTUNITIES:
      ${JSON.stringify(opportunities, null, 2)}
    `;

    try {
      const result = await analyzeKpiData(kpiData);
      if (result.startsWith('Error:')) {
        setError(result);
      } else {
        setAnalysis(result);
        onKpiAnalyzed(result); // Trigger automation
        addToHistory({
            type: TabKey.KPI_DASHBOARD,
            topic: 'KPI Analysis Report',
            content: result
        });
      }
    } catch (e) {
        const err = e as Error;
        setError(`An unexpected error occurred: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [leads, opportunities, onKpiAnalyzed, addToHistory]);
  
  useEffect(() => {
    handleAnalysis();
  }, [handleAnalysis]); // Automatically re-analyzes if CRM data changes

  return (
    <div className="p-8 space-y-6">
      <header className="flex justify-between items-start">
        <div>
            <h1 className="text-3xl font-bold text-white">KPI Dashboard & Analysis</h1>
            <p className="text-slate-400 mt-1">AI-powered analysis of your current sales and lead data.</p>
        </div>
        <button
            onClick={handleAnalysis}
            disabled={isLoading}
            className="flex justify-center items-center gap-2 bg-violet-600 text-white font-bold py-2 px-5 rounded-md hover:bg-violet-700 disabled:bg-violet-400/50 disabled:cursor-not-allowed transition duration-200"
        >
            {isLoading ? <><Spinner /> Refreshing...</> : 'Refresh Analysis'}
        </button>
      </header>
      
      {error && <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg">{error}</div>}

      <div className="bg-slate-800/50 p-6 rounded-lg shadow-md min-h-[400px]">
        <h2 className="text-xl font-semibold mb-4 text-white">Analysis Report</h2>
        {isLoading && !analysis ? (
            <div className="flex items-center justify-center h-full text-slate-400">
                <Spinner/>
                <span className="ml-3">Analyzing data...</span>
            </div>
        ) : (
             <div className="bg-slate-900 rounded-md p-4 flex-grow overflow-y-auto whitespace-pre-wrap text-slate-300 leading-relaxed">
                {analysis || "Click 'Refresh Analysis' to generate the KPI report."}
            </div>
        )}
      </div>
    </div>
  );
};

export default KpiDashboard;
