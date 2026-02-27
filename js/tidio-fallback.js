// Fallback loader for Tidio to avoid stuck states if the theme loader is blocked or delayed
(() => {
  const tidioKey = '40ttpglnqrfp7dwq3nzplfb9wdydjajm'
  const START_DELAY = 800
  const RETRY_INTERVAL = 2500
  const MAX_RETRIES = 3
  const PRELOADER_TIMEOUT = 8000

  const hasApi = () => typeof window.tidioChatApi !== 'undefined'

  const hasScript = () =>
    !!document.querySelector(`script[src*="${tidioKey}.js"]`)

  const injectScript = () => {
    if (hasScript()) return
    const s = document.createElement('script')
    s.src = `https://code.tidio.co/${tidioKey}.js`
    s.async = true
    s.defer = true
    s.dataset.tidioFallback = '1'
    document.head.appendChild(s)
  }

  const showBtn = () => {
    const btn = document.getElementById('chat-btn')
    if (btn) btn.style.display = 'block'
  }

  const onReady = () => {
    showBtn()
  }

  const wireReadyOnce = () => {
    if (window.__tidioReadyWired) return
    window.__tidioReadyWired = true
    if (window.tidioChatApi?.on) {
      window.tidioChatApi.on('ready', onReady)
    } else {
      document.addEventListener('tidioChat-ready', onReady)
    }
  }

  const ensure = () => {
    if (hasApi()) {
      wireReadyOnce()
      showBtn()
      endPreloaderIfNeeded()
      return
    }

    injectScript()

    let attempts = 0
    const timer = setInterval(() => {
      if (hasApi()) {
        clearInterval(timer)
        wireReadyOnce()
        showBtn()
        endPreloaderIfNeeded()
        return
      }
      attempts += 1
      if (attempts >= MAX_RETRIES) clearInterval(timer)
    }, RETRY_INTERVAL)
  }

  // Initial check after a short delay to avoid racing with the theme loader
  setTimeout(ensure, START_DELAY)

  // Re-run after PJAX partial navigations in case the button is re-rendered
  document.addEventListener('pjax:complete', ensure)

  // Keep the preloader visible until Tidio is ready (or timeout) to better reflect real loading
  const endPreloaderIfNeeded = () => {
    const box = document.getElementById('loading-box')
    if (!box) return
    const body = document.body
    if (box.classList.contains('loaded')) return
    body.style.overflow = ''
    box.classList.add('loaded')
  }

  const holdPreloaderUntilTidio = () => {
    const box = document.getElementById('loading-box')
    if (!box) return
    const body = document.body
    // Show preloader if it was already marked loaded
    box.classList.remove('loaded')
    body.style.overflow = 'hidden'

    let finished = false
    const finish = () => {
      if (finished) return
      finished = true
      body.style.overflow = ''
      box.classList.add('loaded')
    }

    if (hasApi()) {
      finish()
      return
    }

    const timeoutId = setTimeout(finish, PRELOADER_TIMEOUT)
    const readyHandler = () => {
      clearTimeout(timeoutId)
      finish()
    }

    if (window.tidioChatApi?.on) {
      window.tidioChatApi.on('ready', readyHandler)
    } else {
      document.addEventListener('tidioChat-ready', readyHandler)
    }
  }

  // Start holding the preloader shortly after page scripts run
  setTimeout(holdPreloaderUntilTidio, 50)
  document.addEventListener('pjax:send', holdPreloaderUntilTidio)
})()
