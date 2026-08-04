-- ============================================================
-- SCRIPT SQL PARA INSERIR 100 CLIENTES FICTÍCIOS NO SUPABASE
-- Pega automaticamente o último usuário cadastrado em auth.users
-- ou você pode filtrar por email: WHERE email = 'seu_email@exemplo.com'
-- ============================================================

DO $$
DECLARE
  -- Pega automaticamente o ID do usuário cadastrado no Supabase
  v_user_id UUID := (SELECT id FROM auth.users ORDER BY created_at DESC LIMIT 1);
  v_debt_id UUID;
  i INT;
  v_names TEXT[] := ARRAY[
    'Lucas Silva Santos', 'Mariana Oliveira Costa', 'Gabriel Rodrigues Souza', 'Beatriz Ferreira Alves',
    'Matheus Pereira Lima', 'Ana Gomes Ribeiro', 'Pedro Martins Carvalho', 'Juliana Almeida Lopes',
    'Guilherme Soares Fernandes', 'Larissa Vieira Barbosa', 'Gustavo Rocha Dias', 'Camila Nascimento Andrade',
    'Felipe Moreira Nunes', 'Fernanda Marques Machado', 'Rafael Mendes Freitas', 'Amanda Cardoso Ramos',
    'João Gonçalves Santana', 'Bruna Teixeira Castro', 'Enzo Menezes Borges', 'Jessica Duarte Melo',
    'Leonardo Silva Ramos', 'Leticia Oliveira Santana', 'Daniel Souza Castro', 'Vanessa Alves Borges',
    'Eduardo Lima Duarte', 'Aline Costa Melo', 'Bruno Ribeiro Silva', 'Gabriela Carvalho Oliveira',
    'Caio Almeida Santos', 'Carolina Lopes Souza', 'Thiago Soares Rodrigues', 'Renata Fernandes Ferreira',
    'Rodrigo Vieira Alves', 'Daniela Rocha Pereira', 'Marcelo Dias Lima', 'Tatiane Nascimento Gomes',
    'Vinicius Andrade Ribeiro', 'Flávia Moreira Martins', 'André Marques Carvalho', 'Carlos Mendes Almeida',
    'Priscila Cardoso Lopes', 'Roberto Gonçalves Soares', 'Sabrina Teixeira Fernandes', 'Marcos Castro Vieira',
    'Bianca Menezes Barbosa', 'Fernando Duarte Rocha', 'Tainá Melo Dias', 'Ricardo Silva Nascimento',
    'Nathalia Oliveira Andrade', 'Luiz Souza Moreira', 'Isabela Rodrigues Nunes', 'Paulo Ferreira Marques',
    'Rebeca Alves Machado', 'Alexandre Pereira Mendes', 'Luana Lima Freitas', 'Fabio Costa Cardoso',
    'Rafaela Ribeiro Ramos', 'Luciano Carvalho Gonçalves', 'Débora Almeida Santana', 'Juliana Lopes Teixeira'
  ];
  v_descs TEXT[] := ARRAY[
    'Prestação de serviços de pintura e acabamento residencial.',
    'Venda de lote de produtos eletrônicos e acessórios.',
    'Consultoria técnica em marketing digital e mídias sociais.',
    'Serviço de marcenaria e móveis planejados para escritório.',
    'Manutenção preventiva e higienização de ar-condicionado.',
    'Fornecimento de buffet e salgados para evento corporativo.',
    'Desenvolvimento de website institucional e hospedagem.',
    'Aluguel de equipamentos de som e iluminação profissional.',
    'Serviços advocatícios e assessoria jurídica mensal.',
    'Venda de vestuário e calçados masculinos/femininos.'
  ];
  v_name TEXT;
  v_phone TEXT;
  v_desc TEXT;
  v_amount NUMERIC(12,2);
  v_status VARCHAR(20);
  v_curr NUMERIC(12,2);
  v_due DATE;
  v_created TIMESTAMPTZ;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Nenhum usuário encontrado na tabela auth.users. Faça cadastro no sistema antes de rodar este script.';
  END IF;
  RAISE NOTICE 'Inserindo 100 clientes fictícios para o usuário UUID: %', v_user_id;
  FOR i IN 1..100 LOOP
    v_name := v_names[(i % array_length(v_names, 1)) + 1];
    v_phone := '(' || (10 + (i % 80)) || ') 9' || (8000 + i * 13) || '-' || (1000 + i * 37);
    v_desc := v_descs[(i % array_length(v_descs, 1)) + 1];
    v_amount := (150 + ((i * 137) % 4850))::NUMERIC(12,2);
    v_created := NOW() - (i || ' days')::INTERVAL;
    
    IF i % 4 = 0 THEN
      v_status := 'paid';
      v_curr := 0;
    ELSIF i % 3 = 0 THEN
      v_status := 'partial';
      v_curr := (v_amount * 0.6)::NUMERIC(12,2);
    ELSE
      v_status := 'pending';
      v_curr := v_amount;
    END IF;

    v_due := (NOW() + ((i % 30 - 10) || ' days')::INTERVAL)::DATE;

    INSERT INTO public.debts (
      user_id, name, phone, original_amount, current_amount, status, description, due_date, created_at
    ) VALUES (
      v_user_id, v_name || ' #' || i, v_phone, v_amount, v_curr, v_status, v_desc, v_due, v_created
    ) RETURNING id INTO v_debt_id;

    IF v_status = 'paid' THEN
      INSERT INTO public.payments (debt_id, user_id, amount, note, payment_date, created_at)
      VALUES (v_debt_id, v_user_id, v_amount, 'Quitação integral demonstrativa', v_due, v_created + INTERVAL '1 day');
    ELSIF v_status = 'partial' THEN
      INSERT INTO public.payments (debt_id, user_id, amount, note, payment_date, created_at)
      VALUES (v_debt_id, v_user_id, (v_amount * 0.4)::NUMERIC(12,2), 'Entrada / Parcela 1 via Pix', v_due - INTERVAL '2 days', v_created + INTERVAL '1 day');
    END IF;
  END LOOP;
END $$;
