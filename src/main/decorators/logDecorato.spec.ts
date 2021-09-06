/* eslint-disable max-classes-per-file */
/* eslint-disable no-unused-vars */
import { serverError } from '../../presentation/controller/helpers/http-helpers';
import { Controller, httpResponse, httpResquest } from '../../presentation/controller/protocols';
import { LogControllerDecorator } from './log';
import { LogErrorRepository } from '../../data/protocols/log-error-repository';

interface sutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeLogErroRepository = (): LogErrorRepository => {
  class LogErroRepositoryStub implements LogErrorRepository {
    async log(stack: string): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }
  return new LogErroRepositoryStub();
};

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: httpResquest): Promise<httpResponse> {
      const httpResponse: httpResponse = {
        statusCode: 200,
        body: {},
      };
      return new Promise((resolve) => resolve(httpResponse));
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

describe('LogController', () => {
  test('should call controller handle', async () => {
    const { sut, controllerStub } = makeSut();

    const handleSpy = jest.spyOn(controllerStub, 'handle');
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any@mail.com',
        password: 'any_password',
        passwordConfirm: 'any_password',
      },
    };
    await sut.handle(httpRequest);
    expect(handleSpy).toBeCalledWith(httpRequest);
  });

  test('should return the same result as the decorator', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any@mail.com',
        password: 'any_password',
        passwordConfirm: 'any_password',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {},
    });
  });

  test('should call LogErrorRepository with correct error if controller returns a server error',
    async () => {
      const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
      const logSpy = jest.spyOn(logErrorRepositoryStub, 'log');
      const fakeError = new Error();
      fakeError.stack = 'any_stack';
      const error = serverError(fakeError);
      const handleSpy = jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(
        new Promise((resolve) => resolve(error)),
      );
      const httpRequest = {
        body: {
          name: 'any_name',
          email: 'any@mail.com',
          password: 'any_password',
          passwordConfirm: 'any_password',
        },
      };
      await sut.handle(httpRequest);
      expect(logSpy).toHaveBeenCalledWith('any_stack');
    });
});
