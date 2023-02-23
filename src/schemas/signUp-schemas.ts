import Joi from 'joi';

export const SignUpSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().min(10).required(),
});
