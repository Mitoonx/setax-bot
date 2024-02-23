import { execSync } from 'child_process';

let handler = async (m, { conn, text }) => {
    try {
        // Utiliza un emoji específico en lugar de 'done'
        m.react('✅');

        if (conn.user.jid == conn.user.jid) {
            let stdout = execSync('git pull' + (m.fromMe && text ? ' ' + text : ''))
            //require('fs').readdirSync('plugins').map(v=>global.reload('', v))
            conn.reply(m.chat, stdout.toString(), m);
        }
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir durante el proceso
        conn.reply(m.chat, 'Error al actualizar: ' + error.message, m);
    }
}

handler.help = ['update'];
handler.tags = ['owner'];
handler.command = ['update', 'actualizar', 'fix', 'fixed'];
handler.rowner = true;

export default handler;
