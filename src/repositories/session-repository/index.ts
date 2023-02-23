import { prisma } from '@/config';
import { Prisma } from '@prisma/client';

async function createSession(data: Prisma.SessionUncheckedCreateInput) {
	return prisma.session.create({
		data,
	});
}

const sessionRepository = {
	createSession,
};

export default sessionRepository;
