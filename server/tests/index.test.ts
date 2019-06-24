import App from '../src/app';
import supertest from 'supertest';
import http from 'http';
import mongoose from 'mongoose';
import { get } from 'lodash';

describe('Credentials tests', () => {
  let app, server, appInstance, request;

  beforeAll(async done => {
    appInstance = new App(Number(process.env.PORT));
    app = appInstance.getApp();
    server = http.createServer(app);
    server.listen(done);
    request = supertest(app);

    mongoose.Promise = global.Promise;
  });

  afterAll(async done => {
    await mongoose.connection.db.dropDatabase(); // very careful!!!
    await mongoose.connection.close();
    server.close(done);
  });

  test('should return a successful response for GET /', async done => {
    request
      .get('/api/')
      .set('Accept', 'application/json')
      .expect(200, done);
  });

  const signupData = { email: 'test@mail.com', name: 'Test User', password: 123456 };
  let token: string;
  test('should signup user for POST /auth/signup', async done => {
    request
      .post('/api/auth/signup')
      .send(signupData)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .expect(res => {
        const { body } = res;
        expect(body.token.length).toBeGreaterThan(0);
        expect(body.refreshToken.length).toBeGreaterThan(0);
        expect(body.user.email).toEqual(signupData.email);
        expect(body.user.password).toBeUndefined();
      })
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  const wrongPass = { email: 'test@mail.com', password: 1234567 };
  test('should not authorize user POST /auth/signin', async done => {
    request
      .post('/api/auth/signin')
      .send(wrongPass)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401, done);
  });

  const signinData = { email: 'test@mail.com', password: 123456 };
  test('should signin user for POST /auth/signin', async done => {
    request
      .post('/api/auth/signin')
      .send(signinData)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(res => {
        const { body } = res;
        expect(body.token.length).toBeGreaterThan(0);
        expect(body.refreshToken.length).toBeGreaterThan(0);
        expect(body.user.email).toEqual(signupData.email);
        expect(body.user.password).toBeUndefined();
      })
      .end((err, res) => {
        token = get(res, 'body.token', '');
        if (err) return done(err);
        done();
      });
  });

  test('should retrieve data for loggedin users GET /users', async done => {
    request
      .get('/api/users')
      .send(signinData)
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(res => {
        const { body } = res;
        // console.log(body);
        // expect(body.token.length).toBeGreaterThan(0);
        // expect(body.refreshToken.length).toBeGreaterThan(0);
        // expect(body.user.email).toEqual(signupData.email);
        // // expect(res.body.user.name).toEqual(signupData.name);
        // expect(body.user.password).toBeUndefined();
      })
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});
