'use client'

import { useEffect, useState } from 'react'

const EVENTO_ID = 'f139b049-52c8-4028-9ddb-90cfa72af378'

export default function EventClosedToggle() {
  const [encerrado, setEncerrado] = useState(false)
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    fetch(`/api/eventos/status?evento_id=${EVENTO_ID}&t=${Date.now()}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(d => setEncerrado(!!d.encerrado))
      .catch(() => setEncerrado(false))
      .finally(() => setCarregando(false))
  }, [])

  const handleToggle = async (novoStatus: boolean) => {
    setSalvando(true)
    try {
      const res = await fetch('/api/eventos/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ evento_id: EVENTO_ID, encerrado: novoStatus }),
      })

      if (res.ok) {
        const data = await res.json()
        setEncerrado(data.encerrado)
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    } finally {
      setSalvando(false)
    }
  }

  if (carregando) return <div className="h-20 bg-zinc-900 rounded animate-pulse" />

  return (
    <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold">Status do Evento</h3>
          <p className="text-zinc-500 text-sm mt-1">
            {encerrado ? 'Evento Encerrado' : 'Evento Ativo'}
          </p>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="toggle-onoff"
            checked={encerrado}
            onChange={(e) => handleToggle(e.target.checked)}
            disabled={salvando}
          />
          <span className="w-[180px] h-[78px]" />
        </label>
      </div>

      {salvando && (
        <p className="text-yellow-500 text-xs mt-3">Atualizando...</p>
      )}
    </div>
  )
}
