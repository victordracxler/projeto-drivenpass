import { prisma } from '@/config';
import { Prisma } from '@prisma/client';

async function createCredential(data: Prisma.CredentialUncheckedCreateInput) {
	return prisma.credential.create({
		data,
	});
}

const credentialsRepository = {
	createCredential,
};

export default credentialsRepository;
