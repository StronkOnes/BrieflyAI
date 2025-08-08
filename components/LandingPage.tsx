
import React, { useState } from 'react';
import EtherealCanvas from './EtherealCanvas';
import { TabKey } from '../types';

interface LandingPageProps {
  onEnter: (tab?: TabKey) => void;
}

const ProductDetailCard: React.FC<{
  id: string;
  title: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  onSignUpClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  reverse?: boolean;
}> = ({ id, title, description, features, icon, onSignUpClick, reverse }) => (
  <div id={id} className={`flex flex-col md:flex-row items-center gap-8 md:gap-12 py-12 ${reverse ? 'md:flex-row-reverse' : ''}`}>
    <div className="md:w-1/2 flex justify-center p-8">
      <div className="w-48 h-48 bg-slate-800/50 border border-slate-700/50 rounded-full flex items-center justify-center text-violet-400">
        {icon}
      </div>
    </div>
    <div className="md:w-1/2 text-center md:text-left">
      <h3 className="text-3xl font-bold text-white mb-4">{title}</h3>
      <p className="text-slate-300 leading-relaxed mb-6">{description}</p>
      <ul className="space-y-3 mb-8 text-left">
        {features.map(feature => (
          <li key={feature} className="flex items-center gap-3">
            <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            <span className="text-slate-300">{feature}</span>
          </li>
        ))}
      </ul>
      <button onClick={onSignUpClick} className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-violet-600/20 transition-all transform hover:scale-105">
        Sign Up Now
      </button>
    </div>
  </div>
);


const TestimonialCard: React.FC<{ quote: string; name: string; title: string }> = ({ quote, name, title }) => (
    <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 h-full flex flex-col">
        <p className="text-slate-300 italic flex-grow">"{quote}"</p>
        <div className="mt-4">
            <p className="text-white font-semibold">{name}</p>
            <p className="text-violet-400 text-sm">{title}</p>
        </div>
    </div>
);

