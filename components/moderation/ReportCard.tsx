'use client';

import React from 'react';
import { Building2, User, Calendar, FileText, Copy, Eye } from 'lucide-react';
import { ReportStatus, ReportType } from '@/types';
import { ReportActions } from './ReportActions';
import toast from 'react-hot-toast';

interface ReportCardProps {
  report: any;
  onSolve?: (reportId: string) => void;
  onReject?: (reportId: string) => void;
  onRevert?: (reportId: string) => void;
  onViewInstitution?: (cnpj: string) => void;
  onViewUser?: (user: any) => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({
  report,
  onSolve,
  onReject,
  onRevert,
  onViewInstitution,
  onViewUser,
}) => {
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado!`);
  };

  const getStatusColor = (status: ReportStatus) => {
    switch (status) {
      case ReportStatus.PENDING:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case ReportStatus.SOLVED:
        return 'bg-green-100 text-green-800 border-green-200';
      case ReportStatus.REJECTED:
        return 'bg-slate-100 text-slate-800 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusLabel = (status: ReportStatus) => {
    switch (status) {
      case ReportStatus.PENDING:
        return 'Pendente';
      case ReportStatus.SOLVED:
        return 'Resolvido';
      case ReportStatus.REJECTED:
        return 'Rejeitado';
      default:
        return status;
    }
  };

  const getTypeLabel = (type: ReportType) => {
    switch (type) {
      case ReportType.INSTITUTION_PUBLIC_REPORT:
        return 'Denúncia Pública';
      case ReportType.INSTITUTION_INTERN_REPORT:
        return 'Denúncia Interna';
      case ReportType.APP_BUG:
        return 'Bug do App';
      default:
        return type;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            {/* Report Type with Copy Button */}
            <div className="flex items-center gap-2 text-sm">
              <FileText size={16} className="text-purple-600" />
              <span className="font-semibold text-slate-800">{getTypeLabel(report.type)}</span>
              <button
                onClick={() => handleCopy(report._id, 'ID do report')}
                className="p-1 hover:bg-slate-200 rounded transition-colors"
                title="Copiar ID do report"
              >
                <Copy size={14} className="text-slate-500" />
              </button>
            </div>

            {/* Company Info with Copy Button */}
            {report.cnpj && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Building2 size={16} className="text-blue-600" />
                <span>{report.cnpj.name || 'Instituição não encontrada'}</span>
                <button
                  onClick={() => handleCopy(report.cnpj.name, 'Nome da instituição')}
                  className="p-1 hover:bg-slate-200 rounded transition-colors"
                  title="Copiar nome da instituição"
                >
                  <Copy size={14} className="text-slate-500" />
                </button>
              </div>
            )}

            {/* User Info with Copy Button */}
            {report.userId && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <User size={16} className="text-green-500" />
                <span>{report.userId.fullName || 'Usuário não encontrado'}</span>
                <button
                  onClick={() => handleCopy(report.userId._id, 'ID do usuário')}
                  className="p-1 hover:bg-slate-200 rounded transition-colors"
                  title="Copiar ID do usuário"
                >
                  <Copy size={14} className="text-slate-500" />
                </button>
              </div>
            )}

            {/* Created Date */}
            {report.createdAt && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Calendar size={14} />
                <span>
                  {new Date(report.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Status Badge and Actions */}
          <div className="flex flex-col items-end gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                report.status
              )}`}
            >
              {getStatusLabel(report.status)}
            </span>

            {/* Action Buttons */}
            <ReportActions
              status={report.status}
              reportId={report._id}
              onSolve={onSolve}
              onReject={onReject}
              onRevert={onRevert}
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="p-4">
        <h4 className="text-sm font-semibold text-slate-800 mb-2">Descrição</h4>
        <p className="text-sm text-slate-700 whitespace-pre-wrap">{report.description}</p>
      </div>

      {/* Footer Actions */}
      <div className="px-4 pb-4 flex gap-2">
        {report.cnpj && onViewInstitution && (
          <button
            onClick={() => onViewInstitution(report.cnpj._id)}
            className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
          >
            <Eye size={16} />
            Ver Instituição
          </button>
        )}
        {report.userId && onViewUser && (
          <button
            onClick={() => onViewUser(report.userId)}
            className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
          >
            <Eye size={16} />
            Ver Usuário
          </button>
        )}
      </div>
    </div>
  );
};
