import Joi from "joi";

export const createCommentSchema = Joi.object({
  id_cliente: Joi.number().integer().required(),
  id_producto: Joi.number().integer().required(),
  calificacion: Joi.number().integer().min(1).max(5).required(),
  comentario: Joi.string().max(500).required()
});

export const updateCommentSchema = Joi.object({
  calificacion: Joi.number().integer().min(1).max(5).required(),
  comentario: Joi.string().max(500).required()
});
