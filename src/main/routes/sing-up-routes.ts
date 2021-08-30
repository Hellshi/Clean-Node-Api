import { Router } from 'express';
import { adapteRoute } from '../adapter/express-routes-adapter';
import { MakeSingUpController } from '../factories/sing-up';

export default (router: Router): void => {
  router.post('/singup', adapteRoute(MakeSingUpController()));
};
