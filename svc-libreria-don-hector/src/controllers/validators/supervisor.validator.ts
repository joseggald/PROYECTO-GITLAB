import Joi from "joi";

export const createSupervisorSchema = Joi.object({
  nombre: Joi.string().max(50).required(),
  apellido: Joi.string().max(50).required(),
  cui: Joi.string().max(20).required(),
  edad: Joi.number().integer().min(19).required(),
  genero: Joi.string().max(10).required(),
  telefono: Joi.string().max(20).required(),
  fecha_ingreso: Joi.date().required(),
  fecha_baja: Joi.date().optional().allow(null),
  razon_baja: Joi.string().optional().allow(null),
});

export const updateSupervisorSchema = Joi.object({
    id_supervisor: Joi.number().integer().required(),
    correo_electronico: Joi.string().email().max(100).required(),
    telefono: Joi.string().max(20).required(),
});

export const deactivateSupervisorSchema = Joi.object({
    id_supervisor: Joi.number().integer().required(),
    razon_baja: Joi.string().required(),
    fecha_baja: Joi.date().required(),
});