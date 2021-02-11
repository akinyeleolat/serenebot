jest.resetAllMocks(); // make sure we do not have any mocks set from unit tests

const supertest = require('supertest');
const app = require('../../app');

describe('Test routes', () => {
  const baseUrl = '/';
  const request = supertest(app);

  it('should return a 404 error if user inputs an incorrect route', async () => {
    const response = await request.get(`${baseUrl}/ghhh`);

    expect(response.status).toEqual(404);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual('Unimplemented GET / route access');
  });
});
