'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Trophy, Users, Activity, ChevronRight, X, Camera, ImageIcon,
  CheckCircle2, ArrowRight, ArrowLeft, AlertCircle, Sparkles, Radio,
  PartyPopper,
} from 'lucide-react'
import { MODALIDADES } from '@/lib/wings-cronometragem/tempo'
import type { Sexo, Modalidade } from '@/lib/wings-cronometragem/tempo'

const fontDisplay = { fontFamily: 'var(--font-bebas), sans-serif' }
const fontBody = { fontFamily: 'var(--font-dm-sans-wfl), sans-serif' }

const COOKIE_JA_CADASTROU = 'wings_equipe_cadastrada'

type AtletaForm = { nome: string; sexo: Sexo; modalidade: Modalidade }

const ATLETAS_INICIAIS: AtletaForm[] = [
  { nome: '', sexo: 'M', modalidade: 1 },
  { nome: '', sexo: 'M', modalidade: 2 },
  { nome: '', sexo: 'F', modalidade: 3 },
  { nome: '', sexo: 'F', modalidade: 4 },
]

export default function WingsCadastroEquipe() {
  const [aberto, setAberto] = useState(false)
  const [jaCadastrou, setJaCadastrou] = useState(false)
  const [equipeNome, setEquipeNome] = useState<string | null>(null)

  // Lê cookie marcador
  useEffect(() => {
    if (typeof document === 'undefined') return
    const m = document.cookie.split('; ').find(c => c.startsWith(`${COOKIE_JA_CADASTROU}=`))
    if (m) {
      const v = decodeURIComponent(m.split('=')[1] || '')
      setJaCadastrou(true)
      if (v && v !== 'true') setEquipeNome(v)
    }
  }, [])

  return (
    <section
      id="wings-cadastro-equipe"
      className="bg-wfl-navy text-white py-12 sm:py-24 px-4 sm:px-8 scroll-mt-8"
      style={fontBody}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <p className="text-[10px] sm:text-sm font-semibold tracking-[0.3em] uppercase text-wfl-yellow">
            Sua equipe na pista
          </p>
          <h2
            className="mt-2 text-3xl sm:text-6xl uppercase leading-none"
            style={fontDisplay}
          >
            Cadastre sua equipe<br className="hidden sm:block" /> competidora
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-white/70 max-w-xl mx-auto">
            Forme um time de 4 atletas (2M + 2F) pra disputar o Revezamento 4×100m
            misto. Cada equipe corre por sua atlética — e os 3 melhores tempos
            levam premiação no pódio.
          </p>
        </div>

        {/* Por que cadastrar — cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-10">
          <CardOnboarding
            Icon={Trophy}
            title="Disputa pelo pódio"
            body="Top 3 atléticas com melhor tempo total no revezamento ganham premiação."
          />
          <CardOnboarding
            Icon={Radio}
            title="Ranking ao vivo"
            body="Todo mundo acompanha em tempo real pelo celular — sem refresh, com fotos das equipes."
          />
          <CardOnboarding
            Icon={Sparkles}
            title="Show animado"
            body="Modo de visualização com seu carrinho na pista. Quanto melhor o tempo, mais alto na onda."
          />
        </div>

        {/* Como funciona */}
        <div className="bg-white/5 border border-white/10 p-5 sm:p-7 mb-8 sm:mb-10">
          <h3 className="text-xs uppercase tracking-[0.25em] text-wfl-yellow font-bold mb-4">
            Como funciona
          </h3>
          <ol className="space-y-3 text-sm text-white/80">
            <PassoLista numero={1}>
              <strong>Junte 4 atletas</strong> da sua atlética: <strong>2 masculinos + 2 femininas</strong>.
              Cada um vai correr <strong>100m em uma modalidade diferente</strong>.
            </PassoLista>
            <PassoLista numero={2}>
              <strong>Cada modalidade tem sua regra</strong>: um pé só, dois pés saltando, corrida de
              costas e engatinhando. Definam quem faz o quê <em>antes</em> de cadastrar.
            </PassoLista>
            <PassoLista numero={3}>
              <strong>Cadastre aqui agora</strong>. A equipe já cai no nosso painel e aparece no
              ranking público assim que a primeira run for cronometrada.
            </PassoLista>
            <PassoLista numero={4}>
              <strong>No dia do evento</strong>, o staff Somma chama sua equipe pra correr na bateria
              e raia definidas. Os tempos atualizam o ranking ao vivo.
            </PassoLista>
          </ol>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-4 gap-2">
            {MODALIDADES.map(m => (
              <div key={m.num} className="bg-black/30 border border-white/10 p-3 text-center">
                <span className="inline-flex items-center justify-center w-7 h-7 bg-wfl-yellow/20 text-wfl-yellow text-xs font-bold mb-1.5">
                  {m.num}
                </span>
                <p className="text-[11px] text-white/80 leading-tight">{m.nome}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA principal */}
        {jaCadastrou ? (
          <div className="bg-emerald-600/10 border border-emerald-500/30 p-5 sm:p-7 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <h3 className="text-xl sm:text-2xl uppercase leading-none" style={fontDisplay}>
              Equipe cadastrada
            </h3>
            {equipeNome && (
              <p className="mt-1.5 text-sm text-white/80">
                <strong>{equipeNome}</strong> já está no painel.
              </p>
            )}
            <p className="mt-1.5 text-xs text-white/50">
              Acompanhe o ranking ao vivo durante o evento.
            </p>
            <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2">
              <a
                href="/wings/ranking"
                className="inline-flex items-center justify-center gap-1.5 bg-wfl-red hover:bg-wfl-red/90 text-white px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] transition-colors"
              >
                <Activity className="w-4 h-4" /> Ranking ao vivo
              </a>
              <a
                href="/wings/ranking-show"
                className="inline-flex items-center justify-center gap-1.5 bg-wfl-yellow hover:bg-wfl-yellow/90 text-wfl-navy px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] transition-colors"
              >
                <Sparkles className="w-4 h-4" /> Ranking show
              </a>
            </div>
            <button
              onClick={() => {
                if (
                  confirm(
                    'Sua equipe já está cadastrada. Cadastrar uma segunda equipe?\nIsso só faz sentido se você for de OUTRA atlética.'
                  )
                ) {
                  setAberto(true)
                }
              }}
              className="mt-3 text-xs text-white/40 hover:text-white underline"
            >
              Cadastrar outra equipe
            </button>
          </div>
        ) : (
          <div className="text-center">
            <button
              onClick={() => setAberto(true)}
              className="inline-flex items-center gap-2 bg-wfl-red hover:bg-wfl-red/90 active:bg-wfl-red/80 text-white px-7 py-4 sm:px-10 sm:py-5 text-sm sm:text-base font-bold tracking-[0.2em] uppercase transition-colors"
            >
              <Users className="w-5 h-5" /> Cadastrar equipe agora
              <ChevronRight className="w-4 h-4" />
            </button>
            <p className="mt-3 text-[11px] text-white/40 uppercase tracking-wider">
              Inscrição gratuita · 4 atletas · 2M + 2F · 4 modalidades
            </p>
          </div>
        )}

        {/* Atalhos pro ranking */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <AtalhoRanking
            href="/wings/ranking"
            Icon={Activity}
            label="Ranking ao vivo"
            body="Lista detalhada com tempo, gap pro líder e atualização em tempo real."
          />
          <AtalhoRanking
            href="/wings/ranking-show"
            Icon={Sparkles}
            label="Ranking show"
            body="Visualização animada com carrinhos surfando a pista — ideal pra projetar no telão."
          />
        </div>
      </div>

      {aberto && <WizardCadastro onClose={() => setAberto(false)} onSucesso={(nome) => {
        setJaCadastrou(true)
        setEquipeNome(nome)
        // Cookie 30 dias com nome da equipe
        const exp = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString()
        document.cookie = `${COOKIE_JA_CADASTROU}=${encodeURIComponent(nome)}; expires=${exp}; path=/; SameSite=lax`
      }} />}
    </section>
  )
}

function CardOnboarding({
  Icon, title, body,
}: {
  Icon: typeof Trophy
  title: string
  body: string
}) {
  return (
    <div className="bg-white/5 border border-white/10 p-5 sm:p-6">
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-wfl-yellow flex items-center justify-center mb-3">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-wfl-navy" strokeWidth={2.5} />
      </div>
      <h3 className="text-lg sm:text-xl uppercase leading-tight" style={fontDisplay}>
        {title}
      </h3>
      <p className="mt-1 text-xs sm:text-sm text-white/65 leading-relaxed">{body}</p>
    </div>
  )
}

function PassoLista({ numero, children }: { numero: number; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="flex-shrink-0 w-7 h-7 bg-wfl-red text-white flex items-center justify-center font-bold text-xs">
        {numero}
      </span>
      <span className="leading-relaxed pt-0.5">{children}</span>
    </li>
  )
}

function AtalhoRanking({
  href, Icon, label, body,
}: {
  href: string
  Icon: typeof Trophy
  label: string
  body: string
}) {
  return (
    <a
      href={href}
      className="group bg-white/5 hover:bg-white/10 border border-white/10 p-4 sm:p-5 flex items-center gap-3 transition-colors"
    >
      <div className="w-10 h-10 bg-wfl-yellow/15 text-wfl-yellow flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs uppercase tracking-[0.2em] font-bold text-wfl-yellow">{label}</p>
        <p className="mt-0.5 text-xs text-white/60 leading-snug truncate">{body}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
    </a>
  )
}

// =====================================================================
// Wizard de cadastro
// =====================================================================

function WizardCadastro({
  onClose,
  onSucesso,
}: {
  onClose: () => void
  onSucesso: (nome: string) => void
}) {
  const [passo, setPasso] = useState<1 | 2 | 3>(1)
  const [erroGlobal, setErroGlobal] = useState('')

  const [nome, setNome] = useState('')
  const [sigla, setSigla] = useState('')
  const [cor, setCor] = useState('#E30D3F')
  const [fotoUrl, setFotoUrl] = useState<string | null>(null)
  const [uploadando, setUploadando] = useState(false)

  const [atletas, setAtletas] = useState<AtletaForm[]>(ATLETAS_INICIAIS)
  const [salvando, setSalvando] = useState(false)
  const [sucesso, setSucesso] = useState(false)

  const inputCameraRef = useRef<HTMLInputElement>(null)
  const inputArquivoRef = useRef<HTMLInputElement>(null)

  // ESC fecha
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !salvando && !uploadando) onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose, salvando, uploadando])

  // Validações
  function validarPasso1(): string | null {
    if (!nome.trim() || nome.trim().length < 2) return 'Dê um nome pra equipe (mín. 2 caracteres).'
    return null
  }
  function validarPasso2(): string | null {
    const masc = atletas.filter(a => a.sexo === 'M').length
    const fem = atletas.filter(a => a.sexo === 'F').length
    if (masc !== 2 || fem !== 2) return 'A equipe precisa ter 2M + 2F.'
    const mods = new Set(atletas.map(a => a.modalidade))
    if (mods.size !== 4) return 'Cada atleta deve estar em uma modalidade diferente (1, 2, 3 e 4).'
    for (const a of atletas) {
      if (!a.nome.trim()) return 'Preencha o nome de todos os atletas.'
    }
    return null
  }

  function avancar() {
    setErroGlobal('')
    if (passo === 1) {
      const err = validarPasso1()
      if (err) return setErroGlobal(err)
      setPasso(2)
    } else if (passo === 2) {
      const err = validarPasso2()
      if (err) return setErroGlobal(err)
      setPasso(3)
    }
  }
  function voltar() {
    setErroGlobal('')
    if (passo === 2) setPasso(1)
    else if (passo === 3) setPasso(2)
  }

  async function uploadFoto(file: File) {
    if (file.size > 5 * 1024 * 1024) {
      setErroGlobal('Imagem muito grande. Máx 5 MB.')
      return
    }
    setUploadando(true)
    setErroGlobal('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/wings-comp/upload-foto-publico', { method: 'POST', body: fd })
      const j = await res.json()
      if (!res.ok) {
        setErroGlobal(j.error || 'Erro ao enviar foto.')
        return
      }
      setFotoUrl(j.url)
    } finally {
      setUploadando(false)
    }
  }

  async function enviar() {
    setErroGlobal('')
    setSalvando(true)
    try {
      const res = await fetch('/api/wings-comp/equipe-publica', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: nome.trim(),
          sigla: sigla.trim() || null,
          cor,
          foto_url: fotoUrl,
          atletas: atletas.map(a => ({
            nome: a.nome.trim(),
            sexo: a.sexo,
            modalidade: a.modalidade,
          })),
        }),
      })
      const j = await res.json()
      if (!res.ok) {
        setErroGlobal(j.error || 'Erro ao cadastrar.')
        return
      }
      setSucesso(true)
      setTimeout(() => {
        onSucesso(nome.trim())
        onClose()
      }, 1800)
    } catch {
      setErroGlobal('Erro de conexão. Tente de novo.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm overflow-y-auto px-3 sm:p-4"
      onClick={e => e.target === e.currentTarget && !salvando && !uploadando && onClose()}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full sm:max-w-lg bg-wfl-navy text-white border border-white/15 shadow-2xl my-4"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {/* Header com progresso */}
        <div className="sticky top-0 bg-wfl-navy z-10 border-b border-white/10">
          <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3">
            <div className="min-w-0">
              <p className="text-[9px] uppercase tracking-[0.3em] text-wfl-yellow font-bold">
                Cadastro · Passo {passo} de 3
              </p>
              <h3 className="text-base sm:text-lg uppercase leading-none truncate" style={fontDisplay}>
                {passo === 1 && 'Sobre a equipe'}
                {passo === 2 && 'Os 4 atletas'}
                {passo === 3 && 'Confirme'}
              </h3>
            </div>
            <button
              onClick={onClose}
              disabled={salvando || uploadando}
              className="w-9 h-9 flex items-center justify-center text-white/60 hover:text-white disabled:opacity-30"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="h-1 bg-white/10">
            <div
              className="h-full bg-wfl-yellow transition-all duration-500"
              style={{ width: `${(passo / 3) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-4 sm:p-5">
          {sucesso ? (
            <div className="py-8 text-center">
              <PartyPopper className="w-14 h-14 text-wfl-yellow mx-auto mb-3" />
              <h3 className="text-2xl sm:text-3xl uppercase leading-none" style={fontDisplay}>
                Equipe cadastrada!
              </h3>
              <p className="mt-2 text-sm text-white/70">
                <strong>{nome}</strong> já está no painel da Somma.
              </p>
              <p className="mt-1 text-xs text-white/50">
                Você verá ela no ranking ao vivo no dia do evento.
              </p>
            </div>
          ) : (
            <>
              {erroGlobal && (
                <div className="mb-4 flex items-start gap-2 bg-wfl-red/15 border border-wfl-red/40 px-3 py-2.5 text-sm text-wfl-red">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{erroGlobal}</span>
                </div>
              )}

              {passo === 1 && (
                <Passo1
                  nome={nome} setNome={setNome}
                  sigla={sigla} setSigla={setSigla}
                  cor={cor} setCor={setCor}
                  fotoUrl={fotoUrl} setFotoUrl={setFotoUrl}
                  uploadando={uploadando}
                  inputCameraRef={inputCameraRef}
                  inputArquivoRef={inputArquivoRef}
                  uploadFoto={uploadFoto}
                />
              )}
              {passo === 2 && (
                <Passo2 atletas={atletas} setAtletas={setAtletas} />
              )}
              {passo === 3 && (
                <Passo3
                  nome={nome} sigla={sigla} cor={cor} fotoUrl={fotoUrl} atletas={atletas}
                />
              )}
            </>
          )}
        </div>

        {!sucesso && (
          <div className="sticky bottom-0 bg-wfl-navy border-t border-white/10 p-3 sm:p-4 grid grid-cols-2 gap-2">
            {passo === 1 ? (
              <button
                type="button"
                onClick={onClose}
                disabled={salvando || uploadando}
                className="min-h-12 bg-white/5 hover:bg-white/10 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Cancelar
              </button>
            ) : (
              <button
                type="button"
                onClick={voltar}
                disabled={salvando}
                className="min-h-12 inline-flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Voltar
              </button>
            )}
            {passo < 3 ? (
              <button
                type="button"
                onClick={avancar}
                disabled={uploadando}
                className="min-h-12 inline-flex items-center justify-center gap-1.5 bg-wfl-red hover:bg-wfl-red/90 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Avançar <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={enviar}
                disabled={salvando}
                className="min-h-12 inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                {salvando ? 'Cadastrando…' : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Cadastrar equipe
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function Passo1({
  nome, setNome, sigla, setSigla, cor, setCor,
  fotoUrl, setFotoUrl, uploadando,
  inputCameraRef, inputArquivoRef, uploadFoto,
}: {
  nome: string; setNome: (s: string) => void
  sigla: string; setSigla: (s: string) => void
  cor: string; setCor: (s: string) => void
  fotoUrl: string | null; setFotoUrl: (s: string | null) => void
  uploadando: boolean
  inputCameraRef: React.RefObject<HTMLInputElement>
  inputArquivoRef: React.RefObject<HTMLInputElement>
  uploadFoto: (f: File) => Promise<void>
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-[10px] uppercase tracking-wider text-white/60 mb-1.5">
          Foto da equipe <span className="text-white/30">(opcional, mas recomendada)</span>
        </label>
        <div className="flex items-center gap-3">
          <div
            className="relative w-20 h-20 overflow-hidden border-2 bg-black/40 flex-shrink-0"
            style={{ borderColor: cor, borderRadius: '9999px' }}
          >
            {fotoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={fotoUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: `${cor}33` }}
              >
                <ImageIcon className="w-7 h-7 text-white/40" />
              </div>
            )}
          </div>
          <div className="flex-1 grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => inputCameraRef.current?.click()}
              disabled={uploadando}
              className="min-h-11 inline-flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 disabled:opacity-50 text-white text-[10px] font-bold uppercase tracking-wider transition-colors"
            >
              <Camera className="w-3.5 h-3.5" /> Câmera
            </button>
            <button
              type="button"
              onClick={() => inputArquivoRef.current?.click()}
              disabled={uploadando}
              className="min-h-11 inline-flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 disabled:opacity-50 text-white text-[10px] font-bold uppercase tracking-wider transition-colors"
            >
              <ImageIcon className="w-3.5 h-3.5" /> Galeria
            </button>
            {fotoUrl && (
              <button
                type="button"
                onClick={() => setFotoUrl(null)}
                disabled={uploadando}
                className="col-span-2 min-h-9 inline-flex items-center justify-center gap-1 text-white/50 hover:text-wfl-red text-[10px] uppercase tracking-wider transition-colors"
              >
                <X className="w-3 h-3" /> Remover foto
              </button>
            )}
            {uploadando && <p className="col-span-2 text-[10px] text-wfl-yellow">Enviando…</p>}
          </div>
          <input
            ref={inputCameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            hidden
            onChange={e => {
              const f = e.target.files?.[0]
              if (f) uploadFoto(f)
              e.target.value = ''
            }}
          />
          <input
            ref={inputArquivoRef}
            type="file"
            accept="image/*"
            hidden
            onChange={e => {
              const f = e.target.files?.[0]
              if (f) uploadFoto(f)
              e.target.value = ''
            }}
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] uppercase tracking-wider text-white/60 mb-1">
          Nome da equipe / atlética
        </label>
        <input
          autoFocus
          value={nome}
          onChange={e => setNome(e.target.value)}
          placeholder="Ex: Halterada"
          maxLength={80}
          className="w-full min-h-12 bg-black/40 border border-white/15 px-3 text-base text-white outline-none focus:border-wfl-yellow"
        />
      </div>

      <div className="grid grid-cols-[1fr_auto] gap-3">
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-white/60 mb-1">
            Sigla <span className="text-white/30">(opcional)</span>
          </label>
          <input
            value={sigla}
            onChange={e => setSigla(e.target.value.toUpperCase())}
            placeholder="HAL"
            maxLength={6}
            className="w-full min-h-12 bg-black/40 border border-white/15 px-3 text-base text-white outline-none focus:border-wfl-yellow"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-white/60 mb-1">
            Cor
          </label>
          <input
            type="color"
            value={cor}
            onChange={e => setCor(e.target.value)}
            className="w-16 h-12 bg-black/40 border border-white/15 cursor-pointer p-1"
          />
        </div>
      </div>
    </div>
  )
}

function Passo2({
  atletas, setAtletas,
}: {
  atletas: AtletaForm[]
  setAtletas: (a: AtletaForm[]) => void
}) {
  function atualizar(idx: number, patch: Partial<AtletaForm>) {
    setAtletas(atletas.map((a, i) => (i === idx ? { ...a, ...patch } : a)))
  }

  const masc = atletas.filter(a => a.sexo === 'M').length
  const fem = atletas.filter(a => a.sexo === 'F').length
  const mods = new Set(atletas.map(a => a.modalidade))

  return (
    <div className="space-y-3">
      <p className="text-xs text-white/60">
        4 atletas · <strong className={masc === 2 ? 'text-emerald-400' : 'text-amber-400'}>{masc}M</strong>{' '}
        · <strong className={fem === 2 ? 'text-emerald-400' : 'text-amber-400'}>{fem}F</strong>{' '}
        · <strong className={mods.size === 4 ? 'text-emerald-400' : 'text-amber-400'}>
          {mods.size}/4 modalidades
        </strong>
      </p>

      {atletas.map((a, idx) => {
        const mod = MODALIDADES.find(m => m.num === a.modalidade)
        return (
          <div key={idx} className="bg-black/30 border border-white/10 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider text-white/50 font-bold">
                Atleta {idx + 1}
              </span>
              <div className="flex gap-1">
                {(['M', 'F'] as Sexo[]).map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => atualizar(idx, { sexo: s })}
                    className={`min-h-8 px-3 text-[11px] font-bold uppercase tracking-wider transition-colors ${
                      a.sexo === s
                        ? s === 'M'
                          ? 'bg-blue-500 text-white'
                          : 'bg-pink-500 text-white'
                        : 'bg-black/40 text-white/60 hover:bg-black/60'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <input
              value={a.nome}
              onChange={e => atualizar(idx, { nome: e.target.value })}
              placeholder="Nome do atleta"
              className="w-full min-h-11 bg-black/40 border border-white/10 px-3 text-base text-white outline-none focus:border-wfl-yellow mb-2"
            />

            <div className="grid grid-cols-4 gap-1.5">
              {MODALIDADES.map(m => {
                const usadaPorOutro = atletas.some(
                  (other, otherIdx) => otherIdx !== idx && other.modalidade === m.num
                )
                const ativa = a.modalidade === m.num
                return (
                  <button
                    key={m.num}
                    type="button"
                    onClick={() => atualizar(idx, { modalidade: m.num as Modalidade })}
                    disabled={usadaPorOutro}
                    title={m.nome}
                    className={`min-h-10 text-xs font-bold transition-colors ${
                      ativa
                        ? 'bg-wfl-yellow text-wfl-navy'
                        : 'bg-black/40 text-white/60 hover:bg-black/60 disabled:opacity-25 disabled:cursor-not-allowed'
                    }`}
                  >
                    {m.num}
                  </button>
                )
              })}
            </div>
            <p className="mt-1.5 text-[10px] text-white/40 text-center">
              {mod?.nome}
            </p>
          </div>
        )
      })}

      <div className="bg-wfl-yellow/10 border border-wfl-yellow/30 p-3 text-[11px] text-white/70 leading-relaxed">
        <strong className="text-wfl-yellow">Lembre:</strong> cada atleta corre 100m em uma das 4
        modalidades. A ordem na pista vocês decidem antes da bateria.
      </div>
    </div>
  )
}

