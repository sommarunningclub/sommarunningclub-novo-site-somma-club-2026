import { ShoppingBag } from 'lucide-react'

/** Banner de divulgação do novo boné Somma (mobile + desktop). */
export function BoneBanner({ className = '' }: { className?: string }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border border-orange-500/30 bg-gradient-to-r from-orange-500/15 to-orange-500/[0.04] p-3.5 sm:gap-4 sm:p-5 ${className}`}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500 shadow-lg shadow-orange-500/30 sm:h-12 sm:w-12">
        <ShoppingBag className="h-5 w-5 text-white sm:h-6 sm:w-6" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-orange-400 sm:text-[11px]">Novidade</p>
        <p className="text-sm font-semibold leading-snug text-white sm:text-base">O novo boné Somma já está disponível.</p>
        <p className="mt-0.5 text-xs leading-snug text-zinc-400 sm:text-sm">Garanta o seu e retire no dia do corre.</p>
      </div>
    </div>
  )
}
