import React, { useState, useEffect } from 'react';
import { ViewState, Church, FeedPost, Transaction } from './types';
import { BottomNav } from './components/BottomNav';
import { MapView } from './components/MapView';
import { ChurchDialog } from './components/ChurchDialog';
import { SettingsMenu } from './components/SettingsMenu';
import { ReligionDialog } from './components/ReligionDialog';
import { ReportAppDialog } from './components/ReportAppDialog';
import { InstitutionLogin } from './components/InstitutionLogin';
import { InstitutionDashboard } from './components/InstitutionDashboard';
import { Heart, Share2, Copy, ArrowLeft, Download, FileText, Server, HandHeart } from 'lucide-react';

// Mock Data
const MOCK_CHURCHES: Church[] = [
  {
    id: '1',
    name: 'Catedral da Sé',
    address: 'Praça da Sé, s/n - Sé, São Paulo - SP',
    lat: -23.550520,
    lng: -46.633308,
    image: 'https://picsum.photos/800/600?random=1',
    massTimes: ['Dom: 09:00, 11:00, 17:00', 'Seg-Sex: 12:00, 15:00'],
    description: 'A Catedral Metropolitana de São Paulo é um dos maiores templos neogóticos do mundo.',
    phone: '(11) 3107-6832'
  },
  {
    id: '2',
    name: 'Paróquia Nossa Senhora do Brasil',
    address: 'Praça Nossa Sra. do Brasil, 01 - Jardim América',
    lat: -23.5678,
    lng: -46.6698,
    image: 'https://picsum.photos/800/600?random=2',
    massTimes: ['Dom: 08:30, 10:00, 12:00', 'Sáb: 16:00'],
    description: 'Conhecida por sua beleza artística e cerimônias de casamento tradicionais.',
    phone: '(11) 3082-9786'
  },
  {
    id: '3',
    name: 'Igreja de São Bento',
    address: 'Largo de São Bento, s/n - Centro',
    lat: -23.5453,
    lng: -46.6342,
    image: 'https://picsum.photos/800/600?random=3',
    massTimes: ['Dom: 10:00 (Canto Gregoriano)', 'Diariamente: 07:00'],
    description: 'Histórico mosteiro beneditino com missas acompanhadas de canto gregoriano.',
    phone: '(11) 3328-8799'
  }
];

const MOCK_FEED: FeedPost[] = [
  {
    id: '1',
    author: 'Pascom Catedral',
    content: 'Hoje teremos adoração ao Santíssimo Sacramento às 19h. Todos estão convidados para este momento de profunda oração.',
    image: 'https://picsum.photos/800/400?random=10',
    date: '2 horas atrás'
  },
  {
    id: '2',
    author: 'Grupo de Jovens',
    content: 'O retiro de carnaval está chegando! As inscrições encerram nesta sexta-feira. Não deixe para a última hora.',
    date: '5 horas atrás'
  },
  {
    id: '3',
    author: 'Festa da Padroeira',
    image: 'https://picsum.photos/800/400?random=11',
    date: '1 dia atrás'
  }
];

