import { Post } from '@/types';
import FeedPostCard from './FeedPostCard';

interface FeedPostListProps {
  posts: (Post & {
    cnpj?: {
      _id: string;
      name: string;
    };
  })[];
  isLoading: boolean;
  isError: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  onRetry: () => void;
}

export default function FeedPostList({
  posts,
  isLoading,
  isError,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  onRetry,
}: FeedPostListProps) {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Carregando posts...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Erro ao carregar posts</p>
        <button
          onClick={onRetry}
          className="mt-4 text-blue-600 hover:underline"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
        <p className="text-slate-600">Nenhum post encontrado</p>
        <p className="text-sm text-slate-500 mt-1">
          Tente ajustar sua localização ou filtros
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <FeedPostCard key={post._id} post={post} />
      ))}

      {/* Load More */}
      {hasNextPage && (
        <div className="text-center py-6">
          <button
            onClick={onLoadMore}
            disabled={isFetchingNextPage}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            {isFetchingNextPage ? 'Carregando...' : 'Carregar Mais'}
          </button>
        </div>
      )}
    </div>
  );
}
