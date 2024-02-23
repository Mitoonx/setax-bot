import { execSync } from 'child_process';

let handler = async (m, { conn, text }) => {
    try {
        m.react('✅');

        if (conn.user.jid == conn.user.jid) {
            // Hacer un stash de los cambios locales
            execSync('git stash');

            // Realizar un pull desde GitHub
            let stdout = execSync('git pull' + (m.fromMe && text ? ' ' + text : ''));

            // Aplicar los cambios del stash (si hay alguno)
            execSync('git stash apply');

            conn.reply(m.chat, stdout.toString(), m);
        }
    } catch (error) {
        conn.reply(m.chat, 'Error al actualizar: ' + error.message, m);
    }
}

handler.help = ['update'];
handler.tags = ['owner'];
handler.command = ['update', 'actualizar', 'fix', 'fixed'];
handler.rowner = true;

export default handler;
