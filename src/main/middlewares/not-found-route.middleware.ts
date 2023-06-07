import { RequestHandler } from 'express';

import { HttpStatusCode } from '@shared/utils/http-status-code.util';

type Adapter = () => RequestHandler;

export const notFoundRouteMiddleware: Adapter = () => async (request, response, _next) => {
  if (!response.headersSent) {
    const error = {
      code: 'not_found',
      message: `Can't find ${request.method.toUpperCase()} ${request.originalUrl} on this server.`,
      status: HttpStatusCode.NOT_FOUND
    };
    response.status(error.status).send(error);
  }
  response.end();
};
