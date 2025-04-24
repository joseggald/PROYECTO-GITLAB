import Joi from 'joi';

export const createUserSchema = Joi.object({
  nombre: Joi.string().max(50).required(),
  apellido: Joi.string().max(50).required(),
  correo_electronico: Joi.string().email().max(100).required(),
  contrasena: Joi.string().max(255).required(),
  id_rol: Joi.number().integer().valid(1, 2, 3, 4).required(),

  // Campos opcionales para todos los roles
  cui: Joi.string().max(20).allow(null),
  edad: Joi.number().integer().min(0).allow(null),
  genero: Joi.string().allow(null),
  telefono: Joi.string().max(20).allow(null),
  fecha_ingreso: Joi.date().allow(null),
  fotografia: Joi.string().max(255).allow(null),
  fecha_baja: Joi.date().allow(null),
  razon_baja: Joi.string().allow(null),
  id_supervisor: Joi.number().integer().allow(null),
});

export const loginSchema = Joi.object({
  correo_electronico: Joi.string().email().max(100).required(),
  contrasena: Joi.string().max(255).required(),
});