'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

const LOGO_SOMMA = 'https://cdn.shopify.com/s/files/1/0788/1932/8253/files/HORIZONTAL_PRETA_LARANJA.png?v=1772322941'
const LOGO_ESPLANADA = '/logo-esplanada-run.jpg'

const UFS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']
const REGIOES = ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul']

function formatDate(value: string) {
  const d = value.replace(/\D/g, '').slice(0, 8)
  let out = d
  if (d.length >= 3) out = d.slice(0, 2) + '/' + d.slice(2)
  if (d.length >= 5) out = d.slice(0, 2) + '/' + d.slice(2, 4) + '/' + d.slice(4)
  return out
}

function formatCPF(value: string) {
  const d = value.replace(/\D/g, '').slice(0, 11)
  return d
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

function formatPhone(value: string) {
  const d = value.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

export default function CollabClient() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <SiteHeader />
      <Hero />
      <SobreEvento />
      <Programacao />
      <Percursos />
      <Kit />
      <PontoEncontro />
      <Inscricao />
      <FAQ />
      <CTAFinal />
      <SiteFooter />
    </div>
  )
}

/* ---------- HEADER ---------- */
function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <img src={LOGO_SOMMA} alt="SOMMA Running Club" className="h-9 w-auto" />
        </a>
        <nav className="hidden md:flex items-center gap-7 text-sm text-zinc-600">
          <a href="/" className="hover:text-zinc-900">Home</a>
          <a href="https://assessoria.sommaclub.com.br/" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900">Assessoria</a>
          <a href="https://loja.sommaclub.com.br/" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900">Loja</a>
          <a href="/check-in" className="hover:text-zinc-900">Check-in</a>
        </nav>
        <a
          href="#inscricao"
          className="inline-flex items-center px-4 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition"
        >
          Inscreva-se
        </a>
      </div>
    </header>
  )
}

function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 py-10 text-center text-sm text-zinc-500">
      <p>© 2026 SOMMA Running Club · Maior running club do Distrito Federal</p>
      <p className="mt-2">
        <a href="https://sommaclub.com.br" className="text-orange-500 hover:underline">sommaclub.com.br</a>
      </p>
    </footer>
  )
}

/* ---------- HERO ---------- */
function Hero() {
  return (
    <section className="relative overflow-hidden bg-zinc-950 text-white px-4 py-24 sm:py-32">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 15% 30%, rgba(255,44,3,0.3), transparent 55%), radial-gradient(circle at 85% 70%, rgba(204,255,0,0.2), transparent 55%)',
        }}
      />
      <div className="relative max-w-5xl mx-auto text-center">
        <div className="flex items-center justify-center gap-3 sm:gap-5 mb-8 flex-wrap">
          <span className="inline-flex items-center bg-white rounded-xl px-5 py-3 shadow-lg">
            <img src={LOGO_SOMMA} alt="SOMMA Club" className="h-8 sm:h-10 w-auto" />
          </span>
          <span className="text-2xl sm:text-3xl font-black opacity-60">×</span>
          <span className="inline-flex items-center bg-white rounded-xl p-1.5 shadow-lg">
            <img src={LOGO_ESPLANADA} alt="Esplanada Run" className="h-12 sm:h-14 w-auto rounded-lg" />
          </span>
        </div>
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black leading-[0.95] tracking-tight mb-6">
          Juntos na
          <br />
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #ff2c03 0%, #CCFF00 100%)' }}>
            Esplanada
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-zinc-300 max-w-2xl mx-auto mb-4">
          A maior comunidade de corrida de Brasília se une ao maior palco do país. A rua é de todos, e a gente vai cruzar ela junto.
        </p>
        <p className="text-sm sm:text-base font-bold tracking-[0.2em] uppercase mb-10" style={{ color: '#CCFF00' }}>
          21 · jun · 2026 · Esplanada dos Ministérios · 07h00
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="#inscricao"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold transition text-lg"
          >
            Garanta sua inscrição
          </a>
          <a
            href="#sobre"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full border-2 font-semibold transition hover:bg-white/10"
            style={{ borderColor: '#CCFF00', color: '#CCFF00' }}
          >
            Saiba mais
          </a>
        </div>
      </div>
    </section>
  )
}

