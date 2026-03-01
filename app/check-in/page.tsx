import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { CheckCircle2, QrCode, Gift, Coffee, MapPin, Clock, Users } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Check-in | SOMMA Running Club",
  description: "Guia completo sobre o check-in do SOMMA. Saiba como fazer o check-in, salvar o QR code e aproveitar café, ativações e sorteios.",
  keywords: ["check-in", "QR code", "eventos", "SOMMA", "pulseira", "sorteios", "café"],
}

export default function CheckInPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      {/* Header */}
      <div className="relative py-16 md:py-24">
        <div 
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: "url(https://cdn.shopify.com/s/files/1/0788/1932/8253/files/IMG_0888_JPG.jpg?v=1772326001)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed"
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="mx-auto max-w-5xl px-6 text-center text-white relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Como Fazer o <span className="text-orange-400">Check-in</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto">
            Seu guia completo para participar dos eventos do SOMMA e aproveitar todos os benefícios
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        {/* 4 Steps Section */}
        <section className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            4 Passos Simples
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Step 1 */}
            <Card className="border-orange-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-orange-500 text-white text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold">Inscreva-se</h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Preencha o formulário de cadastro na plataforma do SOMMA. Forneça seus dados pessoais e informações de contato.
                </p>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="border-orange-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-orange-500 text-white text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold">Salve o QR Code</h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Após a inscrição, você receberá um QR code único por e-mail. Salve em seu telefone ou imprima.
                </p>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="border-orange-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-orange-500 text-white text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold">Retire a Pulseira</h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  No dia do evento, apresente seu QR code no ponto de check-in e retire sua pulseira.
                </p>
              </CardContent>
            </Card>

            {/* Step 4 */}
            <Card className="border-orange-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-orange-500 text-white text-2xl font-bold mx-auto mb-4">
                  4
                </div>
                <h3 className="text-xl font-semibold">Aproveite!</h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Com a pulseira, você tem acesso a todos os benefícios do evento incluindo café da manhã.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Detailed Steps */}
        <section className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Detalhes de Cada Passo</h2>

          {/* Step 1 Detailed */}
          <Card className="mb-8 border-orange-200">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-orange-500/10 text-orange-500">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-semibold">Passo 1: Inscreva-se</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                O primeiro passo é se inscrever na plataforma do SOMMA. Acesse o formulário de cadastro e preencha com suas informações:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex gap-2">
                  <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span>Nome completo</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span>E-mail válido (importante para receber o QR code)</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span>Telefone/WhatsApp</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span>CPF</span>
                </li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Após preencher todas as informações, clique em "Inscrever-se" para finalizar.
              </p>
            </CardContent>
          </Card>

          {/* Step 2 Detailed */}
          <Card className="mb-8 border-orange-200">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-orange-500/10 text-orange-500">
                  <QrCode className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-semibold">Passo 2: Salve o QR Code</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Após sua inscrição ser confirmada, você receberá um e-mail com um QR code único. Este código é essencial para o check-in:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex gap-2">
                  <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span>Abra o e-mail com o QR code</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span>Faça screenshot da imagem do QR code</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span>Ou imprima e leve no dia do evento</span>
                </li>
              </ul>
              <p className="text-sm bg-orange-50 dark:bg-orange-950 p-3 rounded-lg">
                💡 Dica: Salve o QR code como favorito ou guarde a imagem em sua galeria para fácil acesso no dia do evento.
              </p>
            </CardContent>
          </Card>

          {/* Step 3 Detailed */}
          <Card className="mb-8 border-orange-200">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-orange-500/10 text-orange-500">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-semibold">Passo 3: Retire a Pulseira</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                No dia do evento, chegue ao local com antecedência. Localize o ponto de check-in:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex gap-2">
                  <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span>Procure pela equipe do SOMMA no ponto de check-in</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span>Apresente seu QR code (screenshot ou impresso)</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span>Retire sua pulseira de acesso</span>
                </li>
              </ul>
              <p className="text-sm text-muted-foreground">
                A pulseira é seu passaporte para acessar todas as atrações do evento.
              </p>
            </CardContent>
          </Card>

          {/* Step 4 Detailed */}
          <Card className="border-orange-200">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-orange-500/10 text-orange-500">
                  <Gift className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-semibold">Passo 4: Aproveite!</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Com sua pulseira de check-in, você tem acesso a todos os benefícios exclusivos do evento:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Coffee className="w-5 h-5 text-orange-500" />
                    <h4 className="font-semibold">Café da Manhã</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">Refeição completa para recarregar suas energias antes de correr.</p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Gift className="w-5 h-5 text-orange-500" />
                    <h4 className="font-semibold">Sorteios</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">Prêmios e brindes exclusivos para participantes do evento.</p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-orange-500" />
                    <h4 className="font-semibold">Ativações</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">Experiências interativas e networking com a comunidade.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Important Notes */}
        <section className="mb-20">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Informações Importantes</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950">
              <CardHeader>
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Horário de Check-in</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  O check-in abre 30 minutos antes do início do evento. Chegue com antecedência para evitar filas.
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50 dark:bg-green-950">
              <CardHeader>
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">Documentação</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-green-800 dark:text-green-200">
                  Leve um documento de identidade para confirmar seus dados no check-in.
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950">
              <CardHeader>
                <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100">QR Code</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-purple-800 dark:text-purple-200">
                  Guarde bem seu QR code. Sem ele, não será possível fazer o check-in e retirar a pulseira.
                </p>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950">
              <CardHeader>
                <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100">Dúvidas?</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  Entre em contato conosco pelo WhatsApp ou e-mail se tiver dúvidas sobre o processo.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-orange-500 text-white rounded-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para fazer seu Check-in?</h2>
          <p className="text-lg mb-8 opacity-90">
            Inscreva-se agora e garanta seu lugar nos próximos eventos do SOMMA
          </p>
          <Link href="/#inscricao">
            <Button size="lg" className="bg-white text-orange-500 hover:bg-gray-100">
              Inscrever-se Agora
            </Button>
          </Link>
        </section>
      </div>
    </main>
  )
}
