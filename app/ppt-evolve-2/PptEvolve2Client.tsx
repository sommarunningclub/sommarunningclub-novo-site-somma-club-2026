'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react'
import gsap from 'gsap'
import {
  ArrowLeft, ArrowRight, Maximize, Minimize, Menu, X, PanelLeftClose, PanelLeftOpen, Sun, Moon,
  Users, TrendingUp, Dumbbell, Shirt, ShoppingBag, Tent, Ticket, BadgePercent, Globe, MonitorSmartphone,
  Gauge, Scale, FlaskConical, PartyPopper, Snowflake, Move, Medal, CheckCircle2, type LucideIcon,
} from 'lucide-react'
import { EvolveMap } from '@/components/evolve/evolve-map'

/* ============================================================================
 * Componentes — tema ESCURO editorial (compartilham a mesma linguagem da v1)
 * ========================================================================== */

const O = ({ children }: { children: ReactNode }) => <span className="text-[#FF2C03]">{children}</span>

function Eyebrow({ children }: { children: ReactNode }) {
  return <p data-anim className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#FF2C03] sm:text-xs">{children}</p>
}

function Title({ children }: { children: ReactNode }) {
  return (
    <h2 data-anim className="font-[family-name:var(--font-display)] uppercase leading-[0.95] tracking-tight text-[rgb(var(--fg))] text-[2rem] sm:text-5xl sm:leading-[0.9] lg:text-6xl">
      {children}
    </h2>
  )
}

function Head({ k, title, sub }: { k: string; title: ReactNode; sub?: ReactNode }) {
  return (
    <header className="space-y-3 border-l-2 border-[#FF2C03] pl-4 sm:space-y-4 sm:pl-6">
      <Eyebrow>{k}</Eyebrow>
      <Title>{title}</Title>
      {sub && <p data-anim className="max-w-[60ch] text-[15px] leading-relaxed text-[rgb(var(--fg)_/_0.6)] sm:text-base lg:text-lg">{sub}</p>}
    </header>
  )
}

function Note({ children }: { children: ReactNode }) {
  return <p data-anim className="max-w-[60ch] text-[13px] leading-relaxed text-[rgb(var(--fg)_/_0.5)] sm:text-sm">{children}</p>
}

function Panel({ title, items, variant = 'plain' }: { title: string; items: ReactNode[]; variant?: 'muted' | 'accent' | 'plain' }) {
  const accent = variant === 'accent'
  const muted = variant === 'muted'
  return (
    <div data-anim className={`rounded-2xl p-5 sm:p-6 ${accent ? 'border border-[#FF2C03]/40 bg-[#FF2C03]/[0.10]' : muted ? 'border border-[rgb(var(--fg)_/_0.1)] bg-[rgb(var(--panel)_/_0.03)]' : 'border border-[rgb(var(--fg)_/_0.1)] bg-[rgb(var(--panel)_/_0.05)]'}`}>
      <p className={`text-[11px] font-bold uppercase tracking-[0.2em] ${accent ? 'text-[#FF2C03]' : 'text-[rgb(var(--fg)_/_0.4)]'}`}>{title}</p>
      <ul className="mt-4 space-y-2.5">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2.5 text-[15px] leading-relaxed text-[rgb(var(--fg)_/_0.85)] sm:text-base"><span className="mt-0.5 shrink-0 text-[#FF2C03]">▸</span><span>{it}</span></li>
        ))}
      </ul>
    </div>
  )
}

type Tile = { icon: LucideIcon; t: string; d: string }
function Tiles({ items, cols = 'sm:grid-cols-2 lg:grid-cols-4' }: { items: Tile[]; cols?: string }) {
  return (
    <div className={`grid grid-cols-1 gap-3 sm:gap-3.5 ${cols}`}>
      {items.map(({ icon: Icon, t, d }, i) => (
        <div key={i} data-anim className="rounded-2xl border border-[rgb(var(--fg)_/_0.1)] bg-[rgb(var(--panel)_/_0.04)] p-5 transition-colors duration-200 hover:border-[#FF2C03]/40 hover:bg-[rgb(var(--panel)_/_0.07)]">
          <Icon className="h-6 w-6 text-[#FF2C03]" strokeWidth={2} />
          <h3 className="mt-4 font-[family-name:var(--font-display)] text-base uppercase tracking-tight text-[rgb(var(--fg))]">{t}</h3>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-[rgb(var(--fg)_/_0.6)]">{d}</p>
        </div>
      ))}
    </div>
  )
}

