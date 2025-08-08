
import React, { useState } from 'react';
import { Lead, Opportunity } from '../types';

interface Props {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  opportunities: Opportunity[];
  setOpportunities: React.Dispatch<React.SetStateAction<Opportunity[]>>;
  onLeadAdded: (lead: Lead) => void;
}

const LeadAndOpportunityTracker: React.FC<Props> = ({ leads, setLeads, opportunities, setOpportunities, onLeadAdded }) => {
  const [newLead, setNewLead] = useState({ name: '', email: '', stage: 'New' as Lead['stage'] });
  const [newOpp, setNewOpp] = useState({ leadId: '', amount: '', probability: '' });
  
  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLead.name && newLead.email) {
      const leadToAdd: Lead = { ...newLead, id: `lead-${Date.now()}` };
      setLeads([...leads, leadToAdd]);
      onLeadAdded(leadToAdd); // Trigger automation
      setNewLead({ name: '', email: '', stage: 'New' });
    }
  };

  const handleAddOpp = (e: React.FormEvent) => {
    e.preventDefault();
    if (newOpp.leadId && newOpp.amount && newOpp.probability) {
      const selectedLead = leads.find(l => l.id === newOpp.leadId);
      if(selectedLead) {
          const oppToAdd: Opportunity = {
              id: `opp-${Date.now()}`,
              leadId: newOpp.leadId,
              leadName: selectedLead.name,
              amount: parseFloat(newOpp.amount),
              stage: 'Prospecting',
              probability: parseInt(newOpp.probability, 10),
          };
          setOpportunities([...opportunities, oppToAdd]);
          setNewOpp({ leadId: '', amount: '', probability: '' });
      }
    }
  };
  
  const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => <th className="p-3 text-left text-sm font-semibold text-slate-300 uppercase tracking-wider">{children}</th>;
  const TableCell: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => <td className={`p-3 text-slate-300 whitespace-nowrap ${className}`}>{children}</td>;

  return (
    <div className="p-8 space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white">CRM Funnels</h1>
        <p className="text-slate-400 mt-1">Manage your leads and sales opportunities.</p>
      </header>

      {/* Forms */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Add Lead Form */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Add New Lead</h2>
          <form onSubmit={handleAddLead} className="space-y-4">
            <input type="text" placeholder="Lead Name" value={newLead.name} onChange={e => setNewLead({...newLead, name: e.target.value})} className="w-full bg-slate-700 p-3 rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500" />
            <input type="email" placeholder="Lead Email" value={newLead.email} onChange={e => setNewLead({...newLead, email: e.target.value})} className="w-full bg-slate-700 p-3 rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500" />
            <select value={newLead.stage} onChange={e => setNewLead({...newLead, stage: e.target.value as Lead['stage']})} className="w-full bg-slate-700 p-3 rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500">
              <option>New</option>
              <option>Contacted</option>
              <option>Qualified</option>
              <option>Lost</option>
            </select>
            <button type="submit" className="w-full bg-violet-600 text-white font-bold py-3 px-4 rounded-md hover:bg-violet-700 transition">Add Lead</button>
          </form>
        </div>
        {/* Add Opportunity Form */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Add New Opportunity</h2>
          <form onSubmit={handleAddOpp} className="space-y-4">
            <select value={newOpp.leadId} onChange={e => setNewOpp({...newOpp, leadId: e.target.value})} className="w-full bg-slate-700 p-3 rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500">
              <option value="">Select a Lead</option>
              {leads.filter(l => l.stage !== 'Lost').map(lead => <option key={lead.id} value={lead.id}>{lead.name}</option>)}
            </select>
            <input type="number" placeholder="Deal Amount ($)" value={newOpp.amount} onChange={e => setNewOpp({...newOpp, amount: e.target.value})} className="w-full bg-slate-700 p-3 rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500" />
            <input type="number" placeholder="Probability (%)" value={newOpp.probability} onChange={e => setNewOpp({...newOpp, probability: e.target.value})} max="100" min="0" className="w-full bg-slate-700 p-3 rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500" />
            <button type="submit" className="w-full bg-violet-600 text-white font-bold py-3 px-4 rounded-md hover:bg-violet-700 transition">Add Opportunity</button>
          </form>
        </div>
      </div>

      {/* Tables */}
      <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Leads Table */}
        <div className="bg-slate-800/50 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Leads</h3>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-700/50"><tr><TableHeader>Name</TableHeader><TableHeader>Email</TableHeader><TableHeader>Stage</TableHeader></tr></thead>
                    <tbody className="divide-y divide-slate-700">
                        {leads.map(lead => <tr key={lead.id}><TableCell>{lead.name}</TableCell><TableCell>{lead.email}</TableCell><TableCell>{lead.stage}</TableCell></tr>)}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Opportunities Table */}
        <div className="bg-slate-800/50 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Opportunities</h3>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-700/50"><tr><TableHeader>Lead</TableHeader><TableHeader>Amount</TableHeader><TableHeader>Stage</TableHeader><TableHeader>Probability</TableHeader></tr></thead>
                    <tbody className="divide-y divide-slate-700">
                        {opportunities.map(opp => <tr key={opp.id}><TableCell>{opp.leadName}</TableCell><TableCell>${opp.amount.toLocaleString()}</TableCell><TableCell>{opp.stage}</TableCell><TableCell>{opp.probability}%</TableCell></tr>)}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LeadAndOpportunityTracker;
