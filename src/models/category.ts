import { Connection, Quiry } from "../util/models/database";

export interface ICategory {
	id: number;
	name?: string;
}

export class Category {
	private _name?: string;
	private _id: number;

	constructor(id: number, name?: string) {
		this._id = id;
		this._name = name;
	}

	get id() {
		return this._id;
	}

	get name() {
		return this._name;
	}

	async checId(): Promise<boolean> {
		// check if id in data base and assign it's name.
		const q = `select name from categories where id =${this._id};`;
		const query: Quiry = { q };
		const result = await Connection.excute<ICategory>(query);

		if (!result) return false;

		this._name = String(result[0].name) ?? "";
		return true;
	}
}
