import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { joiValidation } from "../../joiValidation";
// create book validaton
const createBookValidator = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const bookSchema = Joi.object({
        title: Joi.string().required(),
        author: Joi.string().required(),
        thumbnail: Joi.string(),
        isbn: Joi.string(),
        genre: Joi.string(),
        publishedYear: Joi.number()
            .integer()
            .max(new Date().getFullYear())
            .required(),
        availability: Joi.boolean(),
        status: Joi.string().valid("active", "inactive"),
        averageRating: Joi.number(),
        description: Joi.string().allow("", null),
    });

    await joiValidation(bookSchema, req, res, next);
};

export { createBookValidator };
