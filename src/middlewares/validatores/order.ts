import { Request, Response, NextFunction } from "express";
import { Status } from "../../models/order";

function validateUserId(req: Request, res: Response, next: NextFunction) {
	const p_user_id = Number(req.params.user_id);

	if (isNaN(p_user_id)) {
		res.status(400);
		res.json(`User Id Must be A Number.`);
		return;
	}
	next();
}

function validateOrderStatus(req: Request, res: Response, next: NextFunction) {
	const p_status = req.params.status;
	for (const status in Status) {
		if (p_status == status) {
			next();
			return;
		}
	}
	res.status(400);
	res.json(`Order Status Must Be Included (active or complete) Ex: domain/ordrs/user_id/active.`);
}

export function chekQuiryParams(params: string[]) {
	return (req: Request, res: Response, next: NextFunction) => {
		for (const key of params) {
			res.status(400);
			if (req.body[key] == undefined) {
				res.json(`you must include ${key} to quiry params.`);
				return;
			}

			const numKey = Number(req.body[key]);

			if (isNaN(numKey)) {
				res.json(`${key} must be a number.`);
				return;
			}
		}
		res.status(200);
		next();
	};
}

export default [validateUserId, validateOrderStatus];
