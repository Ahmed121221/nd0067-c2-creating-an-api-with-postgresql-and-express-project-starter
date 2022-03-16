import { Request, Response, Application } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";

import User from "../models/user";
import auth from "../middlewares/authentication";

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
	const email = String(req.params.email);

	try {
		const user = await User.show(email);
		if (!user) {
			res.status(404).json(`email: ${email} dose not exists.`);
			return;
		}
		res.status(200).json({ user });
	} catch (err) {
		console.log("Handler : product.index() => ", err);
		res.status(500).json({ error: "coulde't fetch Users." });
	}
}

async function login(req: Request, res: Response): Promise<void> {
	const { email, password } = req.query;

	if (password === undefined || email === undefined) {
		res.status(400);
		res.json("Email And Password Are Required As An Quiry Pramters.");
		return;
	}

	try {
		const user = await new User(email as string, password as string).authenticate();
		if (!user) {
			res.status(404);
			res.json(`Incorrect Password.`);
			return;
		}
		const token = jwt.sign({ user }, String(process.env.TOKEN_KEY));
		res.status(200);
		res.json(token);
	} catch (err) {
		res.status(400);
		res.json(err instanceof Error ? err.message : "Sorry, You Can Not Login,");
	}
}

async function create(req: Request, res: Response): Promise<void> {
	const { email, password, firstName, lastName } = req.query;

	const user = new User(
		email as string,
		password as string,
		firstName as string,
		lastName as string
	);

	try {
		if (await user.getHasedPassword()) {
			res.status(400).json(`Email : ${user.email} is already registerd`);
			return;
		}

		const createdUser = await user.create();
		const token = jwt.sign({ user: createdUser }, String(process.env.TOKEN_KEY));
		res.status(200).json(token);
	} catch (err) {
		console.log("Handler : product.index() => ", err);
		res.status(500).json(err instanceof Error ? err.message : "coulde't create User.");
	}
}

const user_routes = (app: Application): void => {
	app.get("/users/:email", auth, show);
	app.get("/users", auth, index);
	app.post("/users/login", login);
	app.post("/users", auth, create);
};

export default user_routes;
