import Clint from "../../database";

export type Quiry = {
	q: string;
	errMsg?: string;
	params?: unknown[];
};

export class Connection {
	static async excute<T>(quiry: Quiry): Promise<T[] | null> {
		try {
			const conn = await Clint.connect();
			const result = await conn.query(quiry.q, quiry.params);
			conn.release();
			return result.rows.length ? result.rows : null;
		} catch (err) {
			throw new Error(`${quiry.errMsg}, ${err}`);
		}
	}
}
