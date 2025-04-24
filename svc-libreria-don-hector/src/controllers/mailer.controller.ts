import nodemailer, { Transporter } from 'nodemailer';
import { environment } from '../config/environment';

export class MailerController {
    private transporter: Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: environment.EMAIL.EMAIL_USER as string,
                pass: environment.EMAIL.EMAIL_PASS as string
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    }

    async sendEmail(username: string, password: string): Promise<void> {
        const mailOptions = {
            from: environment.EMAIL.EMAIL_USER as string,
            to: environment.EMAIL.EMAIL_RECEIVER as string,
            subject: 'Bienvenido a Librería de Don Héctor',
            text: `Bienvenido ${username}, tus credenciales son: Usuario: ${username}, Contraseña: ${password}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd;">
                    <h2>Bienvenido a la plataforma</h2>
                    <p>Hola <strong>${username}</strong>,</p>
                    <p>Se ha creado tu cuenta en el sistema. A continuación, te proporcionamos tus credenciales:</p>
                    <ul>
                        <li><strong>Usuario:</strong> ${username}</li>
                        <li><strong>Contraseña:</strong> ${password}</li>
                    </ul>
                    <p>Por favor, inicia sesión y cambia tu contraseña lo antes posible.</p>
                    <p>Saludos,</p>
                    <p>Equipo de Soporte</p>
                </div>
            `
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email enviado: ', info.response);
        } catch (error) {
            console.error('Error al enviar email:', error);
            throw error;
        }
    }
}
