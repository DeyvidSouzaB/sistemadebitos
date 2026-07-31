/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export class DebtValidator {
  static validateDebtForm(data: {
    name: string;
    originalAmount: number | string;
    phone?: string;
    dueDate?: string;
  }): ValidationResult {
    const errors: Record<string, string> = {};

    const cleanName = (data.name || '').trim();
    if (!cleanName) {
      errors.name = 'O nome do devedor é obrigatório.';
    } else if (cleanName.length < 2) {
      errors.name = 'O nome deve conter pelo menos 2 caracteres.';
    }

    const numericAmount = typeof data.originalAmount === 'number' 
      ? data.originalAmount 
      : parseFloat(String(data.originalAmount).replace(',', '.'));

    if (isNaN(numericAmount) || numericAmount <= 0) {
      errors.originalAmount = 'O valor da cobrança deve ser maior que R$ 0,00.';
    }

    if (data.phone) {
      const digits = data.phone.replace(/\D/g, '');
      if (digits.length > 0 && (digits.length < 10 || digits.length > 11)) {
        errors.phone = 'Insira um telefone/WhatsApp válido com DDD (ex: 11999998888).';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  static validatePaymentAmount(amount: number | string, currentAmount: number): ValidationResult {
    const errors: Record<string, string> = {};
    const numericAmount = typeof amount === 'number'
      ? amount
      : parseFloat(String(amount).replace(',', '.'));

    const roundedPay = isNaN(numericAmount) ? 0 : Number(numericAmount.toFixed(2));
    const roundedCurrent = Number((currentAmount || 0).toFixed(2));

    if (isNaN(numericAmount) || roundedPay <= 0) {
      errors.amount = 'O valor do pagamento deve ser superior a R$ 0,00.';
    } else if (roundedPay > roundedCurrent + 0.001) {
      errors.amount = 'O valor do pagamento não pode ser maior do que o saldo devedor restante.';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}
