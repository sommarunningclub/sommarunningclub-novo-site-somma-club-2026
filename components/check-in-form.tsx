'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function CheckInForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    cpf: '',
    sexo: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = () => {
    const qrData = JSON.stringify({
      nome: formData.nome,
      cpf: formData.cpf,
      timestamp: new Date().toISOString()
    })
    router.push(`/check-in/sucesso?data=${encodeURIComponent(btoa(qrData))}`)
  }

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length <= 2) return cleaned
    if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`
  }

  const formatCPF = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length <= 3) return cleaned
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`
    if (cleaned.length <= 9) return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`
  }

  if (submitted) {
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-500/5 via-background to-background flex items-center justify-center p-6">
      <div className="max-w-xl w-full">
        {/* Header com Logo e Título */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-balance mb-2">
            Bem-vindo ao <span className="text-orange-500">Check-in</span>
          </h1>
          <p className="text-muted-foreground">Junte-se à comunidade SOMMA em 3 passos simples</p>
        </div>

        {/* Progress Bar com Animação */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-semibold text-foreground">Progresso</p>
            <p className="text-sm font-medium text-orange-500">{step} de 3</p>
          </div>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-500 ease-out shadow-lg"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full transition-all duration-500 ${
                s <= step
                  ? 'bg-gradient-to-r from-orange-400 to-orange-500 shadow-md'
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Content Card com Transições Suaves */}
        <div className="relative">
          {/* Step 1: Nome */}
          {step === 1 && (
            <div>
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-orange-200/50 shadow-lg">
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-foreground mb-4">
                    Qual é seu nome completo?
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    placeholder="Ex: João Silva Santos"
                    autoFocus
                    className="w-full px-6 py-4 border-2 border-orange-200 rounded-xl text-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 bg-background placeholder:text-muted-foreground"
                  />
                </div>

                <div className="text-sm text-muted-foreground space-y-1 mb-8">
                  <p>✓ Seu nome será usado para identificação</p>
                  <p>✓ Certifique-se de usar seu nome completo</p>
                </div>

                <div className="flex gap-3">
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1 opacity-0"
                    disabled
                  />
                  <Button
                    size="lg"
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white gap-2 transition-all duration-300 hover:shadow-lg hover:scale-105"
                    onClick={handleNext}
                    disabled={!formData.nome}
                  >
                    Próximo <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Dados de Contato */}
          {step === 2 && (
            <div>
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-orange-200/50 shadow-lg">
                <div className="space-y-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium mb-3">Telefone</label>
                    <input
                      type="text"
                      name="telefone"
                      value={formatPhone(formData.telefone)}
                      onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value.replace(/\D/g, '') }))}
                      placeholder="(61) 99999-9999"
                      className="w-full px-6 py-4 border-2 border-orange-200 rounded-xl text-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 bg-background"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">CPF</label>
                    <input
                      type="text"
                      name="cpf"
                      value={formatCPF(formData.cpf)}
                      onChange={(e) => setFormData(prev => ({ ...prev, cpf: e.target.value.replace(/\D/g, '') }))}
                      placeholder="000.000.000-00"
                      className="w-full px-6 py-4 border-2 border-orange-200 rounded-xl text-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 bg-background"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">Sexo</label>
                    <select
                      name="sexo"
                      value={formData.sexo}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 border-2 border-orange-200 rounded-xl text-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 bg-background"
                    >
                      <option value="">Selecione uma opção</option>
                      <option value="masculino">Masculino</option>
                      <option value="feminino">Feminino</option>
                      <option value="outro">Outro</option>
                      <option value="prefiro-nao-dizer">Prefiro não dizer</option>
                    </select>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground space-y-2 mb-8">
                  <p>✓ Seu telefone será usado para contato</p>
                  <p>✓ Seu CPF é necessário para validação</p>
                  <p>✓ Essa informação ajuda a melhorar nossa comunidade</p>
                </div>

                <div className="flex gap-3">
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1 transition-all duration-300 hover:shadow-md"
                    onClick={handlePrev}
                  >
                    Voltar
                  </Button>
                  <Button
                    size="lg"
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white gap-2 transition-all duration-300 hover:shadow-lg hover:scale-105"
                    onClick={handleNext}
                    disabled={!formData.telefone || !formData.cpf || !formData.sexo}
                  >
                    Próximo <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirmação */}
          {step === 3 && (
            <div>
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-orange-200/50 shadow-lg">
                <h2 className="text-2xl font-bold mb-6">Revise seus dados</h2>

                <div className="space-y-4 mb-8">
                  <div className="bg-muted/50 rounded-xl p-4 border-l-4 border-orange-500 transition-all duration-300 hover:shadow-md hover:scale-105">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Nome</p>
                    <p className="text-lg font-semibold">{formData.nome || '—'}</p>
                  </div>

                  <div className="bg-muted/50 rounded-xl p-4 border-l-4 border-orange-500 transition-all duration-300 hover:shadow-md hover:scale-105">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Telefone</p>
                    <p className="text-lg font-semibold">{formatPhone(formData.telefone) || '—'}</p>
                  </div>

                  <div className="bg-muted/50 rounded-xl p-4 border-l-4 border-orange-500 transition-all duration-300 hover:shadow-md hover:scale-105">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">CPF</p>
                    <p className="text-lg font-semibold font-mono">{formatCPF(formData.cpf) || '—'}</p>
                  </div>

                  <div className="bg-muted/50 rounded-xl p-4 border-l-4 border-orange-500 transition-all duration-300 hover:shadow-md hover:scale-105">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Sexo</p>
                    <p className="text-lg font-semibold capitalize">
                      {formData.sexo 
                        ? formData.sexo.replace('-', ' ') 
                        : '—'
                      }
                    </p>
                  </div>
                </div>

                <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 rounded-xl p-4 mb-8">
                  <p className="text-sm text-orange-900 dark:text-orange-100">
                    Certifique-se de que todos os dados estão corretos antes de confirmar seu check-in.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1 transition-all duration-300 hover:shadow-md"
                    onClick={handlePrev}
                  >
                    Voltar
                  </Button>
                  <Button
                    size="lg"
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white gap-2 transition-all duration-300 hover:shadow-lg hover:scale-105"
                    onClick={handleSubmit}
                    disabled={!formData.nome || !formData.telefone || !formData.cpf || !formData.sexo}
                  >
                    Confirmar <CheckCircle2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
