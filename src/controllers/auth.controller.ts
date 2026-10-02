import { Response, Request } from "express";
import * as authService from "../services/auth.service.js";
import logger from "../config/logger.js";

export const signup = async (req: Request, res: Response) => {
  try {
    const result = await authService.signup(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    logger.error("Signup error", { error: error.message });
    if (error.message === "Email already in use") {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json(result);
  } catch (error: any) {
    logger.error("Login error", { error: error.message });
    if (error.message === "Invalid email or password") {
      return res.status(401).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};
