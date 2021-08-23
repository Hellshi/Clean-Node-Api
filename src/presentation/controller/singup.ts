import { InvalidParamError, MissingParamError } from './errors';
import { badRequest, serverError } from './helpers/http-helpers';
import { httpResponse, httpResquest, Controller, EmailValidator } from './protocols';

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
      const { email, passwordConfirm, password } = httpResquest.body;

      if (password !== passwordConfirm) {
        return badRequest(new InvalidParamError('passwordConfirm'));
      }
      const isValid = this.emailValidator.isValid(email);

      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }
    } catch (error) {
      return serverError();
    }
  }
}
