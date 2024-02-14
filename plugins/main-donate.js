
let handler = async(m, { conn, usedPrefix, command }) => {

    let don = `
≡ ${mssg.donate}

▢ *YAPE - PERÚ*
• *N° :* +51986613177

▢ *PLIN - PERÚ*
• *N° :* +51986613177
`
let img = 'https://i.ibb.co/37FP2bk/donate.jpg'
conn.sendFile(m.chat, img, 'img.jpg', don, m, null, rpyp)
//conn.sendPayment(m.chat, '2000', 'USD', don, m.sender, m)
}

handler.help = ['donate']
handler.tags = ['main']
handler.command = ['apoyar', 'donate', 'donar'] 

export default handler

