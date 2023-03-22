(() => {
  if (!window.$docsify) {
    throw new Error('Docsify doit être chargé avant d\'installer ce plugin.');
  }

  window.$docsify.plugins.push(hook => {
    hook.doneEach(() => {
      function getTheme() {
        return localStorage.getItem('theme') || 'auto'
      }

      function isDark() {
        if (theme === 'auto') {
          return window.matchMedia('(prefers-color-scheme: dark)').matches
        }
        return theme === 'dark'
      }

      function setTheme(newTheme) {
        const noTransitions = Object.assign(document.createElement('style'), {
          textContent: '* { transition: none !important; }'
        })
        theme = newTheme;
        localStorage.setItem('theme', theme)
        // Toggle the dark mode class without transitions
        document.body.appendChild(noTransitions)
        requestAnimationFrame(() => {
          document.documentElement.classList.toggle('dark', isDark())
          document.documentElement.classList.toggle('light', !isDark())
          requestAnimationFrame(() => document.body.removeChild(noTransitions))
        });
        const filename = isDark() ? 'theme-simple-dark.css' : 'theme-simple.css'
        const linkTag = document.head.querySelector('#docsify-themeable')
        linkTag.href = `https://cdn.jsdelivr.net/npm/docsify-themeable/dist/css/${filename}`
        const moon = document.body.querySelector('#moon')
        const sun = document.body.querySelector('#sun')
        if (isDark()) {
          sun.removeAttribute('hidden')
          moon.setAttribute('hidden', '')
        } else {
          moon.removeAttribute('hidden')
          sun.setAttribute('hidden', '')
        }
      }

      let theme = getTheme()
      setTheme(theme)
      const themeButton = document.body.querySelector('nav.app-nav button.btn-theme')
      if (themeButton) {
        themeButton.addEventListener('click', (ev) => {
          ev.preventDefault()
          setTheme(isDark() ? 'light' : 'dark')
        })
      } else {
        console.log('no theme button')
      }
      // Update the theme when the preference changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => setTheme(theme))
      // Toggle themes when pressing backslash
      document.addEventListener('keydown', event => {
        if (
          event.key === '\\' &&
          !event.composedPath().some(el => ['input', 'textarea'].includes(el?.tagName?.toLowerCase()))
        ) {
          event.preventDefault()
          setTheme(isDark() ? 'light' : 'dark')
        }
      });
      // Set the initial theme
      setTheme(theme)
    })
  })
})()
