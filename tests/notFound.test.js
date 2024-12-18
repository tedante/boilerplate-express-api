const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');

// test not found route
describe('Not Found Route', () => {
  it('should return a 404 status code', async () => {
    const res = await request(app).get('/api/invalid');
    expect(res.statusCode).toEqual(404);
  });
});