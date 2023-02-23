import authenticationService, {
	SignInParams,
	SignUpParams,
} from '@/services/authentication-services';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

export async function signIn(req: Request, res: Response) {
	const { email, password } = req.body as SignInParams;

	try {
		const login = await authenticationService.signIn({ email, password });

		return res.status(httpStatus.OK).send(login);
	} catch (error) {
		return res.status(httpStatus.UNAUTHORIZED).send({});
	}
}

export async function signUp(req: Request, res: Response) {
	const { email, password } = req.body as SignUpParams;

	try {
		const login = await authenticationService.signUp({ email, password });

		return res.status(httpStatus.OK).send(login);
	} catch (error) {
		return res.status(httpStatus.UNAUTHORIZED).send({});
	}
}
