/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Em produção, aqui você poderia enviar para Sentry / LogRocket / etc.
    console.error('[ErrorBoundary] Erro capturado:', error, info.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'Inter, system-ui, sans-serif',
          color: '#f1f5f9',
        }}
      >
        {/* Ícone de aviso */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
            boxShadow: '0 8px 32px rgba(16,185,129,0.25)',
          }}
        >
          {/* Coins-like SVG logo */}
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="8" r="6" />
            <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
            <path d="M7 6h1v4" />
            <path d="M16.7 12h1v4" />
          </svg>
        </div>

        {/* Mensagem principal */}
        <h1
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: '#f1f5f9',
            margin: '0 0 8px',
            textAlign: 'center',
            letterSpacing: '-0.5px',
          }}
        >
          Algo deu errado
        </h1>
        <p
          style={{
            fontSize: 14,
            color: '#94a3b8',
            textAlign: 'center',
            maxWidth: 360,
            lineHeight: 1.6,
            margin: '0 0 32px',
          }}
        >
          Ocorreu um erro inesperado no PAGMEFY. Seus dados estão seguros — recarregue a página para continuar.
        </p>

        {/* Detalhes técnicos (colapsável) */}
        {this.state.error && (
          <details
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12,
              padding: '12px 16px',
              marginBottom: 28,
              maxWidth: 480,
              width: '100%',
              cursor: 'pointer',
            }}
          >
            <summary
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#64748b',
                userSelect: 'none',
              }}
            >
              Detalhes técnicos do erro
            </summary>
            <pre
              style={{
                marginTop: 8,
                fontSize: 11,
                color: '#f87171',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
                lineHeight: 1.5,
              }}
            >
              {this.state.error.message}
            </pre>
          </details>
        )}

        {/* Botões de ação */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={this.handleReload}
            style={{
              padding: '12px 28px',
              borderRadius: 14,
              background: 'linear-gradient(135deg, #059669, #10b981)',
              color: 'white',
              fontWeight: 800,
              fontSize: 14,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(16,185,129,0.30)',
              transition: 'opacity 0.15s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = '0.88')}
            onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
          >
            🔄 Recarregar página
          </button>

          <button
            onClick={this.handleReset}
            style={{
              padding: '12px 28px',
              borderRadius: 14,
              background: 'rgba(255,255,255,0.06)',
              color: '#94a3b8',
              fontWeight: 700,
              fontSize: 14,
              border: '1px solid rgba(255,255,255,0.10)',
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.10)')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
          >
            Tentar novamente
          </button>
        </div>

        <p style={{ marginTop: 32, fontSize: 11, color: '#334155' }}>
          PAGMEFY © {new Date().getFullYear()}
        </p>
      </div>
    );
  }
}
