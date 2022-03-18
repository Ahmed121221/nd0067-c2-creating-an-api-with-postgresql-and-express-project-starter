import { Request, Response, NextFunction } from "express";
import User from "../../models/user";

export function userValidators(req: Request, res: Response, next: NextFunction) {
	const query = req.body;

	for (const attr of User.mustAttributes) {
		const attrValue = query[attr];

		if (attrValue == undefined) {
			res.status(400).json(`${attr} Must Be Exists.`);
			return;
		}

		if (attrValue == "") {
			res.status(400).json(`Attribute ${attr} value's is empty.`);
			return;
		}

		if (typeof attrValue !== "string") {
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
