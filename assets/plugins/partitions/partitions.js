(() => {
  if (!window.$docsify) {
    throw new Error('Docsify doit être chargé avant d\'installer ce plugin.');
  }

  window.$docsify.plugins.push(hook => {
    hook.doneEach(function () {
      const main = document.body.querySelector('main')

      if (main.classList.contains('partitions')) {
        const url = 'assets/pdf/openbook.pdf'
        // Loaded via <script> tag, create shortcut to access PDF.js exports.
        const pdfjsLib = window['pdfjs-dist/build/pdf'];
        // The workerSrc property shall be specified.
        pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';
        // Asynchronous download of PDF
        const loadingTask = pdfjsLib.getDocument(url)
        loadingTask.promise.then(function(pdf) {
          console.log('PDF loaded')
          // Fetch the first page
          var pageNumber = 1;
          pdf.getPage(pageNumber).then(function(page) {
            console.log('Page loaded')
            const scale = 1.5
            const viewport = page.getViewport({scale: scale})
            // Prepare canvas using PDF page dimensions
            const canvas = document.getElementById('pdf-canvas')
            const context = canvas.getContext('2d')
            canvas.height = viewport.height
            canvas.width = viewport.width
            // Render PDF page into canvas context
            const renderContext = {
              canvasContext: context,
              viewport: viewport
            }
            const renderTask = page.render(renderContext)
            renderTask.promise.then(function () {
              console.log('Page rendered')
            });
          });
        },
        function (reason) {
          // PDF loading error
          console.error(reason)
        })
      }
    })
  })
})()
