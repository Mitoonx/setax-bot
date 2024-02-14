
import cheerio from 'cheerio';
import fetch from 'node-fetch';
let handler = async (m, { conn, text }) => {
	
if (!text) throw `*[✳️]* REPITA AGREGANDO UN TEXTO DE BUSQUEDA O PREGUNTA\n*[🛑]* SERVIDOR CONECTADO ONLINE A *OPENAI*`;
m.react('💬')

	try {
		let gpt = await fetch(global.API('fgmods', '/api/info/openai2', { text }, 'apikey'));
        let res = await gpt.json()
        await m.reply(res.result)
	} catch {
		m.reply(`*[❌]* ERROR EN EL SERVIDOR - INTENTA NUEVAMENTE`);
	}

}
handler.help = ['ai <text>']; 
handler.tags = ['tools'];
handler.command = ['ia', 'ai', 'chatgpt', 'openai', 'gpt'];

export default handler;
