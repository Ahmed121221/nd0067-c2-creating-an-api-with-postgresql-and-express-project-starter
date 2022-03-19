import { Response, Request, Application } from "express";

import { Category } from "../models/category";

async function create(req: Request, res: Response): Promise<void> {
	const name = String(req.body.name);
	const id = Number(req.body.id);
	try {
		if (name === undefined || isNaN(id)) throw new Error("Expected arrtibutes (id: Integer, name:string)");

		const category = await new Category(id, name).create();

		res.status(201);
		res.json({ category: category });
	} catch (err) {
		const errMsg = err instanceof Error ? err.message : "could't create category";
		res.status(400);
		res.json({ err: errMsg });
	}
}

async function show(req: Request, res: Response): Promise<void> {
	const id = Number(req.body.name);
	try {
		if (isNaN(id)) throw new Error("Expected arrtibutes (id:number)");

		const category = await new Category(id).checId();

		res.status(200);
		res.json({ category: category });
	} catch (err) {
		const errMsg = err instanceof Error ? err.message : "could't create category";

		console.log(err);
		res.status(400);
		res.json({ err: errMsg });
	}
}

const categories_routes = (baseRoute: string, app: Application) => {
	app.post(`${baseRoute}/categories`, create);
	app.get(`${baseRoute}/categories/:id`, show);
};

export default categories_routes;
