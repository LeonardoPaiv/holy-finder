'use client';

import React, { useState, useEffect } from 'react';
import { Share2 } from 'lucide-react';
import { FeedService } from '../../services/feedService';
import { FeedPost } from '../../types';

export default function FeedPage() {
    const [feed, setFeed] = useState<FeedPost[]>([]);

    useEffect(() => {
        const loadData = async () => {
            const data = await FeedService.getFeed();
            setFeed(data);
        };
        loadData();
    }, []);

    return (
        <div className="w-full h-full overflow-y-auto bg-slate-50 pb-24 pt-4 px-4 md:px-0">
            <div className="max-w-md mx-auto space-y-4">
                <h1 className="text-2xl font-bold text-slate-800 px-2">Feed da Comunidade</h1>
                {feed.map(post => (
                    <div key={post.id} className={`bg-white p-0 rounded-2xl shadow-sm border overflow-hidden ${post.isAiGenerated ? 'border-purple-200 bg-purple-50' : 'border-slate-100'}`}>

                        {/* Header do Post */}
                        <div className="flex items-center justify-between p-4 pb-3">
                            <div className="flex items-center space-x-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm ${post.isAiGenerated ? 'bg-gradient-to-br from-purple-500 to-indigo-600' : 'bg-gradient-to-br from-blue-500 to-blue-600'}`}>
                                    {post.author[0]}
                                </div>
                                <div>
                                    <p className={`text-sm font-bold ${post.isAiGenerated ? 'text-purple-800' : 'text-slate-900'}`}>{post.author}</p>
                                    <p className="text-xs text-slate-500 font-medium">{post.date}</p>
                                </div>
                            </div>
                        </div>

                        {/* Imagem do Post (se houver) */}
                        {post.image && (
                            <div className="w-full">
                                <img
                                    src={post.image}
                                    alt="Post content"
                                    className="w-full h-auto object-cover max-h-96"
                                />
                            </div>
                        )}

                        {/* Conteúdo de Texto (se houver) */}
                        {post.content && (
                            <div className={`px-5 py-3 ${post.image ? 'pt-3' : 'pt-0'}`}>
                                <p className="text-slate-700 leading-relaxed text-sm md:text-base">
                                    {post.content}
                                </p>
                            </div>
                        )}

                        {/* Footer Ações */}
                        <div className="flex items-center justify-end px-4 py-3 border-t border-slate-100/60 bg-slate-50/50">
                            <button className="flex items-center space-x-2 text-slate-500 hover:text-blue-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50 active:scale-95">
                                <Share2 size={18} strokeWidth={2.5} />
                                <span className="text-xs font-bold uppercase tracking-wide">Compartilhar</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
