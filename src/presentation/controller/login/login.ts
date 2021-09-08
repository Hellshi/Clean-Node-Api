import { MissingParamError } from '../errors';
import { badRequest } from '../helpers/http-helpers';
import { Controller, httpResponse, httpResquest } from '../protocols';

export class LoginController implements Controller {
  async handle(httpResquest: httpResquest): Promise<httpResponse> {
    return badRequest(new MissingParamError('email'));
  }
}