function Passo3({
  nome, sigla, cor, fotoUrl, atletas,
}: {
  nome: string
  sigla: string
  cor: string
  fotoUrl: string | null
  atletas: AtletaForm[]
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 bg-black/30 border border-white/10 p-3">
        <div
          className="w-14 h-14 overflow-hidden border-2 flex-shrink-0"
          style={{ borderColor: cor, borderRadius: '9999px', backgroundColor: `${cor}33` }}
        >
          {fotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={fotoUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white/80" style={fontDisplay}>
              {(sigla || nome).slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold truncate" style={fontDisplay}>{nome}</p>
          {sigla && <p className="text-[10px] uppercase tracking-wider text-white/50">{sigla}</p>}
        </div>
      </div>

      <ul className="space-y-1.5">
        {atletas
          .slice()
          .sort((a, b) => a.modalidade - b.modalidade)
          .map(a => {
            const mod = MODALIDADES.find(m => m.num === a.modalidade)
            return (
              <li key={a.modalidade} className="flex items-center gap-2 bg-black/30 px-2.5 py-2 text-sm">
                <span
                  className={`w-7 h-7 flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                    a.sexo === 'M' ? 'bg-blue-500/30 text-blue-200' : 'bg-pink-500/30 text-pink-200'
                  }`}
                >
                  {a.sexo}
                </span>
                <span className="w-7 h-7 flex-shrink-0 flex items-center justify-center text-xs font-bold bg-wfl-yellow/20 text-wfl-yellow">
                  {a.modalidade}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate">{a.nome}</p>
                  <p className="text-[10px] text-white/50 truncate">{mod?.nome}</p>
                </div>
              </li>
            )
          })}
      </ul>

      <p className="text-[11px] text-white/50 leading-relaxed">
        Ao confirmar, sua equipe entra na lista oficial e aparece no ranking público assim que o
        staff cronometrar a primeira run.
      </p>
    </div>
  )
}
