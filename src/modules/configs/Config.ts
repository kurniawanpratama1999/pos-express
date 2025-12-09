import "dotenv/config";
export class Config {
  public static db_url(): string {
    return String(process.env.DATABASE_URL);
  }

  public static db_user(): string {
    return String(process.env.DATABASE_USER);
  }
  public static db_password(): string {
    return String(process.env.DATABASE_PASSWORD);
  }
  public static db_name(): string {
    return String(process.env.DATABASE_NAME);
  }
  public static db_host(): string {
    return String(process.env.DATABASE_HOST);
  }
  public static db_port(): number {
    return Number(process.env.DATABASE_PORT);
  }

  public static jwt_secret(): string {
    return String(process.env.JWT_SECRET);
  }
  public static jwt_secret_expire_in(): number {
    return Number(process.env.JWT_EXPIRES_IN);
  }
  public static jwt_refresh(): string {
    return String(process.env.JWT_REFRESH_SECRET);
  }
  public static jwt_refresh_expire_in(): number {
    return Number(process.env.JWT_REFRESH_EXPIRES_IN);
  }

  public static port(): number {
    return Number(process.env.PORT);
  }
}
