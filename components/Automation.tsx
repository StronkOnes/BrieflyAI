
import React from 'react';

// A reusable toggle switch component
const ToggleSwitch: React.FC<{ enabled: boolean; onChange: () => void }> = ({ enabled, onChange }) => (
  <button
    type="button"
    className={`${
      enabled ? 'bg-violet-600' : 'bg-slate-600'
    } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-violet-500`}
    role="switch"
    aria-checked={enabled}
    onClick={onChange}
  >
    <span
      className={`${
        enabled ? 'translate-x-6' : 'translate-x-1'
      } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
    />
  </button>
);

interface AutomationCardProps {
    title: string;
    description: string;
    enabled: boolean;
    onToggle: () => void;
    configValue: string;
    onConfigChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    configLabel: string;
    configPlaceholder: string;
}

const AutomationCard: React.FC<AutomationCardProps> = ({ title, description, enabled, onToggle, configValue, onConfigChange, configLabel, configPlaceholder }) => (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg flex flex-col">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            <ToggleSwitch enabled={enabled} onChange={onToggle} />
        </div>
        <p className="text-slate-400 mb-4 text-sm flex-grow">{description}</p>
        <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">{configLabel}</label>
            <input
                type="text"
                value={configValue}
                onChange={onConfigChange}
                placeholder={configPlaceholder}
                className="w-full bg-slate-700 p-3 rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 transition disabled:opacity-50"
                disabled={!enabled}
                aria-label={configLabel}
            />
        </div>
    </div>
);

interface Automation {
    sheet: { enabled: boolean; url: string };
    article: { enabled: boolean; recipient: string };
    kpi: { enabled: boolean; url: string };
}

interface AutomationProps {
    automations: Automation;
    setAutomations: React.Dispatch<React.SetStateAction<Automation>>;
    logs: string[];
    clearLogs: () => void;
}

const Automation: React.FC<AutomationProps> = ({ automations, setAutomations, logs, clearLogs }) => {

    const handleToggle = (key: keyof Automation) => {
        setAutomations(prev => ({
            ...prev,
            [key]: { ...prev[key], enabled: !prev[key].enabled }
        }));
    };

    const handleConfigChange = (key: keyof Automation, prop: 'url' | 'recipient', value: string) => {
        setAutomations(prev => ({
            ...prev,
            [key]: { ...prev[key], [prop]: value }
        }));
    };

    return (
        <div className="p-8 space-y-8 h-full">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Automation & Workflows</h1>
                    <p className="text-slate-400 mt-1">Connect services and automate repetitive tasks across the studio.</p>
                </div>
            </header>

            <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                <AutomationCard
                    title="Export Leads to Google Sheets"
                    description="Automatically add every new lead from the CRM to a Google Sheet."
                    enabled={automations.sheet.enabled}
                    onToggle={() => handleToggle('sheet')}
                    configValue={automations.sheet.url}
                    onConfigChange={(e) => handleConfigChange('sheet', 'url', e.target.value)}
                    configLabel="Google Sheet URL"
                    configPlaceholder="Enter Google Sheet URL"
                />
                <AutomationCard
                    title="Send Articles to Team"
                    description="Automatically send generated articles to a team member or channel."
                    enabled={automations.article.enabled}
                    onToggle={() => handleToggle('article')}
                    configValue={automations.article.recipient}
                    onConfigChange={(e) => handleConfigChange('article', 'recipient', e.target.value)}
                    configLabel="Recipient (Email or Channel)"
                    configPlaceholder="e.g., team-content@example.com"
                />
                <AutomationCard
                    title="Post KPIs to Slack"
                    description="Post the KPI analysis summary to a Slack channel via webhook."
                    enabled={automations.kpi.enabled}
                    onToggle={() => handleToggle('kpi')}
                    configValue={automations.kpi.url}
                    onConfigChange={(e) => handleConfigChange('kpi', 'url', e.target.value)}
                    configLabel="Slack Webhook URL"
                    configPlaceholder="Enter Slack Webhook URL"
                />
            </div>

            <div className="bg-slate-800/50 p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white">Automation Log</h2>
                    <button 
                        onClick={clearLogs}
                        className="text-sm bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-2 px-4 rounded-md transition disabled:opacity-50"
                        disabled={logs.length === 0}
                    >
                        Clear Log
                    </button>
                </div>
                <div className="bg-slate-900 rounded-md p-4 h-64 overflow-y-auto font-mono text-sm text-slate-400 space-y-2">
                    {logs.length > 0 ? [...logs].reverse().map((log, index) => (
                        <p key={index}><span className="text-slate-500 mr-2">{new Date().toLocaleTimeString()}</span>{log}</p>
                    )) : <p>No automation events have occurred yet. Enable a workflow and perform an action (e.g., add a lead).</p>}
                </div>
            </div>

        </div>
    );
};

export default Automation;
