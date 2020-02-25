const Joi = require("joi");

module.exports = {
  validateBody: schema => {
    return (req, res, next) => {
      const result = Joi.validate(req.body, schema);
      console.log("result", result);
      if (result.error) {
        console.log("result", result);
        return res.status(400).json(result.error);
      }

      if (!req.value) {
        req.value = {};
      }

      req.value["body"] = result.value;
      next();
    };
  },

  schemas: {
    authSchema: Joi.object().keys({
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string().required()
    }),
    registerSchema: Joi.object().keys({
      full_name: Joi.string()
        .min(3)
        .required(),
      email: Joi.string()
        .min(6)
        .required()
        .email(),
      password: Joi.string()
        .min(6)
        .required(),
      birthday: Joi.string().required(),
      phone_number: Joi.string().required(),
      country: Joi.string().required(),
      level: Joi.string(),
      verified: Joi.string(),
      status: Joi.string()
    })
  }
};
