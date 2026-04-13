'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Check, Loader2, AlertCircle } from 'lucide-react'

const EVENTO = {
  id: 'f139b049-52c8-4028-9ddb-90cfa72af378',
  titulo: 'Catcher Run — Somma × Red Bull',
  dataEvento: '2026-04-25',
  dataFormatada: 'Sábado, 25 de abril de 2026',
  horarioInicio: '07:00',
  local: 'Parque da Cidade — Estacionamento 9, Brasília DF',
  localUrl: 'https://maps.app.goo.gl/AUMu7k5D34YWUe4LA',
  tipo: 'corrida' as const,
}

const pelotons = [
  {
    id: '4km' as const,
    label: 'Ritmo Iniciante',
    description: 'Alterna corrida e caminhada · 1\' correndo, 2\' caminhando',
    pace: 'Ritmo leve',
    color: '#22c55e',
  },
  {
    id: '6km' as const,
    label: 'Ritmo Moderado',
    description: 'Ritmo constante · Pace aproximado de 6\'30"',
    pace: 'Ritmo moderado',
    color: '#eab308',
  },
  {
    id: '8km' as const,
    label: 'Ritmo Avançado',
    description: 'Para corredores experientes · Pace aproximado de 5\'30"',
    pace: 'Ritmo intenso',
    color: '#CC0000',
  },
]

type FormData = {
  peloton: '' | '4km' | '6km' | '8km'
  nome: string
  telefone: string
  sexo: '' | 'masculino' | 'feminino'
  email: string
  cpf: string
}

function formatPhone(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

function formatCPF(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 3) return d
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
}

const inputClass = `w-full bg-[#0D0D0D] border-2 border-zinc-800 focus:border-[#F26522] text-white placeholder:text-zinc-600 px-4 py-3.5 text-sm outline-none transition-colors duration-200`
const labelClass = `block text-xs text-zinc-500 font-medium uppercase tracking-widest mb-1.5`

