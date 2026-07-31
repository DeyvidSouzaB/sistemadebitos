/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Format raw string into Brazilian phone number mask: (XX) XXXXX-XXXX or (XX) XXXX-XXXX
 */
export function formatPhone(phone?: string): string {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  if (cleaned.length > 2 && cleaned.length <= 6) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  }
  if (cleaned.length > 6) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
  }
  return cleaned;
}

/**
 * Sanitize and create direct WhatsApp web/app link targeting debtor's phone
 */
import { STORAGE_KEYS, getStorageItem, setStorageItem } from '../constants/storageKeys';

export interface WhatsappConfig {
  mode: 'empty' | 'standard' | 'formal' | 'custom';
  customTemplate?: string;
}

export function getWhatsappConfig(): WhatsappConfig {
  try {
    const saved = getStorageItem(STORAGE_KEYS.WHATSAPP_CONFIG);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    // fallback
  }
  // Default to 'empty' (direct chat without pre-filled text) as requested by the user
  return { mode: 'empty', customTemplate: '' };
}

export function saveWhatsappConfig(config: WhatsappConfig) {
  try {
    setStorageItem(STORAGE_KEYS.WHATSAPP_CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save whatsapp config', e);
  }
}

export function buildWhatsappMessage(
  debt: { name?: string; currentAmount?: number; dueDate?: string },
  config?: WhatsappConfig
): string {
  const cfg = config || getWhatsappConfig();
  if (cfg.mode === 'empty') {
    return '';
  }

  const name = debt.name || 'Cliente';
  const amountStr = debt.currentAmount !== undefined
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(debt.currentAmount)
    : 'R$ 0,00';
  
  let dateStr = 'data a combinar';
  if (debt.dueDate) {
    const parts = debt.dueDate.split('-');
    if (parts.length === 3) {
      dateStr = `${parts[2]}/${parts[1]}/${parts[0]}`;
    } else {
      dateStr = debt.dueDate;
    }
  }

  if (cfg.mode === 'formal') {
    return `Prezado(a) ${name}, informamos que consta em nosso sistema um saldo em aberto no valor de ${amountStr}${debt.dueDate ? ` com vencimento em ${dateStr}` : ''}. Favor entrar em contato para quitação.`;
  }

  if (cfg.mode === 'custom' && cfg.customTemplate) {
    return cfg.customTemplate
      .replace(/\{nome\}/gi, name)
      .replace(/\{valor\}/gi, amountStr)
      .replace(/\{vencimento\}/gi, dateStr);
  }

  // Default 'standard'
  return `Olá ${name}, tudo bem? Comunicado do PAGMEFY: identificamos em aberto o valor de ${amountStr}${debt.dueDate ? ` com vencimento em ${dateStr}` : ''}. Como podemos agendar o pagamento?`;
}

/**
 * Sanitize and create direct WhatsApp web/app link targeting debtor's phone
 */
export function getWhatsappUrl(phone?: string, text?: string): string {
  const encodedText = text && text.trim() ? encodeURIComponent(text.trim()) : '';
  if (!phone || !phone.trim()) {
    return encodedText ? `https://api.whatsapp.com/send?text=${encodedText}` : 'https://api.whatsapp.com';
  }
  let cleaned = phone.replace(/\D/g, '');
  // If Brazilian DDD without country code 55 (e.g., 11987654321 or 1187654321)
  if (!cleaned.startsWith('55') && (cleaned.length === 10 || cleaned.length === 11)) {
    cleaned = '55' + cleaned;
  }
  return encodedText 
    ? `https://api.whatsapp.com/send?phone=${cleaned}&text=${encodedText}`
    : `https://api.whatsapp.com/send?phone=${cleaned}`;
}
