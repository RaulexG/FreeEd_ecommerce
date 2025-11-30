// src/controllers/auth.controller.js
import { authService } from "../services/auth.service.js";

export const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (e) {
    next(e);
  }
};
