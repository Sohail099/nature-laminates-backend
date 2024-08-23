
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



function userSchema(options = {}) {

  const schema = {
    name: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string(),
    access_token: Joi.string().optional(),
    refresh_token: Joi.string().optional(),
    photo: Joi.string().uri().optional(),
    status: Joi.string().valid('active', 'inactive').optional(),
  };
  if (options.context === 'signup') {
    Object.keys(schema).forEach((key) => {
      if (options.reqBody && options.reqBody[key] !== undefined) {
        schema[key] = schema[key].required();
      }
    });
  } else if (options.context === 'login') {
    schema.email = schema.email.required();
    schema.password = schema.password.required();
  }
  return Joi.object(schema);
}
module.exports = {
  productSchema,
  userSchema
};
