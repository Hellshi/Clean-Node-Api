import { MissingParamError } from './errors/missing-param-error';
import { SingUpController } from './singup';

describe('', () => {
  test('Should return 400 when no name is provided ', () => {
    const sut = new SingUpController();

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
    const sut = new SingUpController();

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
});
