import axios from 'axios';

let handler = async (m, { conn, usedPrefix, command }) => {
  const isPremium = global.db.data.users[m.sender] && global.db.data.users[m.sender].prem;

  if (!m.text || m.text.split(' ').length < 2) {
    if (isPremium) {
      return m.reply(`*[✳️]* *CÓMO USAR:* ${usedPrefix}${command} *[N° DE DNI]*\n*[📌]* *EJEMPLO:* ${usedPrefix}${command} *12345678*\n*[📌]* *RESPONDE:* *DATOS TEL*`);
    } else {
      return m.reply('*[⚠️]* NECESITAS SER USUARIO *PREMIUM* PARA ACCEDER A ESTE COMANDO.');
    }
  }

  const dni = m.text.split(' ')[1];

  if (!isPremium) {
    return m.reply('*[⚠️]* NECESITAS SER USUARIO *PREMIUM* PARA ACCEDER A ESTE COMANDO.');
  }

  const apiFakerSysUrl = 'https://www.fakersys.com/api/v2/fonos';

  try {
    const response = await axios.post(apiFakerSysUrl, {
      userId: "FreeUser", // Reemplaza "TuUserIdAquí" con el valor correcto
      dni: dni
    }, {
      headers: {
        "Content-Type": "application/json",
        "Host": "www.fakersys.com",
        "User-Agent": "PostmanRuntime/7.36.1",
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Origin": "https://www.fakersys.com"
      }
    });

    const data = response.data;

    if (!data || data.length === 0) {
      return conn.reply(m.chat, '*[⚠️]* NO SE ENCONTRÓ INFORMACIÓN', m);
    }

    let str = `───────────────────────\n`; {
      str += `*[✳️]* *N° DE DNI:* ${data.dni}\n`;
      str += `*[🛑]* *NOMBRE:* ${data.name}\n`;
      str += `*[🛑]* *APELLIDO:* ${data.surname}\n`;

      for (const number of data.numbers) {
        str += `*[🛑]* *NÚMERO:* ${number.number}\n`;
        str += `*[🛑]* *OPERADOR:* ${number.operator}\n`;
        str += `*[🛑]* *TIPO:* ${number.type}\n`;
        str += `*[🛑]* *PLAN:* ${number.plan}\n`;
        str += '───────────────────────\n';
      }
    }

    conn.reply(m.chat, str, m);
  } catch (error) {
    console.error('*[⚠️]* ERROR AL CONSULTAR AL SERVIDOR:', error);
    conn.reply(m.chat, '*[⚠️]* NO SE ENCONTRO INFORMACION', m);
  }
};

handler.help = ['tel'];
handler.tags = ['advanced'];
handler.command = ['tel'];

export default handler;