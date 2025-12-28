import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Map, LayoutList, Heart, Settings } from 'lucide-react';
import { ViewState } from '../types';

interface BottomNavProps {
  isSettingsOpen: boolean;
  onToggleSettings: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ isSettingsOpen, onToggleSettings }) => {
  const pathname = usePathname();
  const router = useRouter();

  // Determine current view based on pathname
  const getCurrentView = () => {
    if (pathname === '/') return ViewState.MAP;
    if (pathname === '/feed') return ViewState.FEED;
    if (pathname === '/donate' || pathname === '/transactions') return ViewState.DONATE;
    return ViewState.MAP;
  };

  const currentView = getCurrentView();

  const navItems = [
    { id: ViewState.MAP, icon: Map, label: 'Mapa', path: '/' },
    { id: ViewState.FEED, icon: LayoutList, label: 'Feed', path: '/feed' },
    { id: ViewState.DONATE, icon: Heart, label: 'Doar', path: '/donate' },
    { id: ViewState.SETTINGS, icon: Settings, label: 'Ajustes', action: onToggleSettings },
  ];

  const handleNavigation = (item: typeof navItems[0]) => {
    if (item.action) {
      item.action();
    } else if (item.path) {
      router.push(item.path);
    }
  };

  if (pathname === '/reset-password') {
    return null;
  }

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
              onClick={() => handleNavigation(item)}
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
