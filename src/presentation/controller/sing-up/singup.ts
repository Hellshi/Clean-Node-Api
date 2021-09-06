import { InvalidParamError, MissingParamError } from '../errors';
import { badRequest, serverError, ok } from '../helpers/http-helpers';
import { httpResponse, httpResquest, Controller, EmailValidator, AddAccount } from './sing-up-protocols';

export class SingUpController implements Controller {
  private readonly emailValidator: EmailValidator

  private readonly addAccount: AddAccount

  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
  }

  async handle(httpResquest: httpResquest): Promise<httpResponse> {
    try {
      const requiredFields = ['name', 'email', 'passwordConfirm', 'password'];

      for (const field of requiredFields) {
        if (!httpResquest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
      const { name, email, passwordConfirm, password } = httpResquest.body;

      if (password !== passwordConfirm) {
        return badRequest(new InvalidParamError('passwordConfirm'));
      }
      const isValid = this.emailValidator.isValid(email);

      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }

      const account = await this.addAccount.add({
        name,
        email,
        password,
      });

      return ok(account);
    } catch (error) {
      return serverError(error);
    }
  }
}
