'use client'

import { useEffect, useRef } from 'react'

const SCRIPT_URL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ShopifyBuy?: any
  }
}

/** Botão de compra Shopify do boné Somma (textos em PT-BR). */
export function BoneBuyButton() {
  const nodeRef = useRef<HTMLDivElement>(null)
  const inited = useRef(false)

  useEffect(() => {
    if (inited.current || !nodeRef.current) return

    function buildComponent() {
      const ShopifyBuy = window.ShopifyBuy
      if (!ShopifyBuy || !ShopifyBuy.UI || !nodeRef.current || inited.current) return
      inited.current = true

      const client = ShopifyBuy.buildClient({
        domain: 'sfjsua-je.myshopify.com',
        storefrontAccessToken: 'be109ec7c08d0fe58b02c31dda8b16be',
      })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ShopifyBuy.UI.onReady(client).then((ui: any) => {
        ui.createComponent('product', {
          id: '9305254887677',
          node: nodeRef.current,
          moneyFormat: 'R%24%20%7B%7Bamount_with_comma_separator%7D%7D',
          options: {
            product: {
              styles: {
                product: {
                  '@media (min-width: 601px)': { 'max-width': '100%', 'margin-left': '0', 'margin-bottom': '0' },
                  'text-align': 'center',
                },
                title: { 'font-family': 'Open Sans, sans-serif', 'font-weight': 'bold', color: '#FF2C03' },
                button: {
                  'font-family': 'Open Sans, sans-serif',
                  'background-color': '#FF2C03',
                  ':hover': { 'background-color': '#e24400' },
                  ':focus': { 'background-color': '#e24400' },
                  'border-radius': '14px',
                },
                price: { color: '#FF2C03' },
                compareAt: { color: '#FF2C03' },
                unitPrice: { color: '#FF2C03' },
              },
              buttonDestination: 'modal',
              contents: { options: false },
              text: { button: 'Ver o boné' },
              googleFonts: ['Open Sans'],
            },
            productSet: {
              styles: { products: { '@media (min-width: 601px)': { 'margin-left': '-20px' } } },
            },
            modalProduct: {
              contents: { img: false, imgWithCarousel: true, button: false, buttonWithQuantity: true },
              styles: {
                product: { '@media (min-width: 601px)': { 'max-width': '100%', 'margin-left': '0px', 'margin-bottom': '0px' } },
                button: {
                  'font-family': 'Open Sans, sans-serif',
                  'background-color': '#FF2C03',
                  ':hover': { 'background-color': '#e24400' },
                  ':focus': { 'background-color': '#e24400' },
                  'border-radius': '14px',
                },
                title: { 'font-family': 'Helvetica Neue, sans-serif', 'font-weight': 'bold', 'font-size': '26px', color: '#4c4c4c' },
                price: { 'font-family': 'Helvetica Neue, sans-serif', 'font-weight': 'normal', 'font-size': '18px', color: '#4c4c4c' },
              },
              googleFonts: ['Open Sans'],
              text: { button: 'Colocar na sacolinha' },
            },
            option: {},
            cart: {
              styles: {
                button: {
                  'font-family': 'Open Sans, sans-serif',
                  'background-color': '#FF2C03',
                  ':hover': { 'background-color': '#e24400' },
                  ':focus': { 'background-color': '#e24400' },
                  'border-radius': '14px',
                },
              },
              text: {
                title: 'Carrinho Somma Club',
                total: 'Total',
                empty: 'Seu carrinho está vazio.',
                notice: 'Retire no próximo Somma Club',
                button: 'Fazer pedido',
              },
              googleFonts: ['Open Sans'],
            },
            toggle: {
              styles: {
                toggle: {
                  'font-family': 'Open Sans, sans-serif',
                  'background-color': '#FF2C03',
                  ':hover': { 'background-color': '#e24400' },
                  ':focus': { 'background-color': '#e24400' },
                },
              },
              googleFonts: ['Open Sans'],
            },
          },
        })
      })
    }

    if (window.ShopifyBuy && window.ShopifyBuy.UI) {
      buildComponent()
    } else {
      const existing = document.querySelector(`script[src="${SCRIPT_URL}"]`) as HTMLScriptElement | null
      if (existing) {
        existing.addEventListener('load', buildComponent)
        if (window.ShopifyBuy) buildComponent()
      } else {
        const script = document.createElement('script')
        script.async = true
        script.src = SCRIPT_URL
        script.onload = buildComponent
        document.head.appendChild(script)
      }
    }
  }, [])

  return <div ref={nodeRef} />
}
