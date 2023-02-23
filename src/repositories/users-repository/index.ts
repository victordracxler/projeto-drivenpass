import { prisma } from '@/config';
import { Prisma } from '@prisma/client';

async function createUser(data: Prisma.UserCreateInput) {
	return prisma.user.create({
		data,
	});
}

async function findUserByEmail(email: string) {
	return prisma.user.findUnique({
		where: {
			email,
		},
	});
}
const userRepository = {
	createUser,
	findUserByEmail,
};

export default userRepository;
