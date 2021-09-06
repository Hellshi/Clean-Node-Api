import { LogErrorRepository } from '../../../../data/protocols/log-error-repository';
import { mongoHelpers } from '../helpers/mongo-helpers';

export class LogMongoRepository implements LogErrorRepository {
  async logError(stack: string): Promise<void> {
    const errosCollection = await mongoHelpers.getCollection('errors');
    await errosCollection.insertOne({
      stack,
      date: new Date(),
    });
  }
}
