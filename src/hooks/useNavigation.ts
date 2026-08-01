import { useState, useEffect, useCallback } from 'react';
import { User } from './useAuth';
import { STORAGE_KEYS, LEGACY_STORAGE_KEYS, getStorageItem, setStorageItem } from '../constants/storageKeys';

export function useNavigation(
  currentUser: User | null, 
  authLoading: boolean, 
  handleLogout: (cb?: () => void) => void
) {
  const [activeSidebarOption, setActiveSidebarOption] = useState<string>(() => {
    // Unauthenticated visitors always start on 'landing'
    if (!currentUser) return 'landing';
    const savedTab = getStorageItem(STORAGE_KEYS.ACTIVE_TAB, LEGACY_STORAGE_KEYS.ACTIVE_TAB);
    return savedTab && savedTab !== 'landing' ? savedTab : 'dashboard';
  });

  useEffect(() => {
    if (!authLoading) {
      if (currentUser) {
        if (activeSidebarOption === 'landing') {
          const savedTab = getStorageItem(STORAGE_KEYS.ACTIVE_TAB, LEGACY_STORAGE_KEYS.ACTIVE_TAB);
          setActiveSidebarOption(savedTab && savedTab !== 'landing' ? savedTab : 'dashboard');
        } else {
          setStorageItem(STORAGE_KEYS.ACTIVE_TAB, activeSidebarOption);
        }
      } else {
        // Force landing page for unauthenticated visitors
        setActiveSidebarOption('landing');
      }
    }
  }, [authLoading, currentUser, activeSidebarOption]);

  const handleSidebarOptionSelect = useCallback((option: string, openSqlModal: () => void) => {
    if (option === 'logout') {
      handleLogout(() => setActiveSidebarOption('landing'));
    } else if (option === 'sql_modal') {
      openSqlModal();
    } else {
      setActiveSidebarOption(option);
    }
  }, [handleLogout]);

  return {
    activeSidebarOption,
    setActiveSidebarOption,
    handleSidebarOptionSelect,
  };
}
