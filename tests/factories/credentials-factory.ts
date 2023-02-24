import { faker } from '@faker-js/faker';
import { prisma } from '@/config';
import { Prisma } from '@prisma/client';
import Cryptr from 'cryptr';

const cryptr = new Cryptr(process.env.JWT_SECRET);

export async function createCredential(
	params: Partial<Prisma.CredentialUncheckedCreateInput> = {}
): Promise<Prisma.CredentialUncheckedCreateInput> {
	const hashedPassword = cryptr.encrypt(faker.internet.password(8));

	return prisma.credential.create({
		data: {
			title: params.title || faker.internet.domainWord(),
			url: faker.internet.url(),
			username: faker.internet.userName(),
			password: hashedPassword,
			userId: params.userId,
		},
	});
}
