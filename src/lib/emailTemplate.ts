/**
 * Template de E-mail de Verificação / Redefinição de Senha (Resend & Supabase)
 * 
 * Características:
 * - Logo oficial do sistema (dois moedas brancas no squircle verde #00A86B)
 * - Compatível com Gmail, Outlook e Apple Mail (sem SVG gradients instáveis que ficam totalmente verdes)
 * - Exibe APENAS o código de 8 dígitos (SEM botão nem link de redefinição)
 */

export const RESEND_SUPABASE_EMAIL_TEMPLATE = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Código de Verificação - Pagmefy</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1e293b;">
  
  <!-- Container Principal Centralizado -->
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 10px;">
    <tr>
      <td align="center">
        
        <!-- Card do E-mail -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #ffffff; border-radius: 20px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); overflow: hidden; text-align: center;">
          
          <!-- Faixa de Topo / Header -->
          <tr>
            <td style="padding: 40px 30px 20px 30px; text-align: center;">
              
              <!-- Badge da Logo (Fundo Verde #00A86B com Cantos Arredondados) -->
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="center" style="margin: 0 auto;">
                <tr>
                  <td align="center" valign="middle" style="width: 68px; height: 68px; background-color: #00A86B; border-radius: 18px; text-align: center; vertical-align: middle;">
                    <!-- Ícone de 2 Moedas em Vetor Limpo com Cores Diretas (Não Fica Verde no Gmail) -->
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block; margin: 0 auto;">
                      <circle cx="9" cy="9" r="6" stroke="#ffffff" stroke-width="2.2" fill="none" />
                      <path d="M18 11A6 6 0 0 1 11 18" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" fill="none" />
                      <path d="M8 7H9V11" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
                      <path d="M16 13.5H17V16.5" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
                    </svg>
                  </td>
                </tr>
              </table>

              <!-- Nome do Sistema -->
              <h2 style="margin: 16px 0 0 0; font-size: 22px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">
                Pagmefy
              </h2>
            </td>
          </tr>

          <!-- Divisor Sutil -->
          <tr>
            <td style="padding: 0 40px;">
              <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 0;">
            </td>
          </tr>

          <!-- Corpo do E-mail -->
          <tr>
            <td style="padding: 30px 40px; text-align: center;">
              
              <h1 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 700; color: #0f172a;">
                Código de Confirmação
              </h1>

              <p style="margin: 0 0 28px 0; font-size: 15px; line-height: 1.6; color: #475569;">
                Olá! Você solicitou a verificação de segurança no <strong>Pagmefy</strong>. Digite o código de 8 dígitos abaixo na tela do sistema para continuar:
              </p>

              <!-- Bloco do Código de 8 Dígitos -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 28px 0;">
                <tr>
                  <td align="center" style="background-color: #f0fdf4; border: 2px dashed #00A86B; border-radius: 16px; padding: 22px 10px;">
                    <div style="font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 800; color: #00A86B; letter-spacing: 8px; text-align: center;">
                      {{ .Token }}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Aviso de Validade e Segurança -->
              <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #64748b; background-color: #f8fafc; padding: 12px 16px; border-radius: 10px; border: 1px solid #f1f5f9;">
                ⏱️ Este código expira em <strong>10 minutos</strong>.<br>
                Se você não fez esta solicitação, pode ignorar este e-mail com segurança.
              </p>

            </td>
          </tr>

          <!-- Rodapé do Card -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 30px; border-top: 1px solid #f1f5f9; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8; font-weight: 500;">
                © Pagmefy • Sistema de Gestão Financeira e Cobranças
              </p>
            </td>
          </tr>

        </table>
        
      </td>
    </tr>
  </table>

</body>
</html>`;

/**
 * Função para gerar o HTML com o código dinâmico (para uso via Node.js / Resend API)
 */
export function getEmailHtmlWithCode(code: string): string {
  return RESEND_SUPABASE_EMAIL_TEMPLATE.replace('{{ .Token }}', code);
}
