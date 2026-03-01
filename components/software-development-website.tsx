"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { ArrowRight, ChevronRight, Menu, X, Code, Zap, Settings2, Sparkles, Users, Clock, MapPin, Heart, Lightbulb } from "lucide-react"
import { motion, type Variants } from "framer-motion"
import { GridMotion } from "./ui/grid-motion"
import RotatingText from "./ui/RotatingText"

function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(" ")
}

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
)
CardHeader.displayName = "CardHeader"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
)
CardContent.displayName = "CardContent"

const defaultContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const defaultItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

function AnimatedGroup({
  children,
  className,
  variants,
}: {
  children: React.ReactNode
  className?: string
  variants?: {
    container?: Variants
    item?: Variants
  }
}) {
  const containerVariants = variants?.container || defaultContainerVariants
  const itemVariants = variants?.item || defaultItemVariants

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className={cn(className)}>
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
}

const menuItems = [
  { name: "Home", href: "#home" },
  { name: "Assessoria", href: "https://membros.sommaclub.com.br/", external: true },
  { name: "Loja", href: "https://loja.sommaclub.com.br/", external: true },
  { name: "Check-in", href: "/check-in" },
]

const HeroHeader = () => {
  const [menuState, setMenuState] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    if (typeof window === "undefined") return

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header>
      <nav data-state={menuState && "active"} className="fixed z-20 w-full px-2 group">
        <div
          className={cn(
            "mx-auto mt-1 max-w-4xl px-4 transition-all duration-300 lg:px-8",
            isScrolled && "bg-background/50 max-w-3xl rounded-2xl border backdrop-blur-lg lg:px-4",
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-0">
            <div className="flex w-full justify-between lg:w-auto">
              <a href="/" aria-label="home" className="flex items-center space-x-2">
                <Logo />
              </a>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState == true ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="in-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>
            </div>

            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <a
                      href={item.href}
                      className="text-muted-foreground hover:text-accent-foreground block duration-150"
                      {...(item.external && { target: "_blank", rel: "noopener noreferrer" })}
                    >
                      <span>{item.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <a
                        href={item.href}
                        className="text-muted-foreground hover:text-accent-foreground block duration-150"
                        {...(item.external && { target: "_blank", rel: "noopener noreferrer" })}
                      >
                        <span>{item.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <a href="https://admin.sommaclub.com.br/login" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className={cn(isScrolled && "lg:hidden")}>
                    <span>Login</span>
                  </Button>
                </a>
                <a href="#inscricao">
                  <Button
                    size="lg"
                    className={cn(
                      isScrolled
                        ? "lg:inline-flex bg-orange-500 hover:bg-orange-600"
                        : "hidden bg-orange-500 hover:bg-orange-600",
                    )}
                  >
                    <span>Inscreva-se</span>
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <img 
        src="https://cdn.shopify.com/s/files/1/0788/1932/8253/files/HORIZONTAL_PRETA_LARANJA.png?v=1772322941" 
        alt="SOMMA Logo"
        className="h-10 w-auto"
      />
    </div>
  )
}

const CardDecorator = ({ children }: { children: React.ReactNode }) => (
  <div
    aria-hidden
    className="relative mx-auto size-36 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"
  >
    <div className="absolute inset-0 [--border:black] dark:[--border:white] bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:24px_24px] opacity-10" />
    <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-t border-l border-orange-200">
      {children}
    </div>
  </div>
)

export default function SoftwareDevelopmentWebsite() {
  const gridItems = [
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vackground-com-agUC-v_D1iI-unsplash.jpg-pDc7YFeKWRKuQUIfTDRQbL5KvVGdKz.jpeg", // Abstract fluid gradient
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/barbara-zandoval-w0lI3AkD14A-unsplash.jpg-Adgy1wX78497i2gyUSxXOAbCRTxUkH.jpeg", // VR/AR experience
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/nahrizul-kadri-OAsF0QMRWlA-unsplash.jpg-JZ7f9oQ0QnvD5ALJRKIT4Os48cf17H.jpeg", // AI text on whiteboard
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cash-macanaya-X9Cemmq4YjM-unsplash.jpg-zNFoJl9wNLXUsmAczT3zaIHP8aBuYQ.jpeg", // Human-AI interaction
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/luke-jones-ac6UGoeSUSE-unsplash.jpg-XN84qqtkVV8r7mv7yJwpycndMf6WSH.jpeg", // Digital eye/AI vision
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/zhenyu-luo-kE0JmtbvXxM-unsplash.jpg-3aQSKrDe9SqRO3cQwItdSjDrVgbagu.jpeg", // Industrial robot
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vackground-com-7iq4VEHLNGU-unsplash.jpg-t2Cwv7CGFggABt2Ov9p00RIU0CFP5t.jpeg", // Abstract purple flow patterns
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/google-deepmind-tikhtH3QRSQ-unsplash.jpg-d1XmnWdOT6Fg6keJxmQO7TP1a0JUhg.jpeg", // Futuristic data beam
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/immo-wegmann-vi1HXPw6hyw-unsplash.jpg-FkdIitTUJu66Fm7AcnectgJ8STyAE0.jpeg", // AI keyboard concept
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/luke-jones-tBvF46kmwBw-unsplash.jpg-LfdDPksYC4VWZSEXLClGA82y8MtB28.jpeg", // Fiber optic network
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vackground-com-agUC-v_D1iI-unsplash.jpg-pDc7YFeKWRKuQUIfTDRQbL5KvVGdKz.jpeg", // Abstract fluid gradient (repeat)
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/barbara-zandoval-w0lI3AkD14A-unsplash.jpg-Adgy1wX78497i2gyUSxXOAbCRTxUkH.jpeg", // VR/AR experience (repeat)
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/nahrizul-kadri-OAsF0QMRWlA-unsplash.jpg-JZ7f9oQ0QnvD5ALJRKIT4Os48cf17H.jpeg", // AI text on whiteboard (repeat)
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cash-macanaya-X9Cemmq4YjM-unsplash.jpg-zNFoJl9wNLXUsmAczT3zaIHP8aBuYQ.jpeg", // Human-AI interaction (repeat)
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/luke-jones-ac6UGoeSUSE-unsplash.jpg-XN84qqtkVV8r7mv7yJwpycndMf6WSH.jpeg", // Digital eye/AI vision (repeat)
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/zhenyu-luo-kE0JmtbvXxM-unsplash.jpg-3aQSKrDe9SqRO3cQwItdSjDrVgbagu.jpeg", // Industrial robot (repeat)
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vackground-com-7iq4VEHLNGU-unsplash.jpg-t2Cwv7CGFggABt2Ov9p00RIU0CFP5t.jpeg", // Abstract purple flow patterns (repeat)
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/google-deepmind-tikhtH3QRSQ-unsplash.jpg-d1XmnWdOT6Fg6keJxmQO7TP1a0JUhg.jpeg", // Futuristic data beam (repeat)
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/immo-wegmann-vi1HXPw6hyw-unsplash.jpg-FkdIitTUJu66Fm7AcnectgJ8STyAE0.jpeg", // AI keyboard concept (repeat)
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/luke-jones-tBvF46kmwBw-unsplash.jpg-LfdDPksYC4VWZSEXLClGA82y8MtB28.jpeg", // Fiber optic network (repeat)
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vackground-com-agUC-v_D1iI-unsplash.jpg-pDc7YFeKWRKuQUIfTDRQbL5KvVGdKz.jpeg", // Abstract fluid gradient (repeat)
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/barbara-zandoval-w0lI3AkD14A-unsplash.jpg-Adgy1wX78497i2gyUSxXOAbCRTxUkH.jpeg", // VR/AR experience (repeat)
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/nahrizul-kadri-OAsF0QMRWlA-unsplash.jpg-JZ7f9oQ0QnvD5ALJRKIT4Os48cf17H.jpeg", // AI text on whiteboard (repeat)
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cash-macanaya-X9Cemmq4YjM-unsplash.jpg-zNFoJl9wNLXUsmAczT3zaIHP8aBuYQ.jpeg", // Human-AI interaction (repeat)
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/luke-jones-ac6UGoeSUSE-unsplash.jpg-XN84qqtkVV8r7mv7yJwpycndMf6WSH.jpeg", // Digital eye/AI vision (repeat)
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/zhenyu-luo-kE0JmtbvXxM-unsplash.jpg-3aQSKrDe9SqRO3cQwItdSjDrVgbagu.jpeg", // Industrial robot (repeat)
  ]

  return (
    <>
      <HeroHeader />
      <main className="overflow-hidden">
        <div
          aria-hidden
          className="z-[2] absolute inset-0 pointer-events-none isolate opacity-50 contain-strict hidden lg:block"
        >
          <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(25,100%,50%,.08)_0,hsla(25,100%,45%,.02)_50%,hsla(25,100%,40%,0)_80%)]" />
          <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(25,100%,50%,.06)_0,hsla(25,100%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
        </div>

        <section>
          <div className="relative pt-24 md:pt-36">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]"
            />
            <div 
              className="mx-auto max-w-7xl px-6 flex items-center justify-center min-h-screen relative"
              style={{
                backgroundImage: "url(https://cdn.shopify.com/s/files/1/0788/1932/8253/files/IMG_0888_JPG.jpg?v=1772326001)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed"
              }}
            >
              {/* Overlay escuro para melhor legibilidade */}
              <div className="absolute inset-0 bg-black/50 -z-10"></div>
              <div className="text-center relative z-10">
                <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-[5.25rem] leading-tight text-center">
                  <RotatingText
                    texts={["Somma Club", "Comunidade", "Energia", "Corrida"]}
                    mainClassName="text-white font-semibold overflow-hidden rounded-lg px-2 sm:px-3 md:px-4 justify-center inline-flex"
                    staggerFrom="last"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-120%" }}
                    staggerDuration={0.025}
                    splitLevelClassName="overflow-hidden pb-1"
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                    rotationInterval={2000}
                  />
                </h1>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-muted/50 py-16 md:py-32 dark:bg-transparent">
          <div className="@container mx-auto max-w-5xl px-6">
            {/* Header Section */}
            <div className="text-center mb-16">
              <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
                Comunidade <span className="text-orange-500">SOMMA</span>
              </h2>
              <p className="mt-6 text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                O SOMMA é <span className="font-semibold text-foreground">muito mais que um clube de corrida</span>. Somos uma comunidade que acredita no poder da união, constância e inclusão. Abertos a todos que desejam correr, melhorar sua saúde ou simplesmente compartilhar momentos significativos.
              </p>
            </div>

            {/* Info Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
              <Card className="border-orange-200 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-500/10 p-3 rounded-lg">
                      <Users className="size-6 text-orange-500" aria-hidden />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">100%</h3>
                      <p className="text-sm text-muted-foreground">Democrático</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Todos têm voz e vez em nossas decisões</p>
                </CardContent>
              </Card>

              <Card className="border-orange-200 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-500/10 p-3 rounded-lg">
                      <Clock className="size-6 text-orange-500" aria-hidden />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">7h</h3>
                      <p className="text-sm text-muted-foreground">Todo Sábado</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Encontros matinais para começar bem o fim de semana</p>
                </CardContent>
              </Card>

              <Card className="border-orange-200 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-500/10 p-3 rounded-lg">
                      <MapPin className="size-6 text-orange-500" aria-hidden />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">BSB</h3>
                      <p className="text-sm text-muted-foreground">Brasília</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground"><a href="https://maps.app.goo.gl/19XSfZUuooHXdpTs7" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">Parque da Cidade, Estacionamento 10</a></p>
                </CardContent>
              </Card>
            </div>

            {/* Why Join Section */}
            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-orange-200 p-8 md:p-12">
              <h3 className="text-2xl font-semibold mb-8 text-center">Por que fazer parte do SOMMA?</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-orange-500/10">
                      <Heart className="h-6 w-6 text-orange-500" aria-hidden />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Saúde em Primeiro Lugar</h4>
                    <p className="text-sm text-muted-foreground">Melhore sua forma física e bem-estar físico e mental</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-orange-500/10">
                      <Users className="h-6 w-6 text-orange-500" aria-hidden />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Comunidade Acolhedora</h4>
                    <p className="text-sm text-muted-foreground">Faça amizades duradouras com pessoas apaixonadas por corrida</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-orange-500/10">
                      <Zap className="h-6 w-6 text-orange-500" aria-hidden />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Motivação Constante</h4>
                    <p className="text-sm text-muted-foreground">Treinar em grupo aumenta o compromisso e diversão</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-orange-500/10">
                      <Lightbulb className="h-6 w-6 text-orange-500" aria-hidden />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Sem Compromisso</h4>
                    <p className="text-sm text-muted-foreground">Venha quando quiser, na sua velocidade, sem pressão</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center mt-12">
              <p className="text-muted-foreground mb-6">Pronto para se juntar à comunidade SOMMA?</p>
              <a href="#inscricao">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8">
                  Inscreva-se grátis
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Seção 3 - Energia da Comunidade */}
        <section className="py-16 md:py-32 bg-background">
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center mb-12">
              <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
                <span className="text-orange-500">SOMMA</span> em ação
              </h2>
              <p className="mt-4 text-lg text-orange-500 font-medium">
                Energia e Motivação
              </p>
            </div>

            {/* Grid de imagens de placeholder */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="rounded-lg overflow-hidden bg-muted h-64 md:h-80 flex items-center justify-center">
                <img src="https://cdn.shopify.com/s/files/1/0788/1932/8253/files/PDCSK21FEV-1794.jpg?v=1772326323" alt="SOMMA Running" className="w-full h-full object-cover" />
              </div>
              <div className="rounded-lg overflow-hidden bg-muted h-64 md:h-80 flex items-center justify-center">
                <img src="https://cdn.shopify.com/s/files/1/0788/1932/8253/files/PDCSK217JAN-2433.jpg?v=1772326445" alt="SOMMA Community" className="w-full h-full object-cover" />
              </div>
              <div className="rounded-lg overflow-hidden bg-muted h-64 md:h-80 flex items-center justify-center">
                <img src="https://cdn.shopify.com/s/files/1/0788/1932/8253/files/SMSPD-372.jpg?v=1772324753" alt="SOMMA Events" className="w-full h-full object-cover" />
              </div>
              <div className="rounded-lg overflow-hidden bg-muted h-64 md:h-80 flex items-center justify-center">
                <img src="https://cdn.shopify.com/s/files/1/0788/1932/8253/files/Designsemnome_16.png?v=1771901186" alt="SOMMA Moments" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Mensagem de Apoio */}
            <div className="text-center bg-orange-500/10 rounded-lg border border-orange-200 p-8">
              <p className="text-lg text-foreground leading-relaxed">
                <span className="font-semibold">Mais do que correr,</span> é sobre compartilhar energia, celebrar conquistas e viver a corrida de forma coletiva.
              </p>
            </div>
          </div>
        </section>

        {/* Seção 4 - Nossa Comunidade */}
        <section className="py-16 md:py-32 bg-muted/50">
          <div className="mx-auto max-w-5xl px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="mb-6">
                  <svg width="60" height="60" viewBox="0 0 484 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4">
                    <path fillRule="evenodd" clipRule="evenodd" d="M258.505 90.4524L258.502 90.4484H284.108L299.838 58.8214L315.567 90.4484H346.682L299.835 -0.000610352L255.366 85.8686L238.292 60.9384C248.834 55.8544 255.405 47.0494 255.405 34.4014V34.1524C255.405 25.2254 252.678 18.7764 247.469 13.5674C241.392 7.49139 231.596 3.64739 216.22 3.64739H173.809V90.4524H202.827V65.6504H209.027L225.396 90.4524H258.505ZM437.447 -0.000610352L390.606 90.4484H421.721L437.45 58.8214L453.18 90.4484H484.294L437.447 -0.000610352ZM368.669 94.0074L415.51 3.55839H384.396L368.666 35.1854L352.936 3.55839H321.822L368.669 94.0074ZM215.352 44.9414C222.295 44.9414 226.512 41.8414 226.512 36.5094V36.2604C226.512 30.6804 222.171 27.9524 215.476 27.9524H202.827V44.9414H215.352ZM111.753 28.2004H86.2089V3.64739H166.316V28.2004H140.772V90.4524H111.753V28.2004ZM15.5019 58.9544L-9.15527e-05 77.4314C11.0369 87.1054 26.9099 92.0644 44.5179 92.0644C67.8319 92.0644 82.8369 80.9034 82.8369 62.6734V62.4264C82.8369 44.9414 67.9559 38.4924 41.2939 34.4014C36.5819 32.6634 34.2259 31.1774 34.2259 28.8204V28.5724C34.2259 26.4644 36.2109 24.9764 40.5499 24.9764C48.6099 24.9764 58.4079 27.5804 66.5909 33.5324L80.7289 13.9404C70.6839 6.00339 58.2839 2.03439 41.5429 2.03439C17.6079 2.03439 4.71191 14.8084 4.71191 31.3004V31.5494C4.71191 49.9014 21.8259 55.4834 41.2939 59.4494C50.5949 61.3104 53.3219 62.6734 53.3219 65.1544V65.4034C53.3219 67.7584 51.0909 69.1214 45.8819 69.1214C35.7139 69.1214 24.9259 66.1474 15.5019 58.9544Z" fill="#fc5200" />
                  </svg>
                </div>
                <h2 className="text-balance text-4xl font-semibold lg:text-5xl mb-6">
                  SOMMA Running Club
                </h2>
                <p className="text-xl font-semibold text-orange-500 mb-4">
                  Se é pra correr, que seja com vibe boa.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  O SOMMA Running Club nasceu para somar passos, histórias e amizades. Nossa comunidade no Strava conecta corredores de todos os níveis em Brasília, com encontros semanais cheios de energia e motivação.
                </p>
                <a href="https://www.strava.com/clubs/1608501?share_sig=D8C84ECD1759146345&_branch_match_id=1315308772546708809&_branch_referrer=H4sIAAAAAAAAA8soKSkottLXLy4pSixL1EcsKNDLyczL1jcxdsmPCgmrNA5Psq8rSk1LLSrKzEuPTyrKLy9OLbJ1zijKz00FAFnkwLM9AAAA" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="text-white gap-2" style={{ backgroundColor: "#fb4c00" }}>
                    <svg className="w-6 h-6" aria-hidden="true" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <polygon points="226.172,26.001 90.149,288.345 170.29,288.345 226.172,184.036 281.605,288.345 361.116,288.345" fill="currentColor"></polygon>
                      <polygon points="361.116,288.345 321.675,367.586 281.605,288.345 220.871,288.345 321.675,485.999 421.851,288.345" fill="currentColor"></polygon>
                    </svg>
                    Junte-se no Strava
                  </Button>
                </a>
              </div>
              <div className="rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                <img src="https://cdn.shopify.com/s/files/1/0788/1932/8253/files/IMG_1479_JPG.jpg?v=1772326757" alt="Strava Community" className="w-full h-auto object-contain" />
              </div>
            </div>
          </div>
        </section>

        {/* Seção 5 - Nossos Pelotões */}
        <section className="py-16 md:py-32 bg-background">
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-balance text-4xl font-semibold lg:text-5xl mb-4">
                Escolha seu ritmo
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Independente do seu nível, sempre existe um pelotão para você correr com conforto e evolução.
              </p>
            </div>

            {/* Cards de Pelotões */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              <Card className="border-orange-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <h3 className="text-2xl font-semibold text-orange-500">4km</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Caminhada + corrida</p>
                </CardContent>
              </Card>

              <Card className="border-orange-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <h3 className="text-2xl font-semibold text-orange-500">4km</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Ritmo confortável</p>
                </CardContent>
              </Card>

              <Card className="border-orange-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <h3 className="text-2xl font-semibold text-orange-500">6km</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Ritmo moderado</p>
                </CardContent>
              </Card>

              <Card className="border-orange-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <h3 className="text-2xl font-semibold text-orange-500">8km</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Ritmo avançado</p>
                </CardContent>
              </Card>
            </div>

            {/* Informação Adicional */}
            <div className="text-center bg-orange-500/10 rounded-lg border border-orange-200 p-6">
              <p className="text-sm text-muted-foreground">
                Pace médio entre <span className="font-semibold text-foreground">6'00 e 6'30</span>
              </p>
            </div>
          </div>
        </section>

        {/* Seção 6 - Regras da Comunidade */}
        <section className="py-16 md:py-32 bg-muted/50">
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center mb-12">
              <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
                O que é obrigatório?
              </h2>
            </div>

            {/* Regras */}
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="flex gap-4 p-6 bg-white dark:bg-zinc-900 rounded-lg border border-orange-200">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-orange-500/10">
                    <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Respeito e energia positiva</h3>
                  <p className="text-sm text-muted-foreground">
                    O pilar fundamental da nossa comunidade é a energia positiva e o respeito mútuo entre todos os corredores.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-6 bg-white dark:bg-zinc-900 rounded-lg border border-orange-200">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-orange-500/10">
                    <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Uniforme bem-vindo, não obrigatório</h3>
                  <p className="text-sm text-muted-foreground">
                    N��o é obrigatório uniforme, mas camiseta ou boné SOMMA são bem-vindos para fortalecer a identidade do grupo.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-6 bg-white dark:bg-zinc-900 rounded-lg border border-orange-200">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-orange-500/10">
                    <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Motivação é gratuita</h3>
                  <p className="text-sm text-muted-foreground">
                    A comunidade é aberta a todos e a motivação é gratuita. Todos são bem-vindos, independente do seu nível.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Seção 7 - Conheça o Somma Club */}
        <section className="py-16 md:py-32 bg-muted/50">
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-balance text-4xl font-semibold lg:text-5xl mb-4">
                Conheça o <span className="text-orange-500">Somma Club</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                O maior clube de corrida democrático do Distrito Federal
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {/* Card 1 - Membros */}
              <div className="bg-white dark:bg-zinc-900 rounded-lg border border-orange-200 p-8 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-3">
                  4.300+
                </div>
                <h3 className="text-xl font-semibold mb-2">Membros Ativos</h3>
                <p className="text-sm text-muted-foreground">
                  Corredores apaixonados formando a maior comunidade de corrida do DF
                </p>
              </div>

              {/* Card 2 - Gratuito */}
              <div className="bg-white dark:bg-zinc-900 rounded-lg border border-orange-200 p-8 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-3">
                  100%
                </div>
                <h3 className="text-xl font-semibold mb-2">Gratuito</h3>
                <p className="text-sm text-muted-foreground">
                  Todos os encontros e eventos são completamente abertos e gratuitos
                </p>
              </div>

              {/* Card 3 - Democrático */}
              <div className="bg-white dark:bg-zinc-900 rounded-lg border border-orange-200 p-8 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-3">
                  100%
                </div>
                <h3 className="text-xl font-semibold mb-2">Democrático</h3>
                <p className="text-sm text-muted-foreground">
                  Decisões tomadas coletivamente pela comunidade, todos têm voz
                </p>
              </div>
            </div>

            {/* Descrição */}
            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-orange-200 p-8 md:p-12 mb-12">
              <h3 className="text-2xl font-semibold mb-6">O que é o Somma Club?</h3>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  O Somma Running Club é mais do que um grupo de corrida. Somos um movimento que mistura esporte, comunidade, estilo de vida e pertencimento. Fundado em Brasília, o Somma conecta corredores de todos os níveis em torno de um objetivo comum: transformar a corrida em uma experiência coletiva.
                </p>
                <p>
                  Nossa estrutura funciona em dois níveis: o <span className="font-semibold text-foreground">Running Club</span>, que representa a comunidade ampla com encontros, treinos coletivos e eventos; e a <span className="font-semibold text-foreground">Assessoria Somma</span>, que oferece acompanhamento técnico para quem deseja evoluir profissionalmente.
                </p>
                <p>
                  Nos encontros do Somma, você encontra mais do que corrida. Encontra amizades, networking, experiências de bem-estar, conteúdo educacional e uma comunidade que acredita que a corrida é um catalisador para conexões reais e transformação pessoal.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <a href="#inscricao">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8">
                  Faça Parte do Somma
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Seção 8 - Check-in */}
        <section className="py-16 md:py-32 bg-background">
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center mb-12">
              <h2 className="text-balance text-4xl font-semibold lg:text-5xl mb-4">
                Como funciona o <span className="text-orange-500">Check-in</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Garantia de acesso a ativações, sorteios e café da manhã
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
              {/* Step 1 */}
              <div className="bg-white dark:bg-zinc-900 rounded-lg border border-orange-200 p-6 text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-orange-500/10 text-orange-500 text-xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="font-semibold mb-2">Inscreva-se</h3>
                <p className="text-sm text-muted-foreground">
                  Preencha o formulário de cadastro na comunidade
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white dark:bg-zinc-900 rounded-lg border border-orange-200 p-6 text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-orange-500/10 text-orange-500 text-xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="font-semibold mb-2">Salvar QR Code</h3>
                <p className="text-sm text-muted-foreground">
                  Guarde o QR code que será enviado para seu e-mail
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white dark:bg-zinc-900 rounded-lg border border-orange-200 p-6 text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-orange-500/10 text-orange-500 text-xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="font-semibold mb-2">Retirar Pulseira</h3>
                <p className="text-sm text-muted-foreground">
                  No dia do evento, retire sua pulseira no local
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-white dark:bg-zinc-900 rounded-lg border border-orange-200 p-6 text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-orange-500/10 text-orange-500 text-xl font-bold mx-auto mb-4">
                  4
                </div>
                <h3 className="font-semibold mb-2">Aproveite!</h3>
                <p className="text-sm text-muted-foreground">
                  Acesso a ativações, sorteios e café da manhã
                </p>
              </div>
            </div>

            {/* Benefícios */}
            <div className="bg-orange-500/10 rounded-lg border border-orange-200 p-8 md:p-12 mb-12">
              <h3 className="text-2xl font-semibold mb-6 text-center">Com o Check-in você tem acesso a:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 text-orange-500 text-2xl">✓</div>
                  <div>
                    <h4 className="font-semibold mb-1">Café da Manhã</h4>
                    <p className="text-sm text-muted-foreground">Refeição completa para recarregar energias</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 text-orange-500 text-2xl">✓</div>
                  <div>
                    <h4 className="font-semibold mb-1">Ativações</h4>
                    <p className="text-sm text-muted-foreground">Experiências exclusivas e interativas</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 text-orange-500 text-2xl">✓</div>
                  <div>
                    <h4 className="font-semibold mb-1">Sorteios</h4>
                    <p className="text-sm text-muted-foreground">Prêmios e brindes para participantes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <a href="/check-in">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8">
                  Saiba Mais Sobre Check-in
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Seção 9 - Formulário de Cadastro */}
        <section className="py-16 md:py-32 bg-muted/50" id="inscricao">
          <div className="mx-auto max-w-3xl px-6">
            <div className="text-center mb-12">
              <h2 className="text-balance text-4xl font-semibold lg:text-5xl mb-4">
                Junte-se ao clube
              </h2>
              <p className="text-lg text-muted-foreground">
                Preencha suas informações para fazer parte da nossa comunidade
              </p>
            </div>

            <form className="space-y-8 bg-white dark:bg-zinc-900 rounded-lg border border-orange-200 p-8 md:p-12">
              {/* Informações Pessoais */}
              <div>
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-orange-500/10 text-orange-500 font-semibold">1</span>
                  Informações Pessoais
                </h3>

                <div className="space-y-4">
                  {/* Nome completo */}
                  <div>
                    <label htmlFor="nome" className="block text-sm font-medium mb-2">
                      Nome completo <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="nome"
                      type="text"
                      placeholder="Seu nome completo"
                      className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  {/* E-mail */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      E-mail <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  {/* CPF */}
                  <div>
                    <label htmlFor="cpf" className="block text-sm font-medium mb-2">
                      CPF <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="cpf"
                      type="text"
                      placeholder="000.000.000-00"
                      className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  {/* Grid para Data de nascimento e CEP */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Data de nascimento */}
                    <div>
                      <label htmlFor="data" className="block text-sm font-medium mb-2">
                        Data de nascimento <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="data"
                        type="date"
                        className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>

                    {/* CEP */}
                    <div>
                      <label htmlFor="cep" className="block text-sm font-medium mb-2">
                        CEP <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="cep"
                        type="text"
                        placeholder="00000-000"
                        className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div>
                    <label htmlFor="whatsapp" className="block text-sm font-medium mb-2">
                      WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="whatsapp"
                      type="tel"
                      placeholder="(61) 99999-9999"
                      className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Divisor */}
              <div className="border-t border-zinc-200 dark:border-zinc-700"></div>

              {/* Termos e Condições */}
              <div>
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-orange-500/10 text-orange-500 font-semibold">2</span>
                  Termos e Condições
                </h3>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 h-5 w-5 rounded border-zinc-300 text-orange-500 focus:ring-orange-500 focus:ring-offset-0"
                    required
                  />
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    Aceito os termos da LGPD, autorizo o tratamento dos meus dados pessoais e o uso da minha imagem em atividades do clube. <span className="text-red-500">*</span>
                  </span>
                </label>
              </div>

              {/* Botão de Submit */}
              <Button size="lg" className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 text-base font-semibold">
                Inscrever-se agora
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Seus dados serão tratados conforme nossa política de privacidade.
              </p>
            </form>
          </div>
        </section>
      </main>

      <footer className="bg-background border-t border-orange-200">
        <div className="mx-auto max-w-7xl py-16 px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Company Info */}
            <div className="space-y-4 sm:col-span-2 lg:col-span-1">
              <Logo />
              <p className="text-sm text-muted-foreground max-w-xs">
                Transform your business with custom software solutions. We build scalable applications that grow with
                your success.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-orange-500 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-orange-500 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-orange-500 transition-colors">
                  <svg className="h-5 w-5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </a>
              </div>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Services</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-orange-500 transition-colors">
                    Web Development
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-orange-500 transition-colors">
                    Mobile Apps
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-orange-500 transition-colors">
                    Custom Software
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-orange-500 transition-colors">
                    API Development
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-orange-500 transition-colors">
                    Cloud Solutions
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-orange-500 transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-orange-500 transition-colors">
                    Our Team
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-orange-500 transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-orange-500 transition-colors">
                    Case Studies
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-orange-500 transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Contact</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center space-x-2">
                  <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="break-all">hello@devsolutions.com</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-start space-x-2">
                  <svg className="h-4 w-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>
                    123 Tech Street
                    <br />
                    San Francisco, CA 94105
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom section */}
          <div className="mt-12 pt-8 border-t border-orange-200">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="text-sm text-muted-foreground">© 2024 DevSolutions. All rights reserved.</div>
              <div className="flex flex-wrap justify-center sm:justify-end gap-x-6 gap-y-2 text-sm">
                <a href="#" className="text-muted-foreground hover:text-orange-500 transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-muted-foreground hover:text-orange-500 transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="text-muted-foreground hover:text-orange-500 transition-colors">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
