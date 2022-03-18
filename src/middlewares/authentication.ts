import { Request, Response, NextFunction } from "express";
import "dotenv/config";

import User from "../models/user";

function checkToken(req: Request, res: Response, next: NextFunction) {
	if (req.headers.token === undefined || req.headers.token == "") {
		res.status(417).json("TOKEN IS REQUIRED.");
		return;
	}
	next();
}

function validateToken(req: Request, res: Response, next: NextFunction) {
	const token = req.headers.token as string;

	if (!User.veifyToken(token)) {
		res.status(401);
		res.json("Access denied, invalid token.");
		return;
	}

	next();
}

export default [checkToken, validateToken];
