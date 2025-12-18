'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

import { User, Company } from '@/types';

interface UserLocation {
    lat: number;
    lng: number;
}

interface FeedFilters {
    cnpj?: string;
    postId?: string;
}

interface AppContextType {
    religion: string;
    setReligion: (religion: string) => void;
    userLocation: UserLocation | null;
    setUserLocation: (location: UserLocation) => void;
    companies: Company[];
    setCompanies: (companies: Company[]) => void;
    feedFilters: FeedFilters;
    setFeedFilters: (filters: FeedFilters) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Lazy initialization: load from localStorage before first render
    const [religion, setReligion] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            const storedReligion = localStorage.getItem('ecclesia_religion');
            return storedReligion || 'Católica';
        }
        return 'Católica';
    });

    const [userLocation, setUserLocation] = useState<UserLocation | null>(() => {
        if (typeof window !== 'undefined') {
            const storedLocation = localStorage.getItem('ecclesia_user_location');
            if (storedLocation) {
                try {
                    return JSON.parse(storedLocation);
                } catch (e) {
                    console.error("Failed to parse stored location", e);
                    return null;
                }
            }
        }
        return null;
    });

    const [companies, setCompanies] = useState<Company[]>([]);
    const [feedFilters, setFeedFilters] = useState<FeedFilters>({});

    // Save religion to localStorage when it changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('ecclesia_religion', religion);
        }
    }, [religion]);

    // Save location to localStorage when it changes
    useEffect(() => {
        if (typeof window !== 'undefined' && userLocation) {
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
            feedFilters,
            setFeedFilters,
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
