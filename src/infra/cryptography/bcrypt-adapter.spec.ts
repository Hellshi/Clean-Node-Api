import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

const salt = 12;

const makeSut = () => new BcryptAdapter(salt);

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve('hash'));
  },
  async compare(): Promise<boolean> {
    return new Promise((resolve) => resolve(true));
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

  test('should call compare with correct value', async () => {
    const sut = makeSut();
    const compareSpy = jest.spyOn(bcrypt, 'compare');
    await sut.compare('any_value', 'any_hash');
    expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash');
  });

  test('should return true on sucess', async () => {
    const sut = makeSut();
    // @ts-ignore: Unreachable code error
    jest.spyOn(bcrypt, 'compare');
    const response = await sut.compare('any_value', 'any_hash');
    expect(response).toBe(true);
  });

  test('should return false on error', async () => {
    const sut = makeSut();
    // @ts-ignore: Unreachable code error
    jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(new Promise((resolve) => resolve(false)));
    const response = await sut.compare('any_value', 'any_hash');
    expect(response).toBe(false);
  });

  test('Throws when Encrypt compare throws', async () => {
    const sut = makeSut();
    // @ts-ignore: Unreachable code error
    jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const promise = sut.compare('any_value', 'any_hash');
    await expect(promise).rejects.toThrow();
  });
});
