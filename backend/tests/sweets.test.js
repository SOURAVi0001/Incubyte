const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../src/models/User');
const Sweet = require('../src/models/Sweet');

beforeAll(async () => {
      const mongoURI = 'mongodb://localhost:27017/sweet-shop-test-sweets';
      await mongoose.connect(mongoURI);
});

afterAll(async () => {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
});

describe('Sweets Endpoints', () => {
      let adminToken;
      let userToken;

      beforeEach(async () => {
            await Sweet.deleteMany({});
            await User.deleteMany({});

            const adminUser = await User.create({
                  username: 'admin',
                  email: 'admin@example.com',
                  password: 'password123',
                  role: 'admin'
            });

            const normalUser = await User.create({
                  username: 'user',
                  email: 'user@example.com',
                  password: 'password123',
                  role: 'user'
            });

            const adminLogin = await request(app)
                  .post('/api/auth/login')
                  .send({ email: 'admin@example.com', password: 'password123' });
            adminToken = adminLogin.body.token;

            const userLogin = await request(app)
                  .post('/api/auth/login')
                  .send({ email: 'user@example.com', password: 'password123' });
            userToken = userLogin.body.token;
      });

      describe('POST /api/sweets', () => {
            it('should allow admin to create a sweet', async () => {
                  const res = await request(app)
                        .post('/api/sweets')
                        .set('Authorization', `Bearer ${adminToken}`)
                        .send({
                              name: 'Chocolate Fudge',
                              price: 5.99,
                              description: 'Rich chocolate fudge',
                              imageUrl: 'http://example.com/fudge.jpg'
                        });

                  expect(res.statusCode).toEqual(201);
                  expect(res.body.name).toEqual('Chocolate Fudge');
            });

            it('should not allow normal user to create a sweet', async () => {
                  const res = await request(app)
                        .post('/api/sweets')
                        .set('Authorization', `Bearer ${userToken}`)
                        .send({
                              name: 'Chocolate Fudge',
                              price: 5.99
                        });

                  expect(res.statusCode).toEqual(401);
            });
      });

      describe('GET /api/sweets', () => {
            it('should return all sweets', async () => {
                  await Sweet.create({
                        name: 'Sweet 1',
                        price: 10,
                        description: 'Desc 1',
                        imageUrl: 'img1.jpg',
                        category: 'Category 1'
                  });
                  await Sweet.create({
                        name: 'Sweet 2',
                        price: 20,
                        description: 'Desc 2',
                        imageUrl: 'img2.jpg',
                        category: 'Category 2'
                  });

                  const res = await request(app).get('/api/sweets');
                  expect(res.statusCode).toEqual(200);
                  expect(res.body.length).toEqual(2);
            });
      });

      describe('GET /api/sweets/search', () => {
            beforeEach(async () => {
                  await Sweet.deleteMany({});
                  await Sweet.create([
                        {
                              name: 'Chocolate Fudge',
                              price: 5.99,
                              description: 'Rich chocolate fudge',
                              imageUrl: 'img-fudge.jpg',
                              category: 'Chocolate'
                        },
                        {
                              name: 'Strawberry Tart',
                              price: 7.5,
                              description: 'Fresh tart',
                              imageUrl: 'img-tart.jpg',
                              category: 'Tart'
                        },
                        {
                              name: 'Vanilla Cupcake',
                              price: 3.0,
                              description: 'Classic cupcake',
                              imageUrl: 'img-cupcake.jpg',
                              category: 'Cupcake'
                        }
                  ]);
            });

            it('should filter sweets by name', async () => {
                  const res = await request(app)
                        .get('/api/sweets/search')
                        .query({ name: 'chocolate' });

                  expect(res.statusCode).toEqual(200);
                  expect(res.body).toHaveLength(1);
                  expect(res.body[0].name).toEqual('Chocolate Fudge');
            });

            it('should filter sweets by category', async () => {
                  const res = await request(app)
                        .get('/api/sweets/search')
                        .query({ category: 'tart' });

                  expect(res.statusCode).toEqual(200);
                  expect(res.body).toHaveLength(1);
                  expect(res.body[0].category).toEqual('Tart');
            });

            it('should filter sweets by price range', async () => {
                  const res = await request(app)
                        .get('/api/sweets/search')
                        .query({ minPrice: '4', maxPrice: '8' });

                  expect(res.statusCode).toEqual(200);
                  expect(res.body).toHaveLength(2);
                  const prices = res.body.map((sweet) => sweet.price);
                  expect(prices.every((price) => price >= 4 && price <= 8)).toBe(true);
            });

            it('should return 400 for invalid price range', async () => {
                  const res = await request(app)
                        .get('/api/sweets/search')
                        .query({ minPrice: '10', maxPrice: '5' });

                  expect(res.statusCode).toEqual(400);
                  expect(res.body.message).toMatch(/minPrice/i);
            });
      });
});
