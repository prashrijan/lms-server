import Joi from "joi";

// validation
const joiValidation = async (schema, req, res, next) => {
    try {
        await schema.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (error) {
        return res.status(400).json({
            status: "error",
            message: error.message,
        });
    }
};

// register validation
const registerUserValidator = async (req, res, next) => {
    const registerSchema = Joi.object({
        fName: Joi.string().required(),
        lName: Joi.string().required(),
        email: Joi.string().email({ minDomainSegments: 2 }).required(),
        phone: Joi.string().required(),
        password: Joi.string().required(),
        confirmPassword: Joi.string()
            .valid(Joi.ref("password"))
            .required()
            .messages({
                "any.only": "Confirm password and password must match.",
            }),
    });

    await joiValidation(registerSchema, req, res, next);
};

// login validation
const loginUserValidator = async (req, res, next) => {
    const loginSchema = Joi.object({
        email: Joi.string().email({ minDomainSegments: 2 }).required(),
        password: Joi.string().required(),
    });

    await joiValidation(loginSchema, req, res, next);
};

export { registerUserValidator, loginUserValidator };
