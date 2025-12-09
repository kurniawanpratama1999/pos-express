import jwt, { SignOptions } from "jsonwebtoken";
import { Config } from "../configs/Config";

export class JsonWebToken {
  private static jwt_secret: string = String(Config.jwt_secret()) ?? "secret";
  private static secret_expire_in: number =
    Number(Config.jwt_secret_expire_in()) ?? 15 * 60;

  private static jwt_refresh: string = String(Config.jwt_refresh) ?? "refresh";
  private static refresh_expire_in: number =
    Number(Config.jwt_refresh_expire_in) ?? 7 * 24 * 60 * 60;

  // **** FUNCTION - METHOD **** //

  // SIGN >>>
  public static signAccessToken<T extends object>(payload: T): string {
    const options: SignOptions = {
      expiresIn: this.secret_expire_in,
    };
    return jwt.sign(payload, this.jwt_secret, options);
  }

  public static signRefreshToken<T extends object>(payload: T): string {
    const options: SignOptions = {
      expiresIn: this.refresh_expire_in,
    };
    return jwt.sign(payload, this.jwt_refresh, options);
  }

  // VERIFY >>>
  public static verifyAccessToken(token: string): object {
    return jwt.verify(token, this.jwt_secret) as object;
  }

  public static verifyRefreshToken(token: string): object {
    return jwt.verify(token, this.jwt_refresh) as object;
  }
}
