'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function JoinClubForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const formData = new FormData(e.currentTarget)
      const nome = formData.get('nome') as string
      const email = formData.get('email') as string
      const cpf = formData.get('cpf') as string
      const telefone = formData.get('whatsapp') as string
      const data_nascimento = formData.get('data') as string

      const response = await fetch('/api/cadastro-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          email,
          cpf,
          telefone,
          data_nascimento,
          sexo: formData.get('sexo'),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error)
      }

      // Redirecionar após sucesso
      window.location.href = '/obrigado'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar formulário')
      console.error('[v0] Erro no cadastro:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Seção 1 - Dados Pessoais */}
      <div>
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-orange-500/10 text-orange-500 font-semibold">1</span>
          Dados Pessoais
        </h3>

        <div className="space-y-4">
          {/* Nome */}
          <div>
            <label htmlFor="nome" className="block text-sm font-medium mb-2">
              Nome Completo <span className="text-red-500">*</span>
            </label>
            <input
              id="nome"
              name="nome"
              type="text"
              placeholder="João Silva Santos"
              className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              E-mail <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
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
              name="cpf"
              type="text"
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
                name="data"
                type="text"
                placeholder="DD/MM/AAAA"
                className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            {/* CEP */}
            <div>
              <label htmlFor="cep" className="block text-sm font-medium mb-2">
                CEP <span className="text-red-500">*</span>
              </label>
              <input
                id="cep"
                name="cep"
                type="text"
                placeholder="00000-000"
                className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
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
              name="whatsapp"
              type="tel"
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
            className="mt-1 h-5 w-5 rounded border-zinc-300 text-orange-500 focus:ring-orange-500 focus:ring-offset-0"
            required
          />
          <span className="text-sm text-muted-foreground leading-relaxed">
            Aceito os termos da LGPD, autorizo o tratamento dos meus dados pessoais e o uso da minha imagem em atividades do clube. <span className="text-red-500">*</span>
          </span>
        </label>
      </div>

      {/* Erro */}
      {error && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3">
          <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
        </div>
      )}

      {/* Botão de Submit */}
      <Button 
        type="submit"
        size="lg" 
        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        {isLoading ? 'Enviando...' : 'Inscrever-se agora'}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        Seus dados serão tratados conforme nossa política de privacidade.
      </p>
    </form>
  )
}
