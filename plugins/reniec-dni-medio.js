import axios from 'axios';

// Variable para rastrear el tiempo de la última consulta
let lastQueryTime = {};

let handler = async (m, { conn, usedPrefix, command }) => {
    // Verificar el rango del usuario para determinar el antispam
    const rank = getRank(global.db.data.users[m.sender].credit);
    const antispamDelay = getAntispamDelay(rank);

    // Verificar si ha pasado suficiente tiempo desde la última consulta
    const currentTime = Date.now();
    if (lastQueryTime[m.sender] && currentTime - lastQueryTime[m.sender] < antispamDelay) {
        const remainingTime = Math.ceil((antispamDelay - (currentTime - lastQueryTime[m.sender])) / 1000);
        return m.reply(`*[⚠️]* DEBES ESPERAR *${remainingTime}* SEGUNDOS ANTES DE REALIZAR OTRA CONSULTA.`);
    }

    // Obtener el número de DNI del mensaje
    const dni = m.text.split(' ')[1];

    // Verificar si el usuario es premium antes de realizar la consulta
    const isPremium = global.db.data.users[m.sender] && global.db.data.users[m.sender].prem;
    if (!(isPremium || (global.db.data.users[m.sender].credit > 0))) {
        return m.reply('*[⚠️]* NECESITAS SER USUARIO *PREMIUM* O TENER CRÉDITOS PARA ACCEDER A ESTE COMANDO.');
    }

    // Restablecer el tiempo de la última consulta
    lastQueryTime[m.sender] = currentTime;

    // Obtener información del DNI desde la API de Reniec
    const apiReniecUrl = `https://sigeun.unam.edu.pe/api/pide/reniec?dni=${dni}`;

    try {
        const responseReniec = await axios.get(apiReniecUrl);
        const dataReniec = responseReniec.data;

        if (!dataReniec.error) {
            const reniecData = dataReniec.data;

            // Obtener información adicional desde otra API
            const apiOtraUrl = `https://api.perudevs.com/api/v1/dni/complete?document=${dni}&key=cGVydWRldnMucHJvZHVjdGlvbi5maXRjb2RlcnMuNjVhYTBkYzIxZTRjZmUyNGY0ZjZjN2Ez`;
            const responseOtra = await axios.get(apiOtraUrl);
            const resultado = responseOtra.data.resultado;

            const generoTraducido = resultado.genero === 'F' ? 'FEMENINO' : resultado.genero === 'M' ? 'MASCULINO' : 'Desconocido';

            // Restar un crédito al usuario solo si no es premium
            if (!isPremium && global.db.data.users[m.sender].credit > 0) {
                global.db.data.users[m.sender].credit -= 1;
            }

            // Obtener el rango del usuario
            const userRank = getRank(global.db.data.users[m.sender].credit);

            // Resto del código para mostrar la respuesta
            let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender;
            let pp = await conn.profilePictureUrl(who, 'image').catch(_ => './src/avatar_contact.png');

            let str = `─────────────────────
*[✳️]* *N° DE DNI:* ${reniecData.cReniecDni} - ${resultado.codigo_verificacion}
*[🛑]* *PRE NOMBRES:* ${reniecData.cReniecNombres}
*[🛑]* *APELLIDO PATERNO:* ${reniecData.cReniecApel_pate}
*[🛑]* *APELLIDO MATERNO:* ${reniecData.cReniecApel_mate}
*[🛑]* *GENERO:* ${generoTraducido}
*[🛑]* *ESTADO CIVIL:* ${reniecData.cReniecEsta_civi}
*[🛑]* *FECHA DE NACIMIENTO:* ${resultado.fecha_nacimiento}
*[🛑]* *RESTRICCIÓN:* ${reniecData.cReniecRestricciones}
*[🛑]* *DISTRITO:* ${reniecData.cReniecUbigeo}
*[🛑]* *DIRECCIÓN:* ${reniecData.cReniecDireccion}
*[🛑]* *FOTO ENLACE:* ${reniecData.cReniecFotografia}
─────────────────────
*[⚙️]* *CREDS:* *${isPremium ? 'INFINITO' : global.db.data.users[m.sender].credit}*
*[⚙️]* *RANGO:* *${userRank}*
*[⚙️]* *BY:* @${who.replace(/@.+/, '')}
─────────────────────`;

            conn.sendFile(m.chat, pp, 'perfil.jpg', str, m, false, { mentions: [who] });
            m.react(done);
        } else {
            conn.reply(m.chat, '*[⚠️]* INTÉNTALO MÁS TARDE | MANTENIMIENTO', m);
        }
    } catch (error) {
        console.error('*[⚠️]* ERROR AL CONSULTAR AL SERVIDOR:', error);
        conn.reply(m.chat, '*[⚠️]* OCURRIÓ UN ERROR AL CONSULTAR LA INFORMACIÓN DEL DNI. POR FAVOR, INTENTA NUEVAMENTE.', m);
    }
};

// Obtener el rango del usuario
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

// Obtener el tiempo de antispam según el rango
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

handler.help = ['dnix'];
handler.tags = ['advanced'];
handler.command = ['dnix'];

export default handler;