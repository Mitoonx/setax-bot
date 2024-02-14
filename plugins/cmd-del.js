//import db from '../lib/database.js'

let handler = async (m, { text }) => {
    let hash = text
    if (m.quoted && m.quoted.fileSha256) hash = m.quoted.fileSha256.toString('hex')
    if (!hash) throw `*[⚠️]* INGRESE EL NOMBRE DEL COMANDO`
    let sticker = global.db.data.sticker
    if (sticker[hash] && sticker[hash].locked) throw '*[❌]* NO PUEDES BORRAR ESTE COMANDO'
    delete sticker[hash]
    m.reply(`*[✅]* COMANDO ELIMINADO CORRECTAMENTE`)
}


handler.help = ['cmd'].map(v => 'del' + v + ' <text>')
handler.tags = ['cmd']
handler.command = ['delcmd']
handler.rowner = true

export default handler
