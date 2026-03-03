"use client"

import * as React from "react"
import { ArrowRight, ChevronRight, Menu, X, Code, Zap, Settings2, Sparkles, Users, Clock, MapPin, Heart, Lightbulb } from "lucide-react"
import { motion, type Variants } from "framer-motion"
import { GridMotion } from "./ui/grid-motion"
import RotatingText from "./ui/RotatingText"
import { Button } from "./ui/button"
import { JoinClubForm } from "./join-club-form"

function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(" ")
}

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm", className)} {...props} />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h2 ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
))
CardTitle.displayName = "CardTitle"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

interface NavLink {
  name: string
  href: string
  external?: boolean
}

const menuItems: NavLink[] = [
  { name: "Home", href: "#home" },
  { name: "Assessoria", href: "https://membros.sommaclub.com.br/", external: true },
  { name: "Loja", href: "https://loja.sommaclub.com.br/", external: true },
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
}

function Logo() {
  return (
    <div className="flex items-center justify-center">
      <div className="text-3xl font-bold">
        <span className="text-orange-500">SOMMA</span>
      </div>
    </div>
  )
}

export default function SoftwareDevelopmentWebsite() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Logo />

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="text-sm font-medium text-foreground hover:text-orange-500 transition-colors"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-zinc-200 dark:border-zinc-700 py-4 px-6 flex flex-col gap-4">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="text-sm font-medium text-foreground hover:text-orange-500 transition-colors"
              >
                {item.name}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-orange-500/10 to-background">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="text-center space-y-6">
            <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl lg:text-7xl font-bold text-balance">
              Bem-vindo à{" "}
              <span className="text-orange-500">
                <RotatingText words={["SOMMA", "Comunidade", "Família"]} />
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A maior comunidade de corrida de Brasília. Junte-se a mais de 4.300 membros ativos e compartilhe essa paixão.
            </motion.p>

            <motion.div variants={itemVariants} className="flex gap-4 justify-center pt-4">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white gap-2">
                Comece Agora <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline">
                Saiba Mais
              </Button>
            </motion.div>
          </motion.div>

          {/* Grid Animation */}
          <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.6 }} className="mt-20">
            <GridMotion />
          </motion.div>
        </div>
      </section>

      {/* Sobre a comunidade */}
      <section className="py-16 md:py-32 bg-muted/50">
        <div className="mx-auto max-w-5xl px-6">
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-12">
            <motion.div variants={itemVariants} className="text-center">
              <h2 className="text-balance text-4xl font-semibold lg:text-5xl mb-4">
                Conheça a <span className="text-orange-500">SOMMA Running Club</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Fundada em 2021, a SOMMA é a maior comunidade de corredores de Brasília, com encontros semanais e eventos exclusivos.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Users className="w-8 h-8 text-orange-500" />,
                  title: "4.300+ Membros",
                  description: "Comunidade ativa e engajada de corredores de todos os níveis",
                },
                {
                  icon: <MapPin className="w-8 h-8 text-orange-500" />,
                  title: "Parque da Cidade",
                  description: "Encontros todos os sábados às 7h - Brasília, DF",
                },
                {
                  icon: <Heart className="w-8 h-8 text-orange-500" />,
                  title: "Comunidade Acolhedora",
                  description: "Apoio, motivação e amizade em cada quilômetro",
                },
              ].map((item, index) => (
                <motion.div key={index} variants={itemVariants} className="bg-white dark:bg-zinc-900 rounded-lg border border-orange-200 p-6 text-center">
                  <div className="flex justify-center mb-4">{item.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="py-16 md:py-32 bg-background">
        <div className="mx-auto max-w-5xl px-6">
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-12">
            <motion.h2 variants={itemVariants} className="text-balance text-4xl font-semibold lg:text-5xl text-center">
              Por que fazer parte da <span className="text-orange-500">SOMMA</span>?
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  icon: <Sparkles className="w-6 h-6 text-orange-500" />,
                  title: "Eventos Especiais",
                  description: "Corridas, competições e confraternizações ao longo do ano",
                },
                {
                  icon: <Users className="w-6 h-6 text-orange-500" />,
                  title: "Assessoria Profissional",
                  description: "Acesso a treinadores especializados e programas de treino",
                },
                {
                  icon: <Heart className="w-6 h-6 text-orange-500" />,
                  title: "Suporte da Comunidade",
                  description: "Motivação e amizade de corredores apaixonados",
                },
                {
                  icon: <Lightbulb className="w-6 h-6 text-orange-500" />,
                  title: "Benefícios Exclusivos",
                  description: "Descontos em lojas parceiras e equipamentos esportivos",
                },
              ].map((item, index) => (
                <motion.div key={index} variants={itemVariants} className="flex gap-4">
                  <div className="flex-shrink-0 flex items-start pt-1">{item.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Junte-se ao clube - Seção de Formulário */}
      <section className="py-16 md:py-32 bg-muted/50" id="inscricao">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-balance text-4xl font-semibold lg:text-5xl mb-4">
              Junte-se ao <span className="text-orange-500">clube</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Preencha suas informações para fazer parte da nossa comunidade
            </p>
          </div>

          <JoinClubForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
            {/* Logo and Social */}
            <div className="space-y-4">
              <Logo />
              <p className="text-sm text-gray-400 max-w-xs">
                Junte-se ao SOMMA Running Club, a maior comunidade de corrida de Brasília. Encontros aos sábados às 7h no Parque da Cidade. Mais de 4.300 membros ativos!
              </p>
              <div className="flex space-x-4">
                <a 
                  href="https://www.instagram.com/somma.club/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center space-x-2 text-gray-400 hover:text-orange-500 transition-colors duration-200 group"
                  aria-label="Seguir SOMMA Running Club no Instagram"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="lucide lucide-instagram w-5 h-5 group-hover:scale-110 transition-transform duration-200"
                    aria-hidden="true"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                  </svg>
                </a>
                <a 
                  href="https://www.strava.com/clubs/1608501?share_sig=D8C84ECD1759146345&_branch_match_id=1315308772546708809&_branch_referrer=H4sIAAAAAAAAA8soKSkottLXLy4pSixL1EcsKNDLzczL1jcxdsmPCgmrNA5Psq8rSk1LLSrKzEuPTyrKLy9OLbJ1zijKz00FAFnkwLM9AAAA" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center space-x-2 text-gray-400 hover:text-orange-500 transition-colors duration-200 group"
                  aria-label="Seguir SOMMA Running Club no Strava"
                >
                  <svg 
                    className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" 
                    aria-hidden="true" 
                    viewBox="0 0 512 512" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polygon points="226.172,26.001 90.149,288.345 170.29,288.345 226.172,184.036 281.605,288.345 361.116,288.345" fill="currentColor"></polygon>
                    <polygon points="361.116,288.345 321.675,367.586 281.605,288.345 220.871,288.345 321.675,485.999 421.851,288.345" fill="currentColor"></polygon>
                  </svg>
                </a>
              </div>
            </div>

            {/* Contato */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white">Contato</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>
                  <a href="mailto:contato@sommaclub.com.br" className="hover:text-orange-500 transition-colors flex items-center gap-2">
                    <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    contato@sommaclub.com.br
                  </a>
                </li>
                <li>
                  <a href="tel:+5561953724777" className="hover:text-orange-500 transition-colors flex items-center gap-2">
                    <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    +55 (61) 9537-2477
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-4 w-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                  </svg>
                  <span>
                    Srps 53WV+RX
                    <br />
                    Plano Piloto, Brasília - DF
                    <br />
                    70655-775
                  </span>
                </li>
              </ul>
            </div>

            {/* Mais do Somma */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white">Mais do Somma</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                    Parcerias Somma
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                    Benefícios do Membro
                  </a>
                </li>
              </ul>
            </div>

            {/* Empresa */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white">Empresa</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                    Somma Eventos
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                    Somma Mídia
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                    Assessoria Esportiva
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom section */}
          <div className="mt-12 pt-8 border-t border-orange-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div className="space-y-2">
                <div className="text-sm text-gray-400">© 2026 Somma Running Club. All rights reserved.</div>
                <div className="text-xs text-gray-400">CNPJ 61.315.987/0001-28</div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
