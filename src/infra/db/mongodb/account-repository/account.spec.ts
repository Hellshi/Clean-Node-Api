import { mongoHelpers } from '../helpers/mongo-helpers';
import { AccountMongoRepository } from './account';

describe('Mongo Repository', () => {
  beforeAll(async () => {
    await mongoHelpers.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await mongoHelpers.disconnect();
  });

  test('account should be returned on sucess', async () => {
    const sut = new AccountMongoRepository();
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
});
