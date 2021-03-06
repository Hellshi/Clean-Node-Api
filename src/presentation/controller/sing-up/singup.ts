import { InvalidParamError } from '../errors';
import { badRequest, serverError, ok } from '../helpers/http-helpers';
import { httpResponse, httpResquest, Controller, EmailValidator, AddAccount, Validation } from './sing-up-protocols';

export class SingUpController implements Controller {
  private readonly emailValidator: EmailValidator

  private readonly addAccount: AddAccount

  private readonly validation: Validation

  constructor(emailValidator: EmailValidator, addAccount: AddAccount, validation: Validation) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
    this.validation = validation;
  }

  async handle(httpResquest: httpResquest): Promise<httpResponse> {
    try {
      const error = this.validation.validate(httpResquest.body);
      if (error) {
        return badRequest(error);
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
