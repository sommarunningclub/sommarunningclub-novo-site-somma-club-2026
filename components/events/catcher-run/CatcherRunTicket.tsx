'use client'

interface CatcherRunTicketProps {
  data: string
  horario: string
  local: string
  localUrl: string
  nomeEvento: string
}

export default function CatcherRunTicket({
  data,
  horario,
  local,
  localUrl,
}: CatcherRunTicketProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#080808] px-4 py-12">
      {/* Título acima */}
      <div className="text-center mb-8">
        <p className="text-[#CC0000] text-xs uppercase tracking-[0.3em] mb-2">Check-in confirmado</p>
        <h1
          className="text-3xl sm:text-4xl font-black uppercase text-white leading-tight"
          style={{ fontFamily: 'var(--font-barlow-condensed, sans-serif)' }}
        >
          Você está dentro
        </h1>
        <p className="text-zinc-500 text-sm mt-2" style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
          Guarde este comprovante ou tire um print.
        </p>
      </div>

      {/* Printer wrapper */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          maxWidth: '340px',
        }}
      >
        {/* Impressora */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #111111 100%)',
            border: '1.5px solid #2a2a2a',
            borderRadius: '12px',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 10,
            position: 'relative',
            boxShadow: '0 4px 24px rgba(0,0,0,0.6)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Indicador de status */}
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#22c55e',
                boxShadow: '0 0 8px #22c55e',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            />
            <span
              style={{
                color: '#666',
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-dm-sans, sans-serif)',
              }}
            >
              Imprimindo ticket...
            </span>
          </div>
          {/* Ícone impressora */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5">
            <path d="M6 9V2h12v7" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" rx="1" />
          </svg>
        </div>

        {/* Slot da impressora */}
        <div
          style={{
            height: '6px',
            background: '#0a0a0a',
            borderLeft: '1.5px solid #2a2a2a',
            borderRight: '1.5px solid #2a2a2a',
            position: 'relative',
            zIndex: 5,
          }}
        />

        {/* Ticket saindo */}
        <div
          style={{
            animation: 'print 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 500ms both',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Corpo branco do ticket */}
          <div
            style={{
              background: '#f9f9f9',
              borderRadius: '0 0 12px 12px',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            {/* Cabeçalho do ticket — faixa escura com logos */}
            <div
              style={{
                background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0000 100%)',
                padding: '18px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <img
                src="https://cdn.shopify.com/s/files/1/0788/1932/8253/files/HORIZONTAL_PRETA_LARANJA.png"
                alt="Somma Running Club"
                style={{ height: '22px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
              />
              <span style={{ color: '#CC0000', fontSize: '18px', fontWeight: 300 }}>×</span>
              <img
                src="https://cdn.shopify.com/s/files/1/0788/1932/8253/files/RED_BULL_ED_LATA_GLASS_BRANCO_ABERTA.png?v=1776108606"
                alt="Red Bull"
                style={{ height: '42px', objectFit: 'contain' }}
              />
            </div>

            {/* Faixa vermelha com nome do evento */}
            <div
              style={{
                background: '#CC0000',
                padding: '10px 20px',
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  color: '#fff',
                  fontSize: '11px',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-dm-sans, sans-serif)',
                  margin: 0,
                }}
              >
                Catcher Run · Brasília 2026
              </p>
            </div>

            {/* Detalhes do evento */}
            <div style={{ padding: '20px 20px 0' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                }}
              >
                <div>
                  <p style={{ color: '#999', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 3px', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>Data</p>
                  <p style={{ color: '#111', fontSize: '13px', fontWeight: 700, margin: 0, fontFamily: 'var(--font-barlow-condensed, sans-serif)', letterSpacing: '0.03em' }}>
                    {data || 'Dom, 26 ABR 2026'}
                  </p>
                </div>
                <div>
                  <p style={{ color: '#999', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 3px', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>Concentração</p>
                  <p style={{ color: '#111', fontSize: '13px', fontWeight: 700, margin: 0, fontFamily: 'var(--font-barlow-condensed, sans-serif)' }}>06h30</p>
                </div>
                <div>
                  <p style={{ color: '#999', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 3px', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>Largada</p>
                  <p style={{ color: '#111', fontSize: '13px', fontWeight: 700, margin: 0, fontFamily: 'var(--font-barlow-condensed, sans-serif)' }}>07h30</p>
                </div>
                <div>
                  <p style={{ color: '#999', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 3px', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>Local</p>
                  <p style={{ color: '#111', fontSize: '13px', fontWeight: 700, margin: 0, fontFamily: 'var(--font-barlow-condensed, sans-serif)' }}>
                    {local || '106 Sul, Brasília DF'}
                  </p>
                </div>
              </div>

              {/* Pelotões */}
              <div style={{ marginTop: '16px' }}>
                <p style={{ color: '#999', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 6px', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>Pelotões</p>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['A – Até 5 km', 'B – 5 a 10 km', 'C – 10 km+'].map((p) => (
                    <span
                      key={p}
                      style={{
                        background: '#f0f0f0',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        padding: '3px 6px',
                        fontSize: '9px',
                        color: '#333',
                        fontFamily: 'var(--font-dm-sans, sans-serif)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Linha pontilhada de separação */}
            <div
              style={{
                margin: '20px 0 0',
                borderTop: '2px dashed #e0e0e0',
                position: 'relative',
              }}
            >
              {/* Meias-luas nas laterais */}
              <div
                style={{
                  position: 'absolute',
                  left: '-12px',
                  top: '-11px',
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: '#080808',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  right: '-12px',
                  top: '-11px',
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: '#080808',
                }}
              />
            </div>

            {/* Rodapé do ticket */}
            <div
              style={{
                padding: '16px 20px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <p style={{ color: '#999', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 3px', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>Identificação</p>
                <p style={{ color: '#111', fontSize: '11px', margin: 0, fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
                  Apresente seu CPF na entrada
                </p>
              </div>
              {/* Ícone QR fake */}
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  background: '#111',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  {/* QR-code simplificado */}
                  <rect x="2" y="2" width="14" height="14" rx="1" fill="#F26522" />
                  <rect x="5" y="5" width="8" height="8" rx="0.5" fill="#111" />
                  <rect x="20" y="2" width="14" height="14" rx="1" fill="#F26522" />
                  <rect x="23" y="5" width="8" height="8" rx="0.5" fill="#111" />
                  <rect x="2" y="20" width="14" height="14" rx="1" fill="#F26522" />
                  <rect x="5" y="23" width="8" height="8" rx="0.5" fill="#111" />
                  <rect x="20" y="20" width="5" height="5" fill="#F26522" />
                  <rect x="27" y="20" width="7" height="5" fill="#F26522" />
                  <rect x="20" y="27" width="7" height="7" fill="#F26522" />
                  <rect x="29" y="27" width="5" height="5" fill="#111" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botões abaixo do ticket */}
      <div className="w-full max-w-[340px] mt-6 flex flex-col gap-3">
        {localUrl && (
          <a
            href={localUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              width: '100%',
              padding: '14px',
              textAlign: 'center',
              border: '1px solid #CC0000',
              color: '#CC0000',
              fontWeight: 600,
              fontSize: '13px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontFamily: 'var(--font-dm-sans, sans-serif)',
              transition: 'all 0.2s',
            }}
          >
            Ver localização no mapa
          </a>
        )}
        <a
          href="/"
          style={{
            display: 'block',
            width: '100%',
            padding: '14px',
            textAlign: 'center',
            border: '1px solid #333',
            color: '#999',
            fontWeight: 600,
            fontSize: '13px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontFamily: 'var(--font-dm-sans, sans-serif)',
          }}
        >
          Voltar ao site
        </a>
      </div>
    </div>
  )
}
