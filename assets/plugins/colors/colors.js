(() => {
  if (!window.$docsify) {
    throw new Error('Docsify doit être chargé avant d\'installer ce plugin.');
  }

  window.$docsify.plugins.push(hook => {
    const levels = ['accueil', 'styles', 'fusions', 'formations', 'coeurs', 'outils', 'playlist', 'partitions']

    hook.doneEach(function () {
      const main = document.body.querySelector('main')
      levels.forEach(level => {
        main.classList.remove(level)
      })
      const page = document.body.dataset.page
      const levelName = page.split('/')[0].replace(/\.md/g,'')
      main.classList.add(levelName)
    })
  })
})()
