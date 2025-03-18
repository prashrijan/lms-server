import multer from "multer";
import path from "path";
import fs from "fs";

// const __dirname = path.resolve();

// const destinationDirectory = path.join(__dirname + "/public/uploads");
const destinationDirectory = "./public/uploads";

// storage setup
const storage: multer.StorageEngine = multer.diskStorage({
    destination: function (
        req: Express.Request,
        file: Express.Multer.File,
        cb: (error: Error | null, destination: string) => void
    ) {
        // check if directory exists if not create one
        if (!fs.existsSync(destinationDirectory)) {
            fs.mkdirSync(destinationDirectory, { recursive: true });
        }
        cb(null, destinationDirectory);
    },
    filename: function (
        req: Express.Request,
        file: Express.Multer.File,
        cb: (error: Error | null, filename: string) => void
    ) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const filePath = `${uniqueSuffix}-${file.originalname}`;
        cb(null, filePath);
    },
});

// filter to allow images only
const fileFilter = (
    req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void
) => {
    const allowedTypes = /jpeg|jpg|png|gif|bmp|webp|tiff/;
    const extensionName = path.extname(file.originalname).toLowerCase();
    const isValidExtension = allowedTypes.test(extensionName);
    const isValidType = allowedTypes.test(file.mimetype);
    if (isValidType && isValidExtension) {
        cb(null, true);
    } else {
        cb(
            new Error("Invalid file type. Only image files are allowed."),
            false
        );
    }
};

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    // file size of 2mb
    limits: { fileSize: 2 * 1024 * 1024 },
});
