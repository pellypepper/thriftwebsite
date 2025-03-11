// auth.test.js

const verifyToken = require('../auth/auth'); 
const { clerkClient } = require('@clerk/clerk-sdk-node');


jest.mock('@clerk/clerk-sdk-node', () => ({
  clerkClient: {
    verifyToken: jest.fn(),
  },
}));

describe('verifyToken middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      headers: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();

    jest.clearAllMocks();
  });

  it('should respond with 401 if no token is provided', async () => {
    await verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next() and set req.userId if token is valid', async () => {

    const token = 'valid.token';
    req.headers.authorization = `Bearer ${token}`;


    clerkClient.verifyToken.mockResolvedValue({ sub: 'user-id-123' });

    await verifyToken(req, res, next);

    expect(clerkClient.verifyToken).toHaveBeenCalledWith(token);
    expect(req.userId).toBe('user-id-123');
    expect(next).toHaveBeenCalled();
  });

  it('should respond with 401 if token verification fails', async () => {

    const token = 'invalid.token';
    req.headers.authorization = `Bearer ${token}`;


    clerkClient.verifyToken.mockRejectedValue(new Error('Invalid token'));

    await verifyToken(req, res, next);

    expect(clerkClient.verifyToken).toHaveBeenCalledWith(token);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    expect(next).not.toHaveBeenCalled();
  });
});
