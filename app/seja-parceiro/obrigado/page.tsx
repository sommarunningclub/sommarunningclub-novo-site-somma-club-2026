'use client'

import { ArrowLeft, CheckCircle, Mail } from 'lucide-react'

export default function SejaParceirObrigado() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <header className="border-b border-zinc-800 px-3 sm:px-6 py-3 sm:py-4">
        <a href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-xs sm:text-sm">
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Voltar ao site
        </a>
      </header>

      <div className="flex-1 flex items-center justify-center px-3 sm:px-4 py-8 sm:py-12">
        <div className="w-full max-w-md text-center">

          {/* Ícone */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-2xl animate-pulse" />
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-orange-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
            </div>
          </div>

          <p className="text-orange-500 text-xs font-semibold uppercase tracking-widest mb-2 sm:mb-3">Candidatura recebida</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3">Obrigado!</h1>
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-8 sm:mb-10">
            Seus dados foram enviados com sucesso para o nosso time comercial. Em breve entraremos em contato para discutir as melhores oportunidades de parceria.
          </p>

          {/* Info box */}
          <div className="rounded-lg sm:rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 sm:p-6 text-left space-y-3 sm:space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500" />
              </div>
              <div>
                <p className="text-zinc-400 text-xs uppercase tracking-wide font-medium">Próximo passo</p>
                <p className="text-white text-sm mt-1">Fique atento ao seu e-mail e telefone. A Camilla Rodrigues vai entrar em contato para entender melhor o fit entre os dois negócios.</p>
              </div>
            </div>
          </div>

          {/* Aviso */}
          <div className="bg-orange-950/40 border border-orange-500/30 rounded-lg sm:rounded-xl p-4 sm:p-5 mb-8 text-left">
            <p className="text-orange-300 text-xs font-semibold uppercase tracking-wide mb-1.5">Dica</p>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              Verifique a pasta de spam ou promoções. Às vezes nossos e-mails caem lá por engano. Não esqueça de adicionar nosso e-mail aos seus contatos!
            </p>
          </div>

          {/* Botões */}
          <div className="space-y-2 sm:space-y-3">
            <a
              href="/"
              className="block w-full border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white font-semibold py-3 sm:py-4 rounded-lg sm:rounded-xl text-center transition-all duration-200 text-xs sm:text-sm"
            >
              Voltar ao site
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
