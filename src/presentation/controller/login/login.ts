import { MissingParamError } from '../errors';
import { badRequest } from '../helpers/http-helpers';
import { Controller, httpResponse, httpResquest } from '../protocols';

export class LoginController implements Controller {
  async handle(httpResquest: httpResquest): Promise<httpResponse> {
    const requiredFields = ['email', 'password'];

    for (const field of requiredFields) {
      if (!httpResquest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }
  }
}
