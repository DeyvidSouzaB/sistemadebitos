/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Coins, 
  ArrowRight, 
  ShieldCheck, 
  MessageSquare, 
  CheckCircle2, 
  Zap, 
  Calendar, 
  Users, 
  FileText, 
  Clock, 
  Database, 
  Smartphone, 
  HelpCircle, 
  ChevronDown, 
  Check, 
  X, 
  Lock, 
  Calculator,
  Play,
  LayoutGrid,
  FileSpreadsheet,
  AlertTriangle,
  Flame,
  FileX,
  HeartHandshake,
  CheckCheck,
  Send,
  UserCheck,
  Wallet,
  BookOpen,
  Menu,
  Building2,
  MapPin,
  Layers,
  Activity,
  Receipt,
  BadgeCheck,
  Laptop
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AnimatedNumber, AnimatedCurrency } from './AnimatedCounter';
import { fetchLiveSystemStats, calculateStatsFromDebtsArray, SystemLiveStats } from '../lib/supabaseService';
import { LandingFaq } from './landing/LandingFaq';
import { HeroCards3D } from './landing/HeroCards3D';
import { PainPointsBento } from './landing/PainPointsBento';
import { HowItWorksBento } from './landing/HowItWorksBento';
import { FeaturesBento } from './landing/FeaturesBento';
import { LiveStatsModern } from './landing/LiveStatsModern';
import { Debt } from '../types';

interface LandingPageProps {
  onEnterApp: () => void;
  onOpenAuth?: () => void;
  liveDebts?: Debt[];
}

