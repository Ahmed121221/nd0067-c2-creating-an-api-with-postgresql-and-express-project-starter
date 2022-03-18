import supertest from "supertest";

import User, { IUser } from "../user";
import { Connection } from "../../util/models/database";
import app from "../../server";

const request = supertest(app);

describe("User Model: ", () => {
	const u: IUser = {
		email: "email@example.com",
		firstname: "dev",
		lastname: "ts",
		password: "test123",
	};

	const uToken = User.generateToken(u);

	beforeAll(async function () {
		try {
			const q = `TRUNCATE users RESTART IDENTITY CASCADE;`;
			if (Connection.ENV == "test") await Connection.excute<void>({ q });
			return;
		} catch (err) {
			console.log(err);
			return;
		}
	});

	describe("Model: ", () => {
		it("should generate valid token", () => {
			expect(User.veifyToken(uToken)).toBe(true);
		});

		it("should create User", async () => {
			const user = new User(u.email, String(u.password), u.firstname, u.lastname);
			expect(await user.create()).toEqual({
				id: 1,
				firstname: u.firstname,
				lastname: u.lastname,
				email: u.email,
			});
		});

		it("should retrive User", async () => {
			const user = await User.show(u.email);
			expect(user).toEqual({
				id: 1,
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
			expect(users?.length).toEqual(1);
		});
	});

	describe("EndPoints: ", () => {
		describe("Create:", () => {
			it("require Token", async () => {
				await request.post("/users").expect(417);
			});

			describe("Validate Data:", () => {
				it("validate password", async () => {
					const req = await request.post("/users").set("token", uToken).send({
						email: "testMisignPssword",
						firstname: "fname",
						lastname: "lname",
					});
					expect(req.status).toBe(400);
				});

				it("validate email", async () => {
					const req = await request.post("/users").set("token", uToken).send({
						firstname: "fname",
						lastname: "lname",
						password: "password",
					});
					expect(req.status).toBe(400);
				});

				it("Check if email already exists", async () => {
					const req = await request.post("/users").set("token", uToken).send(u);
					expect(req.status).toBe(400);
				});
			});

			it("create user", async () => {
				u.email = "email2@example.com";
				const req = await request.post("/users").set("token", uToken).send(u);
				expect(req.status).toBe(201);
			});
		});

		describe("Index:", () => {
			it("require Token", async () => {
				await request.get("/users").expect(417);
			});

			it("get users", async () => {
				const req = await request.get("/users").set("token", uToken);
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
				const req = await request.get(`/users/${u.email}`).set("token", uToken);
				expect(req.status).toBe(200);
				expect(req.body).toEqual({
					user: {
						id: 2,
						firstname: u.firstname,
						lastname: u.lastname,
						email: u.email,
					},
				});
			});
		});
	});
});
