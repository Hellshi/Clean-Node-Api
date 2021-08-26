import request from 'supertest';
import app from '../config/app';

describe('Cors Middleware', () => {
  test('should should enable cors', async () => {
    app.post('/test_body_parser', (req, res) => {
      res.send();
    });

    await request(app)
      .get('/test_body_parser')
      .expect('acess-control-allow-origin', '*')
      .expect('acess-control-allow-methods', '*')
      .expect('acess-control-allow-headers', '*');
  });
});
