
export enum TabKey {
  RESEARCH_ARTICLE = 'RESEARCH_ARTICLE',
  BLOG_WIZARD = 'BLOG_WIZARD',
  INTERNAL_BLOG = 'INTERNAL_BLOG',
  CONTACT_SCRAPER = 'CONTACT_SCRAPER',
  CRM = 'CRM',
  KPI_DASHBOARD = 'KPI_DASHBOARD',
  CRM_SUMMARY = 'CRM_SUMMARY',
  CAMPAIGN_PLANNER = 'CAMPAIGN_PLANNER',
  EMAIL_GENERATOR = 'EMAIL_GENERATOR',
  CONTENT_HISTORY = 'CONTENT_HISTORY',
  AUTOMATION = 'AUTOMATION',
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  stage: 'New' | 'Contacted' | 'Qualified' | 'Lost';
}

export interface Opportunity {
  id: string;
  leadId: string;
  leadName: string;
  amount: number;
  stage: 'Prospecting' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
  probability: number;
}

export interface Contact {
  name: string;
  title: string;
  organization: string;
  contactInfo: string;
  sourceUrl: string;
}

export interface HistoryItem {
  id: string;
  type: TabKey;
  topic: string;
  content: string;
  timestamp: Date;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  featuredImage: string; // base64 string
  tags: string;
  categories: string;
  timestamp: string;
}
