'use client'

import { Button } from '@/components/ui/button'
import { Heart, MessageCircle } from 'lucide-react'
import Link from 'next/link'

export default function ObrigadoPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Ícone de sucesso */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 rounded-full p-6 shadow-lg">
              <Heart className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        {/* Título e mensagem */}
        <h1 className="text-4xl font-bold mb-3 text-foreground">Bem-vindo!</h1>
        <p className="text-lg text-muted-foreground mb-2">
          Sua inscrição foi realizada com sucesso!
        </p>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Agora você faz parte da comunidade SOMMA Running Club. Junte-se ao nosso grupo do WhatsApp para receber atualizações sobre os encontros, dicas de treino e muito mais!
        </p>

        {/* Card com informações */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border-2 border-orange-200 mb-8">
          <h2 className="font-semibold mb-4 text-foreground">Próximos Passos:</h2>
          <ul className="space-y-3 text-left text-sm">
            <li className="flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold">1</span>
              <span>Entre no grupo do WhatsApp</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold">2</span>
              <span>Apresente-se à comunidade</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold">3</span>
              <span>Confirme presença nos encontros</span>
            </li>
          </ul>
        </div>

        {/* Botão WhatsApp */}
        <a 
          href="https://chat.whatsapp.com/Cw7SxDvVDDW6kAW0fj06FT?mode=gi_t" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full"
        >
          <Button 
            size="lg" 
            className="w-full bg-green-500 hover:bg-green-600 text-white gap-2 mb-3"
          >
            <MessageCircle className="w-5 h-5" />
            Entrar no Grupo WhatsApp
          </Button>
        </a>

        {/* Botão voltar home */}
        <Link href="/" className="w-full">
          <Button 
            size="lg" 
            variant="outline"
            className="w-full"
          >
            Voltar ao Site
          </Button>
        </Link>

        {/* Mensagem de suporte */}
        <p className="text-xs text-muted-foreground mt-8">
          Se tiver dúvidas, fale conosco no WhatsApp da comunidade!
        </p>
      </div>
    </main>
  )
}
