import { conflictError, invalidCredentialsError } from '@/errors';
import sessionRepository from '@/repositories/session-repository';
import userRepository from '@/repositories/users-repository';
import { exclude } from '@/utils/prisma-utils';
import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

async function signUp(params: SignUpParams) {
	const userExists = await userRepository.findUserByEmail(params.email);

	if (userExists) {
		throw conflictError('This email is already signed up');
	}

	const hashPassword = bcrypt.hashSync(params.password, 10);

	const userData = {
		email: params.email,
		password: hashPassword,
	};

	await userRepository.createUser(userData);

	return;
}

async function signIn(params: SignInParams) {
	const user = await findUserOrFail(params.email);

	const isPasswordValid = await bcrypt.compare(
		params.password,
		user.password
	);
	if (!isPasswordValid) throw invalidCredentialsError();

	const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

	await sessionRepository.createSession({
		token,
		userId: user.id,
	});

	return {
		user: exclude(user, 'password'),
		token,
	};
}

async function findUserOrFail(email: string): Promise<FindUserOrFailResult> {
	const user = await userRepository.findUserByEmail(email);
	if (!user) throw invalidCredentialsError();

	return user;
}
export type SignUpParams = Pick<User, 'email' | 'password'>;
export type SignInParams = Pick<User, 'email' | 'password'>;

type FindUserOrFailResult = Pick<User, 'id' | 'email' | 'password'>;

const authenticationService = {
	signIn,
	signUp,
};

export default authenticationService;
