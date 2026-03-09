'use client'

import { useState, useEffect, useCallback } from 'react'
import { Lock, LogOut, RefreshCw, Users, CheckCircle, Clock, TrendingUp, Shield } from 'lucide-react'
import Image from 'next/image'

type Parceiro = { id: string; nome: string }

type DashboardData = {
  evento: { nome: string; data: string }
  total: number
  validados: number
  pendentes: number
  porPelotao: Record<string, number>
  porSexo: Record<string, number>
  porHora: Record<string, number>
}

function formatarData(data: string) {
  if (!data) return ''
  const [ano, mes, dia] = data.split('-')
  const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
  return `${dia} de ${meses[parseInt(mes) - 1]} de ${ano}`
}

// ─── Tela de Login ────────────────────────────────────────────────────────────
function TelaLogin({ onLogin }: { onLogin: (p: Parceiro) => void }) {
  const [codigo, setCodigo] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!codigo.trim()) return
    setLoading(true)
    setErro('')
    try {
      const res = await fetch('/api/parceiro/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: codigo.trim() }),
      })
      const json = await res.json()
      if (!res.ok) {
        setErro(json.error || 'Código inválido.')
      } else {
        onLogin(json.parceiro)
      }
    } catch {
      setErro('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #1a0800 0%, #0d0300 40%, #000000 100%)' }}
    >
      <style>{`
        .ocean-p {
          height: 160px;
          width: 100%;
          position: absolute;
          bottom: 0;
          left: 0;
          background: #110200;
        }
        .wave-p {
          background: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/85486/wave.svg) repeat-x;
          position: absolute;
          top: -100px;
          width: 6400px;
          height: 120px;
          animation: wave-p 8s cubic-bezier(0.36,0.45,0.63,0.53) infinite;
          transform: translate3d(0,0,0);
          filter: hue-rotate(200deg) saturate(10) brightness(0.75);
          opacity: 0.55;
        }
        .wave-p:nth-of-type(2) {
          top: -75px;
          animation: wave-p 8s cubic-bezier(0.36,0.45,0.63,0.53) -0.125s infinite, swell-p 7s ease -1.25s infinite;
          filter: hue-rotate(200deg) saturate(8) brightness(0.5);
          opacity: 0.35;
        }
        @keyframes wave-p {
          0% { margin-left: 0; }
          100% { margin-left: -1600px; }
        }
        @keyframes swell-p {
          0%, 100% { transform: translate3d(0,-18px,0); }
          50% { transform: translate3d(0,6px,0); }
        }
      `}</style>

      <div className="ocean-p">
        <div className="wave-p" />
        <div className="wave-p" />
      </div>

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img
              src="https://cdn.shopify.com/s/files/1/0788/1932/8253/files/Logo_Nova_Somma_Branca_Laranja.svg?v=1772736456"
              alt="Somma Running Club"
              className="h-12 w-auto"
            />
          </div>
          <p className="text-[#ff2c03] text-xs font-semibold uppercase tracking-widest mb-1">Parceiro Somma Club</p>
          <h1 className="text-2xl font-bold text-white">Acesso Parceiro</h1>
          <p className="text-zinc-500 text-sm mt-1">Acesse com seu código de liberação</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-zinc-400 uppercase tracking-wide mb-1.5 font-medium">
              Código de Liberação
            </label>
            <input
              type="text"
              value={codigo}
              onChange={e => setCodigo(e.target.value)}
              placeholder="Digite seu código"
              autoFocus
              className="w-full bg-zinc-900/80 backdrop-blur-sm border-2 border-zinc-700 focus:border-[#ff2c03] text-white placeholder:text-zinc-600 rounded-xl px-4 py-3.5 text-sm outline-none transition-all uppercase tracking-widest"
            />
          </div>

          {erro && (
            <div className="flex items-center gap-2 bg-red-900/20 border border-red-500/40 rounded-lg px-3.5 py-2.5">
              <Lock className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-xs">{erro}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !codigo.trim()}
            className="w-full bg-[#ff2c03] hover:bg-[#cc2402] disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 text-sm disabled:cursor-not-allowed"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Shield className="w-4 h-4" />
            )}
            {loading ? 'Verificando...' : 'Acessar Dashboard'}
          </button>
        </form>
      </div>
    </main>
  )
}

// ─── Card de Estatística ──────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon: Icon,
  destaque,
}: {
  label: string
  value: number | string
  icon: React.ElementType
  destaque?: boolean
}) {
  return (
    <div
      className={`rounded-2xl p-5 border ${
        destaque
          ? 'bg-[#ff2c03]/10 border-[#ff2c03]/30'
          : 'bg-zinc-900 border-zinc-800'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-zinc-400 text-xs uppercase tracking-widest font-medium">{label}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${destaque ? 'bg-[#ff2c03]/20' : 'bg-zinc-800'}`}>
          <Icon className={`w-4 h-4 ${destaque ? 'text-[#ff2c03]' : 'text-zinc-400'}`} />
        </div>
      </div>
      <p className={`text-3xl font-bold ${destaque ? 'text-[#ff2c03]' : 'text-white'}`}>{value}</p>
    </div>
  )
}

