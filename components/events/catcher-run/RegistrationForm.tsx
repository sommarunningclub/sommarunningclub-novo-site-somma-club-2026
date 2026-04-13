'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'

const schema = z.object({
  full_name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  whatsapp: z.string().min(10, 'WhatsApp inválido'),
  cpf: z.string().min(11, 'CPF inválido'),
  birth_date: z.string().min(1, 'Data de nascimento obrigatória'),
  gender: z.string().min(1, 'Selecione uma opção'),
  running_level: z.string().min(1, 'Selecione seu nível'),
  referral_source: z.string().optional(),
  lgpd_accepted: z.boolean().refine(v => v === true, 'Aceite obrigatório'),
})

type FormValues = z.infer<typeof schema>

function formatPhone(value: string) {
  const d = value.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

function formatCPF(value: string) {
  const d = value.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 3) return d
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
}

const inputClass = `
  w-full bg-[#1A1A1A] border border-zinc-700 focus:border-[#F26522]
  text-white placeholder:text-zinc-600 px-4 py-3.5 text-sm outline-none
  transition-colors duration-200
`
const labelClass = `block text-xs text-zinc-400 font-medium uppercase tracking-widest mb-1.5`
const errorClass = `mt-1 text-xs text-red-400`

const genderOptions = [
  { value: 'masculino', label: 'Masculino' },
  { value: 'feminino', label: 'Feminino' },
  { value: 'outro', label: 'Outro' },
  { value: 'nao_informar', label: 'Prefiro não dizer' },
]

const levelOptions = [
  { value: 'iniciante', label: 'Iniciante — corro menos de 5km' },
  { value: 'intermediario', label: 'Intermediário — corro de 5 a 15km' },
  { value: 'avancado', label: 'Avançado — corro mais de 15km' },
]

const referralOptions = [
  { value: 'instagram_somma', label: 'Instagram Somma' },
  { value: 'instagram_redbull', label: 'Instagram Red Bull' },
  { value: 'indicacao', label: 'Indicação de amigo' },
  { value: 'outro', label: 'Outro' },
]

