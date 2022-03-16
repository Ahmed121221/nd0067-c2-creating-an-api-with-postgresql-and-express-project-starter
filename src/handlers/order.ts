import { Request, Response, Application } from "express";
import auth from "../middlewares/authentication";

import OrderModel from "../models/order";
import user_status_validitor, { chekQuiryParams } from "../middlewares/validatores/order";

async function activeOrders(req: Request, res: Response) {
	const user_id = Number(req.params.user_id);
	const status = String(req.params.status);
	try {
		const orders = await OrderModel.userOrders(user_id, status);
		res.status(200);
		res.json(orders);
	} catch (err) {
		res.status(400);
		res.json({
			error: err instanceof Error ? err.message : "couldn't retrive orders.",
		});
	}
}

async function create(req: Request, res: Response) {
	const user_id = Number(req.query.user_id);
	const product_id = Number(req.query.product_id);
	const product_qty = Number(req.query.quantity);

	try {
		const order_id = await OrderModel.create({ product_id, product_qty, user_id });
		res.status(200);
		res.json({ order_id });
	} catch (err) {
		res.status(400);
		res.json({
			error: err instanceof Error ? err.message : "couldn't retrive orders.",
		});
	}
}

async function addProductToOrder(req: Request, res: Response) {
	const order_id = Number(req.query.order_id);
	const product_id = Number(req.query.product_id);
	const product_qty = Number(req.query.quantity);

	try {
		const orders = await OrderModel.addProduct(order_id, product_id, product_qty);
		res.status(200);
		res.json(orders);
	} catch (err) {
		res.status(400);
		res.json({
			error: err instanceof Error ? err.message : "couldn't add producats to order.",
		});
	}
}

const addProductParams = ["order_id", "product_id", "quantity"];
const createParams = ["user_id", "product_id", "quantity"];

const orders_routes = (app: Application) => {
	app.get("/orders/:user_id/:status", auth, user_status_validitor, activeOrders);
	app.post("/orders", chekQuiryParams(createParams), create);
	app.post("/orders/add", chekQuiryParams(addProductParams), addProductToOrder);
};

export default orders_routes;
