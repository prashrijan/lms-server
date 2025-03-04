type confType = {
    port: string;
    dbUri: string;
    jwtSecret: string;
    jwtExpiry: string;
    dbName: string;
    refreshJwtSecret: string;
    refreshJwtExpiry: string;
    smtpHost: string;
    smtpPort: number;
    smtpEmail: string;
    smtpPass: string;
    rootUrl: string;
};

export const conf: confType = {
    port: process.env.PORT,
    dbUri: process.env.DB_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiry: process.env.JWT_EXPIRY,
    dbName: process.env.DB_NAME,
    refreshJwtSecret: process.env.REFRESH_JWT_SECRET,
    refreshJwtExpiry: process.env.REFRESH_JWT_EXPIRY,
    smtpHost: process.env.SMTP_HOST,
    smtpPort: Number(process.env.SMTP_PORT),
    smtpEmail: process.env.SMTP_EMAIL,
    smtpPass: process.env.SMTP_PASS,
    rootUrl: process.env.ROOT_URL,
};
