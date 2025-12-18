import jwt, { SignOptions } from "jsonwebtoken";
import { Config } from "../configs/Config";

export class JsonWebToken {
  private static jwt_secret = Config.jwt_secret() ?? "secret";
  private static jwt_refresh = Config.jwt_refresh() ?? "refresh";

  // **** FUNCTION - METHOD **** //

  // SIGN >>>
  public static signAccessToken<T extends object>(payload: T): string {
    const options: SignOptions = {
      expiresIn: "15s",
    };

    return jwt.sign(payload, this.jwt_secret, options);
  }

  public static signRefreshToken<T extends object>(payload: T): string {
    const options: SignOptions = {
      expiresIn: "5m",
    };
    return jwt.sign(payload, this.jwt_refresh, options);
  }

  // VERIFY >>>
  public static verifyAccessToken(token: string) {
    return jwt.verify(token, this.jwt_secret);
  }

  public static verifyRefreshToken(token: string) {
    return jwt.verify(token, this.jwt_refresh);
  }
}
