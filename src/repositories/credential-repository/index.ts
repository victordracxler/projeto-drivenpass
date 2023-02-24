import { prisma } from '@/config';
import { Prisma } from '@prisma/client';

async function createCredential(data: Prisma.CredentialUncheckedCreateInput) {
	return prisma.credential.create({
		data,
	});
}

async function findCredentialsByUserId(userId: number) {
	return prisma.credential.findMany({
		where: { userId },
	});
}

async function findCredentialsByTitle(title: string) {
	return prisma.credential.findFirst({
		where: { title },
	});
}

async function findCredentialbyId(id: number) {
	return prisma.credential.findFirst({
		where: { id },
	});
}

const credentialsRepository = {
	createCredential,
	findCredentialsByUserId,
	findCredentialsByTitle,
	findCredentialbyId,
};

export default credentialsRepository;