/* ---------- SOBRE O EVENTO (rico) ---------- */
function SobreEvento() {
  const fatos = [
    { k: 'Data', v: '21 de junho de 2026' },
    { k: 'Largada', v: '07h00' },
    { k: 'Local', v: 'Esplanada dos Ministérios, Brasília' },
    { k: 'Percursos', v: 'Caminhada 3 km · Corrida 5 km · Corrida 10 km' },
    { k: 'Inscrição', v: '100% gratuita' },
    { k: 'Organização', v: 'Instituto Guilda · Ministério do Esporte · Governo Federal' },
  ]
  return (
    <section id="sobre" className="py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-orange-500">Sobre o evento</span>
          <h2 className="text-4xl sm:text-5xl font-black leading-tight mt-3 mb-5">
            O Esplanada Run é <span className="text-orange-500">de todo mundo.</span>
          </h2>
          <p className="text-zinc-600 leading-relaxed text-lg">
            O Esplanada Run, Time Brasil 2026 é uma corrida de rua gratuita no coração da capital, organizada pelo Instituto Guilda com apoio do Ministério do Esporte e do Governo Federal. São milhares de pessoas correndo juntas na Esplanada dos Ministérios, num dos cenários mais icônicos do país. E o Somma Club, maior running club do Distrito Federal, marca presença oficial levando estrutura, comunidade e energia.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {fatos.map((f, i) => (
            <div key={i} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
              <div className="text-xs font-bold tracking-[0.15em] uppercase text-orange-500 mb-2">{f.k}</div>
              <div className="text-zinc-900 font-semibold">{f.v}</div>
            </div>
          ))}
        </div>

        <div
          className="rounded-3xl p-8 sm:p-10 grid md:grid-cols-[1.4fr_1fr] gap-8 items-center"
          style={{ background: 'linear-gradient(135deg, rgba(255,44,3,0.08), rgba(204,255,0,0.06))', border: '1px solid rgba(255,44,3,0.2)' }}
        >
          <div>
            <h3 className="text-2xl sm:text-3xl font-black mb-3">Corra com a comunidade</h3>
            <p className="text-zinc-700 leading-relaxed">
              Mais de 5 mil membros cadastrados fazem do Somma a maior comunidade de corrida de Brasília. No dia 21 de junho a gente se encontra antes da largada, com bandeira, aquecimento coletivo e a vibe de sempre. Você não corre sozinho: corre com a galera.
            </p>
          </div>
          <div className="text-center">
            <div className="text-6xl sm:text-7xl font-black leading-none bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #ff2c03, #99cc00)' }}>
              5.000+
            </div>
            <div className="text-sm font-bold tracking-[0.15em] uppercase text-zinc-700 mt-2">Membros do Somma</div>
            <a href="#inscricao" className="inline-flex mt-5 items-center justify-center px-6 py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold transition">
              Quero participar
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- PROGRAMAÇÃO ---------- */
function Programacao() {
  const items: Array<{ t: string; d: string; h?: boolean }> = [
    { t: '05h30', d: 'Abertura da arena' },
    { t: '06h30', d: 'Aquecimento da corrida' },
    { t: '06h45', d: 'Chamada para largada' },
    { t: '07h00', d: 'Largada conjunta 5 km + 10 km', h: true },
    { t: '07h40', d: 'Largada caminhada 3 km' },
    { t: '08h15', d: 'Premiação 5 km e 10 km' },
    { t: '08h45', d: 'Show' },
    { t: '10h30', d: 'Encerramento oficial' },
  ]
  return (
    <section id="programacao" className="py-20 px-4 bg-zinc-50">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-orange-500">Programação oficial</span>
          <h2 className="text-4xl sm:text-5xl font-black leading-tight mt-3">
            O dia <span className="text-orange-500">21 de junho</span>
          </h2>
        </div>
        <div className="rounded-2xl bg-white border border-zinc-200 overflow-hidden">
          {items.map((it, i) => (
            <div
              key={i}
              className={`grid grid-cols-[100px_1fr] sm:grid-cols-[140px_1fr] gap-4 px-5 sm:px-8 py-5 ${
                i < items.length - 1 ? 'border-b border-zinc-100' : ''
              } ${it.h ? 'bg-orange-50' : ''}`}
            >
              <div className={`text-2xl sm:text-3xl font-black ${it.h ? 'text-orange-500' : 'text-zinc-900'}`}>{it.t}</div>
              <div className={`flex items-center ${it.h ? 'font-bold text-zinc-900' : 'text-zinc-600'}`}>{it.d}</div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <a href="#inscricao" className="inline-flex items-center justify-center px-7 py-4 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold transition">
            Garantir minha vaga
          </a>
        </div>
      </div>
    </section>
  )
}

/* ---------- PERCURSOS ---------- */
function Percursos() {
  const cards = [
    { icon: '🚶', n: '3', meta: 'Caminhada · qualquer idade', desc: 'Aberta para qualquer idade. Pra quem quer caminhar, levar a família e fazer parte da festa.' },
    { icon: '🏃', n: '5', meta: 'Corrida · mín. 14 anos', desc: 'Largada 07h00. Troféu para os 3 primeiros colocados de cada categoria.' },
    { icon: '🏃‍♂️', n: '10', meta: 'Corrida · mín. 18 anos', desc: 'Largada 07h00. Troféu para os 3 primeiros colocados de cada categoria.' },
  ]
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-orange-500">Escolha sua distância</span>
          <h2 className="text-4xl sm:text-5xl font-black leading-tight mt-3">
            Três percursos. <span className="text-orange-500">Um só palco.</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {cards.map((c, i) => (
            <div key={i} className="rounded-2xl border border-zinc-200 p-7 hover:border-orange-500 hover:-translate-y-1 transition bg-white">
              <div className="text-5xl mb-3">{c.icon}</div>
              <div className="text-5xl font-black leading-none mb-1">
                <span className="text-orange-500">{c.n}</span>
                <span className="text-zinc-900">km</span>
              </div>
              <div className="text-xs font-bold tracking-[0.12em] uppercase text-zinc-500 mt-2 mb-3">{c.meta}</div>
              <p className="text-sm text-zinc-600 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
        <div
          className="mt-8 text-center px-6 py-4 rounded-xl font-semibold"
          style={{ background: 'rgba(204,255,0,0.15)', border: '1px dashed #99cc00', color: '#556e00' }}
        >
          🏅 Todos os concluintes recebem medalha de participação. 500 vagas reservadas para PCD e 500 para 60+.
        </div>
      </div>
    </section>
  )
}

/* ---------- KIT ---------- */
function Kit() {
  const days = [
    { date: '18/06', hours: '10h às 19h', place: 'Shopping Pier 21' },
    { date: '19/06', hours: '10h às 19h', place: 'Shopping Pier 21' },
    { date: '20/06', hours: '10h às 15h', place: 'Shopping Pier 21' },
  ]
  return (
    <section className="py-20 px-4 bg-zinc-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-orange-500">Retirada de kit</span>
          <h2 className="text-4xl sm:text-5xl font-black leading-tight mt-3">
            Pegue seu kit <span className="text-orange-500">antes da prova</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {days.map((d, i) => (
            <div key={i} className="rounded-2xl border border-zinc-200 p-7 bg-white">
              <div className="text-4xl font-black text-zinc-900">{d.date}</div>
              <div className="font-semibold mt-1 text-zinc-700">{d.hours}</div>
              <div className="text-sm text-zinc-500 mt-1">{d.place}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-lg border-l-4 border-orange-500 bg-orange-50 px-5 py-4 text-sm text-zinc-700">
          <strong className="text-orange-600">⚠️ Atenção:</strong> não haverá retirada de kit no dia da prova. Garanta o seu até sábado, 20/06.
        </div>
      </div>
    </section>
  )
}

/* ---------- PONTO DE ENCONTRO ---------- */
function PontoEncontro() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div
          className="rounded-3xl p-10 sm:p-16 text-white relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(255,44,3,0.95), rgba(255,44,3,0.7)), radial-gradient(circle at 80% 20%, rgba(204,255,0,0.4), transparent 60%)' }}
        >
          <span className="text-xs font-bold tracking-[0.2em] uppercase opacity-80">Ponto de encontro Somma</span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight mt-3 mb-5">Venha com a gente.</h2>
          <p className="text-lg max-w-2xl">
            O Somma estará presente na Esplanada com estrutura, bandeira, aquecimento coletivo e toda a nossa energia. A gente se encontra antes da largada e cruza a linha de chegada junto.
          </p>
          <div className="grid sm:grid-cols-3 gap-6 mt-10 pt-8 border-t border-white/25">
            <div>
              <div className="text-sm font-black tracking-[0.1em] uppercase mb-1">Chegue cedo</div>
              <div className="text-white/85 text-sm">30 min antes da largada</div>
            </div>
            <div>
              <div className="text-sm font-black tracking-[0.1em] uppercase mb-1">Estacionamento</div>
              <div className="text-white/85 text-sm">Sem reservados · sugestão: Anexos dos Ministérios</div>
            </div>
            <div>
              <div className="text-sm font-black tracking-[0.1em] uppercase mb-1">Procure a bandeira</div>
              <div className="text-white/85 text-sm">Somma Club na arena do evento</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- FORMULÁRIO DE INSCRIÇÃO ---------- */
function Inscricao() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [aberto, setAberto] = useState<boolean | null>(null)

  useEffect(() => {
    fetch('/api/inscricao-esplanada/config', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setAberto(d.aberto !== false))
      .catch(() => setAberto(true))
  }, [])
  const [form, setForm] = useState({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    sexo: '',
    data_nascimento: '',
    tipo_kit: '',
    modalidade: '',
    tamanho_camiseta: '',
    cidade: '',
    estado: '',
    regiao: '',
    nacionalidade: '',
  })

  function update<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/inscricao-esplanada', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        if (res.status === 403) {
          setAberto(false)
          return
        }
        throw new Error(data.error || 'Erro ao enviar inscrição.')
      }
      setDone(true)
      window.scrollTo({ top: document.getElementById('inscricao')?.offsetTop ?? 0, behavior: 'smooth' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar inscrição.')
    } finally {
      setLoading(false)
    }
  }

  const inputCls =
    'w-full px-4 py-2.5 border border-zinc-300 rounded-lg bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'

  if (aberto === false && !done) {
    return (
      <section id="inscricao" className="py-24 px-4 bg-zinc-50">
        <div className="max-w-xl mx-auto text-center bg-white rounded-3xl border border-orange-200 p-10 shadow-sm">
          <div className="text-6xl mb-4">🏁</div>
          <h2 className="text-3xl font-black mb-3">Inscrições encerradas</h2>
          <p className="text-zinc-600 mb-6">
            As vagas para o Esplanada Run 2026 com o Somma foram preenchidas. Obrigado pelo interesse! Fique de olho nas nossas redes e no site para as próximas oportunidades de correr com a gente.
          </p>
          <a href="https://sommaclub.com.br" className="inline-flex items-center justify-center px-7 py-4 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold transition">
            Conhecer o Somma Club
          </a>
        </div>
      </section>
    )
  }

  if (done) {
    return (
      <section id="inscricao" className="py-24 px-4 bg-zinc-50">
        <div className="max-w-xl mx-auto text-center bg-white rounded-3xl border border-orange-200 p-10 shadow-sm">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-black mb-3">Inscrição enviada!</h2>
          <p className="text-zinc-600 mb-4">
            Recebemos seus dados para o Esplanada Run 2026. A gente se vê na Esplanada no dia 21 de junho!
          </p>
          <div className="text-left bg-orange-50 border border-orange-200 rounded-xl px-5 py-4 mb-6">
            <p className="text-sm text-zinc-700 leading-relaxed">
              📩 <strong>Enviamos um e-mail de confirmação</strong> com o resumo da sua inscrição e todas as informações de retirada do kit. Confira sua caixa de entrada (e o spam, por garantia). Se não chegar em alguns minutos, fale com a gente.
            </p>
          </div>
          <a href="https://sommaclub.com.br" className="inline-flex items-center justify-center px-7 py-4 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold transition">
            Conhecer o Somma Club
          </a>
        </div>
      </section>
    )
  }

  return (
    <section id="inscricao" className="py-20 px-4 bg-zinc-50">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-orange-500">Inscrição</span>
          <h2 className="text-4xl sm:text-5xl font-black leading-tight mt-3 mb-3">
            Garanta sua <span className="text-orange-500">vaga</span>
          </h2>
          <p className="text-zinc-600">
            Preencha seus dados para participar do Esplanada Run 2026 com o Somma. Aberto a todos, sendo membro do Somma ou não.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-2xl border border-orange-200 p-6 sm:p-10 shadow-sm">
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex gap-3">
            <span className="text-lg leading-none">⚠️</span>
            <p className="text-sm text-amber-900 leading-relaxed">
              <strong>Preencha com dados reais.</strong> Nome e CPF serão conferidos na retirada do kit, dados incorretos podem impedir a retirada. Você receberá a confirmação no e-mail informado.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Nome completo *</label>
            <input type="text" className={inputCls} placeholder="João Silva Santos" value={form.nome} onChange={(e) => update('nome', e.target.value)} required />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">CPF *</label>
              <input type="text" inputMode="numeric" className={inputCls} placeholder="000.000.000-00" value={form.cpf} onChange={(e) => update('cpf', formatCPF(e.target.value))} maxLength={14} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">E-mail *</label>
              <input type="email" className={inputCls} placeholder="seu@email.com" value={form.email} onChange={(e) => update('email', e.target.value)} required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Telefone *</label>
            <input type="tel" className={inputCls} placeholder="(61) 99999-9999" value={form.telefone} onChange={(e) => update('telefone', formatPhone(e.target.value))} maxLength={15} required />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Sexo *</label>
              <select className={inputCls} value={form.sexo} onChange={(e) => update('sexo', e.target.value)} required>
                <option value="">Selecione</option>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Data de nascimento *</label>
              <input type="text" inputMode="numeric" className={inputCls} placeholder="DD/MM/AAAA" value={form.data_nascimento} onChange={(e) => update('data_nascimento', formatDate(e.target.value))} maxLength={10} required />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Modalidade *</label>
              <select className={inputCls} value={form.modalidade} onChange={(e) => update('modalidade', e.target.value)} required>
                <option value="">Selecione</option>
                <option value="3KM">3 km (caminhada)</option>
                <option value="5KM">5 km (corrida)</option>
                <option value="10KM">10 km (corrida)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tipo de kit *</label>
              <select className={inputCls} value={form.tipo_kit} onChange={(e) => update('tipo_kit', e.target.value)} required>
                <option value="">Selecione</option>
                <option value="UNICO">Único</option>
                <option value="UNICO_PCD">Único PCD</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tamanho da camiseta *</label>
              <select className={inputCls} value={form.tamanho_camiseta} onChange={(e) => update('tamanho_camiseta', e.target.value)} required>
                <option value="">Selecione</option>
                {['P', 'M', 'G', 'GG', 'XG'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Nacionalidade *</label>
              <select className={inputCls} value={form.nacionalidade} onChange={(e) => update('nacionalidade', e.target.value)} required>
                <option value="">Selecione</option>
                <option value="Brasileiro">Brasileiro</option>
                <option value="Estrangeiro">Estrangeiro</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-sm font-medium mb-2">Cidade *</label>
              <input type="text" className={inputCls} placeholder="Brasília" value={form.cidade} onChange={(e) => update('cidade', e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Estado *</label>
              <select className={inputCls} value={form.estado} onChange={(e) => update('estado', e.target.value)} required>
                <option value="">UF</option>
                {UFS.map((uf) => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Região *</label>
              <select className={inputCls} value={form.regiao} onChange={(e) => update('regiao', e.target.value)} required>
                <option value="">Selecione</option>
                {REGIOES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          <Button type="submit" size="lg" disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-6 text-base">
            {loading ? 'Enviando…' : 'Confirmar inscrição'}
          </Button>
          <p className="text-xs text-center text-zinc-500">
            Após confirmar, enviamos um e-mail com o resumo da inscrição e os dados de retirada do kit. Ao se inscrever você concorda com o tratamento dos seus dados conforme a LGPD para fins de organização do evento.
          </p>
        </form>
      </div>
    </section>
  )
}

/* ---------- FAQ ---------- */
function FAQ() {
  const items = [
    { q: 'A corrida é paga?', a: 'Não, é 100% gratuita. O Esplanada Run, Time Brasil 2026 é organizado pelo Instituto Guilda com apoio do Ministério do Esporte e do Governo Federal.' },
    { q: 'Preciso ser membro do Somma para me inscrever?', a: 'Não. A inscrição é aberta a todos. Se quiser a vibe coletiva, te esperamos na arena do Somma antes da largada, com aquecimento e bandeira.' },
    { q: 'Tem categoria PCD e 60+?', a: 'Sim. São 500 vagas reservadas para PCD e 500 para 60+. No formulário, quem é PCD pode escolher o kit Único PCD.' },
    { q: 'Posso transferir minha vaga?', a: 'Sim, transferências podem ser feitas até 12/06/2026 pelo site da Central da Corrida.' },
    { q: 'Como entro para o Somma Club?', a: 'É grátis e rápido. A inscrição é feita pela home do site sommaclub.com.br. A gente se vê no Parque da Cidade todo sábado às 7h.' },
  ]
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-orange-500">FAQ</span>
          <h2 className="text-4xl sm:text-5xl font-black leading-tight mt-3">
            Perguntas <span className="text-orange-500">frequentes</span>
          </h2>
        </div>
        <div className="divide-y divide-zinc-200 bg-zinc-50 rounded-2xl border border-zinc-200">
          {items.map((it, i) => (
            <div key={i}>
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full text-left flex items-center justify-between px-6 py-5 hover:bg-zinc-100 transition" aria-expanded={open === i}>
                <span className="font-semibold text-zinc-900">{it.q}</span>
                <span className={`text-2xl text-orange-500 transition-transform ${open === i ? 'rotate-45' : ''}`}>+</span>
              </button>
              {open === i && <div className="px-6 pb-5 text-zinc-600 text-sm leading-relaxed">{it.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- CTA FINAL ---------- */
function CTAFinal() {
  return (
    <section className="px-4 py-24 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #CCFF00 0%, #a8d600 100%)', color: '#0A0A0A' }}>
      <div aria-hidden className="absolute inset-0 opacity-25" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(255,44,3,0.5), transparent 60%)' }} />
      <div className="relative max-w-3xl mx-auto">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-8">
          A Esplanada vai ser palco de mais um grande evento.<br />E o Somma vai estar lá.
        </h2>
        <a href="#inscricao" className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold transition text-lg">
          Fazer minha inscrição
        </a>
      </div>
    </section>
  )
}
