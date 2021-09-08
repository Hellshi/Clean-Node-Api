import { mongoHelpers } from '../infra/db/mongodb/helpers/mongo-helpers';
import env from './config/env';

mongoHelpers.connect(env.mongoUrl).then(async () => {
  const app = (await import('./config/app')).default;

  app.listen(env.PORT, () => console.log(`Running on http://localhost:${env.PORT}`));
}).catch(console.error);
