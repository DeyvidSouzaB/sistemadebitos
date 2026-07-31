/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const APP_CONFIG = {
  NAME: 'PAGMEFY',
  TAGLINE: 'Gestão de fiados e cobranças sem complicação',
  DEFAULT_PAGE_SIZE: 12,
  CURRENCY_LOCALE: 'pt-BR',
  CURRENCY_CODE: 'BRL',
} as const;

export const STATUS_CONFIG = {
  pending: {
    label: 'Pendente / Atrasado',
    badgeClass: 'bg-rose-100 text-rose-700 border-rose-200',
    colorHex: '#f43f5e',
  },
  partial: {
    label: 'Pagamento Parcial',
    badgeClass: 'bg-amber-100 text-amber-700 border-amber-200',
    colorHex: '#f59e0b',
  },
  paid: {
    label: 'Em Dia / Quitado',
    badgeClass: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    colorHex: '#10b981',
  },
} as const;

export const DEFAULT_WHATSAPP_TEMPLATE =
  'Olá {nome}! Passando para lembrar sobre o valor pendente de {valor} com vencimento em {vencimento}. Qualquer dúvida estou à disposição!';
