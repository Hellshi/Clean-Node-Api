import { MissingParamError } from '../errors';
import { badRequest } from '../helpers/http-helpers';
import { httpResquest } from '../protocols';
import { LoginController } from './login';

describe('Login Controller', () => {
  test('should return 400 if no email is provided', async () => {
    const sut = new LoginController();
    const httpResquest: httpResquest = { body: { password: 'any_password' } };
    const httpResponse = await sut.handle(httpResquest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  test('should return 400 if no password is provided', async () => {
    const sut = new LoginController();
    const httpResquest: httpResquest = { body: { email: 'any_email' } };
    const httpResponse = await sut.handle(httpResquest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });
});
