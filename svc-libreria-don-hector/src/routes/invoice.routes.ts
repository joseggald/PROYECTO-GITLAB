import { Router } from 'express';
import { InvoiceController } from '../controllers/invoce.controller';
import { authMiddleware,roleMiddleware } from '../middlewares/auth.middleware';
import { ROLES } from '../dictionaries/roles'
const router = Router();
const invoiceController = new InvoiceController();


const { SUPERVISOR,EMPLEADO,GERENTE,CLIENTE } = ROLES;


//router.use(authMiddleware);
router.post('/create' ,invoiceController.createInvoice.bind(invoiceController));
router.get('/invoices/:id_usuario',invoiceController.listInvoicesByUser.bind(invoiceController));
router.get('/fel/:id_factura',invoiceController.getInvoiceById.bind(invoiceController));
router.get('/payment-methods',invoiceController.getPaymentMethods.bind(invoiceController));
router.get('/all_invoices',invoiceController.getAllInvoices.bind(invoiceController));
router.get("/download/:id_factura/pdf", invoiceController.generateInvoicePDF.bind(invoiceController));

export { router as invoiceRoutes };