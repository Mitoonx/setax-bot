import axios from 'axios';

// Variable para rastrear el tiempo de la última consulta
let lastQueryTime = {};

let handler = async (m, { conn, usedPrefix, command }) => {
  // Verificar el rango del usuario para determinar el antispam
  const rank = getRank(global.db.data.users[m.sender]?.credit);
  const antispamDelay = getAntispamDelay(rank);

  // Verificar si ha pasado suficiente tiempo desde la última consulta
  const currentTime = Date.now();
  if (lastQueryTime[m.sender] && currentTime - lastQueryTime[m.sender] < antispamDelay) {
    const remainingTime = Math.ceil((antispamDelay - (currentTime - lastQueryTime[m.sender])) / 1000);
    return m.reply(`*[⚠️]* DEBES ESPERAR *${remainingTime}* SEGUNDOS ANTES DE REALIZAR OTRA CONSULTA.`);
  }

  // Verificar si se proporciona un número de DNI
  if (!m.text || m.text.split(' ').length < 2) {
    return m.reply(`*[✳️]* *CÓMO USAR:* ${usedPrefix}${command} *[N° DE DNI]*\n*[📌]* *EJEMPLO:* ${usedPrefix}${command} *12345678*\n*[📌]* *RESPONDE:* *DATOS BASICOS*`);
  }

  // Extraer el DNI del mensaje
  const dni = m.text.split(' ')[1];

  // Reemplazar la URL y el token por los correctos de la API de Reniec
  const reniecApiUrl = `https://api.apis.net.pe/v2/reniec/dni?numero=${dni}`;
  const token = 'apis-token-6447.-t3Z-hdrRAbQOKfy7E0oenXM-ynXxtKU';

  try {
    const response = await axios.get(reniecApiUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = response.data;

    // Mostrar los resultados de la API (puedes personalizar este mensaje)
    let str = `───────────────────────
*[✳️]* *N° DNI:* ${dni}
*[🛑]* *PRE NOMBRES:* ${data.nombres}
*[🛑]* *APELLIDO PATERNO:* ${data.apellidoPaterno}
*[🛑]* *APELLIDO MATERNO:* ${data.apellidoMaterno}
───────────────────────`;

    const userName = await conn.getName(m.sender);
    str += `\n*[⚙️]* *CREDS:* *${global.db.data.users[m.sender]?.prem ? 'INFINITO' : global.db.data.users[m.sender]?.credit}*
*[⚙️]* *RANGO:* *${rank}*
*[⚙️]* *BY:* *${userName.toUpperCase()}*
───────────────────────`;

    conn.reply(m.chat, str, m);
  } catch (error) {
    console.error('*[⚠️]* INTENTALO MÁS TARDE | MANTENIMIENTO', error);
    conn.reply(m.chat, '*[⚠️]* OCURRIÓ UN ERROR AL CONSULTAR LA INFORMACIÓN DEL DNI. POR FAVOR, INTENTA NUEVAMENTE.', m);
  }

  // Restablecer el tiempo de la última consulta
  lastQueryTime[m.sender] = currentTime;
};

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

handler.help = ['dni'];
handler.tags = ['advanced'];
handler.command = ['dni'];

export default handler;