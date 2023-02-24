import app, { init } from '@/app';
import { faker } from '@faker-js/faker';
import httpStatus from 'http-status';
import supertest from 'supertest';
import { cleanDb, generateValidToken } from '../helpers';
import * as jwt from 'jsonwebtoken';
import { createCredential, createUser } from '../factories';
import { Prisma } from '@prisma/client';
import { number } from 'joi';

beforeAll(async () => {
	await init();
	await cleanDb();
});

const server = supertest(app);

describe('POST /networks', () => {
	it('should respond with status 401 if no token is given', async () => {
		const response = await server.post('/networks');

		expect(response.status).toBe(httpStatus.UNAUTHORIZED);
	});

	it('should respond with status 401 if given token is not valid', async () => {
		const token = faker.lorem.word();

		const response = await server
			.post('/networks')
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(httpStatus.UNAUTHORIZED);
	});

	it('should respond with status 401 if there is no session for given token', async () => {
		const userWithoutSession = await createUser();
		const token = jwt.sign(
			{ userId: userWithoutSession.id },
			process.env.JWT_SECRET
		);

		const response = await server
			.post('/networks')
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(httpStatus.UNAUTHORIZED);
	});

	describe('when token is valid', () => {
		it('should respond with status 400 when body is not given', async () => {
			const user = await createUser();
			const token = await generateValidToken(user);

			const response = await server
				.post('/networks')
				.set('Authorization', `Bearer ${token}`);

			expect(response.status).toBe(httpStatus.BAD_REQUEST);
		});

		it('should respond with status 400 when body is not valid', async () => {
			const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

			const user = await createUser();
			const token = await generateValidToken(user);

			const response = await server
				.post('/networks')
				.send(invalidBody)
				.set('Authorization', `Bearer ${token}`);

			expect(response.status).toBe(httpStatus.BAD_REQUEST);
		});

		describe('when body is valid', () => {
			it('should respond with status 201 when network is successfully created ', async () => {
				const user = await createUser();
				const token = await generateValidToken(user);

				const data = {
					title: faker.internet.domainWord(),
					network: faker.internet.userName(),
					password: faker.internet.password(8),
				};

				const response = await server
					.post('/networks')
					.send(data)
					.set('Authorization', `Bearer ${token}`);

				expect(response.status).toEqual(httpStatus.CREATED);
			});
		});
	});
});

describe('GET /networks', () => {
	it('should respond with status 401 if no token is given', async () => {
		const response = await server.get('/networks');

		expect(response.status).toBe(httpStatus.UNAUTHORIZED);
	});

	it('should respond with status 401 if given token is not valid', async () => {
		const token = faker.lorem.word();

		const response = await server
			.get('/networks')
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(httpStatus.UNAUTHORIZED);
	});

	it('should respond with status 401 if there is no session for given token', async () => {
		const userWithoutSession = await createUser();
		const token = jwt.sign(
			{ userId: userWithoutSession.id },
			process.env.JWT_SECRET
		);

		const response = await server
			.get('/networks')
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(httpStatus.UNAUTHORIZED);
	});

	describe('when token is valid', () => {
		it('should respond with status 200 and empty array when there are no networks for user', async () => {
			const user = await createUser();
			const token = await generateValidToken(user);

			const response = await server
				.get('/networks')
				.set('Authorization', `Bearer ${token}`);

			expect(response.status).toBe(httpStatus.OK);
			expect(response.body).toEqual([]);
		});

		it('should respond with status 200 and networks array', async () => {
			const user = await createUser();
			const token = await generateValidToken(user);

			const data = {
				title: faker.internet.domainWord(),
				network: faker.internet.userName(),
				password: faker.internet.password(8),
			};
			await server
				.post('/networks')
				.send(data)
				.set('Authorization', `Bearer ${token}`);

			const response = await server
				.get('/networks')
				.set('Authorization', `Bearer ${token}`);

			expect(response.status).toBe(httpStatus.OK);
			expect(response.body).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						id: expect.any(Number),
						title: expect.any(String),
						network: expect.any(String),
						password: expect.any(String),
					}),
				])
			);
		});
	});
});

