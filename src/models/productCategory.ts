import { Product } from "./product";
import { Category } from "./category";

export interface IProductCategory {
	id?: number;
	name: string;
	price: number;

	category_name?: string;
	category_id: number;
}

export default class ProductCategory {
	// ProductCategory is the shape of product that app will be received.
	private _id?: number;
	private _name: string;
	private _price: number;

	public category: Category;

	static readonly mustAttributes: string[] = ["name", "price", "category_id"];

	constructor(name: string, price: number, category_id: number, category_name?: string, id?: number) {
		this._id = id;
		this._name = name;
		this._price = price;

		this.category = new Category(category_id, category_name);
	}

	toProduct(): Product {
		const p: Product = {
			id: this._id,
			name: this._name,
			price: this._price,
			category: {
				id: this.category.id,
				name: this.category.name,
			},
		};
		return p;
	}

	static toProducts(pc: IProductCategory[]): Product[] {
		// Todo : make sure data is what it ment to be.
		return pc.map(i => new ProductCategory(i.name, i.price, i.category_id, i.category_name, i.id).toProduct());
	}
}
