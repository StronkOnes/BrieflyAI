
import React from 'react';
import { TabKey } from './types';

const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    {children}
  </svg>
);

const ResearchIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></IconWrapper>;
const CrmIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></IconWrapper>;
const KpiIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></IconWrapper>;
const SummaryIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></IconWrapper>;
const CampaignIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></IconWrapper>;
const EmailIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></IconWrapper>;
const AutomationIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></IconWrapper>;
const ScraperIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16.5a7.5 7.5 0 100-15 7.5 7.5 0 000 15zM21 21l-4.35-4.35M12 12a3 3 0 100-6 3 3 0 000 6z" /></IconWrapper>;
const HistoryIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></IconWrapper>;
const BlogIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></IconWrapper>;
const BlogPageIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3h9M7 16h6" /></IconWrapper>;


export const TABS = [
  { key: TabKey.RESEARCH_ARTICLE, name: 'Research & Articles', icon: <ResearchIcon /> },
  { key: TabKey.BLOG_WIZARD, name: 'Blog Post Wizard', icon: <BlogIcon /> },
  { key: TabKey.INTERNAL_BLOG, name: 'Internal Blog', icon: <BlogPageIcon /> },
  { key: TabKey.CONTACT_SCRAPER, name: 'Contact Scraper', icon: <ScraperIcon /> },
  { key: TabKey.CRM, name: 'CRM Funnels', icon: <CrmIcon /> },
  { key: TabKey.KPI_DASHBOARD, name: 'KPI Dashboard', icon: <KpiIcon /> },
  { key: TabKey.CRM_SUMMARY, name: 'CRM Summary', icon: <SummaryIcon /> },
  { key: TabKey.CAMPAIGN_PLANNER, name: 'Campaign Planner', icon: <CampaignIcon /> },
  { key: TabKey.EMAIL_GENERATOR, name: 'Email Generator', icon: <EmailIcon /> },
  { key: TabKey.CONTENT_HISTORY, name: 'Content History', icon: <HistoryIcon /> },
  { key: TabKey.AUTOMATION, name: 'Automation', icon: <AutomationIcon /> },
];
