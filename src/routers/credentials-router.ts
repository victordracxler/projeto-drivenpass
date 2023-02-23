import { getCredentials, postCredential } from '@/controllers';
import { authenticateToken } from '@/middlewares';
import { Router } from 'express';

const credentialsRouter = Router();

credentialsRouter
	.all('/*', authenticateToken)
	.post('/', postCredential)
	.get('/', getCredentials);

export { credentialsRouter };
