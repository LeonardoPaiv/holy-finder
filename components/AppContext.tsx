'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

import { User, Company } from '@/types';

interface UserLocation {
    lat: number;
    lng: number;
}

interface AppContextType {
    religion: string;
    setReligion: (religion: string) => void;
    userLocation: UserLocation | null;
    setUserLocation: (location: UserLocation) => void;
    companies: Company[];
    setCompanies: (companies: Company[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [religion, setReligion] = useState<string>('Católica');
    const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
    const [companies, setCompanies] = useState<Company[]>([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedReligion = localStorage.getItem('ecclesia_religion');
            if (storedReligion) setReligion(storedReligion);

            const storedLocation = localStorage.getItem('ecclesia_user_location');
            if (storedLocation) {
                try {
                    setUserLocation(JSON.parse(storedLocation));
                } catch (e) {
                    console.error("Failed to parse stored location", e);
                }
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('ecclesia_religion', religion);
    }, [religion]);

    useEffect(() => {
        if (userLocation) {
            localStorage.setItem('ecclesia_user_location', JSON.stringify(userLocation));
        }
    }, [userLocation]);

    return (
        <AppContext.Provider value={{ 
            religion, 
            setReligion, 
            userLocation, 
            setUserLocation,
            companies,
            setCompanies,
        }}>
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
