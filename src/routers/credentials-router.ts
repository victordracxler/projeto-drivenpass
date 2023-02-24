import {
	getAllCredentials,
	getOneCredential,
	postCredential,
} from '@/controllers';
import { authenticateToken } from '@/middlewares';
import { Router } from 'express';

const credentialsRouter = Router();

credentialsRouter
	.all('/*', authenticateToken)
	.post('/', postCredential)
	.get('/', getAllCredentials)
	.get('/:id', getOneCredential);

export { credentialsRouter };
