import { InvalidParamError, MissingParamError } from '../errors';
import { badRequest, ok, serverError, unauthorized } from '../helpers/http-helpers';
import { Authentication, httpResquest, EmailValidator, Controller, httpResponse } from './login-protocols';

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator

  private readonly authentication: Authentication

  constructor(emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator;
    this.authentication = authentication;
  }

  async handle(httpResquest: httpResquest): Promise<httpResponse> {
    try {
      const { email, password } = httpResquest.body;
      const requiredFields = ['email', 'password'];

      for (const field of requiredFields) {
        if (!httpResquest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const isValid = this.emailValidator.isValid(email);
      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }

      const Acesstoken = await this.authentication.auth(email, password);

      if (!Acesstoken) {
        return unauthorized();
      }
      return ok({ Acesstoken });
    } catch (error) {
      return serverError(error);
    }
  }
}
