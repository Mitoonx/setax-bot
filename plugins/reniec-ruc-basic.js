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

  // Verificar si se proporciona un número de RUC
  if (!m.text || m.text.split(' ').length < 2) {
    return m.reply(`*[✳️]* *CÓMO USAR:* ${usedPrefix}${command} *[N° DE RUC]*\n*[📌]* *EJEMPLO:* ${usedPrefix}${command} *20569339309*\n*[📌]* *RESPONDE:* *DATOS BASICOS*`);
  }

  // Extraer el RUC del mensaje
  const ruc = m.text.split(' ')[1];

  // Reemplazar la URL y el token por los correctos de la nueva API
  const apiPeruDevUrl = `https://apiperu.dev/api/ruc/${ruc}`;
  const token = '0343449e37bfe64e20da188fd07b778eb41c844c21d8d53e843bdcd34e9bcd56';

  try {
    const response = await axios.get(apiPeruDevUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = response.data;

    // Verificar si los campos esperados están presentes en la respuesta
    if (data && data.success && data.data) {
      // Ajustar la respuesta según la estructura de la nueva API
      let str = `───────────────────────
*[✳️]* *N° RUC:* ${ruc}
*[🛑]* *RAZÓN SOCIAL:* ${data.data.nombre_o_razon_social}
*[🛑]* *DIRECCIÓN:* ${data.data.direccion}
*[🛑]* *ESTADO:* ${data.data.estado}
*[🛑]* *CONDICIÓN:* ${data.data.condicion}
*[🛑]* *DEPARTAMENTO:* ${data.data.departamento}
*[🛑]* *PROVINCIA:* ${data.data.provincia}
*[🛑]* *DISTRITO:* ${data.data.distrito}
*[🛑]* *UBIGEO SUNAT:* ${data.data.ubigeo_sunat}
───────────────────────`;

      const userName = await conn.getName(m.sender);
      str += `\n*[⚙️]* *CREDS:* *${global.db.data.users[m.sender]?.prem ? 'INFINITO' : global.db.data.users[m.sender]?.credit}*
*[⚙️]* *RANGO:* *${rank}*
*[⚙️]* *BY:* *${userName.toUpperCase()}*
───────────────────────`;

      conn.reply(m.chat, str, m);
    } else {
      conn.reply(m.chat, '*[❌]* NÚMERO DE RUC INVÁLIDO, INTENTA NUEVAMENTE.', m);
    }
  } catch (error) {
    console.error('*[⚠️]* ERROR AL CONSULTAR AL SERVIDOR:', error);
    conn.reply(m.chat, '*[⚠️]* OCURRIÓ UN ERROR AL CONSULTAR LA INFORMACIÓN DEL RUC. POR FAVOR, INTENTA NUEVAMENTE.', m);
  }

  // Restablecer el tiempo de la última consulta
  lastQueryTime[m.sender] = currentTime;
};

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

handler.help = ['ruc'];
handler.tags = ['advanced'];
handler.command = ['ruc'];

export default handler;
