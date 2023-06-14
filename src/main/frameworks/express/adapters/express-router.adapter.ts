import { Request, Response } from 'express';

import { HttpRequest } from '@shared/types/http-request.type';
import { HttpResponse } from '@shared/types/http-response.type';
import { HttpStatusCode } from '@shared/utils/http-status-code.util';

interface IController {
  handle(httpRequest: HttpRequest<any, any>): Promise<HttpResponse>;
}

export const adapterRoute = (controller: IController) => {
  return async (request: Request, response: Response) => {
    const httpRequest: HttpRequest<any, any> = {
      body: request.body,
      access_token: request.headers.authorization ?? '',
      headers: request.headers
    };

    const { data, statusCode } = await controller.handle(httpRequest);
    if (statusCode >= HttpStatusCode.OK && statusCode <= 399) {
      response.status(statusCode).json(data);
    } else {
      response.status(statusCode).json({ error: data.error });
    }
  };
};
