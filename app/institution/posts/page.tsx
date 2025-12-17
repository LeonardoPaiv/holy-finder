'use client';

import { useState } from 'react';
import { ArrowLeft, Plus, List } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CreatePostTab from '@/components/posts/CreatePostTab';
import PostsFeedTab from '@/components/posts/PostsFeedTab';

export default function PostsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'feed' | 'create'>('feed');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 shadow-sm border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.push('/institution/dashboard')}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-slate-800">Postagens da Instituição</h1>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <div className="flex space-x-2 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex items-center space-x-2 px-4 py-3 font-medium transition-colors relative ${
              activeTab === 'feed'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <List size={20} />
            <span>Posts</span>
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`flex items-center space-x-2 px-4 py-3 font-medium transition-colors relative ${
              activeTab === 'create'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <Plus size={20} />
            <span>Novo Post</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-6 pb-8">
          {activeTab === 'feed' ? <PostsFeedTab /> : <CreatePostTab />}
        </div>
      </div>
    </div>
  );
}
