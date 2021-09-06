/* eslint-disable max-classes-per-file */
/* eslint-disable no-unused-vars */
import { ok, serverError } from '../../presentation/controller/helpers/http-helpers';
import { Controller, httpResponse, httpResquest } from '../../presentation/controller/protocols';
import { LogControllerDecorator } from './log';
import { LogErrorRepository } from '../../data/protocols/log-error-repository';
import { AccountModel } from '../../domain/models/account';

interface sutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeLogErroRepository = (): LogErrorRepository => {
  class LogErroRepositoryStub implements LogErrorRepository {
    async logError(stack: string): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }
  return new LogErroRepositoryStub();
};

const makeFakeAccount = ():AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_mail@mail.com',
  password: 'valid_password',
});

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: httpResquest): Promise<httpResponse> {
      return new Promise((resolve) => resolve(ok(makeFakeAccount)));
    }
  }
  return new ControllerStub();
};

const makeSut = (): sutTypes => {
  const controllerStub = makeController();
  const logErrorRepositoryStub = makeLogErroRepository();
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub);
  return {
    sut,
    controllerStub,
    logErrorRepositoryStub,
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

const makeFakeError = ():httpResponse => {
  const fakeError = new Error();
  fakeError.stack = 'any_stack';
  return serverError(fakeError);
};

describe('LogController', () => {
  test('should call controller handle', async () => {
    const { sut, controllerStub } = makeSut();

    const handleSpy = jest.spyOn(controllerStub, 'handle');

    await sut.handle(makeFakeRequest());
    expect(handleSpy).toBeCalledWith(makeFakeRequest());
  });

  test('should return the same result as the decorator', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(makeFakeAccount));
  });

  test('should call LogErrorRepository with correct error if controller returns a server error',
    async () => {
      const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
      const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError');

      jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(
        new Promise((resolve) => resolve(makeFakeError())),
      );
      await sut.handle(makeFakeRequest());
      expect(logSpy).toHaveBeenCalledWith('any_stack');
    });
});
