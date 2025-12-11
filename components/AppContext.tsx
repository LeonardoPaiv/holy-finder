'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AppContextType {
    religion: string;
    setReligion: (religion: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [religion, setReligion] = useState<string>('Católica');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('ecclesia_religion');
            if (stored) setReligion(stored);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('ecclesia_religion', religion);
    }, [religion]);

    return (
        <AppContext.Provider value={{ religion, setReligion }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
