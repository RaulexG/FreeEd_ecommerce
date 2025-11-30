// src/middlewares/auth.js
import jwt from "jsonwebtoken";

const { JWT_SECRET } = process.env;

export const authRequired = (req, res, next) => {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({
      error: "UNAUTHORIZED",
      message: "Token requerido"
    });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    // Guardamos id, email y rol del usuario autenticado
    req.user = {
      id: payload.id,
      email: payload.email,
      rol: payload.rol
    };

    next();
  } catch (e) {
    return res.status(401).json({
      error: "UNAUTHORIZED",
      message: "Token inválido o expirado"
    });
  }
};
