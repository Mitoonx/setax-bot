import axios from 'axios';

// Variable para rastrear el tiempo de la última consulta
let lastQueryTime = {};

let handler = async (m, { conn, usedPrefix, command }) => {
  const isPremium = global.db.data.users[m.sender] && global.db.data.users[m.sender].prem;
  const isPremiumRequired = true; // Establecer en true si se requiere premium para este comando

  // Verificar el rango del usuario para determinar el antispam
  const rank = getRank(global.db.data.users[m.sender].credit);
  const antispamDelay = getAntispamDelay(rank);

  // Verificar si ha pasado suficiente tiempo desde la última consulta
  const currentTime = Date.now();
  if (lastQueryTime[m.sender] && currentTime - lastQueryTime[m.sender] < antispamDelay) {
    const remainingTime = Math.ceil((antispamDelay - (currentTime - lastQueryTime[m.sender])) / 1000);
    return m.reply(`*[⚠️]* DEBES ESPERAR *${remainingTime}* SEGUNDOS ANTES DE REALIZAR OTRA CONSULTA.`);
  }

  if (!m.text || m.text.split(' ').length < 2) {
    if (isPremium || !isPremiumRequired) {
      return m.reply(`*[✳️]* *CÓMO USAR:* ${usedPrefix}${command} *[N° DE PLACA]*\n*[📌]* *EJEMPLO:* ${usedPrefix}${command} *C9k460*\n*[📌]* *RESPONDE:* *DATOS SOAT*`);
    } else {
      return m.reply('*[⚠️]* NECESITAS SER USUARIO *PREMIUM* O *TENER CRÉDITOS* PARA ACCEDER A ESTE COMANDO.');
    }
  }

  const plate = m.text.split(' ')[1];

  // Verificar si el usuario es premium antes de restar créditos
  if (!isPremium && isPremiumRequired) {
    // Deduct 5 credits only if the user is not premium and premium is required
    if (global.db.data.users[m.sender].credit >= 5) {
      global.db.data.users[m.sender].credit -= 5;
    } else {
      return m.reply('*[⚠️]* NO TIENES *SUFICIENTES CRÉDITOS* PARA REALIZAR ESTA CONSULTA.');
    }
  }

  // Reemplazar la URL y la clave con las correctas para la nueva API
  const apiPeruApisUrl = `https://api.peruapis.com/v1/soat/?document=${plate}`;
  const apiKey = '86vO2WhtJKW7PMRhjfacwqHMnEAoKkXdvmyJTgouiAfeAAH9XQ8Vsp5TPFlw'; // Reemplazar con tu clave de API real

  try {
    const response = await axios.get(apiPeruApisUrl, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    const data = response.data;

    if (data && data.success && data.data && data.data.length > 0) {
      const userName = await conn.getName(m.sender);

      let str = `───────────────────────
*[✳️]* *N° DE PLACA:* ${plate}`;

      data.data.forEach(entry => {
        str += `\n*[🚗]* *EMPRESA:* ${entry.company.toUpperCase()}
*[📆]* *INICIO:* ${entry.starts_on.toUpperCase()}
*[🔚]* *EXPIRA:* ${entry.expires_on.toUpperCase()}
*[🛑]* *N° DE CERTIFICADO:* ${entry.certificate.toUpperCase()}
*[👤]* *USO:* ${entry.usage.toUpperCase()}
*[🚦]* *CLASE:* ${entry.class.toUpperCase()}
*[🔵]* *ESTADO:* ${entry.status.toUpperCase()}
───────────────────────`;
      });

      // Obtener el rango del usuario
      const userRank = getRank(global.db.data.users[m.sender].credit);

      str += `\n*[⚙️]* *CREDS:* *${isPremium ? 'INFINITO' : global.db.data.users[m.sender].credit}*
*[⚙️]* *RANGO:* *${userRank}*
*[⚙️]* *BY:* @${userName.toUpperCase()}
───────────────────────`;

      conn.reply(m.chat, str, m);
    } else {
      conn.reply(m.chat, '*[⚠️]* NO SE ENCONTRARON RESULTADOS PARA LA PLACA PROPORCIONADA. POR FAVOR, VERIFICA LA INFORMACIÓN E INTENTA NUEVAMENTE.', m);
    }
  } catch (error) {
    console.error('*[⚠️]* ERROR AL CONSULTAR AL SERVIDOR:', error);
    conn.reply(m.chat, '*[⚠️]* OCURRIÓ UN ERROR AL CONSULTAR LA INFORMACIÓN DEL SOAT. POR FAVOR, INTENTA NUEVAMENTE.', m);
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

handler.help = ['soat'];
handler.tags = ['advanced'];
handler.command = ['soat'];

export default handler;
