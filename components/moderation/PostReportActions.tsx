'use client';

import React from 'react';
import { RotateCcw } from 'lucide-react';
import { ReportStatus } from '@/types';

interface PostReportActionsProps {
  status: string;
  postReportId: string;
  postId?: string;
  postCreator?: {
    email: string;
    fullName: string;
  };
  onBanUser?: (user: { email: string; fullName: string }) => void;
  onSuspendPost?: (postId: string, postReportId: string) => void;
  onRejectReport?: (postReportId: string, postId: string) => void;
  onRevertToPending?: (postReportId: string, postId: string) => void;
}

export const PostReportActions: React.FC<PostReportActionsProps> = ({
  status,
  postReportId,
  postId,
  postCreator,
  onBanUser,
  onSuspendPost,
  onRejectReport,
  onRevertToPending,
}) => {
  const isPending = status === ReportStatus.PENDING;

  // Don't render if no actions are available
  if (!postCreator && !onRevertToPending) return null;

  return (
    <div className="flex gap-2 mt-2 flex-col md:flex-row">
      {isPending ? (
        <>
          {/* Pending Status Actions */}
          {onBanUser && postCreator && (
            <button
              onClick={() => onBanUser({
                email: postCreator.email,
                fullName: postCreator.fullName
              })}
              className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-semibold rounded-lg transition-colors"
              title="Banir usuário"
            >
              Banir usuário
            </button>
          )}
          {onSuspendPost && postId && (
            <button
              onClick={() => onSuspendPost(postId, postReportId)}
              className="px-3 py-1.5 bg-orange-100 hover:bg-orange-200 text-orange-700 text-xs font-semibold rounded-lg transition-colors"
              title="Suspender post"
            >
              Suspender
            </button>
          )}
          {onRejectReport && postId && (
            <button
              onClick={() => onRejectReport(postReportId, postId)}
              className="px-3 py-1.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 text-xs font-semibold rounded-lg transition-colors"
              title="Rejeitar denúncia"
            >
              Rejeitar
            </button>
          )}
        </>
      ) : (
        <>
          {/* Non-Pending Status Actions */}
          {onRevertToPending && postId && (
            <button
              onClick={() => onRevertToPending(postReportId, postId)}
              className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
              title="Voltar para pendente"
            >
              <RotateCcw size={14} />
              Voltar para Pendente
            </button>
          )}
        </>
      )}
    </div>
  );
};
