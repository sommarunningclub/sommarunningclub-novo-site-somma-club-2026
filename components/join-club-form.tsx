'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from './ui/button'

export function JoinClubForm() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    data: '',
    cep: '',
    bairro: '',
    cidade: '',
    whatsapp: '',
    sexo: '',
    termos: false,
  })

  const [loading, setLoading] = useState(false)
  const [cepError, setCepError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const fieldValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value

    setFormData(prev => ({
      ...prev,
      [name]: fieldValue
    }))
  }

  const buscarCEP = async (cep: string) => {
    if (cep.replace(/\D/g, '').length !== 8) {
      setCepError('')
      return
    }

    setLoading(true)
    setCepError('')

    try {
      const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep.replace(/\D/g, '')}`)
      
      if (!response.ok) {
        setCepError('CEP não encontrado')
        setFormData(prev => ({
          ...prev,
          bairro: '',
          cidade: ''
        }))
        setLoading(false)
        return
      }

      const data = await response.json()
      
      setFormData(prev => ({
        ...prev,
        bairro: data.neighborhood || '',
        cidade: data.city || ''
      }))
      setCepError('')
    } catch (error) {
      setCepError('Erro ao buscar CEP')
      setFormData(prev => ({
        ...prev,
        bairro: '',
        cidade: ''
      }))
    } finally {
      setLoading(false)
    }
  }

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 8) value = value.slice(0, 8)
    
    const formatted = value.length > 5 ? `${value.slice(0, 5)}-${value.slice(5)}` : value
    
    setFormData(prev => ({
      ...prev,
      cep: formatted
    }))

    if (value.length === 8) {
      buscarCEP(value)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.termos) {
      alert('Aceite os termos para continuar')
      return
    }
    window.location.href = '/obrigado'
  }

  return (
    <form className="space-y-8 bg-white dark:bg-zinc-900 rounded-lg border border-orange-200 p-8 md:p-12" onSubmit={handleSubmit}>
      {/* Informações Pessoais */}
      <div>
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-orange-500/10 text-orange-500 font-semibold">1</span>
          Informações Pessoais
        </h3>

        <div className="space-y-4">
          {/* Nome completo */}
          <div>
            <label htmlFor="nome" className="block text-sm font-medium mb-2">
              Nome completo <span className="text-red-500">*</span>
            </label>
            <input
              id="nome"
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              placeholder="Seu nome completo"
              className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          {/* E-mail */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              E-mail <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="seu@email.com"
              className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          {/* CPF */}
          <div>
            <label htmlFor="cpf" className="block text-sm font-medium mb-2">
              CPF <span className="text-red-500">*</span>
            </label>
            <input
              id="cpf"
              type="text"
              name="cpf"
              value={formData.cpf}
              onChange={handleInputChange}
              placeholder="000.000.000-00"
              className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          {/* Grid para Data de nascimento e CEP */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Data de nascimento */}
            <div>
              <label htmlFor="data" className="block text-sm font-medium mb-2">
                Data de nascimento <span className="text-red-500">*</span>
              </label>
              <input
                id="data"
                type="date"
                name="data"
                value={formData.data}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            {/* CEP */}
            <div>
              <label htmlFor="cep" className="block text-sm font-medium mb-2">
                CEP <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="cep"
                  type="text"
                  name="cep"
                  value={formData.cep}
                  onChange={handleCepChange}
                  placeholder="00000-000"
                  className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
                {loading && (
                  <Loader2 className="absolute right-3 top-2.5 h-5 w-5 animate-spin text-orange-500" />
                )}
              </div>
              {cepError && <p className="text-xs text-red-500 mt-1">{cepError}</p>}
            </div>
          </div>

          {/* Grid para Bairro e Cidade */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bairro */}
            <div>
              <label htmlFor="bairro" className="block text-sm font-medium mb-2">
                Bairro <span className="text-red-500">*</span>
              </label>
              <input
                id="bairro"
                type="text"
                name="bairro"
                value={formData.bairro}
                placeholder="Preenchido automaticamente"
                className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-muted text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                readOnly
                required
              />
            </div>

            {/* Cidade */}
            <div>
              <label htmlFor="cidade" className="block text-sm font-medium mb-2">
                Cidade <span className="text-red-500">*</span>
              </label>
              <input
                id="cidade"
                type="text"
                name="cidade"
                value={formData.cidade}
                placeholder="Preenchido automaticamente"
                className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-muted text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                readOnly
                required
              />
            </div>
          </div>

          {/* WhatsApp */}
          <div>
            <label htmlFor="whatsapp" className="block text-sm font-medium mb-2">
              WhatsApp <span className="text-red-500">*</span>
            </label>
            <input
              id="whatsapp"
              type="tel"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleInputChange}
              placeholder="(61) 99999-9999"
              className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          {/* Sexo */}
          <div>
            <label htmlFor="sexo" className="block text-sm font-medium mb-2">
              Sexo <span className="text-red-500">*</span>
            </label>
            <select
              id="sexo"
              name="sexo"
              value={formData.sexo}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            >
              <option value="">Selecione uma opção</option>
              <option value="masculino">Masculino</option>
              <option value="feminino">Feminino</option>
              <option value="outro">Outro</option>
              <option value="prefiro-nao-dizer">Prefiro não dizer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Divisor */}
      <div className="border-t border-zinc-200 dark:border-zinc-700"></div>

      {/* Termos e Condições */}
      <div>
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-orange-500/10 text-orange-500 font-semibold">2</span>
          Termos e Condições
        </h3>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="termos"
            checked={formData.termos}
            onChange={handleInputChange}
            className="mt-1 h-5 w-5 rounded border-zinc-300 text-orange-500 focus:ring-orange-500 focus:ring-offset-0"
            required
          />
          <span className="text-sm text-muted-foreground leading-relaxed">
            Aceito os termos da LGPD, autorizo o tratamento dos meus dados pessoais e o uso da minha imagem em atividades do clube. <span className="text-red-500">*</span>
          </span>
        </label>
      </div>

      {/* Botão de Submit */}
      <Button 
        size="lg" 
        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 text-base font-semibold"
        type="submit"
      >
        Inscrever-se agora
      </Button>
    </form>
  )
}
