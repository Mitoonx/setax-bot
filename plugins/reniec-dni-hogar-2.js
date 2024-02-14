import axios from 'axios';

// Variable para rastrear el tiempo de la última consulta
let lastQueryTime = {};

let handler = async (m, { conn, usedPrefix, command }) => {
  const isPremium = global.db.data.users[m.sender] && global.db.data.users[m.sender].prem;

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
    if (isPremium) {
      return m.reply(`*[✳️]* *CÓMO USAR:* ${usedPrefix}${command} *[N° DE DNI]*\n*[📌]* *EJEMPLO:* ${usedPrefix}${command} *12345678*\n*[📌]* *RESPONDE:* *DATOS HOGAR*`);
    } else {
      return m.reply('*[⚠️]* NECESITAS SER USUARIO *PREMIUM* O *TENER CRÉDITOS* PARA ACCEDER A ESTE COMANDO.');
    }
  }

  const dni = m.text.split(' ')[1];

  // Verificar si el usuario es premium antes de restar créditos
  if (!isPremium) {
    // Deduct 5 credits only if the user is not premium
    if (global.db.data.users[m.sender].credit >= 5) {
      global.db.data.users[m.sender].credit -= 5;
    } else {
      return m.reply('*[⚠️]* NO TIENES *SUFICIENTES CRÉDITOS* PARA REALIZAR ESTA CONSULTA.');
    }
  }

  // Restablecer el tiempo de la última consulta
  lastQueryTime[m.sender] = currentTime;

  const apiHogarUrl = 'http://161.132.39.19:5050/apiv1/hogar/' + dni;

  try {
    const response = await axios.get(apiHogarUrl, {
      headers: {
        "Content-Type": "application/json",
        "Host": "161.132.39.19:5050",
        "User-Agent": "PostmanRuntime/7.36.1",
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive"
      }
    });

    const data = response.data.datos_hogar;

    if (!data || Object.keys(data).length === 0) {
      return conn.reply(m.chat, '*[⚠️]* NO SE ENCONTRÓ INFORMACIÓN', m);
    }

    let str = `───────────────────────\n`;
    str += `*[🏡]* *INFORMACIÓN IDENTIFICACIÓN:*\n`;
    str += `\n*[🛑]* *DNI:* ${data.DatosIdentificacion.nuDni}\n`;
    str += `*[🛑]* *APELLIDO PATERNO:* ${data.DatosIdentificacion.apePaterno}\n`;
    str += `*[🛑]* *APELLIDO MATERNO:* ${data.DatosIdentificacion.apeMaterno}\n`;
    str += `*[🛑]* *PRENOMBRES:* ${data.DatosIdentificacion.preNombres}\n`;
    str += `*[🛑]* *SEXO:* ${data.DatosIdentificacion.sexo}\n`;
    str += `*[🛑]* *FECHA NACIMIENTO:* ${data.DatosIdentificacion.feNacimiento}\n`;
    str += `*[🛑]* *ESTADO HOGAR:* ${data.DatosIdentificacion.estadoHogar}\n`;
    str += `*[🛑]* *FECHA EMPADRONAMIENTO:* ${data.DatosIdentificacion.feEmpadronamiento}\n`;
    str += `*[🛑]* *ID HOGAR:* ${data.DatosIdentificacion.idHogar}\n`;

    // Información de lugar de empadronamiento
    str += `\n*[🏡]* *LUGAR EMPADRONAMIENTO:*\n`;
    const lugarEmpadronamiento = data.lugarEmpadronamiento;
    str += `\n*[🛑]* *CENTRO POBLADO:* ${lugarEmpadronamiento.centroPoblado}\n`;
    str += `*[🛑]* *CODIGO POBLADO:* ${lugarEmpadronamiento.codigoCentroPablado}\n`;
    str += `*[🛑]* *UBIGEO:* ${lugarEmpadronamiento.ubigeo}\n`;
    str += `*[🛑]* *DEPARTAMENTO:* ${lugarEmpadronamiento.departamento}\n`;
    str += `*[🛑]* *DISTRITO:* ${lugarEmpadronamiento.distrito}\n`;
    str += `*[🛑]* *PROVINCIA:* ${lugarEmpadronamiento.provincia}\n`;
    str += `*[🛑]* *DIRECCIÓN:* ${lugarEmpadronamiento.direccion}\n`;
    str += `*[🛑]* *REFERENCIA:* ${lugarEmpadronamiento.referenciaDomicilio}\n`;

    // Información socioeconómica
    str += `\n*[🏡]* *CLASIFICACIÓN SOCIOECONÓMICA:*\n`;
    const clasificacion = data.clasificacionSocioeconomica;
    str += `\n*[🛑]* *ESTADO:* ${clasificacion.estadoVigencia}\n`;
    str += `*[🛑]* *FECHA VIGENTE INICIAL:* ${clasificacion.feVigenteInicial}\n`;
    str += `*[🛑]* *FECHA VIGENTE FINAL:* ${clasificacion.feVigenteFinal}\n`;
    str += `*[🛑]* *TIPO HOGAR:* ${clasificacion.tipoHogar}\n`;
    str += `*[🛑]* *ÁREA:* ${clasificacion.area}\n`;

    // Información de integrantes
    str += `\n*[🏡]* *INTEGRANTES DEL HOGAR:*\n`;
    const integrantes = data.integrantesHogar;
    integrantes.forEach((int, index) => {
      str += `\n*[🏡]* *INTEGRANTE N°: ${index + 1}*\n`;
      str += `*[🛑]* *DNI:* ${int.nuDni}\n`;
      str += `*[🛑]* *APELLIDO PATERNO:* ${int.apePaterno}\n`;
      str += `*[🛑]* *APELLIDO MATERNO:* ${int.apeMaterno}\n`;
      str += `*[🛑]* *NOMBRES:* ${int.preNombres}\n`;
      str += `*[🛑]* *SEXO:* ${int.sexo}\n`;
      str += `*[🛑]* *NACIMIENTO:* ${int.feNacimiento}\n`;
    });

    str += `\n───────────────────────
*[⚙️]* *CREDS:* *${isPremium ? 'INFINITO' : global.db.data.users[m.sender].credit}*
*[⚙️]* *RANGO:* *${rank}*
───────────────────────`;

    conn.reply(m.chat, str, m);
  } catch (error) {
    console.error('*[⚠️]* ERROR AL CONSULTAR AL SERVIDOR:', error);
    conn.reply(m.chat, '*[⚠️]* EL DNI CONSULTADO NO SE ENCUENTRA REGISTRADO EN EL PGH', m);
  }
};

// Función para determinar el rango del usuario según sus créditos
function getRank(credit) {
  if (credit >= 1500) {
    return "PLUS";
  } else if (credit >= 500) {
    return "VIP";
  } else if (credit >= 1) {
    return "STANDARD";
  } else {
    return "FREE";
  }
}

// Función para obtener el tiempo de antispam según el rango del usuario
function getAntispamDelay(rank) {
  switch (rank) {
    case "PLUS":
      return 10 * 1000; // 10 segundos
    case "VIP":
      return 30 * 1000; // 30 segundos
    case "STANDARD":
      return 110 * 1000; // 110 segundos
    case "FREE":
      return 200 * 1000; // 200 segundos
    default:
      return 0;
  }
}

handler.help = ['hogarp'];
handler.tags = ['advanced'];
handler.command = ['hogarp'];

export default handler;