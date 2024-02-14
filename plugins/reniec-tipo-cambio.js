import axios from 'axios';

let handler = async (m, { conn, usedPrefix, command }) => {
  // Verificar si se proporciona una fecha
  if (!m.text || m.text.split(' ').length < 2) {
    return m.reply(`*[✳️]* *CÓMO USAR:* ${usedPrefix}${command} *[YYYY-MM-DD]*\n*[📌]* *EJEMPLO:* ${usedPrefix}${command} *2023-11-18*\n*[📌]* *RESPONDE:* *TIPO DE CAMBIO*`);
  }

  // Extraer la fecha del mensaje
  const date = m.text.split(' ')[1];

  // Reemplazar la URL y la clave por los correctos de la nueva API
  const apiPeruDevsUrl = `https://api.perudevs.com/api/v1/exchange-rate?date=${date}&key=cGVydWRldnMucHJvZHVjdGlvbi5maXRjb2RlcnMuNjU1OTQzOTQxZTRjZmUyNGY0ZjZjNjcw`;

  try {
    const response = await axios.get(apiPeruDevsUrl);

    const data = response.data;

    // Verificar si los campos esperados están presentes en la respuesta
    if (data && data.estado && data.resultado) {
      const resultado = data.resultado;
      // Ajustar la respuesta según la estructura de la nueva API
      let str = `───────────────────────
*[✳️]* *FECHA:* ${resultado.fecha}
*[🛑]* *TASA DE COMPRA:* ${resultado.compra}
*[🛑]* *TASA DE VENTA:* ${resultado.venta}
───────────────────────`;

      conn.reply(m.chat, str, m);
    } else {
      conn.reply(m.chat, '*[⚠️]* NO SE ENCONTRARON RESULTADOS PARA LA FECHA PROPORCIONADA. POR FAVOR, VERIFICA LA INFORMACIÓN E INTENTA NUEVAMENTE.', m);
    }
  } catch (error) {
    console.error('*[⚠️]* ERROR AL CONSULTAR AL SERVIDOR:', error);
    conn.reply(m.chat, '*[⚠️]* OCURRIÓ UN ERROR AL CONSULTAR EL TIPO DE CAMBIO. POR FAVOR, INTENTA NUEVAMENTE.', m);
  }
};

handler.help = ['tipocambio'];
handler.tags = ['advanced'];
handler.command = ['tc'];

export default handler;
