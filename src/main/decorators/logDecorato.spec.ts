import { Controller, httpResponse, httpResquest } from '../../presentation/controller/protocols';
import { LogControllerDecorator } from './log';

interface sutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
}

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
  const sut = new LogControllerDecorator(controllerStub);
  return {
    sut,
    controllerStub,
  };
};

describe('LogController', () => {
  const { sut, controllerStub } = makeSut();

  const handleSpy = jest.spyOn(controllerStub, 'handle');

  test('should call controller handle', async () => {
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
});
