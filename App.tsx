import React, { useState, useEffect } from 'react';
import { TabKey, Lead, Opportunity, HistoryItem, BlogPost } from './types';
import { TABS } from './constants';
import ResearchAndArticle from './components/ResearchAndArticle';
import LeadAndOpportunityTracker from './components/LeadAndOpportunityTracker';
import KpiDashboard from './components/KpiDashboard';
import CrmSummaryGenerator from './components/CrmSummaryGenerator';
import CampaignPlanner from './components/CampaignPlanner';
import EmailGenerator from './components/EmailGenerator';
import Automation from './components/Automation';
import ContactScraper from './components/ContactScraper';
import HistoryViewer from './components/HistoryViewer';
import BlogPostWizard from './components/BlogPostWizard';
import InternalBlog from './components/InternalBlog';
import LandingPage from './components/LandingPage';

interface AutomationState {
  sheet: { enabled: boolean; url: string };
  article: { enabled: boolean; recipient: string };
  kpi: { enabled: boolean; url: string };
}

const App: React.FC = () => {
  const [showApp, setShowApp] = useState(false); // State to control view
  const [activeTab, setActiveTab] = useState<TabKey>(TabKey.RESEARCH_ARTICLE);
  const [leads, setLeads] = useState<Lead[]>([
    { id: '1', name: 'John Doe', email: 'john.d@example.com', stage: 'Contacted' },
    { id: '2', name: 'Jane Smith', email: 'jane.s@example.com', stage: 'Qualified' },
    { id: '3', name: 'Peter Jones', email: 'peter.j@example.com', stage: 'New' },
    { id: '4', name: 'Sam Wilson', email: 'sam.w@example.com', stage: 'Lost' },
  ]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([
      { id: 'o1', leadId: '2', leadName: 'Jane Smith', amount: 5000, stage: 'Won', probability: 100 },
      { id: 'o2', leadId: '1', leadName: 'John Doe', amount: 12000, stage: 'Proposal', probability: 60 },
      { id: 'o3', leadId: '2', leadName: 'Jane Smith', amount: 2500, stage: 'Lost', probability: 0 },
  ]);
  
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    // Load blog posts from local storage on startup
    const savedPosts = localStorage.getItem('internalBlogPosts');
    if (savedPosts) {
      try {
        setBlogPosts(JSON.parse(savedPosts));
      } catch (e) {
        console.error("Failed to parse blog posts from localStorage", e);
      }
    }
  }, []);

  useEffect(() => {
    // Save blog posts to local storage whenever they change
    localStorage.setItem('internalBlogPosts', JSON.stringify(blogPosts));
  }, [blogPosts]);
  
  const addToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: `hist-${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
    };
    setHistory(prev => [newItem, ...prev]);
  };

  const handlePublishInternal = (postData: Omit<BlogPost, 'id' | 'timestamp'>): string => {
      const newPost: BlogPost = {
          ...postData,
          id: `post-${Date.now()}`,
          timestamp: new Date().toISOString(),
      };
      setBlogPosts(prev => [newPost, ...prev]);
      return newPost.id;
  };

  const [automations, setAutomations] = useState<AutomationState>({
    sheet: { enabled: true, url: 'https://docs.google.com/spreadsheets/d/example123' },
    article: { enabled: true, recipient: 'team-content@example.com' },
    kpi: { enabled: true, url: 'https://hooks.slack.com/services/T0000/B0000/XXXXXXXX' }
  });
  const [automationLogs, setAutomationLogs] = useState<string[]>([]);
  
  const addLog = (message: string) => {
    setAutomationLogs(prev => [...prev, message]);
  }

  const handleLeadAdded = (lead: Lead) => {
    if (automations.sheet.enabled) {
      addLog(`[SHEETS] New lead '${lead.name}' sent to ${automations.sheet.url}`);
    }
  };

  const handleArticleGenerated = (data: { topic: string, article: string }) => {
    if (automations.article.enabled) {
      addLog(`[TEAM] Article on '${data.topic}' sent to ${automations.article.recipient}`);
    }
  };

  const handleKpiAnalyzed = (analysis: string) => {
    if (automations.kpi.enabled && analysis) {
       addLog(`[SLACK] KPI summary posted to webhook.`);
    }
  };
  
  const handleEnterApp = (tab?: TabKey) => {
    if (tab) {
        setActiveTab(tab);
    }
    setShowApp(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case TabKey.RESEARCH_ARTICLE:
        return <ResearchAndArticle onArticleGenerated={handleArticleGenerated} addToHistory={addToHistory} />;
      case TabKey.BLOG_WIZARD:
        return <BlogPostWizard addToHistory={addToHistory} onPublishInternal={handlePublishInternal} />;
      case TabKey.INTERNAL_BLOG:
        return <InternalBlog posts={blogPosts} />;
      case TabKey.CONTACT_SCRAPER:
        return <ContactScraper />;
      case TabKey.CRM:
        return <LeadAndOpportunityTracker leads={leads} setLeads={setLeads} opportunities={opportunities} setOpportunities={setOpportunities} onLeadAdded={handleLeadAdded} />;
      case TabKey.KPI_DASHBOARD:
        return <KpiDashboard leads={leads} opportunities={opportunities} onKpiAnalyzed={handleKpiAnalyzed} addToHistory={addToHistory} />;
      case TabKey.CRM_SUMMARY:
        return <CrmSummaryGenerator addToHistory={addToHistory} />;
      case TabKey.CAMPAIGN_PLANNER:
        return <CampaignPlanner addToHistory={addToHistory} />;
      case TabKey.EMAIL_GENERATOR:
        return <EmailGenerator addToHistory={addToHistory} />;
       case TabKey.CONTENT_HISTORY:
        return <HistoryViewer history={history} />;
      case TabKey.AUTOMATION:
        return <Automation automations={automations} setAutomations={setAutomations} logs={automationLogs} clearLogs={() => setAutomationLogs([])} />;
      default:
        return <div className="p-8">Select a module from the left.</div>;
    }
  };
  
  if (!showApp) {
      return <LandingPage onEnter={handleEnterApp} />;
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans">
      <aside className="w-64 bg-slate-900/70 p-4 border-r border-slate-800/50 flex flex-col">
        <button
          onClick={() => setShowApp(false)}
          className="flex items-center mb-8 w-full text-left transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-lg"
          aria-label="Go to homepage"
        >
          <div className="bg-violet-600 p-2 rounded-lg mr-3">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
             </svg>
          </div>
          <h1 className="text-xl font-bold">BrieflyAI</h1>
        </button>
        <nav className="flex flex-col space-y-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 ease-in-out text-left text-sm font-medium ${
                activeTab === tab.key
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/10'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;