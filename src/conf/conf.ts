type confType = {
    port: string;
    dbUri: string;
    jwtSecret: string;
    jwtExpiry: string;
    dbName: string;
};

export const conf: confType = {
    port: process.env.PORT,
    dbUri: process.env.DB_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiry: process.env.JWT_EXPIRY,
    dbName: process.env.DB_NAME,
};
