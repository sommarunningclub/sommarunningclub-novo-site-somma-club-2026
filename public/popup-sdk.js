// public/popup-sdk.js
// Somma Running Club - Popup SDK
// Reads active popups from Supabase directly (anon key, public RLS)

;(function () {
  'use strict'

  // ─── Configuration ───────────────────────────────────────────────────────
  var SUPABASE_URL = 'https://riqfjewvygqsbuokvsjw.supabase.co'
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpcWZqZXd2eWdxc2J1b2t2c2p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwOTcwOTcsImV4cCI6MjA4NDY3MzA5N30.hH-1Asj9p7HT9xRmFy-ahd_NGT7uLwve6_4_eLqE6Hg'

  // ─── State ───────────────────────────────────────────────────────────────
  var queue = []
  var currentIndex = 0
  var overlay = null

  // ─── Session ID ──────────────────────────────────────────────────────────
  function getSessionId() {
    var key = 'popup_session_id'
    var id = sessionStorage.getItem(key)
    if (!id) {
      id = crypto.randomUUID()
      sessionStorage.setItem(key, id)
    }
    return id
  }

  // ─── Frequency check ─────────────────────────────────────────────────────
  function shouldShow(popup) {
    if (popup.frequency === 'sempre') return true
    if (popup.frequency === 'uma_vez') {
      return !localStorage.getItem('popup_shown_' + popup.id)
    }
    if (popup.frequency === 'sessao') {
      return !sessionStorage.getItem('popup_session_' + popup.id)
    }
    return true
  }

  function markShown(popup) {
    if (popup.frequency === 'uma_vez') {
      localStorage.setItem('popup_shown_' + popup.id, '1')
    } else if (popup.frequency === 'sessao') {
      sessionStorage.setItem('popup_session_' + popup.id, '1')
    }
  }

  // ─── Device detection ────────────────────────────────────────────────────
  function getDeviceType() {
    return window.innerWidth <= 768 ? 'mobile' : 'desktop'
  }

  // ─── Track click ─────────────────────────────────────────────────────────
  function trackClick(popup) {
    var body = JSON.stringify({
      popup_id: popup.id,
      user_session_id: getSessionId(),
      page: window.location.pathname,
      device_type: getDeviceType(),
    })
    fetch(SUPABASE_URL + '/rest/v1/popup_clicks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
        Prefer: 'return=minimal',
      },
      body: body,
    }).catch(function () {
      // Non-critical, ignore errors
    })
  }

  // ─── Render overlay ──────────────────────────────────────────────────────
  function showPopup(popup) {
    markShown(popup)

    var style = document.createElement('style')
    style.textContent = [
      '#somma-popup-overlay{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,0.72);animation:somma-fade-in 0.2s ease-out}',
      '#somma-popup-card{position:relative;background:#fff;border-radius:12px;overflow:hidden;max-width:480px;width:100%;box-shadow:0 25px 60px rgba(0,0,0,0.5);animation:somma-scale-in 0.2s ease-out}',
      '#somma-popup-card img{display:block;width:100%;height:auto;cursor:pointer}',
      '#somma-popup-close{position:absolute;top:8px;right:8px;width:32px;height:32px;border-radius:50%;background:rgba(0,0,0,0.6);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#fff;font-size:18px;line-height:1;padding:0;transition:background 0.15s}',
      '#somma-popup-close:hover{background:rgba(0,0,0,0.85)}',
      '@keyframes somma-fade-in{from{opacity:0}to{opacity:1}}',
      '@keyframes somma-scale-in{from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)}}',
    ].join('')
    document.head.appendChild(style)

    overlay = document.createElement('div')
    overlay.id = 'somma-popup-overlay'

    var card = document.createElement('div')
    card.id = 'somma-popup-card'

    var img = document.createElement('img')
    img.src = popup.image_url
    img.alt = popup.title
    img.onclick = function () {
      trackClick(popup)
      closeOverlay()
      if (popup.redirect_link) window.open(popup.redirect_link, '_blank', 'noopener')
    }

    var closeBtn = document.createElement('button')
    closeBtn.id = 'somma-popup-close'
    closeBtn.innerHTML = '&times;'
    closeBtn.setAttribute('aria-label', 'Fechar')
    closeBtn.onclick = closeOverlay

    card.appendChild(img)
    card.appendChild(closeBtn)
    overlay.appendChild(card)

    // Close on backdrop click
    overlay.onclick = function (e) {
      if (e.target === overlay) closeOverlay()
    }

    document.body.appendChild(overlay)
  }

  function closeOverlay() {
    if (overlay) {
      overlay.remove()
      overlay = null
    }
    // Show next in queue
    currentIndex++
    if (currentIndex < queue.length) {
      showPopup(queue[currentIndex])
    }
  }

  // ─── Fetch and filter ─────────────────────────────────────────────────────
  function init() {
    var pathname = window.location.pathname

    fetch(SUPABASE_URL + '/rest/v1/popups?select=*&is_active=eq.true', {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
      },
    })
      .then(function (res) { return res.json() })
      .then(function (popups) {
        if (!Array.isArray(popups)) return

        queue = popups.filter(function (p) {
          // Client-side filter: check if current page is in pages array
          var pages = Array.isArray(p.pages) ? p.pages : []
          var matchesPage = pages.length === 0 || pages.indexOf(pathname) !== -1
          return matchesPage && shouldShow(p)
        })

        if (queue.length > 0) {
          // Small delay so page renders first
          setTimeout(function () { showPopup(queue[0]) }, 800)
        }
      })
      .catch(function () {
        // Non-critical, ignore errors
      })
  }

  // ─── Bootstrap ───────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }

})()
