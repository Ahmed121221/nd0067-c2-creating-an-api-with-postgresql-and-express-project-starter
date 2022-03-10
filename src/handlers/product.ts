import { Request, Response, Application } from "express";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ProdactStore, { Product } from "../models/product";

async function index(req: Request, res: Response): Promise<void> {
	try {
		const products = await new ProdactStore().index();
		res.status(200).json(products);
	} catch (err) {
		res.status(500).json({ error: err });
	}
}

async function show(req: Request, res: Response): Promise<void> {
	console.log("show route ", req.params.id);
	try {
		// todo check if id is a number firest.
		const id = Number(req.params.id);
		if (!id) {
			throw new URIError("Id must be a number.");
		}
		const products = await new ProdactStore().show(id);
		res.status(200).json(products?.pop());
	} catch (err) {
		res.json({ error: err });
	}
}

async function create(req: Request, res: Response): Promise<void> {
	try {
		const { name, price, c_id } = req.query;
		const product: Product = {
			name: String(name),
			price: Number(price),
			category: {
				id: Number(c_id),
			},
		};
		const createdProduct: Product[] | null = await new ProdactStore().create(product);
		res.status(200).json(createdProduct);
	} catch (err) {
		res.json({ error: err });
	}
}
const products_routes = (app: Application): void => {
	app.get("/products/:id", show);
	app.get("/products", index);
	app.post("/products", create);
};

export default products_routes;
