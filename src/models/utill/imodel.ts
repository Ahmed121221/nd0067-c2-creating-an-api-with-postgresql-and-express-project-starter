import { IUser } from "../user";

export default interface Model {
	readonly tableName: string;
	index<T>(): Promise<T[] | null>;
	show<T>(user: T): Promise<T | null>;
	// create<T>(): Promise<T>;
}
