import { Controller, httpResponse, httpResquest } from '../../presentation/controller/protocols';
import { LogControllerDecorator } from './log';

describe('LogController', () => {
  test('should call controller handle', async () => {
    class ControllerStub implements Controller {
      async handle(httpRequest: httpResquest): Promise<httpResponse> {
        const httpResponse: httpResponse = {
          statusCode: 200,
          body: {},
        };
        return new Promise((resolve) => resolve(httpResponse));
      }
    }
    const controllerStub = new ControllerStub();
    const handleSpy = jest.spyOn(controllerStub, 'handle');
    const sut = new LogControllerDecorator(controllerStub);
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
});
