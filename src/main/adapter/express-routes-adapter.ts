import { Request, Response } from 'express';
import { Controller, httpResponse, httpResquest } from '../../presentation/controller/protocols';

export const adapteRoute = (controller: Controller) => async (req: Request, res: Response) => {
  const httpRequest: httpResquest = { body: req.body };
  const httpResponse: httpResponse = await controller.handle(httpRequest);
  if (httpResponse.statusCode === 200) {
    res.status(httpResponse.statusCode).json(httpResponse.body);
  } else {
    res.status(httpResponse.statusCode).json({ error: httpResponse.body.message });
  }
};
