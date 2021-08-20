import { MissingParamError } from './errors/missing-param-error';
import { badRequest } from './helpers/http-helpers';
import { httpResponse, httpResquest } from './protocols/http';

/* eslint-disable class-methods-use-this */
export class SingUpController {
  handle(httpResquest: httpResquest): httpResponse {
    if (!httpResquest.body.name) {
      return badRequest(new MissingParamError('name'));
    }

    if (!httpResquest.body.email) {
      return badRequest(new MissingParamError('email'));
    }
  }
}
