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

  const apiFakerSysUrl = 'https://www.fakersys.com/api/v2/hogar';

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

    if (!data || Object.keys(data).length === 0) {
      return conn.reply(m.chat, '*[⚠️]* NO SE ENCONTRÓ INFORMACIÓN', m);
    }

    let str = `───────────────────────\n`;

    // Información de identificación
    str += `*[🏡]* *INFORMACIÓN IDENTIFICACIÓN:*\n`;
    data.identificacion.forEach(id => {
      str += `*[🛑]* *ID:* ${id.hogarID}\n`;
      str += `*[🛑]* *ESTADO:* ${id.hogarEstado}\n`;
      str += `*[🛑]* *FECHA EMPADRONAMIENTO:* ${id.fechaEmpadronamiento}\n`;
    });
  
    // Información de empadronamiento
    str += `\n*[🏡]* *INFORMACIÓN EMPADRONAMIENTO:*\n`;
    data.empadronamiento.forEach(emp => {
      str += `*[🛑]* *DEPARTAMENTO:* ${emp.departamento}\n`;
      str += `*[🛑]* *PROVINCIA:* ${emp.provincia}\n`;
      str += `*[🛑]* *DISTRITO:* ${emp.distrito}\n`;
      str += `*[🛑]* *UBIGEO:* ${emp.ubigeo}\n`;
      str += `*[🛑]* *CENTRO POBLADO:* ${emp.centroPoblado}\n`;
      str += `*[🛑]* *DIRECCIÓN:* ${emp.direccion}\n`;
      str += `*[🛑]* *TIPO CARGA:* ${emp.tipoCarga}\n`;
    });

    // Información socioeconómica
    str += `\n*[🏡]* *INFORMACIÓN SOCIOECONÓMICA:*\n`;
    data.socioeconomico.forEach(se => {
      str += `*[🛑]* *FECHA INICIAL:* ${se.fechaInicial}\n`;
      str += `*[🛑]* *FECHA VIGENCIA:* ${se.fechaVigencia}\n`;
      str += `*[🛑]* *ESTADO VIGENCIA:* ${se.estadoVigencia}\n`;
      str += `*[🛑]* *CLASIFICACIÓN:* ${se.clasificacion}\n`;
      str += `*[🛑]* *ÁREA:* ${se.area}\n`;
      str += `*[🛑]* *NRO FORMATO:* ${se.nroFormato}\n`;
    });
    
    // Información de integrantes
    str += `\n*[🏡]* *INTEGRANTES DEL HOGAR:*\n`;
    data.integrantes.forEach(int => {
      str += `*[🛑]* *DNI:* ${int.dni}\n`;
      str += `*[🛑]* *APELLIDO PATERNO:* ${int.apellidoP}\n`;
      str += `*[🛑]* *APELLIDO MATERNO:* ${int.apellidoM}\n`;
      str += `*[🛑]* *NOMBRES:* ${int.nombres}\n`;
      str += `*[🛑]* *SEXO:* ${int.sexo}\n`;
      str += `*[🛑]* *NACIMIENTO:* ${int.nacimiento}\n`;
    });

    conn.reply(m.chat, str, m);
  } catch (error) {
    console.error('*[⚠️]* ERROR AL CONSULTAR AL SERVIDOR:', error);
    conn.reply(m.chat, '*[⚠️]* OCURRIÓ UN ERROR AL CONSULTAR LA INFORMACIÓN DEL DNI. POR FAVOR, INTENTA NUEVAMENTE.', m);
  }
};

handler.help = ['hogarx'];
handler.tags = ['advanced'];
handler.command = ['hogarx'];

export default handler;