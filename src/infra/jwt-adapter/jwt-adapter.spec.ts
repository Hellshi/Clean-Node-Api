import jwt from 'jsonwebtoken';
import { JwtAdapter } from './jwt-adapter';

jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return 'any_token';
  },
}));

describe('JWT adapter', () => {
  test('should call sing with correct values', async () => {
    const sut = new JwtAdapter('secret');
    const JWTSpy = jest.spyOn(jwt, 'sign');
    await sut.encrypt('any_id');
    expect(JWTSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret');
  });

  test('should return acess token on sucess', async () => {
    const sut = new JwtAdapter('secret');

    const accessToken = await sut.encrypt('any_id');
    expect(accessToken).toBe('any_token');
  });
});
