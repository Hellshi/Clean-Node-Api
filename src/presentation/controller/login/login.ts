import { InvalidParamError, MissingParamError } from '../errors';
import { badRequest } from '../helpers/http-helpers';
import { Controller, httpResponse, httpResquest } from '../protocols';
import { EmailValidator } from '../protocols/email-validator';

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  async handle(httpResquest: httpResquest): Promise<httpResponse> {
    const requiredFields = ['email', 'password'];

    for (const field of requiredFields) {
      if (!httpResquest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }

    const isValid = this.emailValidator.isValid(httpResquest.body.email);
    if (!isValid) {
      return badRequest(new InvalidParamError('email'));
    }
  }
}
