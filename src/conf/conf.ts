type confType = {
    port: string;
    dbUri: string;
    jwtSecret: string;
    jwtExpiry: string;
    dbName: string;
    refreshJwtSecret: string;
    refreshJwtExpiry: string;
};

export const conf: confType = {
    port: process.env.PORT,
    dbUri: process.env.DB_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiry: process.env.JWT_EXPIRY,
    dbName: process.env.DB_NAME,
    refreshJwtSecret: process.env.REFRESH_JWT_SECRET,
    refreshJwtExpiry: process.env.REFRESH_JWT_EXPIRY,
};