export default function CatcherRunCheckin() {
  const router = useRouter()
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

  const totalSteps = 3

  const canAdvance = () => {
    if (step === 1) return !!formData.peloton
    if (step === 2) return !!(formData.nome && formData.telefone && formData.sexo && formData.email && formData.cpf.length === 11)
    return false
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError('')
    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome_completo: formData.nome,
          email: formData.email,
          telefone: formData.telefone,
          cpf: formData.cpf,
          sexo: formData.sexo,
          pelotao: formData.peloton,
          data_do_evento: EVENTO.dataEvento,
          nome_do_evento: EVENTO.titulo,
          evento_id: EVENTO.id,
        }),
      })

      const json = await res.json()
      if (!res.ok) {
        setError(json.error || 'Erro ao salvar inscrição.')
        return
      }

      const params = new URLSearchParams({
        data: EVENTO.dataFormatada,
        evento: EVENTO.titulo,
        horario: EVENTO.horarioInicio,
        local: EVENTO.local,
        local_url: EVENTO.localUrl,
        descricao: 'Simulação do Wings for Life World Run no Parque da Cidade.',
      })
      router.push(`/check-in/sucesso?${params.toString()}`)
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const selectedPeloton = pelotons.find(p => p.id === formData.peloton)

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Progress bar */}
      <div className="flex items-center gap-1.5 mb-8">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-1 transition-all duration-500"
            style={{ background: i + 1 <= step ? '#F26522' : '#27272a' }}
          />
        ))}
        <span className="text-xs text-zinc-600 ml-2 whitespace-nowrap" style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
          {step}/{totalSteps}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1 — Pelotão */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-xs text-[#F26522] font-semibold uppercase tracking-[0.25em] mb-1" style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}>Passo 1</p>
            <h3 className="text-2xl sm:text-3xl font-black uppercase text-white mb-1 leading-tight" style={{ fontFamily: 'var(--font-barlow-condensed, sans-serif)' }}>Escolha seu pelotão</h3>
            <p className="text-zinc-500 text-xs mb-6" style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}>Selecione a distância que mais combina com você</p>

            <div className="flex flex-col gap-3 mb-8">
              {pelotons.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, peloton: p.id }))}
                  className={`w-full text-left border-2 p-4 transition-all duration-200 cursor-pointer ${
                    formData.peloton === p.id
                      ? 'border-[#F26522] bg-[#F26522]/8'
                      : 'border-zinc-800 bg-[#111] hover:border-zinc-600'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 flex items-center justify-center font-black text-sm flex-shrink-0"
                        style={{
                          background: formData.peloton === p.id ? '#F26522' : '#1a1a1a',
                          color: formData.peloton === p.id ? '#fff' : '#71717a',
                          fontFamily: 'var(--font-barlow-condensed, sans-serif)',
                        }}
                      >
                        {p.id}
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm" style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}>{p.label}</p>
                        <p className="text-zinc-500 text-xs mt-0.5" style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}>{p.description}</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      formData.peloton === p.id ? 'border-[#F26522] bg-[#F26522]' : 'border-zinc-700'
                    }`}>
                      {formData.peloton === p.id && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => canAdvance() && setStep(2)}
              disabled={!formData.peloton}
              className="w-full bg-[#F26522] hover:bg-[#CC0000] disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-black text-base uppercase tracking-wider py-4 flex items-center justify-center gap-2 transition-colors duration-200 disabled:cursor-not-allowed cursor-pointer"
              style={{ fontFamily: 'var(--font-barlow-condensed, sans-serif)' }}
            >
              Continuar <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* STEP 2 — Dados pessoais */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-xs text-[#F26522] font-semibold uppercase tracking-[0.25em] mb-1" style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}>Passo 2</p>
            <h3 className="text-2xl sm:text-3xl font-black uppercase text-white mb-1 leading-tight" style={{ fontFamily: 'var(--font-barlow-condensed, sans-serif)' }}>Seus dados</h3>
            <p className="text-zinc-500 text-xs mb-6" style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}>Precisamos de algumas informações para confirmar sua vaga</p>

            <div className="space-y-3 mb-6">
              <div>
                <label className={labelClass}>Nome completo <span className="text-[#F26522]">*</span></label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={e => setFormData(p => ({ ...p, nome: e.target.value }))}
                  placeholder="Ex: João Silva Santos"
                  autoFocus
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Telefone <span className="text-[#F26522]">*</span></label>
                  <input
                    type="tel"
                    value={formatPhone(formData.telefone)}
                    onChange={e => setFormData(p => ({ ...p, telefone: e.target.value.replace(/\D/g, '') }))}
                    placeholder="(61) 99999-9999"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>CPF <span className="text-[#F26522]">*</span></label>
                  <input
                    type="text"
                    value={formatCPF(formData.cpf)}
                    onChange={e => setFormData(p => ({ ...p, cpf: e.target.value.replace(/\D/g, '') }))}
                    placeholder="000.000.000-00"
                    className={`${inputClass} font-mono`}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Sexo <span className="text-[#F26522]">*</span></label>
                <div className="grid grid-cols-2 gap-2">
                  {(['masculino', 'feminino'] as const).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, sexo: s }))}
                      className={`py-3 border-2 font-semibold text-xs sm:text-sm capitalize transition-all duration-200 cursor-pointer ${
                        formData.sexo === s
                          ? 'border-[#F26522] bg-[#F26522]/10 text-[#F26522]'
                          : 'border-zinc-800 bg-[#111] text-zinc-400 hover:border-zinc-600'
                      }`}
                      style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>E-mail <span className="text-[#F26522]">*</span></label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                  placeholder="seuemail@exemplo.com"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Resumo pelotão */}
            {selectedPeloton && (
              <div className="flex items-center gap-3 bg-[#0D0D0D] border border-zinc-800 px-4 py-3 mb-4">
                <div
                  className="w-8 h-8 flex items-center justify-center font-black text-xs text-white flex-shrink-0"
                  style={{ background: '#F26522', fontFamily: 'var(--font-barlow-condensed, sans-serif)' }}
                >
                  {selectedPeloton.id}
                </div>
                <div>
                  <p className="text-zinc-500 text-xs" style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}>Pelotão selecionado</p>
                  <p className="text-white font-semibold text-xs sm:text-sm" style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
                    {selectedPeloton.id} — {selectedPeloton.label}
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2 bg-red-900/20 border border-red-500/30 px-4 py-3 mb-4">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm" style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}>{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                disabled={isLoading}
                className="border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white font-black text-sm uppercase px-6 py-4 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 cursor-pointer"
                style={{ fontFamily: 'var(--font-barlow-condensed, sans-serif)' }}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => canAdvance() && setStep(3)}
                disabled={!canAdvance()}
                className="flex-1 bg-[#F26522] hover:bg-[#CC0000] disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-black text-sm sm:text-base uppercase tracking-wider py-4 flex items-center justify-center gap-2 transition-colors duration-200 disabled:cursor-not-allowed cursor-pointer"
                style={{ fontFamily: 'var(--font-barlow-condensed, sans-serif)' }}
              >
                Continuar <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3 — Confirmação */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-xs text-[#F26522] font-semibold uppercase tracking-[0.25em] mb-1" style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}>Passo 3</p>
            <h3 className="text-2xl sm:text-3xl font-black uppercase text-white mb-1 leading-tight" style={{ fontFamily: 'var(--font-barlow-condensed, sans-serif)' }}>Confirme sua inscrição</h3>
            <p className="text-zinc-500 text-xs mb-6" style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}>Revise os dados antes de confirmar</p>

            <div className="bg-[#111] border border-zinc-800 divide-y divide-zinc-800 mb-6">
              {[
                { label: 'Nome', value: formData.nome },
                { label: 'E-mail', value: formData.email },
                { label: 'Telefone', value: formatPhone(formData.telefone) },
                { label: 'CPF', value: formatCPF(formData.cpf) },
                { label: 'Sexo', value: formData.sexo.charAt(0).toUpperCase() + formData.sexo.slice(1) },
                { label: 'Pelotão', value: `${formData.peloton} — ${selectedPeloton?.label}` },
                { label: 'Evento', value: EVENTO.titulo },
                { label: 'Data', value: EVENTO.dataFormatada },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center px-4 py-2.5 gap-4">
                  <span className="text-zinc-500 text-xs uppercase tracking-wide flex-shrink-0" style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}>{label}</span>
                  <span className="text-white text-xs text-right" style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}>{value}</span>
                </div>
              ))}
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-red-900/20 border border-red-500/30 px-4 py-3 mb-4">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm" style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}>{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                disabled={isLoading}
                className="border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white font-black text-sm uppercase px-6 py-4 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 cursor-pointer"
                style={{ fontFamily: 'var(--font-barlow-condensed, sans-serif)' }}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 bg-[#F26522] hover:bg-[#CC0000] disabled:opacity-60 text-white font-black text-sm sm:text-base uppercase tracking-wider py-4 flex items-center justify-center gap-2 transition-colors duration-200 disabled:cursor-not-allowed cursor-pointer"
                style={{ fontFamily: 'var(--font-barlow-condensed, sans-serif)' }}
              >
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
                ) : (
                  <><Check className="w-4 h-4" /> Confirmar inscrição</>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
