import React from 'react';
import { Search, X, User as UserIcon } from 'lucide-react';
import { useUserSearchViewModel } from '../viewmodels/UserSearchViewModel';

interface User {
    _id: string;
    fullName: string;
    email: string;
}

interface UserSearchProps {
    onSelectUser?: (user: User | null) => void;
    selectedUser?: User | null;
}

export const UserSearch: React.FC<UserSearchProps> = ({
    onSelectUser,
    selectedUser = null
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
    } = useUserSearchViewModel({ onSelectUser, selectedUser });

    return (
        <div ref={searchRef} className="relative pointer-events-auto z-10">
            <div className="bg-white rounded-xl shadow-lg p-3 flex items-center space-x-3 border border-slate-200">
                <Search className="text-slate-400" size={20} />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => {
                        if (query.length >= 2) setShowResults(true);
                    }}
                    placeholder="Buscar usuário..."
                    className="flex-1 bg-transparent outline-none text-slate-900 placeholder:text-slate-500 font-medium"
                />
                {query && (
                    <button onClick={clearSearch} className="text-slate-400 hover:text-slate-600">
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* Results Dropdown */}
            {showResults && results.length > 0 && (
                <div className="absolute z-20 w-full mt-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
                    {results.map((user) => (
                        <button
                            key={user._id}
                            onClick={() => handleSelectResult(user)}
                            className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
                        >
                            <div className="flex items-center gap-3">
                                <UserIcon size={16} className="text-slate-500" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-800 truncate">
                                        {user.fullName}
                                    </p>
                                    <p className="text-xs text-slate-500 truncate">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* Loading State */}
            {isSearching && (
                <div className="absolute z-20 w-full mt-2 bg-white rounded-xl shadow-xl border border-slate-200 p-4">
                    <p className="text-sm text-slate-500 text-center">Buscando...</p>
                </div>
            )}

            {/* No Results */}
            {showResults && !isSearching && query.length >= 2 && results.length === 0 && (
                <div className="absolute z-20 w-full mt-2 bg-white rounded-xl shadow-xl border border-slate-200 p-4">
                    <p className="text-sm text-slate-500 text-center">Nenhum usuário encontrado</p>
                </div>
            )}
        </div>
    );
};
