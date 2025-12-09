import React from 'react';
import { Map, LayoutList, Heart, Settings } from 'lucide-react';
import { ViewState } from '../types';

interface BottomNavProps {
  currentView: ViewState;
  isSettingsOpen: boolean;
  onChangeView: (view: ViewState) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, isSettingsOpen, onChangeView }) => {
  
  const navItems = [
    { id: ViewState.MAP, icon: Map, label: 'Mapa' },
    { id: ViewState.FEED, icon: LayoutList, label: 'Feed' },
    { id: ViewState.DONATE, icon: Heart, label: 'Doar' },
    { id: ViewState.SETTINGS, icon: Settings, label: 'Ajustes' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 md:border md:rounded-full md:bottom-6 md:w-[400px] md:left-1/2 md:-translate-x-1/2 md:shadow-2xl z-[40]">
      <div className="flex justify-around items-center h-16 md:h-14 px-2">
        {navItems.map((item) => {
          // Highlight if it is the current view OR if it's the settings button and the menu is open
          const isActive = (currentView === item.id && !isSettingsOpen) || (item.id === ViewState.SETTINGS && isSettingsOpen);
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-200
                ${isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}
              `}
            >
              <div className={`p-1.5 rounded-full transition-all ${isActive ? 'bg-blue-50 md:bg-blue-100' : 'bg-transparent'}`}>
                <Icon size={isActive ? 24 : 22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-[10px] font-medium md:hidden">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
