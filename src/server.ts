import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import "dotenv/config";

import products_routes from "./handlers/product";
import user_routes from "./handlers/user";

const app: express.Application = express();
const address = "0.0.0.0:3000";

app.use(bodyParser.json());

products_routes(app);
user_routes(app);

app.get("/", function (req: Request, res: Response) {
	res.send("Hello World!");
});

app.listen(3000, function () {
	console.log(`starting app on: ${address}`);
	console.log(process.env.NODE_ENV);
});
