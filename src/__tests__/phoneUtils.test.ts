import { describe, it, expect } from 'vitest';
import { formatPhone, getWhatsappUrl, buildWhatsappMessage, WhatsappConfig } from '../utils/phoneUtils';

describe('phoneUtils - Formatação e Envio via WhatsApp', () => {
  it('formatPhone deve formatar números de telefone brasileiros com DDD', () => {
    expect(formatPhone('11987654321')).toBe('(11) 98765-4321');
    expect(formatPhone('1187654321')).toBe('(11) 8765-4321');
    expect(formatPhone('')).toBe('');
  });

  it('getWhatsappUrl deve adicionar o código DDI 55 para números de celular do Brasil', () => {
    const url = getWhatsappUrl('11987654321', '');
    expect(url).toBe('https://api.whatsapp.com/send?phone=5511987654321');
  });

  it('buildWhatsappMessage deve gerar mensagem personalizada dinamicamente', () => {
    const customConfig: WhatsappConfig = {
      mode: 'custom',
      customTemplate: 'Olá {nome}, seu saldo de {valor} vence em {vencimento}.',
    };

    const msg = buildWhatsappMessage(
      { name: 'Maria Souza', currentAmount: 150, dueDate: '2026-10-25' },
      customConfig
    );

    expect(msg).toContain('Maria Souza');
    expect(msg).toContain('150,00');
    expect(msg).toContain('25/10/2026');
  });
});
