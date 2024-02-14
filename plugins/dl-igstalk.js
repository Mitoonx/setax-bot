
import fg from 'api-dylux'
let handler= async (m, { conn, args, text, usedPrefix, command }) => {
	
    if (!args[0]) throw `*[✳️]* ESCRIBA UN NOMBRE DE USUARIO\n*[🛑]* *EJEMPLO:* ${usedPrefix + command} mitoonpe` 
    try {
    let res = await fg.igStalk(args[0])
    let te = `
┌──「 *STALKING* 
▢ *[🔖] NOMBRE:* ${res.name} 
▢ *[🔖] USERNAME:* ${res.username}
▢ *[🌐] SEGUIDORES:* ${res.followersH}
▢ *[🌐] SIGUIENDO:* ${res.followingH}
▢ *[🛑] BIOGRAFIA:* ${res.description}
▢ *[🛑] PUBLICACIONES:* ${res.postsH}
▢ *[🔗] LINK:* https://instagram.com/${res.username.replace(/^@/, '')}
└────────────`

     await conn.sendFile(m.chat, res.profilePic, 'tt.png', te, m)
    } catch {
        m.reply(`*[❌]* OCURRIO UN ERROR.\n*[⚠️]* INTENTE MÁS TARDE.\n*[⚠️]* SERVIDOR CAIDO.`)
      }
     
}
handler.help = ['igstalk']
handler.tags = ['dl']
handler.command = ['igstalk'] 

export default handler