export default function LandingPage({ onEnterApp, onOpenAuth, liveDebts }: LandingPageProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState<SystemLiveStats>(() => calculateStatsFromDebtsArray(liveDebts || []));

  useEffect(() => {
    async function loadStats() {
      try {
        const liveStats = await fetchLiveSystemStats();
        // If liveDebts is provided, blend system stats with user stats (taking maximum values)
        if (liveDebts && liveDebts.length > 0) {
          const userStats = calculateStatsFromDebtsArray(liveDebts);
          setStats({
            totalClients: Math.max(liveStats.totalClients, userStats.totalClients),
            totalDebts: Math.max(liveStats.totalDebts, userStats.totalDebts),
            totalRecoveredBrl: Math.max(liveStats.totalRecoveredBrl, userStats.totalRecoveredBrl),
            totalActiveStates: Math.max(liveStats.totalActiveStates, userStats.totalActiveStates),
            paidDebtsCount: Math.max(liveStats.paidDebtsCount, userStats.paidDebtsCount),
            successRate: Math.max(liveStats.successRate, userStats.successRate),
            systemUsersCount: Math.max(liveStats.systemUsersCount || 1, userStats.systemUsersCount || 1),
          });
        } else {
          setStats(liveStats);
        }
      } catch (err) {
        console.warn('Erro ao carregar métricas ao vivo:', err);
        const userStats = calculateStatsFromDebtsArray(liveDebts || []);
        setStats(userStats);
      }
    }
    loadStats();
  }, [liveDebts]);

  const handleStartAuth = () => {
    if (onOpenAuth) {
      onOpenAuth();
    } else {
      onEnterApp();
    }
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const painPoints = [
    {
      icon: Flame,
      title: "Página rasgada, molhada ou perdida",
      description: "Um copo de café derrubado, uma folha arrancada pelo vento ou um caderno esquecido na loja e você perde todo o histórico de fiado."
    },
    {
      icon: FileX,
      title: "Letra ilegível e anotações rabiscadas",
      description: "Na pressa do atendimento você anota corrido e semanas depois não entende se era R$ 50 ou R$ 150, gerando atrito desagradável com o cliente."
    },
    {
      icon: AlertTriangle,
      title: "Esquecer quem já pagou",
      description: "Cobrar de novo de quem já quitou é muito constrangedor. Por outro lado, esquecer de cobrar quem deve é prejuízo direto no seu bolso."
    },
    {
      icon: Calculator,
      title: "Não saber quanto tem a receber no total",
      description: "Para saber o valor total da sua 'carteira de fiado', é preciso somar folha por folha do caderno na calculadora. Dá preguiça e você fica no escuro."
    },
    {
      icon: MessageSquare,
      title: "Vergonha e constrangimento de cobrar",
      description: "Ficar pensando nas palavras certas para cobrar um cliente pelo WhatsApp é estressante sem uma mensagem pronta e profissional."
    },
    {
      icon: Smartphone,
      title: "O caderno só fica num lugar",
      description: "Se você estiver em casa, viajando ou fora do salão/oficina, não sabe quem deve quanto. Com o PAGMEFY, seus dados estão com você no celular 24 horas."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Cadastre o Cliente e o Valor",
      description: "Digite o nome, telefone do WhatsApp e o valor da compra (à vista ou parcelado). Leva menos de 20 segundos.",
      badge: "Sem complicação"
    },
    {
      number: "02",
      title: "Acompanhe os Vencimentos",
      description: "O sistema organiza tudo por cores claras: quem está em dia (Verde), quem vence hoje (Amarelo) e quem atrasou (Vermelho).",
      badge: "Visão Instantânea"
    },
    {
      number: "03",
      title: "Envie Lembrete Profissional no WhatsApp",
      description: "Com 1 clique, o app gera uma mensagem objetiva e clara com a chave Pix e o saldo devedor. Basta tocar em enviar!",
      badge: "1-Clique"
    },
    {
      number: "04",
      title: "Dê Baixa e Veja o Dinheiro Entrar",
      description: "Assim que o cliente pagar no Pix, marque como 'Pago' no aplicativo e seu painel atualiza o total arrecadado na hora.",
      badge: "Caixa Organizado"
    }
  ];

  // Casos de uso reais do público-alvo — sem nomes, fotos ou citações fabricadas.
  // Quando houver depoimentos reais de usuários (com autorização), substituir por eles aqui.
  const useCases = [
    {
      icon: Users,
      role: "Costureiras & ateliês de reforma",
      scenario: "Cliente que leva a peça e paga depois, às vezes parcelado. Fácil perder o controle de quem já acertou a conta do mês.",
    },
    {
      icon: MessageSquare,
      role: "Vendedores autônomos de roupas e calçados",
      scenario: "Venda fiada e parcelada em 2x ou 3x. Cobrar por mensagem sem parecer chato é sempre um desafio.",
    },
    {
      icon: Smartphone,
      role: "Cabeleireiras & estúdios de unha",
      scenario: "Agenda cheia entre um cliente e outro — não sobra tempo pra abrir computador ou planilha.",
    },
    {
      icon: FileText,
      role: "Mercadinhos & mercearias de bairro",
      scenario: "Fiado de cliente antigo anotado em caderninho de pão, difícil de somar e fácil de perder.",
    }
  ];

  const faqs = [
    {
      question: "Preciso entender de computador para usar o PAGMEFY?",
      answer: "De jeito nenhum! O PAGMEFY foi feito pensando em quem nunca usou sistemas complicados. Se você sabe usar o WhatsApp no seu celular, você vai conseguir usar o PAGMEFY em menos de 2 minutos."
    },
    {
      question: "Vou perder minhas anotações se meu celular estragar ou for roubado?",
      answer: "Não! Ao contrário do caderno de papel que pode rasgar ou sumir, no PAGMEFY seus dados ficam salvos em nuvem segura ou você pode exportar um arquivo de backup em segundos para guardar onde quiser."
    },
    {
      question: "Como funciona o envio de cobrança pelo WhatsApp?",
      answer: "É extremamente simples: o aplicativo prepara uma mensagem carinhosa e profissional com o nome do cliente, o valor pendente, a data e a sua chave Pix. Você clica no botão do WhatsApp e a mensagem já abre prontinha para você só apertar enviar!"
    },
    {
      question: "O sistema serve para quem vende parcelado?",
      answer: "Sim! Você pode lançar compras à vista ou divididas em várias parcelas (ex: 2x, 3x, 6x). Conforme o cliente for pagando cada parcela, você vai dando baixa e o sistema calcula o saldo restante automaticamente."
    },
    {
      question: "Preciso pagar mensalidade ou cadastrar cartão de crédito para testar?",
      answer: "Não! Você pode acessar o sistema agora mesmo gratuitamente, cadastrar suas primeiras cobranças e começar a organizar seu negócio sem precisar colocar dados de cartão."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-500 selection:text-white antialiased overflow-x-hidden">
      
      {/* ------------------------------------------------------------- */}
      {/* TOP NAVIGATION BAR                                            */}
      {/* ------------------------------------------------------------- */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <div 
            role="button"
            tabIndex={0}
            onClick={handleStartAuth}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleStartAuth();
              }
            }}
            className="flex items-center gap-3 shrink-0 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:shadow-emerald-500/30 transition-all duration-300 font-black">
              <Coins className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                PAGMEFY
              </span>
            </div>
          </div>

          {/* Centered Desktop Nav Links */}
          <nav className="hidden md:flex items-center justify-center gap-1.5 lg:gap-3 text-xs lg:text-sm font-bold flex-1 max-w-2xl mx-auto">
            <a 
              href="#problema" 
              onClick={(e) => scrollToSection(e, 'problema')}
              className="px-3.5 py-1.5 rounded-full text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/80 border border-transparent transition-all duration-200 shrink-0"
            >
              O Problema
            </a>
            <a 
              href="#solucao" 
              onClick={(e) => scrollToSection(e, 'solucao')}
              className="px-3.5 py-1.5 rounded-full text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/80 border border-transparent transition-all duration-200 shrink-0"
            >
              Como Funciona
            </a>
            <a 
              href="#recursos" 
              onClick={(e) => scrollToSection(e, 'recursos')}
              className="px-3.5 py-1.5 rounded-full text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/80 border border-transparent transition-all duration-200 shrink-0"
            >
              Vantagens
            </a>
            <a 
              href="#depoimentos" 
              onClick={(e) => scrollToSection(e, 'depoimentos')}
              className="px-3.5 py-1.5 rounded-full text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/80 border border-transparent transition-all duration-200 shrink-0"
            >
              Depoimentos
            </a>
            <a 
              href="#faq" 
              onClick={(e) => scrollToSection(e, 'faq')}
              className="px-3.5 py-1.5 rounded-full text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/80 border border-transparent transition-all duration-200 shrink-0"
            >
              Dúvidas
            </a>
          </nav>

          {/* CTA Action Buttons + Mobile Toggle Button */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleStartAuth}
              className="group relative inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-4 py-2 rounded-xl shadow-md shadow-emerald-600/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap text-xs sm:text-sm"
            >
              <LayoutGrid className="w-4 h-4 text-white" />
              <span className="hidden sm:inline">Usar Sistema Grátis</span>
              <span className="sm:hidden">Usar Sistema</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200 transition-all cursor-pointer"
              aria-label="Abrir Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-emerald-600" /> : <Menu className="w-5 h-5 text-slate-700" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="md:hidden bg-white/98 border-b border-slate-200 overflow-hidden px-4 py-4 shadow-lg"
            >
              <nav className="flex flex-col items-center gap-2 text-center">
                <a
                  href="#problema"
                  onClick={(e) => scrollToSection(e, 'problema')}
                  className="w-full py-2.5 px-4 rounded-xl text-slate-700 font-bold hover:bg-emerald-50 hover:text-emerald-700 transition-all"
                >
                  O Problema
                </a>
                <a
                  href="#solucao"
                  onClick={(e) => scrollToSection(e, 'solucao')}
                  className="w-full py-2.5 px-4 rounded-xl text-slate-700 font-bold hover:bg-emerald-50 hover:text-emerald-700 transition-all"
                >
                  Como Funciona
                </a>
                <a
                  href="#recursos"
                  onClick={(e) => scrollToSection(e, 'recursos')}
                  className="w-full py-2.5 px-4 rounded-xl text-slate-700 font-bold hover:bg-emerald-50 hover:text-emerald-700 transition-all"
                >
                  Vantagens
                </a>
                <a
                  href="#depoimentos"
                  onClick={(e) => scrollToSection(e, 'depoimentos')}
                  className="w-full py-2.5 px-4 rounded-xl text-slate-700 font-bold hover:bg-emerald-50 hover:text-emerald-700 transition-all"
                >
                  Depoimentos
                </a>
                <a
                  href="#faq"
                  onClick={(e) => scrollToSection(e, 'faq')}
                  className="w-full py-2.5 px-4 rounded-xl text-slate-700 font-bold hover:bg-emerald-50 hover:text-emerald-700 transition-all"
                >
                  Dúvidas
                </a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* HERO SECTION - LADO A LADO (2 COLUNAS)                        */}
      {/* ------------------------------------------------------------- */}
      <section className="relative pt-10 pb-16 md:pt-16 md:pb-24 overflow-hidden bg-white">
        {/* Textura sutil de grade */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.4]"
          style={{
            backgroundImage: 'linear-gradient(#0f172a0a 1px, transparent 1px), linear-gradient(90deg, #0f172a0a 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            maskImage: 'linear-gradient(to bottom, black, transparent 85%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black, transparent 85%)',
          }}
        />
        {/* Barra de destaque no topo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1.5 rounded-full bg-emerald-600" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Coluna da Esquerda: Título, Subtítulo e Chamada para Ação */}
            <div className="lg:col-span-6 text-center lg:text-left space-y-6">
              
              {/* Headline Principal */}
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-[1.15]">
                Chega de caderninho. <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700">Controle suas cobranças</span> de forma simples.
              </h1>

              {/* Subheadline */}
              <p className="text-base text-slate-600 font-medium leading-relaxed">
                O <strong className="text-slate-900 font-bold">PAGMEFY</strong> substitui o papel por um controle inteligente acessível do seu celular, computador ou tablet. Saiba exatamente <strong className="text-slate-900 font-bold">quem te deve, quanto deve e quando vence</strong> — e envie lembretes no WhatsApp com 1 clique.
              </p>

              {/* Botão de Ação */}
              <div className="flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-4 pt-2">
                <button
                  onClick={handleStartAuth}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base px-8 py-4 rounded-2xl shadow-xl shadow-emerald-600/25 transition-all duration-200 active:scale-[0.98] cursor-pointer"
                >
                  <span>Start Grátis Agora</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Destaques de Confiança */}
              <div className="pt-6 border-t border-slate-200/90 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <p className="text-lg sm:text-xl font-black text-emerald-600">0% Rasuras</p>
                  <p className="text-[11px] text-slate-500 font-medium">Dados na nuvem</p>
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-black text-amber-600">1-Clique</p>
                  <p className="text-[11px] text-slate-500 font-medium">Lembrete WhatsApp</p>
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-black text-emerald-600">100% Grátis</p>
                  <p className="text-[11px] text-slate-500 font-medium">Multi-dispositivo</p>
                </div>
              </div>

            </div>

            {/* Coluna da Direita: Composicao 3D de Telas / Cards do Sistema ao lado do Título */}
            <div className="lg:col-span-6 w-full">
              <HeroCards3D />
            </div>

          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION: LIVE SYSTEM METRICS (DADOS DO SISTEMA AO VIVO)        */}
      {/* ------------------------------------------------------------- */}
      <section id="numeros-ao-vivo" className="relative z-20 -mt-10 mb-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
        <LiveStatsModern stats={stats} />
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION: PAIN POINTS (AS DORES DO CADERNO)                     */}
      {/* ------------------------------------------------------------- */}
      <section id="problema" className="py-16 scroll-mt-24 bg-white border-y border-slate-200/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PainPointsBento />
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION: HOW IT WORKS BENTO GRID                             */}
      {/* ------------------------------------------------------------- */}
      <section id="solucao" className="py-16 scroll-mt-24 bg-slate-50/80 relative border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HowItWorksBento />

          <div className="mt-8 text-center">
            <button
              onClick={handleStartAuth}
              className="group inline-flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-emerald-600/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <CheckCheck className="w-5 h-5 text-white" />
              <span>Experimente Agora Sem Custos</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      <section id="recursos" className="py-16 scroll-mt-24 bg-white border-y border-slate-200/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FeaturesBento />
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION: FEITO PARA QUEM (CASOS DE USO REAIS, SEM DEPOIMENTO FABRICADO) */}
      {/* ------------------------------------------------------------- */}
      <section id="depoimentos" className="py-20 scroll-mt-24 bg-slate-50 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-black text-slate-900">
              Feito pra rotina de quem vende fiado no dia a dia
            </h2>
            <p className="text-slate-600 text-base">
              O PAGMEFY foi pensado a partir de situações reais de quem trabalha por conta própria:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {useCases.map((u, idx) => {
              const IconComp = u.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white border border-slate-200 flex gap-4 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all"
                >
                  <div className="w-11 h-11 shrink-0 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{u.role}</h4>
                    <p className="text-slate-600 text-sm leading-relaxed mt-1">{u.scenario}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-center text-xs text-slate-400 mt-10">
            Está começando a usar o PAGMEFY? Se quiser aparecer aqui como um dos primeiros a testar, fale com a gente.
          </p>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* FAQ SECTION                                                   */}
      {/* ------------------------------------------------------------- */}
      <LandingFaq />

      {/* ------------------------------------------------------------- */}
      {/* FOOTER & CTA FINAL                                            */}
      {/* ------------------------------------------------------------- */}
      <footer className="bg-slate-100 border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 pt-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-xs shadow-sm">
                P
              </div>
              <span className="text-slate-900 font-bold text-sm">PAGMEFY</span>
            </div>
            <p>© {new Date().getFullYear()} PAGMEFY. Todos os direitos reservados. Feito para pequenos empreendedores.</p>
          </div>

        </div>
      </footer>

    </div>
  );
}
