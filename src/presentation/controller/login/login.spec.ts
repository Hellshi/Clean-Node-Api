import { InvalidParamError, MissingParamError } from '../errors';
import { badRequest } from '../helpers/http-helpers';
import { httpResquest } from '../protocols';
import { EmailValidator } from '../protocols/email-validator';
import { LoginController } from './login';

interface SutTypes {
  sut: LoginController
  EmailValidatorStub: EmailValidator
}

describe('Login Controller', () => {
  const makeEmailValidatorStub = (): EmailValidator => {
    class EmailValidator implements EmailValidator {
      isValid(email: string): boolean {
        return true;
      }
    }
    return new EmailValidator();
  };

  const makeSut = (): SutTypes => {
    const EmailValidatorStub = makeEmailValidatorStub();
    const sut = new LoginController(EmailValidatorStub);
    return { sut, EmailValidatorStub };
  };

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
    const httpResquest: httpResquest = {
      body:
      {
        email: 'any_email@mail.com',
        password: 'any_password',
      },
    };
    await sut.handle(httpResquest);
    expect(emailSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  test('should return 400 when invalid email is provided', async () => {
    const { EmailValidatorStub, sut } = makeSut();
    jest.spyOn(EmailValidatorStub, 'isValid').mockReturnValueOnce(false);
    const httpResquest: httpResquest = {
      body:
      {
        email: 'any_email@mail.com',
        password: 'any_password',
      },
    };
    const httpResponse = await sut.handle(httpResquest);
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
  });
});
