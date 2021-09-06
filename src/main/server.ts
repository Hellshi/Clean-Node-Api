import { mongoHelpers } from '../infra/db/mongodb/helpers/mongo-helpers';
import app from './config/app';
import env from './config/env';

mongoHelpers.connect(env.mongoUrl).then(async () => {
  app.listen(env.PORT, () => console.log(`Running on http://localhost:${env.PORT}`));
}).catch(console.error);
