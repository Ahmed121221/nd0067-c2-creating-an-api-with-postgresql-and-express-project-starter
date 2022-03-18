import supertest from "supertest";

import app from "../../server";

import ProdactStore, { Product } from "../product";

import * as InitData from "./initSpec";

const request = supertest(app);

const p: Product = {
	name: "testProduct2",
	price: 33,
	category: InitData.CATEGORY,
};

describe("Product Model: ", () => {
	describe("Model: ", () => {
		it("should create product", async () => {
			const newProduct = await new ProdactStore().create(p);
			expect(newProduct.length).toBe(1);
		});

		it("should get all products.", async () => {
			const newProducts = await new ProdactStore().index();
			expect(newProducts?.length).toBe(3);
		});

		it("shold show product with a given id.", async () => {
			const newProducts = await new ProdactStore().show(1);
			expect(newProducts?.length).toBe(1);
		});
	});

	describe("EndPoints: ", () => {
		describe("Index:", () => {
			it("should index all products", async () => {
				const res = await request.get(`/products`);
				expect(res.status).toBe(200);
			});
		});

		describe("Show:", () => {
			it("should show a product by id", async () => {
				const res = await request.get(`/products/1`);
				expect(res.status).toBe(200);
			});
		});

		describe("Create:", () => {
			it("require Token", async () => {
				const res = await request.post(`/products`).send({
					name: "product2",
					price: 106,
					category_id: InitData.CATEGORY.id,
				});
				expect(res.status).toBe(417);
			});

			it("require valid Token", async () => {
				const res = await request
					.post(`/products`)
					.set("token", InitData.USERTOKEN + "dd")
					.send({
						name: "product2",
						price: 106,
						category_id: InitData.CATEGORY.id,
					});
				expect(res.status).toBe(401);
			});

			it("should create product", async () => {
				// this test debends on Model : should create product test
				const p = { name: "product2", price: 106, category_id: InitData.CATEGORY.id };
				const res = await request.post(`/products`).set("token", InitData.USERTOKEN).send(p);
				const { name, price, category } = res.body[0];
				const resProduct = { name, price, category };
				expect(resProduct).toEqual({
					name: p.name,
					price: p.price,
					category: InitData.CATEGORY,
				});
				expect(res.status).toBe(200);
			});
		});
	});
});
