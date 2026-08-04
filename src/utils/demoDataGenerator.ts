import { Debt, PaymentHistory } from '../types';

const FIRST_NAMES = [
  'Lucas', 'Gabriel', 'Matheus', 'Pedro', 'Guilherme', 'Gustavo', 'Felipe', 'Rafael', 'João', 'Enzo',
  'Leonardo', 'Daniel', 'Eduardo', 'Bruno', 'Caio', 'Thiago', 'Rodrigo', 'Marcelo', 'Vinicius', 'André',
  'Mariana', 'Beatriz', 'Ana', 'Juliana', 'Larissa', 'Camila', 'Fernanda', 'Amanda', 'Bruna', 'Jessica',
  'Leticia', 'Vanessa', 'Patrícia', 'Aline', 'Gabriela', 'Carolina', 'Renata', 'Daniela', 'Tatiane', 'Flávia',
  'Carlos', 'Roberto', 'Marcos', 'Fernando', 'Ricardo', 'Luiz', 'Paulo', 'Alexandre', 'Fabio', 'Luciano',
  'Priscila', 'Sabrina', 'Bianca', 'Tainá', 'Nathalia', 'Isabela', 'Rebeca', 'Luana', 'Rafaela', 'Débora'
];

const LAST_NAMES = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes',
  'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida', 'Lopes', 'Soares', 'Fernandes', 'Vieira', 'Barbosa',
  'Rocha', 'Dias', 'Nascimento', 'Andrade', 'Moreira', 'Nunes', 'Marques', 'Machado', 'Mendes', 'Freitas',
  'Cardoso', 'Ramos', 'Gonçalves', 'Santana', 'Teixeira', 'Castro', 'Menezes', 'Borges', 'Duarte', 'Melo'
];

const DESCRIPTIONS = [
  'Prestação de serviços de pintura e acabamento residencial.',
  'Venda de lote de produtos eletrônicos e acessórios.',
  'Consultoria técnica em marketing digital e mídias sociais.',
  'Serviço de marcenaria e móveis planejados para escritório.',
  'Manutenção preventiva e higienização de ar-condicionado.',
  'Fornecimento de buffet e salgados para evento corporativo.',
  'Desenvolvimento de website institucional e hospedagem.',
  'Aluguel de equipamentos de som e iluminação profissional.',
  'Serviços advocatícios e assessoria jurídica mensal.',
  'Venda de vestuário e calçados masculinos/femininos.',
  'Reforma elétrica e instalação de padrão de energia.',
  'Serviço de frete e transporte de mudanças intermunicipal.',
  'Manutenção mecânica e troca de peças automotivas.',
  'Fornecimento de material de escritório e papelaria.',
  'Contrato de limpeza pós-obra e higienização de estofados.'
];

const DDD_LIST = ['11', '19', '21', '31', '41', '51', '61', '71', '81', '85'];

export function generate100DemoDebts(): Debt[] {
  const debts: Debt[] = [];
  const now = Date.now();
  const DAY_MS = 24 * 60 * 60 * 1000;

  for (let i = 1; i <= 100; i++) {
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
    const lastName1 = LAST_NAMES[(i * 3) % LAST_NAMES.length];
    const lastName2 = LAST_NAMES[(i * 7) % LAST_NAMES.length];
    const fullName = `${firstName} ${lastName1} ${lastName2}`;

    const ddd = DDD_LIST[i % DDD_LIST.length];
    const phoneNum = `${90000 + (i * 73) % 9000}-${1000 + (i * 89) % 9000}`;
    const phone = `(${ddd}) ${phoneNum}`;

    // Amounts between 150.00 and 8500.00
    const rawOriginal = 150 + ((i * 137) % 8350);
    const originalAmount = Number((Math.round(rawOriginal / 10) * 10).toFixed(2));

    const daysAgoCreated = (i * 3) % 90 + 1; // 1 to 90 days ago
    const createdAt = new Date(now - daysAgoCreated * DAY_MS).toISOString();

    // Due date spread: past (overdue), today/soon, future
    const offsetDays = (i % 5 === 0) ? -15 : (i % 3 === 0) ? 0 : (i % 2 === 0) ? -((i % 20) + 1) : ((i % 25) + 2);
    const dueDate = new Date(now + offsetDays * DAY_MS).toISOString();

    const description = DESCRIPTIONS[i % DESCRIPTIONS.length];

    // Determine status & payments deterministically
    let status: 'pending' | 'partial' | 'paid' = 'pending';
    let currentAmount = originalAmount;
    const payments: PaymentHistory[] = [];

    if (i % 4 === 0) {
      // Paid in full
      status = 'paid';
      currentAmount = 0;
      const pmtDaysAgo = Math.max(1, daysAgoCreated - 5);
      payments.push({
        id: `pmt-${i}-1`,
        date: new Date(now - pmtDaysAgo * DAY_MS).toISOString(),
        amount: originalAmount,
        note: i % 2 === 0 ? 'Quitação integral via Pix' : 'Pagamento efetuado em dinheiro'
      });
    } else if (i % 3 === 0) {
      // Partial payment
      status = 'partial';
      const paidValue = Number((originalAmount * 0.4).toFixed(2));
      currentAmount = Number((originalAmount - paidValue).toFixed(2));
      const pmtDaysAgo = Math.max(1, daysAgoCreated - 2);
      payments.push({
        id: `pmt-${i}-1`,
        date: new Date(now - pmtDaysAgo * DAY_MS).toISOString(),
        amount: paidValue,
        note: 'Sinal / 1ª Parcela recebida via Pix'
      });
    } else {
      // Pending
      status = 'pending';
      currentAmount = originalAmount;
    }

    debts.push({
      id: `demo-debt-${i}`,
      name: fullName,
      phone,
      originalAmount,
      currentAmount,
      createdAt,
      dueDate,
      status,
      description,
      payments
    });
  }

  return debts;
}
