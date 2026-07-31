/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ValidationResult } from './debtValidator';

export class AuthValidator {
  static validateEmail(email: string): ValidationResult {
    const errors: Record<string, string> = {};
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail) {
      errors.email = 'O e-mail é obrigatório.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        errors.email = 'Por favor, insira um e-mail com formato válido (ex: seu.email@exemplo.com).';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  static validatePassword(password: string): ValidationResult {
    const errors: Record<string, string> = {};

    if (!password) {
      errors.password = 'A senha é obrigatória.';
    } else if (password.length < 6) {
      errors.password = 'A senha deve conter pelo menos 6 caracteres.';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  static validateRegistration(name: string, email: string, password: string, confirmPassword: string): ValidationResult {
    const errors: Record<string, string> = {};

    const cleanName = (name || '').trim();
    if (!cleanName) {
      errors.name = 'O nome completo ou razão social é obrigatório.';
    }

    const emailCheck = this.validateEmail(email);
    if (!emailCheck.isValid) {
      Object.assign(errors, emailCheck.errors);
    }

    const passCheck = this.validatePassword(password);
    if (!passCheck.isValid) {
      Object.assign(errors, passCheck.errors);
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'As senhas não coincidem. Verifique e tente novamente.';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}
