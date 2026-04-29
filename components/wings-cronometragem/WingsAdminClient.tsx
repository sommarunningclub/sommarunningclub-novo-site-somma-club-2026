'use client'

import { useEffect, useState } from 'react'
import {
  Lock, LogOut, Plus, Trash2, Users, Trophy, Save, AlertCircle,
  ChevronDown, X, Eye, EyeOff,
} from 'lucide-react'
import Cronometro from './Cronometro'
import { msParaDisplay, displayParaMs, segundosParaMs, MODALIDADES } from '@/lib/wings-cronometragem/tempo'
import type { AtleticaComp, AtletaComp } from '@/lib/wings-cronometragem/types'
import type { Fase, Sexo, Modalidade } from '@/lib/wings-cronometragem/tempo'

const fontDisplay = { fontFamily: 'var(--font-bebas), sans-serif' }
const fontBody = { fontFamily: 'var(--font-dm-sans-wfl), sans-serif' }

type Toast = { tipo: 'ok' | 'erro'; msg: string } | null
type Aba = 'registrar' | 'equipes'

export default function WingsAdminClient() {
  const [logado, setLogado] = useState<boolean | null>(null)
  const [senha, setSenha] = useState('')
  const [showSenha, setShowSenha] = useState(false)
  const [erroLogin, setErroLogin] = useState('')
  const [loadingLogin, setLoadingLogin] = useState(false)

  const [atleticas, setAtleticas] = useState<AtleticaComp[]>([])
  const [atletasPorAtletica, setAtletasPorAtletica] = useState<Record<string, AtletaComp[]>>({})
  const [toast, setToast] = useState<Toast>(null)

  // Em mobile usamos abas; em iPad/desktop, layout 2 colunas. Default mobile = registrar (uso principal no dia).
  const [aba, setAba] = useState<Aba>('registrar')

  // Detecta sessão e carrega dados
  useEffect(() => {
    let cancelado = false
    async function probe() {
      const r = await fetch('/api/wings-comp/atleticas?id=00000000-0000-0000-0000-000000000000', {
        method: 'DELETE',
      }).catch(() => null)
      if (cancelado) return
      setLogado(r != null && r.status !== 401)
    }
    probe()
    carregarTudo(cancelado)
    return () => { cancelado = true }
  }, [])

  function carregarTudo(cancelado: boolean) {
    fetch('/api/wings-comp/atleticas')
      .then(r => r.json())
      .then(j => !cancelado && setAtleticas(j.atleticas ?? []))
      .catch(() => {})
    fetch('/api/wings-comp/atletas')
      .then(r => r.json())
      .then(j => {
        if (cancelado) return
        const lista: AtletaComp[] = j.atletas ?? []
        const agrupado: Record<string, AtletaComp[]> = {}
        for (const a of lista) {
          ;(agrupado[a.atletica_id] ??= []).push(a)
        }
        setAtletasPorAtletica(agrupado)
      })
      .catch(() => {})
  }

  function showToast(t: NonNullable<Toast>) {
    setToast(t)
    setTimeout(() => setToast(null), 3500)
  }

  async function fazerLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoadingLogin(true)
    setErroLogin('')
    try {
      const res = await fetch('/api/wings-comp/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senha }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        setErroLogin(j.error || 'Senha incorreta.')
        return
      }
      setLogado(true)
    } finally {
      setLoadingLogin(false)
    }
  }

  async function logout() {
    if (!confirm('Sair do painel?')) return
    await fetch('/api/wings-comp/auth', { method: 'DELETE' })
    setLogado(false)
    setSenha('')
  }

  async function recarregarAtleticas() {
    const j = await fetch('/api/wings-comp/atleticas').then(r => r.json())
    setAtleticas(j.atleticas ?? [])
  }

  async function recarregarAtletas(atletica_id: string) {
    const j = await fetch(`/api/wings-comp/atletas?atletica_id=${atletica_id}`).then(r => r.json())
    setAtletasPorAtletica(prev => ({ ...prev, [atletica_id]: j.atletas ?? [] }))
  }

  if (logado === null) {
    return (
      <main className="min-h-[100dvh] bg-wfl-navy text-white flex items-center justify-center" style={fontBody}>
        <p className="text-white/60">Carregando…</p>
      </main>
    )
  }

  if (!logado) {
    return (
      <main className="min-h-[100dvh] bg-wfl-navy text-white flex items-center justify-center px-4" style={fontBody}>
        <form
          onSubmit={fazerLogin}
          className="w-full max-w-sm bg-white/5 border border-white/10 p-6 sm:p-8"
          style={{ paddingTop: 'max(env(safe-area-inset-top), 1.5rem)' }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Lock className="w-5 h-5 text-wfl-yellow" />
            <span className="text-xs tracking-[0.3em] uppercase text-wfl-yellow font-bold">Acesso Somma</span>
          </div>
          <h1 className="text-3xl sm:text-4xl uppercase leading-none" style={fontDisplay}>
            Cronometragem
          </h1>
          <p className="mt-2 text-sm text-white/60">Painel restrito da equipe Somma.</p>
          <label htmlFor="senha-input" className="block mt-6 text-xs uppercase tracking-wider text-white/70">
            Senha
          </label>
          <div className="relative mt-1.5">
            <input
              id="senha-input"
              type={showSenha ? 'text' : 'password'}
              value={senha}
              onChange={e => setSenha(e.target.value)}
              autoComplete="current-password"
              className="w-full bg-black/30 border border-white/15 px-4 py-3 pr-11 text-base text-white outline-none focus:border-wfl-yellow"
              required
            />
            <button
              type="button"
              onClick={() => setShowSenha(s => !s)}
              className="absolute right-0 top-0 h-full w-11 flex items-center justify-center text-white/50 hover:text-white"
              aria-label={showSenha ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {erroLogin && (
            <p className="mt-2 text-sm text-wfl-red flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> {erroLogin}
            </p>
          )}
          <button
            type="submit"
            disabled={loadingLogin}
            className="mt-5 w-full min-h-12 bg-wfl-red hover:bg-wfl-red/90 active:bg-wfl-red/80 disabled:opacity-50 text-white text-sm font-bold tracking-[0.2em] uppercase transition-colors"
          >
            {loadingLogin ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </main>
    )
  }

  return (
    <main className="min-h-[100dvh] bg-wfl-navy text-white" style={fontBody}>
      {/* Header */}
      <header
        className="border-b border-white/10 bg-black/40 sticky top-0 z-20 backdrop-blur"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-wfl-yellow font-bold">Acesso Somma</p>
            <h1 className="text-lg sm:text-2xl uppercase leading-none truncate" style={fontDisplay}>
              Cronometragem
            </h1>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <a
              href="/wings/ranking"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center min-h-9 min-w-9 sm:px-3 sm:gap-1.5 text-xs font-semibold uppercase tracking-wider text-wfl-yellow hover:bg-white/5 rounded transition-colors"
              aria-label="Abrir ranking ao vivo"
              title="Ranking ao vivo"
            >
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Ranking</span>
            </a>
            <button
              onClick={logout}
              className="inline-flex items-center justify-center min-h-9 min-w-9 sm:px-3 sm:gap-1.5 text-xs text-white/60 hover:text-white hover:bg-white/5 rounded transition-colors"
              aria-label="Sair"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>

        {/* Tabs (só em mobile) */}
        <nav className="md:hidden border-t border-white/10 grid grid-cols-2" role="tablist">
          {([
            { id: 'registrar', label: 'Registrar Run', Icon: Trophy },
            { id: 'equipes', label: 'Equipes', Icon: Users },
          ] as const).map(t => (
            <button
              key={t.id}
              role="tab"
              aria-selected={aba === t.id}
              onClick={() => setAba(t.id)}
              className={`min-h-12 inline-flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                aba === t.id
                  ? 'bg-wfl-red text-white'
                  : 'text-white/60 hover:bg-white/5'
              }`}
            >
              <t.Icon className="w-4 h-4" /> {t.label}
              {t.id === 'equipes' && atleticas.length > 0 && (
                <span className="ml-1 inline-flex items-center justify-center min-w-5 h-5 px-1 bg-white/20 text-[10px]">
                  {atleticas.length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </header>

      <div
        className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)' }}
      >
        {/* Em mobile mostra só a aba ativa; md+ mostra as duas colunas */}
        <div className={`${aba === 'equipes' ? 'block' : 'hidden'} md:block md:order-2`}>
          <ColunaAtleticas
            atleticas={atleticas}
            atletasPorAtletica={atletasPorAtletica}
            onAtleticaChange={recarregarAtleticas}
            onAtletaChange={recarregarAtletas}
            showToast={showToast}
          />
        </div>
        <div className={`${aba === 'registrar' ? 'block' : 'hidden'} md:block md:order-1`}>
          <ColunaRegistrarRun
            atleticas={atleticas}
            atletasPorAtletica={atletasPorAtletica}
            showToast={showToast}
          />
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed left-1/2 -translate-x-1/2 px-4 py-3 text-sm font-semibold border shadow-2xl z-30 ${
            toast.tipo === 'ok'
              ? 'bg-emerald-600 border-emerald-500 text-white'
              : 'bg-wfl-red border-wfl-red text-white'
          }`}
          style={{ bottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}
        >
          {toast.msg}
        </div>
      )}
    </main>
  )
}

// =====================================================================
// COLUNA — Gestão de Atléticas e Atletas
// =====================================================================

function ColunaAtleticas({
  atleticas,
  atletasPorAtletica,
  onAtleticaChange,
  onAtletaChange,
  showToast,
}: {
  atleticas: AtleticaComp[]
  atletasPorAtletica: Record<string, AtletaComp[]>
  onAtleticaChange: () => Promise<void>
  onAtletaChange: (atletica_id: string) => Promise<void>
  showToast: (t: { tipo: 'ok' | 'erro'; msg: string }) => void
}) {
  const [modalAtletica, setModalAtletica] = useState(false)
  const [modalAtleta, setModalAtleta] = useState<AtleticaComp | null>(null)
  const [expandida, setExpandida] = useState<string | null>(null)

  async function removerAtletica(a: AtleticaComp) {
    if (!confirm(`Remover a atlética "${a.nome}"?\nIsso apaga atletas e runs associados.`)) return
    const res = await fetch(`/api/wings-comp/atleticas?id=${a.id}`, { method: 'DELETE' })
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      showToast({ tipo: 'erro', msg: j.error || 'Erro ao remover.' })
      return
    }
    showToast({ tipo: 'ok', msg: `Atlética removida.` })
    await onAtleticaChange()
  }

  return (
    <section className="bg-white/5 border border-white/10 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg sm:text-2xl uppercase leading-none flex items-center gap-2" style={fontDisplay}>
          <Users className="w-5 h-5 text-wfl-yellow" /> Equipes
          <span className="text-xs sm:text-sm text-white/40 font-normal" style={fontBody}>
            ({atleticas.length})
          </span>
        </h2>
        <button
          onClick={() => setModalAtletica(true)}
          className="inline-flex items-center gap-1.5 bg-wfl-red hover:bg-wfl-red/90 active:bg-wfl-red/80 text-white px-3 py-2 min-h-9 text-xs font-bold uppercase tracking-wider transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Nova
        </button>
      </div>

      <ul className="mt-4 space-y-2">
        {atleticas.length === 0 && (
          <li className="text-sm text-white/40 text-center py-8 border border-dashed border-white/10">
            Nenhuma equipe ainda. Toque em <strong className="text-white/60">Nova</strong> pra começar.
          </li>
        )}
        {atleticas.map(a => {
          const atletas = atletasPorAtletica[a.id] ?? []
          const masc = atletas.filter(at => at.sexo === 'M').length
          const fem = atletas.filter(at => at.sexo === 'F').length
          const completo = masc === 2 && fem === 2
          const aberta = expandida === a.id

          return (
            <li key={a.id} className="bg-black/20 border border-white/10">
              <div className="flex items-stretch">
                <span
                  className="w-1.5 flex-shrink-0"
                  style={{ backgroundColor: a.cor }}
                  aria-hidden
                />
                <button
                  onClick={() => setExpandida(aberta ? null : a.id)}
                  className="flex-1 flex items-center gap-3 px-3 py-3 min-h-12 text-left hover:bg-white/5 transition-colors"
                  aria-expanded={aberta}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm sm:text-base font-semibold truncate">{a.nome}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] uppercase tracking-wider">
                      {a.sigla && <span className="text-white/40">{a.sigla}</span>}
                      <span
                        className={`inline-flex items-center gap-1 ${
                          completo ? 'text-emerald-400' : 'text-white/40'
                        }`}
                      >
                        {masc}M · {fem}F
                        {completo && <span aria-hidden>✓</span>}
                      </span>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-white/40 transition-transform ${aberta ? 'rotate-180' : ''}`}
                    aria-hidden
                  />
                </button>
                <button
                  onClick={() => removerAtletica(a)}
                  className="px-3 min-h-12 flex items-center justify-center text-white/40 hover:text-wfl-red hover:bg-white/5 transition-colors"
                  aria-label={`Remover ${a.nome}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {aberta && (
                <ListaAtletas
                  atletica={a}
                  atletas={atletas}
                  onAdd={() => setModalAtleta(a)}
                  onChange={() => onAtletaChange(a.id)}
                  showToast={showToast}
                />
              )}
            </li>
          )
        })}
      </ul>

      {modalAtletica && (
        <ModalNovaAtletica
          onClose={() => setModalAtletica(false)}
          onSaved={async (nova) => {
            showToast({ tipo: 'ok', msg: `✅ Atlética ${nova.nome} cadastrada.` })
            setModalAtletica(false)
            await onAtleticaChange()
            setExpandida(nova.id)
          }}
          showToast={showToast}
        />
      )}
      {modalAtleta && (
        <ModalNovoAtleta
          atletica={modalAtleta}
          atletasExistentes={atletasPorAtletica[modalAtleta.id] ?? []}
          onClose={() => setModalAtleta(null)}
          onSaved={async (nome) => {
            showToast({ tipo: 'ok', msg: `✅ ${nome} adicionado.` })
            setModalAtleta(null)
            await onAtletaChange(modalAtleta.id)
          }}
          showToast={showToast}
        />
      )}
    </section>
  )
}

function ListaAtletas({
  atletica,
  atletas,
  onAdd,
  onChange,
  showToast,
}: {
  atletica: AtleticaComp
  atletas: AtletaComp[]
  onAdd: () => void
  onChange: () => Promise<void>
  showToast: (t: { tipo: 'ok' | 'erro'; msg: string }) => void
}) {
  async function remover(a: AtletaComp) {
    if (!confirm(`Remover ${a.nome}?`)) return
    const res = await fetch(`/api/wings-comp/atletas?id=${a.id}`, { method: 'DELETE' })
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      showToast({ tipo: 'erro', msg: j.error || 'Erro ao remover.' })
      return
    }
    await onChange()
  }

  return (
    <div className="px-3 pb-3 pt-1 border-t border-white/5">
      {atletas.length === 0 ? (
        <p className="text-xs text-white/40 text-center py-3">
          Sem atletas. Adicione 2M + 2F em modalidades distintas.
        </p>
      ) : (
        <ul className="space-y-1.5">
          {atletas
            .slice()
            .sort((a, b) => a.modalidade - b.modalidade)
            .map(a => {
              const mod = MODALIDADES.find(m => m.num === a.modalidade)
              return (
                <li
                  key={a.id}
                  className="flex items-center gap-2 bg-black/30 px-2.5 py-2 min-h-11 text-sm"
                >
                  <span
                    className={`w-7 h-7 flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                      a.sexo === 'M' ? 'bg-blue-500/30 text-blue-200' : 'bg-pink-500/30 text-pink-200'
                    }`}
                    aria-label={a.sexo === 'M' ? 'Masculino' : 'Feminino'}
                  >
                    {a.sexo}
                  </span>
                  <span
                    className="w-7 h-7 flex-shrink-0 flex items-center justify-center text-xs font-bold bg-wfl-yellow/20 text-wfl-yellow"
                    aria-label={`Modalidade ${a.modalidade}`}
                    title={mod?.nome}
                  >
                    {a.modalidade}
                  </span>
                  <span className="flex-1 truncate">{a.nome}</span>
                  <button
                    onClick={() => remover(a)}
                    className="w-9 h-9 flex items-center justify-center text-white/40 hover:text-wfl-red"
                    aria-label={`Remover ${a.nome}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              )
            })}
        </ul>
      )}
      <button
        onClick={onAdd}
        disabled={atletas.length >= 4}
        className="mt-2 w-full inline-flex items-center justify-center gap-1.5 min-h-11 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-wider transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        {atletas.length >= 4 ? 'Equipe completa (4 atletas)' : 'Adicionar atleta'}
      </button>
    </div>
  )
}

