import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";

function checkToken(req: Request, res: Response, next: NextFunction) {
	if (req.headers.token === undefined || req.headers.token == "") {
		res.status(417).json("TOKEN IS REQUIRED.");
		return;
	}
	next();
}

function validateToken(req: Request, res: Response, next: NextFunction) {
	const token = req.headers.token as string;

	try {
		jwt.verify(token, String(process.env.TOKEN_KEY));
		next();
	} catch (err) {
		res.status(401);
		res.json("Access denied, invalid token.");
	}
}

export default [checkToken, validateToken];
