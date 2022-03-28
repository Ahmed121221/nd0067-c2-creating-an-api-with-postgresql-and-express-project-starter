import { Connection } from "../util/models/database";

interface Product {
	id: number;
	quantity: number;
}

// this will be it output and input shape of data
export interface IOrder {
	id: number;
	proudcts: Product[];
	user_id: number;
	status: string;
}

interface DbOrder {
	id?: number;
	product_id: number;
	product_qty: number;
	user_id: number;
	status?: string;
}

export enum Status {
	active = "active",
	complete = "complete",
}

class OrderModel {
	// Promise<IOrder[]>
	private static table = "orders";

	private static mappOrder(db_order: DbOrder): IOrder {
		return {
			id: Number(db_order.id),
			user_id: db_order.user_id,
			status: String(db_order.status),
			proudcts: [OrderModel.mapProduct(db_order)],
		};
	}

	private static mapProduct(db_order: DbOrder): Product {
		return {
			id: db_order.product_id,
			quantity: db_order.product_qty,
		};
	}

	private static mappOrders(db_orders: DbOrder[]): IOrder[] {
		/**
		 * this function debends on that DbOrder[] orderd by order.id
		 * all orders should be for the same user.
		 * time complexity = O(db_orders.length - 1)
		 */
		let prev_order_id: number | undefined;
		const new_orders: IOrder[] = [];

		for (const db_order of db_orders) {
			if (db_order.id == prev_order_id) {
				// if order exits in new_orders add the new Product to it's Products Array
				const newProduct = OrderModel.mapProduct(db_order);
				new_orders[new_orders.length - 1].proudcts.push(newProduct);
			} else {
				// if order dose't exits in new_orders add it
				prev_order_id = db_order.id;
				const newOrder = OrderModel.mappOrder(db_order);
				new_orders.push(newOrder);
			}
		}
		return new_orders;
	}

	static async userOrders(user_id: number, status: string) {
		const q = `select o.id as id,
                            p.product_id,
                            p.quantity as product_qty,
                            o.user_id,
                            s.name as status 
                    from public.status s
                    join public.orders o
                    on s.id = o.status
                    join public.products_orders p
                    on o.id = p.order_id 
                    where user_id = ($1) and s.name = ($2)
					order by id;`;

		const errMsg = `couldn't fetch ${status} oders for user id ${user_id}`;
		const orders = await Connection.excute<DbOrder>({ q, errMsg, params: [user_id, status] });
		return orders ? OrderModel.mappOrders(orders) : null;
	}

	static async create(o: DbOrder): Promise<number | null> {
		// const q = `WITH tes AS (
		// 	INSERT INTO orders (user_id, status) VALUES($1, $2) returning id as order_id
		// )
		// insert into products_orders (order_id, product_id, quantity)
		// select order_id, ($3), ($4) from tes;`;
		const createOrder_q = `INSERT INTO orders (user_id, status) VALUES($1, $2) returning id;`;
		let order: DbOrder[] | null;
		try {
			order = await Connection.excute<DbOrder>({
				q: createOrder_q,
				params: [o.user_id, 1],
			});
			if (order && order[0].id) {
				o.id = Number(order[0].id);
				await OrderModel.addProduct(o.id, o.product_id, o.product_qty);
				return o.id ? o.id : null;
			}
			return null;
		} catch (err) {
			throw new Error(`could't create order: ${err}`);
		}
	}

	private static async addNewProduct(
		order_id: number,
		product_id: number,
		product_qty: number
	): Promise<DbOrder | null> {
		// const q = `WITH tes AS (
		// 	INSERT INTO orders (user_id, status) VALUES($1, $2) returning id as order_id
		// )
		// insert into products_orders (order_id, product_id, quantity)
		// select order_id, ($3), ($4) from tes;`;
		const addProduct_q = `INSERT INTO products_orders (order_id, product_id, quantity) 
							  VALUES($1, $2, $3) returning *;`;

		try {
			const Product_order = await Connection.excute<DbOrder>({
				q: addProduct_q,
				params: [order_id, product_id, product_qty],
			});
			return Product_order ? Product_order[0] : null;
		} catch (err) {
			console.log(err);
			throw new Error(`could't add product to the order: ${err}`);
		}
	}

	private static async addToExistsProduct(
		order_id: number,
		product_id: number,
		product_qty: number
	): Promise<DbOrder | null> {
		const q = `update  products_orders
							  SET  quantity = ${product_qty} 
							  where product_id = ${product_id} and order_id = ${order_id} returning *;`;

		try {
			const Product_order = await Connection.excute<DbOrder>({ q });
			return Product_order ? Product_order[0] : null;
		} catch (err) {
			throw new Error(`could't add product to the order: ${err}`);
		}
	}

	private static async checkProduct(order_id: number, product_id: number): Promise<number | null> {
		const q = `select quantity
					from products_orders 
					where product_id = ($1) and order_id = ($2);`;
		const result = await Connection.excute<{ quantity: number }>({
			q,
			params: [product_id, order_id],
		});
		return result ? result[0].quantity : null;
	}

	static async addProduct(order_id: number, product_id: number, product_qty: number): Promise<DbOrder | null> {
		let order;
		// ckeck if product exist in order if so return product quantity.
		const exiProductQty = await OrderModel.checkProduct(order_id, product_id);
		if (exiProductQty) {
			const newQty = exiProductQty + product_qty;
			order = await OrderModel.addToExistsProduct(order_id, product_id, newQty);
		} else {
			order = await OrderModel.addNewProduct(order_id, product_id, product_qty);
		}
		return order;
	}

	private static async deleteOrder(order_id: number): Promise<void> {
		const q = `DELETE FROM products_orders  WHERE id = ${order_id}`;
		try {
			await Connection.excute<DbOrder>({ q });
		} catch (err) {
			throw new Error(`could't delete order: ${err}`);
		}
	}
}

export default OrderModel;
