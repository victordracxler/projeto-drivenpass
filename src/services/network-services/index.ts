import { notFoundError, unauthorizedError } from '@/errors';
import networksRepository from '@/repositories/network-repository';
import { Prisma, User } from '@prisma/client';
import Cryptr from 'cryptr';

const cryptr = new Cryptr(process.env.JWT_SECRET);

async function createNetwork(data: Prisma.NetworkUncheckedCreateInput) {
	const encryptedPassword = cryptr.encrypt(data.password);

	const networkData: Prisma.NetworkUncheckedCreateInput = {
		userId: data.userId,
		title: data.title,
		network: data.network,
		password: encryptedPassword,
	};

	const createdNetwork = await networksRepository.createNetwork(networkData);

	return createdNetwork.id;
}

async function getAllUserNetworks(userId: number) {
	const encryptedNetworks = await networksRepository.findNetworksByUserId(
		userId
	);

	if (!encryptedNetworks) {
		throw notFoundError();
	}
	const decryptedNetworks: Prisma.NetworkUncheckedCreateInput[] = [];

	encryptedNetworks.forEach((network: Prisma.NetworkUncheckedCreateInput) => {
		const decryptedPassword = cryptr.decrypt(network.password);
		const decryptedNetwork = {
			...network,
			password: decryptedPassword,
		};

		decryptedNetworks.push(decryptedNetwork);
	});

	return decryptedNetworks;
}

async function getNetworkById(id: number, userId: number) {
	const encryptedNetwork = await networksRepository.findNetworkbyId(id);

	if (!encryptedNetwork) {
		throw notFoundError();
	}
	if (encryptedNetwork.userId !== userId) {
		throw unauthorizedError();
	}

	const decryptedPassword = cryptr.decrypt(encryptedNetwork.password);
	const decryptedNetwork = {
		...encryptedNetwork,
		password: decryptedPassword,
	};

	return decryptedNetwork;
}

async function deleteNetwork(id: number, userId: number) {
	const encryptedNetwork = await networksRepository.findNetworkbyId(id);

	if (!encryptedNetwork) {
		throw notFoundError();
	}
	if (encryptedNetwork.userId !== userId) {
		throw unauthorizedError();
	}

	await networksRepository.deleteNetworkById(id);
}

const networksService = {
	createNetwork,
	getAllUserNetworks,
	getNetworkById,
	deleteNetwork,
};

export default networksService;
