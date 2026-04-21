import HeroSection from '@/components/events/catcher-run/HeroSection'
import WFLExplainerSection from '@/components/events/catcher-run/WFLExplainerSection'
import CatcherCarSteps from '@/components/events/catcher-run/CatcherCarSteps'
import EventSimulationSection from '@/components/events/catcher-run/EventSimulationSection'
import ScheduleTimeline from '@/components/events/catcher-run/ScheduleTimeline'
import MapSection from '@/components/events/catcher-run/MapSection'
import HowToGetThere from '@/components/events/catcher-run/HowToGetThere'
import CatcherRunCheckin from '@/components/events/catcher-run/CatcherRunCheckin'

export default function CatcherRunPage() {
  return (
    <main
      className="bg-[#080808] min-h-screen"
      style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}
    >
      {/* SEÇÃO 1 — HERO */}
      <HeroSection />

      {/* SEÇÃO 2 — O QUE É O WFL */}
      <WFLExplainerSection />

      {/* SEÇÃO 3 — COMO FUNCIONA (CATCHER CAR) */}
      <CatcherCarSteps />

      {/* SEÇÃO 4 — A SIMULAÇÃO SOMMA × RED BULL */}
      <EventSimulationSection />

      {/* SEÇÃO 5 — PROGRAMAÇÃO */}
      <ScheduleTimeline />

      {/* SEÇÃO 6 — MAPA */}
      <MapSection />

      {/* SEÇÃO 6b — COMO CHEGAR */}
      <HowToGetThere />

      {/* SEÇÃO 7 — FORMULÁRIO DE INSCRIÇÃO */}
      <section
        id="inscricao"
        className="bg-[#0A0A0A] border-t border-zinc-900 py-20 sm:py-28 px-4 relative overflow-hidden"
      >
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(204,0,0,0.06) 0%, transparent 70%)',
          }}
        />

        <div className="relative max-w-xl mx-auto">
          <div className="text-center mb-10 sm:mb-12">
            <p
              className="text-[#CC0000] text-xs uppercase tracking-[0.3em] mb-3"
              style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}
            >
              Garanta sua vaga
            </p>
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase text-white leading-tight mb-3"
              style={{ fontFamily: 'var(--font-barlow-condensed, sans-serif)' }}
            >
              Você está pronto
              <br />
              <span className="italic text-[#F26522]">para o Catcher Car?</span>
            </h2>
            <p
              className="text-zinc-500 text-sm"
              style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}
            >
              Inscrição gratuita · Vagas limitadas · 26 de abril de 2026
            </p>
          </div>

          <div className="bg-[#111111] border border-zinc-800 p-6 sm:p-8">
            <CatcherRunCheckin />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#080808] border-t border-zinc-900 py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src="https://cdn.shopify.com/s/files/1/0788/1932/8253/files/HORIZONTAL_PRETA_LARANJA.png"
              alt="Somma Running Club"
              className="h-6 object-contain brightness-0 invert opacity-60"
            />
            <span className="text-zinc-700">×</span>
            <img
              src="https://cdn.shopify.com/s/files/1/0788/1932/8253/files/RED_BULL_ED_LATA_GLASS_BRANCO_ABERTA.png?v=1776108606"
              alt="Red Bull"
              className="h-10 object-contain opacity-70"
            />
          </div>
          <div className="text-center sm:text-right">
            <p
              className="text-zinc-600 text-xs"
              style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}
            >
              Catcher Run Brasília 2026 · 106 Sul · 26 de abril
            </p>
            <p
              className="text-zinc-700 text-xs mt-0.5"
              style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}
            >
              © Somma Running Club. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
