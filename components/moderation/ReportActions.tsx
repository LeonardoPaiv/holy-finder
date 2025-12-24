'use client';

import React from 'react';
import { Check, X, RotateCcw } from 'lucide-react';
import { ReportStatus } from '@/types';

interface ReportActionsProps {
  status: ReportStatus;
  reportId: string;
  onSolve?: (reportId: string) => void;
  onReject?: (reportId: string) => void;
  onRevert?: (reportId: string) => void;
}

export const ReportActions: React.FC<ReportActionsProps> = ({
  status,
  reportId,
  onSolve,
  onReject,
  onRevert,
}) => {
  const isPending = status === ReportStatus.PENDING;

  return (
    <div className="flex gap-2 mt-2 flex-col md:flex-row">
      {isPending ? (
        <>
          {/* Pending Status Actions */}
          {onSolve && (
            <button
              onClick={() => onSolve(reportId)}
              className="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
              title="Marcar como resolvido"
            >
              <Check size={14} />
              Resolver
            </button>
          )}
          {onReject && (
            <button
              onClick={() => onReject(reportId)}
              className="px-3 py-1.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
              title="Rejeitar report"
            >
              <X size={14} />
              Rejeitar
            </button>
          )}
        </>
      ) : (
        <>
          {/* Non-Pending Status Actions */}
          {onRevert && (
            <button
              onClick={() => onRevert(reportId)}
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
