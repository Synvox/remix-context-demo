import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET!;
if (!secret) throw new Error("No JWT secret found");

export async function create<T extends Record<string, any>>(
  { exp: _exp, iat: _iat, ...obj }: T,
  exp = "2d"
) {
  const token = await new Promise((resolve, reject) => {
    jwt.sign(
      obj,
      secret,
      exp === "never" ? {} : { expiresIn: exp },
      (err, signed) => {
        if (err) return reject(err);
        resolve(signed);
      }
    );
  });

  return token as string;
}

export async function read<T extends Record<string, any>>(token: string) {
  return await new Promise<T>((resolve, reject) => {
    jwt.verify(token, secret, (err, signed) => {
      if (err) return reject(err);
      resolve(signed as T);
    });
  });
}
