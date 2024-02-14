
import fetch from 'node-fetch';
export async function before(m, { conn }) {
   let pp = await this.profilePictureUrl(m.sender, 'image').catch(_ => 'https://i.ibb.co/1ZxrXKJ/avatar-contact.jpg');

  // Respuesta con enlace de WhatsApp
  global.rpl = {
    contextInfo: {
      externalAdReply: {
        mediaUrl: bgp,
        mediaType: '',
        description: '',
        title: packname,
        body: '',
        thumbnailUrl: pp,
        sourceUrl: bgp
      }
    }
  };

  // Respuesta con enlace de PayPal
  global.rpyp = {
    contextInfo: {
      externalAdReply: {
        mediaUrl: fgpyp,
        mediaType: '',
        description: '',
        title: '',
        body: '',
        thumbnailUrl: pp,
        sourceUrl: fgpyp
      }
    }
  };

  // Respuesta con enlace de Instagram
  global.rpig = {
    contextInfo: {
      externalAdReply: {
        mediaUrl: fgig,
        mediaType: 'VIDEO',
        description: '',
        title: '',
        body: '',
        thumbnailUrl: pp,
        sourceUrl: fgig
      }
    }
  };

  // Respuesta con enlace de YouTube
  global.rpyt = {
    contextInfo: {
      externalAdReply: {
        showAdAttribution: true,
        mediaUrl: fgyt,
        mediaType: '',
        description: '',
        title: '',
        body: '',
        thumbnailUrl: pp,
        sourceUrl: fgyt
      }
    }
  }
  
  
  
}