describe('GET /networks/:id', () => {
	it('should respond with status 401 if no token is given', async () => {
		const response = await server.get('/networks/1');

		expect(response.status).toBe(httpStatus.UNAUTHORIZED);
	});

	it('should respond with status 401 if given token is not valid', async () => {
		const token = faker.lorem.word();

		const response = await server
			.get('/networks/1')
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(httpStatus.UNAUTHORIZED);
	});

	it('should respond with status 401 if there is no session for given token', async () => {
		const userWithoutSession = await createUser();
		const token = jwt.sign(
			{ userId: userWithoutSession.id },
			process.env.JWT_SECRET
		);

		const response = await server
			.get('/networks/1')
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(httpStatus.UNAUTHORIZED);
	});

	describe('when token is valid', () => {
		it('should respond with status 404 when id does not exist', async () => {
			const user = await createUser();
			const token = await generateValidToken(user);

			const response = await server
				.get('/networks/0')
				.set('Authorization', `Bearer ${token}`);

			expect(response.status).toBe(httpStatus.NOT_FOUND);
		});

		it('should respond with status 400 when id is not valid', async () => {
			const user = await createUser();
			const token = await generateValidToken(user);

			const response = await server
				.get('/networks/a')
				.set('Authorization', `Bearer ${token}`);

			expect(response.status).toBe(httpStatus.BAD_REQUEST);
		});

		describe('when id is valid', () => {
			it('should respond with status 401 when network belongs to another user', async () => {
				const user1 = await createUser();
				const token1 = await generateValidToken(user1);

				const user2 = await createUser();
				const token2 = await generateValidToken(user2);

				const data = {
					title: faker.internet.domainWord(),
					network: faker.internet.userName(),
					password: faker.internet.password(8),
				};
				const firstNetwork = await server
					.post('/networks')
					.send(data)
					.set('Authorization', `Bearer ${token1}`);

				const response = await server
					.get(`/networks/${firstNetwork.body.id}`)
					.set('Authorization', `Bearer ${token2}`);

				expect(response.status).toBe(httpStatus.UNAUTHORIZED);
			});

			it('should respond with status 200 and network data', async () => {
				const user = await createUser();
				const token = await generateValidToken(user);

				const data = {
					title: faker.internet.domainWord(),
					network: faker.internet.userName(),
					password: faker.internet.password(8),
				};
				const firstCredential = await server
					.post('/networks')
					.send(data)
					.set('Authorization', `Bearer ${token}`);

				const response = await server
					.get(`/networks/${firstCredential.body.id}`)
					.set('Authorization', `Bearer ${token}`);

				expect(response.status).toBe(httpStatus.OK);
				expect(response.body).toEqual(
					expect.objectContaining({
						title: data.title,
						network: data.network,
						password: data.password,
					})
				);
			});
		});
	});
});

describe('DELETE /networks/:id', () => {
	it('should respond with status 401 if no token is given', async () => {
		const response = await server.delete('/networks/1');

		expect(response.status).toBe(httpStatus.UNAUTHORIZED);
	});

	it('should respond with status 401 if given token is not valid', async () => {
		const token = faker.lorem.word();

		const response = await server
			.delete('/networks/1')
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(httpStatus.UNAUTHORIZED);
	});

	it('should respond with status 401 if there is no session for given token', async () => {
		const userWithoutSession = await createUser();
		const token = jwt.sign(
			{ userId: userWithoutSession.id },
			process.env.JWT_SECRET
		);

		const response = await server
			.delete('/networks/1')
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(httpStatus.UNAUTHORIZED);
	});

	describe('when token is valid', () => {
		it('should respond with status 404 when id does not exist', async () => {
			const user = await createUser();
			const token = await generateValidToken(user);

			const response = await server
				.delete('/networks/0')
				.set('Authorization', `Bearer ${token}`);

			expect(response.status).toBe(httpStatus.NOT_FOUND);
		});

		it('should respond with status 400 when id is not valid', async () => {
			const user = await createUser();
			const token = await generateValidToken(user);

			const response = await server
				.delete('/networks/a')
				.set('Authorization', `Bearer ${token}`);

			expect(response.status).toBe(httpStatus.BAD_REQUEST);
		});

		describe('when id is valid', () => {
			it('should respond with status 401 when network belongs to another user', async () => {
				const user1 = await createUser();
				const token1 = await generateValidToken(user1);

				const user2 = await createUser();
				const token2 = await generateValidToken(user2);

				const data = {
					title: faker.internet.domainWord(),
					network: faker.internet.userName(),
					password: faker.internet.password(8),
				};
				const firstCredential = await server
					.post('/networks')
					.send(data)
					.set('Authorization', `Bearer ${token1}`);

				const response = await server
					.delete(`/networks/${firstCredential.body.id}`)
					.set('Authorization', `Bearer ${token2}`);

				expect(response.status).toBe(httpStatus.UNAUTHORIZED);
			});

			it('should respond with status 200 and delete network', async () => {
				const user = await createUser();
				const token = await generateValidToken(user);

				const data = {
					title: faker.internet.domainWord(),
					network: faker.internet.userName(),
					password: faker.internet.password(8),
				};
				const firstCredential = await server
					.post('/networks')
					.send(data)
					.set('Authorization', `Bearer ${token}`);

				const response = await server
					.delete(`/networks/${firstCredential.body.id}`)
					.set('Authorization', `Bearer ${token}`);

				const checkDeletion = await server
					.get(`/networks/${firstCredential.body.id}`)
					.set('Authorization', `Bearer ${token}`);

				expect(response.status).toBe(httpStatus.OK);
				expect(checkDeletion.status).toBe(httpStatus.NOT_FOUND);
			});
		});
	});
});
