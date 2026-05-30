import { Resend } from 'resend'

export interface InscricaoEsplanadaEmail {
  nome: string
  email: string
  cpf: string
  modalidade: string // '3KM' | '5KM' | '10KM'
  tipo_kit: string // 'UNICO' | 'UNICO_PCD'
  tamanho_camiseta: string
}

const MODALIDADE_LABEL: Record<string, string> = {
  '3KM': 'Caminhada 3 km',
  '5KM': 'Corrida 5 km',
  '10KM': 'Corrida 10 km',
}
const KIT_LABEL: Record<string, string> = {
  UNICO: 'Único',
  UNICO_PCD: 'Único PCD',
}

export function renderInscricaoEsplanadaEmail(d: InscricaoEsplanadaEmail): string {
  const modalidade = MODALIDADE_LABEL[d.modalidade] || d.modalidade
  const kit = KIT_LABEL[d.tipo_kit] || d.tipo_kit
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #eee;color:#71717a;font-size:14px;">${label}</td>
      <td style="padding:10px 0;border-bottom:1px solid #eee;color:#18181b;font-size:14px;font-weight:600;text-align:right;">${value}</td>
    </tr>`

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
<body style="margin:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:24px;">
    <div style="background:#0a0a0a;border-radius:20px 20px 0 0;padding:32px 28px;text-align:center;">
      <img src="https://cdn.shopify.com/s/files/1/0788/1932/8253/files/HORIZONTAL_PRETA_LARANJA.png?v=1772322941" alt="Somma Club" style="height:34px;background:#fff;padding:8px 14px;border-radius:8px;" />
      <p style="margin:18px 0 0;color:#CCFF00;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:bold;">Somma Club &times; Esplanada Run</p>
      <h1 style="margin:8px 0 0;color:#fff;font-size:26px;">Inscrição confirmada!</h1>
    </div>

    <div style="background:#fff;padding:28px;">
      <p style="color:#3f3f46;font-size:15px;line-height:1.6;margin:0 0 20px;">
        Olá, <strong>${d.nome}</strong>! Sua inscrição no <strong>Esplanada Run 2026</strong> foi recebida com sucesso. Confira os dados abaixo:
      </p>

      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        ${row('Nome completo', d.nome)}
        ${row('CPF', d.cpf)}
        ${row('Modalidade', modalidade)}
        ${row('Tipo de kit', kit)}
        ${row('Tamanho da camiseta', d.tamanho_camiseta)}
      </table>

      <div style="background:#fff7ed;border-left:4px solid #ff2c03;border-radius:8px;padding:18px 20px;margin-bottom:20px;">
        <p style="margin:0 0 8px;color:#ff2c03;font-weight:bold;font-size:14px;text-transform:uppercase;letter-spacing:1px;">📍 Retirada do kit</p>
        <p style="margin:0;color:#3f3f46;font-size:14px;line-height:1.7;">
          <strong>Local:</strong> Shopping Pier 21, Brasília<br/>
          <strong>18/06 e 19/06:</strong> das 10h às 19h<br/>
          <strong>20/06:</strong> das 10h às 15h<br/>
          <span style="color:#ff2c03;font-weight:600;">Não há retirada no dia da prova. Garanta o seu até sábado, 20/06.</span>
        </p>
      </div>

      <div style="background:#f4f4f5;border-radius:8px;padding:18px 20px;">
        <p style="margin:0;color:#3f3f46;font-size:14px;line-height:1.7;">
          <strong>🏁 Dia da prova:</strong> 21 de junho de 2026, largada às 07h00, na Esplanada dos Ministérios.<br/>
          Encontre o Somma Club na arena do evento: chegue 30 min antes e procure a nossa bandeira. A gente corre junto!
        </p>
      </div>
    </div>

    <div style="background:#0a0a0a;border-radius:0 0 20px 20px;padding:22px;text-align:center;">
      <p style="margin:0;color:#a1a1aa;font-size:12px;">Somma Club · Maior running club do Distrito Federal</p>
      <p style="margin:6px 0 0;"><a href="https://sommaclub.com.br" style="color:#CCFF00;font-size:12px;text-decoration:none;">sommaclub.com.br</a></p>
    </div>
  </div>
</body>
</html>`
}

export async function sendInscricaoEsplanadaEmail(d: InscricaoEsplanadaEmail): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM
  if (!apiKey || !from) {
    console.error('[esplanada-email] RESEND_API_KEY ou EMAIL_FROM não configurados.')
    return
  }
  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from,
    to: d.email,
    subject: 'Inscrição confirmada — Somma Club × Esplanada Run 2026',
    html: renderInscricaoEsplanadaEmail(d),
  })
  if (error) {
    console.error('[esplanada-email] Falha ao enviar e-mail:', error)
  }
}
