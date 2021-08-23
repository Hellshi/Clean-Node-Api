import { MissingParamError } from './errors/missing-param-error';
import { badRequest } from './helpers/http-helpers';
import { Controller } from './protocols/controller';
import { httpResponse, httpResquest } from './protocols/http';

/* eslint-disable class-methods-use-this */
export class SingUpController implements Controller {
  handle(httpResquest: httpResquest): httpResponse {
    const requiredFields = ['name', 'email', 'passwordConfirm', 'password'];

    for (const field of requiredFields) {
      if (!httpResquest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }
  }
}
