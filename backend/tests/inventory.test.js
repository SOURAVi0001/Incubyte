const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../src/models/User');
const Sweet = require('../src/models/Sweet');

beforeAll(async () => {
      const mongoURI = 'mongodb://localhost:27017/sweet-shop-test-inventory';
      await mongoose.connect(mongoURI);
});

afterAll(async () => {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
});

describe('Inventory Endpoints', () => {
      let adminToken;
      let userToken;
      let sweetId;

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

            const sweet = await Sweet.create({
                  name: 'Test Sweet',
                  price: 10,
                  description: 'Test Desc',
                  imageUrl: 'test.jpg',
                  quantity: 5
            });
            sweetId = sweet._id;
      });

      describe('POST /api/sweets/:id/purchase', () => {
            it('should decrease quantity when purchased', async () => {
                  const res = await request(app)
                        .post(`/api/sweets/${sweetId}/purchase`)
                        .set('Authorization', `Bearer ${userToken}`);

                  expect(res.statusCode).toEqual(200);
                  expect(res.body.quantity).toEqual(4);
            });

            it('should fail if quantity is 0', async () => {
                  await Sweet.findByIdAndUpdate(sweetId, { quantity: 0 });

                  const res = await request(app)
                        .post(`/api/sweets/${sweetId}/purchase`)
                        .set('Authorization', `Bearer ${userToken}`);

                  expect(res.statusCode).toEqual(400);
                  expect(res.body.message).toEqual('Sweet is out of stock');
            });
      });

      describe('POST /api/sweets/:id/restock', () => {
            it('should allow admin to restock', async () => {
                  const res = await request(app)
                        .post(`/api/sweets/${sweetId}/restock`)
                        .set('Authorization', `Bearer ${adminToken}`)
                        .send({ quantity: 10 });

                  expect(res.statusCode).toEqual(200);
                  expect(res.body.quantity).toEqual(15);
            });

            it('should not allow normal user to restock', async () => {
                  const res = await request(app)
                        .post(`/api/sweets/${sweetId}/restock`)
                        .set('Authorization', `Bearer ${userToken}`)
                        .send({ quantity: 10 });

                  expect(res.statusCode).toEqual(401);
            });
      });
});
