import { execSync } from 'child_process';

let handler = async (m, { conn, text }) => {
    try {
        m.react('✅');

        if (conn.user.jid == conn.user.jid) {
            // Verifica si hay cambios locales sin confirmar
            let isDirty = execSync('git diff-index --quiet HEAD --');

            if (isDirty) {
                // Guarda los cambios locales en un stash
                execSync('git stash');

                // Realiza un pull desde GitHub
                let stdout = execSync('git pull' + (m.fromMe && text ? ' ' + text : ''));

                // Aplica los cambios del stash (si hay alguno)
                execSync('git stash apply');
            } else {
                // No hay cambios locales sin confirmar, simplemente realiza el pull
                let stdout = execSync('git pull' + (m.fromMe && text ? ' ' + text : ''));
            }

            conn.reply(m.chat, 'Actualización exitosa', m);
        }
    } catch (error) {
        conn.reply(m.chat, 'Error al actualizar: ' + error.message, m);
    }
}

handler.help = ['update'];
handler.tags = ['owner'];
handler.command = ['update'];
handler.rowner = true;

export default handler;
