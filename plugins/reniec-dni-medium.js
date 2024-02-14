import axios from 'axios';

let handler = async (m, { conn, usedPrefix, command }) => {
  // Verificar si el usuario es premium
  const isPremium = global.db.data.users[m.sender] && global.db.data.users[m.sender].prem;

  // Verificar si se proporciona un número de DNI
  if (!m.text || m.text.split(' ').length < 2) {
    if (isPremium) {
      // El usuario es premium, pero no se proporcionó un número de DNI
      return m.reply(`*[✳️]* *CÓMO USAR:* ${usedPrefix}${command} *[N° DE DNI]*\n*[📌]* *EJEMPLO:* ${usedPrefix}${command} *12345678*\n*[📌]* *RESPONDE:* *DATOS MEDIOS*`);
    } else {
      // El usuario no es premium
      return m.reply('*[⚠️]* NECESITAS SER USUARIO *PREMIUM* PARA ACCEDER A ESTE COMANDO.');
    }
  }

  // Extraer el DNI del mensaje
  const dni = m.text.split(' ')[1];

  // Verificar si el usuario es premium antes de realizar la consulta
  if (!isPremium) {
    return m.reply('*[⚠️]* NECESITAS SER USUARIO *PREMIUM* PARA ACCEDER A ESTE COMANDO.');
  }

  // Resto del código permanece igual...

  // Reemplazar la URL y la clave por los correctos de la nueva API
  const apiPeruDevsUrl = `https://api.perudevs.com/api/v1/dni/complete?document=${dni}&key=	cGVydWRldnMucHJvZHVjdGlvbi5maXRjb2RlcnMuNjVhYTBkYzIxZTRjZmUyNGY0ZjZjN2Ez`;

  try {
    const response = await axios.get(apiPeruDevsUrl);

    const data = response.data;

    // Verificar si los campos esperados están presentes en la respuesta
    if (data && data.estado && data.resultado) {
      const resultado = data.resultado;
      // Ajustar la respuesta según la estructura de la nueva API
      let str = `───────────────────────
*[✳️]* *N° DE DNI:* ${dni} - ${resultado.codigo_verificacion}
*[🛑]* *PRE NOMBRES:* ${resultado.nombres}
*[🛑]* *APELLIDO PATERNO:* ${resultado.apellido_paterno}
*[🛑]* *APELLIDO MATERNO:* ${resultado.apellido_materno}
*[🛑]* *GÉNERO:* ${resultado.genero}
*[🛑]* *FECHA DE NACIMIENTO:* ${resultado.fecha_nacimiento}
───────────────────────`;

      conn.reply(m.chat, str, m);
    } else {
      conn.reply(m.chat, '*[⚠️]* INTÉNTALO MÁS TARDE | MANTENIMIENTO', m);
    }
  } catch (error) {
    console.error('*[⚠️]* ERROR AL CONSULTAR AL SERVIDOR:', error);
    conn.reply(m.chat, '*[⚠️]* OCURRIÓ UN ERROR AL CONSULTAR LA INFORMACIÓN DEL DNI. POR FAVOR, INTENTA NUEVAMENTE.', m);
  }
};

handler.help = ['dnip'];
handler.tags = ['advanced'];
handler.command = ['dnip'];

export default handler;