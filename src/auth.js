import jwt from 'jsonwebtoken';
import _ from 'lodash';
import { UserDoesNotExistError, WrongPasswordError } from './graphql/errors';
import { SECRET } from './utils/authUtils';
import { encrypt } from './utils/encrypt';
import models from './models';

export const createTokens = async (user) => {
  const createToken = jwt.sign(
    {
      user: _.pick(user, ['id', 'role']),
    },
    SECRET,
    {
      expiresIn: '20m',
    },
  );

  const createRefreshToken = jwt.sign(
    {
      user: _.pick(user, 'id'),
    },
    SECRET,
    {
      expiresIn: '7d',
    },
  );

  return Promise.all([createToken, createRefreshToken]);
};

export const refreshTokens = async (token, refreshToken) => {
  let userId;
  try {
    const { user: { id } } = jwt.verify(refreshToken, SECRET);
    userId = id;
  } catch (err) {
    return {};
  }

  const user = await models.User.findOne({ where: { id: userId }, raw: true });

  const [newToken, newRefreshToken] = await createTokens(user, SECRET);
  return {
    token: newToken,
    refreshToken: newRefreshToken,
    user,
  };
};

export const addUser = async (req, res) => {
  const token = req.headers['x-token'];
  if (token) {
    try {
      const { user } = await jwt.verify(token, SECRET);
      req.user = user;
    } catch (err) {
      const refreshToken = req.headers['x-refresh-token'];
      const newTokens = await refreshTokens(token, refreshToken);
      if (newTokens.token && newTokens.refreshToken) {
        res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
        res.set('x-token', newTokens.token);
        res.set('x-refresh-token', newTokens.refreshToken);
      }
      req.user = newTokens.user;
    }
  }
  req.next();
};

export const tryLogin = async (email, password) => {
  const user = await models.User.findOne({
    where: { email },
    raw: true,
  });
  if (!user) {
    throw new UserDoesNotExistError();
  }

  const valid = await encrypt.verify(password, user.password);
  if (!valid) {
    throw new WrongPasswordError();
  }

  const [token, refreshToken] = await createTokens(user, SECRET);

  return {
    token,
    refreshToken,
  };
};
