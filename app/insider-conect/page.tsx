'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Search, LogOut, Users, ClipboardList, CheckSquare,
  MessageCircle, Check, X, ShieldCheck, ChevronRight,
  ArrowLeft, Loader2, RefreshCw, Lock,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Insider = { id: string; nome: string }

type Membro = {
  id: number
  nome_completo: string
  email: string
  whatsapp: string
  cpf: string
  sexo: string
  data_nascimento: string
  cep: string
  data_de_cadastro: string
}

type Checkin = {
  id: string
  nome_completo: string
  email: string
  telefone: string
  cpf: string
  sexo: string
  pelotao: string
  nome_do_evento: string
  data_do_evento: string
  data_hora_checkin: string
  validacao_do_checkin: boolean
}

type Modulo = 'home' | 'membros' | 'checkins' | 'validar'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCPF(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 11)
  return d
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

function formatDate(d: string) {
  if (!d) return '—'
  const date = new Date(d)
  return date.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })
}

function formatDateTime(d: string) {
  if (!d) return '—'
  const date = new Date(d)
  return date.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
}

// ─── Tela de Login ────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (insider: Insider) => void }) {
  const [cpf, setCpf] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setLoading(true)
    try {
      const res = await fetch('/api/insider/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpf: cpf.replace(/\D/g, '') }),
      })
      const data = await res.json()
      if (!res.ok) { setErro(data.error || 'Acesso negado.'); return }
      onLogin(data.insider)
    } catch {
      setErro('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, #1a0a00 0%, #0d0d0d 50%, #000000 100%)' }}
    >
      {/* Ondas animadas */}
      <style>{`
        .ocean {
          height: 120px;
          width: 100%;
          position: absolute;
          bottom: 0;
          left: 0;
          background: #1a0500;
        }
        .wave {
          background: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/85486/wave.svg) repeat-x;
          position: absolute;
          top: -80px;
          width: 6400px;
          height: 100px;
          animation: wave 7s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite;
          transform: translate3d(0, 0, 0);
          opacity: 0.3;
          filter: hue-rotate(330deg) saturate(3) brightness(0.6);
        }
        .wave:nth-of-type(2) {
          top: -65px;
          animation: wave 7s cubic-bezier(0.36, 0.45, 0.63, 0.53) -0.125s infinite, swell 7s ease -1.25s infinite;
          opacity: 0.2;
          filter: hue-rotate(330deg) saturate(4) brightness(0.5);
        }
        @keyframes wave {
          0% { margin-left: 0; }
          100% { margin-left: -1600px; }
        }
        @keyframes swell {
          0%, 100% { transform: translate3d(0, -15px, 0); }
          50% { transform: translate3d(0, 5px, 0); }
        }
      `}</style>

      <div className="ocean">
        <div className="wave" />
        <div className="wave" />
      </div>

      {/* Card de login */}
      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src="https://cdn.shopify.com/s/files/1/0788/1932/8253/files/Logo_Nova_Somma_Branca_Laranja.svg?v=1772736456"
              alt="Somma Running Club"
              className="h-12 w-auto"
            />
          </div>
          <p className="text-[#ff2c03] text-xs font-semibold uppercase tracking-widest mb-1">Acesso Restrito</p>
          <h1 className="text-2xl font-bold text-white">Insider Connect</h1>
          <p className="text-zinc-500 text-sm mt-1">Painel de controle Somma Club</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-zinc-400 uppercase tracking-wide mb-1.5 font-medium">
              CPF do Insider
            </label>
            <input
              type="text"
              value={formatCPF(cpf)}
              onChange={e => setCpf(e.target.value.replace(/\D/g, ''))}
              placeholder="000.000.000-00"
              maxLength={14}
              autoFocus
              className="w-full bg-zinc-900/80 backdrop-blur-sm border-2 border-zinc-700 focus:border-[#ff2c03] text-white placeholder:text-zinc-600 rounded-xl px-4 py-3.5 text-sm outline-none transition-all font-mono"
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
            disabled={loading || cpf.replace(/\D/g, '').length < 11}
            className="w-full bg-[#ff2c03] hover:bg-[#cc2402] disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 text-sm disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            {loading ? 'Verificando...' : 'Acessar Painel'}
          </button>
        </form>
      </div>
    </main>
  )
}

// ─── Módulo: Membros ──────────────────────────────────────────────────────────

