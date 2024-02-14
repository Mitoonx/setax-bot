
let handler = async (m, { conn, usedPrefix, command, text }) => {
    let who
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : false
    else who = text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : m.chat
    let user = global.db.data.users[who]
    if (!who) return m.reply(`*[✳️]* MENCIONA A UN USUARIO\n*[✳️]* REPLAY O EIQUETA\n\n*[🛑]* *EJEMPLO USO* :\n*[🛑]* ${usedPrefix + command} @${m.sender.split`@`[0]}`, null, { mentions: [m.sender] })
    if (!(who in global.db.data.users)) throw `✳️ ${mssg.userDb}`
    if (user.prem === false) throw `*[❌]* *ERROR :* El USUARIO NO ES RANGO *PREMIUM* EN LA DATA BASE DEL SERVIDOR.`
    user.prem = false
    user.premiumTime = 0
    m.reply(`*[⚠️]* RANGO PREMIUM REMOVIDO \n*[⚠️]* ESTIMADO USUARIO @${who.split('@')[0]} YA NO ERES *PREMIUM* EN LA DATA BASE DEL SERVIDOR.`, null, { mentions: [who] })
}
handler.help = ['delprem @user']
handler.tags = ['owner']
handler.command = ['delprem', 'utime'] 
handler.group = true
handler.rowner = true

export default handler
