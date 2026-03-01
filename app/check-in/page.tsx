'use client'

import { CheckInForm } from '@/components/check-in-form'

export const metadata = {
  title: "Check-in | SOMMA Running Club",
  description: "Faça seu check-in no SOMMA Running Club de forma rápida e intuitiva. Insira seus dados e ganhe acesso ao café, sorteios e ativações.",
  keywords: ["check-in", "SOMMA", "evento", "corrida", "pulseira"],
}

export default function CheckInPage() {
  return <CheckInForm />
}
