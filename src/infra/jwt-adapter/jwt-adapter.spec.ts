import jwt from 'jsonwebtoken';
import { JwtAdapter } from './jwt-adapter';

describe('JWT adapter', () => {
  test('should call sing with correct values', async () => {
    const sut = new JwtAdapter('secret');
    const JWTSpy = jest.spyOn(jwt, 'sign');
    sut.encrypt('any_id');
    expect(JWTSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret');
  });
});
