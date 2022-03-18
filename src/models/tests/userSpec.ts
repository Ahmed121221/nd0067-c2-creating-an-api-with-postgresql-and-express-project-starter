import supertest from "supertest";

import User, { IUser } from "../user";
import { Connection } from "../../util/models/database";
import auth from "../../middlewares/authentication";
import app from "../../server";

const request = supertest(app);

describe("User Model : ", () => {
	const u: IUser = {
		email: "test@test.com",
		firstname: "dev",
		lastname: "ts",
		password: "test123",
	};

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

	describe("Model : ", () => {
		it("should generate valid token", () => {
			const token = User.generateToken(u);
			expect(User.veifyToken(token)).toBe(true);
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

	fdescribe("EndPoints", () => {
		describe("Create", () => {
			it("require Token", async () => {
				await request.post("localhost:3000/users").expect(417);
				// expect(res.status).toBe(417);
			});

			// it("validate data", async () => {
			// 	const res = await request.post(
			// 		"localhost:3000/users?email=test@test.com&firestName=fname&lastName=lname&password=test"
			// 	);
			// 	expect(res.status).toBe(417);
			// });

			// it("create user", () => {});
		});
		// describe("Index", () => {
		// 	it("require Token", () => {});
		// 	it("get users", () => {});
		// });
		// describe("show", () => {
		// 	it("require Token", () => {});
		// 	it("show user", () => {});
		// });
	});
});
