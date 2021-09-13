import { mongoHelpers } from '../helpers/mongo-helpers';
import { AccountMongoRepository } from './account';

describe('Mongo Repository', () => {
  const makeSut = (): AccountMongoRepository => new AccountMongoRepository();

  beforeAll(async () => {
    await mongoHelpers.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await mongoHelpers.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = await mongoHelpers.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  test('account should be returned on sucess', async () => {
    const sut = makeSut();
    const account = await sut.add({
      name: 'any_name',
      password: 'any_password',
      email: 'any_email@mail.com',
    });

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe('any_name');
    expect(account.password).toBe('any_password');
    expect(account.email).toBe('any_email@mail.com');
  });

  test('should return an account on loadByEmail Sucess', async () => {
    const sut = makeSut();
    await sut.add({
      name: 'any_name',
      password: 'any_password',
      email: 'any_email@mail.com',
    });
    const account = await sut.load('any_email@mail.com');

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe('any_name');
    expect(account.password).toBe('any_password');
    expect(account.email).toBe('any_email@mail.com');
  });

  test('should return null of loadByEmail fails', async () => {
    const sut = makeSut();

    const account = await sut.load('any_email@mail.com');

    expect(account).toBeFalsy();
  });
});
