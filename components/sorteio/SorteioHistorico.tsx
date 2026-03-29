// components/sorteio/SorteioHistorico.tsx
'use client'

import { useState } from 'react'
import { ChevronDown, Clock, Trophy, Users, Trash2, Loader2 } from 'lucide-react'
import type { Sorteio } from '@/lib/sorteio/types'
import { formatDateTime, descricaoFiltros } from '@/lib/sorteio/utils'

type SorteioHistoricoProps = {
  sorteios: Sorteio[]
  onLimparHistorico?: () => Promise<void>
}

export default function SorteioHistorico({ sorteios, onLimparHistorico }: SorteioHistoricoProps) {
  const [expandido, setExpandido] = useState<string | null>(null)
  const [limpando, setLimpando] = useState(false)

  async function handleLimpar() {
    if (!onLimparHistorico) return
    if (!confirm('Tem certeza que deseja limpar todo o histórico de sorteios deste evento?')) return
    setLimpando(true)
    try {
      await onLimparHistorico()
    } finally {
      setLimpando(false)
    }
  }

  if (sorteios.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-zinc-600 text-sm">Nenhum sorteio realizado neste evento</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {onLimparHistorico && (
        <div className="flex justify-end">
          <button
            onClick={handleLimpar}
            disabled={limpando}
            className="flex items-center gap-1.5 text-zinc-600 hover:text-red-400 text-xs transition-colors disabled:opacity-50"
          >
            {limpando ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
            Limpar histórico
          </button>
        </div>
      )}
      {sorteios.map(s => {
        const aberto = expandido === s.id
        const confirmados = s.ganhadores.filter(g => g.status === 'confirmado').length
        const ausentes = s.ganhadores.filter(g => g.status === 'ausente').length
        const pendentes = s.ganhadores.filter(g => g.status === 'pendente').length

        return (
          <div key={s.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <button
              onClick={() => setExpandido(aberto ? null : s.id)}
              className="w-full text-left p-4 flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Trophy className="w-4 h-4 text-[#ff2c03]" />
                  <p className="text-white font-medium text-sm">{s.titulo}</p>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                  <span className="text-zinc-500 text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {formatDateTime(s.created_at)}
                  </span>
                  <span className="text-zinc-500 text-xs flex items-center gap-1">
                    <Users className="w-3 h-3" /> {s.total_elegiveis} elegíveis
                  </span>
                  <span className="text-zinc-600 text-xs">{descricaoFiltros(s.filtros_aplicados)}</span>
                </div>
                <div className="flex gap-2 mt-1.5">
                  {confirmados > 0 && <span className="text-xs bg-green-900/40 text-green-400 px-2 py-0.5 rounded-full">{confirmados} confirmado{confirmados > 1 ? 's' : ''}</span>}
                  {pendentes > 0 && <span className="text-xs bg-yellow-900/40 text-yellow-400 px-2 py-0.5 rounded-full">{pendentes} pendente{pendentes > 1 ? 's' : ''}</span>}
                  {ausentes > 0 && <span className="text-xs bg-red-900/40 text-red-400 px-2 py-0.5 rounded-full">{ausentes} ausente{ausentes > 1 ? 's' : ''}</span>}
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-zinc-500 flex-shrink-0 transition-transform ${aberto ? 'rotate-180' : ''}`} />
            </button>

            {aberto && (
              <div className="border-t border-zinc-800 p-4 space-y-2">
                <p className="text-zinc-500 text-xs mb-2">Operado por: {s.criado_por || '—'}</p>
                {s.ganhadores.map(g => {
                  const corStatus = g.status === 'confirmado'
                    ? 'border-green-900/50 bg-green-950/20'
                    : g.status === 'ausente'
                      ? 'border-red-900/50 bg-red-950/10'
                      : 'border-zinc-700 bg-zinc-800/50'

                  const badgeStatus = g.status === 'confirmado'
                    ? 'bg-green-900/40 text-green-400'
                    : g.status === 'ausente'
                      ? 'bg-red-900/40 text-red-400'
                      : 'bg-yellow-900/40 text-yellow-400'

                  return (
                    <div key={g.id} className={`border rounded-lg p-3 ${corStatus}`}>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white text-xs font-mono">#{g.numero_sorteado}</span>
                        <p className="text-white text-sm font-medium">{g.checkin?.nome_completo || '—'}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeStatus}`}>
                          {g.status === 'confirmado' ? 'Confirmado' : g.status === 'ausente' ? 'Ausente' : 'Pendente'}
                        </span>
                        {g.checkin?.pelotao && (
                          <span className="text-xs bg-[#ff2c03]/10 text-[#ff2c03] px-2 py-0.5 rounded-full">{g.checkin.pelotao}</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
