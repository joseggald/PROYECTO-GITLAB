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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
class Logger {
    static getTime() {
        return new Date().toLocaleTimeString();
    }
    static formatMessage(level, color, message) {
        return `${color}[${this.getTime()}][${level}] ${message}${this.COLORS.reset}`;
    }
    static info(message, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(this.formatMessage('INFO', this.COLORS.blue, message), ...args);
        });
    }
    static error(message, error) {
        return __awaiter(this, void 0, void 0, function* () {
            console.error(this.formatMessage('ERROR', this.COLORS.red, message));
            if (error === null || error === void 0 ? void 0 : error.stack) {
                console.error(`${this.COLORS.red}${error.stack}${this.COLORS.reset}`);
            }
            else if (error) {
                console.error(`${this.COLORS.red}${error}${this.COLORS.reset}`);
            }
        });
    }
    static warn(message, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            console.warn(this.formatMessage('WARN', this.COLORS.yellow, message), ...args);
        });
    }
    static debug(message, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.enabled)
                return;
            console.debug(this.formatMessage('DEBUG', this.COLORS.gray, message), ...args);
        });
    }
    static ok(message, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(this.formatMessage('OK', this.COLORS.green, message), ...args);
        });
    }
    static log(message, type = 'info') {
        const colorMap = {
            info: this.COLORS.blue,
            error: this.COLORS.red,
            warn: this.COLORS.yellow,
            debug: this.COLORS.gray,
            ok: this.COLORS.green
        };
        console.log(this.formatMessage(type.toUpperCase(), colorMap[type], message));
    }
}
exports.Logger = Logger;
Logger.enabled = process.env.DEBUG === 'true';
// Códigos de color ANSI
Logger.COLORS = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    blue: "\x1b[34m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    gray: "\x1b[90m",
    green: "\x1b[32m"
};
