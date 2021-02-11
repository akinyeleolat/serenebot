jest.resetAllMocks(); // make sure we do not have any mocks set from unit tests

const supertest = require('supertest');
const app = require('../../app');

describe('Test record routes', () => {
  const baseUrl = '/';
  const request = supertest(app);

  it('should return a list of records', async () => {
    const response = await request.get(`${baseUrl}v1/record`);

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual('records retrieved');
    expect(response.body).toHaveProperty('data');
  });
});
