let handler = async (m, { conn, args }) => {
  let usersWithCredits = Object.entries(global.db.data.users).filter(user => user[1].credit).map(([key, value]) => {
    return { ...value, jid: key }
  })

  let sortedUsers = usersWithCredits.map(toNumber('credit')).sort(sort('credit'))
  let len = args[0] && args[0].length > 0 ? Math.min(100, Math.max(parseInt(args[0]), 10)) : Math.min(10, sortedUsers.length)

  let text = `≡ *USUARIOS CRÉDITOS*
≡ *USUARIOS ESTADO*
≡ *USUARIOS PREMIUM*

▢ *TOTAL:* *${sortedUsers.length}* 
${sortedUsers.slice(0, len).map(({ jid, name, credit, registered, banned, prem }, i) => `
┌─⊷ *${registered ? name : conn.getName(jid)}*
▢ *USERNAME:* *@${jid.split`@`[0]}*
▢ *CRÉDITOS:* *${credit}*
▢ *RANGO:* *${getRank(credit)}*
▢ *ANTISPAM:* *${getAntispamDelay(getRank(credit)) / 1000}*
▢ *STATUS:* ${banned ? '*[❌]* *BANEADO*' : '*[✅]* *ACTIVO*'}
▢ *PREMIUM:* ${prem ? '*[✅]*' : '*[❌]*'}`).join('\n└───────────')} 
└───────────`

conn.reply(m.chat, text, m, { mentions: await conn.parseMention(text)})
}

handler.help = ['listcred']
handler.tags = ['main']
handler.command = ['lc'] 
handler.rowner = true

export default handler;

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

function sort(property, ascending = true) {
    if (property) return (...args) => args[ascending & 1][property] - args[!ascending & 1][property]
    else return (...args) => args[ascending & 1] - args[!ascending & 1]
}

function toNumber(property, _default = 0) {
    if (property) return (a, i, b) => {
        return { ...b[i], [property]: a[property] === undefined ? _default : a[property] }
    }
    else return a => a === undefined ? _default : a
}
