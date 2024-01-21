const Joi = require('joi')


exports.userRegisterValidation = (data) => {
    const schema = Joi.object({
      name: Joi.string().required(),
      phone: Joi.string().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Phone number must have 10 digits.`}).required(),
      email: Joi.string().email().required(),
      password:Joi.string().min(4).required(),
      confirm_password:Joi.string().min(4).required()
    });
    return schema.validate(data);
  };

  exports.userLoginValidation = (data) => {
    const schema = Joi.object({
      email: Joi.string().required(),
      password:Joi.string().min(4).required()
    });
    return schema.validate(data);
  };

  exports.formValidation = (data)=>
  {
    const schema = Joi.object({
      name:Joi.string().required().messages({'string.empty': `Name cannot be an empty field`}),
      mobile:Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .message('Mobile number must be a 10-digit number')
      .custom((value, helpers) => {
        if (!/^\d+$/.test(value)) {
          return helpers.error('any.invalid');
        }
        return value;
      })
      .message('Mobile number must be a valid number'),
      email:Joi.string().required().messages({'string.empty': `Email cannot be an empty field`}),
      message:Joi.string().required().messages({'string.empty': `Message cannot be an empty field`}),
      page_id:Joi.string(),
      page_name:Joi.string(),
      document_path:Joi.string()
    });
    return schema.validate(data);
  }