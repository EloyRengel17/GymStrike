import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, LocalAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';

@Injectable()
export class WhatsappService implements OnModuleInit {
    private client!: Client;
    private latestQr: string = '';
    private isConnected: boolean = false;

    onModuleInit() {
        this.initializeClient();
    }

    private initializeClient() {
        // Si ya existía una instancia previa, la destruimos limpiamente antes de recrearla
        if (this.client) {
            try {
                this.client.destroy();
            } catch (e) {
                // Ignorar errores al destruir cliente anterior
            }
        }

        this.client = new Client({
            authStrategy: new LocalAuth(),
            puppeteer: {
                headless: true,
                args: [
                    '--no-sandbox', 
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--disable-gpu'
                ],
            }
        });

        this.client.on('qr', (qr) => {
            this.latestQr = qr;       
            this.isConnected = false;
            console.log('🤖 Nuevo código QR generado. Escanéalo con WhatsApp:');
            qrcode.generate(qr, { small: true });
        });

        this.client.on('ready', () => {
            this.isConnected = true;
            this.latestQr = '';       
            console.log('✅ ¡WhatsApp conectado y listo para enviar mensajes!');
        });

        this.client.on('authenticated', () => {
            console.log('🔑 WhatsApp autenticado correctamente.');
        });

        this.client.on('auth_failure', (msg) => {
            this.isConnected = false;
            console.error('❌ Error de autenticación en WhatsApp:', msg);
        });

        // Si se desconecta o hay error de navegación, reintentamos inicializar solo después de unos segundos
        this.client.on('disconnected', (reason) => {
            this.isConnected = false;
            this.latestQr = '';
            console.warn('⚠️ WhatsApp desconectado. Motivo:', reason);
            console.log('🔄 Intentando reiniciar el cliente de WhatsApp en 5 segundos...');
            setTimeout(() => {
                this.initializeClient();
            }, 5000);
        });

        // Inicializamos atrapando cualquier error de navegación de Puppeteer para auto-recuperarnos
        this.client.initialize().catch((err) => {
            console.error('⚠️ Error al inicializar (posible navegación/contexto destruido):', err.message);
            console.log('🔄 Reiniciando cliente debido al error de inicio...');
            setTimeout(() => {
                this.initializeClient();
            }, 5000);
        });
    }

    getQrStatus() {
        return {
            isConnected: this.isConnected,
            qr: this.latestQr,
        };
    }

    async enviarMensajeTexto(telefono: string, mensaje: string) {
        try {
            if (!this.isConnected) {
                console.error('❌ No se puede enviar el mensaje: WhatsApp no está conectado.');
                return false;
            }

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