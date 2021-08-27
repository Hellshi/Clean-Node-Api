import request from 'supertest';
import app from '../config/app';

describe('Sing up routes', () => {
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
