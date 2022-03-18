import express, { Request, Response } from "express";
import bodyParser from "body-parser";

import products_routes from "./handlers/product";
import user_routes from "./handlers/user";
import orders_routes from "./handlers/order";

const app: express.Application = express();
const address = "0.0.0.0:3000";

app.use(bodyParser.json());

products_routes(app);
user_routes(app);
orders_routes(app);

const userApi = [
	"post: /user/login : (email, password)=> getToken",
	"post: /user : (email, password, firstName, lastName) => getToken",
	"get: /users : => [] users",
	"get: /users/:email => user",
];

const productApi = [
	"post: /products : (name, price, category_id ) => []product",
	"get: /products : => []product",
	"get: /products/:id => product",
];
const categories = ["post: /product/categories : (id:number, name:string)", "get: /product/categories/:id"];

const orderApi = [
	"post: /orders? : (user_id,product_id,quantity) => product",
	"post: /orders/add? : (order_id,product_id,quantity) => order_id ",
	"get: /orders/:user_id/:status :  => []order",
];

app.get("/", function (req: Request, res: Response) {
	res.json({
		endPoints: {
			users: userApi,
			products: productApi,
			categories,
			orders: orderApi,
		},
	});
});

app.listen(3000, function () {
	console.log(`starting app on: ${address}`);
	console.log(process.env.NODE_ENV);
});

export default app;
