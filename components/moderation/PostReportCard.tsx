import React from 'react';
import Image from 'next/image';
import { AlertTriangle, User, Building2, Calendar, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { usePostReportCardViewModel } from '../viewmodels/PostReportCardViewModel';

interface PostReportCardProps {
  postReport: any;
  onFilterByCompany?: (cnpj: string) => void;
  onFilterByUser?: (user: { _id: string; fullName: string; email: string }) => void;
  onBanUser?: (user: { email: string; fullName: string }) => void;
  onSuspendPost?: (postId: string, postReportId: string) => void;
  onRejectReport?: (postReportId: string, postId: string) => void;
}

export const PostReportCard: React.FC<PostReportCardProps> = ({ postReport, onFilterByCompany, onFilterByUser, onBanUser, onSuspendPost, onRejectReport }) => {
  const {
    visibleReports,
    hasMoreReports,
    remainingCount,
    showAllReports,
    showFullDescription,
    handleToggleReports,
    handleToggleDescription,
  } = usePostReportCardViewModel(postReport.reports || []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'SOLVED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pendente';
      case 'SOLVED':
        return 'Resolvido';
      case 'REJECTED':
        return 'Descartado';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            {/* Company Info */}
            <div className="flex items-center gap-2 text-sm">
              {onFilterByCompany && postReport.cnpj?._id ? (
                <button
                  onClick={() => onFilterByCompany(postReport.cnpj._id)}
                  className="flex items-center gap-2 hover:bg-slate-100 px-2 py-1 -mx-2 -my-1 rounded transition-colors group"
                  title="Filtrar por instituição"
                >
                  <Building2 size={16} className="text-blue-600 group-hover:text-blue-700" />
                  <span className="font-semibold text-slate-800 group-hover:text-blue-700">
                    {postReport.cnpj?.name || 'Instituição não encontrada'}
                  </span>
                  <Search size={14} className="text-blue-600 group-hover:text-blue-700" />
                </button>
              ) : (
                <>
                  <Building2 size={16} className="text-blue-600" />
                  <span className="font-semibold text-slate-800">
                    {postReport.cnpj?.name || 'Instituição não encontrada'}
                  </span>
                </>
              )}
            </div>

            {/* Creator Info */}
            <div className="flex items-center gap-2 text-sm text-slate-600">
              {onFilterByUser && postReport.postCreator?._id ? (
                <button
                  onClick={() => onFilterByUser({
                    _id: postReport.postCreator._id,
                    fullName: postReport.postCreator.fullName,
                    email: postReport.postCreator.email
                  })}
                  className="flex items-center gap-2 hover:bg-slate-100 px-2 py-1 -mx-2 -my-1 rounded transition-colors group"
                  title="Filtrar por usuário"
                >
                  <User size={16} className="text-green-500 group-hover:text-green-900" />
                  <span className="group-hover:text-slate-800">{postReport.postCreator?.fullName || 'Usuário não encontrado'}</span>
                  <Search size={14} className="text-green-500 group-hover:text-green-900" />
                </button>
              ) : (
                <>
                  <User size={16} className="text-slate-500" />
                  <span>{postReport.postCreator?.fullName || 'Usuário não encontrado'}</span>
                </>
              )}
            </div>

            {/* Post Date */}
            {postReport.post?.createdAt && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Calendar size={14} />
                <span>
                  {new Date(postReport.post.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Status Badge */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-1 text-orange-600">
              <AlertTriangle size={16} />
              <span className="text-sm font-semibold">{postReport.count} denúncias</span>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                postReport.status
              )}`}
            >
              {getStatusLabel(postReport.status)}
            </span>
            {/* Action Buttons */}
            {(onBanUser || onSuspendPost || onRejectReport) && postReport.postCreator && (
              <div className="flex gap-2 mt-2 flex-col md:flex-row">
                {onBanUser && (
                  <button
                    onClick={() => onBanUser({
                      email: postReport.postCreator.email,
                      fullName: postReport.postCreator.fullName
                    })}
                    className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-semibold rounded-lg transition-colors"
                    title="Banir usuário"
                  >
                    Banir
                  </button>
                )}
                {onSuspendPost && postReport.post?._id && (
                  <button
                    onClick={() => onSuspendPost(postReport.post._id, postReport._id)}
                    className="px-3 py-1.5 bg-orange-100 hover:bg-orange-200 text-orange-700 text-xs font-semibold rounded-lg transition-colors"
                    title="Suspender post"
                  >
                    Suspender
                  </button>
                )}
                {onRejectReport && postReport._id && postReport.post?._id && (
                  <button
                    onClick={() => onRejectReport(postReport._id, postReport.post._id)}
                    className="px-3 py-1.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 text-xs font-semibold rounded-lg transition-colors"
                    title="Rejeitar denúncia"
                  >
                    Rejeitar
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex gap-4">
          {/* Post Image */}
          {postReport.post?.photo && (
            <div className="relative w-24 h-24 md:w-[250px] md:h-[250px] flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
              <Image
                src={postReport.post.photo}
                alt="Post"
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Post Description */}
          <div className="flex-1">
            <p className={`text-sm text-slate-700 ${!showFullDescription ? 'line-clamp-3 md:line-clamp-none' : ''}`}>
              {postReport.post?.description || 'Sem descrição'}
            </p>
            {postReport.post?.description && postReport.post.description.length > 150 && (
              <button
                onClick={handleToggleDescription}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium md:hidden"
              >
                {showFullDescription ? 'Exibir menos' : 'Exibir mais'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reports Section */}
      <div className="p-4">
        <h4 className="text-sm font-semibold text-slate-800 mb-3">
          Comentários das Denúncias
        </h4>
        <div className="space-y-2">
          {visibleReports.map((report: string, index: number) => (
            <div
              key={index}
              className="p-3 bg-slate-50 rounded-lg border border-slate-200"
            >
              <p className="text-sm text-slate-700">{report}</p>
            </div>
          ))}
        </div>

        {/* Show More/Less Button */}
        {hasMoreReports && (
          <button
            onClick={handleToggleReports}
            className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            {showAllReports ? (
              <>
                <ChevronUp size={16} />
                Mostrar menos
              </>
            ) : (
              <>
                <ChevronDown size={16} />
                Mostrar mais {remainingCount} denúncia{remainingCount > 1 ? 's' : ''}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