function ModuloMembros() {
  const [membros, setMembros] = useState<Membro[]>([])
  const [busca, setBusca] = useState('')
  const [loading, setLoading] = useState(false)
  const [membroSelecionado, setMembroSelecionado] = useState<Membro | null>(null)
  const [msgWpp, setMsgWpp] = useState('')

  const buscarMembros = useCallback(async (q: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/insider/membros?busca=${encodeURIComponent(q)}`)
      const data = await res.json()
      setMembros(data.membros || [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { buscarMembros('') }, [buscarMembros])

  useEffect(() => {
    const t = setTimeout(() => buscarMembros(busca), 400)
    return () => clearTimeout(t)
  }, [busca, buscarMembros])

  function abrirWhatsApp(membro: Membro) {
    if (!membro.whatsapp || !msgWpp.trim()) return
    const numero = membro.whatsapp.replace(/\D/g, '')
    const url = `https://wa.me/55${numero}?text=${encodeURIComponent(msgWpp)}`
    window.open(url, '_blank')
  }

  if (membroSelecionado) {
    return (
      <div className="space-y-4">
        <button onClick={() => setMembroSelecionado(null)} className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar à lista
        </button>

        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5 space-y-4">
          <div>
            <p className="text-[#ff2c03] text-xs font-semibold uppercase tracking-widest mb-1">Membro</p>
            <h2 className="text-white text-xl font-bold">{membroSelecionado.nome_completo}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: 'E-mail', valor: membroSelecionado.email },
              { label: 'WhatsApp', valor: membroSelecionado.whatsapp },
              { label: 'CPF', valor: membroSelecionado.cpf },
              { label: 'Sexo', valor: membroSelecionado.sexo },
              { label: 'Data de Nascimento', valor: membroSelecionado.data_nascimento },
              { label: 'CEP', valor: membroSelecionado.cep },
              { label: 'Cadastro em', valor: membroSelecionado.data_de_cadastro },
            ].map(({ label, valor }) => (
              <div key={label} className="bg-zinc-800/50 rounded-xl p-3">
                <p className="text-zinc-500 text-xs mb-0.5">{label}</p>
                <p className="text-white text-sm font-medium">{valor || '—'}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-zinc-800 pt-4">
            <p className="text-zinc-400 text-xs uppercase tracking-widest mb-2 font-medium">Enviar mensagem WhatsApp</p>
            <textarea
              value={msgWpp}
              onChange={e => setMsgWpp(e.target.value)}
              placeholder="Digite a mensagem para enviar..."
              rows={3}
              className="w-full bg-zinc-800 border border-zinc-700 focus:border-[#ff2c03] text-white placeholder:text-zinc-600 rounded-xl px-4 py-3 text-sm outline-none transition-all resize-none"
            />
            <button
              onClick={() => abrirWhatsApp(membroSelecionado)}
              disabled={!membroSelecionado.whatsapp || !msgWpp.trim()}
              className="mt-2 w-full bg-green-600 hover:bg-green-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-sm disabled:cursor-not-allowed"
            >
              <MessageCircle className="w-4 h-4" /> Abrir WhatsApp
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Buscar por nome, e-mail, CPF ou WhatsApp..."
            className="w-full bg-zinc-900 border border-zinc-700 focus:border-[#ff2c03] text-white placeholder:text-zinc-600 rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all"
          />
        </div>
        <button onClick={() => buscarMembros(busca)} className="p-3 bg-zinc-900 border border-zinc-700 rounded-xl text-zinc-400 hover:text-white hover:border-zinc-500 transition-all">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="text-xs text-zinc-500">{membros.length} membro(s) encontrado(s)</div>

      <div className="space-y-2">
        {loading && membros.length === 0 ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-zinc-500" /></div>
        ) : membros.map(m => (
          <button
            key={m.id}
            onClick={() => setMembroSelecionado(m)}
            className="w-full text-left bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-xl p-4 transition-all group"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{m.nome_completo}</p>
                <p className="text-zinc-500 text-xs mt-0.5 truncate">{m.email}</p>
                <div className="flex items-center gap-3 mt-1">
                  {m.whatsapp && <span className="text-zinc-600 text-xs">{m.whatsapp}</span>}
                  {m.sexo && <span className="text-zinc-600 text-xs capitalize">{m.sexo}</span>}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 flex-shrink-0 transition-colors" />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Módulo: Consultar Checkins ───────────────────────────────────────────────

function ModuloCheckins() {
  const [checkins, setCheckins] = useState<Checkin[]>([])
  const [evento, setEvento] = useState<{ nome_do_evento: string; data_do_evento: string } | null>(null)
  const [busca, setBusca] = useState('')
  const [loading, setLoading] = useState(false)

  const buscarCheckins = useCallback(async (q: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/insider/checkins?busca=${encodeURIComponent(q)}`)
      const data = await res.json()
      setCheckins(data.checkins || [])
      setEvento(data.evento || null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { buscarCheckins('') }, [buscarCheckins])

  useEffect(() => {
    const t = setTimeout(() => buscarCheckins(busca), 400)
    return () => clearTimeout(t)
  }, [busca, buscarCheckins])

  const validados = checkins.filter(c => c.validacao_do_checkin).length
  const pendentes = checkins.filter(c => !c.validacao_do_checkin).length

  return (
    <div className="space-y-4">
      {evento && (
        <div className="bg-[#ff2c03]/10 border border-[#ff2c03]/20 rounded-xl px-4 py-3">
          <p className="text-[#ff2c03] text-xs font-semibold uppercase tracking-widest">Evento mais recente</p>
          <p className="text-white font-semibold text-sm mt-0.5">{evento.nome_do_evento}</p>
          <p className="text-zinc-400 text-xs">{formatDate(evento.data_do_evento)}</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Total', valor: checkins.length, cor: 'text-white' },
          { label: 'Validados', valor: validados, cor: 'text-green-400' },
          { label: 'Pendentes', valor: pendentes, cor: 'text-yellow-400' },
        ].map(({ label, valor, cor }) => (
          <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center">
            <p className={`text-2xl font-bold ${cor}`}>{valor}</p>
            <p className="text-zinc-500 text-xs mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Buscar por nome, CPF ou e-mail..."
            className="w-full bg-zinc-900 border border-zinc-700 focus:border-[#ff2c03] text-white placeholder:text-zinc-600 rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all"
          />
        </div>
        <button onClick={() => buscarCheckins(busca)} className="p-3 bg-zinc-900 border border-zinc-700 rounded-xl text-zinc-400 hover:text-white hover:border-zinc-500 transition-all">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-2">
        {loading && checkins.length === 0 ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-zinc-500" /></div>
        ) : checkins.map(c => (
          <div key={c.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-white font-medium text-sm">{c.nome_completo}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.validacao_do_checkin ? 'bg-green-900/40 text-green-400' : 'bg-yellow-900/40 text-yellow-400'}`}>
                    {c.validacao_do_checkin ? 'Validado' : 'Pendente'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
                  <span className="text-zinc-500 text-xs">{c.email}</span>
                  <span className="text-zinc-500 text-xs">{c.telefone}</span>
                  <span className="text-zinc-600 text-xs font-mono">{c.cpf}</span>
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                  {c.pelotao && (
                    <span className="text-xs bg-[#ff2c03]/10 text-[#ff2c03] px-2 py-0.5 rounded-full">{c.pelotao}</span>
                  )}
                  <span className="text-zinc-600 text-xs">{formatDateTime(c.data_hora_checkin)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Módulo: Validar Checkins ─────────────────────────────────────────────────

function ModuloValidar() {
  const [checkins, setCheckins] = useState<Checkin[]>([])
  const [evento, setEvento] = useState<{ nome_do_evento: string; data_do_evento: string } | null>(null)
  const [busca, setBusca] = useState('')
  const [loading, setLoading] = useState(false)
  const [validando, setValidando] = useState<string | null>(null)

  const buscarCheckins = useCallback(async (q: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/insider/validar?busca=${encodeURIComponent(q)}`)
      const data = await res.json()
      setCheckins(data.checkins || [])
      setEvento(data.evento || null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { buscarCheckins('') }, [buscarCheckins])

  useEffect(() => {
    const t = setTimeout(() => buscarCheckins(busca), 400)
    return () => clearTimeout(t)
  }, [busca, buscarCheckins])

  async function toggleValidacao(id: string, atual: boolean) {
    setValidando(id)
    try {
      await fetch('/api/insider/validar', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, validacao_do_checkin: !atual }),
      })
      setCheckins(prev =>
        prev.map(c => c.id === id ? { ...c, validacao_do_checkin: !atual } : c)
      )
    } finally {
      setValidando(null)
    }
  }

  const validados = checkins.filter(c => c.validacao_do_checkin).length

  return (
    <div className="space-y-4">
      {evento && (
        <div className="bg-[#ff2c03]/10 border border-[#ff2c03]/20 rounded-xl px-4 py-3">
          <p className="text-[#ff2c03] text-xs font-semibold uppercase tracking-widest">Validando evento</p>
          <p className="text-white font-semibold text-sm mt-0.5">{evento.nome_do_evento}</p>
          <p className="text-zinc-400 text-xs">{formatDate(evento.data_do_evento)}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-white">{checkins.length}</p>
          <p className="text-zinc-500 text-xs mt-0.5">Total check-ins</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-green-400">{validados}</p>
          <p className="text-zinc-500 text-xs mt-0.5">Pulseiras liberadas</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Buscar por nome ou CPF..."
            className="w-full bg-zinc-900 border border-zinc-700 focus:border-[#ff2c03] text-white placeholder:text-zinc-600 rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all"
          />
        </div>
        <button onClick={() => buscarCheckins(busca)} className="p-3 bg-zinc-900 border border-zinc-700 rounded-xl text-zinc-400 hover:text-white hover:border-zinc-500 transition-all">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-2">
        {loading && checkins.length === 0 ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-zinc-500" /></div>
        ) : checkins.map(c => (
          <div
            key={c.id}
            className={`border rounded-xl p-4 transition-all ${c.validacao_do_checkin ? 'bg-green-900/10 border-green-800/40' : 'bg-zinc-900 border-zinc-800'}`}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleValidacao(c.id, c.validacao_do_checkin)}
                disabled={validando === c.id}
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                  c.validacao_do_checkin
                    ? 'bg-green-500 hover:bg-red-500'
                    : 'bg-zinc-800 hover:bg-green-600'
                } disabled:opacity-50`}
              >
                {validando === c.id
                  ? <Loader2 className="w-4 h-4 animate-spin text-white" />
                  : c.validacao_do_checkin
                    ? <Check className="w-4 h-4 text-white" />
                    : <X className="w-4 h-4 text-zinc-400" />
                }
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm">{c.nome_completo}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-zinc-500 text-xs font-mono">{c.cpf}</span>
                  {c.pelotao && <span className="text-xs text-[#ff2c03]">{c.pelotao}</span>}
                </div>
                <p className={`text-xs mt-0.5 font-medium ${c.validacao_do_checkin ? 'text-green-400' : 'text-zinc-500'}`}>
                  {c.validacao_do_checkin ? 'Pulseira liberada' : 'Aguardando validacao'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Painel Principal ─────────────────────────────────────────────────────────

function Painel({ insider, onLogout }: { insider: Insider; onLogout: () => void }) {
  const [modulo, setModulo] = useState<Modulo>('home')

  const modulos = [
    {
      id: 'membros' as Modulo,
      titulo: 'Buscar Membros',
      descricao: 'Consulte e visualize todos os membros cadastrados no Somma Club',
      icone: Users,
    },
    {
      id: 'checkins' as Modulo,
      titulo: 'Consultar CPF Check-in',
      descricao: 'Veja todos os check-ins do evento mais recente',
      icone: ClipboardList,
    },
    {
      id: 'validar' as Modulo,
      titulo: 'Validar Check-in',
      descricao: 'Libere pulseiras validando o check-in dos participantes',
      icone: CheckSquare,
    },
  ]

  const moduloAtual = modulos.find(m => m.id === modulo)

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-black/95 backdrop-blur-sm sticky top-0 z-50 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {modulo !== 'home' && (
              <button onClick={() => setModulo('home')} className="p-1.5 rounded-lg hover:bg-zinc-800 transition-colors">
                <ArrowLeft className="w-4 h-4 text-zinc-400" />
              </button>
            )}
            <div>
              <p className="text-[#ff2c03] text-xs font-semibold uppercase tracking-widest leading-none">Insider Connect</p>
              <p className="text-white text-sm font-semibold">
                {modulo === 'home' ? `Olá, ${insider.nome.split(' ')[0]}` : moduloAtual?.titulo}
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-zinc-500 hover:text-white text-xs transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Sair
          </button>
        </div>
      </header>

      {/* Conteúdo */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        {modulo === 'home' ? (
          <div className="space-y-3">
            <p className="text-zinc-500 text-sm mb-6">Selecione um módulo para continuar</p>
            {modulos.map(m => {
              const Icone = m.icone
              return (
                <button
                  key={m.id}
                  onClick={() => setModulo(m.id)}
                  className="w-full text-left bg-zinc-900 border border-zinc-800 hover:border-[#ff2c03]/40 hover:bg-zinc-800/50 rounded-2xl p-5 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#ff2c03]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#ff2c03]/20 transition-colors">
                      <Icone className="w-5 h-5 text-[#ff2c03]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm">{m.titulo}</p>
                      <p className="text-zinc-500 text-xs mt-0.5 leading-relaxed">{m.descricao}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 flex-shrink-0 transition-colors" />
                  </div>
                </button>
              )
            })}
          </div>
        ) : modulo === 'membros' ? (
          <ModuloMembros />
        ) : modulo === 'checkins' ? (
          <ModuloCheckins />
        ) : (
          <ModuloValidar />
        )}
      </div>
    </main>
  )
}

// ─── Export Principal ─────────────────────────────────────────────────────────

export default function InsiderConect() {
  const [insider, setInsider] = useState<Insider | null>(null)

  return insider
    ? <Painel insider={insider} onLogout={() => setInsider(null)} />
    : <LoginScreen onLogin={setInsider} />
}
