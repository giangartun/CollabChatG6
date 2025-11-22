// backend/src/utils/jwt.ts
import jwt from "jsonwebtoken";

export function issueToken(userId: number, email: string) {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET!, // tu clave interna del .env
    { expiresIn: "1h" }      // duración del token
  );
}
