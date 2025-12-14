const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../src/models/User');

beforeAll(async () => {
      const mongoURI = 'mongodb://localhost:27017/sweet-shop-test';
      await mongoose.connect(mongoURI);
});

afterAll(async () => {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
});

describe('Auth Endpoints', () => {
      beforeEach(async () => {
            await User.deleteMany({});
      });

      describe('POST /api/auth/register', () => {
            it('should register a new user successfully', async () => {
                  const res = await request(app)
                        .post('/api/auth/register')
                        .send({
                              username: 'testuser',
                              email: 'test@example.com',
                              password: 'password123'
                        });

                  expect(res.statusCode).toEqual(201);
                  expect(res.body).toHaveProperty('token');
                  expect(res.body.user).toHaveProperty('id');
                  expect(res.body.user.username).toEqual('testuser');
                  expect(res.body.user.email).toEqual('test@example.com');
            });

            it('should not register a user with an existing email', async () => {
                  await request(app)
                        .post('/api/auth/register')
                        .send({
                              username: 'user1',
                              email: 'test@example.com',
                              password: 'password123'
                        });

                  const res = await request(app)
                        .post('/api/auth/register')
                        .send({
                              username: 'user2',
                              email: 'test@example.com',
                              password: 'password456'
                        });

                  expect(res.statusCode).toEqual(400);
                  expect(res.body).toHaveProperty('message', 'User already exists');
            });

            it('should return 400 if required fields are missing', async () => {
                  const res = await request(app)
                        .post('/api/auth/register')
                        .send({
                              username: 'testuser'
                        });

                  expect(res.statusCode).toEqual(400);
            });
      });

      describe('POST /api/auth/login', () => {
            beforeEach(async () => {
                  await request(app)
                        .post('/api/auth/register')
                        .send({
                              username: 'loginuser',
                              email: 'login@example.com',
                              password: 'password123'
                        });
            });

            it('should login successfully with correct credentials', async () => {
                  const res = await request(app)
                        .post('/api/auth/login')
                        .send({
                              email: 'login@example.com',
                              password: 'password123'
                        });

                  expect(res.statusCode).toEqual(200);
                  expect(res.body).toHaveProperty('token');
                  expect(res.body.user.email).toEqual('login@example.com');
            });

            it('should return 400 for invalid credentials', async () => {
                  const res = await request(app)
                        .post('/api/auth/login')
                        .send({
                              email: 'login@example.com',
                              password: 'wrongpassword'
                        });

                  expect(res.statusCode).toEqual(400);
                  expect(res.body).toHaveProperty('message', 'Invalid credentials');
            });

            it('should return 400 if user does not exist', async () => {
                  const res = await request(app)
                        .post('/api/auth/login')
                        .send({
                              email: 'nonexistent@example.com',
                              password: 'password123'
                        });

                  expect(res.statusCode).toEqual(400);
                  expect(res.body).toHaveProperty('message', 'Invalid credentials');
            });
      });
});
