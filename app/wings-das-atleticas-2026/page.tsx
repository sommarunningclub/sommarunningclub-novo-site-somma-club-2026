import WingsHero from '@/components/wings/WingsHero'
import WingsLocationSection from '@/components/wings/WingsLocationSection'
import WingsEventInfo from '@/components/wings/WingsEventInfo'
import WingsSchedule from '@/components/wings/WingsSchedule'
import WingsCompetition from '@/components/wings/WingsCompetition'
import WingsAddToCalendar from '@/components/wings/WingsAddToCalendar'
import WingsFollowSomma from '@/components/wings/WingsFollowSomma'
import WingsFloatingCTA from '@/components/wings/WingsFloatingCTA'
import WingsRegistrationForm from '@/components/wings/WingsRegistrationForm'

export const dynamic = 'force-dynamic'

const fontDisplay = { fontFamily: 'var(--font-bebas), sans-serif' }
const fontBody = { fontFamily: 'var(--font-dm-sans-wfl), sans-serif' }

export default function WingsPage() {
  return (
    <main className="bg-white text-wfl-dark min-h-screen" style={fontBody}>
      <WingsHero />
      <WingsLocationSection />
      <WingsEventInfo />
      <WingsSchedule />
      <WingsCompetition />
      <WingsAddToCalendar />

      <section
        id="wings-inscricao"
        className="bg-wfl-card py-12 sm:py-24 px-4 sm:px-8 scroll-mt-8"
      >
        <div className="max-w-2xl mx-auto">
          <p
            className="text-[10px] sm:text-sm font-semibold tracking-[0.3em] uppercase text-wfl-red text-center"
            style={fontBody}
          >
            Sua vaga
          </p>
          <h2
            className="mt-2 text-3xl sm:text-6xl text-wfl-red text-center uppercase leading-none"
            style={fontDisplay}
          >
            Inscreva sua equipe
          </h2>
          <p
            className="mt-2 sm:mt-3 text-center text-sm sm:text-base text-wfl-dark/70 max-w-md mx-auto"
            style={fontBody}
          >
            Cada inscrição vale ponto pra sua atlética. Bora reunir a galera.
          </p>

          <div className="mt-6 sm:mt-10 bg-white border border-wfl-border p-4 sm:p-10">
            <WingsRegistrationForm />
          </div>
        </div>
      </section>

      <WingsFollowSomma />

      <footer className="bg-wfl-navy text-white/70 py-8 sm:py-10 px-4 sm:px-8 pb-24 sm:pb-10" style={fontBody}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 text-[10px] sm:text-xs">
          <p className="tracking-[0.2em] uppercase">Somma × Wings for Life × Red Bull</p>
          <p>© 2026 Somma Running Club</p>
        </div>
      </footer>

      <WingsFloatingCTA />
    </main>
  )
}
