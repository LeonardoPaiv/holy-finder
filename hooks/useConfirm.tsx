import React, { useState } from 'react';
import toast, { Toast } from 'react-hot-toast';

interface ConfirmToastProps {
  t: Toast;
  message: string;
  onConfirm: () => Promise<void>;
}

const ConfirmToast: React.FC<ConfirmToastProps> = ({ t, message, onConfirm }) => {
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
    <div
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-sm w-full bg-white shadow-xl rounded-xl pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden`}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-900">
              Confirmação
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {message}
            </p>
          </div>
        </div>
      </div>
      <div className="flex border-t border-slate-100 bg-slate-50/50">
        <button
          onClick={() => toast.dismiss(t.id)}
          disabled={isLoading}
          className="w-full border-r border-slate-100 p-3 flex items-center justify-center text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancelar
        </button>
        <button
          onClick={handleConfirm}
          disabled={isLoading}
          className="w-full p-3 flex items-center justify-center text-sm font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span>Processando...</span>
            </>
          ) : (
            'Confirmar'
          )}
        </button>
      </div>
    </div>
  );
};

export const useConfirm = () => {
  const confirm = (message: string, onConfirm: () => Promise<void>) => {
    toast.custom((t) => <ConfirmToast t={t} message={message} onConfirm={onConfirm} />, {
        duration: Infinity,
        position: 'top-center',
    });
  };

  return { confirm };
};
