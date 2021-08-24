/* eslint-disable max-classes-per-file */
/* eslint-disable no-unused-vars */
import { MissingParamError, ServerError, InvalidParamError } from '../errors';
import { EmailValidator, AddAccount, AccountModel, AddAccountModel } from './sing-up-protocols';
import { SingUpController } from './singup';

interface StubTypes {
  sut: SingUpController,
  emailValidatorStub: EmailValidator,
  AddAccountStub: AddAccount
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add(email: AddAccountModel): AccountModel {
      const fakeAccount = {
        id: 'valid_id',
        email: 'valid_email',
        name: 'valid_name',
        password: 'valid_password',
      };
      return fakeAccount;
    }
  }
  return new AddAccountStub();
};

const makeSut = (): StubTypes => {
  const AddAccountStub = makeAddAccount();
  const emailValidatorStub = makeEmailValidator();
  const sut = new SingUpController(emailValidatorStub, AddAccountStub);
  return {
    sut,
    AddAccountStub,
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

  test('Should return 400 when password confirmations fails ', () => {
    const { sut } = makeSut();

    const httpResquest = {
      body: {
        name: 'any_name',
        email: 'any@mail.com',
        password: 'any_password',
        passwordConfirm: 'invalid_password',
      },
    };

    const httpResponse = sut.handle(httpResquest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirm'));
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

  test('Should call EmailValidator with correct email', () => {
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

  test('Should return 500 if emailValidator throws ', () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpResquest = {
      body: {
        name: 'any_name',
        email: 'any_mail@mail.com',
        password: 'any_password',
        passwordConfirm: 'any_password',
      },
    };

    const httpResponse = sut.handle(httpResquest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test('Should return call addAccount when valid data is provided', () => {
    const { sut, AddAccountStub } = makeSut();
    const addSpy = jest.spyOn(AddAccountStub, 'add');
    const httpResquest = {
      body: {
        name: 'any_name',
        email: 'any_mail@mail.com',
        password: 'any_password',
        passwordConfirm: 'any_password',
      },
    };

    sut.handle(httpResquest);

    expect(addSpy).toBeCalledWith({
      name: 'any_name',
      email: 'any_mail@mail.com',
      password: 'any_password',
    });
  });
});
