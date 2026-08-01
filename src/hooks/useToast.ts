/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  message: string;
  type: ToastType;
}

export function useToast() {
  const [toast, setToast] = useState<ToastItem | null>(null);

  const triggerToast = useCallback((msg: string, explicitType?: ToastType) => {
    let type: ToastType = explicitType || 'success';

    if (!explicitType) {
      const lower = msg.toLowerCase();
      if (msg.startsWith('⚠️') || lower.includes('atenção') || lower.includes('alerta') || lower.includes('mantido localmente')) {
        type = 'warning';
      } else if (lower.includes('erro') || lower.includes('falha') || lower.includes('inválid')) {
        type = 'error';
      } else if (lower.includes('info') || lower.includes('notificação')) {
        type = 'info';
      }
    }

    setToast({ message: msg, type });

    setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  return {
    toast,
    toastMessage: toast?.message ?? null,
    toastType: toast?.type ?? 'success',
    triggerToast,
  };
}