const PricingCard: React.FC<{ plan: string; price: string; description: string; features: string[]; popular?: boolean; }> = ({ plan, price, description, features, popular }) => (
    <div className={`relative bg-slate-800/50 p-8 rounded-lg border ${popular ? 'border-violet-500' : 'border-slate-700/50'}`}>
        {popular && <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">Most Popular</div>}
        <h3 className="text-2xl font-bold text-center text-white">{plan}</h3>
        <p className="text-4xl font-extrabold text-center my-4 text-white">{price}<span className="text-base font-normal text-slate-400">/mo</span></p>
        <p className="text-slate-400 text-center mb-6">{description}</p>
        <ul className="space-y-3 mb-8">
            {features.map(feature => (
                <li key={feature} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span className="text-slate-300">{feature}</span>
                </li>
            ))}
        </ul>
        <button className={`w-full font-bold py-3 px-6 rounded-lg transition-all ${popular ? 'bg-violet-600 hover:bg-violet-700 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'}`}>
            Get Started
        </button>
    </div>
);


const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const productLinks = [
    { id: 'product-script-writer', name: 'AI Script Writer & Teleprompter' },
    { id: 'product-blog-wizard', name: 'Blog Post Wizard' },
    { id: 'product-crm-automation', name: 'CRM & Automation' },
    { id: 'product-contact-scraper', name: 'AI Contact Scraper' },
  ];

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsMobileMenuOpen(false); // Close mobile menu on click
  };
  
  const scrollToPricing = (e: React.MouseEvent<HTMLButtonElement>) => {
    handleSmoothScroll(e, 'pricing');
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    // Simulate API call
    setTimeout(() => {
        setFormStatus('sent');
    }, 1500);
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen relative overflow-x-hidden">
      <div className="absolute top-0 left-0 w-full h-full">
        <EtherealCanvas />
      </div>
      
      <div id="home" className="relative z-10">
        <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <a href="#home" onClick={(e) => handleSmoothScroll(e, 'home')} className="flex items-center gap-3">
                            <div className="bg-violet-600 p-2 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold">BrieflyAI</h1>
                        </a>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center space-x-2">
                        <div 
                            className="relative"
                            onMouseEnter={() => setIsProductDropdownOpen(true)}
                            onMouseLeave={() => setIsProductDropdownOpen(false)}
                        >
                            <button
                                onClick={(e) => handleSmoothScroll(e, 'products')}
                                className="text-slate-300 hover:text-white transition-colors py-2 px-3 rounded-md flex items-center gap-1"
                            >
                                Products
                                <svg className={`w-4 h-4 transition-transform duration-200 ${isProductDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </button>
                            {isProductDropdownOpen && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-lg py-2 z-20">
                                    {productLinks.map(link => (
                                        <a 
                                            key={link.id}
                                            href={`#${link.id}`} 
                                            onClick={(e) => {
                                                handleSmoothScroll(e, link.id);
                                                setIsProductDropdownOpen(false);
                                            }} 
                                            className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white w-full text-left"
                                        >
                                            {link.name}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                        <a href="#pricing" onClick={(e) => handleSmoothScroll(e, 'pricing')} className="text-slate-300 hover:text-white transition-colors py-2 px-3 rounded-md">Pricing</a>
                        <a href="#about" onClick={(e) => handleSmoothScroll(e, 'about')} className="text-slate-300 hover:text-white transition-colors py-2 px-3 rounded-md">About</a>
                        <a href="#contact" onClick={(e) => handleSmoothScroll(e, 'contact')} className="text-slate-300 hover:text-white transition-colors py-2 px-3 rounded-md">Contact Us</a>
                    </nav>

                    {/* Right side buttons */}
                    <div className="hidden md:flex items-center">
                         <button onClick={() => onEnter()} className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2 px-5 rounded-lg transition-colors">
                            Sign In
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                           <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
             {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                         <div>
                            <button onClick={() => setIsMobileProductsOpen(!isMobileProductsOpen)} className="w-full flex justify-between items-center text-slate-300 hover:text-white transition-colors py-2 px-3 rounded-md text-left">
                                <span>Products</span>
                                <svg className={`w-5 h-5 transition-transform duration-200 ${isMobileProductsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </button>
                            {isMobileProductsOpen && (
                                <div className="pl-4 mt-1 space-y-1">
                                    {productLinks.map(link => (
                                        <a 
                                            key={link.id}
                                            href={`#${link.id}`} 
                                            onClick={(e) => handleSmoothScroll(e, link.id)} 
                                            className="block text-slate-400 hover:text-white transition-colors py-2 px-3 rounded-md"
                                        >
                                            {link.name}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                         <a href="#pricing" onClick={(e) => handleSmoothScroll(e, 'pricing')} className="block text-slate-300 hover:text-white transition-colors py-2 px-3 rounded-md">Pricing</a>
                        <a href="#about" onClick={(e) => handleSmoothScroll(e, 'about')} className="block text-slate-300 hover:text-white transition-colors py-2 px-3 rounded-md">About</a>
                        <a href="#contact" onClick={(e) => handleSmoothScroll(e, 'contact')} className="block text-slate-300 hover:text-white transition-colors py-2 px-3 rounded-md">Contact Us</a>
                        <button onClick={() => onEnter()} className="w-full text-left bg-violet-600 hover:bg-violet-700 text-white font-semibold mt-2 py-2 px-3 rounded-md transition-colors">
                            Sign In
                        </button>
                    </div>
                </div>
            )}
        </header>

        <main className="container mx-auto px-8 pt-20 pb-10 md:pt-32 md:pb-20 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-300 to-violet-500 mb-6">
                Your Complete Business Automation OS
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-300 mb-10">
                Briefly is your all-in-one AI assistant for research, content creation, lead tracking, and sales reporting. Automate your workflow and manage your funnel from start to finish.
            </p>
            <button onClick={() => onEnter(TabKey.RESEARCH_ARTICLE)} className="bg-violet-600 hover:bg-violet-700 text-white font-bold text-lg py-4 px-10 rounded-lg shadow-lg shadow-violet-600/20 transition-all transform hover:scale-105">
                Generate a Script Now
            </button>
        </main>
        
        <section id="products" className="py-20 bg-slate-950/60 backdrop-blur-lg">
          <div className="container mx-auto px-8">
            <h2 className="text-4xl font-bold text-center mb-4">Explore Our Powerful Tools</h2>
            <p className="text-slate-400 text-center max-w-2xl mx-auto mb-16">From a single idea to a full campaign, Briefly has the tools to bring your vision to life.</p>
            <div className="divide-y divide-slate-800">
                <ProductDetailCard 
                    id="product-script-writer"
                    title="AI Script Writer & Teleprompter"
                    description="Transform your ideas into polished scripts in moments. Whether for YouTube, a podcast, or a business presentation, our AI researches your topic and drafts compelling content. Then, deliver a flawless performance with our integrated, fully-customizable teleprompter."
                    features={[
                        "Generate articles, video scripts, and social posts.",
                        "AI-powered research using Google Search.",
                        "Integrated teleprompter with speed & font control.",
                        "Directly use your camera for recording."
                    ]}
                    icon={<svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>}
                    onSignUpClick={scrollToPricing}
                />
                 <ProductDetailCard 
                    id="product-blog-wizard"
                    title="Blog Post Wizard"
                    description="Go from a simple title to a fully-formatted, SEO-friendly blog post ready for publishing. Our step-by-step wizard guides you through content generation, AI-powered image creation, and adding metadata, taking the hassle out of content marketing."
                    features={[
                        "AI-assisted article completion.",
                        "Generate unique featured images from a text prompt.",
                        "Manage SEO tags and categories easily.",
                        "Publish directly to internal blog or other platforms."
                    ]}
                    icon={<svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>}
                    onSignUpClick={scrollToPricing}
                    reverse={true}
                />
                 <ProductDetailCard 
                    id="product-crm-automation"
                    title="CRM & Automation"
                    description="The engine for your business growth. Track leads through customizable sales funnels, generate insightful KPI reports with AI analysis, and automate repetitive tasks. Connect Briefly to your favorite tools like Slack and Google Sheets to create a seamless workflow."
                    features={[
                        "Manage leads and opportunities in a visual funnel.",
                        "AI-powered KPI dashboard and analysis.",
                        "Automate workflows between tools.",
                        "Generate email templates and campaign plans."
                    ]}
                    icon={<svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                    onSignUpClick={scrollToPricing}
                />
                 <ProductDetailCard 
                    id="product-contact-scraper"
                    title="AI Contact Scraper"
                    description="Stop spending hours on manual research. Simply describe who you're looking for, and our AI Scraper will search the web to find key contacts from directories, grant databases, and company websites. Export your results to CSV and start building relationships."
                    features={[
                        "Find contacts based on natural language queries.",
                        "Extracts names, titles, organizations, and contact info.",
                        "Provides source URLs for verification.",
                        "Export all data to a CSV file with one click."
                    ]}
                    icon={<svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16.5a7.5 7.5 0 100-15 7.5 7.5 0 000 15zM21 21l-4.35-4.35M12 12a3 3 0 100-6 3 3 0 000 6z" /></svg>}
                    onSignUpClick={scrollToPricing}
                    reverse={true}
                />
            </div>
          </div>
        </section>

        <section id="pricing" className="py-20">
            <div className="container mx-auto px-8">
                <h2 className="text-3xl font-bold text-center mb-4">Simple, Transparent Pricing</h2>
                <p className="text-slate-400 text-center max-w-2xl mx-auto mb-12">Choose the plan that's right for you. No hidden fees.</p>
                <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <PricingCard 
                        plan="Starter" 
                        price="$0"
                        description="For individuals and hobbyists starting out."
                        features={['Up to 5 Scripts/mo', 'Basic AI Tools', 'Teleprompter Access', 'Community Support']}
                    />
                    <PricingCard 
                        plan="Pro" 
                        price="$49"
                        description="For creators and professionals who need more power."
                        features={['Unlimited Scripts', 'Advanced AI Tools', 'Blog Post Wizard', 'CRM & Automation', 'Priority Support']}
                        popular={true}
                    />
                    <PricingCard 
                        plan="Business" 
                        price="$99"
                        description="For teams and agencies managing multiple projects."
                        features={['Everything in Pro', 'Team Collaboration', 'Advanced Analytics', 'Dedicated Account Manager']}
                    />
                </div>
            </div>
        </section>

        <section id="about" className="py-20 bg-slate-950/60 backdrop-blur-lg">
            <div className="container mx-auto px-8 max-w-4xl text-center">
                 <h2 className="text-3xl font-bold text-center mb-4">About BrieflyAI</h2>
                 <p className="text-slate-400 text-lg leading-relaxed">
                    We believe that great ideas deserve to be heard. In today's fast-paced digital world, content is king, but creating high-quality content consistently is a challenge. BrieflyAI was born from a desire to empower creators, marketers, and businesses by automating the tedious parts of content creation, so you can focus on what truly matters: your message. Our mission is to provide an intelligent, all-in-one platform that streamlines your workflow from initial idea to final publication, making it easier than ever to build your brand and grow your audience.
                 </p>
            </div>
        </section>

        <section id="testimonials" className="py-20">
            <div className="container mx-auto px-8">
                <h2 className="text-3xl font-bold text-center mb-12">Loved by creators and businesses</h2>
                <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
                    <TestimonialCard quote="BrieflyAI has completely transformed our content workflow. What used to take days now takes minutes." name="Alex Johnson" title="Content Lead, TechCorp" />
                    <TestimonialCard quote="The script writer and teleprompter combo is a game-changer for my YouTube channel." name="Maria Garcia" title="YouTube Creator" />
                    <TestimonialCard quote="We've automated our entire lead management process with Briefly. It's incredibly powerful and easy to use." name="David Chen" title="Founder, Startup Solutions" />
                </div>
            </div>
        </section>

        <section id="contact" className="py-20 bg-slate-950/60 backdrop-blur-lg">
            <div className="container mx-auto px-8 max-w-2xl">
                <h2 className="text-3xl font-bold text-center mb-4">Get In Touch</h2>
                <p className="text-slate-400 text-center mb-8">Have questions? We'd love to hear from you.</p>
                 {formStatus === 'sent' ? (
                    <div className="text-center bg-green-900/50 border border-green-700 text-green-300 p-6 rounded-lg">
                        <h3 className="text-2xl font-bold mb-2">Thank you!</h3>
                        <p>Your message has been sent. We'll get back to you shortly.</p>
                    </div>
                ) : (
                    <form className="space-y-6" onSubmit={handleContactSubmit}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                            <input type="text" id="name" name="name" required className="w-full bg-slate-800 p-3 rounded-md border border-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Your Name" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                            <input type="email" id="email" name="email" required className="w-full bg-slate-800 p-3 rounded-md border border-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="you@example.com" />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                            <textarea id="message" name="message" rows={4} required className="w-full bg-slate-800 p-3 rounded-md border border-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none" placeholder="How can we help?"></textarea>
                        </div>
                        <div>
                            <button type="submit" disabled={formStatus === 'sending'} className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-violet-600/20 transition-all disabled:opacity-50 disabled:cursor-wait">
                                {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </section>

        <footer className="border-t border-slate-800 mt-20">
            <div className="container mx-auto px-8 py-8 text-slate-400 text-sm">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p>&copy; {new Date().getFullYear()} BrieflyAI. All rights reserved.</p>
                    <div className="flex gap-4">
                        <a href="#privacy" onClick={(e) => handleSmoothScroll(e, 'home')} className="hover:text-white">Privacy Policy</a>
                        <a href="#terms" onClick={(e) => handleSmoothScroll(e, 'home')} className="hover:text-white">Terms of Service</a>
                        <a href="#contact" onClick={(e) => handleSmoothScroll(e, 'contact')} className="hover:text-white">Contact</a>
                    </div>
                </div>
            </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
