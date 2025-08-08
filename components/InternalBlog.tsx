
import React, { useState, useMemo } from 'react';
import { BlogPost } from '../types';

interface Props {
    posts: BlogPost[];
}

const InternalBlog: React.FC<Props> = ({ posts }) => {
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

    const sortedPosts = useMemo(() => {
        return [...posts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [posts]);

    if (selectedPost) {
        // Single Post View
        return (
            <div className="p-4 md:p-8 max-w-4xl mx-auto text-white">
                <button onClick={() => setSelectedPost(null)} className="text-violet-400 hover:text-violet-300 hover:underline mb-8 block transition-colors">&larr; Back to All Posts</button>
                <article>
                    <header className="mb-8">
                        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">{selectedPost.title}</h1>
                        <p className="text-slate-400 text-lg">
                            Published on {new Date(selectedPost.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </header>
                    {selectedPost.featuredImage && (
                        <img 
                          src={`data:image/jpeg;base64,${selectedPost.featuredImage}`} 
                          alt={selectedPost.title} 
                          className="w-full rounded-lg mb-8 shadow-lg aspect-video object-cover" 
                        />
                    )}
                    <div 
                        className="prose prose-invert lg:prose-xl max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: selectedPost.content.replace(/\n/g, '<br />') }}
                    >
                    </div>
                    <footer className="mt-12 pt-8 border-t border-slate-700 space-y-2">
                        {selectedPost.categories && <p className="text-slate-400"><strong className="text-slate-200">Categories:</strong> {selectedPost.categories}</p>}
                        {selectedPost.tags && <p className="text-slate-400"><strong className="text-slate-200">Tags:</strong> {selectedPost.tags}</p>}
                    </footer>
                </article>
            </div>
        );
    }

    // Blog List View
    return (
        <div className="p-8">
            <header className="mb-12">
                <h1 className="text-4xl font-bold text-white">Internal Blog</h1>
                <p className="text-slate-400 mt-2 text-lg">A collection of all posts created with the wizard.</p>
            </header>
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                {sortedPosts.length === 0 ? (
                    <div className="col-span-full text-center py-16">
                        <p className="text-slate-500 text-xl">No blog posts yet.</p>
                        <p className="text-slate-400">Create one using the "Blog Post Wizard" to see it here!</p>
                    </div>
                ) : (
                    sortedPosts.map(post => (
                        <div onClick={() => setSelectedPost(post)} key={post.id} className="group cursor-pointer block bg-slate-800/50 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-violet-500/20 hover:-translate-y-2">
                            <div className="aspect-video overflow-hidden">
                                {post.featuredImage ? (
                                    <img src={`data:image/jpeg;base64,${post.featuredImage}`} alt={post.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                                ) : (
                                    <div className="w-full h-full bg-slate-700 flex items-center justify-center text-slate-500">No Image</div>
                                )}
                            </div>
                            <div className="p-6">
                                <h2 className="text-2xl font-bold mb-2 text-white group-hover:text-violet-400 transition-colors">{post.title}</h2>
                                <p className="text-slate-400 line-clamp-3 leading-relaxed">{post.content.split('\n')[0]}</p>
                                <p className="text-xs text-slate-500 mt-4">{new Date(post.timestamp).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default InternalBlog;
