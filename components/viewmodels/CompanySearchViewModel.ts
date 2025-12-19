import { useState, useEffect, useRef } from 'react';
import { Company } from '../../types';
import { CompanyService } from '../../services/companyService';

interface UseCompanySearchViewModelProps {
    userLocation: { lat: number; lng: number } | null;
    mapCenter: { lat: number; lng: number } | undefined;
    onSelectCompany?: (company: Company) => void;
}

export const useCompanySearchViewModel = ({
    userLocation,
    mapCenter,
    onSelectCompany
}: UseCompanySearchViewModelProps) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Company[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length >= 2) {
                setIsSearching(true);
                // Use user location or map center for proximity search
                const lat = userLocation?.lat || mapCenter?.lat || -15.7975;
                const lng = userLocation?.lng || mapCenter?.lng || -47.8919;

                try {
                    const companies = await CompanyService.searchCompanies(query, lat, lng);
                    setResults(companies);
                    setShowResults(true);
                } catch (error) {
                    console.error("Error searching companies", error);
                    setResults([]);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setResults([]);
                setShowResults(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query, userLocation, mapCenter]);

    // Close results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectResult = async (company: Company) => {
        setQuery('');
        setShowResults(false);
        
        try {
            // Fetch full company details
            const fullCompany = await CompanyService.getCompanyByCnpj(company._id);
            if (onSelectCompany && fullCompany) {
                onSelectCompany(fullCompany);
            } else if (onSelectCompany) {
                // Fallback to the partial company if fetch fails (unlikely)
                onSelectCompany(company);
            }
        } catch (error) {
            console.error("Error fetching full company details", error);
            if (onSelectCompany) {
                onSelectCompany(company);
            }
        }
    };

    const clearSearch = () => {
        setQuery('');
        setResults([]);
        setShowResults(false);
    };

    return {
        query,
        setQuery,
        results,
        isSearching,
        showResults,
        setShowResults,
        searchRef,
        handleSelectResult,
        clearSearch
    };
};
