(() => {
  if (!window.$docsify) {
    throw new Error('Docsify doit être chargé avant d\'installer ce plugin.');
  }

  window.$docsify.plugins.push(hook => {
    hook.doneEach(function () {
      const main = document.body.querySelector('main')

      if (main.classList.contains('playlist')) {
        const audio = main.querySelector('audio.playlist__audio__control')
        const span = main.querySelector('span.playlist__audio__description__text')
        const inputs = main.querySelectorAll("input[name='playlist']")
        for (const input of inputs) {
          input.addEventListener('change', (ev) => {
            ev.preventDefault()
            span.innerHTML = input.nextElementSibling.innerHTML
            audio.src = input.value
            if (audio.src) { audio.autoplay = true }
         })
        }
      }
    })
  })
})()
