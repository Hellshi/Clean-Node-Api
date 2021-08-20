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
  });
});
