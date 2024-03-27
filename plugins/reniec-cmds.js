import { createHash } from 'crypto'
import PhoneNumber from 'awesome-phonenumber'
import { xpRange } from '../lib/levelling.js'
let handler = async (m, { conn, usedPrefix, command}) => {

let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
if (!(who in global.db.data.users)) throw `✳️ ${mssg.userDb}`
let pp = await conn.profilePictureUrl(who, 'image').catch(_ => './src/avatar_contact.png')
let user = global.db.data.users[who]
let { name, exp, diamond, lastclaim, registered, regTime, age, level, role, warn, genero, prem, coin, bank, language} = global.db.data.users[who]
let { min, xp, max } = xpRange(user.level, global.multiplier)
let username = conn.getName(who)
let math = max - xp
let premG = global.prems.includes(who.split`@`[0]) || prem
let sn = createHash('md5').update(who).digest('hex')

let str = `┌───「 *MENÚ COMANDOS* 」

▢ *[📍]* *RENIEC BASICO [FREE]:*
▢ *[✳️]* *ESTADO:* *ONLINE* *[✅]*
▢ *[✳️]* *USO:* /dni 12345678
▢ *[✳️]* *CONSUMO:* 0 CREDITOS
▢ *[✳️]* *RESPUESTA:* DATOS RENIEC BASICOS

▢ *[📍]* *RENIEC MEDIO [PREMIUM]:*
▢ *[✳️]* *ESTADO:* *ONLINE* *[✅]*
▢ *[✳️]* *USO:* /dnix 12345678
▢ *[✳️]* *CONSUMO:* 1 CREDITOS
▢ *[✳️]* *RESPUESTA:* DATOS RENIEC MEDIOS

▢ *[📍]* *RENIEC PLUS [PREMIUM]:*
▢ *[✳️]* *ESTADO:* *OFFLINE* *[❌]*
▢ *[✳️]* *USO:* /dniz 12345678
▢ *[✳️]* *CONSUMO:* 2 CREDITOS
▢ *[✳️]* *RESPUESTA:* DATOS RENIEC PLUS

▢ *[📍]* *RENIEC NOMBRES [PREMIUM]:*
▢ *[✳️]* *ESTADO:* *OFFLINE* *[❌]*
▢ *[✳️]* *USO:* /nm Pedro|Castillo|Terrones|50-54
▢ *[✳️]* *CONSUMO:* 1 CREDITOS
▢ *[✳️]* *RESPUESTA:* DATOS NOMBRES RENIEC

▢ *[📍]* *FAMILIARES [PREMIUM]:*
▢ *[✳️]* *ESTADO:* *OFFLINE* *[❌]*
▢ *[✳️]* *USO:* /fam 12345678
▢ *[✳️]* *CONSUMO:* 5 CREDITOS
▢ *[✳️]* *RESPUESTA:* BUSCA DATOS FAMILIARES

▢ *[📍]* *HOGAR SISFOH [PREMIUM]:*
▢ *[✳️]* *ESTADO:* *ONLINE* *[✅]*
▢ *[✳️]* *USO:* /hogarp 12345678
▢ *[✳️]* *CONSUMO:* 5 CREDITOS
▢ *[✳️]* *RESPUESTA:* BUSCA DATOS HOGAR META

▢ *[📍]* *TELEFONIA [PREMIUM]:*
▢ *[✳️]* *ESTADO:* *OFFLINE* *[❌]*
▢ *[✳️]* *USO:* /tel 12345678
▢ *[✳️]* *USO:* /tel 123456789
▢ *[✳️]* *CONSUMO:* 5 CREDITOS
▢ *[✳️]* *RESPUESTA:* BUSCA TELEFONOS POR DNI
▢ *[✳️]* *RESPUESTA:* BUSCA TITULARIDAD POR TELEFÓNO

▢ *[📍]* *RUC [PREMIUM]:*
▢ *[✳️]* *ESTADO:* *ONLINE* *[✅]*
▢ *[✳️]* *USO:* /ruc 1234567890
▢ *[✳️]* *CONSUMO:* 3 CREDITOS
▢ *[✳️]* *RESPUESTA:* BUSCA DATOS RUC

▢ *[📍]* *SOAT META [PREMIUM]:*
▢ *[✳️]* *ESTADO:* *ONLINE* *[✅]*
▢ *[✳️]* *USO:* /soat C9K460
▢ *[✳️]* *CONSUMO:* 5 CREDITOS
▢ *[✳️]* *RESPUESTA:* BUSCA DATOS SOAT HISTORIAL

▢ *[📍]* *YAPE FAKE [PREMIUM]:*
▢ *[✳️]* *ESTADO:* *ONLINE* *[✅]*
▢ *[✳️]* *USO:* /yape NOMBRES|MONTO|TELÉFONO
▢ *[✳️]* *USO:* /yape JOSE PEDRO CASTILLO TERRONES|400|999
▢ *[✳️]* *CONSUMO:* 5 CREDITOS
▢ *[✳️]* *RESPUESTA:* GENERA CAPTURA YAPE FAKE
└──────────────`

    conn.sendFile(m.chat, pp, 'perfil.jpg', str, m, false, { mentions: [who] })
    m.react(done)

}
handler.help = ['cmds']
handler.tags = ['advanced']
handler.command = ['cmds']

export default handler
