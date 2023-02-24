import { notFoundError, unauthorizedError } from '@/errors';
import credentialsRepository from '@/repositories/credential-repository';
import { exclude } from '@/utils/prisma-utils';
import { Prisma, User } from '@prisma/client';
import Cryptr from 'cryptr';

const cryptr = new Cryptr(process.env.JWT_SECRET);

async function createCredential(data: Prisma.CredentialUncheckedCreateInput) {
	const titleAlreadyExists =
		await credentialsRepository.findCredentialsByTitle(data.title);

	if (titleAlreadyExists) {
		throw unauthorizedError();
	}

	const encryptedPassword = cryptr.encrypt(data.password);

	const credentialData: Prisma.CredentialUncheckedCreateInput = {
		userId: data.userId,
		title: data.title,
		url: data.url,
		username: data.username,
		password: encryptedPassword,
	};

	const createdCredential = await credentialsRepository.createCredential(
		credentialData
	);

	return createdCredential.id;
}

async function getAllUserCredentials(userId: number) {
	const encryptedCredentials =
		await credentialsRepository.findCredentialsByUserId(userId);

	if (!encryptedCredentials) {
		throw notFoundError();
	}
	const decryptedCredentials: Prisma.CredentialUncheckedCreateInput[] = [];

	encryptedCredentials.forEach(
		(credential: Prisma.CredentialUncheckedCreateInput) => {
			const decryptedPassword = cryptr.decrypt(credential.password);
			const decryptedCredential = {
				...credential,
				password: decryptedPassword,
			};

			decryptedCredentials.push(decryptedCredential);
		}
	);

	return decryptedCredentials;
}

async function getCredentialById(id: number, userId: number) {
	const encryptedCredential = await credentialsRepository.findCredentialbyId(
		id
	);

	if (!encryptedCredential) {
		throw notFoundError();
	}
	if (encryptedCredential.userId !== userId) {
		throw unauthorizedError();
	}

	const decryptedPassword = cryptr.decrypt(encryptedCredential.password);
	const decryptedCredential = {
		...encryptedCredential,
		password: decryptedPassword,
	};

	return decryptedCredential;
}

const credentialsService = {
	createCredential,
	getAllUserCredentials,
	getCredentialById,
};

export default credentialsService;
