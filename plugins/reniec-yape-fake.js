import axios from 'axios';

let handler = async (m, { conn, usedPrefix, command }) => {
  const currentTime = Date.now();
  const antispamDelay = getAntispamDelay(getRank(global.db.data.users[m.sender].credit));
  const lastQueryTime = global.db.data.users[m.sender].lastQueryTime || 0;
  const userRank = getRank(global.db.data.users[m.sender].credit);
  const who = conn.getName(m.sender);

  // Verificar antispam
  if (lastQueryTime && currentTime - lastQueryTime < antispamDelay) {
    const remainingTime = Math.ceil((antispamDelay - (currentTime - lastQueryTime)) / 1000);
    return m.reply(`*[⚠️]* DEBES ESPERAR *${remainingTime}* SEGUNDOS ANTES DE REALIZAR OTRA CONSULTA.`);
  }

  // Restar 5 créditos al usuario si tiene créditos disponibles
  if (global.db.data.users[m.sender].credit > 0) {
    global.db.data.users[m.sender].credit -= 5;
  }

  // Verificar si el usuario es premium
  const isPremium = global.db.data.users[m.sender] && global.db.data.users[m.sender].prem;

  // Si no es premium y no tiene créditos, informar al usuario
  if (!isPremium && global.db.data.users[m.sender].credit <= 0) {
    return m.reply('*[⚠️]* NECESITAS SER USUARIO *PREMIUM* O *TENER CRÉDITOS* PARA ACCEDER A ESTE COMANDO.');
  }

  // Actualizar el tiempo de la última consulta
  global.db.data.users[m.sender].lastQueryTime = currentTime;

  if (!m.text || m.text.split(' ').length < 2) {
    if (isPremium) {
      return m.reply(`*[✳️]* *CÓMO USAR:* ${usedPrefix}${command} *[|NOMBRES|MONTO|TELÉFONO]*\n*[📌]* *EJEMPLO:* ${usedPrefix}${command} *|JOSE PEDRO CASTILLO TERRONES|400|999*\n*[📌]* *RESPONDE:* *CAPTURA PAGO YAPE FAKE*`);
    } else {
      return m.reply('*[⚠️]* NECESITAS SER USUARIO *PREMIUM* O *TENER CRÉDITOS* PARA ACCEDER A ESTE COMANDO.');
    }
  }

  const input = m.text.split('|');
  if (input.length !== 4) {
    return m.reply(`*[⚠️]* EL FORMATO ES INCORRECTO - DEBES ENVIAR EL COMANDO SEGUIDO DEL NOMBRE, MONTO Y TELÉFONO SEPARADOS POR '|'. *POR EJEMPLO:*\n*${usedPrefix}${command} |JOSE PEDRO CASTILLO TERRONES|400|999*`);
  }

  const [, nombre, monto, tel] = input;

  if (!isPremium) {
    return m.reply('*[⚠️]* NECESITAS SER USUARIO *PREMIUM* PARA ACCEDER A ESTE COMANDO.');
  }

  const apiYapeUrl = 'http://149.50.128.6/yape';

  try {
    const response = await axios.post(apiYapeUrl, {
      nombre: nombre,
      monto: monto,
      tel: tel,
      destino: 1
    });

    const data = response.data;

    if (!data || !data.datos || !data.datos.img) {
      return conn.reply(m.chat, '*[⚠️]* *NO SE RECIBIÓ NINGUNA RESPUESTA VIA YAPE ONLINE - POSIBLEMENTE ALGUNOS DATOS ESTEEN MAL*', m);
    }

    // Enviar la imagen base64 al usuario sin el comando en la parte superior
    conn.sendFile(m.chat, data.datos.img, 'yape.png',
      `──────────────────\n*[🛑]* *NOMBRE:* ${nombre.startsWith('/yape') ? nombre.slice(6) : nombre}\n*[🛑]* *MONTO:* ${monto} SOLES\n*[🛑]* *TELÉFONO:* XXX XXX ${tel}\n*[✳️]* *RESPUESTA:* CAPTURA YAPE REAL GENERADO EXITOSAMENTE\n──────────────────\n*[⚙️]* *CREDS:* *${isPremium ? 'INFINITO' : global.db.data.users[m.sender].credit}*\n*[⚙️]* *RANGO:* *${userRank}*\n*[⚙️]* *BY:* @${who.replace(/@.+/, '')}\n──────────────────`,
      m, false, { contextInfo: { mentionedJid: [m.sender] }, caption: '' }
    );
  } catch (error) {
    console.error('*[⚠️]* *ERROR AL CONSULTAR EL SERVIDOR:*', error);
    conn.reply(m.chat, '*[⚠️]* *OCURRIÓ UN ERROR AL REALIZAR LA TRANSACCIÓN CON YAPE ONLINE. POR FAVOR, INTENTA NUEVAMENTE.*', m);
  }
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

handler.help = ['yape'];
handler.tags = ['advanced'];
handler.command = ['yape'];

export default handler;