// =====================================================================
// MODAIS — Nova atlética / Novo atleta
// =====================================================================

function ModalShell({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  // Fecha com ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm px-3 sm:p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="relative w-full sm:max-w-md bg-wfl-navy border border-white/15 shadow-2xl"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-white/10">
          <h3 className="text-base sm:text-lg uppercase leading-none" style={fontDisplay}>
            {title}
          </h3>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center text-white/60 hover:text-white"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 sm:p-5">{children}</div>
      </div>
    </div>
  )
}

function ModalNovaAtletica({
  onClose,
  onSaved,
  showToast,
}: {
  onClose: () => void
  onSaved: (a: AtleticaComp) => void
  showToast: (t: { tipo: 'ok' | 'erro'; msg: string }) => void
}) {
  const [nome, setNome] = useState('')
  const [sigla, setSigla] = useState('')
  const [cor, setCor] = useState('#E30D3F')
  const [salvando, setSalvando] = useState(false)

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    setSalvando(true)
    try {
      const res = await fetch('/api/wings-comp/atleticas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, sigla, cor }),
      })
      const j = await res.json()
      if (!res.ok) {
        showToast({ tipo: 'erro', msg: j.error || 'Erro ao salvar.' })
        return
      }
      onSaved(j.atletica)
    } finally {
      setSalvando(false)
    }
  }

  return (
    <ModalShell onClose={onClose} title="Nova atlética">
      <form onSubmit={salvar} className="space-y-3">
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-white/60">Nome</label>
          <input
            required
            autoFocus
            value={nome}
            onChange={e => setNome(e.target.value)}
            placeholder="Ex: Halterada"
            className="mt-1 w-full min-h-12 bg-black/40 border border-white/15 px-3 text-base text-white outline-none focus:border-wfl-yellow"
          />
        </div>
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-white/60">Sigla</label>
            <input
              value={sigla}
              onChange={e => setSigla(e.target.value.toUpperCase())}
              placeholder="HAL"
              maxLength={6}
              className="mt-1 w-full min-h-12 bg-black/40 border border-white/15 px-3 text-base text-white outline-none focus:border-wfl-yellow"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-white/60">Cor</label>
            <input
              type="color"
              value={cor}
              onChange={e => setCor(e.target.value)}
              className="mt-1 w-16 h-12 bg-black/40 border border-white/15 cursor-pointer p-1"
              aria-label="Cor da atlética"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="min-h-12 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={salvando || !nome.trim()}
            className="min-h-12 bg-wfl-red hover:bg-wfl-red/90 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider transition-colors"
          >
            {salvando ? 'Salvando…' : 'Cadastrar'}
          </button>
        </div>
      </form>
    </ModalShell>
  )
}

