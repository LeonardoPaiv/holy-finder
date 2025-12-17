import React, { useState } from 'react';
import toast, { Toast } from 'react-hot-toast';

interface FindNearestToastProps {
  t: Toast;
  onConfirm: () => Promise<void>;
}

const FindNearestToast: React.FC<FindNearestToastProps> = ({ t, onConfirm }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      toast.dismiss(t.id);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">
              Nenhuma instituição encontrada nesta área
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Deseja buscar a instituição mais próxima da sua localização atual?
            </p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200">
        <button
          onClick={handleConfirm}
          disabled={isLoading}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <span>Buscando...</span>
            </>
          ) : (
            'Buscar Próxima'
          )}
        </button>
      </div>
    </div>
  );
};

export const useFindNearest = () => {
  const showFindNearestToast = (onConfirm: () => Promise<void>) => {
    toast.custom((t) => <FindNearestToast t={t} onConfirm={onConfirm} />, {
      duration: 5000,
      position: 'top-center',
    });
  };

  return { showFindNearestToast };
};
