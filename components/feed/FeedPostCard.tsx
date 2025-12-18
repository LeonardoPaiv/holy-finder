import { Post } from '@/types';
import Image from 'next/image';
import { Calendar, MapPin, Share2 } from 'lucide-react';
import { useFeedPostCardViewModel } from '@/components/viewmodels/FeedPostCardViewModel';

interface FeedPostCardProps {
  post: Post & {
    cnpj?: {
      _id: string;
      name: string;
    };
  };
}

export default function FeedPostCard({ post }: FeedPostCardProps) {
  const { formatDate, handleShare } = useFeedPostCardViewModel(post);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <MapPin size={20} className="text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-slate-800">
              {post.cnpj?.name || 'Instituição'}
            </p>
            <div className="flex items-center space-x-1 text-xs text-slate-500">
              <Calendar size={12} />
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Image */}
      <div className="relative w-full md:max-w-[600px] md:mx-auto aspect-square bg-slate-100">
        <Image
          src={post.photo}
          alt="Post"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 600px"
        />
      </div>

      {/* Description */}
      <div className="px-4 py-4 border-t border-slate-200">
        <p className="text-slate-800 whitespace-pre-wrap break-words">
          {post.description}
        </p>
      </div>

      {/* Footer with Share Button */}
      <div className="px-4 py-3 border-t border-slate-100 bg-slate-50">
        <button
          onClick={handleShare}
          className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors"
        >
          <Share2 size={18} />
          <span className="text-sm font-medium">Compartilhar</span>
        </button>
      </div>
    </div>
  );
}
