export const STORAGE_KEYS = {
  DEBTS_DB_PREFIX: 'pagmefy_debts_db',
  ACTIVE_TAB: 'pagmefy_active_tab',
  CURRENT_USER: 'pagmefy_current_user',
  REMEMBERED_EMAIL: 'pagmefy_remembered_email',
  REMEMBER_ME: 'pagmefy_remember_me',
  REGISTERED_EMAILS: 'pagmefy_registered_emails',
  WHATSAPP_CONFIG: 'pagmefy_wa_config',
  THEME: 'pagmefy_theme',
} as const;

export const LEGACY_STORAGE_KEYS = {
  DEBTS_DB_PREFIX: ['cobrancas_facil_db', 'pagai_debts'],
  ACTIVE_TAB: ['pagai_active_tab'],
  CURRENT_USER: ['pagai_current_user'],
  REMEMBERED_EMAIL: ['pagai_remembered_email'],
  REMEMBER_ME: ['pagai_remember_me'],
  WHATSAPP_CONFIG: [],
} as const;

function isStorageAvailable(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

/**
 * Migration script to standardize all legacy localStorage keys (cobrancas_facil_*, pagai_*)
 * to the unified 'pagmefy_' prefix without data loss.
 */
export function migrateLocalStorageToPagmefyPrefix(): void {
  if (!isStorageAvailable()) return;

  try {
    const keysToMigrate: { oldKey: string; newKey: string }[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const oldKey = localStorage.key(i);
      if (!oldKey) continue;

      let newKey: string | null = null;

      if (oldKey === 'cobrancas_facil_db' || oldKey === 'pagai_debts') {
        newKey = STORAGE_KEYS.DEBTS_DB_PREFIX;
      } else if (oldKey.startsWith('cobrancas_facil_db_') || oldKey.startsWith('pagai_debts_')) {
        const userId = oldKey.replace(/^cobrancas_facil_db_|^pagai_debts_/, '');
        newKey = `${STORAGE_KEYS.DEBTS_DB_PREFIX}_${userId}`;
      } else if (oldKey === 'pagai_active_tab') {
        newKey = STORAGE_KEYS.ACTIVE_TAB;
      } else if (oldKey === 'pagai_current_user') {
        newKey = STORAGE_KEYS.CURRENT_USER;
      } else if (oldKey === 'pagai_remembered_email') {
        newKey = STORAGE_KEYS.REMEMBERED_EMAIL;
      } else if (oldKey === 'pagai_remember_me') {
        newKey = STORAGE_KEYS.REMEMBER_ME;
      } else if (oldKey.startsWith('cobrancas_facil_')) {
        newKey = oldKey.replace('cobrancas_facil_', 'pagmefy_');
      } else if (oldKey.startsWith('pagai_')) {
        newKey = oldKey.replace('pagai_', 'pagmefy_');
      }

      if (newKey && newKey !== oldKey) {
        keysToMigrate.push({ oldKey, newKey });
      }
    }

    for (const { oldKey, newKey } of keysToMigrate) {
      const oldVal = localStorage.getItem(oldKey);
      if (oldVal !== null) {
        const currentNewVal = localStorage.getItem(newKey);
        // Only set if new key does not exist yet to prevent overwriting newer data
        if (currentNewVal === null) {
          localStorage.setItem(newKey, oldVal);
        }
        localStorage.removeItem(oldKey);
      }
    }
  } catch (err) {
    console.warn('Erro durante a migração automática do localStorage:', err);
  }
}

// Automatically execute migration when storageKeys module loads
migrateLocalStorageToPagmefyPrefix();

export function getStorageItem(key: string, legacyKeys: readonly string[] = []): string | null {
  if (!isStorageAvailable()) return null;
  try {
    const val = localStorage.getItem(key);
    if (val !== null) return val;

    for (const legacyKey of legacyKeys) {
      const legacyVal = localStorage.getItem(legacyKey);
      if (legacyVal !== null) {
        // Automatically migrate legacy value to the new key
        localStorage.setItem(key, legacyVal);
        return legacyVal;
      }
    }
  } catch (err) {
    console.warn(`Erro ao acessar localStorage para chave ${key}:`, err);
  }
  return null;
}

export function setStorageItem(key: string, value: string): void {
  if (!isStorageAvailable()) return;
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    console.warn(`Erro ao salvar no localStorage para chave ${key}:`, err);
  }
}

export function removeStorageItem(key: string, legacyKeys: readonly string[] = []): void {
  if (!isStorageAvailable()) return;
  try {
    localStorage.removeItem(key);
    for (const legacyKey of legacyKeys) {
      localStorage.removeItem(legacyKey);
    }
  } catch (err) {
    console.warn(`Erro ao remover do localStorage para chave ${key}:`, err);
  }
}
