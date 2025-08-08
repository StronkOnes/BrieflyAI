
import React, { useState, useEffect, useCallback } from 'react';
import { HistoryItem, TabKey, BlogPost } from '../types';
import { completeArticle, generateFeaturedImage } from '../services/geminiService';

const Spinner = () => <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>;

const WIZARD_DRAFT_KEY = 'blogWizardDraft';

interface WizardState {
    step: number;
    title: string;
    content: string;
    imagePrompt: string;
    featuredImage: string; // base64 string
    tags: string;
    categories: string;
    platform: 'internal' | 'wordpress';
    wpConfig: {
        apiUrl: string;
        user: string;
        appPass: string;
    };
    isPublishing: boolean;
    error: string | null;
    publishResult: { success: boolean; url?: string; message: string } | null;
}

const initialState: WizardState = {
    step: 1,
    title: '',
    content: '',
    imagePrompt: '',
    featuredImage: '',
    tags: '',
    categories: '',
    platform: 'internal',
    wpConfig: { apiUrl: '', user: '', appPass: '' },
    isPublishing: false,
    error: null,
    publishResult: null,
};

interface WizardProps {
    addToHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
    onPublishInternal: (post: Omit<BlogPost, 'id' | 'timestamp'>) => string;
}

const WizardStepper: React.FC<{ currentStep: number }> = ({ currentStep }) => {
    const steps = ['Content', 'Media', 'Details', 'Publish', 'Share'];
    return (
        <div className="w-full mb-8">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isActive = stepNumber === currentStep;
                    const isCompleted = stepNumber < currentStep;
                    return (
                        <React.Fragment key={step}>
                            <div className="flex flex-col items-center text-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isCompleted ? 'bg-violet-600 text-white' : isActive ? 'bg-violet-500 text-white border-2 border-violet-300' : 'bg-slate-700 text-slate-400'}`}>
                                    {isCompleted ? '✓' : stepNumber}
                                </div>
                                <p className={`mt-2 text-sm w-20 ${isActive || isCompleted ? 'text-white font-semibold' : 'text-slate-400'}`}>{step}</p>
                            </div>
                            {index < steps.length - 1 && <div className={`flex-1 h-1 mx-2 ${isCompleted ? 'bg-violet-600' : 'bg-slate-700'}`}></div>}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

const BlogPostWizard: React.FC<WizardProps> = ({ addToHistory, onPublishInternal }) => {
    const [state, setState] = useState<WizardState>(initialState);
    const [loadingAi, setLoadingAi] = useState<'content' | 'image' | null>(null);

    useEffect(() => {
        const savedDraft = localStorage.getItem(WIZARD_DRAFT_KEY);
        if (savedDraft) {
            try {
                const draftState = JSON.parse(savedDraft);
                if (!draftState.publishResult) {
                    if(window.confirm("We found an unsaved draft. Would you like to restore it?")) {
                        setState(draftState);
                    } else {
                        localStorage.removeItem(WIZARD_DRAFT_KEY);
                    }
                }
            } catch {
                localStorage.removeItem(WIZARD_DRAFT_KEY);
            }
        }
    }, []);

    useEffect(() => {
        if (!state.publishResult) {
            localStorage.setItem(WIZARD_DRAFT_KEY, JSON.stringify(state));
        } else {
            localStorage.removeItem(WIZARD_DRAFT_KEY);
        }
    }, [state]);

    const updateState = (updates: Partial<WizardState>) => setState(prev => ({ ...prev, ...updates }));

    const handleNext = () => updateState({ step: state.step + 1, error: null });
    const handleBack = () => updateState({ step: state.step - 1, error: null });

    const handleCompleteArticle = async () => {
        if (!state.content.trim()) {
            updateState({ error: 'Please write some content first to give the AI a starting point.' });
            return;
        }
        setLoadingAi('content');
        updateState({ error: null });
        const result = await completeArticle(state.content, state.title || 'the given topic');
        if (result.startsWith('Error:')) {
            updateState({ error: result });
        } else {
            updateState({ content: state.content + '\n\n' + result });
        }
        setLoadingAi(null);
    };

    const handleGenerateImage = async () => {
        const prompt = state.imagePrompt || state.title;
        if (!prompt) {
            updateState({ error: 'Please provide a title or an image prompt.' });
            return;
        }
        setLoadingAi('image');
        updateState({ error: null });
        const result = await generateFeaturedImage(prompt);
        if (result.error) {
            updateState({ error: result.error });
        } else if (result.base64Image) {
            updateState({ featuredImage: result.base64Image });
        }
        setLoadingAi(null);
    };
    
    const handlePublish = async () => {
        updateState({ isPublishing: true, error: null, publishResult: null });
        
        if (state.platform === 'internal') {
            onPublishInternal({
                title: state.title,
                content: state.content,
                featuredImage: state.featuredImage,
                tags: state.tags,
                categories: state.categories,
            });
             const result = {
                success: true,
                message: "Successfully published to internal page!",
            };
             updateState({ isPublishing: false, publishResult: result, step: 5 });
             addToHistory({ type: TabKey.BLOG_WIZARD, topic: `Published: ${state.title}`, content: state.content });
        } else { // Simulate WordPress
            setTimeout(() => {
                const result = {
                    success: true,
                    url: `${state.wpConfig.apiUrl.replace(/\/$/, '')}/?p=${Math.floor(Math.random() * 1000)}`, // fake url
                    message: "Successfully published to WordPress! (DEMO)",
                };
                updateState({ isPublishing: false, publishResult: result, step: 5 });
                addToHistory({ type: TabKey.BLOG_WIZARD, topic: `Published to WP: ${state.title}`, content: state.content });
            }, 2000);
        }
    };

    const handleReset = () => {
        setState(initialState);
    };
    
    const copyAsMarkdown = useCallback(() => {
        const markdown = `# ${state.title}\n\n${state.featuredImage ? `![Featured Image](data:image/jpeg;base64,${state.featuredImage})` : ''}\n\n${state.content}`;
        navigator.clipboard.writeText(markdown).then(() => {
            alert('Copied as Markdown!');
        });
    }, [state.title, state.featuredImage, state.content]);

    return (
        <div className="p-8 h-full flex flex-col space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-white">Blog Post Wizard</h1>
                <p className="text-slate-400 mt-1">Create and publish a complete blog post in just a few steps.</p>
            </header>
            
            <WizardStepper currentStep={state.step} />

            <div className="bg-slate-800/50 p-6 rounded-lg shadow-md flex-grow flex flex-col">
                {state.error && <div className="bg-red-900/50 border border-red-700 text-red-300 p-3 rounded-lg mb-4">{state.error}</div>}

                {/* Step 1: Content */}
                {state.step === 1 && (
                    <div className="flex flex-col h-full">
                        <h2 className="text-2xl font-semibold mb-4">Step 1: Write your Content</h2>
                        <input type="text" value={state.title} onChange={e => updateState({ title: e.target.value, imagePrompt: e.target.value })} placeholder="Blog Post Title" className="w-full bg-slate-700 p-3 rounded-md border border-slate-600 mb-4 focus:outline-none focus:ring-2 focus:ring-violet-500" />
                        <textarea value={state.content} onChange={e => updateState({ content: e.target.value })} placeholder="Start writing your article here, or paste it in. Then, let the AI complete it for you." className="flex-grow w-full bg-slate-700 p-3 rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"></textarea>
                        <div className="mt-4 flex justify-between items-center">
                            <button onClick={handleCompleteArticle} disabled={!state.content.trim() || loadingAi === 'content'} className="flex items-center gap-2 bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-md transition disabled:opacity-50">
                                {loadingAi === 'content' ? <><Spinner /> Completing...</> : 'Complete with AI'}
                            </button>
                            <button onClick={handleNext} disabled={!state.title || !state.content} className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded-md transition disabled:opacity-50">Next &rarr;</button>
                        </div>
                    </div>
                )}
                
                {/* Step 2: Media */}
                {state.step === 2 && (
                    <div className="flex flex-col h-full">
                        <h2 className="text-2xl font-semibold mb-4">Step 2: Generate Media</h2>
                        <div className="flex items-start gap-2 mb-4">
                            <input type="text" value={state.imagePrompt} onChange={e => updateState({ imagePrompt: e.target.value })} placeholder="Describe the image you want" className="flex-grow bg-slate-700 p-3 rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500"/>
                            <button onClick={handleGenerateImage} disabled={!state.imagePrompt || loadingAi === 'image'} className="flex items-center gap-2 bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-4 rounded-md transition disabled:opacity-50">
                                {loadingAi === 'image' ? <><Spinner /> Generating...</> : 'Generate Image'}
                            </button>
                        </div>
                        <div className="flex-grow bg-slate-900 rounded-md flex items-center justify-center">
                            {state.featuredImage ? (
                                <img src={`data:image/jpeg;base64,${state.featuredImage}`} alt="Generated featured" className="max-h-full max-w-full object-contain rounded-md"/>
                            ) : (
                                <p className="text-slate-500">Image will appear here</p>
                            )}
                        </div>
                         <div className="mt-4 flex justify-between items-center">
                            <button onClick={handleBack} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-md transition">&larr; Back</button>
                            <button onClick={handleNext} className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded-md transition">Next &rarr;</button>
                        </div>
                    </div>
                )}

                {/* Step 3: Details */}
                 {state.step === 3 && (
                    <div className="flex flex-col h-full">
                        <h2 className="text-2xl font-semibold mb-4">Step 3: Details & Publishing Platform</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Tags (comma-separated)</label>
                                <input type="text" value={state.tags} onChange={e => updateState({ tags: e.target.value })} placeholder="e.g., tech, ai, business" className="w-full bg-slate-700 p-3 rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Categories (comma-separated)</label>
                                <input type="text" value={state.categories} onChange={e => updateState({ categories: e.target.value })} placeholder="e.g., Announcements, Product Updates" className="w-full bg-slate-700 p-3 rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500"/>
                            </div>
                        </div>
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-3">Publishing Platform</h3>
                             <div className="flex space-x-4">
                                <button onClick={() => updateState({ platform: 'internal' })} className={`py-2 px-4 rounded-md font-semibold ${state.platform === 'internal' ? 'bg-violet-600' : 'bg-slate-700'}`}>Internal Page</button>
                                <button onClick={() => updateState({ platform: 'wordpress' })} className={`py-2 px-4 rounded-md font-semibold ${state.platform === 'wordpress' ? 'bg-violet-600' : 'bg-slate-700'}`}>WordPress</button>
                            </div>
                        </div>
                        {state.platform === 'wordpress' && (
                            <div className="mt-4 p-4 bg-slate-900/50 rounded-lg space-y-4 border border-slate-700">
                                <h4 className="font-semibold text-slate-200">WordPress Configuration (Demo)</h4>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">WordPress Site URL</label>
                                    <input type="text" value={state.wpConfig.apiUrl} onChange={e => updateState({ wpConfig: {...state.wpConfig, apiUrl: e.target.value }})} placeholder="https://yourblog.com" className="w-full bg-slate-700 p-2 rounded-md border border-slate-600"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Username</label>
                                    <input type="text" value={state.wpConfig.user} onChange={e => updateState({ wpConfig: {...state.wpConfig, user: e.target.value }})} placeholder="WordPress Username" className="w-full bg-slate-700 p-2 rounded-md border border-slate-600"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Application Password</label>
                                    <input type="password" value={state.wpConfig.appPass} onChange={e => updateState({ wpConfig: {...state.wpConfig, appPass: e.target.value }})} placeholder="Create this in your WP User Profile" className="w-full bg-slate-700 p-2 rounded-md border border-slate-600"/>
                                </div>
                            </div>
                        )}
                         <div className="mt-auto pt-4 flex justify-between items-center">
                            <button onClick={handleBack} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-md transition">&larr; Back</button>
                            <button onClick={handleNext} className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded-md transition">Next &rarr;</button>
                        </div>
                    </div>
                 )}

                {/* Step 4: Publish */}
                {state.step === 4 && (
                     <div className="flex flex-col h-full">
                        <h2 className="text-2xl font-semibold mb-4">Step 4: Preview & Publish</h2>
                        <div className="flex-grow overflow-y-auto bg-slate-900 p-4 rounded-lg border border-slate-700">
                            <h3 className="text-3xl font-bold mb-4">{state.title}</h3>
                            {state.featuredImage && <img src={`data:image/jpeg;base64,${state.featuredImage}`} alt="Preview" className="w-full h-auto rounded-md mb-4 max-h-80 object-cover"/>}
                            <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap">{state.content}</div>
                        </div>
                         <div className="mt-4 flex justify-between items-center">
                            <button onClick={handleBack} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-md transition">&larr; Back</button>
                             <div className="flex items-center gap-4">
                                <button onClick={copyAsMarkdown} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-md transition">Copy as Markdown</button>
                                <button onClick={handlePublish} disabled={state.isPublishing} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition flex items-center gap-2 disabled:opacity-50">
                                    {state.isPublishing ? <><Spinner/> Publishing...</> : 'Publish Now'}
                                </button>
                             </div>
                        </div>
                    </div>
                )}
                
                {/* Step 5: Share */}
                {state.step === 5 && state.publishResult && (
                     <div className="text-center flex flex-col justify-center items-center h-full">
                         <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${state.publishResult.success ? 'bg-green-500' : 'bg-red-500'}`}>
                           <span className="text-4xl text-white">{state.publishResult.success ? '✓' : '✗'}</span>
                         </div>
                        <h2 className="text-3xl font-bold mb-2">{state.publishResult.message}</h2>
                        
                        {state.platform === 'internal' ? (
                            <p className="text-slate-400 mt-4">You can find your new post in the "Internal Blog" tab.</p>
                        ) : (
                            <>
                                {state.publishResult.url && (
                                    <div className="my-4">
                                        <p className="text-slate-400">View your post here:</p>
                                        <a href={state.publishResult.url} target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline break-all">{state.publishResult.url}</a>
                                    </div>
                                )}
                                <div className="flex space-x-4 mt-4">
                                     <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(state.publishResult.url || '')}&text=${encodeURIComponent(state.title)}`} target="_blank" rel="noopener noreferrer" className="bg-[#1DA1F2] text-white font-bold py-2 px-4 rounded-md">Share on Twitter</a>
                                     <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(state.publishResult.url || '')}`} target="_blank" rel="noopener noreferrer" className="bg-[#0A66C2] text-white font-bold py-2 px-4 rounded-md">Share on LinkedIn</a>
                                </div>
                            </>
                        )}
                        
                        <button onClick={handleReset} className="mt-8 bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-6 rounded-md transition">Create Another Post</button>
                    </div>
                )}


            </div>
        </div>
    );
};

export default BlogPostWizard;
