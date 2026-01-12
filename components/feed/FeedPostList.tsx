import { Post } from '@/types';
import FeedPostCard from './FeedPostCard';
import GoogleAdUnit from './GoogleAdUnit';
import { useGoogleAds } from '@/hooks/useGoogleAds';
import { featureFlags } from '@/lib/featureFlags';

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
  // Load Google Ads script
  const { isLoaded: isAdsLoaded } = useGoogleAds();

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

  // Render posts with ads intercalated every 5 items (after every 4 posts)
  const renderPostsWithAds = (): JSX.Element[] => {
    const items: JSX.Element[] = [];
    
    posts.forEach((post, index) => {
      // Add the post
      items.push(<FeedPostCard key={post._id} post={post} />);
      
      // Add an ad after every 4 posts (at positions 4, 9, 14, etc.)
      // This means ads appear at indices 4, 9, 14, 19... (every 5th position)
      // Only show ads if the feature flag is enabled
      if (featureFlags.ads && isAdsLoaded && (index + 1) % 4 === 0 && index < posts.length - 1) {
        items.push(
          <GoogleAdUnit
            key={`ad-${index}`}
            adSlot={process.env.NEXT_PUBLIC_GOOGLE_AD_SLOT || ''}
            adFormat="auto"
            fullWidthResponsive={true}
          />
        );
      }
    });
    
    return items;
  };

  return (
    <div className="space-y-6">
      {renderPostsWithAds()}

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
