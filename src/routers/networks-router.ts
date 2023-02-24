import {} from '@/controllers';
import {
	deleteNetwork,
	getAllNetworks,
	getOneNetwork,
	postNetwork,
} from '@/controllers/network-controller';
import { authenticateToken, validateBody } from '@/middlewares';
import { networkSchema } from '@/schemas';
import { Router } from 'express';

const networksRouter = Router();

networksRouter
	.all('/*', authenticateToken)
	.get('/', getAllNetworks)
	.get('/:id', getOneNetwork)
	.post('/', validateBody(networkSchema), postNetwork)
	.delete('/:id', deleteNetwork);

export { networksRouter };
