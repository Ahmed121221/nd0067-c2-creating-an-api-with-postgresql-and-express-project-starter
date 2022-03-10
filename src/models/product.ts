import { Quiry, Connection } from "../util/models/database";

// TODO: seperate categoies.
interface Category {
	id: number;
	name?: string;
}

interface ProdactCategory {
	id: number;
	name: string;
	price: number;
	c_name: string;
	c_id: number;
}

interface Product {
	id?: number;
	name: string;
	price: number;
	category: Category;
}

class ProdactStore {
	private readonly table: string = "products";

	prepareProducts(prodactsCategory: ProdactCategory[]): Product[] {
		const productMapper = (item: ProdactCategory): Product => {
			const newItem: Product = {
				id: item.id,
				name: item.name,
				price: item.price,
				category: {
					id: item.c_id,
					name: item.name,
				},
			};
			return newItem;
		};
		return prodactsCategory.map(productMapper);
	}

	async index(): Promise<Product[] | null> {
		const q = `select p.id,
						  p.name,
						  p.price,
						    c.id as c_id,
						    c.name as c_name
				   from ${this.table}  p
				   join categories c
				   on p.category_id = c.id;`;

		const query: Quiry = { q, errMsg: `couldn't fetch Products` };
		const result = await Connection.excute<ProdactCategory>(query);

		return result ? this.prepareProducts(result) : null;
	}

	async show(id: number): Promise<Product[] | null> {
		const q = `select  p.id,
							p.name,
							p.price,
							c.id as c_id,
							c.name as c_name
				from( select *
					  from ${this.table}
					  where id=${id} )  p
					join categories c
					on p.category_id = c.id;`;

		const query: Quiry = { q, errMsg: `couldn't fetch Product with id = ${id}` };
		const products = await Connection.excute<ProdactCategory>(query);

		return products ? this.prepareProducts(products) : null;
	}

	async getCategoryByName(c_name: string): Promise<Category | null> {
		const q = `select * from categories where name =${c_name};`;
		const query: Quiry = { q, errMsg: "couldn't fetch category somthing wrong happened" };
		const categories = await Connection.excute<Category>(query);

		return categories ? categories[0] : null;
	}

	async create(p: Product): Promise<Product[] | null> {
		const q = `INSERT INTO ${this.table} (name, price, category_id) VALUES($1, $2, $3)`;
		const query: Quiry = {
			q,
			errMsg: `could't create product: ${p}`,
			params: [p.name, p.price, p.category.id],
		};
		return await Connection.excute<Product>(query);
	}
}

export default ProdactStore;
export { Product };
