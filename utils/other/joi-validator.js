
const Joi = require('joi');

const productSchema = Joi.object({
    name: Joi.string().required(),
    categorykey: Joi.string().required(),
    rating: Joi.number().min(0).max(5).required(),
    productcode: Joi.string().required(),
    dimension_unit: Joi.string().valid('cm', 'in', 'mm').required(),
    width: Joi.number().positive().required(),
    length: Joi.number().positive().required(),
    views: Joi.number().integer().min(0).required(),
    likes: Joi.number().integer().min(0).required(),
    price: Joi.number().positive().required()
  });
  
  module.exports = productSchema;