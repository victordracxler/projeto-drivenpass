import { conflictError, invalidCredentialsError } from '@/errors';
import sessionRepository from '@/repositories/session-repository';
import userRepository from '@/repositories/users-repository';
import { exclude } from '@/utils/prisma-utils';
import { User } from '@prisma/client';
import Cryptr from 'cryptr';
import jwt from 'jsonwebtoken';

const cryptr = new Cryptr('ReallySecretKey');

const credentialsService = {};

export default credentialsService;
