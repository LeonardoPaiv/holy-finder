import { useState } from 'react';

interface Filters {
  dateFrom?: string;
  dateTo?: string;
  creatorId?: string;
  postId?: string;
}

export const usePostFiltersViewModel = () => {
  const [filters, setFilters] = useState<Filters>({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const toggleMobileFilters = () => {
    setShowMobileFilters(prev => !prev);
  };

  const closeMobileFilters = () => {
    setShowMobileFilters(false);
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return {
    filters,
    showMobileFilters,
    handleFilterChange,
    handleClearFilters,
    toggleMobileFilters,
    closeMobileFilters,
    activeFiltersCount,
  };
};
