'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

export function CheckInForm() {
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
    setSubmitted(true)
    console.log('Form submitted:', formData)
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

  const progressPercentage = (step / 3) * 100

  if (submitted) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-orange-500/5 via-background to-background flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center animate-in fade-in zoom-in duration-500">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 rounded-full p-4 shadow-lg">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2">Parabéns!</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Seu check-in foi realizado com sucesso. Você já está registrado na comunidade SOMMA.
          </p>
          <div className="bg-muted/50 rounded-lg p-4 mb-6 border border-orange-200">
            <p className="text-sm text-muted-foreground mb-2">Próximos passos:</p>
            <ul className="text-sm space-y-1 text-left">
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 bg-orange-500 rounded-full text-white text-xs flex items-center justify-center">1</span>
                Guarde seu QR code
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 bg-orange-500 rounded-full text-white text-xs flex items-center justify-center">2</span>
                Retire sua pulseira no evento
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 bg-orange-500 rounded-full text-white text-xs flex items-center justify-center">3</span>
                Aproveite a comunidade!
              </li>
            </ul>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-500/5 via-background to-background flex items-center justify-center p-6">
      <div className="max-w-xl w-full">
        {/* Header com Logo e Título */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <h1 className="text-4xl font-bold text-text-balance mb-2">
            Bem-vindo ao <span className="text-orange-500">Check-in</span>
          </h1>
          <p className="text-muted-foreground">Junte-se à comunidade SOMMA em 3 passos simples</p>
        </div>

        {/* Progress Bar com Animação */}
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500 delay-100">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-semibold text-foreground">Progresso</p>
            <p className="text-sm font-medium text-orange-500">{step} de 3</p>
          </div>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-500 ease-out shadow-lg"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex gap-2 mb-8 animate-in fade-in slide-in-from-top-4 duration-500 delay-150">
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
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
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
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
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
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
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

      {/* Estilos CSS inlineados para animações */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-in {
          animation: fadeIn 0.5s ease-out;
        }

        .fade-in {
          animation: fadeIn 0.5s ease-out;
        }

        .slide-in-from-right-4 {
          animation: slideInFromRight 0.5s ease-out;
        }

        .slide-in-from-top-4 {
          animation: slideInFromTop 0.5s ease-out;
        }

        .delay-100 {
          animation-delay: 100ms;
        }

        .delay-150 {
          animation-delay: 150ms;
        }

        .duration-300 {
          animation-duration: 300ms;
        }

        .duration-500 {
          animation-duration: 500ms;
        }
      `}</style>
    </main>
  )
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
    setSubmitted(true)
    console.log('Form submitted:', formData)
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
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <CheckCircle2 className="w-16 h-16 text-orange-500 mx-auto" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Check-in Confirmado!</h2>
          <p className="text-muted-foreground mb-6">
            Bem-vindo {formData.nome}! Seu QR code foi enviado para seu e-mail. Não esqueça de salvá-lo.
          </p>
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-orange-200 p-6 mb-6">
            <p className="text-sm text-muted-foreground mb-2">Seu CPF:</p>
            <p className="text-lg font-mono font-semibold">{formData.cpf}</p>
          </div>
          <Button 
            size="lg" 
            className="bg-orange-500 hover:bg-orange-600 text-white w-full"
            onClick={() => setSubmitted(false)}
          >
            Fazer novo check-in
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Bem-vindo ao <span className="text-orange-500">Check-in</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Confirme suas informações para garantir acesso ao café da manhã e sorteios
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col items-center flex-1">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-2 transition-all ${
                  s === step
                    ? 'bg-orange-500 text-white scale-110'
                    : s < step
                    ? 'bg-orange-500 text-white'
                    : 'bg-muted text-muted-foreground border-2 border-orange-200'
                }`}
              >
                {s < step ? '✓' : s}
              </div>
              <p className="text-xs md:text-sm text-center text-muted-foreground">
                {s === 1 && 'Seu Nome'}
                {s === 2 && 'Contato'}
                {s === 3 && 'Confirmação'}
              </p>
              {s < 3 && (
                <div
                  className={`w-1 h-8 mt-2 ${
                    s < step ? 'bg-orange-500' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-orange-200 p-8 md:p-12 shadow-lg">
          {/* Step 1 - Nome */}
          {step === 1 && (
            <div className="animate-in fade-in duration-300">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-orange-500/10 p-3 rounded-full">
                    <span className="text-orange-500 font-bold text-xl">1</span>
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold">Qual é seu nome?</h2>
                    <p className="text-sm text-muted-foreground mt-1">Começamos por aqui</p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium mb-3">Nome Completo</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  placeholder="João Silva"
                  className="w-full px-6 py-4 border-2 border-orange-200 rounded-lg text-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all bg-background"
                />
              </div>

              <div className="text-sm text-muted-foreground mb-8">
                <p>✓ Use seu nome completo como aparece no seu documento</p>
              </div>
            </div>
          )}

          {/* Step 2 - Telefone e CPF */}
          {step === 2 && (
            <div className="animate-in fade-in duration-300">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-orange-500/10 p-3 rounded-full">
                    <span className="text-orange-500 font-bold text-xl">2</span>
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold">Seus dados de contato</h2>
                    <p className="text-sm text-muted-foreground mt-1">Precisamos dessas informações para seu check-in</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-sm font-medium mb-3">Telefone</label>
                  <input
                    type="text"
                    name="telefone"
                    value={formatPhone(formData.telefone)}
                    onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value.replace(/\D/g, '') }))}
                    placeholder="(61) 99999-9999"
                    className="w-full px-6 py-4 border-2 border-orange-200 rounded-lg text-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all bg-background"
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
                    className="w-full px-6 py-4 border-2 border-orange-200 rounded-lg text-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Sexo</label>
                  <select
                    name="sexo"
                    value={formData.sexo}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 border-2 border-orange-200 rounded-lg text-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all bg-background"
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
            </div>
          )}

          {/* Step 3 - Confirmação */}
          {step === 3 && (
            <div className="animate-in fade-in duration-300">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-orange-500/10 p-3 rounded-full">
                    <span className="text-orange-500 font-bold text-xl">3</span>
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold">Confirme seus dados</h2>
                    <p className="text-sm text-muted-foreground mt-1">Verifique se tudo está correto</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="bg-muted/50 rounded-lg p-4 border border-orange-200">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Nome</p>
                  <p className="text-lg font-semibold">{formData.nome || '—'}</p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 border border-orange-200">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Telefone</p>
                  <p className="text-lg font-semibold">{formatPhone(formData.telefone) || '—'}</p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 border border-orange-200">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">CPF</p>
                  <p className="text-lg font-semibold font-mono">{formatCPF(formData.cpf) || '—'}</p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 border border-orange-200">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Sexo</p>
                  <p className="text-lg font-semibold capitalize">
                    {formData.sexo 
                      ? formData.sexo.replace('-', ' ') 
                      : '—'
                    }
                  </p>
                </div>
              </div>

              <div className="bg-orange-500/10 border border-orange-200 rounded-lg p-4 mb-8">
                <p className="text-sm text-foreground">
                  Ao confirmar, você autoriza o uso de seus dados para o check-in do evento e recebimento de informações relacionadas.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 justify-between mt-12">
            <Button
              variant="outline"
              size="lg"
              onClick={handlePrev}
              disabled={step === 1}
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Voltar
            </Button>

            {step < 3 ? (
            <Button
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white gap-2"
              onClick={handleNext}
              disabled={
                (step === 1 && !formData.nome) ||
                (step === 2 && (!formData.telefone || !formData.cpf || !formData.sexo))
              }
            >
                Próximo
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white gap-2"
                onClick={handleSubmit}
                disabled={!formData.nome || !formData.telefone || !formData.cpf || !formData.sexo}
              >
                Confirmar Check-in
                <CheckCircle2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Benefícios */}
        <div className="mt-12 bg-white dark:bg-zinc-900 rounded-xl border border-orange-200 p-8">
          <h3 className="text-xl font-bold mb-6">Ao fazer check-in você tem acesso a:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex gap-3">
              <span className="text-2xl">☕</span>
              <div>
                <p className="font-semibold">Café da Manhã</p>
                <p className="text-sm text-muted-foreground">Refeição completa</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">🎁</span>
              <div>
                <p className="font-semibold">Sorteios</p>
                <p className="text-sm text-muted-foreground">Prêmios exclusivos</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">🎉</span>
              <div>
                <p className="font-semibold">Ativações</p>
                <p className="text-sm text-muted-foreground">Experiências únicas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
