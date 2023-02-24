import app, { init } from '@/app';
import { faker } from '@faker-js/faker';
import httpStatus from 'http-status';
import supertest from 'supertest';
import { cleanDb, generateValidToken } from '../helpers';
import * as jwt from 'jsonwebtoken';
import { createCredential, createUser } from '../factories';

beforeAll(async () => {
	await init();
	await cleanDb();
});

const server = supertest(app);

describe('POST /credentials', () => {
	it('should respond with status 401 if no token is given', async () => {
		const response = await server.post('/credentials');

		expect(response.status).toBe(httpStatus.UNAUTHORIZED);
	});

	it('should respond with status 401 if given token is not valid', async () => {
		const token = faker.lorem.word();

		const response = await server
			.post('/credentials')
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
			.post('/credentials')
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(httpStatus.UNAUTHORIZED);
	});

	describe('when token is valid', () => {
		it('should respond with status 400 when body is not given', async () => {
			const user = await createUser();
			const token = await generateValidToken(user);

			const response = await server
				.post('/credentials')
				.set('Authorization', `Bearer ${token}`);

			expect(response.status).toBe(httpStatus.BAD_REQUEST);
		});

		it('should respond with status 400 when body is not valid', async () => {
			const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

			const user = await createUser();
			const token = await generateValidToken(user);

			const response = await server
				.post('/credentials')
				.send(invalidBody)
				.set('Authorization', `Bearer ${token}`);

			expect(response.status).toBe(httpStatus.BAD_REQUEST);
		});

		describe('when body is valid', () => {
			it('should respond with status 201 when credential is successfully created ', async () => {
				const user = await createUser();
				const token = await generateValidToken(user);
				// const credential = await createCredential({ userId: user.id });

				const data = {
					title: faker.internet.domainWord(),
					url: faker.internet.url(),
					username: faker.internet.userName(),
					password: faker.internet.password(8),
				};

				const response = await server
					.post('/credentials')
					.send(data)
					.set('Authorization', `Bearer ${token}`);

				expect(response.status).toEqual(httpStatus.CREATED);
			});

			it('should respond with status 401 when user already have a credential with same title', async () => {
				const user = await createUser();
				const token = await generateValidToken(user);
				// const credential = await createCredential({ userId: user.id });

				const data = {
					title: faker.internet.domainWord(),
					url: faker.internet.url(),
					username: faker.internet.userName(),
					password: faker.internet.password(8),
				};
				await server
					.post('/credentials')
					.send(data)
					.set('Authorization', `Bearer ${token}`);

				const response = await server
					.post('/credentials')
					.send(data)
					.set('Authorization', `Bearer ${token}`);

				expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
			});
		});
	});
});

describe('GET /credentials', () => {
	it('should respond with status 401 if no token is given', async () => {
		const response = await server.get('/credentials');

		expect(response.status).toBe(httpStatus.UNAUTHORIZED);
	});

	it('should respond with status 401 if given token is not valid', async () => {
		const token = faker.lorem.word();

		const response = await server
			.get('/credentials')
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
			.get('/credentials')
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(httpStatus.UNAUTHORIZED);
	});

	describe('when token is valid', () => {
		it('should respond with status 200 and empty array when there are no credentials for user', async () => {
			const user = await createUser();
			const token = await generateValidToken(user);

			const response = await server
				.get('/credentials')
				.set('Authorization', `Bearer ${token}`);

			expect(response.status).toBe(httpStatus.OK);
			expect(response.body).toEqual([]);
		});

		it('should respond with status 200 and credentials array', async () => {
			const user = await createUser();
			const token = await generateValidToken(user);
			// await createCredential({ userId: user.id });

			const data = {
				title: faker.internet.domainWord(),
				url: faker.internet.url(),
				username: faker.internet.userName(),
				password: faker.internet.password(8),
			};
			await server
				.post('/credentials')
				.send(data)
				.set('Authorization', `Bearer ${token}`);

			const response = await server
				.get('/credentials')
				.set('Authorization', `Bearer ${token}`);

			expect(response.status).toBe(httpStatus.OK);
			expect(response.body).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						title: expect.any(String),
						url: expect.any(String),
						username: expect.any(String),
						password: expect.any(String),
					}),
				])
			);
		});
	});
});

describe('GET /credentials/:id', () => {
	it('should respond with status 401 if no token is given', async () => {
		const response = await server.get('/credentials/1');

		expect(response.status).toBe(httpStatus.UNAUTHORIZED);
	});

	it('should respond with status 401 if given token is not valid', async () => {
		const token = faker.lorem.word();

		const response = await server
			.get('/credentials/1')
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
			.get('/credentials/1')
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(httpStatus.UNAUTHORIZED);
	});

	describe('when token is valid', () => {
		it('should respond with status 404 when id does not exist', async () => {
			const user = await createUser();
			const token = await generateValidToken(user);

			const response = await server
				.get('/credentials/0')
				.set('Authorization', `Bearer ${token}`);

			expect(response.status).toBe(httpStatus.NOT_FOUND);
		});

		it('should respond with status 400 when id does not valid', async () => {
			const user = await createUser();
			const token = await generateValidToken(user);

			const response = await server
				.get('/credentials/a')
				.set('Authorization', `Bearer ${token}`);

			expect(response.status).toBe(httpStatus.BAD_REQUEST);
		});

		describe('when id is valid', () => {
			it('should respond with status 401 when credential belongs to another user', async () => {
				const user1 = await createUser();
				const token1 = await generateValidToken(user1);

				const user2 = await createUser();
				const token2 = await generateValidToken(user2);

				const data = {
					title: faker.internet.domainWord(),
					url: faker.internet.url(),
					username: faker.internet.userName(),
					password: faker.internet.password(8),
				};
				const firstCredential = await server
					.post('/credentials')
					.send(data)
					.set('Authorization', `Bearer ${token1}`);

				const response = await server
					.get(`/credentials/${firstCredential.body.id}`)
					.set('Authorization', `Bearer ${token2}`);

				expect(response.status).toBe(httpStatus.UNAUTHORIZED);
			});

			it('should respond with status 200 and credential data', async () => {
				const user = await createUser();
				const token = await generateValidToken(user);

				const data = {
					title: faker.internet.domainWord(),
					url: faker.internet.url(),
					username: faker.internet.userName(),
					password: faker.internet.password(8),
				};
				const firstCredential = await server
					.post('/credentials')
					.send(data)
					.set('Authorization', `Bearer ${token}`);

				const response = await server
					.get(`/credentials/${firstCredential.body.id}`)
					.set('Authorization', `Bearer ${token}`);

				expect(response.status).toBe(httpStatus.OK);
				expect(response.body).toEqual(
					expect.objectContaining({
						title: data.title,
						url: data.url,
						username: data.username,
						password: data.password,
					})
				);
			});
		});
	});
});
