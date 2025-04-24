import Joi from 'joi';

export const createEmployeeSchema = Joi.object({
    nombre: Joi.string().max(50).required(),
    apellido: Joi.string().max(50).required(),
    cui: Joi.string().max(20).required(),
    telefono: Joi.string().max(20).required(),
    edad: Joi.number().integer().greater(18).required(),
    genero: Joi.string().max(10).required(),
    fecha_contratacion: Joi.date(),
    fotografia: Joi.string().max(255).allow(null, ""),
    estado: Joi.string().max(20).required(),
    razon_baja: Joi.string().allow(null, ""),
    fecha_baja: Joi.date().allow(null),
    id_supervisor: Joi.number().integer().required()
});

export const updateEmployeeSchema = Joi.object({
    id_empleado: Joi.number().integer().required(),
    correo_electronico: Joi.string().email().max(100).required(),
    telefono: Joi.string().max(20).required(),
});

export const deactivateEmployeeSchema = Joi.object({
    id_empleado: Joi.number().integer().required(),
    razon_baja: Joi.string().required(),
    fecha_baja: Joi.date().required(),
});