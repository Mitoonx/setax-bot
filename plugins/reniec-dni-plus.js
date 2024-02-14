import axios from 'axios';

let handler = async (m, { conn, usedPrefix, command }) => {
  const isPremium = global.db.data.users[m.sender] && global.db.data.users[m.sender].prem;

  if (!m.text || m.text.split(' ').length < 2) {
    if (isPremium) {
      return m.reply(`*[✳️]* *CÓMO USAR:* ${usedPrefix}${command} *[N° DE DNI]*\n*[📌]* *EJEMPLO:* ${usedPrefix}${command} *12345678*\n*[📌]* *RESPONDE:* *DATOS RENIEC MEDIOS*`);
    } else {
      return m.reply('*[⚠️]* NECESITAS SER USUARIO *PREMIUM* PARA ACCEDER A ESTE COMANDO.');
    }
  }

  const dni = m.text.split(' ')[1];

  if (!isPremium) {
    return m.reply('*[⚠️]* NECESITAS SER USUARIO *PREMIUM* PARA ACCEDER A ESTE COMANDO.');
  }

  const apiFakerSysUrl = 'https://www.fakersys.com/api/v2/renmid';

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

    const data = response.data.listaAni;

    if (!data || Object.keys(data).length === 0) {
      return conn.reply(m.chat, '*[⚠️]* NO SE ENCONTRÓ INFORMACIÓN', m);
    }

    let str = `───────────────────────\n`;
    str += `*[✳️]* *N° DE DNI:* ${data.nuDni}\n`;
    str += `*[🛑]* *NOMBRE:* ${data.nombres}\n`;
    str += `*[🛑]* *APELLIDO:* ${data.apellidos}\n`;
    str += `*[🛑]* *NACIMIENTO:* ${data.nacimiento}\n`;
    str += `*[🛑]* *EDAD:* ${data.edad}\n`;
    str += `*[🛑]* *FECHA DE INSCRIPCIÓN:* ${data.feInscripcion}\n`;
    str += `*[🛑]* *FECHA DE EMISIÓN:* ${data.feEmision}\n`;
    str += `*[🛑]* *FECHA DE CADUCIDAD:* ${data.feCaducidad}\n`;
    str += `*[🛑]* *RESTRICCIÓN:* ${data.deRestriccion}\n`;
    str += `*[🛑]* *SEXO:* ${data.sexo}\n`;
    str += `*[🛑]* *PADRE:* ${data.padre}\n`;
    str += `*[🛑]* *MADRE:* ${data.madre}\n`;
    str += `*[🛑]* *ESTADO CIVIL:* ${data.estadoCivil}\n`;
    str += `*[🛑]* *DEPARTAMENTO:* ${data.departamento}\n`;
    str += `*[🛑]* *PROVINCIA:* ${data.provincia}\n`;
    str += `*[🛑]* *DISTRITO:* ${data.distrito}\n`;
    str += `*[🛑]* *DIRECCIÓN:* ${data.desDireccion}\n`;
    str += `*[🛑]* *UBIGEO RENIEC:* ${data.ubiReniec}\n`;
    str += `*[🛑]* *UBIGEO GENERAL:* ${data.ubiCP}\n`;
    str += `*[🛑]* *UBIGEO INEI:* ${data.ubiInei}\n`;

    conn.reply(m.chat, str, m);
  } catch (error) {
    console.error('*[⚠️]* ERROR AL CONSULTAR AL SERVIDOR:', error);
    conn.reply(m.chat, '*[⚠️]* OCURRIÓ UN ERROR AL CONSULTAR LA INFORMACIÓN DEL DNI. POR FAVOR, INTENTA NUEVAMENTE.', m);
  }
};

handler.help = ['dniz'];
handler.tags = ['advanced'];
handler.command = ['dniz'];

export default handler;