// Dados Mockados de Transações
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    type: 'APP_EXPENSE',
    title: 'Servidores Google Cloud',
    amount: 150.00,
    date: '15/05/2024',
    receiptUrl: '#'
  },
  {
    id: '2',
    type: 'CHARITY_DONATION',
    title: 'Doação - Lar dos Velhinhos',
    amount: 500.00,
    date: '20/05/2024',
    receiptUrl: '#'
  },
  {
    id: '3',
    type: 'APP_EXPENSE',
    title: 'Manutenção de API',
    amount: 45.90,
    date: '22/05/2024',
    receiptUrl: '#'
  },
  {
    id: '4',
    type: 'CHARITY_DONATION',
    title: 'Doação - Casa do Menor',
    amount: 320.00,
    date: '25/05/2024',
    receiptUrl: '#'
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.MAP);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isReligionDialogOpen, setIsReligionDialogOpen] = useState(false);
  const [isReportAppDialogOpen, setIsReportAppDialogOpen] = useState(false);
  const [selectedChurch, setSelectedChurch] = useState<Church | null>(null);
  const [feed, setFeed] = useState<FeedPost[]>(MOCK_FEED);
  const [transactions] = useState<Transaction[]>(MOCK_TRANSACTIONS); 

  // Initialize religion from local storage or default to 'Católica'
  const [religion, setReligion] = useState<string>(() => {
    return localStorage.getItem('ecclesia_religion') || 'Católica';
  });

  // Save religion to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('ecclesia_religion', religion);
  }, [religion]);

  const handleViewChange = (newView: ViewState) => {
    if (newView === ViewState.SETTINGS) {
      setIsSettingsOpen(!isSettingsOpen);
    } else {
      setView(newView);
      setIsSettingsOpen(false); // Close settings if navigating elsewhere
    }
  };

  const renderContent = () => {
    switch (view) {
      case ViewState.MAP:
        return (
          <MapView 
            churches={MOCK_CHURCHES} 
            onSelectChurch={setSelectedChurch} 
            currentReligion={religion}
          />
        );
      
      case ViewState.FEED:
        return (
          <div className="w-full h-full overflow-y-auto bg-slate-50 pb-24 pt-4 px-4 md:px-0">
            <div className="max-w-md mx-auto space-y-4">
              <h1 className="text-2xl font-bold text-slate-800 px-2">Feed da Comunidade</h1>
              {feed.map(post => (
                <div key={post.id} className={`bg-white p-0 rounded-2xl shadow-sm border overflow-hidden ${post.isAiGenerated ? 'border-purple-200 bg-purple-50' : 'border-slate-100'}`}>
                  
                  {/* Header do Post */}
                  <div className="flex items-center justify-between p-4 pb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm ${post.isAiGenerated ? 'bg-gradient-to-br from-purple-500 to-indigo-600' : 'bg-gradient-to-br from-blue-500 to-blue-600'}`}>
                        {post.author[0]}
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${post.isAiGenerated ? 'text-purple-800' : 'text-slate-900'}`}>{post.author}</p>
                        <p className="text-xs text-slate-500 font-medium">{post.date}</p>
                      </div>
                    </div>
                  </div>

                  {/* Imagem do Post (se houver) */}
                  {post.image && (
                    <div className="w-full">
                      <img 
                        src={post.image} 
                        alt="Post content" 
                        className="w-full h-auto object-cover max-h-96"
                      />
                    </div>
                  )}

                  {/* Conteúdo de Texto (se houver) */}
                  {post.content && (
                    <div className={`px-5 py-3 ${post.image ? 'pt-3' : 'pt-0'}`}>
                      <p className="text-slate-700 leading-relaxed text-sm md:text-base">
                        {post.content}
                      </p>
                    </div>
                  )}
                  
                  {/* Footer Ações */}
                  <div className="flex items-center justify-end px-4 py-3 border-t border-slate-100/60 bg-slate-50/50">
                    <button className="flex items-center space-x-2 text-slate-500 hover:text-blue-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50 active:scale-95">
                      <Share2 size={18} strokeWidth={2.5} />
                      <span className="text-xs font-bold uppercase tracking-wide">Compartilhar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case ViewState.DONATE:
        return (
          <div className="w-full h-full overflow-y-auto bg-slate-50 pb-32 pt-6 px-4">
            <div className="max-w-sm mx-auto bg-white rounded-3xl p-6 shadow-xl text-center border border-slate-100">
              
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                <Heart size={28} fill="currentColor" />
              </div>
              
              <h2 className="text-xl font-bold text-slate-800 mb-2">Apoie Nossa Missão</h2>
              
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-6 text-left">
                 <p className="text-sm text-slate-600 leading-relaxed">
                   As doações são essenciais para manter o aplicativo funcionando. 
                   <span className="block mt-2 font-medium text-slate-800">
                     Todo valor excedente aos custos será doado integralmente para instituições de caridade cadastradas.
                   </span>
                 </p>
              </div>

              {/* QR Code Container */}
              <div className="flex flex-col items-center mb-6">
                <div className="bg-white p-2 rounded-xl border-2 border-slate-100 shadow-sm mb-3">
                   {/* Generating a static QR code for visual representation */}
                   <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-4266141740005204000053039865802BR5913Ecclesia App6008Sao Paulo62070503***6304E2CA" 
                    alt="QR Code Pix" 
                    className="w-40 h-40 opacity-90 mix-blend-multiply"
                   />
                </div>
                <p className="text-xs text-slate-400 font-mono bg-slate-100 px-3 py-1 rounded-full">
                  Chave: pix@ecclesia.app
                </p>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 active:scale-95">
                  <Copy size={18} />
                  <span>Copiar Código Pix</span>
                </button>

                <button 
                  onClick={() => setView(ViewState.TRANSACTIONS)}
                  className="w-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center space-x-2"
                >
                  <FileText size={18} />
                  <span>Ver Prestação de Contas</span>
                </button>
              </div>
            </div>
          </div>
        );

      case ViewState.TRANSACTIONS:
        return (
          <div className="w-full h-full flex flex-col bg-slate-50">
            {/* Header */}
            <div className="bg-white px-4 py-4 shadow-sm border-b border-slate-100 flex items-center space-x-4 sticky top-0 z-10">
              <button 
                onClick={() => setView(ViewState.DONATE)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <h2 className="text-lg font-bold text-slate-800">Movimentações</h2>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 pb-32">
              <div className="max-w-md mx-auto space-y-4">
                
                {transactions.length === 0 ? (
                  /* Empty State */
                  <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
                    <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                      <FileText size={40} className="text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">Nenhuma movimentação ainda</h3>
                    <p className="text-sm text-slate-500 max-w-xs">
                      Assim que houverem gastos com o app ou doações para caridade, os comprovantes aparecerão aqui com total transparência.
                    </p>
                  </div>
                ) : (
                  /* Transaction List */
                  transactions.map((t) => (
                    <div 
                      key={t.id} 
                      className={`relative flex items-center justify-between p-4 rounded-xl border shadow-sm transition-all
                        ${t.type === 'APP_EXPENSE' ? 'bg-red-50 border-red-100' : 'bg-blue-50 border-blue-100'}
                      `}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-full shrink-0
                          ${t.type === 'APP_EXPENSE' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}
                        `}>
                          {t.type === 'APP_EXPENSE' ? <Server size={20} /> : <HandHeart size={20} />}
                        </div>
                        <div>
                          <p className={`font-bold text-sm ${t.type === 'APP_EXPENSE' ? 'text-red-900' : 'text-blue-900'}`}>
                            {t.title}
                          </p>
                          <p className={`text-xs ${t.type === 'APP_EXPENSE' ? 'text-red-600' : 'text-blue-600'}`}>
                            {t.date}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-1">
                        <span className={`font-bold ${t.type === 'APP_EXPENSE' ? 'text-red-700' : 'text-blue-700'}`}>
                          R$ {t.amount.toFixed(2)}
                        </span>
                        <button className={`flex items-center space-x-1 text-xs underline
                           ${t.type === 'APP_EXPENSE' ? 'text-red-500 hover:text-red-700' : 'text-blue-500 hover:text-blue-700'}
                        `}>
                          <Download size={12} />
                          <span>Comprovante</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}

              </div>
            </div>
          </div>
        );

      case ViewState.INSTITUTION_LOGIN:
        return (
          <InstitutionLogin 
            onLoginSuccess={() => setView(ViewState.INSTITUTION_DASHBOARD)}
            onBack={() => setView(ViewState.MAP)}
          />
        );

      case ViewState.INSTITUTION_DASHBOARD:
        return (
          <InstitutionDashboard 
            onBack={() => setView(ViewState.MAP)}
          />
        );
      
      default:
        return null;
    }
  };

  // Determine if BottomNav should be shown
  const shouldShowBottomNav = ![
    ViewState.INSTITUTION_LOGIN,
    ViewState.INSTITUTION_DASHBOARD
  ].includes(view);

  // Determine which active item to show in nav when in sub-pages of user flow
  const getNavActiveItem = () => {
    if (view === ViewState.TRANSACTIONS) return ViewState.DONATE;
    return view;
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden relative font-sans">
      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden">
        {renderContent()}
      </main>

      {/* Settings Popper Menu */}
      <SettingsMenu 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        onOpenReligion={() => setIsReligionDialogOpen(true)}
        onOpenInstitutionArea={() => setView(ViewState.INSTITUTION_LOGIN)}
        onOpenReportApp={() => setIsReportAppDialogOpen(true)}
      />

      {/* Religion Selection Dialog */}
      <ReligionDialog 
        isOpen={isReligionDialogOpen}
        currentReligion={religion}
        onSelect={setReligion}
        onClose={() => setIsReligionDialogOpen(false)}
      />
      
      {/* Report App Problem Dialog */}
      <ReportAppDialog 
        isOpen={isReportAppDialogOpen}
        onClose={() => setIsReportAppDialogOpen(false)}
      />

      {/* Responsive Bottom Nav */}
      {shouldShowBottomNav && (
        <div className={view === ViewState.TRANSACTIONS ? 'hidden md:block' : ''}>
          <BottomNav 
            currentView={getNavActiveItem()} 
            isSettingsOpen={isSettingsOpen}
            onChangeView={handleViewChange} 
          />
        </div>
      )}

      {/* Global Dialogs */}
      <ChurchDialog 
        church={selectedChurch} 
        onClose={() => setSelectedChurch(null)} 
      />
    </div>
  );
};

export default App;