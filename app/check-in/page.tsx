'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, ArrowLeft, Check, MapPin, Clock, Calendar, Lock, ChevronRight } from 'lucide-react'

type FormData = {
  peloton: '' | '4km' | '6km' | '8km'
  nome: string
  telefone: string
  sexo: '' | 'masculino' | 'feminino'
  email: string
  cpf: string
}

type Evento = {
  id: string
  data: string
  dataFormatada: string
  titulo: string
  local: string
  encerrado: boolean
  dataEvento: string
}

const TOTAL_STEPS = 3

const eventos: Evento[] = [
  {
    id: 'evento-2026-03-07',
    data: '2026-03-07',
    dataFormatada: 'Sábado, 07 de março de 2026',
    titulo: 'Somma Club — Edição #01',
    local: 'Parque da Cidade — Brasília, DF',
    encerrado: true,
    dataEvento: '2026-03-07',
  },
  {
    id: 'evento-2026-03-14',
    data: '2026-03-14',
    dataFormatada: 'Sábado, 14 de março de 2026',
    titulo: 'Somma Club — Edição #02 de Março',
    local: 'Parque da Cidade — Brasília, DF',
    encerrado: false,
    dataEvento: '2026-03-14',
  },
]

export default function CheckInPage() {
  const router = useRouter()
  const [eventoSelecionado, setEventoSelecionado] = useState<Evento | null>(null)
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<FormData>({
    peloton: '',
    nome: '',
    telefone: '',
    sexo: '',
    email: '',
    cpf: '',
  })

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 11)
    if (cleaned.length <= 2) return cleaned
    if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
  }

  const formatCPF = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 11)
    if (cleaned.length <= 3) return cleaned
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`
    if (cleaned.length <= 9) return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`
  }

  const canAdvance = () => {
    if (step === 1) return true
    if (step === 2) return !!formData.peloton
    if (step === 3) return !!(formData.nome && formData.telefone && formData.sexo && formData.email && formData.cpf)
    return false
  }

  const handleNext = () => {
    if (canAdvance() && step < TOTAL_STEPS) setStep(step + 1)
  }

  const handlePrev = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      setError('')

      const response = await fetch('/api/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome_completo: formData.nome,
          email: formData.email,
          telefone: formData.telefone,
          cpf: formData.cpf,
          sexo: formData.sexo,
          pelotao: formData.peloton,
          data_do_evento: eventoSelecionado?.dataEvento || '2026-03-14',
          nome_do_evento: eventoSelecionado?.titulo || 'Somma Club',
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao salvar check-in')
      }

      const params = new URLSearchParams({
        data: eventoSelecionado?.dataFormatada || '',
        evento: eventoSelecionado?.titulo || '',
      })
      router.push(`/check-in/sucesso?${params.toString()}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar formulário')
      console.error('[v0] Erro no check-in:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const pelotons = [
    {
      id: '4km' as const,
      label: 'Ritmo Iniciante',
      description: 'Alterna corrida e caminhada • 1\' correndo, 2\' caminhando',
      icon: '🟢',
      pace: 'Ritmo leve',
    },
    {
      id: '6km' as const,
      label: 'Ritmo Moderado',
      description: 'Ritmo constante • Pace aproximado de 6\'30"',
      icon: '🟡',
      pace: 'Ritmo moderado',
    },
    {
      id: '8km' as const,
      label: 'Ritmo Avançado',
      description: 'Para corredores experientes • Pace aproximado de 5\'30"',
      icon: '🔴',
      pace: 'Ritmo intenso',
    },
  ]

  // Exibe lista de eventos — sem countdown, check-in sempre aberto
  if (!eventoSelecionado) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col">
        <header className="border-b border-zinc-800 px-3 sm:px-6 py-3 sm:py-4 sticky top-0 z-50 bg-black/95 backdrop-blur-sm">
          <a href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-xs sm:text-sm">
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Voltar ao site
          </a>
        </header>

        <div className="flex-1 px-3 sm:px-4 py-8 sm:py-14 max-w-2xl mx-auto w-full">
          <div className="text-center mb-10 sm:mb-12">
            <p className="text-orange-500 text-xs font-semibold uppercase tracking-widest mb-2 sm:mb-3">Somma Running Club</p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight text-balance">
              Faça seu <span className="text-orange-500">Check-in</span>
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm mt-2 sm:mt-3">
              Selecione o evento para confirmar sua presença
            </p>
          </div>

          {/* Próximo evento */}
          <div className="mb-8">
            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-widest mb-3">Proximo evento</p>
            {eventos.filter(e => !e.encerrado).map(evento => (
              <button
                key={evento.id}
                onClick={() => setEventoSelecionado(evento)}
                className="w-full text-left rounded-xl border-2 border-orange-500 bg-zinc-900 overflow-hidden hover:bg-zinc-800 transition-all duration-200 group"
              >
                <div className="bg-orange-500 px-4 sm:px-6 py-2 flex items-center justify-between">
                  <span className="text-white text-xs font-semibold uppercase tracking-widest">Check-in aberto</span>
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-white font-bold text-base sm:text-lg mb-3">{evento.titulo}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400">
                      <Calendar className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                      {evento.dataFormatada}
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400">
                      <Clock className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                      A partir das 07h00
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400">
                      <MapPin className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                      {evento.local}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-end gap-1 text-orange-500 text-xs font-semibold group-hover:gap-2 transition-all">
                    Fazer check-in <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Eventos passados */}
          <div>
            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-widest mb-3">Historico de eventos</p>
            <div className="space-y-2.5">
              {eventos.filter(e => e.encerrado).map(evento => (
                <div
                  key={evento.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 sm:p-5 opacity-60"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center gap-1 text-zinc-500 text-xs font-medium bg-zinc-800 px-2 py-0.5 rounded-full">
                          <Lock className="w-2.5 h-2.5" /> Encerrado
                        </span>
                      </div>
                      <p className="text-white font-semibold text-sm">{evento.titulo}</p>
                      <p className="text-zinc-500 text-xs mt-1">{evento.dataFormatada}</p>
                      <p className="text-zinc-600 text-xs">{evento.local}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-4 h-4 text-zinc-600" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800 px-3 sm:px-6 py-3 sm:py-4 sticky top-0 z-50 bg-black/95 backdrop-blur-sm">
        <button
          onClick={() => { setEventoSelecionado(null); setStep(1) }}
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-xs sm:text-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Voltar aos eventos
        </button>
      </header>

      <div className="flex-1 flex items-center justify-center px-3 sm:px-4 py-6 sm:py-12">
        <div className="w-full max-w-2xl">

          {/* Logo + Título */}
          <div className="text-center mb-8 sm:mb-10">
            <p className="text-orange-500 text-xs font-semibold uppercase tracking-widest mb-2 sm:mb-3">Somma Running Club</p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight text-balance">
              Faça seu <span className="text-orange-500">Check-in</span>
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm mt-2 sm:mt-3">
              Confirme sua presença em {TOTAL_STEPS} passos simples
            </p>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-1 sm:gap-2 mb-8 sm:mb-10">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div key={i} className="flex-1 flex items-center gap-1 sm:gap-2">
                <div
                  className={`h-1 sm:h-1.5 flex-1 rounded-full transition-all duration-500 ${
                    i + 1 <= step ? 'bg-orange-500' : 'bg-zinc-800'
                  }`}
                />
              </div>
            ))}
            <span className="text-xs text-zinc-500 whitespace-nowrap ml-2">{step}/{TOTAL_STEPS}</span>
          </div>

          {/* STEP 1: Evento */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-400">
              <div className="mb-6 sm:mb-8">
                <p className="text-xs text-orange-500 font-semibold uppercase tracking-widest mb-1 sm:mb-2">Passo 1</p>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Confirme o evento</h2>
                <p className="text-zinc-400 text-xs sm:text-sm">Verifique os detalhes antes de continuar</p>
              </div>

              <div className="rounded-xl sm:rounded-2xl border-2 border-orange-500 bg-zinc-900 overflow-hidden">
                {/* Banner */}
                <div className="bg-gradient-to-br from-orange-600 to-orange-400 p-5 sm:p-8 text-center">
                  <p className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-2">Somma Running Club</p>
                  <h3 className="text-lg sm:text-2xl font-bold leading-tight mb-1 text-white">Corra. Celebre. Repita.</h3>
                  <p className="text-white/80 text-xs sm:text-sm">Uma manhã de movimento, energia e comunidade — com café no final pra recarregar as baterias</p>
                </div>

                <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <div className="flex items-start gap-3 text-xs sm:text-sm">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-zinc-400 text-xs">Data</p>
                      <p className="text-white font-medium text-sm sm:text-base">{eventoSelecionado.dataFormatada}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-xs sm:text-sm">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-zinc-400 text-xs">Horário</p>
                      <p className="text-white font-medium text-sm sm:text-base">A partir das 07h00</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-xs sm:text-sm">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-zinc-400 text-xs">Local</p>
                      <p className="text-white font-medium text-sm sm:text-base">Parque da Cidade — Brasília, DF</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 sm:mt-8">
                <button
                  onClick={handleNext}
                  className="w-full bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white font-semibold py-3 sm:py-4 rounded-xl sm:rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/25 text-sm sm:text-base touch-none"
                >
                  Confirmar e continuar <ArrowRight className="w-4 h-4 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Pelotão */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-400">
              <div className="mb-6 sm:mb-8">
                <p className="text-xs text-orange-500 font-semibold uppercase tracking-widest mb-1 sm:mb-2">Passo 2</p>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Escolha seu pelotão</h2>
                <p className="text-zinc-400 text-xs sm:text-sm">Selecione a distância que mais combina com você</p>
              </div>

              <div className="space-y-2.5 sm:space-y-3">
                {pelotons.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setFormData(prev => ({ ...prev, peloton: p.id }))}
                    className={`w-full text-left rounded-lg sm:rounded-2xl border-2 p-4 sm:p-5 transition-all duration-200 ${
                      formData.peloton === p.id
                        ? 'border-orange-500 bg-orange-500/10'
                        : 'border-zinc-800 bg-zinc-900 hover:border-zinc-600'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center text-base sm:text-xl font-bold transition-all flex-shrink-0 ${
                          formData.peloton === p.id ? 'bg-orange-500 text-white' : 'bg-zinc-800 text-zinc-300'
                        }`}>
                          {p.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold text-sm sm:text-base">{p.label}</p>
                          <p className="text-zinc-400 text-xs mt-0.5 line-clamp-2">{p.description}</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        formData.peloton === p.id ? 'border-orange-500 bg-orange-500' : 'border-zinc-600'
                      }`}>
                        {formData.peloton === p.id && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-2 sm:gap-3 mt-6 sm:mt-8">
                <button
                  onClick={handlePrev}
                  className="flex-1 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white font-semibold py-3 sm:py-4 rounded-lg sm:rounded-xl flex items-center justify-center gap-2 transition-all duration-200 text-xs sm:text-sm touch-none"
                >
                  <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Voltar
                </button>
                <button
                  onClick={handleNext}
                  disabled={!formData.peloton}
                  className="flex-1 bg-orange-500 hover:bg-orange-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-semibold py-3 sm:py-4 rounded-lg sm:rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/25 disabled:cursor-not-allowed text-xs sm:text-sm touch-none"
                >
                  Continuar <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Dados pessoais */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-400">
              <div className="mb-6 sm:mb-8">
                <p className="text-xs text-orange-500 font-semibold uppercase tracking-widest mb-1 sm:mb-2">Passo 3</p>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Seus dados</h2>
                <p className="text-zinc-400 text-xs sm:text-sm">Precisamos de algumas informações para confirmar sua vaga</p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {/* Nome */}
                <div>
                  <label className="block text-xs text-zinc-400 font-medium uppercase tracking-wide mb-1.5 sm:mb-2">
                    Nome completo <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={e => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                    placeholder="Ex: João Silva Santos"
                    autoFocus
                    className="w-full bg-zinc-900 border-2 border-zinc-700 focus:border-orange-500 text-white placeholder:text-zinc-600 rounded-lg sm:rounded-xl px-3.5 sm:px-5 py-3 sm:py-4 text-sm outline-none transition-all duration-200"
                  />
                </div>

                {/* Telefone */}
                <div>
                  <label className="block text-xs text-zinc-400 font-medium uppercase tracking-wide mb-1.5 sm:mb-2">
                    Telefone <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formatPhone(formData.telefone)}
                    onChange={e => setFormData(prev => ({ ...prev, telefone: e.target.value.replace(/\D/g, '') }))}
                    placeholder="(61) 99999-9999"
                    className="w-full bg-zinc-900 border-2 border-zinc-700 focus:border-orange-500 text-white placeholder:text-zinc-600 rounded-lg sm:rounded-xl px-3.5 sm:px-5 py-3 sm:py-4 text-sm outline-none transition-all duration-200"
                  />
                </div>

                {/* Sexo */}
                <div>
                  <label className="block text-xs text-zinc-400 font-medium uppercase tracking-wide mb-1.5 sm:mb-2">
                    Sexo <span className="text-orange-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {(['masculino', 'feminino'] as const).map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, sexo: s }))}
                        className={`py-3 sm:py-4 rounded-lg sm:rounded-xl border-2 font-semibold text-xs sm:text-sm capitalize transition-all duration-200 ${
                          formData.sexo === s
                            ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                            : 'border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500'
                        }`}
                      >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs text-zinc-400 font-medium uppercase tracking-wide mb-1.5 sm:mb-2">
                    E-mail <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="seuemail@exemplo.com"
                    className="w-full bg-zinc-900 border-2 border-zinc-700 focus:border-orange-500 text-white placeholder:text-zinc-600 rounded-lg sm:rounded-xl px-3.5 sm:px-5 py-3 sm:py-4 text-sm outline-none transition-all duration-200"
                  />
                </div>

                {/* CPF */}
                <div>
                  <label className="block text-xs text-zinc-400 font-medium uppercase tracking-wide mb-1.5 sm:mb-2">
                    CPF <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formatCPF(formData.cpf)}
                    onChange={e => setFormData(prev => ({ ...prev, cpf: e.target.value.replace(/\D/g, '') }))}
                    placeholder="000.000.000-00"
                    className="w-full bg-zinc-900 border-2 border-zinc-700 focus:border-orange-500 text-white placeholder:text-zinc-600 rounded-lg sm:rounded-xl px-3.5 sm:px-5 py-3 sm:py-4 text-sm outline-none transition-all duration-200 font-mono"
                  />
                </div>
              </div>

              {/* Resumo pelotão */}
              <div className="mt-5 sm:mt-6 flex items-center gap-3 bg-zinc-900 rounded-lg sm:rounded-xl px-3.5 sm:px-5 py-3 sm:py-4 border border-zinc-800">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white text-xs sm:text-sm font-bold flex-shrink-0">
                  {formData.peloton.replace('km', '')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-zinc-500">Pelotão selecionado</p>
                  <p className="text-white font-semibold text-xs sm:text-sm">{formData.peloton} — {eventoSelecionado.dataFormatada}</p>
                </div>
              </div>

              {/* Erro */}
              {error && (
                <div className="mt-4 sm:mt-6 bg-red-900/20 border border-red-500 rounded-lg sm:rounded-xl px-3.5 sm:px-5 py-3 sm:py-4">
                  <p className="text-red-400 text-xs sm:text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-2 sm:gap-3 mt-6 sm:mt-8">
                <button
                  onClick={handlePrev}
                  disabled={isLoading}
                  className="flex-1 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white font-semibold py-3 sm:py-4 rounded-lg sm:rounded-xl flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm touch-none"
                >
                  <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Voltar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!canAdvance() || isLoading}
                  className="flex-1 bg-orange-500 hover:bg-orange-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-semibold py-3 sm:py-4 rounded-lg sm:rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/25 disabled:cursor-not-allowed text-xs sm:text-sm touch-none"
                >
                  {isLoading ? 'Enviando...' : 'Confirmar'} {!isLoading && <Check className="w-4 h-4 sm:w-4 sm:h-4" />}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  )
}
