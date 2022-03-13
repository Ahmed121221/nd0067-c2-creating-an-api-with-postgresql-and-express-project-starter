import { Quiry, Connection } from "../util/models/database";
import Clint from "../database";
import Model from "../models/utill/imodel";

import bcrypt from "bcrypt";

const { SALT_ROUNDS: ROUNDS, BCRYPT_PASSWORD: PEPPAR } = process.env;
export interface IUser {
	id: number;
	password?: string;

	email: string;
	lastName: string;
	firstName: string;
}
export default class User {
	static readonly tableName = "users";

	private _firstName?: string;
	private _lastName?: string;
	private _email: string;

	private _password: string;
	private _hashedPassword?: string;

	constructor(email: string, password: string, firstName?: string, lastName?: string) {
		this._email = email;
		this._firstName = firstName;
		this._lastName = lastName;

		this._password = password;
	}

	get email() {
		return this._email;
	}

	private async hashPassword(): Promise<string> {
		return await bcrypt.hash(String(this._password) + PEPPAR, parseInt(String(ROUNDS)));
	}

	private async checkPassword(): Promise<boolean> {
		// check if incoming this._password (Plain password) is
		// equal to this._hasedpassword (database's hashed password)
		if (typeof this._hashedPassword !== "string") return false;
		return await bcrypt.compare(this._password + PEPPAR, this._hashedPassword);
	}

	async getHasedPassword(): Promise<string | null> {
		const query: Quiry = {
			q: `select password
	            from ${User.tableName}
	            where email = '${this._email}';`,

			errMsg: "somthing wrong happend, could't fetch Users",
		};

		const result = await Connection.excute<IUser>(query);

		// if (!result) throw new Error(`email : ${this._email} dose not registed.`);
		if (result == null) return result;

		return result[0].password as string;
	}

	static async index(): Promise<IUser[] | null> {
		const query: Quiry = {
			q: `select  id,
                        email,
                        lastName,
                        firstName 
                from ${User.tableName};`,

			errMsg: "somthing wrong happend, could't fetch Users",
		};

		return await Connection.excute<IUser>(query);
	}

	static async show(email: string): Promise<IUser | null> {
		console.log("++++++++++", User.tableName, email);
		const query: Quiry = {
			q: `select  id,
	                    email,
	                    lastname,
	                    firstname
	            from ${User.tableName}
                where email='${email}';`,

			errMsg: `something wrong happend, could't fetch user with email ${email}`,
		};
		const users = await Connection.excute<IUser>(query);
		return users ? users[0] : null;
	}

	async create(): Promise<IUser | null> {
		console.log(
			"+++++++++",
			this._firstName,
			this._lastName,
			this._email,
			await this.hashPassword()
		);
		const q = `INSERT INTO ${User.tableName}
                     (firstname,
					  lastname,
                      email,
                      password)
                   VALUES ($1, $2, $3, $4) 
                   returning id, firestname, lastname, email;`;

		const users = await Connection.excute<IUser>({
			q,
			errMsg: "An error accured couldn't create user.",
			params: [this._firstName, this._lastName, this._email, await this.hashPassword()],
		});
		return users ? users[0] : users;
	}

	async authenticate(): Promise<User | null> {
		const hasedPassword = await this.getHasedPassword();

		if (!hasedPassword) throw new Error(`Email : ${this._email} is not registerd`);

		this._hashedPassword = hasedPassword;

		if (!this.checkPassword()) return null;

		return this;
	}
}
