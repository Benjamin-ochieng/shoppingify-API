/* eslint-disable consistent-return */
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../resources/users/user.model';
import { InvalidRequest } from './errorClasses';

dotenv.config();
const secret = process.env.JWT_SECRET;
const expiryDate = process.env.JWT_EXPIRE;

// eslint-disable-next-line prettier/prettier
export const createToken = (user) => {
  return jwt.sign({ id: user.id }, secret, { expiresIn: expiryDate });
};

export const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, payload) => {
      if (err) return reject(err);
      resolve(payload);
    });
  });
};

const setCookie = (token) => (res) => {
  const [header, payload, signature] = token.split('.');
  res.cookie('sessionCookie', `${payload}`, {
    secure: true,
    httpOnly: false,
    sameSite: true,
  });
  res.cookie('signedSessionCookie', `${header}.${signature}`, {
    secure: true,
    httpOnly: false,
    sameSite: true,
  });
};

export const signUp = async (req, res, next) => {
  let token;
  const usedEmailAddress = await User.findOne({ email: req.body.email });
  if (usedEmailAddress) {
    return next(
      new InvalidRequest('Already in use', {
        type: 'alreadyInUse_error',
        status: 400,
        message: 'A user with the given email already exists',
      }),
    );
  }
  try {
    const user = await User.create(req.body);
    token = createToken(user);
    setCookie(token)(res);
  } catch (error) {
    return next(error);
  }
  res
    .status(201)
    .json({ message: 'Thanks! your account has been created successfully' });
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(
      new InvalidRequest('Invalid signin', {
        type: 'signin_error',
        status: 401,
        message: 'The email and password are required',
      }),
    );
  }
  try {
    const user = await User.findOne({ email }).select('email password').exec();
    if (!user) {
      return next(
        new InvalidRequest('Invalid signup', {
          type: 'signin_error',
          status: 401,
          message: 'Invalid email or password',
        }),
      );
    }
    const validUser = await user.verifyPassword(password);
    if (!validUser) {
      return next(
        new InvalidRequest('Invalid signup', {
          type: 'signin_error',
          status: 401,
          message: 'Invalid email or password',
        }),
      );
    }
    const token = createToken(user);
    setCookie(token)(res);
    res.status(200).send({ message: 'Login success!' });
  } catch (error) {
    next(error);
  }
};

export const authorize = async (req, res, next) => {
  const UnauthorizedError = {
    message: 'Unauthorized: This request requires user authentication',
    path: `${req.originalUrl}`,
  };
  const forbiddenError = {
    message: 'Forbidden: You do not have permission for this request',
    path: `${req.originalUrl}`,
  };
  const header = req.headers.authorization;
  if (!header) return res.status(401).json(UnauthorizedError);
  const token = header.split(' ')[1];
  if (!token) return res.status(401).json(UnauthorizedError);
  let payload;
  try {
    payload = await verifyToken(token);
    if (!payload) return res.status(403).json(forbiddenError);
    const verifiedUser = await User.findOne({ _id: payload.id })
      .select('-password')
      .lean()
      .exec();
    if (!verifiedUser) return res.status(403).json(forbiddenError);
    req.user = verifiedUser;
    next();
  } catch (error) {
    return next(error);
  }
};
