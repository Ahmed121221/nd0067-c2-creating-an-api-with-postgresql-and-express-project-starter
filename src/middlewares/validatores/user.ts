import { Request, Response, NextFunction } from "express";
import ProductCategory from "../../models/productCategory";

export function creat(req: Request, res: Response, next: NextFunction) {
	const query = req.query;

	for (const attr of ProductCategory.mustAttributes) {
		if (query[attr] == undefined) {
			res.status(400).json(`${attr} Must Be Exists.`);
			return;
		}

		if (attr == "name" && typeof query[attr] !== "string") {
			res.status(400).json(`${attr} Must Be A string.`);
			return;
		}

		if (attr == "price" || attr == "category_id") {
			if (!Number(query[attr])) throw new Error(`${attr} Must Be A Number.`);
			res.status(400).json(`${attr} Must Be A Number.`);
			return;
		}
	}

	next();
}

export default [creat];
