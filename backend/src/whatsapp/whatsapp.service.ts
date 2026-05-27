import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, LocalAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';

@Injectable()
export class WhatsappService implements OnModuleInit {
    private client!: Client;

    // OnModuleInit hace que esto se ejecute automáticamente al arrancar Nest.js
    onModuleInit() {
        this.client = new Client({
            authStrategy: new LocalAuth(), // Guarda la sesión para que no escanees el QR cada vez que reinicias
            puppeteer: {
                args: ['--no-sandbox', '--disable-setuid-sandbox'], // ¡Clave para que funcione dentro de Docker!
            }
        });

        // 1. Cuando la librería necesite que inicies sesión, mostrará el QR
        this.client.on('qr', (qr) => {
            console.log('🤖 Escanea este QR con el WhatsApp de gymStrike:');
            qrcode.generate(qr, { small: true });
        });

        // 2. Cuando el escaneo sea exitoso
        this.client.on('ready', () => {
            console.log('✅ ¡WhatsApp conectado y listo para enviar mensajes!');
        });

        // Iniciar el cliente
        this.client.initialize();
    }

    // Método que llamarás desde otros lugares para enviar el texto
      async enviarMensajeTexto(telefono: string, mensaje: string) {
        try {
            // WhatsApp requiere un formato específico: CódigoPaís + Número + @c.us
            // Ejemplo: Si recibimos "04147878164", quitamos el 0 inicial y agregamos "58" (Venezuela)
            let numeroLimpio = telefono.startsWith('0') ? telefono.substring(1) : telefono;
            const chatId = `58${numeroLimpio}@c.us`; 

            await this.client.sendMessage(chatId, mensaje);
            console.log(`Mensaje enviado con éxito a ${telefono}`);
            return true;
        } catch (error) {
            console.error('Error enviando mensaje de WhatsApp:', error);
            return false;
        }
    }
}