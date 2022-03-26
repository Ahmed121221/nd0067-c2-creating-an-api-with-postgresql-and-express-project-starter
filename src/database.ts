import { Pool } from "pg";
import "dotenv/config";

enum DB_ENV {
	test = "test",
	dev = "dev",
	prodaction = "prodaction",
}

const { NODE_ENV, DB_NAME, DB_TEST_NAME, DB_USER, DB_PASSWORD, HOST, PORT } = process.env;

let db_name = "";

switch (NODE_ENV) {
	case DB_ENV.dev:
		db_name = String(DB_NAME) ?? null;
		break;
	case DB_ENV.test:
		db_name = String(DB_TEST_NAME) ?? null;
		break;
	case DB_ENV.prodaction:
		db_name = "";
		break;
}

const Clint = new Pool({
	database: db_name,
	host: String(HOST),
	user: String(DB_USER),
	password: String(DB_PASSWORD),
	port: Number(PORT),
});

export default Clint;
