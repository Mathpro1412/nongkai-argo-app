// app.test.js
const request = require('supertest');
const { app, server } = require('./main');  // Import the app and server

// Ensure the server is started before any tests run
beforeAll(async () => {
  // You can simulate waiting for the server to be ready (if needed)
  await new Promise(resolve => setTimeout(resolve, 1000));  // Optional wait for server startup
});

// Close the server after the tests are done
afterAll(async () => {
  await server.close();
});

describe('GET /', () => {
  it('should return Hello World!', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello World!');
  });
});