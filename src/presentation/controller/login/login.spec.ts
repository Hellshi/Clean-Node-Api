import { MissingParamError } from '../errors';
import { badRequest } from '../helpers/http-helpers';
import { httpResquest } from '../protocols';
import { LoginController } from './login';

interface SutTypes {
  sut: LoginController
}

describe('Login Controller', () => {
  const makeSut = (): SutTypes => {
    const sut = new LoginController();
    return { sut };
  };

  test('should return 400 if no email is provided', async () => {
    const { sut } = makeSut();
    const httpResquest: httpResquest = { body: { password: 'any_password' } };
    const httpResponse = await sut.handle(httpResquest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  test('should return 400 if no password is provided', async () => {
    const { sut } = makeSut();
    const httpResquest: httpResquest = { body: { email: 'any_email@mail.com' } };
    const httpResponse = await sut.handle(httpResquest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });
});
