import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { STORAGE_KEYS, LEGACY_STORAGE_KEYS, getStorageItem, setStorageItem, removeStorageItem } from '../constants/storageKeys';

export interface User {
  id: string;
  email: string;
  name: string;
}

export function useAuth(triggerToast: (msg: string) => void) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = getStorageItem(STORAGE_KEYS.CURRENT_USER, LEGACY_STORAGE_KEYS.CURRENT_USER);
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [authLoading, setAuthLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    async function checkAuthSession() {
      // Check if URL indicates password recovery mode
      const isRecoveryUrl = typeof window !== 'undefined' && (
        window.location.hash.includes('type=recovery') ||
        window.location.search.includes('type=recovery') ||
        (window.location.hash.includes('access_token=') && window.location.hash.includes('type=recovery'))
      );

      if (isRecoveryUrl) {
        setShowAuthModal(true);
      }

      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && !isRecoveryUrl) {
            const userName = session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuário';
            setCurrentUser({
              id: session.user.id,
              email: session.user.email || '',
              name: userName,
            });
          }
        } catch (err) {
          console.error('Erro na checagem de sessão do Supabase:', err);
        } finally {
          setAuthLoading(false);
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          // Durante a recuperação de senha, o Supabase cria uma sessão temporária
          // só para permitir a troca da senha. Não tratamos isso como um login —
          // senão o usuário é jogado direto pro app sem nunca definir a nova senha.
          // Quem cuida desse fluxo é o AuthView (tela "Insira sua nova senha").
          if (event === 'PASSWORD_RECOVERY') {
            setShowAuthModal(true);
            return;
          }

          if (session?.user && !window.location.hash.includes('type=recovery') && !window.location.search.includes('type=recovery')) {
            const userName = session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuário';
            setCurrentUser({
              id: session.user.id,
              email: session.user.email || '',
              name: userName,
            });
          } else if (!session?.user) {
            setCurrentUser(null);
          }
        });

        return () => subscription.unsubscribe();
      } else {
        const savedUser = getStorageItem(STORAGE_KEYS.CURRENT_USER, LEGACY_STORAGE_KEYS.CURRENT_USER);
        if (savedUser) {
          try {
            setCurrentUser(JSON.parse(savedUser));
          } catch (e) {
            setCurrentUser(null);
          }
        }
        setAuthLoading(false);
      }
    }

    checkAuthSession();
  }, []);

  const handleLogout = useCallback(async (onLoggedOut?: () => void) => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
    removeStorageItem(STORAGE_KEYS.CURRENT_USER, LEGACY_STORAGE_KEYS.CURRENT_USER);
    removeStorageItem(STORAGE_KEYS.ACTIVE_TAB, LEGACY_STORAGE_KEYS.ACTIVE_TAB);
    if (onLoggedOut) onLoggedOut();
    triggerToast('Sessão encerrada com sucesso.');
  }, [triggerToast]);

  const handleLoginSuccess = useCallback((user: User, onLoginSuccessCallback?: () => void) => {
    setCurrentUser(user);
    setStorageItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    if (onLoginSuccessCallback) onLoginSuccessCallback();
  }, []);

  return {
    currentUser,
    authLoading,
    showAuthModal,
    setShowAuthModal,
    handleLogout,
    handleLoginSuccess,
  };
}
