'use client';

import { Post } from '@/types';
import Image from 'next/image';
import { Calendar, User, Share2, Trash2 } from 'lucide-react';
import { shareContent, getPostShareData } from '@/utils/shareUtils';
import { useInstitution } from '@/components/contexts/InstitutionContext';
import { PostService } from '@/services/postService';
import { useState } from 'react';
import { useConfirm } from '@/hooks/useConfirm';
import toast from 'react-hot-toast';

interface PostCardProps {
  post: Omit<Post, 'cnpj'> & {
    cnpj?: {
      _id: string;
      name: string;
    } | string;
    creator?: {
      _id: string;
      fullName: string;
    };
  };
  onDelete?: () => void;
}

export default function PostCard({ post, onDelete }: PostCardProps) {
  const { user } = useInstitution();
  const [isDeleting, setIsDeleting] = useState(false);
  const { confirm } = useConfirm();

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleShare = async () => {
    const institutionName = typeof post.cnpj === 'object' && post.cnpj !== null && 'name' in post.cnpj
      ? post.cnpj.name 
      : 'Instituição';
    const shareData = getPostShareData(post._id, institutionName, post.description);
    await shareContent(shareData);
  };

  const handleDelete = async () => {
    confirm(
      'Tem certeza que deseja deletar este post? Esta ação não pode ser desfeita.',
      async () => {
        setIsDeleting(true);
        try {
          await PostService.deletePost(post._id);
          if (onDelete) {
            onDelete();
          }
        } catch (error) {
          console.error('Error deleting post:', error);
          toast.error('Erro ao deletar post. Tente novamente.');
        } finally {
          setIsDeleting(false);
          toast.success('Post deletado com sucesso.');
        }
      }
    );
  };

  // Check if user can delete (institution admin or owner)
  const canDelete = user && (user.type === 'institution admin' || user.type === 'institution owner');

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User size={20} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-800">
                {post.creator?.fullName || 'Usuário'}
              </p>
              <div className="flex items-center space-x-1 text-xs text-slate-500">
                <Calendar size={12} />
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>
          </div>
          
          {/* Delete Button */}
          {canDelete && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Deletar post"
            >
              <Trash2 size={18} />
            </button>
          )}
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
      <div className="px-4 py-4">
        <p className="text-slate-800 whitespace-pre-wrap break-words">
          {post.description}
        </p>
      </div>

      {/* Footer Info */}
      <div className="px-4 py-3 border-t border-slate-100 bg-slate-50">
        <div className="flex items-center justify-between">
          <div className="flex flex-col text-xs text-slate-500">
            <span>Post ID: {post._id}</span>
            {post.creator && <span>Criador ID: {post.creator._id}</span>}
          </div>
          
          <button
            onClick={handleShare}
            className="flex items-center space-x-1 text-slate-600 hover:text-blue-600 transition-colors px-2 py-1"
          >
            <Share2 size={16} />
            <span className="text-xs font-medium">Compartilhar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
