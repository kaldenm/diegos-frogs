// whatsapp.js
import qrcode from 'qrcode-terminal';
import { Client, LocalAuth, MessageMedia } from 'whatsapp-web.js';
import fs from 'fs';
import { generateFrog } from '../lib/generateFrog';
import 'dotenv/config';

let authCount = 0;

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

console.log('Starting up...');

client.on('qr', (qr) => {
    console.log('Please scan QR code');
    qrcode.generate(qr, { small: true });
});

client.on('authenticated', () => {
    authCount++;
    console.log(`Authentication #${authCount} - Session exists:`, fs.existsSync('.wwebjs_auth/session'));
});

client.on('auth_failure', msg => {
    console.error('Authentication failed:', msg);
});

client.on('ready', () => {
    console.log('Client is ready! Send a message and generate a frog from it...');
});

client.on('disconnected', (reason) => {
    console.log('Client was logged out:', reason);
});

// Listen for messages you create
client.on('message_create', async (msg) => {
    if (msg.fromMe && 
        msg.to === '17036277383@c.us' && 
        !msg.body.includes('🐸') && 
        msg.body.trim() !== '') {
        
        console.log('Processing new message:', msg.body);
        
        try {
            await client.sendMessage(msg.to, '🐸 Creating a frog inspired by: "' + msg.body + '"');
            
            const imageUrl = await generateFrog(msg.body);
            console.log('Frog generated at URL:', imageUrl);
            
            const media = await MessageMedia.fromUrl(imageUrl);
            await client.sendMessage(msg.to, media);
            
        } catch (error) {
            console.error('Error:', error);
            await client.sendMessage(msg.to, '❌ Error generating frog');
        }
    }
});

client.initialize().catch(err => {
    console.error('Failed to initialize:', err);
});