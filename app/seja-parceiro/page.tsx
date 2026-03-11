'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, RefreshCw, Check, AlertCircle, Building2, User } from 'lucide-react'

type FormData = {
  nome: string
  email: string
  telefone: string
  tipo_documento: 'cpf' | 'cnpj' | ''
  documento: string
  nome_da_empresa: string
  instagram: string
  descricao: string
}

type CompanyData = {
  razao_social: string
  nome_fantasia: string
  atividade_principal: string
}

// Validação CPF via algoritmo
function validarCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, '')
  if (cleaned.length !== 11 || /^(\d)\1{10}$/.test(cleaned)) return false

  let sum = 0
  let remainder

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleaned.substring(i - 1, i)) * (11 - i)
  }

  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleaned.substring(9, 10))) return false

  sum = 0
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleaned.substring(i - 1, i)) * (12 - i)
  }

  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleaned.substring(10, 11))) return false

  return true
}

export default function SejaParceiro() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [companyData, setCompanyData] = useState<CompanyData | null>(null)
  const [loadingCnpj, setLoadingCnpj] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    telefone: '',
    tipo_documento: '',
    documento: '',
    nome_da_empresa: '',
    instagram: '',
    descricao: '',
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

  const formatCNPJ = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 14)
    if (cleaned.length <= 2) return cleaned
    if (cleaned.length <= 5) return `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`
    if (cleaned.length <= 8) return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5)}`
    if (cleaned.length <= 12) return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8)}`
    return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12)}`
  }

  const handleDocumentoChange = async (value: string) => {
    setFieldErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors.documento
      return newErrors
    })
    setCompanyData(null)

    if (formData.tipo_documento === 'cnpj' && value.replace(/\D/g, '').length === 14) {
      setLoadingCnpj(true)
      try {
        const cnpj = value.replace(/\D/g, '')
        const res = await fetch(`https://publica.cnpj.ws/cnpj/${cnpj}`)
        if (res.ok) {
          const data = await res.json()
          setCompanyData({
            razao_social: data.razao_social || '',
            nome_fantasia: data.nome_fantasia || '',
            atividade_principal: data.cnae_fiscal?.descricao || '',
          })
        }
      } catch {
        console.error('Erro ao buscar CNPJ')
      } finally {
        setLoadingCnpj(false)
      }
    }

    setFormData(prev => ({ ...prev, documento: value }))
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.nome.trim()) errors.nome = 'Nome é obrigatório'
    if (!formData.email.trim()) errors.email = 'E-mail é obrigatório'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'E-mail inválido'
    if (!formData.telefone.trim()) errors.telefone = 'Telefone é obrigatório'
    if (!formData.tipo_documento) errors.tipo_documento = 'Selecione um tipo de documento'

    const docLimpo = formData.documento.replace(/\D/g, '')
    if (!docLimpo) {
      errors.documento = 'Número do documento é obrigatório'
    } else if (formData.tipo_documento === 'cpf') {
      if (docLimpo.length !== 11) errors.documento = 'CPF deve ter 11 dígitos'
      else if (!validarCPF(formData.documento)) errors.documento = 'CPF inválido'
    } else if (formData.tipo_documento === 'cnpj') {
      if (docLimpo.length !== 14) errors.documento = 'CNPJ deve ter 14 dígitos'
    }

    if (!formData.nome_da_empresa.trim()) errors.nome_da_empresa = 'Nome da empresa é obrigatório'
    if (!formData.instagram.trim()) errors.instagram = 'Instagram é obrigatório'
    if (!formData.instagram.startsWith('@')) errors.instagram = 'Instagram deve começar com @'
    if (formData.descricao.trim().length < 50) errors.descricao = 'Descrição deve ter no mínimo 50 caracteres'

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setIsLoading(true)
      setError('')

      const payload = {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        tipo_documento: formData.tipo_documento,
        documento: formData.documento.replace(/\D/g, ''),
        nome_da_empresa: formData.nome_da_empresa,
        instagram: formData.instagram,
        descricao: formData.descricao,
        razao_social: companyData?.razao_social || null,
        nome_fantasia: companyData?.nome_fantasia || null,
        atividade_principal: companyData?.atividade_principal || null,
      }

      const response = await fetch('/api/seja-parceiro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao enviar candidatura')
      }

      router.push('/seja-parceiro/obrigado')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar formulário')
      console.error('[v0] Erro em seja-parceiro:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800 px-3 sm:px-6 py-3 sm:py-4 sticky top-0 z-50 bg-black/95 backdrop-blur-sm">
        <a href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-xs sm:text-sm">
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Voltar ao site
        </a>
      </header>

      <div className="flex-1 flex items-center justify-center px-3 sm:px-4 py-8 sm:py-12">
        <div className="w-full max-w-2xl">
          {/* Título */}
          <div className="text-center mb-8 sm:mb-10">
            <p className="text-orange-500 text-xs font-semibold uppercase tracking-widest mb-2 sm:mb-3">Parcerias</p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight text-balance">
              Seja <span className="text-orange-500">Parceiro</span> Somma Club
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm mt-2 sm:mt-3">
              Vamos crescer juntos! Preencha o formulário e nosso time comercial entrará em contato.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Erro global */}
            {error && (
              <div className="flex items-start gap-3 bg-red-900/20 border border-red-500/40 rounded-lg px-3.5 sm:px-5 py-3 sm:py-4">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-xs sm:text-sm">{error}</p>
              </div>
            )}

            {/* Nome */}
            <div>
              <label className="block text-xs text-zinc-400 uppercase tracking-wide mb-1.5 font-medium">
                Nome Completo
              </label>
              <input
                type="text"
                value={formData.nome}
                onChange={e => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Seu nome"
                className="w-full bg-zinc-900 border-2 border-zinc-700 focus:border-orange-500 text-white placeholder:text-zinc-600 rounded-lg sm:rounded-xl px-3.5 sm:px-5 py-3 sm:py-4 text-sm outline-none transition-all duration-200"
              />
              {fieldErrors.nome && <p className="text-red-400 text-xs mt-1.5">{fieldErrors.nome}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs text-zinc-400 uppercase tracking-wide mb-1.5 font-medium">
                E-mail
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="seu@email.com"
                className="w-full bg-zinc-900 border-2 border-zinc-700 focus:border-orange-500 text-white placeholder:text-zinc-600 rounded-lg sm:rounded-xl px-3.5 sm:px-5 py-3 sm:py-4 text-sm outline-none transition-all duration-200"
              />
              {fieldErrors.email && <p className="text-red-400 text-xs mt-1.5">{fieldErrors.email}</p>}
            </div>

            {/* Telefone */}
            <div>
              <label className="block text-xs text-zinc-400 uppercase tracking-wide mb-1.5 font-medium">
                Telefone
              </label>
              <input
                type="text"
                value={formData.telefone}
                onChange={e => setFormData(prev => ({ ...prev, telefone: formatPhone(e.target.value) }))}
                placeholder="(11) 98765-4321"
                className="w-full bg-zinc-900 border-2 border-zinc-700 focus:border-orange-500 text-white placeholder:text-zinc-600 rounded-lg sm:rounded-xl px-3.5 sm:px-5 py-3 sm:py-4 text-sm outline-none transition-all duration-200"
              />
              {fieldErrors.telefone && <p className="text-red-400 text-xs mt-1.5">{fieldErrors.telefone}</p>}
            </div>

            {/* Tipo de Documento */}
            <div>
              <label className="block text-xs text-zinc-400 uppercase tracking-wide mb-1.5 font-medium">
                Tipo de Documento
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['cpf', 'cnpj'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, tipo_documento: type as 'cpf' | 'cnpj', documento: '' }))
                      setCompanyData(null)
                      setFieldErrors(prev => {
                        const newErrors = { ...prev }
                        delete newErrors.documento
                        return newErrors
                      })
                    }}
                    className={`rounded-lg sm:rounded-xl border-2 p-3 sm:p-4 transition-all duration-200 flex items-center gap-2 text-xs sm:text-sm font-medium ${
                      formData.tipo_documento === type
                        ? 'border-orange-500 bg-orange-500/10 text-white'
                        : 'border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-600'
                    }`}
                  >
                    {type === 'cpf' ? <User className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                    {type.toUpperCase()}
                  </button>
                ))}
              </div>
              {fieldErrors.tipo_documento && <p className="text-red-400 text-xs mt-1.5">{fieldErrors.tipo_documento}</p>}
            </div>

            {/* Documento */}
            {formData.tipo_documento && (
              <div>
                <label className="block text-xs text-zinc-400 uppercase tracking-wide mb-1.5 font-medium">
                  Número do {formData.tipo_documento.toUpperCase()}
                </label>
                <input
                  type="text"
                  value={formData.documento}
                  onChange={e => handleDocumentoChange(formData.tipo_documento === 'cpf' ? formatCPF(e.target.value) : formatCNPJ(e.target.value))}
                  placeholder={formData.tipo_documento === 'cpf' ? '000.000.000-00' : '00.000.000/0000-00'}
                  className="w-full bg-zinc-900 border-2 border-zinc-700 focus:border-orange-500 text-white placeholder:text-zinc-600 rounded-lg sm:rounded-xl px-3.5 sm:px-5 py-3 sm:py-4 text-sm outline-none transition-all duration-200"
                />
                {formData.tipo_documento === 'cpf' && formData.documento.replace(/\D/g, '').length === 11 && (
                  <div className={`flex items-center gap-1.5 mt-1.5 text-xs font-medium ${validarCPF(formData.documento) ? 'text-green-400' : 'text-red-400'}`}>
                    <Check className="w-3.5 h-3.5" />
                    {validarCPF(formData.documento) ? 'CPF válido' : 'CPF inválido'}
                  </div>
                )}
                {fieldErrors.documento && <p className="text-red-400 text-xs mt-1.5">{fieldErrors.documento}</p>}
              </div>
            )}

            {/* Dados da Empresa (CNPJ) */}
            {formData.tipo_documento === 'cnpj' && companyData && (
              <div className="space-y-3 bg-green-900/20 border border-green-500/30 rounded-lg sm:rounded-xl p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Check className="w-4 h-4 text-green-400" />
                  <p className="text-green-400 text-xs sm:text-sm font-medium">Dados da empresa encontrados</p>
                </div>
                {companyData.razao_social && (
                  <div>
                    <p className="text-zinc-400 text-xs uppercase tracking-wide font-medium mb-1">Razão Social</p>
                    <p className="text-white text-sm">{companyData.razao_social}</p>
                  </div>
                )}
                {companyData.nome_fantasia && (
                  <div>
                    <p className="text-zinc-400 text-xs uppercase tracking-wide font-medium mb-1">Nome Fantasia</p>
                    <p className="text-white text-sm">{companyData.nome_fantasia}</p>
                  </div>
                )}
                {companyData.atividade_principal && (
                  <div>
                    <p className="text-zinc-400 text-xs uppercase tracking-wide font-medium mb-1">Atividade Principal</p>
                    <p className="text-white text-sm">{companyData.atividade_principal}</p>
                  </div>
                )}
              </div>
            )}

            {formData.tipo_documento === 'cnpj' && loadingCnpj && (
              <div className="flex items-center gap-2 text-orange-400 text-xs sm:text-sm">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Buscando dados da empresa...
              </div>
            )}

            {/* Nome da Empresa */}
            <div>
              <label className="block text-xs text-zinc-400 uppercase tracking-wide mb-1.5 font-medium">
                Nome da Empresa
              </label>
              <input
                type="text"
                value={formData.nome_da_empresa}
                onChange={e => setFormData(prev => ({ ...prev, nome_da_empresa: e.target.value }))}
                placeholder="Nome da sua empresa"
                className="w-full bg-zinc-900 border-2 border-zinc-700 focus:border-orange-500 text-white placeholder:text-zinc-600 rounded-lg sm:rounded-xl px-3.5 sm:px-5 py-3 sm:py-4 text-sm outline-none transition-all duration-200"
              />
              {fieldErrors.nome_da_empresa && <p className="text-red-400 text-xs mt-1.5">{fieldErrors.nome_da_empresa}</p>}
            </div>

            {/* Instagram */}
            <div>
              <label className="block text-xs text-zinc-400 uppercase tracking-wide mb-1.5 font-medium">
                Instagram
              </label>
              <input
                type="text"
                value={formData.instagram}
                onChange={e => {
                  let value = e.target.value
                  if (value && !value.startsWith('@')) value = '@' + value
                  setFormData(prev => ({ ...prev, instagram: value }))
                }}
                placeholder="@seu_instagram"
                className="w-full bg-zinc-900 border-2 border-zinc-700 focus:border-orange-500 text-white placeholder:text-zinc-600 rounded-lg sm:rounded-xl px-3.5 sm:px-5 py-3 sm:py-4 text-sm outline-none transition-all duration-200"
              />
              {fieldErrors.instagram && <p className="text-red-400 text-xs mt-1.5">{fieldErrors.instagram}</p>}
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-xs text-zinc-400 uppercase tracking-wide mb-1.5 font-medium">
                Descrição da Parceria
              </label>
              <textarea
                value={formData.descricao}
                onChange={e => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                placeholder="Conte-nos sobre sua ideia de parceria com o Somma Club..."
                rows={5}
                className="w-full bg-zinc-900 border-2 border-zinc-700 focus:border-orange-500 text-white placeholder:text-zinc-600 rounded-lg sm:rounded-xl px-3.5 sm:px-5 py-3 sm:py-4 text-sm outline-none transition-all duration-200 resize-none"
              />
              <div className="flex items-center justify-between mt-1.5">
                {fieldErrors.descricao && <p className="text-red-400 text-xs">{fieldErrors.descricao}</p>}
                <p className={`text-xs ml-auto ${formData.descricao.length < 50 ? 'text-zinc-600' : 'text-green-400'}`}>
                  {formData.descricao.length}/50
                </p>
              </div>
            </div>

            {/* Botão Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-semibold py-3 sm:py-4 rounded-lg sm:rounded-xl flex items-center justify-center gap-2 transition-all duration-200 text-sm sm:text-base disabled:cursor-not-allowed hover:shadow-lg hover:shadow-orange-500/25"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Enviar Candidatura
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
