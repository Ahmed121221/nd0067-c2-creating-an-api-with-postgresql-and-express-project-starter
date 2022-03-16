import { Request, Response, Application } from "express";

import ProdactsStore, { Product } from "../models/product";
import validitors from "../middlewares/validatores/product";
import ProductCategory from "../models/productCategory";
import auth from "../middlewares/authentication";

async function index(req: Request, res: Response): Promise<void> {
	try {
		const products = await new ProdactsStore().index();
		res.status(200).json(products);
	} catch (err) {
		console.log("Handler : product.index() => ", err);
		res.status(500).json({ error: "coulde't fetch Products." });
	}
}

async function show(req: Request, res: Response): Promise<void> {
	try {
		const id = Number(req.params.id);
		const products = await new ProdactsStore().show(id);
		res.status(200).json(products?.pop());
	} catch (err) {
		console.log("Handler : product.show() => ", typeof err);
		res
			.status(500)
			.json(err instanceof Error ? err.message : "somthing wrong Happend, please try again later.");
	}
}

async function create(req: Request, res: Response): Promise<void> {
	try {
		const { name, price, category_id } = req.query;
		const productStore = new ProdactsStore();

		const pc: ProductCategory = new ProductCategory(
			String(name),
			Number(price),
			Number(category_id)
		);

		if (!(await pc.category.checId()))
			throw new Error(`category with id = ${pc.category.id} dose not exist.`);

		const createdProduct: Product[] = await productStore.create(pc.toProduct());

		res.status(200).json(createdProduct);
	} catch (err) {
		console.log(err);
		res
			.status(404)
			.json(err instanceof Error ? err.message : "somthing wrong Happend, please try again later.");
	}
}

const products_routes = (app: Application): void => {
	app.get("/products/:id", show);
	app.get("/products", index);
	app.post("/products", auth, validitors, create);
};

export default products_routes;
