'use client';

import { useState } from 'react';
import { Plus, List } from 'lucide-react';
import CreatePostTab from '@/components/posts/CreatePostTab';
import PostsFeedTab from '@/components/posts/PostsFeedTab';
import { InstitutionPostProvider } from '@/components/contexts/InstitutionPostContext';
import { InstitutionPageLayout } from '@/components/institution/InstitutionPageLayout';

export default function PostsPage() {
  const [activeTab, setActiveTab] = useState<'feed' | 'create'>('feed');

  return (
    <InstitutionPostProvider>
      <InstitutionPageLayout title="Postagens da Instituição" showBackButton>
        <div className="p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Tabs */}
            <div className="flex space-x-2 border-b border-slate-200 mb-6">
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
            <div className="pb-8">
              {activeTab === 'feed' ? <PostsFeedTab /> : <CreatePostTab />}
            </div>
          </div>
        </div>
      </InstitutionPageLayout>
    </InstitutionPostProvider>
  );
}
