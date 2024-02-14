
let handler = async (m, { conn, usedPrefix, isOwner }) => {
    let chats = Object.entries(global.db.data.chats).filter(chat => chat[1].isBanned)
    let users = Object.entries(global.db.data.users).filter(user => user[1].banned)
    
    let te = `
≡ *USUARIOS BANEADOS*

▢ *TOTAL USUARIOS* : *${users.length}* 

${users ? '\n' + users.map(([jid], i) => `
${i + 1}. ${conn.getName(jid) == undefined ? 'Desconocido' : conn.getName(jid)}
${isOwner ? '@' + jid.split`@`[0] : jid}
`.trim()).join('\n\n') : ''}
`.trim()

 conn.reply(m.chat, te, m, { mentions: await conn.parseMention(te)}) 
}
handler.help = ['lban']
handler.tags = ['owner']
handler.command = ['lban']
handler.rowner = true

export default handler
