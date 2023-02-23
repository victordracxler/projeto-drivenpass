import { signIn, signUp } from '@/controllers/authentication-controller';
import { validateBody } from '@/middlewares';
import { signInSchema, SignUpSchema } from '@/schemas';
import { Router } from 'express';

const authenticationRouter = Router();

authenticationRouter.post('/sign-up', validateBody(SignUpSchema), signUp);

authenticationRouter.post('/sign-in', validateBody(signInSchema), signIn);

export { authenticationRouter };
