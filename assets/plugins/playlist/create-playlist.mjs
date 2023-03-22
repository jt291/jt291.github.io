import { readdir, writeFile } from 'node:fs/promises'
import { extname, parse, relative } from 'node:path'

const audioExtensions = ['.mp3', '.wav']

function isAudioFile(filename) {
  return audioExtensions.includes(extname(filename))
}

async function getAllMP3(dirname='./assets/audios') {
  try {
    const files = await readdir(dirname, { withFileTypes: true })
    return files.filter(file => file.isFile() && isAudioFile(file.name)).map(file => file.name).sort()
  } catch(error) {
    console.error(error)
    process.exit(1)
  }
}

async function makePlaylist(dirname) {
  let html = `
    <!--
    fichier généré automatiquement par assets/plugins/playlist/create-playlist.mjs
    ne pas modifier
    -->

    # Liste de lecture

    <article class="playlist">

    <div class="playlist__audio">
      <audio class="playlist__audio__control" controls autoplay src=""></audio>
      <div class="playlist__audio__scroll">
        <div class="playlist__audio__description">
        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M22 6c-1 5-7 5-7 5H4c-1 0-2-1-2-1H1v4h1s1-1 2-1h.3c-.2.3-.3.6-.3 1v2c0 1.1.9 2 2 2h1v1h2v-1h1v1h2v-1h1v1h2v-1h1c1.1 0 2-.9 2-2v-2c0-.1 0-.3-.1-.4c1.7.6 3.5 1.8 4.1 4.4h1V6h-1M6 16.5c-.3 0-.5-.2-.5-.5v-2c0-.3.2-.5.5-.5h1v3H6m3 0v-3h1v3H9m3 0v-3h1v3h-1m4.5-.5c0 .3-.2.5-.5.5h-1v-3h1c.3 0 .5.2.5.5v2M9 10H7V9h2v1m3 0h-2V9h2v1m3 0h-2V9h2v1Z"/></svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M22 6c-1 5-7 5-7 5H4c-1 0-2-1-2-1H1v4h1s1-1 2-1h.3c-.2.3-.3.6-.3 1v2c0 1.1.9 2 2 2h1v1h2v-1h1v1h2v-1h1v1h2v-1h1c1.1 0 2-.9 2-2v-2c0-.1 0-.3-.1-.4c1.7.6 3.5 1.8 4.1 4.4h1V6h-1M6 16.5c-.3 0-.5-.2-.5-.5v-2c0-.3.2-.5.5-.5h1v3H6m3 0v-3h1v3H9m3 0v-3h1v3h-1m4.5-.5c0 .3-.2.5-.5.5h-1v-3h1c.3 0 .5.2.5.5v2M9 10H7V9h2v1m3 0h-2V9h2v1m3 0h-2V9h2v1Z"/></svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M22 6c-1 5-7 5-7 5H4c-1 0-2-1-2-1H1v4h1s1-1 2-1h.3c-.2.3-.3.6-.3 1v2c0 1.1.9 2 2 2h1v1h2v-1h1v1h2v-1h1v1h2v-1h1c1.1 0 2-.9 2-2v-2c0-.1 0-.3-.1-.4c1.7.6 3.5 1.8 4.1 4.4h1V6h-1M6 16.5c-.3 0-.5-.2-.5-.5v-2c0-.3.2-.5.5-.5h1v3H6m3 0v-3h1v3H9m3 0v-3h1v3h-1m4.5-.5c0 .3-.2.5-.5.5h-1v-3h1c.3 0 .5.2.5.5v2M9 10H7V9h2v1m3 0h-2V9h2v1m3 0h-2V9h2v1Z"/></svg>
        <span class="playlist__audio__description__text">Sélectionner un titre</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M22 6c-1 5-7 5-7 5H4c-1 0-2-1-2-1H1v4h1s1-1 2-1h.3c-.2.3-.3.6-.3 1v2c0 1.1.9 2 2 2h1v1h2v-1h1v1h2v-1h1v1h2v-1h1c1.1 0 2-.9 2-2v-2c0-.1 0-.3-.1-.4c1.7.6 3.5 1.8 4.1 4.4h1V6h-1M6 16.5c-.3 0-.5-.2-.5-.5v-2c0-.3.2-.5.5-.5h1v3H6m3 0v-3h1v3H9m3 0v-3h1v3h-1m4.5-.5c0 .3-.2.5-.5.5h-1v-3h1c.3 0 .5.2.5.5v2M9 10H7V9h2v1m3 0h-2V9h2v1m3 0h-2V9h2v1Z"/></svg>
        </div>
      </div>
    </div>

    <ol class="playlist__ol">
  `
  const files = await getAllMP3(dirname)
  for (const file of files) {
    const filename = parse(file).name.split('__')
    const title = filename[0].replace(/-/g,' ')
    const artist = filename[1].replace(/-/g,' ')
    html += `
      <li class="playlist__li">
      <label class="playlist__track">
        <input name="playlist" type="radio" value="${relative('./playlist', dirname)}/${file}">
        <p class="playlist__track__description">${title} - ${artist}</p>
      </label>
      </li>
    `
  }
  html += `
    </ol>
    </article>
  `
  return html.replace(/^ +| +$/gm, '')
}

async function main(audiodir, playlistFileName) {
  try {
    const html = await makePlaylist(audiodir)
    writeFile(playlistFileName, html, { encoding: 'utf8' })
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

main('./assets/audios', './playlist/playlist.md')
