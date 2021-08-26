import { MongoClient } from 'mongodb';
export const mongoHelpers = {
  client: null as MongoClient,

  async connect (uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri, {
      // @ts-ignore: Unreachable code error
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  },

  async disconnect(): Promise<void> {
    this.client.close()
  }
}