// ─── Barra de progresso ───────────────────────────────────────────────────────
function BarraProgresso({ label, valor, total, cor }: { label: string; valor: number; total: number; cor?: string }) {
  const pct = total > 0 ? Math.round((valor / total) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <span className="text-zinc-300 text-sm w-28 flex-shrink-0 capitalize">{label}</span>
      <div className="flex-1 bg-zinc-800 rounded-full h-2 overflow-hidden">
        <div
          className="h-2 rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: cor || '#ff2c03' }}
        />
      </div>
      <span className="text-zinc-400 text-xs w-14 text-right flex-shrink-0">{valor} <span className="text-zinc-600">({pct}%)</span></span>
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ parceiro, onLogout }: { parceiro: Parceiro; onLogout: () => void }) {
  const [dados, setDados] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')
  const [ultimaAtt, setUltimaAtt] = useState<Date | null>(null)

  const buscarDados = useCallback(async () => {
    setLoading(true)
    setErro('')
    try {
      const res = await fetch('/api/parceiro/dashboard')
      const json = await res.json()
      if (!res.ok) {
        setErro(json.error || 'Erro ao carregar dados.')
      } else {
        setDados(json)
        setUltimaAtt(new Date())
      }
    } catch {
      setErro('Erro de conexão.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    buscarDados()
    const interval = setInterval(buscarDados, 60000) // atualiza a cada 1 min
    return () => clearInterval(interval)
  }, [buscarDados])

  const corSexo = (sexo: string) => {
    if (sexo === 'masculino') return '#3b82f6'
    if (sexo === 'feminino') return '#ec4899'
    return '#6b7280'
  }

  const corPelotao = (pelotao: string) => {
    if (pelotao === '4km') return '#22c55e'
    if (pelotao === '6km') return '#eab308'
    if (pelotao === '8km') return '#ff2c03'
    return '#6b7280'
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 px-4 sm:px-6 py-4 sticky top-0 z-50 bg-black/95 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="https://cdn.shopify.com/s/files/1/0788/1932/8253/files/Logo_Nova_Somma_Branca_Laranja.svg?v=1772736456"
              alt="Somma Running Club"
              className="h-7 w-auto"
            />
            <div className="hidden sm:block w-px h-5 bg-zinc-700" />
            <span className="hidden sm:block text-zinc-400 text-sm">Dashboard Parceiro</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-zinc-500 text-xs hidden sm:block">Olá, <span className="text-white font-medium">{parceiro.nome}</span></span>
            <button
              onClick={buscarDados}
              disabled={loading}
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all text-zinc-400 hover:text-white"
              title="Atualizar dados"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Loading */}
        {loading && !dados && (
          <div className="flex items-center justify-center py-24">
            <RefreshCw className="w-8 h-8 text-[#ff2c03] animate-spin" />
          </div>
        )}

        {/* Erro */}
        {erro && (
          <div className="bg-red-900/20 border border-red-500/40 rounded-xl p-4 text-red-400 text-sm text-center">
            {erro}
          </div>
        )}

        {dados && (
          <>
            {/* Cabeçalho do evento */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <p className="text-[#ff2c03] text-xs font-semibold uppercase tracking-widest mb-1">Evento atual</p>
                <h2 className="text-xl sm:text-2xl font-bold text-white">{dados.evento.nome}</h2>
                <p className="text-zinc-500 text-sm mt-0.5">{formatarData(dados.evento.data)}</p>
              </div>
              {ultimaAtt && (
                <p className="text-zinc-600 text-xs">
                  Atualizado às {ultimaAtt.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </div>

            {/* Cards principais */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <StatCard label="Total Confirmados" value={dados.total} icon={Users} destaque />
              <StatCard label="Check-ins Validados" value={dados.validados} icon={CheckCircle} />
              <StatCard label="Aguardando Validação" value={dados.pendentes} icon={Clock} />
              <StatCard
                label="Taxa de Validação"
                value={dados.total > 0 ? `${Math.round((dados.validados / dados.total) * 100)}%` : '0%'}
                icon={TrendingUp}
              />
            </div>

            {/* Pelotão e Sexo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Por Pelotão */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#ff2c03]" />
                  Distribuição por Pelotão
                </h3>
                <div className="space-y-3">
                  {Object.keys(dados.porPelotao).length === 0 ? (
                    <p className="text-zinc-600 text-sm">Nenhum dado</p>
                  ) : (
                    Object.entries(dados.porPelotao)
                      .sort((a, b) => b[1] - a[1])
                      .map(([pelotao, qtd]) => (
                        <BarraProgresso
                          key={pelotao}
                          label={pelotao}
                          valor={qtd}
                          total={dados.total}
                          cor={corPelotao(pelotao)}
                        />
                      ))
                  )}
                </div>
              </div>

              {/* Por Sexo */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#ff2c03]" />
                  Distribuição por Sexo
                </h3>
                <div className="space-y-3">
                  {Object.keys(dados.porSexo).length === 0 ? (
                    <p className="text-zinc-600 text-sm">Nenhum dado</p>
                  ) : (
                    Object.entries(dados.porSexo)
                      .sort((a, b) => b[1] - a[1])
                      .map(([sexo, qtd]) => (
                        <BarraProgresso
                          key={sexo}
                          label={sexo}
                          valor={qtd}
                          total={dados.total}
                          cor={corSexo(sexo)}
                        />
                      ))
                  )}
                </div>
              </div>
            </div>

            {/* Fluxo de check-ins por horário */}
            {Object.keys(dados.porHora).length > 0 && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#ff2c03]" />
                  Fluxo de Check-ins por Horário
                </h3>
                <div className="space-y-2">
                  {Object.entries(dados.porHora)
                    .sort((a, b) => a[0].localeCompare(b[0]))
                    .map(([hora, qtd]) => (
                      <BarraProgresso
                        key={hora}
                        label={hora}
                        valor={qtd}
                        total={Math.max(...Object.values(dados.porHora))}
                      />
                    ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}

// ─── Página Principal ─────────────────────────────────────────────────────────
export default function ParceiroPagina() {
  const [parceiro, setParceiro] = useState<Parceiro | null>(null)

  return parceiro ? (
    <Dashboard parceiro={parceiro} onLogout={() => setParceiro(null)} />
  ) : (
    <TelaLogin onLogin={setParceiro} />
  )
}
