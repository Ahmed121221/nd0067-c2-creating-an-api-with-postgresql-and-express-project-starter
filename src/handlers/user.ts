import { Request, Response, Application } from "express";

import User from "../models/user";
import jwt from "jsonwebtoken";
import "dotenv/config";

async function index(req: Request, res: Response): Promise<void> {
	try {
		const products = await User.index();
		res.status(200).json(products);
	} catch (err) {
		console.log("Handler : product.index() => ", err);
		res.status(500).json({ error: "coulde't fetch Users." });
	}
}

async function show(req: Request, res: Response): Promise<void> {
	const { email } = req.params;
	console.log(email);

	try {
		const user = await User.show(String(email));
		if (!user) {
			res.status(404).json(`email: ${String(email)} dose not exists.`);
			return;
		}
		res.status(200).json({ user });
	} catch (err) {
		console.log("Handler : product.index() => ", err);
		res.status(500).json({ error: "coulde't fetch Users." });
	}
}

async function create(req: Request, res: Response): Promise<void> {
	const { email, password, firstName, lastName } = req.query;

	const user = new User(String(email), String(password), String(firstName), String(lastName));
	try {
		if (await user.getHasedPassword()) {
			res.status(400).json(`Email : ${user.email} is already registerd`);
			return;
		}

		
		const createdUser = user.create();
		const token = jwt.sign({ user: createdUser }, String(process.env.TOKEN_KEY));
		res.status(200).json(token);
	} catch (err) {
		console.log("Handler : product.index() => ", err);
		res.status(500).json(err instanceof Error ? err.message : "coulde't create User.");
	}
}

const user_routes = (app: Application): void => {
	app.get("/users/:email", show);
	app.get("/users", index);
	app.post("/users", create);
};

export default user_routes;
