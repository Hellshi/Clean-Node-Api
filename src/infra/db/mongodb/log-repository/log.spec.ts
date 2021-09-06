import { Collection } from 'mongodb';
import { mongoHelpers } from '../helpers/mongo-helpers';
import { LogMongoRepository } from './log';

describe('Log Mongo Repository', () => {
  let errosCollection: Collection;
  beforeAll(async () => {
    await mongoHelpers.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await mongoHelpers.disconnect();
  });

  beforeEach(async () => {
    errosCollection = await mongoHelpers.getCollection('errors');
    await errosCollection.deleteMany({});
  });
  test('should create a log error on sucess', async () => {
    const sut = new LogMongoRepository();
    await sut.logError('any_error');
    const count = await errosCollection.countDocuments();
    expect(count).toBe(1);
  });
});
