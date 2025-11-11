const nock = require('nock');

const CLERK_API_URL = process.env.CLERK_API_URL || 'https://api.clerk.dev';

describe('clerk.service.verifySession', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.CLERK_SECRET_KEY = 'sk_test_dummy';
    nock.cleanAll();
  });

  afterAll(() => {
    nock.restore();
  });

  it('falls back to REST verify and returns payload on success', async () => {
    const fakeResponse = { status: 'ok', user: { id: 'user_123', email: 'test@example.com' } };

    // Intercept Clerk REST verify call
    nock(CLERK_API_URL)
      .post('/v1/sessions/verify', { session_token: 'dummy-token' })
      .matchHeader('authorization', /Bearer sk_test_dummy/)
      .reply(200, fakeResponse);

    let clerkService;
    jest.isolateModules(() => {
      clerkService = require('../clerk.service');
    });

    const res = await clerkService.verifySession('dummy-token');
    expect(res).toEqual(fakeResponse);
  });

  it('throws when missing token', async () => {
    const clerkService = require('../clerk.service');
    await expect(clerkService.verifySession(null)).rejects.toThrow('Missing Clerk session token');
  });
});
