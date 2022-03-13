import Clint from "../../database";

export type Quiry = {
	q: string;
	errMsg?: string;
	params?: unknown[];
};

export class Connection {
	static async excute<T>(quiry: Quiry): Promise<T[] | null> {
		// if data dose not exist function will return null.
		try {
			const conn = await Clint.connect();
			const result = await conn.query(quiry.q, quiry.params);
			conn.release();
			return result.rows.length ? result.rows : null;
		} catch (err) {
			console.log("------- Connection ------- ", err);
			throw new Error(`${quiry.errMsg}, ${err}`);
		}
	}
}
