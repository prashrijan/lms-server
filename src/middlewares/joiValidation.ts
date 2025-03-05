import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

// validation
export const joiValidation = async (
    schema: Joi.ObjectSchema<any>,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        await schema.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (error) {
        return res.status(400).json(new ApiError(400, error.message));
    }
};
