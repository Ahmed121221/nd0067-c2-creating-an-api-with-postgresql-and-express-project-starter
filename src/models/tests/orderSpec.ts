import supertest from "supertest";

import app from "../../server";
import { Connection } from "../../util/models/database";
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

		afterAll(async function () {
			const restTables = `TRUNCATE  orders, products_orders  RESTART IDENTITY;`;
			await Connection.excute<void>({ q: restTables });
		});
	});

	describe("EndPoints: ", () => {
		describe("Create:", () => {
			it("should create new order", async () => {
				const res = await request
					.post("/orders")
					.set("token", InitData.USERTOKEN)
					.send({
						user_id: InitData.USER.id ?? 1,
						product_id: InitData.PRODUCT2.id ?? 2,
						quantity: 1,
					});
				expect(res.status).toBe(201);
				expect(res.body.order_id).toBe(1);
			});

			it("should add new product", async () => {
				const res = await request.post("/orders/add").set("token", InitData.USERTOKEN).send({
					order_id: 1,
					product_id: InitData.PRODUCT.id,
					quantity: 2,
				});
				expect(res.status).toBe(200);

				expect(res.body.order_id).toBe(1);
				expect(res.body.quantity).toBe(2);
				expect(res.body.product_id).toBe(1);
			});
		});

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
