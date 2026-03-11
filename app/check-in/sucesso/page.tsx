'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { ArrowLeft, CheckCircle, Calendar, Clock, MapPin } from 'lucide-react'

function CheckInSucessoContent() {
  const searchParams = useSearchParams()
  const dataEvento = searchParams.get('data') || 'Sábado, 14 de março de 2026'
  const nomeEvento = searchParams.get('evento') || 'Somma Club — Edição #02 de Março'

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <header className="border-b border-zinc-800 px-6 py-4">
        <a href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />
          Voltar ao site
        </a>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">

          {/* Ícone */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-2xl animate-pulse" />
              <div className="relative w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>

          <p className="text-orange-500 text-xs font-semibold uppercase tracking-widest mb-3">Check-in confirmado</p>
          <h1 className="text-3xl font-bold text-white mb-3">Você está dentro!</h1>
          <p className="text-zinc-400 text-sm leading-relaxed mb-10">
            Sua vaga foi reservada. Nos vemos no Parque da Cidade no sábado de manhã — venha preparado para correr, se divertir e tomar um café delicioso depois!
          </p>

          {/* Detalhes */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-left space-y-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 text-orange-500" />
              </div>
              <div>
                <p className="text-zinc-500 text-xs">Data</p>
                <p className="text-white text-sm font-medium">{dataEvento}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-orange-500" />
              </div>
              <div>
                <p className="text-zinc-500 text-xs">Horário</p>
                <p className="text-white text-sm font-medium">A partir das 07h00</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-orange-500" />
              </div>
              <div>
                <p className="text-zinc-500 text-xs">Local</p>
                <p className="text-white text-sm font-medium">Parque da Cidade — Brasília, DF</p>
                <p className="text-zinc-400 text-xs mt-1">Estacionamento 10, sempre aos sábados, às 7h da manhã</p>
              </div>
            </div>
          </div>

          {/* Aviso */}
          <div className="bg-orange-950/40 border border-orange-500/30 rounded-xl p-4 mb-8 text-left">
            <p className="text-orange-300 text-xs font-semibold uppercase tracking-wide mb-1">Importante</p>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Salve o seu CPF cadastrado ou tire um print desta tela. Ele será usado para identificar sua presença no evento.
            </p>
          </div>

          {/* Link de localização */}
          <a 
            href="https://maps.app.goo.gl/uoXH8fHjhdTXMWAj7" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full border border-orange-500 hover:bg-orange-500/10 text-orange-500 hover:text-orange-400 font-semibold py-3 rounded-xl text-center transition-all duration-200 text-sm mb-3"
          >
            Ver localização no mapa
          </a>

          <a
            href="/"
            className="block w-full border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white font-semibold py-4 rounded-xl text-center transition-all duration-200 text-sm"
          >
            Voltar ao site
          </a>
        </div>
      </div>
    </main>
  )
}

export default function CheckInSucessoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <CheckInSucessoContent />
    </Suspense>
  )
}
