import bcrypt from "bcrypt";

import { Quiry, Connection } from "../util/models/database";

const { SALT_ROUNDS: ROUNDS, BCRYPT_PASSWORD: PEPPAR } = process.env;
export interface IUser {
	id?: number;
	password?: string;

	email: string;
	lastName: string;
	firstName: string;
}
export default class User {
	static readonly tableName = "users";

	private _email: string;
	private _password: string;

	private _firstName?: string;
	private _lastName?: string;

	static readonly mustAttributes: string[] = ["email", "password", "firstName", "lastName"];

	constructor(email: string, password: string, firstName?: string, lastName?: string) {
		this._email = email;
		this._password = password;

		this._firstName = firstName;
		this._lastName = lastName;
	}

	get email() {
		return this._email;
	}

	private async hashPassword(): Promise<string> {
		return await bcrypt.hash(String(this._password) + PEPPAR, parseInt(String(ROUNDS)));
	}

	private async checkPassword(hashPassword: string): Promise<boolean> {
		// check if incoming (Plain password) is equal to (database's hashed password)
		return await bcrypt.compare(this._password + PEPPAR, hashPassword);
	}

	async getHasedPassword(): Promise<string | null> {
		const query: Quiry = {
			q: `select password
	            from ${User.tableName}
	            where email = '${this._email}';`,
		};

		const result = await Connection.excute<IUser>(query);
		if (result == null) return result;
		return result[0].password as string;
	}

	async authenticate(): Promise<User | null> {
		const hasedPassword = await this.getHasedPassword();

		if (!hasedPassword) throw new Error(`Email : ${this._email} is not registerd`);

		if (!(await this.checkPassword(hasedPassword))) return null;

		return this;
	}

	static async index(): Promise<IUser[] | null> {
		const query: Quiry = {
			q: `select  id,
                        email,
                        lastName,
                        firstName 
                from ${User.tableName};`,
		};
		return await Connection.excute<IUser>(query);
	}

	static async show(email: string): Promise<IUser | null> {
		const query: Quiry = {
			q: `select  id,
	                    email,
	                    lastname,
	                    firstname
	            from ${User.tableName}
                where email='${email}';`,
		};
		const users = await Connection.excute<IUser>(query);
		return users ? users[0] : null;
	}

	async create(): Promise<IUser | null> {
		const q = `INSERT INTO ${User.tableName}
                     (firstname,
					  lastname,
                      email,
                      password)
                   VALUES ($1, $2, $3, $4) 
                   returning id, firstname, lastname, email;`;

		const users = await Connection.excute<IUser>({
			q,
			params: [this._firstName, this._lastName, this._email, await this.hashPassword()],
		});
		return users ? users[0] : users;
	}
}
