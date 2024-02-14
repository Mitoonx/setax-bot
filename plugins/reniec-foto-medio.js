import axios from 'axios';

let handler = async (m, { conn, usedPrefix, command }) => {
  const isPremium = global.db.data.users[m.sender] && global.db.data.users[m.sender].prem;

  if (!m.text || m.text.split(' ').length < 2) {
    return m.reply(`*[✳️]* *CÓMO USAR:* ${usedPrefix}${command} *[N° DE DNI]*\n*[📌]* *EJEMPLO:* ${usedPrefix}${command} *12345678*`);
  }

  const dni = m.text.split(' ')[1];

  const apiReniecUrl = `https://sigeun.unam.edu.pe/api/pide/reniec?dni=${dni}`;

  try {
    const response = await axios.get(apiReniecUrl);
    const data = response.data.data;

    if (!data || Object.keys(data).length === 0) {
      return conn.reply(m.chat, '*[⚠️]* NO SE ENCONTRÓ INFORMACIÓN', m);
    }

    if (!isPremium) {
      return m.reply('*[⚠️]* NECESITAS SER USUARIO *PREMIUM* PARA ACCEDER A ESTE COMANDO.');
    }

    // Obtener la URL completa de la foto del DNI
    const fotoUrl = `https://sigeun.unam.edu.pe/${data.cReniecFotografia}`;

    // Verificar que la URL de la foto sea válida
    if (!fotoUrl.startsWith('https://sigeun.unam.edu.pe/')) {
      console.error('*[⚠️]* URL DE FOTO NO VÁLIDA:', fotoUrl);
      return conn.reply(m.chat, '*[⚠️]* OCURRIÓ UN ERROR AL OBTENER LA FOTO DEL DNI. POR FAVOR, INTENTA NUEVAMENTE.', m);
    }

    // Descargar la imagen
    const fotoBuffer = await axios.get(fotoUrl, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
      },
    });

    // Enviar la imagen
    conn.sendFile(m.chat, Buffer.from(fotoBuffer.data), 'foto.jpg', `Fotografía del DNI: ${dni}`, m);
  } catch (error) {
    console.error('*[⚠️]* ERROR AL CONSULTAR AL SERVIDOR:', error);
    conn.reply(m.chat, '*[⚠️]* OCURRIÓ UN ERROR AL CONSULTAR LA FOTO DEL DNI. POR FAVOR, INTENTA NUEVAMENTE.', m);
  }
};

handler.help = ['foto'];
handler.tags = ['advanced'];
handler.command = ['foto'];

export default handler;