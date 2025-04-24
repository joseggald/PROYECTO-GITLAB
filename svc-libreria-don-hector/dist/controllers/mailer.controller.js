"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailerController = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const environment_1 = require("../config/environment");
class MailerController {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: environment_1.environment.EMAIL.EMAIL_USER,
                pass: environment_1.environment.EMAIL.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    }
    sendEmail(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailOptions = {
                from: environment_1.environment.EMAIL.EMAIL_USER,
                to: environment_1.environment.EMAIL.EMAIL_RECEIVER,
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
                const info = yield this.transporter.sendMail(mailOptions);
                console.log('Email enviado: ', info.response);
            }
            catch (error) {
                console.error('Error al enviar email:', error);
                throw error;
            }
        });
    }
}
exports.MailerController = MailerController;
