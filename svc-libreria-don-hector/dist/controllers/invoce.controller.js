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
exports.InvoiceController = void 0;
const responses_1 = require("../utils/responses");
const Logger_1 = require("../utils/Logger");
const invoce_service_1 = require("../services/invoce.service");
const pdfkit_1 = __importDefault(require("pdfkit"));
const { sendSuccess, sendError } = responses_1.ResponseHandler;
class InvoiceController {
    constructor() {
        this.invoiceService = new invoce_service_1.InvoiceService();
    }
    createInvoice(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const invoiceData = req.body;
                Logger_1.Logger.info("Creando factura", invoiceData);
                const invoice = yield this.invoiceService.createInvoice(invoiceData);
                sendSuccess(res, "Factura creada correctamente", { invoice });
            }
            catch (error) {
                sendError(res, error.message, 500);
            }
        });
    }
    listInvoicesByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id_usuario } = req.params;
                Logger_1.Logger.info("Listando facturas del usuario", id_usuario);
                const invoices = yield this.invoiceService.getInvoicesByUser(id_usuario);
                sendSuccess(res, "Facturas listadas correctamente", { invoices });
            }
            catch (error) {
                sendError(res, error.message, 500);
            }
        });
    }
    getInvoiceById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id_factura } = req.params;
                Logger_1.Logger.info("Consultando factura", id_factura);
                const invoice = yield this.invoiceService.getInvoiceById(id_factura);
                if (!invoice) {
                    sendError(res, "Factura no encontrada", 404);
                    return;
                }
                sendSuccess(res, "Factura encontrada", { invoice });
            }
            catch (error) {
                sendError(res, error.message, 500);
            }
        });
    }
    getPaymentMethods(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                Logger_1.Logger.info("Consultando métodos de pago");
                const methods = yield this.invoiceService.getPaymentMethods();
                sendSuccess(res, "Métodos de pago obtenidos correctamente", { methods });
            }
            catch (error) {
                sendError(res, error.message, 500);
            }
        });
    }
    getAllInvoices(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                Logger_1.Logger.info("Consultando todas las facturas");
                const invoices = yield this.invoiceService.getAllInvoices();
                sendSuccess(res, "Facturas obtenidas correctamente", { invoices });
            }
            catch (error) {
                sendError(res, error.message, 500);
            }
        });
    }
    generateInvoicePDF(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id_factura } = req.params;
                if (!id_factura) {
                    res.status(400).json({ status: "error", message: "El ID de la factura es obligatorio." });
                    return;
                }
                //Obtener la factura desde el Service
                const factura = yield this.invoiceService.getInvoiceById(id_factura);
                if (!factura) {
                    res.status(404).json({ status: "error", message: "Factura no encontrada." });
                    return;
                }
                //Configurar los encabezados HTTP para la descarga
                res.setHeader("Content-Disposition", `attachment; filename=factura_${id_factura}.pdf`);
                res.setHeader("Content-Type", "application/pdf");
                //Crear el documento PDF
                const doc = new pdfkit_1.default({ margin: 50 });
                doc.pipe(res);
                const headerX = 50;
                const headerValueX = 280;
                let headerY = doc.y + 20;
                doc.fontSize(22).fillColor("#007BFF").text("Factura", { align: "center" });
                doc.moveDown(2);
                //Encabezados y valores alineados con más separación
                doc.fontSize(12).fillColor("black")
                    .text("Factura ID", headerX, headerY, { width: 200, align: "right", continued: true })
                    .text(`${factura.id_factura}`, headerValueX, headerY, { width: 250, align: "left" });
                headerY += 25;
                const fechaEmision = new Date(factura.fecha_emision).toLocaleDateString("es-ES");
                doc.text("Fecha de emisión", headerX, headerY, { width: 200, align: "right", continued: true });
                doc.text(fechaEmision, headerValueX, headerY, { width: 250, align: "left" });
                headerY += 25;
                doc.text("Comprador", headerX, headerY, { width: 200, align: "right", continued: true })
                    .text(`${factura.nombre_comprador}`, headerValueX, headerY, { width: 250, align: "left" });
                headerY += 25;
                // 🔹 ✅ Si la dirección es muy larga, dividir en múltiples líneas
                doc.text("Dirección de entrega", headerX, headerY, { width: 200, align: "right", continued: true });
                doc.text(`${factura.direccion_entrega}`, headerValueX, headerY, { width: 250, align: "left" });
                headerY += (factura.direccion_entrega.length > 30 ? 35 : 25); // 🔹 Ajusta la altura si es muy larga
                doc.text("Método de pago", headerX, headerY, { width: 200, align: "right", continued: true })
                    .text(`${factura.metodo_pago_tipo}`, headerValueX, headerY, { width: 250, align: "left" });
                headerY += 25;
                // 🔹 Línea separadora con más espacio debajo
                doc.moveTo(headerX, headerY).lineTo(550, headerY).stroke();
                doc.moveDown(2);
                // **Detalles del cliente**
                doc.fontSize(14).text("Datos del Cliente:");
                doc.fontSize(12).text(`Nombre: ${factura.cliente_nombre} ${factura.cliente_apellido}`);
                doc.text(`Edad: ${factura.cliente_edad}`);
                doc.text(`Fecha de Registro: ${factura.cliente_fecha_registro}`);
                doc.moveDown();
                // **Detalles del empleado (si existe)**
                if (factura.id_empleado) {
                    doc.fontSize(14).text("Atendido por:");
                    doc.fontSize(12).text(`Empleado: ${factura.empleado_nombre} ${factura.empleado_apellido}`);
                    doc.text(`Teléfono: ${factura.empleado_telefono}`);
                    doc.text(`Género: ${factura.empleado_genero}`);
                    doc.text(`Fecha de Contratación: ${factura.empleado_fecha_contratacion}`);
                    doc.moveDown();
                }
                // **Separador**
                doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
                doc.moveDown();
                // **Lista de productos en formato de tabla**
                doc.fontSize(14).text("Productos Comprados:");
                doc.moveDown();
                // Definir coordenadas de la tabla
                const startX = 50;
                let y = doc.y + 10; // Posición inicial
                // 🔹 **Encabezados de la tabla**
                doc.fontSize(12).text("Producto", startX, y, { width: 150, continued: true });
                doc.text("Cantidad", startX + 150, y, { width: 80, align: "center", continued: true });
                doc.text("Precio", startX + 230, y, { width: 80, align: "center", continued: true });
                doc.text("Subtotal", startX + 310, y, { width: 80, align: "right" });
                doc.moveTo(startX, y + 15).lineTo(550, y + 15).stroke();
                y += 25; // Espaciado
                // 🔹 **Datos de los productos**
                factura.detalles.forEach((item) => {
                    doc.fontSize(10)
                        .text(item.nombre, startX, y, { width: 150, continued: true })
                        .text(`${item.cantidad}`, startX + 150, y, { width: 80, align: "center", continued: true })
                        .text(`$${item.precio_unitario.toFixed(2)}`, startX + 230, y, { width: 80, align: "center", continued: true })
                        .text(`$${item.subtotal.toFixed(2)}`, startX + 310, y, { width: 80, align: "right" });
                    y += 20; // Espaciado entre filas
                });
                // **Total de la factura**
                doc.moveDown();
                doc.moveTo(50, y + 10).lineTo(550, y + 10).stroke();
                doc.moveDown();
                const totalCalculado = factura.detalles.reduce((acc, item) => acc + Number(item.subtotal), 0);
                doc.fontSize(14).text(`Total: $${totalCalculado.toFixed(2)}`, { align: "right" });
                // **Finalizar el PDF**
                doc.end();
            }
            catch (error) {
                Logger_1.Logger.error("Error generando factura PDF:", error);
                res.status(500).json({ status: "error", message: "Error al generar la factura en PDF." });
            }
        });
    }
}
exports.InvoiceController = InvoiceController;
