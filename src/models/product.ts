import { Quiry, Connection } from "../util/models/database";
import Clint from "../database";
import ProductCategory, { IProductCategory } from "./productCategory";
import { ICategory } from "./category";

interface Product {
	id?: number;
	name: string;
	price: number;
	category: ICategory;
}

class ProdactStore {
	private readonly table: string = "products";

	async index(): Promise<Product[] | null> {
		const q = `select p.id,
						  p.name,
						  p.price,
						    c.id as category_id,
						    c.name as category_name
				   from ${this.table}  p
				   join categories c
				   on p.category_id = c.id;`;

		const query: Quiry = { q };
		const result = await Connection.excute<IProductCategory>(query);

		return result ? ProductCategory.toProducts(result) : null;
	}

	async show(id: number): Promise<Product[]> {
		const q = `select  p.id,
							p.name,
							p.price,
							c.id as category_id,
							c.name as category_name
				from( select *
					  from ${this.table}
					  where id=${id} )  p
					join categories c
					on p.category_id = c.id;`;
		const query: Quiry = { q };

		const products = await Connection.excute<IProductCategory>(query);

		if (products == null) throw new Error(`Product with id ${id} dose not exist.`);

		return ProductCategory.toProducts(products);
	}

	async create(p: Product): Promise<Product[]> {
		const q = `INSERT INTO ${this.table} (name, price, category_id) VALUES($1, $2, $3) returning id; `;
		try {
			const conn = await Clint.connect();
			const newProducts = await conn.query(q, [p.name, p.price, p.category.id]);
			p.id = newProducts.rows[0].id;
			return [p];
		} catch (err) {
			throw new Error(`could't create product: ${p}`);
		}
	}
}

export default ProdactStore;
export { Product };
