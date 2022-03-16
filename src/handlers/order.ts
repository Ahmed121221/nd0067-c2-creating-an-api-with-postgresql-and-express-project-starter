import { Request, Response, Application } from "express";

import OrderModel from "../models/order";

async function activeOrders(_req: Request, res: Response) {
	try {
		const orders = await OrderModel.userActiveOrders(1);
		res.status(200);
		res.json(orders);
	} catch (err) {
		res.status(400);
		res.json({
			error: err instanceof Error ? err.message : "couldn't retrive orders.",
		});
	}
}

const orders_routes = (app: Application) => {
	app.get("/orders", activeOrders);
};

export default orders_routes;
