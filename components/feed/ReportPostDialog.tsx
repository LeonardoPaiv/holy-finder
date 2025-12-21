import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { useReportPostDialogViewModel } from '../viewmodels/ReportPostDialogViewModel';

interface ReportPostDialogProps {
  postId: string;
  onClose: () => void;
}

export const ReportPostDialog: React.FC<ReportPostDialogProps> = ({ postId, onClose }) => {
  const {
    comment,
    isSubmitting,
    handleCommentChange,
    handleSubmit,
    handleCancel,
  } = useReportPostDialogViewModel(postId, onClose);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-orange-600" size={24} />
            <h2 className="text-lg font-bold text-slate-900">Denunciar Post</h2>
          </div>
          <button
            onClick={handleCancel}
            disabled={isSubmitting}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X size={20} className="text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-sm text-slate-600 mb-4">
            Descreva o problema encontrado neste post. Sua denúncia será analisada pela equipe de moderação.
          </p>

          <div className="mb-4">
            <label htmlFor="comment" className="block text-sm font-medium text-slate-700 mb-2">
              Comentário <span className="text-red-500">*</span>
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => handleCommentChange(e.target.value)}
              disabled={isSubmitting}
              placeholder="Descreva o problema..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-slate-100 disabled:cursor-not-allowed resize-none"
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-slate-500 mt-1">
              {comment.length}/500 caracteres
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-slate-200">
          <button
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !comment.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Enviando...
              </>
            ) : (
              'Enviar Denúncia'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
