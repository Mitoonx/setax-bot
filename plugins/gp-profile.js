import { createHash } from 'crypto'
import PhoneNumber from 'awesome-phonenumber'
import { xpRange } from '../lib/levelling.js'

// Variable para rastrear el tiempo de la última consulta
let lastQueryTime = {};

let handler = async (m, { conn, usedPrefix, command }) => {
    // Verificar si el comando es "/me" para omitir la verificación de antispam
    if (command.toLowerCase() !== 'me') {
        // Verificar el antispam
        const rank = getRank(global.db.data.users[m.sender]?.credit);
        const antispamDelay = getAntispamDelay(rank);

        const currentTime = Date.now();
        if (lastQueryTime[m.sender] && currentTime - lastQueryTime[m.sender] < antispamDelay) {
            const remainingTime = Math.ceil((antispamDelay - (currentTime - lastQueryTime[m.sender])) / 1000);
            return m.reply(`*[⚠️]* DEBES ESPERAR ${remainingTime} SEGUNDOS ANTES DE REALIZAR OTRA CONSULTA.`);
        }

        // Restablecer el tiempo de la última consulta
        lastQueryTime[m.sender] = currentTime;
    }

    // Resto del código
    let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    if (!(who in global.db.data.users)) throw `*[❌]* ${mssg.userDb}`

    let user = global.db.data.users[who];

    // Resto del código para mostrar el perfil completo
    let pp = await conn.profilePictureUrl(who, 'image').catch(_ => './src/avatar_contact.png')
    let { name, exp, diamond, lastclaim, registered, regTime, age, level, role, warn, genero, prem, coin, bank, language} = global.db.data.users[who]
    let { min, xp, max } = xpRange(user.level, global.multiplier)
    let username = conn.getName(who)
    let math = max - xp
    let premG = global.prems.includes(who.split`@`[0]) || prem
    let sn = createHash('md5').update(who).digest('hex')

    // Nueva línea para agregar el estado de ban al perfil
    let statusEmoji = user.banned ? '❌' : '✅';
    let statusText = user.banned ? 'BANEADO' : 'ACTIVO';
    let status = `*[〽️]* *ESTADO:* *[${statusEmoji}]* *[${statusText}]*`;

    // Obtener el rango del usuario
    let rank = getRank(user.credit);
    let credits = typeof user.credit === 'number' ? user.credit : 0; // Verificar si user.credit es un número, de lo contrario, establecerlo en 0

    // Obtener el tiempo de antispam en segundos según el rango del usuario
    const antispamDelayInSeconds = getAntispamDelay(rank) / 1000;

    let str = `┌───「 *${mssg.profile.toUpperCase()} USUARIO* 」
▢ *[🔖]* *NAME:* ${username} ${registered ? '\n▢ *[🔖]* *DATA:* *' + name + '* ': ''}
▢ *[🔖]* *USER:* *@${who.replace(/@.+/, '')}*
▢ *[🔖]* *ID:* *${PhoneNumber('+' + who.replace('@s.whatsapp.net', '')).getNumber('international')}*
▢ *[📍]* *CREDITOS:* *${credits}*
▢ *[📍]* *ANTISPAM:* *${antispamDelayInSeconds} SEGUNDOS*
▢ *[📍]* *IDIOMA:* *${language}*
▢ *[⚠️]* *RANGO:* *${rank}*
▢ *[〽️]* *PREMIUM:* ${premG ? '*[✅]*' : '*[❌]*'}
▢ *[〽️]* *REGISTRADO:* ${registered ? '*[✅]*': '*[❌]*'}
▢ ${status}
└────────────────────`

    conn.sendFile(m.chat,pp, 'perfil.jpg', str, m, false, { mentions: [who] })
    m.react(done)
}

// ...

// Función para determinar el rango del usuario según sus créditos
function getRank(credit) {
    if (credit >= 1500) {
        return "PLUS";
    } else if (credit >= 500) {
        return "VIP";
    } else if (credit >= 1) {
        return "STANDARD";
    } else {
        return "FREE";
    }
}

// Función para obtener el tiempo de antispam según el rango del usuario
function getAntispamDelay(rank) {
    switch (rank) {
        case "PLUS":
            return 10 * 1000; // 10 segundos
        case "VIP":
            return 30 * 1000; // 30 segundos
        case "STANDARD":
            return 110 * 1000; // 110 segundos
        case "FREE":
            return 200 * 1000; // 200 segundos
        default:
            return 0;
    }
}

handler.help = ['me']
handler.tags = ['group']
handler.command = ['me']

export default handler;