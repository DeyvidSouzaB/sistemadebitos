-- ============================================================
-- SCHEMAS E POLÍTICAS DE SEGURANÇA (RLS) PARA SUPABASE
-- Sistema Pagmefy / Gestão de Débitos
-- ============================================================

-- 1. Tabela de Cobranças/Débitos (`debts`)
CREATE TABLE IF NOT EXISTS public.debts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    original_amount NUMERIC(12, 2) NOT NULL CHECK (original_amount >= 0),
    current_amount NUMERIC(12, 2) NOT NULL CHECK (current_amount >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'partial', 'paid')),
    description TEXT,
    due_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Habilitar RLS na tabela debts
ALTER TABLE public.debts ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para debts
CREATE POLICY "Usuários podem ver apenas suas próprias cobranças" 
    ON public.debts FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar suas próprias cobranças" 
    ON public.debts FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias cobranças" 
    ON public.debts FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem excluir suas próprias cobranças" 
    ON public.debts FOR DELETE 
    USING (auth.uid() = user_id);

-- Índices de performance para debts
CREATE INDEX IF NOT EXISTS idx_debts_user_id ON public.debts(user_id);
CREATE INDEX IF NOT EXISTS idx_debts_due_date ON public.debts(due_date);
CREATE INDEX IF NOT EXISTS idx_debts_status ON public.debts(status);


-- 2. Tabela de Histórico de Pagamentos (`payments`)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    debt_id UUID NOT NULL REFERENCES public.debts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    note TEXT,
    payment_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Habilitar RLS na tabela payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para payments
CREATE POLICY "Usuários podem ver apenas pagamentos de suas cobranças" 
    ON public.payments FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem lançar pagamentos para suas cobranças" 
    ON public.payments FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus pagamentos" 
    ON public.payments FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem excluir seus pagamentos" 
    ON public.payments FOR DELETE 
    USING (auth.uid() = user_id);

-- Índices de performance para payments
CREATE INDEX IF NOT EXISTS idx_payments_debt_id ON public.payments(debt_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
