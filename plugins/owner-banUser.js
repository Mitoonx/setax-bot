
let handler = async (m, { conn, text, usedPrefix, command }) => {
    function no(number){
    return number.replace(/\s/g,'').replace(/([@+-])/g,'')
  }

    text = no(text)

  if(isNaN(text)) {
		var number = text.split`@`[1]
  } else if(!isNaN(text)) {
		var number = text
  }

    if(!text && !m.quoted) return m.reply(`*[⚠️]* ESTIMADO ADMINISTRADOR MENCIONA A UN USUARIO A *BANEAR* DEL SERVIDOR`)
    if(isNaN(number)) return m.reply(`*[❌]* EL NÚMERO QUE INGRESASTES NO ES VÁLIDO`)

      try {
		if(text) {
			var user = number + '@s.whatsapp.net'
		} else if(m.quoted.sender) {
			var user = m.quoted.sender
		} else if(m.mentionedJid) {
  		  var user = number + '@s.whatsapp.net'
			}  
		} catch (e) {
  } finally {
    	let number = user.split('@')[0]
        let num = global.db.data.users[user]
        num.banned = true
        conn.reply(m.chat, ` *[⚠️]* ESTIMADO ADMINISTRADOR SE APLICO UN *BANEO* AL USUARIO @${number} DEL SERVIDOR.`, m, { mentions: [user] })
    }
    
}
handler.help = ['ban @user']
handler.tags = ['owner']
handler.command = ['ban'] 
handler.rowner = true

export default handler
