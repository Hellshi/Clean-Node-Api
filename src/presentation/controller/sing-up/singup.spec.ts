/* eslint-disable max-classes-per-file */
/* eslint-disable no-unused-vars */
import { MissingParamError, ServerError, InvalidParamError } from '../errors';
import { badRequest, ok, serverError } from '../helpers/http-helpers';
import { EmailValidator, AddAccount, AccountModel, AddAccountModel, httpResquest } from './sing-up-protocols';
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

const makeFakeAccount = ():AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_mail@mail.com',
  password: 'valid_password',
});

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(email: AddAccountModel): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
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

const makeFakeRequest = (): httpResquest => ({
  body: {
    name: 'any_name',
    email: 'any_mail@mail.com',
    password: 'any_password',
    passwordConfirm: 'any_password',
  },
});

describe('', () => {
  test('Should return 400 when no name is provided ', async () => {
    const { sut } = makeSut();

    const httpResquest = {
      body: {
        email: 'any@mail.com',
        password: 'any_password',
        passwordConfirm: 'any_password',
      },
    };

    const httpResponse = await sut.handle(httpResquest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')));
  });

  test('Should return 400 when no email is provided ', async () => {
    const { sut } = makeSut();

    const httpResquest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirm: 'any_password',
      },
    };

    const httpResponse = await sut.handle(httpResquest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  test('Should return 400 when no password is provided ', async () => {
    const { sut } = makeSut();

    const httpResquest = {
      body: {
        name: 'any_name',
        email: 'any@mail.com',
        passwordConfirm: 'any_password',
      },
    };

    const httpResponse = await sut.handle(httpResquest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });

  test('Should return 400 when no passwordConfirm is provided ', async () => {
    const { sut } = makeSut();

    const httpResquest = {
      body: {
        name: 'any_name',
        email: 'any@mail.com',
        password: 'any_password',
      },
    };

    const httpResponse = await sut.handle(httpResquest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirm')));
  });

  test('Should return 400 when password confirmations fails ', async () => {
    const { sut } = makeSut();

    const httpResquest = {
      body: {
        name: 'any_name',
        email: 'any@mail.com',
        password: 'any_password',
        passwordConfirm: 'invalid_password',
      },
    };

    const httpResponse = await sut.handle(httpResquest);

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirm')));
  });

  test('Should return 400 when an invalid email is provided is provided ', async () => {
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

    const httpResponse = await sut.handle(httpResquest);

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
  });

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    await sut.handle(makeFakeRequest());

    expect(isValidSpy).toBeCalledWith('any_mail@mail.com');
  });

  test('Should return 500 if emailValidator throws ', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  test('Should return call addAccount when valid data is provided', async () => {
    const { sut, AddAccountStub } = makeSut();
    const addSpy = jest.spyOn(AddAccountStub, 'add');

    await sut.handle(makeFakeRequest());

    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_mail@mail.com',
      password: 'any_password',
    });
  });

  test('Should return 500 if addAccount throws ', async () => {
    const { sut, AddAccountStub } = makeSut();
    jest.spyOn(AddAccountStub, 'add').mockImplementationOnce(async () => new Promise((resolve, reject) => reject(new Error())));

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  test('Should return 200 when valid data is provided', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(makeFakeAccount()));
  });
});
