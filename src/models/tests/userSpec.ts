import supertest from "supertest";

import User, { IUser } from "../user";
import app from "../../server";
import * as InitData from "./initSpec";

const request = supertest(app);

export const u: IUser = {
	id: 2,
	email: "email@example2.com",
	firstname: "dev",
	lastname: "ts",
	password: "test123",
};

export const uToken = User.generateToken(u);

describe("User Module: ", () => {
	describe("Model: ", () => {
		it("should generate valid token", () => {
			expect(User.veifyToken(uToken)).toBe(true);
		});

		it("should create User", async () => {
			const user = new User(u.email, String(u.password), u.firstname, u.lastname);
			expect(await user.create()).toEqual({
				id: u.id,
				firstname: u.firstname,
				lastname: u.lastname,
				email: u.email,
			});
		});

		it("should retrive User", async () => {
			const user = await User.show(u.email);
			expect(user).toEqual({
				id: u.id,
				firstname: u.firstname,
				lastname: u.lastname,
				email: u.email,
			});
		});

		it("should store User with hashed password", async () => {
			let user;
			try {
				user = await new User(u.email, String(u.password)).authenticate();
			} catch (err) {
				console.log(err);
			}
			expect(user).toBeTruthy();
		});

		it("should retrive all users", async () => {
			const users = await User.index();
			expect(users?.length).toBeTruthy();
		});
	});

	describe("EndPoints: ", () => {
		describe("Login", () => {
			it("should return valid token", async () => {
				const res = await request.post("/users/login").send({
					email: InitData.USER.email,
					password: InitData.USER.password,
				});
				expect(User.veifyToken(String(res.body))).toBeTrue();
			});
		});

		describe("Create:", () => {
			it("require Token", async () => {
				await request.post("/users").expect(417);
			});

			describe("Validate Data:", () => {
				it("validate password", async () => {
					const req = await request.post("/users").set("token", InitData.USERTOKEN).send({
						email: "failed@test",
						firstname: "fname",
						lastname: "lname",
					});
					expect(req.status).toBe(400);
				});

				it("validate email", async () => {
					const req = await request.post("/users").set("token", InitData.USERTOKEN).send({
						firstname: "faild",
						lastname: "test",
						password: "password",
					});
					expect(req.status).toBe(400);
				});

				it("Check if email already exists", async () => {
					const req = await request.post("/users").set("token", InitData.USERTOKEN).send(InitData.USER);
					expect(req.status).toBe(400);
				});
			});

			it("create user", async () => {
				const newUser = {
					email: "email@example3.com",
					password: "password",
					firstname: "name",
					lastname: "lastname",
				};
				const req = await request.post("/users").set("token", InitData.USERTOKEN).send(newUser);
				expect(req.status).toBe(201);
			});
		});

		describe("Index:", () => {
			it("require Token", async () => {
				await request.get("/users").expect(417);
			});

			it("get users", async () => {
				const req = await request.get("/users").set("token", InitData.USERTOKEN);
				expect(req.status).toBe(200);
				expect(req.body.length).toBeTruthy();
			});
		});

		describe("Show:", () => {
			it("require Token", async () => {
				await request.get(`/users/${u.id}`).expect(417);
			});

			it("require valid Token", async () => {
				const invaildToken = uToken + "vfjvbd";
				await request.get(`/users/${u.id}`).set("token", invaildToken).expect(401);
			});

			it("get user", async () => {
				const req = await request.get(`/users/${InitData.USER.email}`).set("token", InitData.USERTOKEN);
				expect(req.status).toBe(200);
				expect(req.body).toEqual({
					user: {
						id: InitData.USER.id,
						firstname: InitData.USER.firstname,
						lastname: InitData.USER.lastname,
						email: InitData.USER.email,
					},
				});
			});
		});
	});
});
