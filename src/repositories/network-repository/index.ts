import { prisma } from '@/config';
import { Prisma } from '@prisma/client';

async function createNetwork(data: Prisma.NetworkUncheckedCreateInput) {
	return prisma.network.create({
		data,
	});
}

async function findNetworksByUserId(userId: number) {
	return prisma.network.findMany({
		where: { userId },
	});
}

async function findNetworksByTitle(title: string) {
	return prisma.network.findFirst({
		where: { title },
	});
}

async function findNetworkbyId(id: number) {
	return prisma.network.findFirst({
		where: { id },
	});
}

async function deleteNetworkById(id: number) {
	return prisma.network.delete({
		where: { id },
	});
}

const networksRepository = {
	createNetwork,
	findNetworksByUserId,
	findNetworksByTitle,
	findNetworkbyId,
	deleteNetworkById,
};

export default networksRepository;
