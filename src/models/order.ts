import { Quiry, Connection } from "../util/models/database";
import Clint from "../database";

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
	id: number;
	product_id: number;
	product_qty: number;
	user_id: number;
	status: string;
}

class OrderModel {
	// Promise<IOrder[]>
	private static tableName = "orders";

	static async userActiveOrders(user_id: number) {
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
                    where user_id = ($1) and s.name = 'active'
					order by id;`;

		const orders = await Connection.excute<DbOrder>({ q, params: [user_id] });
		return orders ? OrderModel.mappOrders(orders) : null;
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
				// if order exits in new_orders
				const newProduct: Product = {
					id: db_order.product_id,
					quantity: db_order.product_qty,
				};
				new_orders[new_orders.length - 1].proudcts.push(newProduct);
			} else {
				// if order dose't exits in new_orders add it
				prev_order_id = db_order.id;
				const newOrder: IOrder = {
					id: db_order.id,
					user_id: db_order.user_id,
					status: db_order.status,
					proudcts: [
						{
							id: db_order.product_id,
							quantity: db_order.product_qty,
						},
					],
				};
				new_orders.push(newOrder);
			}
		}
		return new_orders;
	}
}

export default OrderModel;
