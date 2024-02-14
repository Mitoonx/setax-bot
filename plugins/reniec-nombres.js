import axios from 'axios';

let handler = async (m, { conn, usedPrefix, command }) => {
  const isPremium = global.db.data.users[m.sender] && global.db.data.users[m.sender].prem;

  if (!m.text || m.text.split(' ').length < 2) {
    if (isPremium) {
      return m.reply(`*[✳️]* *CÓMO USAR:* ${usedPrefix}${command} *[NOMBRES|AP PATERNO|AP MATERNO|EDAD MIN-EDAD MAX]*\n*[📌]* *EJEMPLO:* ${usedPrefix}${command} *Pedro|Castillo|Terrones|40-60*\n*[📌]* *RESPONDE:* *DATOS NOMBRES RENIEC*`);
    } else {
      return m.reply('*[⚠️]* NECESITAS SER USUARIO *PREMIUM* PARA ACCEDER A ESTE COMANDO.');
    }
  }

  const nameAndAge = m.text.split(' ').slice(1).join(' ');
  const parts = nameAndAge.split('|');
  const names = parts[0] || "";
  const lastNames = [parts[1] || "", parts[2] || ""];
  const ageRange = parts[3] || "";

  let minAge = "";
  let maxAge = "";

  if (ageRange) {
    const ages = ageRange.split('-');
    minAge = ages[0] || "";
    maxAge = ages[1] || "";
  }

  if (!isPremium) {
    return m.reply('*[⚠️]* NECESITAS SER USUARIO *PREMIUM* PARA ACCEDER A ESTE COMANDO.');
  }

  const apiFakerSysUrl = 'https://www.fakersys.com/api/v2/name';

  try {
    const response = await axios.post(apiFakerSysUrl, {
      userId: "FreeUser",
      name: names,
      first_name: lastNames[0],
      last_name: lastNames[1],
      max_age: maxAge,
      min_age: minAge
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

    const data = response.data.listaAni;

    if (!data || data.length === 0) {
      return conn.reply(m.chat, '*[⚠️]* NO SE ENCONTRÓ INFORMACIÓN', m);
    }

    const result = data[0];

    let str = `───────────────────────\n`;
    str += `*[✳️]* *N° DE DNI:* ${result.nuDni} - ${result.digitoVerificacion}\n`;
    str += `*[🛑]* *APELLIDO PATERNO:* ${result.apePaterno}\n`;
    str += `*[🛑]* *APELLIDO MATERNO:* ${result.apeMaterno}\n`;
    str += `*[🛑]* *PRENOMBRES:* ${result.preNombres}\n`;
    str += `*[🛑]* *SEXO:* ${result.sexo}\n`;
    str += `*[🛑]* *EDAD:* ${result.nuEdad} AÑOS\n`;

    conn.reply(m.chat, str, m);
  } catch (error) {
    console.error('*[⚠️]* ERROR AL CONSULTAR AL SERVIDOR:', error);
    conn.reply(m.chat, '*[⚠️]* NO SE ENCONTRÓ INFORMACIÓN', m);
  }
};

handler.help = ['nm'];
handler.tags = ['advanced'];
handler.command = ['nm'];

export default handler;