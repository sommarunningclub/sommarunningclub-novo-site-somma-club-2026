'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import QRCode from 'qrcode.react'
import { Download, Copy, CheckCircle2 } from 'lucide-react'

export default function SucessoPage() {
  const searchParams = useSearchParams()
  const [userData, setUserData] = useState<any>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const data = searchParams.get('data')
    if (data) {
      try {
        const decoded = JSON.parse(atob(decodeURIComponent(data)))
        setUserData(decoded)
      } catch (error) {
        console.error('Erro ao decodificar dados:', error)
      }
    }
  }, [searchParams])

  const handleCopyQRCode = () => {
    const qrElement = document.getElementById('qr-code')
    if (qrElement) {
      const canvas = qrElement.querySelector('canvas')
      if (canvas) {
        canvas.toBlob((blob) => {
          if (blob) {
            navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ])
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          }
        })
      }
    }
  }

  const handleDownloadQRCode = () => {
    const qrElement = document.getElementById('qr-code')
    if (qrElement) {
      const canvas = qrElement.querySelector('canvas')
      if (canvas) {
        const link = document.createElement('a')
        link.download = `qrcode-${userData?.cpf || 'checkin'}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
      }
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header com fundo laranja */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-8 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white rounded-full p-3 shadow-lg">
              <CheckCircle2 className="w-8 h-8 text-orange-500" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">Parabéns!</h1>
          <p className="text-white/90">Seu check-in foi realizado com sucesso</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Dados do Check-in */}
        {userData && (
          <div className="bg-zinc-900 border-2 border-orange-500 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-orange-400 mb-6">Seu Registro</h2>
            
            <div className="space-y-4 mb-8">
              <div className="bg-zinc-800 rounded-lg p-4 border-l-4 border-orange-500">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Nome</p>
                <p className="text-xl font-semibold text-white">{userData.nome}</p>
              </div>

              <div className="bg-zinc-800 rounded-lg p-4 border-l-4 border-orange-500">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">CPF</p>
                <p className="text-xl font-mono font-semibold text-white">{userData.cpf}</p>
              </div>

              <div className="bg-zinc-800 rounded-lg p-4 border-l-4 border-orange-500">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Data e Hora</p>
                <p className="text-lg font-semibold text-white">
                  {new Date(userData.timestamp).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>

            {/* QR Code */}
            <div className="bg-zinc-800 rounded-xl p-6 mb-8 flex flex-col items-center">
              <p className="text-gray-400 text-sm uppercase tracking-wide mb-4">Seu QR Code</p>
              <div id="qr-code" className="bg-white p-4 rounded-lg shadow-lg">
                <QRCode
                  value={JSON.stringify({
                    nome: userData.nome,
                    cpf: userData.cpf,
                    timestamp: userData.timestamp
                  })}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className="text-gray-400 text-xs mt-4 text-center max-w-sm">
                Apresente este QR code no evento para retirar sua pulseira
              </p>
            </div>

            {/* Ações */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                onClick={handleCopyQRCode}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-orange-500/50"
              >
                <Copy className="w-5 h-5" />
                <span className="hidden sm:inline">Copiar QR Code</span>
                <span className="sm:hidden">Copiar</span>
              </button>
              <button
                onClick={handleDownloadQRCode}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-orange-500/50"
              >
                <Download className="w-5 h-5" />
                <span className="hidden sm:inline">Baixar QR Code</span>
                <span className="sm:hidden">Baixar</span>
              </button>
            </div>

            {copied && (
              <div className="text-center text-green-400 text-sm mb-4">
                ✓ QR Code copiado para a área de transferência!
              </div>
            )}
          </div>
        )}

        {/* Informações Importantes */}
        <div className="bg-zinc-900 border border-orange-500/50 rounded-2xl p-8 mb-8">
          <h3 className="text-xl font-bold text-orange-400 mb-6">Importante</h3>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-orange-500 text-white font-bold">1</div>
              </div>
              <div>
                <p className="font-semibold text-white mb-1">Guarde o QR Code</p>
                <p className="text-gray-400 text-sm">Faça um print ou salve a imagem do seu QR code. Você precisará apresentá-lo no evento.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-orange-500 text-white font-bold">2</div>
              </div>
              <div>
                <p className="font-semibold text-white mb-1">Anote seu CPF</p>
                <p className="text-gray-400 text-sm">Memorize ou anote seu CPF: <span className="font-mono font-semibold text-white">{userData?.cpf}</span>. Você pode precisar dele no evento.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-orange-500 text-white font-bold">3</div>
              </div>
              <div>
                <p className="font-semibold text-white mb-1">No Dia do Evento</p>
                <p className="text-gray-400 text-sm">Apresente seu QR code na entrada para retirar sua pulseira e acessar os benefícios (café, sorteios e ativações).</p>
              </div>
            </div>
          </div>
        </div>

        {/* Local do Evento */}
        <div className="bg-zinc-900 border-2 border-orange-500 rounded-2xl p-8 text-center">
          <p className="text-gray-400 text-sm uppercase tracking-wide mb-2">Local do Evento</p>
          <h3 className="text-2xl font-bold text-white mb-2">Parque da Cidade</h3>
          <p className="text-gray-300 mb-4">Plano Piloto, Brasília - DF</p>
          <p className="text-orange-400 font-semibold">Sábado • 7h da manhã</p>
        </div>
      </div>
    </main>
  )
}
