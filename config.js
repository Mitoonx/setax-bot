import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'

global.owner = [
  ['51906042857', '𝙄𝙈 𝙄𝙑𝘼𝙉𝘼 𝙍𝙓𝙓', true],
  ['51986613177']
] //Numeros de owner 

global.mods = [''] 
global.prems = ['51900000000', '51900000001']
global.APIs = { // API Prefix
  // name: 'https://website' 
  nrtm: 'https://fg-nrtm.ddns.net',
  fgmods: 'https://api.fgmods.xyz'
}
global.APIKeys = { // APIKey Here
  // 'https://website': 'apikey'
  'https://api.fgmods.xyz': 'DRLg5kY7'
}

// Sticker WM
global.packname = 'StickersSetax' 
global.author = 'StickersSetax' 

//--info FG
global.botName = 'setax-bot'
global.fgig = 'https://www.instagram.com/' 
global.fgsc = 'https://github.com/' 
global.fgyt = 'https://youtube.com/'
global.fgpyp = 'https://paypal.me/'
global.fglog = 'https://i.ibb.co/1zdz2j3/logo.jpgs' 

//--- Grupos WA
global.fgcanal = 'https://whatsapp.com/'
global.bgp = 'https://chat.whatsapp.com/'
global.bgp2 = 'https://chat.whatsapp.com/'
global.bgp3 = 'https://chat.whatsapp.com/' //--GP NSFW

global.wait = '⌛ _Cargando..._\n*▬▬▬▭*'
global.rwait = '⌛'
global.dmoji = '🤭'
global.done = '✅'
global.error = '❌' 
global.xmoji = '🔥' 

global.multiplier = 69 
global.maxwarn = '2' // máxima advertencias

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
