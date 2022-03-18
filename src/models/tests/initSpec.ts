import { Connection } from "../../util/models/database";
import { Category } from "../category";
import "dotenv/config";
import User, { IUser } from "../user";
import ProdactStore, { Product } from "../product";

export const USER: IUser = {
	id: 1,
	email: "email@example.com",
	firstname: "dev",
	lastname: "ts",
	password: "test123",
};

export const CATEGORY = {
	id: 1,
	name: "category1",
};

export const PRODUCT: Product = {
	id: 1,
	name: "product",
	price: 99,
	category: CATEGORY,
};

export const USERTOKEN = User.generateToken(USER);

const restTables = `TRUNCATE categories, status, users, products  RESTART IDENTITY CASCADE;`;
const createStatus_q = "insert into status (id, name) values ($1, $2), ($3, $4)";

async function initData(): Promise<void> {
	if (Connection.ENV == "test") {
		await Connection.excute<void>({ q: restTables });
		await new Category(CATEGORY.id, CATEGORY.name).create();
		await new ProdactStore().create(PRODUCT);

		await Connection.excute<void>({ q: createStatus_q, params: [1, "active", 2, "complete"] });
		await new User(USER.email, String(USER.password), USER.firstname, USER.lastname).create();
	}
}

beforeAll(async function () {
	try {
		await initData();
		return;
	} catch (err) {
		console.log(err);
		return;
	}
});

afterAll(async function () {
	try {
		if (Connection.ENV == "test") await Connection.excute<void>({ q: restTables });
		return;
	} catch (err) {
		console.log(err);
		return;
	}
});