function DataTable({ heads, rows }: { heads: string[]; rows: ReactNode[][] }) {
  return (
    <div data-anim className="overflow-hidden rounded-2xl border border-[rgb(var(--fg)_/_0.1)]">
      <table className="w-full table-fixed border-collapse text-left">
        <thead>
          <tr className="bg-[rgb(var(--panel)_/_0.07)]">
            {heads.map((h, i) => <th key={i} className={`px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] sm:px-5 sm:py-3.5 ${i === 0 ? 'text-[#FF2C03]' : 'text-[rgb(var(--fg)_/_0.6)]'}`}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} className="border-t border-[rgb(var(--fg)_/_0.08)]">
              {r.map((c, ci) => <td key={ci} className={`px-4 py-3 align-top text-[13.5px] leading-snug sm:px-5 sm:py-4 sm:text-sm ${ci === 0 ? 'font-semibold text-[rgb(var(--fg))]' : 'text-[rgb(var(--fg)_/_0.6)]'}`}>{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Chips({ items }: { items: string[] }) {
  return (
    <div data-anim className="flex flex-wrap gap-2 sm:gap-2.5">
      {items.map((c) => (
        <span key={c} className="rounded-full border border-[rgb(var(--fg)_/_0.15)] bg-[rgb(var(--panel)_/_0.05)] px-4 py-2.5 text-[13.5px] font-semibold text-[rgb(var(--fg)_/_0.8)] sm:text-sm">{c}</span>
      ))}
    </div>
  )
}

function LogoImg({ src, alt, h = 'h-7' }: { src: string; alt: string; h?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" className={`logo-adapt ${h} w-auto`} />
}

/** Logo "the simple gym" (wordmark) — herda a cor via currentColor */
function LogoSimpleGym({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1873.711 220.385" className={className} fill="currentColor" role="img" aria-label="the simple gym">
      <g transform="translate(-2111.999 -8324.907)">
        <path d="M3767.947,8360.223q-5.079,14.029-10.153,28.058-10.177,28.277-20.322,56.566-12.657,35.322-25.276,70.658c-2.689,7.521-5.217,15.1-8.183,22.513a5.849,5.849,0,0,1-4.329,2.976c-12.87.237-25.745.144-38.619.136-3.038,0-3.425-1.286-2.386-4.03q6.258-16.534,12.084-33.229a8.908,8.908,0,0,0-.149-5.264c-5.848-18.359-11.828-36.677-17.774-55q-13.229-40.77-26.452-81.541c-1.42-4.383-1-4.957,3.8-4.967,13.005-.027,26.012.1,39.015-.082,3.59-.051,5.013,1.294,5.877,4.671,6.366,24.888,12.916,49.728,19.417,74.58.258.986.617,1.946,1.143,3.587a15.168,15.168,0,0,0,1.553-2.54q10.056-31.031,20.066-62.078c1.658-5.11,3.6-10.129,5.237-15.245.9-2.807,2.94-2.916,5.285-2.914q29.558.032,59.115.011c6.7,0,13.4.1,20.1-.037,3.165-.063,4.659,1.044,4.445,4.328-.152,2.323-.029,4.664-.029,7.685a16.282,16.282,0,0,0,2.689-1.755c9.2-9.854,20.985-12.8,33.924-12.795,14.151,0,26.623,4.136,36.54,14.608,1.522,1.607,2.68,1.559,4.248.018,14.348-14.093,32.129-16.058,50.875-13.853,14.853,1.748,26.688,9.13,35.574,21a51.442,51.442,0,0,1,10.283,30.849c.281,33.291.117,66.585.106,99.879,0,4.717-.319,5-5.271,5.007q-17.538.028-35.075,0c-5.154-.009-5.379-.22-5.381-5.284-.013-28.706.037-57.412-.04-86.117-.018-7.091-1.359-13.792-6.912-19-8.737-8.189-26.01-4.513-30.141,6.732a35.74,35.74,0,0,0-2.223,11.859c-.185,28.7-.1,57.411-.1,86.116,0,5.588-.107,5.688-5.768,5.693-11.692.011-23.386-.113-35.075.066-3.836.06-4.964-1.377-4.95-5.064q.161-42.076.005-84.151c-.031-6.846-.768-13.751-5.455-19.279-4.746-5.6-11.055-7.153-18.152-5.983-7.4,1.22-12.663,5.059-14.55,12.523a38.9,38.9,0,0,0-1.153,9.318c-.087,28.967-.052,57.935-.063,86.9,0,5.571-.1,5.661-5.79,5.667q-17.143.016-34.287,0c-6.391,0-6.4-.01-6.4-6.239q-.006-70.389,0-140.776v-4.677Z" />
        <path d="M3589.489,8441.6c-2.061-.144-3.7-.355-5.338-.357q-27.393-.037-54.786-.021c-5.351,0-5.361-.032-3.989-5.254,2.7-10.269,5.489-20.514,8.061-30.813.731-2.924,2.145-4.1,5.18-4.088,20.626.088,41.293-.74,61.87.271,24.572,1.207,36.611,16.246,33.943,40.813-2.843,26.178-16.823,45.932-38.691,60.032-11.18,7.209-23.9,10.647-37.13,12.161a103.676,103.676,0,0,1-48.425-5.645,93.346,93.346,0,0,1-47.77-38.573,89.188,89.188,0,0,1-14.271-49.156c.3-32.565,14.207-58.509,40.484-77.819a90.575,90.575,0,0,1,41.091-17c31.052-4.487,58.611,2.991,81.509,25.091,3.293,3.179,6.233,6.726,9.289,10.144,1.556,1.739,1.786,3.37-.428,4.93-10.508,7.4-21.039,14.766-31.418,22.343-2.838,2.072-4.317,1.527-6.325-1.1-16.127-21.111-48.029-23.624-68.426-6.409-23,19.41-21.956,57.691-1.679,77.365,16.261,15.778,44.962,18.013,63.337,4.792C3582.889,8458.046,3586.95,8450.648,3589.489,8441.6Z" />
        <path d="M2277.576,8366.134c7.458-2.8,14.2-6.761,21.356-7.769,25.084-3.534,48.041,4.088,61.619,26.842,5.3,8.884,7.518,18.781,7.59,28.953.228,31.973.044,63.949.152,95.924.013,3.733-1.2,5.075-4.989,5.021q-18.316-.261-36.641,0c-3.781.053-5.012-1.272-5-5.014.111-28.567.072-57.136.035-85.7a34,34,0,0,0-.556-6.629c-2.592-12.871-11.389-18.267-22.867-17.365-13.047,1.026-20.667,9.478-20.686,22.241q-.064,43.245-.019,86.49c0,5.878-.037,5.91-5.935,5.914-11.952.009-23.905-.1-35.854.06-3.632.048-4.772-1.292-4.768-4.834q.112-87.275,0-174.552c0-3.595,1.238-4.828,4.817-4.785q18.516.226,37.035,0c3.642-.046,4.83,1.306,4.763,4.845-.17,8.906-.055,17.82-.054,26.731Z" />
        <path d="M2522.05,8487.49c-5.69,7.959-13.329,14.029-21.816,19.084-13.9,8.279-29.217,11.749-45.2,11.526-42.463-.591-75.1-29.06-80.145-70.347-4.1-33.549,9.225-62.172,39.4-80.008,27.5-16.255,66.864-13.337,91.8,6.284,16.723,13.159,26.488,30.572,29.19,51.675a138.244,138.244,0,0,1,.754,19.2c-.072,5.937-.873,6.447-6.723,6.448q-50.435.006-100.871,0c-1.182,0-2.365.039-3.546,0-3.108-.1-4.141.985-2.607,4.007,6.639,13.071,17.456,19.948,31.9,21.084,12.608.99,23.115-3.455,31.475-13.025.641-.734,2.854-1.131,3.565-.619,10.948,7.882,21.767,15.941,32.611,23.967C2521.916,8486.827,2521.911,8487.009,2522.05,8487.49Zm-65.164-65.312v-.136c9.941,0,19.883-.059,29.824.029,4.21.037,5.4-1.268,3.07-4.749-2.936-4.395-6.1-8.9-10.085-12.289-17.625-15.013-46.907-8.549-56.964,12.271-1.81,3.746-1.326,4.795,2.738,4.837C2435.94,8422.251,2446.414,8422.179,2456.886,8422.179Z" />
        <path d="M2145.916,8443.957q0-32.826-.005-65.653c0-5.434-.162-5.594-5.455-5.606-8.011-.02-16.024-.1-24.033.033-3.206.051-4.456-1.143-4.423-4.374q.171-16.512,0-33.022c-.033-3.215,1.172-4.394,4.4-4.387q52.4.1,104.8,0c3.237-.007,4.415,1.2,4.382,4.4q-.17,16.51,0,33.022c.034,3.248-1.242,4.412-4.434,4.361-7.878-.128-15.76-.054-23.64-.032-5.476.016-5.832.354-5.834,5.792q-.015,64.67-.006,129.341c0,7.209,0,7.21-7.41,7.211q-15.957,0-31.914,0c-6.422,0-6.428-.009-6.428-6.61Q2145.914,8476.2,2145.916,8443.957Z" />
        <path d="M2833.135,8372.651c5.151-3.47,9.453-6.919,14.232-9.483,14.144-7.588,43.4-7.044,58.184,9.236,1.276,1.4,2.494,3.275,4.766,1,11.1-11.136,25.014-14.729,40.241-14.841,16.236-.117,30.474,4.744,41.979,16.509a50.945,50.945,0,0,1,14.673,35.9c.442,33.413.108,66.836.222,100.255.014,3.835-1.4,4.979-5.089,4.931q-17.925-.243-35.855.006c-3.871.059-4.929-1.442-4.916-5.095q.155-43.248.02-86.5c-.021-6.944-1.331-13.533-6.712-18.684-8.83-8.451-26.253-4.834-30.364,6.643a39.015,39.015,0,0,0-2.2,12.667c-.188,28.437-.094,56.877-.1,85.314,0,5.42-.153,5.572-5.484,5.58q-17.337.023-34.675,0c-5.416-.007-5.569-.15-5.571-5.492-.011-27.914.066-55.829-.059-83.743-.03-6.708-.759-13.474-5.27-18.943-4.779-5.8-11.212-7.357-18.421-6.2-7.6,1.218-12.8,5.3-14.588,12.956a40.09,40.09,0,0,0-1.035,8.941c-.077,28.963-.045,57.926-.057,86.889,0,5.437-.149,5.588-5.466,5.594-12.083.016-24.168-.09-36.25.062-3.58.045-4.826-1.191-4.82-4.785q.122-72.734,0-145.468c-.006-3.578,1.208-4.854,4.8-4.8q16.547.239,33.1,0c3.632-.053,5.038,1.292,4.748,4.843C2832.99,8368.108,2833.135,8370.3,2833.135,8372.651Z" />
        <path d="M3067.094,8508.1c-.253,2.186-.564,3.667-.572,5.15-.047,9.042-.13,18.086.026,27.126.06,3.477-1.022,4.955-4.716,4.907q-18.122-.236-36.247.008c-3.9.059-4.9-1.515-4.885-5.132q.137-52.288.053-104.574,0-34.4.005-68.8c0-5.54.095-5.621,5.83-5.626q15.957-.016,31.915,0c5.459.007,5.565.141,5.637,5.445.02,1.5.134,3.006.246,5.371,2.393-1.66,4.028-2.848,5.714-3.957,13.914-9.15,29.465-10.827,45.406-8.869,24.991,3.067,44.22,15.559,57.229,37.188a77.95,77.95,0,0,1,10.387,31.48,89.208,89.208,0,0,1-2.394,33.458c-5.269,20.036-16.586,35.875-34.306,46.6-20.447,12.376-42.4,14.458-65.164,7.279-3.2-1.009-6.116-2.911-9.151-4.425C3070.633,8510,3069.188,8509.2,3067.094,8508.1Zm33.439-107.646c-18.639-1.371-37.472,14.218-37.368,36.9.1,22.481,15.466,38.737,36.789,38.538,21.876-.205,37.137-15.4,37.294-37.818C3137.4,8416.739,3122.141,8399.842,3100.533,8400.452Z" />
        <path d="M3348.819,8452.409q-26.006,0-52.01.011c-5.07.007-5.578.926-3.242,5.532,10.1,19.926,39.464,26.15,56.759,12.033,1.421-1.16,3.283-2.064,4.165-3.547,2.432-4.087,4.75-3.14,7.879-.781q13.509,10.184,27.352,19.925c2.933,2.066,2.978,3.441.55,6.073-15.023,16.285-33.538,25.049-55.6,26.983-25.686,2.253-48.348-4.62-66.512-22.936-20.985-21.159-27.872-47.11-21.276-75.976,6.221-27.222,22.938-46.274,49.318-55.834,26.645-9.655,52.647-7.339,76.454,8.4,18.658,12.333,29.451,30.338,32.716,52.441,1.059,7.168.805,14.551.849,21.837.034,5.678-.317,5.833-6.174,5.836Q3374.431,8452.42,3348.819,8452.409Zm12.87-29.789c-5.124-16.039-20.657-26.277-39.845-24.354-15.285,1.533-27.123,12.658-29.8,24.759C3315.126,8422.929,3338.131,8423.68,3361.689,8422.62Z" />
        <path d="M2613.145,8457.117c6.569,0,13.139.048,19.707-.024,2.522-.026,3.507.925,4.175,3.5,1.037,4,2.315,8.2,4.606,11.559,5.282,7.743,16.932,9.752,25.047,4.936,8.058-4.781,9.26-18.54,1.329-23.839-5.761-3.849-12.571-6.453-19.25-8.539-10.264-3.206-20.789-5.485-30.319-10.8-15.708-8.767-25.22-21.634-27.367-39.685a59.264,59.264,0,0,1,4.9-32.556c6.588-14.227,17.608-23.745,32.337-28.646a78.925,78.925,0,0,1,48.838-.806c20.452,6.226,33.16,19.928,38.417,40.5a136.047,136.047,0,0,1,2.421,13.51c.415,2.768-.919,4.071-3.829,4.058q-18.918-.1-37.836.016c-2.821.022-3.824-1.247-4.451-3.809a41.728,41.728,0,0,0-3.425-9.957c-3.741-6.906-11.8-9.5-20.172-6.985-7.416,2.228-11.112,7.447-10.615,14.972.428,6.477,4.468,10.315,10.015,12.422,7.474,2.837,15.121,5.257,22.788,7.539,14.375,4.278,27.285,10.971,37.233,22.415,11.88,13.667,14.984,29.659,11.6,47.1-4.193,21.622-17.2,35.5-38.137,41.791a82.1,82.1,0,0,1-53.049-1.446c-20.813-7.7-32.646-23.4-36.822-44.978-.546-2.82-.594-5.736-1.16-8.551-.587-2.919.617-3.757,3.31-3.725C2600.007,8457.167,2606.576,8457.116,2613.145,8457.117Z" />
        <path d="M3237.536,8424.055q0,43.242,0,86.484c0,5.41-.144,5.549-5.5,5.556-12.082.015-24.166-.091-36.246.062-3.6.045-4.806-1.225-4.8-4.8q.114-87.27,0-174.539c0-3.543,1.14-4.878,4.769-4.832,12.212.153,24.426.043,36.64.064,4.877.008,5.134.257,5.136,5.129Q3237.55,8380.616,3237.536,8424.055Z" />
        <path d="M2730.633,8367.682c0-5.734.289-6.068,5.122-6.08,11.952-.027,23.905.1,35.854-.074,3.581-.053,4.827,1.424,4.82,5.648-.086,47.541-.085,95.757,0,143.3.007,4.188-1.165,5.737-4.783,5.683-11.95-.183-23.9-.05-35.854-.076-4.885-.011-5.154-.318-5.159-6.026C2730.615,8486.438,2730.633,8367.682,2730.633,8367.682Z" />
      </g>
    </svg>
  )
}

/** Logo "On" (running) — herda a cor via currentColor */
function LogoOn({ className }: { className?: string }) {
  return (
    <svg viewBox="11 4 31 45" className={className} fill="currentColor" role="img" aria-label="On">
      <path d="M36.281 11.384c-.056.058-.114.13-.17.188l-2.364 2.41-.057.058c-.057.072-.057.145.014.247a8.331 8.331 0 0 1 1.096 3.309c.257 2.409-.342 4.571-1.822 6.473-1.268 1.625-2.92 2.64-4.899 3.09-.911.204-1.837.218-2.762.117-1.524-.16-2.891-.726-4.116-1.655-1.766-1.335-2.862-3.105-3.318-5.311-.17-.813-.199-1.64-.128-2.453.171-1.901.883-3.585 2.15-5.022 1.21-1.379 2.692-2.278 4.443-2.685a8.03 8.03 0 0 1 2.635-.189 8.5 8.5 0 0 1 3.588 1.147c.142.087.2.029.285-.058l2.35-2.395c.056-.058.113-.13.185-.217l2.889 2.945.001.001Zm-5.342 7.4c.071-2.8-2.093-4.832-4.529-4.905-2.748-.073-4.798 2.25-4.798 4.76 0 2.57 2.122 4.79 4.67 4.746 2.507.03 4.6-2.076 4.656-4.6Zm3.605 19.391c.014 2.351 0 4.717 0 7.068v.32h-4.13v-.29c0-2.468.015-4.935 0-7.403 0-1.291-.44-2.423-1.366-3.323a3.827 3.827 0 0 0-2.208-1.06c-1.11-.16-2.121.117-3.018.799-.898.696-1.424 1.64-1.595 2.757-.086.537-.1 1.089-.1 1.64-.014 2.192 0 4.369 0 6.56v.305h-4.101v-.276c0-2.656-.029-5.326.014-7.982.029-1.408.47-2.743 1.196-3.962 1.21-2.032 2.934-3.338 5.198-3.875a8.414 8.414 0 0 1 2.178-.203c2.265.101 4.201 1.015 5.74 2.742 1.096 1.248 1.794 2.7 2.036 4.369.098.608.155 1.217.155 1.812" />
    </svg>
  )
}

/** Botão que navega para outro slide da apresentação (via evento do shell) */
function GoButton({ to, children }: { to: string; children: ReactNode }) {
  return (
    <button
      data-anim
      onClick={() => window.dispatchEvent(new CustomEvent('ppt-go-section', { detail: to }))}
      className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#FF2C03] px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-black transition-colors duration-200 hover:bg-[#ff4a28]"
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
    </button>
  )
}

function SlideImg({ src, alt, ratio = 'aspect-[4/3]', position = 'object-center' }: { src: string; alt: string; ratio?: string; position?: string }) {
  return (
    <div data-anim className={`group relative overflow-hidden rounded-2xl border border-[rgb(var(--fg)_/_0.1)] bg-[rgb(var(--panel)_/_0.04)] ${ratio}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" className={`h-full w-full object-cover ${position} transition-transform duration-500 group-hover:scale-[1.03]`} />
    </div>
  )
}

/** Divisor de capítulo */
function Divider({ num, chapter, title }: { num: string; chapter: string; title: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col justify-center">
      <p data-anim className="font-[family-name:var(--font-display)] text-7xl leading-none tracking-tight text-[#FF2C03] sm:text-9xl">{num}</p>
      <p data-anim className="mt-4 text-[11px] font-bold uppercase tracking-[0.32em] text-[rgb(var(--fg)_/_0.4)] sm:text-xs">{chapter}</p>
      <h2 data-anim className="mt-3 max-w-4xl font-[family-name:var(--font-display)] uppercase leading-[0.92] tracking-tight text-[rgb(var(--fg))] text-4xl sm:text-6xl lg:text-7xl">{title}</h2>
    </div>
  )
}

/** Frase de impacto, centralizada */
function Statement({ kicker, children, sub }: { kicker?: string; children: ReactNode; sub?: ReactNode }) {
  return (
    <div>
      {kicker && <Eyebrow>{kicker}</Eyebrow>}
      <h2 data-anim className="mt-5 font-[family-name:var(--font-display)] uppercase leading-[1] tracking-tight text-[rgb(var(--fg))] text-[1.75rem] sm:text-5xl sm:leading-[0.96] lg:text-[3.4rem]">{children}</h2>
      {sub && <p data-anim className="mx-auto mt-7 max-w-[55ch] text-[15px] font-medium leading-relaxed text-[rgb(var(--fg)_/_0.6)] sm:text-lg">{sub}</p>}
    </div>
  )
}

/** Arquitetura de marca em 3 camadas empilhadas */
function BrandStack() {
  const layers = [
    { icon: Users, t: 'Somma Club', d: 'A comunidade. A marca-mãe, preservada.', tone: 'plain' as const },
    { icon: TrendingUp, t: 'Assessoria Somma Club', d: 'A vertical de treino e performance.', tone: 'plain' as const },
    { icon: Dumbbell, t: 'Evolve+', d: 'Academia oficial e parceira de performance da assessoria.', tone: 'accent' as const },
  ]
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-2">
      {layers.map(({ icon: Icon, t, d, tone }, i) => {
        const accent = tone === 'accent'
        return (
          <div key={t}>
            <div data-anim className={`flex items-center gap-4 rounded-2xl p-5 sm:gap-5 sm:p-6 ${accent ? 'border-2 border-[#FF2C03] bg-[#FF2C03]/[0.10]' : 'border border-[rgb(var(--fg)_/_0.12)] bg-[rgb(var(--panel)_/_0.04)]'}`}>
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${accent ? 'bg-[#FF2C03] text-black' : 'bg-[rgb(var(--panel)_/_0.08)] text-[#FF2C03]'}`}>
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="font-[family-name:var(--font-display)] text-lg uppercase tracking-tight text-[rgb(var(--fg))] sm:text-xl">{t}</p>
                <p className="mt-0.5 text-[13.5px] leading-relaxed text-[rgb(var(--fg)_/_0.6)] sm:text-sm">{d}</p>
              </div>
            </div>
            {i < layers.length - 1 && <div className="flex justify-center py-1 text-[rgb(var(--fg)_/_0.3)]">↓</div>}
          </div>
        )
      })}
    </div>
  )
}

/* ============================================================================
 * Slides
 * ========================================================================== */

type Slide = { section: string; node: ReactNode; center?: boolean; bg?: string }

const SLIDES: Slide[] = [
  // 1 — Capa
  { section: 'Capa', center: true, bg: '/evolve2-capa.jpg', node: (
    <div>
      <div data-anim className="mb-8 flex items-center gap-4 sm:gap-6">
        <LogoImg src="/Logo_Nova_Somma_Branca_Laranja.svg" alt="Somma Club" h="h-10 sm:h-14" />
        <span className="text-2xl font-light text-[rgb(var(--fg)_/_0.25)]">×</span>
        <LogoImg src="/Evolve+_ElementoPrincipal_Branca.png" alt="Evolve+" h="h-12 sm:h-16" />
      </div>
      <h1 data-anim className="font-[family-name:var(--font-display)] uppercase leading-[0.86] tracking-tight text-[rgb(var(--fg))] text-[2.4rem] sm:text-6xl lg:text-[5.4rem]">
        Assessoria Somma Club<br /><span className="text-[#FF2C03]">powered by Evolve+</span>
      </h1>
      <p data-anim className="mt-6 text-sm font-bold uppercase tracking-[0.25em] text-[rgb(var(--fg)_/_0.55)]">Proposta de Naming Rights · 12 meses</p>
      <p data-anim className="mt-4 max-w-xl text-base font-medium leading-snug text-[rgb(var(--fg)_/_0.6)] sm:text-lg">
        A Evolve+ como academia oficial da principal assessoria esportiva do ecossistema Somma.
      </p>
    </div>
  ) },

  // 2 — A virada de posicionamento
  { section: 'A virada', center: true, node: (
    <Statement kicker="O novo posicionamento" sub="O running club é aberto a todos. Mas a experiência Evolve+ × Somma — treino, estrutura e comunidade — é exclusiva de quem está na assessoria. Um espaço só de quem está dentro.">
      A Evolve+ não está patrocinando um running club.<br /><O>Agora ela tem uma assessoria pra chamar de sua.</O>
    </Statement>
  ) },

  // 3 — Benchmark
  { section: 'O benchmark', node: (<>
    <Head k="A referência" title="O modelo que já existe" sub="Uma marca de performance se associando a uma assessoria com identidade própria, que também é comunidade." />
    <div data-anim className="flex items-center justify-center gap-6 rounded-2xl border border-[rgb(var(--fg)_/_0.1)] bg-[rgb(var(--panel)_/_0.04)] px-6 py-8 text-[rgb(var(--fg))] sm:gap-10 sm:py-10">
      <LogoSimpleGym className="h-4 w-auto sm:h-6" />
      <span className="text-2xl font-light text-[rgb(var(--fg)_/_0.25)]">×</span>
      <LogoOn className="h-9 w-auto sm:h-12" />
    </div>
    <DataTable heads={['A referência', 'A nossa parceria']} rows={[
      ['the simple gym (academia)', 'Evolve+ (academia ticket alto)'],
      ['On (marca de corrida)', 'Somma Club (comunidade de corrida)'],
      ['= run club + assessoria oficial', '= Assessoria Somma Club powered by Evolve+'],
      ['Nem premium, nem low cost', 'Nem premium, nem low cost'],
    ]} />
    <Note>Mesmo conceito, território próprio: o Distrito Federal.</Note>
  </>) },

  // 4 — Arquitetura de marca
  { section: 'Arquitetura de marca', node: (<>
    <Head k="Como a marca se organiza" title="Três camadas, uma só experiência" sub="A marca Somma é preservada. A Evolve+ entra como academia oficial da vertical de assessoria." />
    <BrandStack />
  </>) },

  // 5 — Naming rights, o conceito
  { section: 'Naming rights', center: true, node: (
    <div>
      <Eyebrow>O conceito · 12 meses</Eyebrow>
      <p data-anim className="mt-5 font-[family-name:var(--font-display)] uppercase leading-[0.9] tracking-tight text-[rgb(var(--fg))] text-3xl sm:text-5xl lg:text-[4.2rem]">
        Assessoria Somma Club<br /><span className="text-[#FF2C03]">powered by Evolve+</span>
      </p>
      <p data-anim className="mt-6 text-sm font-bold uppercase tracking-[0.25em] text-[rgb(var(--fg)_/_0.6)]">Evolve+ · Academia oficial da Assessoria Somma Club</p>
      <p data-anim className="mt-4 text-base font-medium text-[rgb(var(--fg)_/_0.55)]">Preserva a marca Somma e adiciona a associação estratégica com a Evolve+.</p>
    </div>
  ) },

  // 6 — Exclusividade
  { section: 'Exclusividade', center: true, node: (
    <Statement kicker="O território" sub="Nenhuma concorrente terá acesso ao território construído pela comunidade e pela assessoria.">
      A Evolve+ será a <O>única</O> academia oficial integrada à assessoria do Somma.
    </Statement>
  ) },

  // — Capítulo: Entregáveis
  { section: '— Entregáveis', center: true, node: <Divider num="·" chapter="A proposta executiva" title="Os entregáveis do naming rights" /> },

  // 7 — Marca & identidade
  { section: '1 · Marca & identidade', node: (<>
    <Head k="Entregável 1" title="Marca & identidade visual" sub='Logo "powered by Evolve+" em cada ponto de contato da assessoria.' />
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5">
      <SlideImg src="/evolve2-marca-1.png" alt="Aplicação da marca Evolve+ na identidade da assessoria" ratio="aspect-square" />
      <SlideImg src="/evolve2-marca-2.png" alt="Uniformes e materiais com a marca powered by Evolve+" ratio="aspect-square" />
    </div>
    <Tiles cols="sm:grid-cols-2 lg:grid-cols-4" items={[
      { icon: Shirt, t: 'Uniformes', d: 'treino, eventos, staff e insiders.' },
      { icon: ShoppingBag, t: 'Kits físicos', d: 'ecobags e materiais do aluno.' },
      { icon: Medal, t: 'Credenciais', d: 'identidade nos eventos da assessoria.' },
      { icon: Globe, t: 'Backdrops', d: 'presença de marca nas ativações.' },
    ]} />
  </>) },

  // 8 — Experiência presencial
  { section: '2 · Experiência presencial', node: (<>
    <Head k="Entregável 2" title="Experiência presencial" sub="Estrutura física dedicada à parceria nos encontros e provas." />
    <div className="grid gap-3 sm:gap-3.5 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch">
      <SlideImg src="/evolve2-experiencia.png" alt="Tenda e ativação presencial Assessoria Somma Club × Evolve+" ratio="aspect-[3/4] lg:aspect-auto lg:min-h-full" />
      <div className="grid content-start gap-3 sm:grid-cols-2 sm:gap-3.5 lg:grid-cols-1">
        <Panel variant="accent" title="Tenda oficial" items={['Assessoria Somma Club × Evolve+', 'Estrutura dedicada nos encontros', 'Experiência premium para o aluno']} />
        <Panel variant="muted" title="Nova tenda Evolve+" items={['Produção e personalização pela Evolve', 'Uso em eventos, provas e ativações']} />
      </div>
    </div>
  </>) },

  // 9 — Benefícios comerciais
  { section: '3 · Benefícios comerciais', node: (<>
    <Head k="Entregável 3" title="Benefícios comerciais" sub="Vantagem de mão dupla: a base da Evolve+ vira aluno da assessoria, e o aluno da assessoria vira aluno da Evolve+." />
    <div className="grid gap-3 sm:grid-cols-2">
      <Panel variant="plain" title="Para o aluno Evolve+" items={[<><BadgePercent className="mr-1 inline h-4 w-4 text-[#FF2C03]" />Mensalidade mais barata na assessoria</>, 'Condição especial de matrícula']} />
      <Panel variant="plain" title="Para o aluno da assessoria" items={[<><Ticket className="mr-1 inline h-4 w-4 text-[#FF2C03]" />Bolsa de 3 meses na Evolve+</>, 'Plano especial após o período inicial']} />
    </div>
  </>) },

  // 10 — Digital & aquisição
  { section: '4 · Digital & aquisição', node: (<>
    <Head k="Entregável 4" title="Digital & aquisição" sub="Site próprio da assessoria e entrada no ecossistema digital da Evolve." />
    <Tiles cols="sm:grid-cols-2" items={[
      { icon: MonitorSmartphone, t: 'Novo site da assessoria', d: '"Assessoria Somma Club powered by Evolve+", com captação integrada.' },
      { icon: Globe, t: 'Portal Evolve', d: 'A assessoria figura como "Assessoria de Corrida Oficial" da Evolve+.' },
    ]} />
  </>) },

  // 11 — Performance & saúde
  { section: '5 · Performance & saúde', node: (<>
    <Head k="Entregável 5" title="Performance & saúde" sub="Tecnologia e dados para treinar a base da assessoria em escala." />
    <Tiles cols="sm:grid-cols-2 lg:grid-cols-3" items={[
      { icon: Gauge, t: 'Treinamento exclusivo', d: 'sistema que identifica o perfil do aluno.' },
      { icon: FlaskConical, t: 'Segmentação', d: 'por objetivo, nível e frequência — aplicada em massa.' },
      { icon: Scale, t: 'Balança de bioimpedância', d: 'cedida pela Evolve para avaliações da comunidade.' },
    ]} />
  </>) },

  // 12 — Eventos & comunidade
  { section: '6 · Eventos & comunidade', node: (<>
    <Head k="Entregável 6" title="Eventos & comunidade" sub="Experiências proprietárias exclusivas para a base da assessoria e da Evolve+." />
    <Tiles cols="sm:grid-cols-2 lg:grid-cols-4" items={[
      { icon: PartyPopper, t: 'Eventos exclusivos', d: 'treinos fechados e encontros premium.' },
      { icon: Snowflake, t: 'Recovery days', d: 'recuperação e bem-estar.' },
      { icon: Move, t: 'Mobility days', d: 'mobilidade e prevenção.' },
      { icon: Medal, t: 'Provas exclusivas', d: 'desafios e ações proprietárias.' },
    ]} />
  </>) },

  // 13 — Mapa: academia oficial em todo o DF
  { section: 'Evolve+ no DF', node: (<>
    <Head k="Capilaridade" title="Academia oficial em todo o DF" sub="A assessoria leva a Evolve+ como academia oficial para todas as regiões onde a marca está." />
    <EvolveMap />
  </>) },

  // 14 — Quem entrega o quê
  { section: 'Quem entrega o quê', node: (<>
    <Head k="Arquitetura da parceria" title="Quem entrega o quê" sub="Papéis claros entre Somma e Evolve+." />
    <DataTable heads={['Ativo', 'Responsável']} rows={[
      ['Comunidade Somma', 'Somma Club'],
      ['Operação da assessoria', 'Somma Club'],
      ['Academia oficial', 'Evolve+'],
      ['Branding compartilhado', 'Somma + Evolve+'],
      ['Eventos exclusivos', 'Somma + Evolve+'],
      ['Benefícios comerciais', 'Somma + Evolve+'],
      ['Portal e captação digital', 'Evolve+ + Somma'],
    ]} />
  </>) },

  // 15 — Investimento (mesmos planos da v1)
  { section: 'Proposta de investimento', node: (<>
    <Head k="Investimento" title="Proposta de investimento" sub="Dois níveis de parceria, ambos com exclusividade. O Growth é o ponto de equilíbrio entre alcance e ativação." />
    <div className="mx-auto grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2">
      {[
        { name: 'Growth', price: 'R$ 15k', d: 'Mais alcance, conteúdo e eventos.', feats: ['Logo nos ativos oficiais (camisetas, faixas e banners)', 'Presença nos 52 encontros do ano', 'Somma Creators (rede de criadores ativando a marca)', '4 inserções digitais por mês + 1 reels colaborativo', 'Experiências Evolve exclusivas para a comunidade', 'Somma Intercity: 1 night run por trimestre saindo da unidade', 'Co-branding em 1 evento proprietário por trimestre'], hot: true },
        { name: 'Performance', price: 'R$ 20k', d: 'Parceria completa e exclusiva.', feats: ['Tudo do plano Growth', 'Programa de Bolsas (atletas patrocinados pela Evolve)', 'Exclusividade total na categoria academia', 'Naming em 1 evento proprietário por ano', 'Série de conteúdo dedicada (1 por mês) + relatório de resultados', 'Presença de marca em todas as unidades Evolve mapeadas'], hot: false },
      ].map((p) => (
        <div key={p.name} data-anim className={`flex flex-col rounded-2xl p-6 sm:p-7 ${p.hot ? 'border-2 border-[#FF2C03] bg-[#FF2C03]/[0.10]' : 'border border-[rgb(var(--fg)_/_0.1)] bg-[rgb(var(--panel)_/_0.04)]'}`} style={p.hot ? { animation: 'glowPulse 3s ease-in-out infinite' } : undefined}>
          {p.hot && <span className="mb-3 inline-block self-start rounded-full bg-[#FF2C03] px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-black">Recomendado</span>}
          <p className="text-[11px] font-bold uppercase tracking-widest text-[rgb(var(--fg)_/_0.4)]">Plano</p>
          <p className="mt-1 font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight text-[rgb(var(--fg))]">{p.name}</p>
          <p className="mt-3 font-[family-name:var(--font-display)] text-[2.75rem] leading-none tracking-tight text-[#FF2C03]">{p.price}<span className="text-base text-[rgb(var(--fg)_/_0.4)]">/mês</span></p>
          <p className="mt-3 text-sm leading-relaxed text-[rgb(var(--fg)_/_0.6)]">{p.d}</p>
          <ul className="mt-5 space-y-2.5 border-t border-[rgb(var(--fg)_/_0.08)] pt-5">
            {p.feats.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-[rgb(var(--fg)_/_0.82)]"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#FF2C03]" />{f}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <Note>Contrato mínimo de 12 meses. Valores e escopos podem ser ajustados conforme a parceria.</Note>
  </>) },

  // 16 — Fecho
  { section: 'Fecho', center: true, node: (
    <div className="text-center">
      <h2 data-anim className="font-[family-name:var(--font-display)] uppercase leading-[0.95] tracking-tight text-[rgb(var(--fg))] text-3xl sm:text-5xl lg:text-[3.6rem]">
        Performance, comunidade e lifestyle<br /><O>em uma única experiência.</O>
      </h2>
      <div data-anim className="mx-auto mt-9 flex items-center justify-center gap-4 sm:gap-6">
        <LogoImg src="/Logo_Nova_Somma_Branca_Laranja.svg" alt="Somma Club" h="h-8 sm:h-11" />
        <span className="text-xl font-light text-[rgb(var(--fg)_/_0.3)]">×</span>
        <LogoImg src="/Evolve+_ElementoPrincipal_Branca.png" alt="Evolve+" h="h-10 sm:h-12" />
      </div>
      <p data-anim className="mx-auto mt-6 max-w-xl text-base font-medium text-[rgb(var(--fg)_/_0.6)] sm:text-lg">
        Assessoria Somma Club powered by Evolve+.
      </p>
      <div data-anim className="mt-9 flex justify-center">
        <GoButton to="Estação Somma">Conheça a Estação Somma</GoButton>
      </div>
    </div>
  ) },

  // 17 — Estação Somma
  { section: 'Estação Somma', node: (<>
    <Head k="O próximo passo" title="Estação Somma" sub="A casa física da comunidade. O ponto onde a parceria Evolve+ × Somma ganha vida em Brasília." />
    <SlideImg src="/evolve2-estacao.png" alt="Estação Somma — espaço físico da comunidade" ratio="aspect-[3/2]" />
    <div className="grid gap-3 sm:grid-cols-2 sm:gap-3.5">
      <Panel variant="plain" title="O que é" items={['Estrutura física para um movimento que já existe', 'Experiências, ativações e teste de produtos em uso real', 'O ponto de encontro da comunidade no DF']} />
      <Panel variant="accent" title="Para a parceria" items={['Presença de marca Evolve+ no espaço', 'Base para ações exclusivas da assessoria', 'A próxima fase: do movimento à infraestrutura']} />
    </div>
    <div data-anim className="flex flex-wrap items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <a href="/estacao-somma-club" target="_blank" rel="noopener noreferrer" className="group inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#FF2C03]/50 px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-[#FF2C03] transition-colors duration-200 hover:bg-[#FF2C03]/10">
        Ver o projeto completo
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      </a>
    </div>
  </>) },
]

/* ============================================================================
 * Shell — barra lateral de índice + palco escuro
 * ========================================================================== */

export function PptEvolve2Client() {
  const [active, setActive] = useState(0)
  const [menu, setMenu] = useState(false)
  const [fs, setFs] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const stageRef = useRef<HTMLDivElement>(null)
  const touch = useRef<{ x: number; y: number } | null>(null)
  const navRefs = useRef<(HTMLButtonElement | null)[]>([])
  const total = SLIDES.length

  const go = useCallback((n: number) => setActive(Math.min(Math.max(n, 0), total - 1)), [total])
  const next = useCallback(() => setActive((a) => Math.min(a + 1, total - 1)), [total])
  const prev = useCallback(() => setActive((a) => Math.max(a - 1, 0)), [])

  const toggleFs = useCallback(() => {
    if (typeof document === 'undefined') return
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {})
    else document.exitFullscreen?.().catch(() => {})
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const nt = t === 'dark' ? 'light' : 'dark'
      try { localStorage.setItem('evolve-theme', nt) } catch {}
      return nt
    })
  }, [])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('evolve-theme')
      if (saved === 'light' || saved === 'dark') setTheme(saved)
    } catch {}
  }, [])

  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const targets = el.querySelectorAll('[data-anim]')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(targets, { opacity: 1, x: 0, y: 0 })
      return
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(targets, { opacity: 0, x: -26 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out', stagger: 0.05 })
    }, el)
    return () => ctx.revert()
  }, [active])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (menu && e.key === 'Escape') return setMenu(false)
      if (['ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); next() }
      else if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); prev() }
      else if (e.key === 'Home') go(0)
      else if (e.key === 'End') go(total - 1)
      else if (e.key === 'f' || e.key === 'F') toggleFs()
      else if (e.key === 'm' || e.key === 'M') setMenu((v) => !v)
      else if (e.key === 't' || e.key === 'T') toggleTheme()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, go, toggleFs, toggleTheme, total, menu])

  useEffect(() => {
    const onFs = () => setFs(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  useEffect(() => {
    const onGoSection = (e: Event) => {
      const sec = (e as CustomEvent).detail as string
      const idx = SLIDES.findIndex((s) => s.section === sec)
      if (idx >= 0) go(idx)
    }
    window.addEventListener('ppt-go-section', onGoSection as EventListener)
    return () => window.removeEventListener('ppt-go-section', onGoSection as EventListener)
  }, [go])

  useEffect(() => {
    navRefs.current[active]?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const onTouchStart = (e: React.TouchEvent) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY } }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current) return
    const dx = e.changedTouches[0].clientX - touch.current.x
    const dy = e.changedTouches[0].clientY - touch.current.y
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) { dx < 0 ? next() : prev() }
    touch.current = null
  }

  const slide = SLIDES[active]

  const NavList = ({ onPick }: { onPick?: () => void }) => (
    <nav className="flex flex-col gap-0.5">
      {SLIDES.map((s, i) => (
        <button
          key={i}
          ref={(el) => { navRefs.current[i] = el }}
          onClick={() => { go(i); onPick?.() }}
          className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[12.5px] transition-colors duration-200 ${
            i === active ? 'bg-[#FF2C03]/15 font-semibold text-[#FF2C03]' : 'text-[rgb(var(--fg)_/_0.55)] hover:bg-[rgb(var(--panel)_/_0.05)] hover:text-[rgb(var(--fg))]'
          }`}
        >
          <span className="w-5 shrink-0 text-right text-[10px] tabular-nums text-[rgb(var(--fg)_/_0.3)]">{String(i + 1).padStart(2, '0')}</span>
          <span className="truncate">{s.section}</span>
        </button>
      ))}
    </nav>
  )

  const themeVars = (theme === 'dark'
    ? { '--bg': '#0A0A0A', '--fg': '255 255 255', '--panel': '255 255 255', '--badge': '#161616' }
    : { '--bg': '#ffffff', '--fg': '23 23 23', '--panel': '15 15 15', '--badge': '#f1f1f1' }) as CSSProperties

  return (
    <main style={themeVars} data-theme={theme} className="fixed inset-0 flex overflow-hidden overscroll-none bg-[var(--bg)] font-[family-name:var(--font-body)] text-[rgb(var(--fg))] [-webkit-tap-highlight-color:transparent] select-none">
      <style>{`
        [data-theme="light"] .logo-adapt { filter: brightness(0); }
        @keyframes glowPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(255,44,3,0) } 50% { box-shadow: 0 0 0 5px rgba(255,44,3,.35) } }
        @media (prefers-reduced-motion: reduce) { [style*="animation"] { animation: none !important } }
      `}</style>

      <aside className={`hidden w-60 shrink-0 flex-col border-r border-[rgb(var(--fg)_/_0.1)] ${collapsed ? 'lg:hidden' : 'lg:flex'}`}>
        <div className="flex items-center justify-between gap-2 px-5 py-5">
          <span className="font-[family-name:var(--font-display)] text-base uppercase tracking-tight text-[rgb(var(--fg))]">SOMMA <span className="text-[#FF2C03]">× Evolve+</span></span>
          <button onClick={() => setCollapsed(true)} className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[rgb(var(--fg)_/_0.5)] transition-colors duration-200 hover:bg-[rgb(var(--panel)_/_0.1)] hover:text-[#FF2C03]" aria-label="Recolher menu">
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-4"><NavList /></div>
        <div className="h-1 bg-[rgb(var(--panel)_/_0.05)]">
          <div className="h-full bg-[#FF2C03] transition-[width] duration-500" style={{ width: `${((active + 1) / total) * 100}%` }} />
        </div>
      </aside>

      {collapsed && (
        <button onClick={() => setCollapsed(false)} className="absolute left-3 top-3 z-30 hidden h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[rgb(var(--fg)_/_0.15)] bg-[var(--bg)] text-[rgb(var(--fg)_/_0.7)] transition-colors duration-200 hover:border-[#FF2C03]/40 hover:text-[#FF2C03] lg:flex" aria-label="Expandir menu">
          <PanelLeftOpen className="h-4 w-4" />
        </button>
      )}

      <section className="relative flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-[rgb(var(--fg)_/_0.1)] px-4 pt-[max(0.7rem,env(safe-area-inset-top))] pb-2 lg:hidden">
          <span className="font-[family-name:var(--font-display)] text-base uppercase tracking-tight">SOMMA <span className="text-[#FF2C03]">× Evolve+</span></span>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold tabular-nums text-[rgb(var(--fg)_/_0.45)]">{String(active + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
            <button onClick={() => setMenu(true)} className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[rgb(var(--fg)_/_0.15)] active:bg-[rgb(var(--panel)_/_0.1)]" aria-label="Índice"><Menu className="h-[18px] w-[18px]" /></button>
          </div>
        </div>
        <div className="h-0.5 bg-[rgb(var(--panel)_/_0.1)] lg:hidden">
          <div className="h-full bg-[#FF2C03] transition-[width] duration-500" style={{ width: `${((active + 1) / total) * 100}%` }} />
        </div>

        {!slide.center && (
          <span className="pointer-events-none absolute right-4 top-2 z-0 select-none font-[family-name:var(--font-display)] text-[7rem] leading-none text-[rgb(var(--fg)_/_0.03)] sm:right-10 sm:text-[12rem]">
            {String(active + 1).padStart(2, '0')}
          </span>
        )}

        <div key={active} ref={stageRef} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} className="relative z-10 h-full overflow-y-auto overscroll-contain px-5 pb-28 pt-8 sm:px-14 sm:pb-24 sm:pt-12 lg:px-20">
          {slide.bg && (
            <div className="pointer-events-none absolute inset-0 z-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={slide.bg} alt="" className="h-full w-full object-cover object-[center_25%] sm:object-[right_center]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/85 to-[var(--bg)]/40 sm:bg-gradient-to-r sm:from-[var(--bg)] sm:via-[var(--bg)]/80 sm:to-[var(--bg)]/10" />
            </div>
          )}
          <div className="relative z-10 mx-auto flex min-h-full max-w-4xl flex-col justify-center gap-6 sm:gap-8">{slide.node}</div>
        </div>

        <div className="absolute bottom-0 right-0 z-20 flex items-center gap-2 px-4 pb-[max(0.9rem,env(safe-area-inset-bottom))] sm:px-8">
          <button onClick={toggleTheme} className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[rgb(var(--fg)_/_0.15)] bg-[var(--bg)]/70 text-[rgb(var(--fg)_/_0.7)] backdrop-blur transition-colors duration-200 hover:border-[#FF2C03]/40 hover:text-[#FF2C03]" aria-label="Alternar tema claro/escuro" title="Tema (T)">
            {theme === 'dark' ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
          </button>
          <button onClick={toggleFs} className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[rgb(var(--fg)_/_0.15)] bg-[var(--bg)]/70 text-[rgb(var(--fg)_/_0.7)] backdrop-blur transition-colors duration-200 hover:border-[#FF2C03]/40 hover:text-[#FF2C03]" aria-label="Tela cheia">
            {fs ? <Minimize className="h-[18px] w-[18px]" /> : <Maximize className="h-[18px] w-[18px]" />}
          </button>
          <div className="flex items-center gap-1 rounded-full border border-[rgb(var(--fg)_/_0.15)] bg-[var(--bg)]/70 px-1.5 py-1 backdrop-blur">
            <button onClick={prev} disabled={active === 0} className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[rgb(var(--fg)_/_0.8)] transition-colors duration-200 hover:bg-[rgb(var(--panel)_/_0.1)] disabled:cursor-default disabled:opacity-25" aria-label="Anterior"><ArrowLeft className="h-[18px] w-[18px]" /></button>
            <span className="min-w-[3.4rem] text-center text-xs font-bold tabular-nums text-[rgb(var(--fg)_/_0.6)]">{String(active + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
            <button onClick={next} disabled={active === total - 1} className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#FF2C03] text-black transition-colors duration-200 hover:bg-[#ff4a28] disabled:cursor-default disabled:opacity-25" aria-label="Próximo"><ArrowRight className="h-[18px] w-[18px]" /></button>
          </div>
        </div>
      </section>

      {menu && (
        <div className="absolute inset-0 z-50 flex flex-col bg-[var(--bg)] backdrop-blur lg:hidden">
          <div className="flex items-center justify-between px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-3">
            <span className="font-[family-name:var(--font-display)] text-lg uppercase tracking-tight">Índice</span>
            <button onClick={() => setMenu(false)} className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[rgb(var(--fg)_/_0.15)]" aria-label="Fechar"><X className="h-[18px] w-[18px]" /></button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-6"><NavList onPick={() => setMenu(false)} /></div>
        </div>
      )}
    </main>
  )
}
