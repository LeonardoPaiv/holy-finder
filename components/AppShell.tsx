'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { BottomNav } from '../components/BottomNav';
import { SettingsMenu } from '../components/SettingsMenu';
import { ReligionDialog } from '../components/ReligionDialog';
import { ReportAppDialog } from '../components/ReportAppDialog';
import { AppProvider, useApp } from './AppContext';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const AppShellContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const pathname = usePathname();
    const router = useRouter();
    const { religion, setReligion } = useApp();

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isReligionDialogOpen, setIsReligionDialogOpen] = useState(false);
    const [isReportAppDialogOpen, setIsReportAppDialogOpen] = useState(false);

    // Helper to toggle settings menu - passed to BottomNav
    const toggleSettings = () => {
        setIsSettingsOpen(!isSettingsOpen);
    };

    const shouldShowBottomNav = !pathname?.includes('/institution');

    return (
        <div className="h-screen w-screen flex flex-col overflow-hidden relative font-sans">
            <main className="flex-1 relative overflow-auto">
                {children}
            </main>
            <Toaster />

            {/* Settings Popper Menu */}
            <SettingsMenu
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                onOpenReligion={() => setIsReligionDialogOpen(true)}
                onOpenInstitutionArea={() => {
                    setIsSettingsOpen(false);
                    router.push('/institution/login');
                }}
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
                <div className={pathname === '/transactions' ? 'hidden md:block' : ''}>
                    <BottomNav
                        isSettingsOpen={isSettingsOpen}
                        onToggleSettings={toggleSettings}
                    />
                </div>
            )}
        </div>
    );
};

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <AppProvider>
                <AppShellContent>{children}</AppShellContent>
            </AppProvider>
        </QueryClientProvider>
    );
};
