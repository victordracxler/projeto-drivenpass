import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import networksService from '@/services/network-services';
import { Prisma } from '@prisma/client';

export async function getAllNetworks(req: AuthenticatedRequest, res: Response) {
	const { userId } = req;

	try {
		const networkList = await networksService.getAllUserNetworks(userId);

		res.status(httpStatus.OK).send(networkList);
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
export async function getOneNetwork(req: AuthenticatedRequest, res: Response) {
	const { userId } = req;
	const { id } = req.params;
	const networkId = Number(id);

	try {
		const network = await networksService.getNetworkById(networkId, userId);

		res.status(httpStatus.OK).send(network);
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

export async function deleteNetwork(req: AuthenticatedRequest, res: Response) {
	const { userId } = req;
	const { id } = req.params;
	const networkId = Number(id);

	try {
		await networksService.deleteNetwork(networkId, userId);

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

export async function postNetwork(req: AuthenticatedRequest, res: Response) {
	const { title, network, password } = req.body;
	const { userId } = req;

	const networkData: Prisma.NetworkUncheckedCreateInput = {
		title,
		network,
		password,
		userId,
	};

	try {
		const newNetwork = await networksService.createNetwork(networkData);

		res.status(httpStatus.CREATED).send({ id: newNetwork });
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
