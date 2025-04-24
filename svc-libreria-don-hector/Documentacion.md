# Manual Técnico

## Introducción
Este documento describe la configuración de las rutas para la gestión de productos y facturas en un servidor basado en **Express.js**, junto con la implementación del **ProductController**, **ProductService**, **InvoiceController** y **InvoiceService**.

---

## Dependencias
Este módulo usa las siguientes dependencias:

- **Express.js**: Para manejar el enrutamiento.
- **Controladores**:
  - `ProductController`: Maneja las operaciones CRUD de productos.
  - `InvoiceController`: Maneja la gestión de facturas.
- **Servicios**:
  - `ProductService`: Encargado de la lógica de negocio para los productos.
  - `InvoiceService`: Encargado de la lógica de negocio para las facturas.
- **Middleware de autenticación y autorización**:
  - `authMiddleware`: Verifica la autenticación del usuario.
  - `roleMiddleware`: Verifica los permisos según el rol del usuario.
- **Diccionario de Roles**: Define los roles disponibles en el sistema.

---

## Implementación del Controlador de Facturas

### **Descripción**
El `InvoiceController` es responsable de manejar las solicitudes HTTP relacionadas con las facturas. Se encarga de la creación, consulta, listado y generación de facturas en PDF.

### **Código**
```typescript
import { Request, Response } from "express";
import { ResponseHandler } from "../utils/responses";
import { Logger } from "../utils/Logger";
import { InvoiceService } from "../services/invoce.service";
import PDFDocument from "pdfkit";

const { sendSuccess, sendError } = ResponseHandler;

export class InvoiceController {
  private invoiceService: InvoiceService;

  constructor() {
    this.invoiceService = new InvoiceService();
  }

  public async createInvoice(req: Request, res: Response): Promise<void> {
    try {
      const invoiceData = req.body;
      Logger.info("Creando factura", invoiceData);
      const invoice = await this.invoiceService.createInvoice(invoiceData);
      sendSuccess(res, "Factura creada correctamente", { invoice });
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }
}
```

---

## Implementación del Servicio de Facturas

### **Descripción**
El `InvoiceService` maneja la lógica de negocio de las facturas, incluyendo la validación de datos y la interacción con la base de datos.

### **Código**
```typescript
import { Pool } from "pg";
import { dbManager } from "../config/database";
import { Logger } from "../utils/Logger";

export class InvoiceService {
  private getConnection(): Pool {
    try {
      const pool = dbManager.getConnection("postgres");
      if (!pool) {
        throw new Error("Database connection not initialized");
      }
      return pool;
    } catch (error) {
      Logger.error("Failed to get database connection:", error);
      throw new Error("Database connection error");
    }
  }

  public async createInvoice(invoiceData: any): Promise<any> {
    const pool = this.getConnection();
    const client = await pool.connect();
    Logger.info("invoice data", invoiceData);
    try {
      await client.query("BEGIN");
      const { fecha_emision, nombre_comprador, id_cliente, id_metodo_pago, total_venta, detalles, direccion_entrega, id_empleado } = invoiceData;
      if (!id_cliente && !id_empleado) {
        throw new Error("Debe proporcionar al menos un id_cliente o un id_empleado.");
      }
      const invoiceQuery = `
        INSERT INTO Factura (
          fecha_emision, nombre_comprador, id_cliente, id_metodo_pago, total_venta, direccion_entrega, id_empleado
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id_factura
      `;
      const invoiceValues = [fecha_emision, nombre_comprador, id_cliente || null, id_metodo_pago, total_venta, direccion_entrega, id_empleado || null];
      const invoiceResult = await client.query(invoiceQuery, invoiceValues);
      const idFactura = invoiceResult.rows[0].id_factura;
      await client.query("COMMIT");
      return { id_factura: idFactura };
    } catch (error) {
      await client.query("ROLLBACK");
      Logger.error("Error creando factura:", error);
      throw error;
    } finally {
      client.release();
    }
  }
}
```

---

## Definición de Rutas de Facturas

### **Código**
```typescript
import { Router } from 'express';
import { InvoiceController } from '../controllers/invoce.controller';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware';
import { ROLES } from '../dictionaries/roles';

const router = Router();
const invoiceController = new InvoiceController();
const { SUPERVISOR, EMPLEADO, GERENTE, CLIENTE } = ROLES;

router.post('/create', invoiceController.createInvoice.bind(invoiceController));
router.get('/invoices/:id_usuario', invoiceController.listInvoicesByUser.bind(invoiceController));
router.get('/fel/:id_factura', invoiceController.getInvoiceById.bind(invoiceController));
router.get('/payment-methods', invoiceController.getPaymentMethods.bind(invoiceController));
router.get('/all_invoices', invoiceController.getAllInvoices.bind(invoiceController));
router.get('/download/:id_factura/pdf', invoiceController.generateInvoicePDF.bind(invoiceController));

export { router as invoiceRoutes };
```

---

## Consideraciones Finales
- **Middleware de Autenticación**: Protege las rutas sensibles.
- **Middleware de Autorización**: Define qué roles tienen acceso a cada operación.
- **Modularidad**: Los controladores y servicios están desacoplados para facilitar mantenimiento y pruebas.