function ModalNovoAtleta({
  atletica,
  atletasExistentes,
  onClose,
  onSaved,
  showToast,
}: {
  atletica: AtleticaComp
  atletasExistentes: AtletaComp[]
  onClose: () => void
  onSaved: (nome: string) => void
  showToast: (t: { tipo: 'ok' | 'erro'; msg: string }) => void
}) {
  const masc = atletasExistentes.filter(a => a.sexo === 'M').length
  const fem = atletasExistentes.filter(a => a.sexo === 'F').length
  const modalidadesUsadas = new Set(atletasExistentes.map(a => a.modalidade))

  // Defaults inteligentes — sugere o que ainda falta
  const sexoSugerido: Sexo = masc < 2 ? 'M' : 'F'
  const modSugerida: Modalidade =
    (([1, 2, 3, 4] as Modalidade[]).find(n => !modalidadesUsadas.has(n)) ?? 1) as Modalidade

  const [nome, setNome] = useState('')
  const [sexo, setSexo] = useState<Sexo>(sexoSugerido)
  const [modalidade, setModalidade] = useState<Modalidade>(modSugerida)
  const [salvando, setSalvando] = useState(false)

  const sexoMascCheio = masc >= 2
  const sexoFemCheio = fem >= 2

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    setSalvando(true)
    try {
      const res = await fetch('/api/wings-comp/atletas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ atletica_id: atletica.id, nome, sexo, modalidade }),
      })
      const j = await res.json()
      if (!res.ok) {
        showToast({ tipo: 'erro', msg: j.error || 'Erro ao salvar atleta.' })
        return
      }
      onSaved(j.atleta.nome)
    } finally {
      setSalvando(false)
    }
  }

  return (
    <ModalShell onClose={onClose} title={`Atleta · ${atletica.nome}`}>
      <p className="text-xs text-white/60 mb-4">
        {masc}M · {fem}F · {atletasExistentes.length}/4 atletas
      </p>
      <form onSubmit={salvar} className="space-y-4">
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-white/60">Nome</label>
          <input
            required
            autoFocus
            value={nome}
            onChange={e => setNome(e.target.value)}
            className="mt-1 w-full min-h-12 bg-black/40 border border-white/15 px-3 text-base text-white outline-none focus:border-wfl-yellow"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-wider text-white/60">Sexo</label>
          <div className="mt-1 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSexo('M')}
              disabled={sexoMascCheio}
              className={`min-h-12 text-sm font-bold uppercase tracking-wider transition-colors ${
                sexo === 'M'
                  ? 'bg-blue-500 text-white'
                  : 'bg-black/40 text-white/60 hover:bg-black/60 disabled:opacity-30 disabled:cursor-not-allowed'
              }`}
            >
              Masculino {masc}/2
            </button>
            <button
              type="button"
              onClick={() => setSexo('F')}
              disabled={sexoFemCheio}
              className={`min-h-12 text-sm font-bold uppercase tracking-wider transition-colors ${
                sexo === 'F'
                  ? 'bg-pink-500 text-white'
                  : 'bg-black/40 text-white/60 hover:bg-black/60 disabled:opacity-30 disabled:cursor-not-allowed'
              }`}
            >
              Feminino {fem}/2
            </button>
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-wider text-white/60">Modalidade</label>
          <div className="mt-1 grid grid-cols-1 gap-1.5">
            {MODALIDADES.map(m => {
              const usada = modalidadesUsadas.has(m.num as Modalidade)
              const ativa = modalidade === m.num
              return (
                <button
                  key={m.num}
                  type="button"
                  onClick={() => setModalidade(m.num as Modalidade)}
                  disabled={usada}
                  className={`flex items-center gap-2 px-3 min-h-11 text-left text-sm transition-colors ${
                    ativa
                      ? 'bg-wfl-yellow text-wfl-navy font-bold'
                      : 'bg-black/40 text-white/70 hover:bg-black/60 disabled:opacity-30 disabled:cursor-not-allowed'
                  }`}
                >
                  <span
                    className={`w-7 h-7 flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      ativa ? 'bg-wfl-navy text-wfl-yellow' : 'bg-white/10 text-wfl-yellow'
                    }`}
                  >
                    {m.num}
                  </span>
                  <span className="flex-1">{m.nome}</span>
                  {usada && <span className="text-[10px] uppercase tracking-wider">Em uso</span>}
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="min-h-12 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={salvando || !nome.trim()}
            className="min-h-12 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider transition-colors"
          >
            {salvando ? 'Salvando…' : 'Adicionar'}
          </button>
        </div>
      </form>
    </ModalShell>
  )
}

// =====================================================================
// COLUNA — Registrar Run
// =====================================================================

function ColunaRegistrarRun({
  atleticas,
  atletasPorAtletica,
  showToast,
}: {
  atleticas: AtleticaComp[]
  atletasPorAtletica: Record<string, AtletaComp[]>
  showToast: (t: { tipo: 'ok' | 'erro'; msg: string }) => void
}) {
  const [atleticaId, setAtleticaId] = useState('')
  const [fase, setFase] = useState<Fase>('classificatoria')
  const [tempoStr, setTempoStr] = useState('')
  const [pen, setPen] = useState<[string, string, string, string]>(['0', '0', '0', '0'])
  const [obs, setObs] = useState('')
  const [salvando, setSalvando] = useState(false)

  const tempoBrutoMs = displayParaMs(tempoStr)
  const tempoBrutoValido = !isNaN(tempoBrutoMs) && tempoBrutoMs > 0
  const penalidadesMs = pen.map(s => {
    const n = Number(String(s).replace(',', '.'))
    return isNaN(n) ? 0 : segundosParaMs(n)
  }) as [number, number, number, number]
  const totalPenalidades = penalidadesMs.reduce((a, b) => a + b, 0)
  const tempoFinalMs = tempoBrutoValido ? tempoBrutoMs + totalPenalidades : 0

  const atleticaSelecionada = atleticas.find(a => a.id === atleticaId)
  const atletasDaAtletica = atleticaId ? atletasPorAtletica[atleticaId] ?? [] : []
  const equipeIncompleta =
    atleticaId &&
    (atletasDaAtletica.filter(a => a.sexo === 'M').length < 2 ||
      atletasDaAtletica.filter(a => a.sexo === 'F').length < 2)

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    if (!atleticaId) {
      showToast({ tipo: 'erro', msg: 'Selecione uma atlética.' })
      return
    }
    if (!tempoBrutoValido) {
      showToast({ tipo: 'erro', msg: 'Tempo bruto inválido.' })
      return
    }
    setSalvando(true)
    try {
      const res = await fetch('/api/wings-comp/runs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          atletica_id: atleticaId,
          fase,
          tempo_bruto_ms: tempoBrutoMs,
          penalidade_1_ms: penalidadesMs[0],
          penalidade_2_ms: penalidadesMs[1],
          penalidade_3_ms: penalidadesMs[2],
          penalidade_4_ms: penalidadesMs[3],
          observacoes: obs,
        }),
      })
      const j = await res.json()
      if (!res.ok) {
        showToast({ tipo: 'erro', msg: j.error || 'Erro ao salvar run.' })
        return
      }
      showToast({ tipo: 'ok', msg: `✅ Run da ${atleticaSelecionada?.nome ?? 'equipe'} salvo!` })
      setTempoStr('')
      setPen(['0', '0', '0', '0'])
      setObs('')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <section className="bg-white/5 border border-white/10 p-4 sm:p-5">
      <h2 className="text-lg sm:text-2xl uppercase leading-none flex items-center gap-2" style={fontDisplay}>
        <Trophy className="w-5 h-5 text-wfl-yellow" /> Registrar Run
      </h2>

      <div className="mt-4">
        <Cronometro onTempoCapturado={ms => setTempoStr(msParaDisplay(ms))} />
      </div>

      <form onSubmit={salvar} className="mt-4 space-y-4">
        {/* Atlética */}
        <div>
          <label htmlFor="select-atletica" className="text-[10px] uppercase tracking-wider text-white/60">
            Atlética
          </label>
          <div className="relative">
            <select
              id="select-atletica"
              value={atleticaId}
              onChange={e => setAtleticaId(e.target.value)}
              required
              className="mt-1 w-full min-h-12 appearance-none bg-black/40 border border-white/15 pl-3 pr-9 text-base text-white outline-none focus:border-wfl-yellow"
            >
              <option value="">Selecione…</option>
              {atleticas.map(a => (
                <option key={a.id} value={a.id}>
                  {a.nome}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none mt-0.5" />
            {atleticaSelecionada && (
              <span
                className="absolute left-2 top-1/2 -translate-y-1/2 mt-0.5 w-2 h-2 rounded-full"
                style={{ backgroundColor: atleticaSelecionada.cor }}
                aria-hidden
              />
            )}
          </div>
          {equipeIncompleta && (
            <p className="mt-1 text-[10px] text-amber-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Equipe ainda não está completa (mínimo 2M + 2F).
            </p>
          )}
        </div>

        {/* Fase */}
        <div>
          <label className="text-[10px] uppercase tracking-wider text-white/60">Fase</label>
          <div className="mt-1 grid grid-cols-2 gap-2">
            {(['classificatoria', 'final'] as Fase[]).map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setFase(f)}
                className={`min-h-11 text-xs font-bold uppercase tracking-wider transition-colors ${
                  fase === f
                    ? 'bg-wfl-red text-white'
                    : 'bg-black/40 text-white/60 hover:bg-black/60'
                }`}
              >
                {f === 'classificatoria' ? 'Classificatória' : 'Final'}
              </button>
            ))}
          </div>
        </div>

        {/* Tempo bruto */}
        <div>
          <label htmlFor="input-tempo" className="text-[10px] uppercase tracking-wider text-white/60">
            Tempo bruto · MM:SS.ms
          </label>
          <input
            id="input-tempo"
            value={tempoStr}
            onChange={e => setTempoStr(e.target.value)}
            placeholder="01:23.456"
            inputMode="decimal"
            className="mt-1 w-full min-h-12 bg-black/40 border border-white/15 px-3 text-lg font-mono tabular-nums text-white outline-none focus:border-wfl-yellow"
          />
          {tempoStr && !tempoBrutoValido && (
            <p className="mt-1 text-[10px] text-wfl-red">Use o formato MM:SS.ms (ex: 01:23.456).</p>
          )}
        </div>

        {/* Penalidades */}
        <div>
          <label className="text-[10px] uppercase tracking-wider text-white/60">
            Penalidades por modalidade (segundos)
          </label>
          <div className="mt-1 space-y-1.5">
            {MODALIDADES.map((m, i) => (
              <div
                key={m.num}
                className="flex items-center gap-2 bg-black/30 border border-white/5 px-2 py-1.5"
              >
                <span className="w-7 h-7 flex-shrink-0 flex items-center justify-center bg-wfl-yellow/20 text-wfl-yellow text-xs font-bold">
                  {m.num}
                </span>
                <span className="flex-1 text-xs text-white/70 truncate">{m.nome}</span>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  min="0"
                  value={pen[i]}
                  onChange={e => {
                    const novo = [...pen] as typeof pen
                    novo[i] = e.target.value
                    setPen(novo)
                  }}
                  className="w-20 min-h-9 bg-black/50 border border-white/10 px-2 text-sm text-white outline-none focus:border-wfl-yellow text-right tabular-nums"
                />
                <span className="text-[10px] text-white/40 w-2">s</span>
              </div>
            ))}
          </div>
        </div>

        {/* Observações */}
        <div>
          <label htmlFor="input-obs" className="text-[10px] uppercase tracking-wider text-white/60">
            Observações <span className="text-white/30">(opcional)</span>
          </label>
          <input
            id="input-obs"
            value={obs}
            onChange={e => setObs(e.target.value)}
            className="mt-1 w-full min-h-11 bg-black/40 border border-white/15 px-3 text-sm text-white outline-none focus:border-wfl-yellow"
          />
        </div>

        {/* Preview */}
        <div className="bg-black/50 border border-white/10 p-3">
          <div className="flex items-baseline justify-between text-[10px] uppercase tracking-wider text-white/50">
            <span>Tempo bruto</span>
            <span className="font-mono text-sm text-white tabular-nums">
              {tempoBrutoValido ? msParaDisplay(tempoBrutoMs) : '--:--.---'}
            </span>
          </div>
          <div className="flex items-baseline justify-between text-[10px] uppercase tracking-wider text-white/50 mt-1">
            <span>Σ Penalidades</span>
            <span className="font-mono text-sm text-white tabular-nums">
              +{(totalPenalidades / 1000).toFixed(2)}s
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-white/10">
            <span className="text-[10px] uppercase tracking-wider text-wfl-yellow font-bold">Tempo final</span>
            <span
              className={`font-mono text-3xl font-bold tabular-nums leading-none ${
                totalPenalidades > 0 ? 'text-wfl-red' : 'text-wfl-yellow'
              }`}
            >
              {tempoBrutoValido ? msParaDisplay(tempoFinalMs) : '--:--.---'}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={!tempoBrutoValido || !atleticaId || salvando}
          className="w-full min-h-14 inline-flex items-center justify-center gap-2 bg-wfl-red hover:bg-wfl-red/90 active:bg-wfl-red/80 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold tracking-[0.2em] uppercase transition-colors"
        >
          <Save className="w-4 h-4" />
          {salvando ? 'Salvando…' : 'Salvar Run'}
        </button>
      </form>
    </section>
  )
}
