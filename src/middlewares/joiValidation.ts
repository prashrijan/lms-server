import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { deleteUploadedFiles } from "../utils/fileUtil";

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
        if (req.file || Array.isArray(req.files)) {
            deleteUploadedFiles(req);
        }
        return res.status(400).json(new ApiError(400, error.message));
    }
};
