
import fg from 'api-dylux'
let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) throw `*[✳️]* INGRESE UN NOMBRE DE USUARIO\n*[📌]* *EJEMPLO:* *${usedPrefix + command}* promo5toa_\n*[📌]* *RESPONDE: HISTORIAS IG*`
  m.react(rwait)
  let res = await fg.igstory(args[0])
  for (let { url, type } of res.results) {
    conn.sendFile(m.chat, url, 'igstory.bin', `*[✅]* HISTORIA DE *${res.username}*`, m)
  }

  m.react(done)
}
handler.help = ['igstory']
handler.tags = ['dl']
handler.command = ['igstory', 'ighistoria', 'vig'] 
handler.diamond = true

export default handler
