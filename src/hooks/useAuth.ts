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

  // Real-time subscription to public.profiles changes
  useEffect(() => {
    if (!currentUser || !isSupabaseConfigured || !supabase) return;

    const channel = supabase
      .channel(`profile_user_${currentUser.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${currentUser.id}`,
        },
        (payload: any) => {
          if (payload.new && payload.new.name && payload.new.name !== currentUser.name) {
            const updated = { ...currentUser, name: payload.new.name };
            setCurrentUser(updated);
            setStorageItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updated));
          }
        }
      )
      .subscribe();

    return () => {
      if (supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [currentUser?.id, currentUser?.name]);

  const updateUserName = useCallback(async (newName: string): Promise<boolean> => {
    const trimmed = newName.trim();
    if (!trimmed) {
      triggerToast('⚠️ O nome não pode ficar em branco.');
      return false;
    }

    if (!currentUser) return false;

    // 1. Optimistic local update
    const updatedUser = { ...currentUser, name: trimmed };
    setCurrentUser(updatedUser);
    setStorageItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedUser));

    // 2. Sync with Supabase Auth & public.profiles
    if (isSupabaseConfigured && supabase) {
      try {
        const { error: authErr } = await supabase.auth.updateUser({
          data: { name: trimmed }
        });
        if (authErr) console.warn('Aviso ao atualizar metadata Supabase Auth:', authErr.message);

        const { error: profileErr } = await supabase
          .from('profiles')
          .upsert({
            id: currentUser.id,
            name: trimmed,
            email: currentUser.email,
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' });

        if (profileErr) console.warn('Aviso ao atualizar tabela profiles no Supabase:', profileErr.message);

        triggerToast('✅ Nome de usuário atualizado no Supabase com sucesso!');
        return true;
      } catch (err) {
        console.error('Erro ao salvar nome no Supabase:', err);
        triggerToast('⚠️ Salvo localmente. Erro ao sincronizar com o Supabase.');
        return false;
      }
    } else {
      triggerToast('✅ Nome de usuário atualizado!');
      return true;
    }
  }, [currentUser, triggerToast]);

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
    updateUserName,
    handleLogout,
    handleLoginSuccess,
  };
}
