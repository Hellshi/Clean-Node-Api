import { Request, Response } from 'express';
import { Controller, httpResponse, httpResquest } from '../../presentation/controller/protocols';

export const adapteRoute = (controller: Controller) => async (req: Request, res: Response) => {
  const httpRequest: httpResquest = { body: req.body };
  const httpResponse: httpResponse = await controller.handle(httpRequest);
  res.status(httpResponse.statusCode).json(httpResponse.body);
};
