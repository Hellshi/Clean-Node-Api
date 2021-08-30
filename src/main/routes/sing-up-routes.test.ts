import request from 'supertest';
import { mongoHelpers } from '../../infra/db/mongodb/helpers/mongo-helpers';
import app from '../config/app';

describe('Sing up routes', () => {
  beforeAll(async () => {
    await mongoHelpers.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await mongoHelpers.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = mongoHelpers.getCollection('accounts');
    await accountCollection.deleteMany({});
  });
  test('should return an account on sucess', async () => {
    await request(app)
      .post('/api/singup')
      .send({
        name: 'Hell',
        password: '123456',
        passwordConfirm: '123456',
        email: 'hellFrom@mail.com',
      })
      .expect(200);
  });
});
