import { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';

interface User {
    _id: string;
    fullName: string;
    email: string;
}

interface UseUserSearchViewModelProps {
    onSelectUser?: (user: User | null) => void;
    selectedUser?: User | null;
}

export const useUserSearchViewModel = ({
    onSelectUser,
    selectedUser = null
}: UseUserSearchViewModelProps) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<User[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // Update query when selectedUser changes
    useEffect(() => {
        if (selectedUser) {
            setQuery(selectedUser.fullName);
        } else {
            setQuery('');
        }
    }, [selectedUser]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const searchUsers = async () => {
            if (query.length < 2) {
                setResults([]);
                return;
            }

            setIsSearching(true);
            try {
                const token = Cookies.get('sb-access-token');
                const response = await fetch(`/api/moderation/users/search?query=${encodeURIComponent(query)}&limit=5`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const users = await response.json();
                    setResults(users);
                    setShowResults(true);
                } else {
                    setResults([]);
                }
            } catch (error) {
                console.error('Error searching users:', error);
                setResults([]);
            } finally {
                setIsSearching(false);
            }
        };

        const debounceTimer = setTimeout(searchUsers, 300);
        return () => clearTimeout(debounceTimer);
    }, [query]);

    const handleSelectResult = (user: User) => {
        setQuery(user.fullName);
        setShowResults(false);
        onSelectUser?.(user);
    };

    const clearSearch = () => {
        setQuery('');
        setResults([]);
        setShowResults(false);
        onSelectUser?.(null);
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
