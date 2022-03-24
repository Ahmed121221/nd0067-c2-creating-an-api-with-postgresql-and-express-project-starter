import express, { Request, Response } from "express";
import bodyParser from "body-parser";

import products_routes from "./handlers/product";
import user_routes from "./handlers/user";
import orders_routes from "./handlers/order";
import { Connection } from "./util/models/database";

// import "dotenv/config";

const app: express.Application = express();
const address = "0.0.0.0:3000";

app.use(bodyParser.json());

products_routes(app);
user_routes(app);
orders_routes(app);

app.get("/", function (req: Request, res: Response) {
	res.json(
		"EndPoints listed in https://github.com/Ahmed121221/nd0067-c2-creating-an-api-with-postgresql-and-express-project-starter/blob/master/README.md"
	);
});

app.listen(3000, async function () {
	console.log(`starting app on: ${address} with ${process.env.NODE_ENV} database.`);
	if (process.env.NODE_ENV != "test") {
		try {
			const selectStatus_q = "select * from status;";
			const status = await Connection.excute<{ id: number; name: string }>({ q: selectStatus_q });

			if (!status?.length) {
				const createStatus_q = "insert into status (id, name) values ($1, $2), ($3, $4)";
				await Connection.excute<void>({ q: createStatus_q, params: [1, "active", 2, "complete"] });
			}
		} catch (err) {
			console.log(err);
		}
	}
});

export default app;
