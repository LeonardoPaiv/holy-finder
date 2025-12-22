import { AlertCircle } from 'lucide-react';

interface PostNotFoundProps {
  onClearFilters: () => void;
}

export const PostNotFound: React.FC<PostNotFoundProps> = ({ onClearFilters }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-lg border border-slate-200">
      <div className="p-4 bg-orange-100 rounded-full mb-4">
        <AlertCircle size={48} className="text-orange-600" />
      </div>
      
      <h3 className="text-xl font-bold text-slate-800 mb-2">
        Post não encontrado
      </h3>
      
      <p className="text-slate-600 text-center mb-6 max-w-md">
        O post que você está procurando não existe ou foi removido. 
        Ele pode ter sido suspenso ou a instituição pode estar inativa.
      </p>
      
      <button
        onClick={onClearFilters}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
      >
        Limpar Filtros e Ver Feed
      </button>
    </div>
  );
};
