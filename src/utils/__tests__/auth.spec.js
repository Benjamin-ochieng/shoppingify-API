import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { merge } from 'lodash';
import User from '../../resources/users/user.model';
import { createToken, verifyToken, signUp, signIn, authorize } from '../auth';
import setupReqRes from '../../../test-reqRes-setup';

dotenv.config();
const secret = process.env.JWT_SECRET;

describe('createToken', () => {
  it('returns a JWT token', async () => {
    const testUser = await User.create({
      email: '123@gmail.com',
      password: 'jan1988',
    });
    const testToken = createToken(testUser);
    expect(testToken.split('.').length).toBe(3);
    const { id } = jwt.verify(testToken, secret);
    expect(id).toBe(testUser.id);
  });
});

describe('verifyToken', () => {
  it('returns user for valid a JWT token', async () => {
    const id = '123';
    const testToken = jwt.sign({ id }, secret);
    const user = await verifyToken(testToken);
    expect(user.id).toBe(id);
  });

  describe('signUp', () => {
    it('throws an error if the singnup email is already taken', async () => {
      const { req, res, next } = setupReqRes();
      const body = {
        req: { body: { email: '123@gmail.com', password: 'jan1988' } },
      };
      merge({ req, res, next }, body);
      await User.create({
        email: '123@gmail.com',
        password: 'jan1988',
      });
      await signUp(req, res, next);
      const [err] = next.mock.calls[0];
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(err);
    });

    it('throws error if request has no email and/or password', async () => {
      const { req, res, next } = setupReqRes();
      await signUp(req, res, next);
      const [err] = next.mock.calls[0];
      expect(next).toHaveBeenCalledWith(err);
    });

    it('creates a new user and sends a token', async () => {
      const { req, res, next } = setupReqRes();
      const body = {
        req: { body: { email: '123@gmail.com', password: 'jan1988' } },
      };
      merge({ req, res, next }, body);
      await signUp(req, res, next);
      expect(res.status).toBeCalledWith(201);
      const payload = res.cookie.mock.calls[0][1];
      // extract id from base64 encoded payload
      const { id } = Buffer.from(payload, 'base64').toString();
      const { email } = await User.findOne({ id });
      expect(email).toBe('123@gmail.com');
    });
  });

  describe('signIn', () => {
    it('throws error if request has no email and/or password', async () => {
      const { req, res, next } = setupReqRes();
      await signIn(req, res, next);
      const [err] = next.mock.calls[0];
      expect(next).toHaveBeenCalledWith(err);
    });

    it('user must be real', async () => {
      const { req, res, next } = setupReqRes();
      const body = {
        req: { body: { email: '123@gmail.com', password: 'jan1988' } },
      };
      merge({ req, res, next }, body);
      await signIn(req, res, next);
      const [err] = next.mock.calls[0];
      expect(next).toHaveBeenCalledWith(err);
    });

    it('password must be valid', async () => {
      await User.create({
        email: '123@gmail.com',
        password: 'jan1988',
      });
      const { req, res, next } = setupReqRes();
      const body = {
        req: { body: { email: '123@gmail.com', password: 'jan1989' } },
      };
      merge({ req, res, next }, body);
      await signIn(req, res, next);
      const [err] = next.mock.calls[0];
      expect(next).toHaveBeenCalledWith(err);
    });

    it('creates token for valid user', async () => {
      await User.create({ email: 'user123@gmail.com', password: 'user@one' });
      const { req, res, next } = setupReqRes();
      merge(
        { req, res },
        { req: { body: { email: 'user123@gmail.com', password: 'user@one' } } },
      );
      await signIn(req, res, next);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('authorize', () => {
    it('must have a Bearer token in headers', async () => {
      const { req, res, next } = setupReqRes();
      merge({ req, res, next }, { req: { headers: { authorization: '' } } });
      await authorize(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('token must be in the correct format', async () => {
      const { req, res, next } = setupReqRes();
      merge(
        { req, res, next },
        {
          req: {
            headers: { authorization: createToken({ id: '1234' }) },
          },
        },
      );
      await authorize(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('user must be authorized', async () => {
      const { req, res, next } = setupReqRes();
      merge(
        { req, res, next },
        {
          req: {
            headers: {
              authorization: `Bearer ${createToken({
                id: mongoose.Types.ObjectId(),
              })}`,
            },
          },
        },
      );
      await authorize(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it(' passes on successful authorization', async () => {
      const user = await User.create({
        email: 'user123@gmail.com',
        password: 'user@one',
      });
      const token = createToken(user);
      const { req, res, next } = setupReqRes();
      merge(
        { req, res, next },
        { req: { headers: { authorization: `Bearer ${token}` } } },
      );
      await authorize(req, res, next);
      // expect(req.user._id.toString()).toEqual(user.id.toString());
      expect(next).toBeCalledTimes(1);
    });
  });
});
