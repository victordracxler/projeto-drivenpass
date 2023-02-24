import {
	getAllCredentials,
	getOneCredential,
	postCredential,
} from '@/controllers';
import { authenticateToken, validateBody } from '@/middlewares';
import { credentialSchema } from '@/schemas';
import { Router } from 'express';

const credentialsRouter = Router();

credentialsRouter
	.all('/*', authenticateToken)
	.get('/', getAllCredentials)
	.get('/:id', getOneCredential)
	.post('/', validateBody(credentialSchema), postCredential);

export { credentialsRouter };
