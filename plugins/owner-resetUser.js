
let handler = async (m, { conn, text }) => {
    function no(number){
    return number.replace(/\s/g,'').replace(/([@+-])/g,'')
  }

    text = no(text)

  if(isNaN(text)) {
		var number = text.split`@`[1]
  } else if(!isNaN(text)) {
		var number = text
  }

    if(!text && !m.quoted) return m.reply(`*[⚠️]* RESETEAR A USUARIO :* ETIQUETE AL USUARIO, ESCRIBA EL NÚMERO O RESPONDA AL MENSAJE DEL USUARIO QUE DESEA *REINICIAR*`)
    if(isNaN(number)) return m.reply(`*[❌]* EL USUARIO QUE INGRESASTES NO ES VÁLIDO`)

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
        delete global.global.db.data.users[user]
        conn.reply(m.chat, `*[⚠️]* ESTIMADO ADMINISTRADOR SE *REINICIÓ* AL USUARIO @${number} DE LA *BASE DE DATOS* DEL BOT`, null, { mentions: [user] })
    }
    
}
handler.help = ['reset-user']
handler.tags = ['owner']
handler.command = ['resetuser'] 
handler.rowner = true

export default handler
