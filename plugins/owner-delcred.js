let handler = async (m, { conn, text, usedPrefix, command }) => {
  let teP = `*[✳️]* *USO DEL COMANDO*\n\n*[🛑]* *EJEMPLO:* \n*[🛑]* /UCRED @${m.sender.split`@`[0]} 1\n*[🛑]* /UCRED @${m.sender.split`@`[0]} 10\n*[🛑]* /UCRED @${m.sender.split`@`[0]} 100`
  let who
  if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false
  else who = m.chat
  let user = global.db.data.users[who]
  if (!who) return m.reply(teP, null, { mentions: conn.parseMention(teP) })
  if (!(who in global.db.data.users)) throw `✳️ ${mssg.userDb}`
  let txt = text.replace('@' + who.split`@`[0], '').trim()
  if (!txt) return m.reply(teP, null, { mentions: conn.parseMention(teP) })
  if (isNaN(txt)) return m.reply(teP, null, { mentions: conn.parseMention(teP) })

  // Asegúrate de que la propiedad credit exista y no sea NaN
  user.credit = user.credit ? user.credit - parseInt(txt) : -parseInt(txt);

  // Obtener el rango del usuario después de restar los créditos
  let rank = getRank(user.credit);
  let antispamDelay = getAntispamDelay(rank); // Function to determine antispam delay based on rank

  m.reply(`┌───────────────────────
*[⚠️]* PANEL ADMIN *ONLINE*
*[✳️]* CRÉDITOS *RESTADOS* *ON*
*[✳️]* RANGO *RESTADO* *ON*
*[🛑]* *USER:* @${who.split`@`[0]}
*[🛑]* *NAME:* ${user.name}
*[🛑]* *CRÉDITOS ANTES:* *${user.credit + parseInt(txt)}*
*[🛑]* *CREDITOS TOTAL:* *${user.credit}*
*[🛑]* *RANGO:* *${rank}*
*[🛑]* *ANTISPAM:* *${antispamDelay / 1000} SEGUNDOS*
└───────────────────────
`, null, { mentions: [who] })
}

// Function to determine user rank based on credits
function getRank(credit) {
  if (credit >= 100000) {
     return "ADMINISTRADOR";
  } else if (credit >= 1500) {
     return "PLUS";
  } else if (credit >= 500) {
     return "VIP";
  } else if (credit >= 1) {
     return "STANDARD";
  } else {
     return "FREE";
}
}

// Function to determine antispam delay based on rank
function getAntispamDelay(rank) {
  switch (rank) {
      case "ADMINISTRADOR":
          return 0;
      case "PLUS":
          return 10 * 1000; // 10 seconds
      case "VIP":
          return 30 * 1000; // 30 seconds
      case "STANDARD":
          return 110 * 1000; // 110 seconds
      case "FREE":
          return 200 * 1000; // 200 seconds
      default:
          return 0;
  }
}

handler.help = ['ucred @user <amount>']
handler.tags = ['owner']
handler.command = ['ucred']
handler.rowner = true

export default handler;
