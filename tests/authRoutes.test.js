const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Role = require('../src/models/Role');
const bcrypt = require('bcryptjs');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Seed roles
  await Role.deleteMany();
  const roles = await Role.insertMany([
    { name: 'Admin' },
    { name: 'User' }
  ]);

  // Seed users
  await User.deleteMany();
  const users = [];
  const salt = await bcrypt.genSalt(10);
  let hashedPassword = await bcrypt.hash('password', salt);
  for (let i = 0; i < 10; i++) {
    users.push({
      username: `user${i + 1}`,
      password: hashedPassword,
      role: roles[i % roles.length]._id
    });
  }
  await User.insertMany(users);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Auth Routes', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'newuser',
        password: 'password',
        role: 'User'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should login an existing user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'user1',
        password: 'password'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not login with invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'user1',
        password: 'wrongpassword'
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });
});