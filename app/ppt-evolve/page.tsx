"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowRight, ChevronDown, CheckCircle2, TrendingUp, Users, Zap, Target, Star, Shield } from "lucide-react";

const SOMMA_ORANGE = "#ff2c03";

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const Slide = ({ children, className = "", id }: { children: React.ReactNode, className?: string, id?: string }) => (
  <section 
    id={id}
    className={`min-h-screen w-full flex flex-col justify-center items-center relative overflow-hidden px-6 md:px-12 py-20 ${className}`}
  >
    {children}
  </section>
);

export default function PptEvolve() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-black text-white min-h-screen font-sans selection:bg-[#ff2c03] selection:text-white">
      
      {/* SLIDE 1: CAPA */}
      <Slide className="bg-black">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image 
            src="/marcos-vinicius-do-vale-yeEsrY5kzL8-unsplash.jpg" 
            alt="Somma Community" 
            fill 
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>
        
        <div className="z-10 flex flex-col items-center text-center max-w-5xl">
          <FadeIn>
            <div className="flex items-center justify-center gap-8 md:gap-16 mb-12">
              <Image src="/Logo_Nova_Somma_Branca_Laranja.svg" alt="Somma Club" width={200} height={60} className="h-12 md:h-20 w-auto" />
              <div className="text-3xl md:text-5xl font-light text-gray-500">+</div>
              <Image src="/logo-evolve.svg" alt="Evolve" width={200} height={60} className="h-12 md:h-20 w-auto brightness-0 invert" />
            </div>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <h1 className="text-4xl md:text-7xl font-bold tracking-tight leading-tight mb-6">
              Construindo a próxima geração de <br className="hidden md:block" />
              <span className="text-[#ff2c03]">comunidade fitness</span> do Distrito Federal.
            </h1>
          </FadeIn>
          
          <FadeIn delay={0.4} className="mt-16 animate-bounce">
            <ChevronDown className="w-10 h-10 text-gray-400" />
          </FadeIn>
        </div>
      </Slide>

      {/* SLIDE 2: PERTENCIMENTO */}
      <Slide className="bg-zinc-950">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-6xl font-bold leading-tight mb-12">
              AS PESSOAS NÃO BUSCAM MAIS ACADEMIAS. <br />
              <span className="text-[#ff2c03]">ELAS BUSCAM PERTENCIMENTO.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-xl md:text-3xl text-gray-400 font-light leading-relaxed">
              As maiores marcas do mundo deixaram de vender produtos.<br />
              Elas passaram a construir comunidades.
            </p>
          </FadeIn>
        </div>
      </Slide>

      {/* SLIDE 3: O NOVO CONSUMIDOR */}
      <Slide className="bg-black">
        <div className="max-w-6xl w-full mx-auto">
          <FadeIn>
            <h2 className="text-sm tracking-widest text-[#ff2c03] uppercase font-bold mb-16 text-center">O Novo Consumidor</h2>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
            <FadeIn delay={0.2} className="relative">
              <div className="absolute -inset-4 border border-zinc-800 rounded-3xl opacity-50"></div>
              <h3 className="text-3xl font-bold mb-8 text-gray-500">Antes</h3>
              <ul className="space-y-6 text-2xl text-gray-500 font-light">
                <li className="flex items-center gap-4"><div className="w-2 h-2 rounded-full bg-gray-700"></div>Academia</li>
                <li className="flex items-center gap-4"><div className="w-2 h-2 rounded-full bg-gray-700"></div>Treino</li>
                <li className="flex items-center gap-4"><div className="w-2 h-2 rounded-full bg-gray-700"></div>Equipamento</li>
              </ul>
            </FadeIn>
            
            <FadeIn delay={0.4} className="relative">
              <div className="absolute -inset-4 border border-[#ff2c03]/30 bg-[#ff2c03]/5 rounded-3xl"></div>
              <h3 className="text-3xl font-bold mb-8 text-white">Hoje</h3>
              <ul className="space-y-6 text-2xl text-white font-medium">
                <li className="flex items-center gap-4"><div className="w-3 h-3 rounded-full bg-[#ff2c03]"></div>Experiência</li>
                <li className="flex items-center gap-4"><div className="w-3 h-3 rounded-full bg-[#ff2c03]"></div>Comunidade</li>
                <li className="flex items-center gap-4"><div className="w-3 h-3 rounded-full bg-[#ff2c03]"></div>Relacionamento</li>
                <li className="flex items-center gap-4"><div className="w-3 h-3 rounded-full bg-[#ff2c03]"></div>Networking</li>
                <li className="flex items-center gap-4"><div className="w-3 h-3 rounded-full bg-[#ff2c03]"></div>Lifestyle</li>
                <li className="flex items-center gap-4"><div className="w-3 h-3 rounded-full bg-[#ff2c03]"></div>Performance</li>
              </ul>
            </FadeIn>
          </div>
        </div>
      </Slide>

      {/* SLIDE 4: QUEM É O SOMMA */}
      <Slide className="bg-zinc-950">
        <div className="max-w-5xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-sm tracking-widest text-[#ff2c03] uppercase font-bold mb-8">Quem é o Somma</h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <h3 className="text-4xl md:text-7xl font-bold mb-16 leading-tight">
              O Somma é um <span className="text-[#ff2c03] italic">movimento</span>.
            </h3>
          </FadeIn>
          
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            {['Comunidade.', 'Conexão.', 'Experiência.', 'Cultura.', 'Pertencimento.'].map((word, i) => (
              <FadeIn key={word} delay={0.3 + (i * 0.1)}>
                <span className="text-3xl md:text-5xl font-light text-gray-300">{word}</span>
              </FadeIn>
            ))}
          </div>
        </div>
      </Slide>

      {/* SLIDE 5: OS NÚMEROS */}
      <Slide className="bg-black">
        <div className="max-w-6xl w-full mx-auto">
          <FadeIn>
            <h2 className="text-sm tracking-widest text-[#ff2c03] uppercase font-bold mb-20 text-center">O Impacto</h2>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <FadeIn delay={0.2}>
              <div className="text-7xl md:text-8xl font-black text-white mb-4 tracking-tighter">5.000<span className="text-[#ff2c03]">+</span></div>
              <div className="text-xl text-gray-400 font-light">Membros cadastrados</div>
            </FadeIn>
            <FadeIn delay={0.4}>
              <div className="text-7xl md:text-8xl font-black text-white mb-4 tracking-tighter">52</div>
              <div className="text-xl text-gray-400 font-light">Encontros por ano</div>
            </FadeIn>
            <FadeIn delay={0.6}>
              <div className="text-7xl md:text-8xl font-black text-white mb-4 tracking-tighter">100<span className="text-[#ff2c03]">k+</span></div>
              <div className="text-xl text-gray-400 font-light">Interações anuais</div>
            </FadeIn>
          </div>
          
          <FadeIn delay={0.8} className="mt-24 text-center">
            <p className="text-2xl md:text-4xl font-light text-gray-300">
              Eventos proprietários. Comunidade ativa. Crescimento orgânico.
            </p>
          </FadeIn>
        </div>
      </Slide>

      {/* SLIDE 6: O SOMMA É UM ECOSSISTEMA */}
      <Slide className="bg-zinc-950">
        <div className="max-w-5xl w-full mx-auto relative h-[600px] flex items-center justify-center">
          <FadeIn className="absolute top-0 w-full text-center">
            <h2 className="text-3xl md:text-5xl font-bold">O SOMMA É UM ECOSSISTEMA</h2>
          </FadeIn>
          
          <div className="relative w-full max-w-3xl aspect-square flex items-center justify-center mt-20">
            {/* Center */}
            <FadeIn delay={0.5} className="absolute z-20">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-[#ff2c03] flex items-center justify-center shadow-[0_0_50px_rgba(255,44,3,0.5)]">
                <Image src="/Logo_Nova_Somma_Branca_Laranja.svg" alt="Somma" width={100} height={30} className="w-20 md:w-28 brightness-0 invert" />
              </div>
            </FadeIn>
            
            {/* Orbiting Elements */}
            {[
              { text: "Comunidade", angle: 0 },
              { text: "Assessoria", angle: 45 },
              { text: "Eventos", angle: 90 },
              { text: "Loja", angle: 135 },
              { text: "Conteúdo", angle: 180 },
              { text: "Influenciadores", angle: 225 },
              { text: "Parceiros", angle: 270 },
              { text: "Lifestyle", angle: 315 },
            ].map((item, i) => {
              const radius = typeof window !== 'undefined' && window.innerWidth < 768 ? 140 : 250;
              const x = Math.cos((item.angle * Math.PI) / 180) * radius;
              const y = Math.sin((item.angle * Math.PI) / 180) * radius;
              
              return (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 + (i * 0.1), duration: 0.5 }}
                  className="absolute z-10"
                  style={{ x, y }}
                >
                  <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 md:px-6 md:py-3 rounded-full text-sm md:text-lg font-medium whitespace-nowrap shadow-xl">
                    {item.text}
                  </div>
                </motion.div>
              );
            })}
            
            {/* Connecting Lines */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="absolute inset-0 border border-zinc-800 rounded-full scale-[0.6] md:scale-[0.7] -z-10"
            />
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 1.7, duration: 1 }}
              className="absolute inset-0 border border-zinc-800 rounded-full scale-[0.85] md:scale-100 -z-10"
            />
          </div>
        </div>
      </Slide>

      {/* SLIDE 7: O QUE CONSTRUÍMOS */}
      <Slide className="bg-black p-0">
        <div className="absolute inset-0 z-0 grid grid-cols-2 md:grid-cols-4 grid-rows-2 opacity-40">
          {/* Using placeholders or repeating the available image for the mosaic effect */}
          {[1,2,3,4,5,6,7,8].map((i) => (
            <div key={i} className="relative w-full h-full overflow-hidden">
              <Image 
                src="/marcos-vinicius-do-vale-yeEsrY5kzL8-unsplash.jpg" 
                alt="Community" 
                fill 
                className={`object-cover ${i % 2 === 0 ? 'scale-110' : 'scale-100'} filter grayscale hover:grayscale-0 transition-all duration-1000`} 
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-black/70" />
        </div>
        
        <div className="z-10 max-w-5xl mx-auto text-center px-6">
          <FadeIn>
            <h2 className="text-4xl md:text-7xl font-bold mb-12">O QUE CONSTRUÍMOS</h2>
          </FadeIn>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {['Pessoas.', 'Conexões.', 'Relacionamentos.', 'Networking.', 'Experiências.', 'Emoção.'].map((word, i) => (
              <FadeIn key={word} delay={0.2 + (i * 0.1)}>
                <span className="text-2xl md:text-4xl font-light text-white bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">{word}</span>
              </FadeIn>
            ))}
          </div>
        </div>
      </Slide>

      {/* SLIDE 8: POR QUE AS MARCAS SE APROXIMAM */}
      <Slide className="bg-zinc-950">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-bold mb-16 leading-tight">
              POR QUE AS MARCAS SE APROXIMAM DO SOMMA?
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-2xl md:text-4xl text-gray-400 font-light mb-16">
              Porque o Somma possui algo raro.
            </p>
          </FadeIn>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
            {['Atenção', 'Confiança', 'Influência', 'Recorrência'].map((word, i) => (
              <FadeIn key={word} delay={0.4 + (i * 0.1)} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 text-[#ff2c03]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <span className="text-xl md:text-2xl font-medium">{word}</span>
              </FadeIn>
            ))}
          </div>
        </div>
      </Slide>

      {/* SLIDE 9: QUEM É A EVOLVE */}
      <Slide className="bg-black">
        <div className="max-w-5xl mx-auto text-center">
          <FadeIn>
            <Image src="/logo-evolve.svg" alt="Evolve" width={300} height={100} className="h-20 md:h-32 w-auto mx-auto mb-16 brightness-0 invert" />
          </FadeIn>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { title: "Escala", icon: <TrendingUp className="w-10 h-10" /> },
              { title: "Crescimento", icon: <Zap className="w-10 h-10" /> },
              { title: "Estrutura", icon: <Shield className="w-10 h-10" /> },
              { title: "Capilaridade", icon: <Target className="w-10 h-10" /> }
            ].map((item, i) => (
              <FadeIn key={item.title} delay={0.2 + (i * 0.1)} className="flex flex-col items-center p-8 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
                <div className="text-white mb-6">{item.icon}</div>
                <h3 className="text-xl md:text-2xl font-medium text-gray-300">{item.title}</h3>
              </FadeIn>
            ))}
          </div>
          
          <FadeIn delay={0.7} className="mt-16">
            <p className="text-2xl md:text-4xl font-light">A potência da comunidade fitness.</p>
          </FadeIn>
        </div>
      </Slide>

      {/* SLIDE 10: POR QUE FAZEM SENTIDO */}
      <Slide className="bg-zinc-950">
        <div className="max-w-6xl w-full mx-auto">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-bold mb-20 text-center">POR QUE EVOLVE E SOMMA FAZEM SENTIDO</h2>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-stretch mb-20">
            <FadeIn delay={0.2} className="bg-black p-10 md:p-16 rounded-3xl border border-zinc-800 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#ff2c03]"></div>
              <Image src="/Logo_Nova_Somma_Branca_Laranja.svg" alt="Somma" width={150} height={40} className="h-10 w-auto mb-12 brightness-0 invert" />
              <ul className="space-y-6 text-xl md:text-2xl text-gray-300 font-light">
                <li>Comunidade</li>
                <li>Influência</li>
                <li>Relacionamento</li>
                <li>Lifestyle</li>
                <li>Conteúdo</li>
              </ul>
            </FadeIn>
            
            <FadeIn delay={0.4} className="bg-white text-black p-10 md:p-16 rounded-3xl relative overflow-hidden">
              <Image src="/logo-evolve.svg" alt="Evolve" width={150} height={40} className="h-10 w-auto mb-12" />
              <ul className="space-y-6 text-xl md:text-2xl text-gray-800 font-medium">
                <li>Estrutura</li>
                <li>Academias</li>
                <li>Escala</li>
                <li>Capacidade comercial</li>
                <li>Operação</li>
              </ul>
            </FadeIn>
          </div>
          
          <FadeIn delay={0.6} className="text-center">
            <div className="inline-block bg-zinc-900 border border-zinc-800 px-8 py-4 rounded-full">
              <p className="text-2xl md:text-3xl font-medium">
                Juntos criam algo que <span className="text-[#ff2c03]">nenhum concorrente</span> possui.
              </p>
            </div>
          </FadeIn>
        </div>
      </Slide>

      {/* SLIDE 11: A OPORTUNIDADE EVOLVE+ */}
      <Slide className="bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-sm tracking-widest text-[#ff2c03] uppercase font-bold mb-12">A Oportunidade</h2>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <p className="text-2xl md:text-4xl text-gray-400 font-light leading-relaxed mb-16">
              A Evolve já domina o mercado de entrada.<br />
              Agora existe uma oportunidade.
            </p>
          </FadeIn>
          
          <div className="space-y-6 text-3xl md:text-6xl font-bold mb-16">
            <FadeIn delay={0.4}><div className="text-white">Construir <span className="text-zinc-600">desejo.</span></div></FadeIn>
            <FadeIn delay={0.5}><div className="text-white">Construir <span className="text-zinc-600">autoridade.</span></div></FadeIn>
            <FadeIn delay={0.6}><div className="text-[#ff2c03]">Construir posicionamento premium.</div></FadeIn>
          </div>
          
          <FadeIn delay={0.8}>
            <p className="text-xl md:text-3xl font-light text-gray-300">
              E esse público já está dentro do Somma.
            </p>
          </FadeIn>
        </div>
      </Slide>

      {/* SLIDE 12: UMA OPORTUNIDADE EXCLUSIVA */}
      <Slide className="bg-[#ff2c03] text-white">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <h2 className="text-4xl md:text-6xl font-black mb-16 leading-tight">
              NENHUMA ACADEMIA DO DF POSSUI:
            </h2>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-xl md:text-3xl font-medium mb-20">
            {[
              "Integração com a maior comunidade",
              "Mais de 5.000 membros",
              "Influenciadores",
              "Eventos próprios",
              "Ecossistema próprio",
              "Check-in próprio",
              "Conteúdo próprio"
            ].map((item, i) => (
              <FadeIn key={item} delay={0.2 + (i * 0.1)} className="flex items-center gap-4">
                <div className="w-3 h-3 bg-black rounded-full shrink-0" />
                <span>{item}</span>
              </FadeIn>
            ))}
          </div>
          
          <FadeIn delay={1.0}>
            <div className="text-5xl md:text-8xl font-black tracking-tighter bg-black text-white inline-block px-8 py-4 rounded-2xl transform -rotate-2">
              A EVOLVE SERÁ A ÚNICA.
            </div>
          </FadeIn>
        </div>
      </Slide>

      {/* SLIDE 13: O CONCEITO */}
      <Slide className="bg-black">
        <div className="max-w-5xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-sm tracking-widest text-gray-500 uppercase font-bold mb-8">O Conceito</h2>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <div className="text-6xl md:text-9xl font-black tracking-tighter mb-8">
              EVOLVE<span className="text-[#ff2c03]">+</span>
            </div>
          </FadeIn>
          
          <FadeIn delay={0.4}>
            <div className="text-xl md:text-3xl font-light tracking-widest text-gray-400 mb-4 uppercase">
              Official Performance Partner
            </div>
            <div className="text-lg md:text-xl font-light text-gray-600 mb-20">
              POWERED BY EVOLVE
            </div>
          </FadeIn>
          
          <FadeIn delay={0.6} className="max-w-3xl mx-auto">
            <p className="text-2xl md:text-4xl font-light leading-relaxed">
              Não se trata de naming rights tradicionais.<br />
              <span className="font-medium text-white">Trata-se de associação estratégica.</span>
            </p>
          </FadeIn>
        </div>
      </Slide>

      {/* SLIDE 14: ATIVOS DISPONÍVEIS */}
      <Slide className="bg-zinc-950">
        <div className="max-w-6xl w-full mx-auto">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center">ATIVOS DISPONÍVEIS</h2>
          </FadeIn>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {[
              "Comunidade", "Eventos", "Conteúdo", "Influenciadores", 
              "Assessoria", "CRM", "Site", "Check-ins", 
              "Loja", "Landing Pages", "Base de membros"
            ].map((ativo, i) => (
              <FadeIn key={ativo} delay={0.1 * i}>
                <div className="px-6 py-4 md:px-8 md:py-5 bg-black border border-zinc-800 rounded-full text-xl md:text-2xl font-light hover:border-[#ff2c03] hover:text-[#ff2c03] transition-colors cursor-default">
                  {ativo}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </Slide>

      {/* SLIDES 15-20: PROGRAMAS (GRID) */}
      <Slide className="bg-black py-32 h-auto min-h-screen">
        <div className="max-w-7xl w-full mx-auto">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-bold mb-20 text-center">O QUE VAMOS EXECUTAR</h2>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 15 */}
            <FadeIn delay={0.1} className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 hover:border-[#ff2c03]/50 transition-colors">
              <h3 className="text-2xl font-bold mb-4 text-[#ff2c03]">SOMMA CREATORS</h3>
              <p className="text-gray-400 mb-6 font-light">Programa oficial de criadores.</p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Transformar a Evolve+ em assunto</li>
                <li>• Produzir conteúdo</li>
                <li>• Gerar desejo e alcance</li>
                <li>• Construir autoridade</li>
              </ul>
            </FadeIn>

            {/* 16 */}
            <FadeIn delay={0.2} className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 hover:border-[#ff2c03]/50 transition-colors">
              <h3 className="text-2xl font-bold mb-4 text-white">SOMMA LEADERS</h3>
              <p className="text-gray-400 mb-6 font-light">Evento mensal exclusivo.</p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Empresários e Executivos</li>
                <li>• Médicos e Advogados</li>
                <li>• Networking e Treino</li>
                <li>• Tudo dentro da Evolve+</li>
              </ul>
            </FadeIn>

            {/* 17 */}
            <FadeIn delay={0.3} className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 hover:border-[#ff2c03]/50 transition-colors">
              <h3 className="text-2xl font-bold mb-4 text-white">PERFORMANCE LAB</h3>
              <p className="text-gray-400 mb-6 font-light">Eventos técnicos.</p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Foco em Corrida</li>
                <li>• Nutrição e Mobilidade</li>
                <li>• Recuperação</li>
                <li>• Local: Evolve+</li>
              </ul>
            </FadeIn>

            {/* 18 */}
            <FadeIn delay={0.4} className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 hover:border-[#ff2c03]/50 transition-colors">
              <h3 className="text-2xl font-bold mb-4 text-white">RECOVERY DAY</h3>
              <p className="text-gray-400 mb-6 font-light">Experiência premium.</p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Bem-estar</li>
                <li>• Recuperação muscular</li>
                <li>• Longevidade</li>
                <li>• Saúde integrada</li>
              </ul>
            </FadeIn>

            {/* 19 */}
            <FadeIn delay={0.5} className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 hover:border-[#ff2c03]/50 transition-colors">
              <h3 className="text-2xl font-bold mb-4 text-white">EVOLVE+ CHALLENGE</h3>
              <p className="text-gray-400 mb-6 font-light">Programa de desafios.</p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Frequência e Transformação</li>
                <li>• Engajamento da base</li>
                <li>• Premiações exclusivas</li>
                <li>• Geração de conteúdo</li>
              </ul>
            </FadeIn>

            {/* 20 */}
            <FadeIn delay={0.6} className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 hover:border-[#ff2c03]/50 transition-colors">
              <h3 className="text-2xl font-bold mb-4 text-white">PROGRAMA DE BOLSAS</h3>
              <p className="text-gray-400 mb-6 font-light">Patrocínio oficial Evolve+.</p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• 10 bolsas anuais de assessoria</li>
                <li>• Transformar vidas</li>
                <li>• Gerar histórias reais</li>
                <li>• Atrair novos corredores</li>
              </ul>
            </FadeIn>
          </div>
        </div>
      </Slide>

      {/* SLIDE 21: CALENDÁRIO ANUAL */}
      <Slide className="bg-zinc-950">
        <div className="max-w-5xl w-full mx-auto">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center">CALENDÁRIO ANUAL</h2>
          </FadeIn>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: "52", desc: "Encontros Somma" },
              { num: "12", desc: "Ativações Evolve+" },
              { num: "12", desc: "Campanhas digitais" },
              { num: "12", desc: "Ações c/ criadores" },
              { num: "4", desc: "Eventos premium" },
              { num: "2", desc: "Grandes campanhas" },
              { num: "10", desc: "Bolsas distribuídas" },
              { num: "365", desc: "Dias de impacto" },
            ].map((item, i) => (
              <FadeIn key={i} delay={0.1 * i} className="flex flex-col items-center justify-center p-6">
                <div className="text-5xl md:text-6xl font-black text-[#ff2c03] mb-2">{item.num}</div>
                <div className="text-lg text-gray-400 font-light">{item.desc}</div>
              </FadeIn>
            ))}
          </div>
        </div>
      </Slide>

      {/* SLIDE 22: EXCLUSIVIDADE */}
      <Slide className="bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <Shield className="w-20 h-20 text-[#ff2c03] mx-auto mb-12" />
          </FadeIn>
          <FadeIn delay={0.2}>
            <h2 className="text-4xl md:text-7xl font-bold mb-12 leading-tight">
              EXCLUSIVIDADE TOTAL
            </h2>
          </FadeIn>
          <FadeIn delay={0.4}>
            <p className="text-2xl md:text-4xl text-gray-300 font-light leading-relaxed">
              A Evolve será a <span className="text-white font-medium">única academia</span> associada oficialmente ao Somma.
            </p>
          </FadeIn>
          <FadeIn delay={0.6} className="mt-12">
            <p className="text-xl text-gray-500 font-light">
              Não haverá concorrentes diretos dentro do ecossistema.<br />
              A exclusividade é parte central da proposta.
            </p>
          </FadeIn>
        </div>
      </Slide>

      {/* SLIDE 23: PRESENÇA DA MARCA */}
      <Slide className="bg-zinc-950">
        <div className="max-w-6xl w-full mx-auto text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-bold mb-16">PRESENÇA DA MARCA</h2>
          </FadeIn>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
            {[
              "Camisetas insiders",
              "Uniformes",
              "Site",
              "Check-in",
              "Backdrops",
              "Eventos",
              "Credenciais",
              "Landing Pages",
              "Totens",
              "Conteúdo"
            ].map((item, i) => (
              <FadeIn key={item} delay={0.1 * i} className="bg-black border border-zinc-800 rounded-2xl p-6 flex items-center justify-center aspect-square hover:border-[#ff2c03] transition-colors group">
                <span className="text-lg md:text-xl font-light text-gray-400 group-hover:text-white transition-colors">{item}</span>
              </FadeIn>
            ))}
          </div>
        </div>
      </Slide>

      {/* SLIDE 24: FUNIL DE NEGÓCIOS */}
      <Slide className="bg-zinc-950">
        <div className="max-w-4xl w-full mx-auto text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-bold mb-16">FUNIL DE NEGÓCIOS</h2>
          </FadeIn>
          
          <div className="flex flex-col items-center space-y-4 md:space-y-6">
            {[
              "Comunidade",
              "Experiência",
              "Relacionamento",
              "Day Pass",
              "Teste",
              "Matrícula",
              "Retenção",
              "Advocacy"
            ].map((step, i, arr) => (
              <React.Fragment key={step}>
                <FadeIn delay={0.1 * i}>
                  <div className={`px-8 py-3 rounded-xl text-xl md:text-3xl font-bold ${i >= arr.length - 3 ? 'bg-[#ff2c03] text-white' : 'bg-zinc-900 text-gray-300'}`}>
                    {step}
                  </div>
                </FadeIn>
                {i < arr.length - 1 && (
                  <FadeIn delay={0.1 * i + 0.05}>
                    <ArrowRight className="w-6 h-6 text-gray-600 rotate-90" />
                  </FadeIn>
                )}
              </React.Fragment>
            ))}
          </div>
          
          <FadeIn delay={1} className="mt-16">
            <p className="text-2xl font-light text-gray-400">
              A parceria gera <span className="text-white font-medium">vendas</span>. Não apenas branding.
            </p>
          </FadeIn>
        </div>
      </Slide>

      {/* SLIDE 25 & 26: O QUE GANHAM */}
      <Slide className="bg-black">
        <div className="max-w-6xl w-full mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            
            <FadeIn>
              <h2 className="text-3xl font-bold mb-12 text-[#ff2c03]">O QUE A EVOLVE GANHA</h2>
              <ul className="space-y-6 text-2xl text-gray-300 font-light">
                <li className="flex items-center gap-4"><CheckCircle2 className="w-6 h-6 text-[#ff2c03]" /> Posicionamento</li>
                <li className="flex items-center gap-4"><CheckCircle2 className="w-6 h-6 text-[#ff2c03]" /> Comunidade</li>
                <li className="flex items-center gap-4"><CheckCircle2 className="w-6 h-6 text-[#ff2c03]" /> Autoridade</li>
                <li className="flex items-center gap-4"><CheckCircle2 className="w-6 h-6 text-[#ff2c03]" /> Exclusividade</li>
                <li className="flex items-center gap-4"><CheckCircle2 className="w-6 h-6 text-[#ff2c03]" /> Conteúdo</li>
                <li className="flex items-center gap-4"><CheckCircle2 className="w-6 h-6 text-[#ff2c03]" /> Influência</li>
                <li className="flex items-center gap-4"><CheckCircle2 className="w-6 h-6 text-[#ff2c03]" /> Leads & Matrículas</li>
              </ul>
            </FadeIn>
            
            <FadeIn delay={0.3}>
              <h2 className="text-3xl font-bold mb-12 text-white">O QUE O SOMMA GANHA</h2>
              <ul className="space-y-6 text-2xl text-gray-300 font-light">
                <li className="flex items-center gap-4"><CheckCircle2 className="w-6 h-6 text-white" /> Estrutura</li>
                <li className="flex items-center gap-4"><CheckCircle2 className="w-6 h-6 text-white" /> Investimento</li>
                <li className="flex items-center gap-4"><CheckCircle2 className="w-6 h-6 text-white" /> Experiência</li>
                <li className="flex items-center gap-4"><CheckCircle2 className="w-6 h-6 text-white" /> Fortalecimento</li>
                <li className="flex items-center gap-4"><CheckCircle2 className="w-6 h-6 text-white" /> Expansão do ecossistema</li>
                <li className="flex items-center gap-4"><CheckCircle2 className="w-6 h-6 text-white" /> Novas oportunidades</li>
              </ul>
            </FadeIn>

          </div>
        </div>
      </Slide>

      {/* SLIDE 27: VISÃO 2030 */}
      <Slide className="bg-zinc-950">
        <div className="max-w-5xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-sm tracking-widest text-[#ff2c03] uppercase font-bold mb-12">Visão 2030</h2>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <p className="text-3xl md:text-5xl font-light leading-relaxed mb-16 text-gray-300">
              O Somma se torna <span className="text-white font-medium">referência nacional</span>.<br />
              A Evolve se torna a academia <span className="text-white font-medium">oficialmente associada</span> a esse movimento.
            </p>
          </FadeIn>
          
          <FadeIn delay={0.4}>
            <div className="inline-block border-t border-b border-zinc-800 py-12">
              <p className="text-2xl md:text-4xl text-gray-400 font-light">
                Não estamos criando uma campanha.<br />
                <span className="text-[#ff2c03] font-bold mt-4 block">Estamos construindo um ativo.</span>
              </p>
            </div>
          </FadeIn>
        </div>
      </Slide>

      {/* SLIDE 28: PROPOSTA DE INVESTIMENTO */}
      <Slide className="bg-black">
        <div className="max-w-6xl w-full mx-auto">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-bold mb-20 text-center">PROPOSTA DE INVESTIMENTO</h2>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <FadeIn delay={0.2} className="bg-zinc-900 border border-zinc-800 p-10 rounded-3xl text-center flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-medium text-gray-400 mb-2">Plano</h3>
                <div className="text-4xl font-bold text-white mb-8">Start</div>
              </div>
              <div className="text-4xl md:text-5xl font-light text-[#ff2c03]">
                <span className="text-2xl">R$</span> 10k<span className="text-xl text-gray-500">/mês</span>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.4} className="bg-zinc-900 border border-[#ff2c03] p-10 rounded-3xl text-center relative flex flex-col justify-between transform md:-translate-y-4 shadow-[0_0_30px_rgba(255,44,3,0.15)]">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#ff2c03] text-white px-4 py-1 rounded-full text-sm font-bold tracking-wider">
                RECOMENDADO
              </div>
              <div>
                <h3 className="text-2xl font-medium text-gray-400 mb-2">Plano</h3>
                <div className="text-4xl font-bold text-white mb-8">Growth</div>
              </div>
              <div className="text-4xl md:text-5xl font-bold text-[#ff2c03]">
                <span className="text-2xl">R$</span> 15k<span className="text-xl text-gray-500 font-light">/mês</span>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.6} className="bg-zinc-900 border border-zinc-800 p-10 rounded-3xl text-center flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-medium text-gray-400 mb-2">Plano</h3>
                <div className="text-4xl font-bold text-white mb-8">Performance</div>
              </div>
              <div className="text-4xl md:text-5xl font-light text-[#ff2c03]">
                <span className="text-2xl">R$</span> 20k<span className="text-xl text-gray-500">/mês</span>
              </div>
            </FadeIn>
          </div>
          
          <FadeIn delay={0.8} className="text-center">
            <p className="text-xl text-gray-500 font-light">Contrato mínimo de 12 meses.</p>
          </FadeIn>
        </div>
      </Slide>

      {/* SLIDE FINAL */}
      <Slide className="bg-[#ff2c03] text-white">
        <div className="max-w-5xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-4xl md:text-7xl font-black mb-12 leading-tight tracking-tight">
              AS MELHORES MARCAS NÃO COMPRAM ESPAÇO.
            </h2>
          </FadeIn>
          <FadeIn delay={0.3}>
            <h2 className="text-5xl md:text-8xl font-black mb-24 leading-tight tracking-tighter text-black">
              ELAS CONSTROEM MOVIMENTOS.
            </h2>
          </FadeIn>
          
          <FadeIn delay={0.6}>
            <div className="flex items-center justify-center gap-6 md:gap-12 mb-12">
              <Image src="/Logo_Nova_Somma_Branca_Laranja.svg" alt="Somma Club" width={150} height={40} className="h-8 md:h-12 w-auto brightness-0 invert" />
              <div className="text-2xl md:text-4xl font-light text-black">+</div>
              <Image src="/logo-evolve.svg" alt="Evolve" width={150} height={40} className="h-8 md:h-12 w-auto brightness-0 invert" />
            </div>
          </FadeIn>
          
          <FadeIn delay={0.9}>
            <p className="text-xl md:text-3xl font-medium tracking-widest uppercase">
              O futuro da comunidade fitness do DF.
            </p>
          </FadeIn>
        </div>
      </Slide>

    </div>
  );
}
