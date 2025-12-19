import React from 'react';
import { Search, X, MapPin } from 'lucide-react';
import { Company } from '../../types';
import { useCompanySearchViewModel } from '../viewmodels/CompanySearchViewModel';

interface CompanySearchProps {
    userLocation: { lat: number; lng: number } | null;
    mapCenter?: { lat: number; lng: number };
    onSelectCompany?: (company: Company) => void;
}

export const CompanySearch: React.FC<CompanySearchProps> = ({
    userLocation,
    mapCenter,
    onSelectCompany
}) => {
    const {
        query,
        setQuery,
        results,
        isSearching,
        showResults,
        setShowResults,
        searchRef,
        handleSelectResult,
        clearSearch
    } = useCompanySearchViewModel({ userLocation, mapCenter, onSelectCompany });

    return (
        <div ref={searchRef} className="relative pointer-events-auto z-[1000]">
            <div className="bg-white rounded-xl shadow-lg p-3 flex items-center space-x-3 border border-slate-200">
                <Search className="text-slate-400" size={20} />
                <input
                    id="search-input"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => {
                        if (query.length >= 2) setShowResults(true);
                    }}
                    placeholder="Buscar paróquia ou bairro..."
                    className="flex-1 bg-transparent outline-none text-slate-900 placeholder:text-slate-500 font-medium"
                />
                {query && (
                    <button onClick={clearSearch} className="text-slate-400 hover:text-slate-600">
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* Search Results Dropdown */}
            {showResults && (results.length > 0 || isSearching) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden max-h-[300px] overflow-y-auto z-[1001]">
                    {isSearching ? (
                        <div className="p-4 text-center text-slate-500 text-sm">
                            Buscando...
                        </div>
                    ) : (
                        <ul>
                            {results.map((company) => (
                                <li key={company._id}>
                                    <button
                                        onClick={() => handleSelectResult(company)}
                                        className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-none transition-colors flex items-start gap-3"
                                    >
                                        <div className="mt-1 bg-blue-100 p-1.5 rounded-full">
                                            <MapPin size={14} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900 text-sm">{company.name}</p>
                                            <p className="text-xs text-slate-500 truncate">{company.address || 'Endereço não informado'}</p>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};
