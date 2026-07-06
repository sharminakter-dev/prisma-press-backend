import { configDotenv } from "dotenv";
import path from "path";
import { env } from "process";
// import

configDotenv({path: path.join(process.cwd(), ".env"), quiet:true });

export default {
    port: env.PORT || 5000,
    database_url: env.DATABASE_URL,
    app_url: env.APP_URL,
    bcrypt_salt_rounds: env.BCRYPT_SALT_ROUND,
    jwt_access_secret: env.JWT_ACCESS_SECRET!,
    jwt_refresh_secret: env.JWT_REFRESH_SECRET!,
    jwt_access_expires_in: env.JWT_ACCESS_EXPIRES_IN!,
    jwt_refresh_expires_in: env.JWT_REFRESH_EXPIRES_IN!,

}