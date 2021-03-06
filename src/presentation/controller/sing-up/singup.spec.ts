/* eslint-disable max-classes-per-file */
/* eslint-disable no-unused-vars */
import { MissingParamError, ServerError, InvalidParamError } from '../errors';
import { badRequest, ok, serverError } from '../helpers/http-helpers';
import { EmailValidator, AddAccount, AccountModel, AddAccountModel, httpResquest, Validation } from './sing-up-protocols';
import { SingUpController } from './singup';

interface StubTypes {
  sut: SingUpController,
  emailValidatorStub: EmailValidator,
  AddAccountStub: AddAccount,
  validationSutb: Validation
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

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null;
    }
  }
  return new ValidationStub();
};

const makeSut = (): StubTypes => {
  const AddAccountStub = makeAddAccount();
  const emailValidatorStub = makeEmailValidator();
  const validationSutb = makeValidation();
  const sut = new SingUpController(emailValidatorStub, AddAccountStub, validationSutb);
  return {
    sut,
    AddAccountStub,
    emailValidatorStub,
    validationSutb,
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

  test('Should call Validation with correct value', async () => {
    const { sut, validationSutb } = makeSut();
    const validateSpy = jest.spyOn(validationSutb, 'validate');
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);

    expect(validateSpy).toBeCalledWith(httpRequest.body);
  });

  test('Should return 400 if validation returns an error', async () => {
    const { sut, validationSutb } = makeSut();
    const validateSpy = jest.spyOn(validationSutb, 'validate').mockReturnValueOnce(new MissingParamError('any_field'));

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')));
  });
});
