import supertest from "supertest";

import app from "../../server";
import OrderModel from "../order";
import * as InitData from "./initSpec";

const request = supertest(app);

describe("Order Model: ", () => {
	describe("Model: ", () => {
		const orderId = 1;
		it("should create new order", async () => {
			const order_id = await OrderModel.create({
				user_id: InitData.USER.id ?? 1,
				product_id: InitData.PRODUCT.id ?? 1,
				product_qty: 1,
			});
			expect(order_id).toEqual(1);
		});

		it("should add new product to an order", async () => {
			const order = await OrderModel.addProduct(orderId, InitData.PRODUCT2.id ?? 2, 1);
			expect(order).toBeTruthy();
		});
	});

	describe("EndPoints: ", () => {
		// describe("Create:", () => {
		//     const res = request.post("/orders")
		// });

		describe("Index:", () => {
			it("require valid Token", async () => {
				const res = await request.get(`/orders/${InitData.USER.id}/active`).set("token", InitData.USERTOKEN + "dd");
				expect(res.status).toBe(401);
			});

			it("list all active orders for a user", async () => {
				const res = await request.get(`/orders/${InitData.USER.id}/active`).set("token", InitData.USERTOKEN);
				expect(res.body?.length).toBeTruthy();
			});

			it("list all complete orders for a user", async () => {
				const res = await request.get(`/orders/${InitData.USER.id}/complete`).set("token", InitData.USERTOKEN);
				expect(res.body?.length).toBeFalsy();
			});
		});
	});
});
