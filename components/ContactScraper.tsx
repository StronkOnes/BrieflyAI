
import React, { useState } from 'react';
import { scrapeContacts } from '../services/geminiService';
import { Contact } from '../types';

const Spinner = () => (
  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
);

const ContactScraper: React.FC = () => {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [error, setError] = useState('');

    const handleScrape = async () => {
        if (!query.trim()) {
            setError('Please enter a topic or keyword to search for.');
            return;
        }
        setIsLoading(true);
        setError('');
        setContacts([]);

        const result = await scrapeContacts(query);

        if (result.error) {
            setError(result.error);
        } else if (result.data) {
            setContacts(result.data);
        }

        setIsLoading(false);
    };

    const handleExport = () => {
        if (contacts.length === 0) return;

        const headers = ["Name", "Title", "Organization", "Contact Info", "Source URL"];
        const csvRows = [
            headers.join(','),
            ...contacts.map(c => [
                `"${c.name?.replace(/"/g, '""') || ''}"`,
                `"${c.title?.replace(/"/g, '""') || ''}"`,
                `"${c.organization?.replace(/"/g, '""') || ''}"`,
                `"${c.contactInfo?.replace(/"/g, '""') || ''}"`,
                `"${c.sourceUrl?.replace(/"/g, '""') || ''}"`
            ].join(','))
        ];

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'contacts.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="p-8 space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-white">AI Contact Scraper</h1>
                <p className="text-slate-400 mt-1">Find key contacts from grant databases, directories, and other web sources.</p>
            </header>

            <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="e.g., 'Educational tech grants for K-12'"
                        className="flex-grow bg-slate-700 text-white placeholder-slate-400 rounded-md px-4 py-3 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleScrape}
                        disabled={isLoading || !query.trim()}
                        className="flex justify-center items-center gap-2 bg-violet-600 text-white font-bold py-3 px-6 rounded-md hover:bg-violet-700 disabled:bg-violet-400/50 disabled:cursor-not-allowed transition duration-200"
                    >
                        {isLoading ? <><Spinner /> Scraping...</> : 'Scrape Contacts'}
                    </button>
                </div>
                {error && <p className="text-red-400 mt-4">{error}</p>}
            </div>

            <div className="bg-slate-800/50 p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white">Scraped Contacts</h2>
                    <button
                        onClick={handleExport}
                        disabled={contacts.length === 0 || isLoading}
                        className="bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-2 px-4 rounded-md transition disabled:opacity-50"
                    >
                        Export to CSV
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-400">
                        <thead className="text-xs text-slate-300 uppercase bg-slate-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Name</th>
                                <th scope="col" className="px-6 py-3">Title</th>
                                <th scope="col" className="px-6 py-3">Organization</th>
                                <th scope="col" className="px-6 py-3">Contact Info</th>
                                <th scope="col" className="px-6 py-3">Source</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={5} className="text-center p-8"><div className="flex justify-center items-center gap-2"><Spinner/>Searching for contacts...</div></td></tr>
                            ) : contacts.length > 0 ? (
                                contacts.map((contact, index) => (
                                    <tr key={index} className="bg-slate-800/80 border-b border-slate-700 hover:bg-slate-700/60">
                                        <td className="px-6 py-4 font-medium text-white">{contact.name}</td>
                                        <td className="px-6 py-4">{contact.title}</td>
                                        <td className="px-6 py-4">{contact.organization}</td>
                                        <td className="px-6 py-4">{contact.contactInfo}</td>
                                        <td className="px-6 py-4">
                                            <a href={contact.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300">
                                                Link
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={5} className="text-center p-8">No contacts found. Try a different query.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ContactScraper;
