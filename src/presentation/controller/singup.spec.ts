/* eslint-disable no-unused-vars */
import { InvalidParamError } from './errors/invalid-param-error copy';
import { MissingParamError } from './errors/missing-param-error';
import { EmailValidator } from './protocols/email-validator';
import { SingUpController } from './singup';

interface StubTypes {
  sut: SingUpController,
  emailValidatorStub: EmailValidator
}

const makeSut = (): StubTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  const emailValidatorStub = new EmailValidatorStub();
  const sut = new SingUpController(emailValidatorStub);
  return {
    sut,
    emailValidatorStub,
  };
};

describe('', () => {
  test('Should return 400 when no name is provided ', () => {
    const { sut } = makeSut();

    const httpResquest = {
      body: {
        email: 'any@mail.com',
        password: 'any_password',
        passwordConfirm: 'any_password',
      },
    };

    const httpResponse = sut.handle(httpResquest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });

  test('Should return 400 when no email is provided ', () => {
    const { sut } = makeSut();

    const httpResquest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirm: 'any_password',
      },
    };

    const httpResponse = sut.handle(httpResquest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  test('Should return 400 when no password is provided ', () => {
    const { sut } = makeSut();

    const httpResquest = {
      body: {
        name: 'any_name',
        email: 'any@mail.com',
        passwordConfirm: 'any_password',
      },
    };

    const httpResponse = sut.handle(httpResquest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  test('Should return 400 when no passwordConfirm is provided ', () => {
    const { sut } = makeSut();

    const httpResquest = {
      body: {
        name: 'any_name',
        email: 'any@mail.com',
        password: 'any_password',
      },
    };

    const httpResponse = sut.handle(httpResquest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirm'));
  });

  test('Should return 400 when an invalid email is provided is provided ', () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
    const httpResquest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@mail.com',
        password: 'any_password',
        passwordConfirm: 'any_password',
      },
    };

    const httpResponse = sut.handle(httpResquest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });

  test('Should be called with correct email', () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    const httpResquest = {
      body: {
        name: 'any_name',
        email: 'any_mail@mail.com',
        password: 'any_password',
        passwordConfirm: 'any_password',
      },
    };

    sut.handle(httpResquest);

    expect(isValidSpy).toBeCalledWith('any_mail@mail.com');
  });
});
