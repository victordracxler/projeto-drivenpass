import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';

export async function getCredentials(
	req: AuthenticatedRequest,
	res: Response
) {}

export async function postCredential(
	req: AuthenticatedRequest,
	res: Response
) {}
