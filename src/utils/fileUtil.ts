import { Request } from "express";
import fs from "fs";
import path from "path";

export const deleteFile = (filePath: string) => {
    fs.unlink(path.resolve(filePath), () => {});
};

export const deleteUploadedFiles = (req: Request) => {
    if (req.file) {
        deleteFile(req.file.path);
    }

    if (req.files) {
        (req.files as Express.Multer.File[]).map((file) =>
            deleteFile(file.path)
        );
    }
};
