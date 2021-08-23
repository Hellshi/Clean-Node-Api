import { InvalidParamError, MissingParamError } from './errors';
import { badRequest, serverError } from './helpers/http-helpers';
import { Controller } from './protocols/controller';
import { EmailValidator } from './protocols/email-validator';
import { httpResponse, httpResquest } from './protocols/http';

export class SingUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  handle(httpResquest: httpResquest): httpResponse {
    try {
      const requiredFields = ['name', 'email', 'passwordConfirm', 'password'];

      for (const field of requiredFields) {
        if (!httpResquest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const isValid = this.emailValidator.isValid(httpResquest.body.email);

      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }
    } catch (error) {
      return serverError();
    }
  }
}