export default function RegistrationForm() {
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { lgpd_accepted: false },
  })

  const onSubmit = async (data: FormValues) => {
    setServerError('')
    try {
      const res = await fetch('/api/catcher-run/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) {
        setServerError(json.error || 'Erro ao enviar inscrição.')
        return
      }
      setSubmitted(true)
    } catch {
      setServerError('Erro de conexão. Tente novamente.')
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-4">
        <div className="w-16 h-16 bg-[#F26522]/10 flex items-center justify-center mb-5">
          <CheckCircle className="w-8 h-8 text-[#F26522]" />
        </div>
        <h3
          className="text-white text-3xl sm:text-4xl font-black uppercase mb-3"
          style={{ fontFamily: 'var(--font-barlow-condensed, sans-serif)' }}
        >
          Inscrição confirmada!
        </h3>
        <p
          className="text-zinc-400 text-sm sm:text-base max-w-md leading-relaxed"
          style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}
        >
          Você está na lista. Nos vemos no Parque da Cidade em 25 de abril.
          Fique de olho no seu WhatsApp — enviaremos os detalhes em breve.
        </p>
        <p className="mt-4 text-[#F26522] text-2xl font-black uppercase" style={{ fontFamily: 'var(--font-barlow-condensed, sans-serif)' }}>
          Bora fugir do Catcher Car!
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Nome */}
      <div>
        <label className={labelClass} htmlFor="full_name">Nome completo <span className="text-[#F26522]">*</span></label>
        <input id="full_name" type="text" placeholder="Ex: João Silva Santos" className={inputClass} {...register('full_name')} />
        {errors.full_name && <p className={errorClass}>{errors.full_name.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label className={labelClass} htmlFor="email">E-mail <span className="text-[#F26522]">*</span></label>
        <input id="email" type="email" placeholder="seuemail@exemplo.com" className={inputClass} {...register('email')} />
        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
      </div>

      {/* WhatsApp + CPF */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="whatsapp">WhatsApp <span className="text-[#F26522]">*</span></label>
          <input
            id="whatsapp"
            type="tel"
            placeholder="(61) 99999-9999"
            className={inputClass}
            value={formatPhone(watch('whatsapp') || '')}
            onChange={e => setValue('whatsapp', e.target.value.replace(/\D/g, ''), { shouldValidate: true })}
          />
          {errors.whatsapp && <p className={errorClass}>{errors.whatsapp.message}</p>}
        </div>
        <div>
          <label className={labelClass} htmlFor="cpf">CPF <span className="text-[#F26522]">*</span></label>
          <input
            id="cpf"
            type="text"
            placeholder="000.000.000-00"
            className={`${inputClass} font-mono`}
            value={formatCPF(watch('cpf') || '')}
            onChange={e => setValue('cpf', e.target.value.replace(/\D/g, ''), { shouldValidate: true })}
          />
          {errors.cpf && <p className={errorClass}>{errors.cpf.message}</p>}
        </div>
      </div>

      {/* Nascimento + Sexo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="birth_date">Data de Nascimento <span className="text-[#F26522]">*</span></label>
          <input id="birth_date" type="date" className={inputClass} {...register('birth_date')} />
          {errors.birth_date && <p className={errorClass}>{errors.birth_date.message}</p>}
        </div>
        <div>
          <label className={labelClass} htmlFor="gender">Sexo <span className="text-[#F26522]">*</span></label>
          <select id="gender" className={`${inputClass} cursor-pointer`} {...register('gender')}>
            <option value="">Selecione...</option>
            {genderOptions.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          {errors.gender && <p className={errorClass}>{errors.gender.message}</p>}
        </div>
      </div>

      {/* Nível */}
      <div>
        <label className={labelClass}>Nível de corrida <span className="text-[#F26522]">*</span></label>
        <div className="flex flex-col gap-2">
          {levelOptions.map(o => (
            <label key={o.value} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                value={o.value}
                {...register('running_level')}
                className="accent-[#F26522] w-4 h-4 cursor-pointer"
              />
              <span
                className="text-zinc-300 text-sm group-hover:text-white transition-colors"
                style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}
              >
                {o.label}
              </span>
            </label>
          ))}
        </div>
        {errors.running_level && <p className={errorClass}>{errors.running_level.message}</p>}
      </div>

      {/* Como ficou sabendo */}
      <div>
        <label className={labelClass}>Como ficou sabendo do evento?</label>
        <div className="grid grid-cols-2 gap-2">
          {referralOptions.map(o => (
            <label key={o.value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                value={o.value}
                {...register('referral_source')}
                className="accent-[#F26522] w-4 h-4 cursor-pointer"
              />
              <span
                className="text-zinc-400 text-xs sm:text-sm group-hover:text-white transition-colors"
                style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}
              >
                {o.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* LGPD */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            {...register('lgpd_accepted')}
            className="accent-[#F26522] w-4 h-4 mt-0.5 flex-shrink-0 cursor-pointer"
          />
          <span
            className="text-zinc-400 text-xs sm:text-sm leading-relaxed group-hover:text-zinc-300 transition-colors"
            style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}
          >
            Aceito os termos e autorizo o uso da minha imagem durante o evento. <span className="text-[#F26522]">*</span>
          </span>
        </label>
        {errors.lgpd_accepted && <p className={errorClass}>{errors.lgpd_accepted.message}</p>}
      </div>

      {/* Server error */}
      {serverError && (
        <div className="flex items-start gap-2 bg-red-900/20 border border-red-500/30 p-4">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-400 text-sm" style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}>{serverError}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#F26522] text-white font-black text-base sm:text-lg uppercase tracking-wider py-4 sm:py-5 hover:bg-[#CC0000] disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer"
        style={{ fontFamily: 'var(--font-barlow-condensed, sans-serif)' }}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Enviando...
          </>
        ) : (
          'Quero Participar — Inscrição Gratuita'
        )}
      </button>

      <p
        className="text-center text-zinc-600 text-xs"
        style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}
      >
        Inscrição gratuita · Vagas limitadas · 25 de abril de 2026
      </p>
    </form>
  )
}
