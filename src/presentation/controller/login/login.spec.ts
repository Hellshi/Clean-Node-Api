/* eslint-disable max-classes-per-file */
import { Authentication } from '../../../domain/usecases/authentication';
import { InvalidParamError, MissingParamError } from '../errors';
import { badRequest, serverError, unauthorized } from '../helpers/http-helpers';
import { httpResquest } from '../protocols';
import { EmailValidator } from '../protocols/email-validator';
import { LoginController } from './login';

interface SutTypes {
  sut: LoginController
  EmailValidatorStub: EmailValidator
  AuthenticationStub: Authentication
}

describe('Login Controller', () => {
  const makeAuthenticationStub = (): Authentication => {
    class AuthenticationStub implements Authentication {
      async auth(email: string, password: string): Promise<string> {
        return 'any_token';
      }
    }
    return new AuthenticationStub();
  };

  const makeEmailValidatorStub = (): EmailValidator => {
    class EmailValidator implements EmailValidator {
      isValid(email: string): boolean {
        return true;
      }
    }
    return new EmailValidator();
  };

  const makeSut = (): SutTypes => {
    const AuthenticationStub = makeAuthenticationStub();
    const EmailValidatorStub = makeEmailValidatorStub();
    const sut = new LoginController(EmailValidatorStub, AuthenticationStub);
    return { sut, EmailValidatorStub, AuthenticationStub };
  };

  const makeRequest = () => ({
    body:
      {
        email: 'any_email@mail.com',
        password: 'any_password',
      },
  });

  test('should return 400 if no email is provided', async () => {
    const { sut } = makeSut();
    const httpResquest: httpResquest = { body: { password: 'any_password' } };
    const httpResponse = await sut.handle(httpResquest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  test('should return 400 if no password is provided', async () => {
    const { sut } = makeSut();
    const httpResquest: httpResquest = { body: { email: 'any_email@mail.com' } };
    const httpResponse = await sut.handle(httpResquest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });

  test('should call email validator with correct email', async () => {
    const { EmailValidatorStub, sut } = makeSut();
    const emailSpy = jest.spyOn(EmailValidatorStub, 'isValid');
    await sut.handle(makeRequest());
    expect(emailSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  test('should return 400 when invalid email is provided', async () => {
    const { EmailValidatorStub, sut } = makeSut();
    jest.spyOn(EmailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const httpResponse = await sut.handle(makeRequest());
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
  });

  test('should return 500 if emailValidator throws', async () => {
    const { EmailValidatorStub, sut } = makeSut();
    jest.spyOn(EmailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpResponse = await sut.handle(makeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('should call Authentication with correct values', async () => {
    const { AuthenticationStub, sut } = makeSut();
    const authSpy = jest.spyOn(AuthenticationStub, 'auth');
    await sut.handle(makeRequest());
    expect(authSpy).toHaveBeenCalledWith('any_email@mail.com', 'any_password');
  });

  test('should return 401 when user is unauthorized', async () => {
    const { AuthenticationStub, sut } = makeSut();
    jest.spyOn(AuthenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve) => resolve(null)));

    const httpResponse = await sut.handle(makeRequest());
    expect(httpResponse).toEqual(unauthorized());
  });
});
