import * as bcrypt from "bcrypt";

export class Hash {
  public static async make(data: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(data, salt);
  }

  public static async compare(
    data: string,
    encrypted: string
  ): Promise<boolean> {
    return bcrypt.compare(data, encrypted);
  }
}
