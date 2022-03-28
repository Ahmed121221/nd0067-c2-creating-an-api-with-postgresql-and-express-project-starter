\# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Products

- Index `/products`
- Show `/products/:id`
- Create [token required] `/products : body = { name: string, price: number, category_id: number }`

#### Users

- Index [token required] `/users`
- Show [token required] `/users/:email`
- Create `/user : body = { email: string, password: string, firstname: string, lastname: string }`

#### Orders

- Current Order by user [token required] `/orders/:user_id/active `
- Completed Orders by user [token required] `/orders/:user_id/complete`

## Data Shapes

#### Product

- id
- name
- price
- category

```
interface Product {
	id?: number;
	name: string;
	price: number;
	category: ICategory;
}

interface ICategory {
	id: number;
	name?: string;
}
```

#### User

- id
- firstName
- lastName
- password

```
interface IUser {
	id?: number;
	password?: string;

	email: string;
	lastname: string;
	firstname: string;
}
```

#### Orders

- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

```
interface Product {
	id: number;
	quantity: number;
}
interface IOrder {
	id: number;
	proudcts: Product[];
	user_id: number;
	status: string;
}
```

### [DataBase Schema:](https://github.com/Ahmed121221/nd0067-c2-creating-an-api-with-postgresql-and-express-project-starter/blob/master/store_schema.png)

![store_schema](https://github.com/Ahmed121221/nd0067-c2-creating-an-api-with-postgresql-and-express-project-starter/blob/master/store_schema.png?raw=true)
