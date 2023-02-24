import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import credentialsService from '@/services/credential-services';

export async function getAllCredentials(
	req: AuthenticatedRequest,
	res: Response
) {
	const { userId } = req;

	try {
		const credentialList = await credentialsService.getAllUserCredentials(
			userId
		);

		res.status(httpStatus.OK).send(credentialList);
	} catch (error) {
		if (error.name === 'NotFoundError') {
			return res.sendStatus(httpStatus.NOT_FOUND);
		}
		if (error.name === 'UnauthorizedError') {
			return res.sendStatus(httpStatus.UNAUTHORIZED);
		}
		return res.sendStatus(httpStatus.BAD_REQUEST);
	}
}
export async function getOneCredential(
	req: AuthenticatedRequest,
	res: Response
) {
	const { userId } = req;
	const { id } = req.params;
	const credentialId = Number(id);

	try {
		const credential = await credentialsService.getCredentialById(
			credentialId,
			userId
		);

		res.status(httpStatus.OK).send(credential);
	} catch (error) {
		if (error.name === 'NotFoundError') {
			return res.sendStatus(httpStatus.NOT_FOUND);
		}
		if (error.name === 'UnauthorizedError') {
			return res.sendStatus(httpStatus.UNAUTHORIZED);
		}
		return res.sendStatus(httpStatus.BAD_REQUEST);
	}
}

export async function deleteCredential(
	req: AuthenticatedRequest,
	res: Response
) {
	const { userId } = req;
	const { id } = req.params;
	const credentialId = Number(id);

	try {
		await credentialsService.deleteCredential(credentialId, userId);

		res.status(httpStatus.OK).send({});
	} catch (error) {
		if (error.name === 'NotFoundError') {
			return res.sendStatus(httpStatus.NOT_FOUND);
		}
		if (error.name === 'UnauthorizedError') {
			return res.sendStatus(httpStatus.UNAUTHORIZED);
		}
		return res.sendStatus(httpStatus.BAD_REQUEST);
	}
}

export async function postCredential(req: AuthenticatedRequest, res: Response) {
	const { title, url, username, password } = req.body;
	const { userId } = req;

	const credentialData = {
		title,
		url,
		username,
		password,
		userId,
	};

	try {
		const newCredential = await credentialsService.createCredential(
			credentialData
		);

		res.sendStatus(httpStatus.CREATED);
	} catch (error) {
		if (error.name === 'NotFoundError') {
			return res.sendStatus(httpStatus.NOT_FOUND);
		}
		if (error.name === 'UnauthorizedError') {
			return res.sendStatus(httpStatus.UNAUTHORIZED);
		}
		return res.sendStatus(httpStatus.BAD_REQUEST);
	}
}
