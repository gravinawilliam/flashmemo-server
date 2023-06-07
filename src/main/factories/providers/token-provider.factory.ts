import { IGenerateJwtTokenProvider } from '@contracts/providers/token/generate-jwt.token-provider';

import { TOKEN_JWT_CONFIG } from '@infrastructure/configs/infrastructure.config';
import { JsonwebtokenTokenProvider } from '@infrastructure/providers/token/jsonwebtoken.token-provider';

import { makeLoggerProvider } from './logger-provider.factory';

export const makeTokenJwtProvider = (): IGenerateJwtTokenProvider =>
  new JsonwebtokenTokenProvider(makeLoggerProvider(), {
    ALGORITHM: TOKEN_JWT_CONFIG.ALGORITHM,
    EXPIRES_IN: TOKEN_JWT_CONFIG.EXPIRES_IN,
    ISSUER: TOKEN_JWT_CONFIG.ISSUER,
    SECRET: TOKEN_JWT_CONFIG.SECRET
  });
