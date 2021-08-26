import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

const salt = 12;

const makeSut = () => new BcryptAdapter(salt);

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve('hash'));
  },
}));

describe('Bcrypt adapter', () => {
  test('should call Encrypt with correct value', async () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.encrypt('any_value');
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });

  test('should return hash on sucess', async () => {
    const sut = makeSut();
    const hash = await sut.encrypt('any_value');
    expect(hash).toBe('hash');
  });

  test('Throws when Encrypt throws', async () => {
    const sut = makeSut();
    // @ts-ignore: Unreachable code error
    jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const promise = sut.encrypt('any_value');
    await expect(promise).rejects.toThrow();
  });
});
