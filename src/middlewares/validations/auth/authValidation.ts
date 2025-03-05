import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { joiValidation } from "../../joiValidation";

// register validation
const registerUserValidator = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
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

// activate user validation
const activateUserValidator = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const activateUserSchema = Joi.object({
        sessionId: Joi.string().min(10).max(30).required(),
        t: Joi.string().min(10).max(45).required(),
    });

    await joiValidation(activateUserSchema, req, res, next);
};

// login validation
const loginUserValidator = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const loginSchema = Joi.object({
        email: Joi.string().email({ minDomainSegments: 2 }).required(),
        password: Joi.string().required(),
    });

    await joiValidation(loginSchema, req, res, next);
};

export { registerUserValidator, activateUserValidator, loginUserValidator };
